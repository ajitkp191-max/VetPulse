import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  AdminProfile,
  OwnerProfile,
  PetRecord,
  ConsultationRecord,
  LaboratoryReport,
  ImagingRecord,
  ECGRecord,
  SurgicalProcedure,
  VaccinationRecord,
  DewormingRecord,
  Prescription,
  Appointment,
  BillingInvoice,
  InventoryDrug,
  EducationalArticle,
  AppSection,
  UserRole,
} from '../types';
import {
  initialAdminProfile,
  initialOwnerProfile,
  initialPets,
  initialConsultations,
  initialLabReports,
  initialImagingRecords,
  initialECGRecords,
  initialSurgeries,
  initialVaccinations,
  initialDewormings,
  initialPrescriptions,
  initialAppointments,
  initialInvoices,
  initialInventory,
  initialEducationArticles,
} from '../data/mockData';
import { generateAnimalRegistrationNumber } from '../utils/petRegistration';

interface AppContextType {
  currentSection: AppSection;
  setCurrentSection: (section: AppSection) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  isOwnerAuthenticated: boolean;
  setIsOwnerAuthenticated: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAndroidFrameMode: boolean;
  setIsAndroidFrameMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isFirebaseConnected: boolean;

  // Active Profile & Pet
  adminProfile: AdminProfile;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
  ownerProfile: OwnerProfile;
  updateOwnerProfile: (profile: Partial<OwnerProfile>) => void;
  selectedPetId: string;
  setSelectedPetId: (id: string) => void;
  selectedPet: PetRecord | undefined;

  // Datasets
  pets: PetRecord[];
  consultations: ConsultationRecord[];
  labReports: LaboratoryReport[];
  imagingRecords: ImagingRecord[];
  ecgRecords: ECGRecord[];
  surgeries: SurgicalProcedure[];
  vaccinations: VaccinationRecord[];
  dewormings: DewormingRecord[];
  prescriptions: Prescription[];
  appointments: Appointment[];
  invoices: BillingInvoice[];
  inventory: InventoryDrug[];
  educationArticles: EducationalArticle[];

  // Mutations
  addPet: (pet: Omit<PetRecord, 'id' | 'createdDate'>) => PetRecord;
  updatePet: (id: string, updates: Partial<PetRecord>) => void;
  deletePet: (id: string) => void;

  addConsultation: (cons: Omit<ConsultationRecord, 'id'>) => ConsultationRecord;
  addLabReport: (lab: Omit<LaboratoryReport, 'id'>) => LaboratoryReport;
  addImagingRecord: (img: Omit<ImagingRecord, 'id'>) => ImagingRecord;
  addECGRecord: (ecg: Omit<ECGRecord, 'id'>) => ECGRecord;
  addPrescription: (rx: Omit<Prescription, 'id'>) => Prescription;
  addAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addInvoice: (inv: Omit<BillingInvoice, 'id'>) => BillingInvoice;
  updateInvoiceStatus: (id: string, status: BillingInvoice['paymentStatus']) => void;
  addVaccination: (vax: Omit<VaccinationRecord, 'id'>) => VaccinationRecord;
  addDeworming: (dew: Omit<DewormingRecord, 'id'>) => DewormingRecord;
  updateInventoryStock: (id: string, newCount: number) => void;
  
  // Navigation tabs helper
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
  ownerActiveTab: string;
  setOwnerActiveTab: (tab: string) => void;

  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vet_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<AppSection>('admin');
  const [userRole, setUserRole] = useState<UserRole>('vet');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAndroidFrameMode, setIsAndroidFrameMode] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [ownerActiveTab, setOwnerActiveTab] = useState<string>('dashboard');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Initialize state from LocalStorage or mock data
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_admin_profile`);
    return saved ? JSON.parse(saved) : initialAdminProfile;
  });

  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_owner_profile`);
    return saved ? JSON.parse(saved) : initialOwnerProfile;
  });

  const [pets, setPets] = useState<PetRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pets`);
    return saved ? JSON.parse(saved) : initialPets;
  });

  const [selectedPetId, setSelectedPetId] = useState<string>('pet_1');

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_consultations`);
    return saved ? JSON.parse(saved) : initialConsultations;
  });

  const [labReports, setLabReports] = useState<LaboratoryReport[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lab_reports`);
    return saved ? JSON.parse(saved) : initialLabReports;
  });

  const [imagingRecords, setImagingRecords] = useState<ImagingRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_imaging`);
    return saved ? JSON.parse(saved) : initialImagingRecords;
  });

  const [ecgRecords, setEcgRecords] = useState<ECGRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ecg`);
    return saved ? JSON.parse(saved) : initialECGRecords;
  });

  const [surgeries] = useState<SurgicalProcedure[]>(initialSurgeries);

  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vaccinations`);
    return saved ? JSON.parse(saved) : initialVaccinations;
  });

  const [dewormings, setDewormings] = useState<DewormingRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_dewormings`);
    return saved ? JSON.parse(saved) : initialDewormings;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_prescriptions`);
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [inventory, setInventory] = useState<InventoryDrug[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [educationArticles] = useState<EducationalArticle[]>(initialEducationArticles);

  // Sync to LocalStorage as fallback cache
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_admin_profile`, JSON.stringify(adminProfile));
  }, [adminProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_owner_profile`, JSON.stringify(ownerProfile));
  }, [ownerProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_pets`, JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_consultations`, JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_lab_reports`, JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_imaging`, JSON.stringify(imagingRecords));
  }, [imagingRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ecg`, JSON.stringify(ecgRecords));
  }, [ecgRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_vaccinations`, JSON.stringify(vaccinations));
  }, [vaccinations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dewormings`, JSON.stringify(dewormings));
  }, [dewormings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_prescriptions`, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  // Real-time Firebase Firestore synchronization
  useEffect(() => {
    let unsubscribePets: (() => void) | undefined;
    let unsubscribeAppointments: (() => void) | undefined;

    const setupFirestore = async () => {
      try {
        const petsCol = collection(db, 'pets');
        const snapshot = await getDocs(petsCol);

        // Seed initial mock pets to Firestore if collection is empty
        if (snapshot.empty && initialPets.length > 0) {
          const batch = writeBatch(db);
          initialPets.forEach((pet) => {
            const petRef = doc(db, 'pets', pet.id);
            batch.set(petRef, pet);
          });
          await batch.commit();
        }

        // Listen for real-time changes to pets collection
        unsubscribePets = onSnapshot(
          petsCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedPets: PetRecord[] = [];
              snapshot.forEach((doc) => {
                loadedPets.push(doc.data() as PetRecord);
              });
              setPets(loadedPets);
            }
            setIsFirebaseConnected(true);
          },
          (error) => {
            console.warn('Firestore real-time sync warning:', error);
          }
        );

        // Listen for appointments
        const appointmentsCol = collection(db, 'appointments');
        unsubscribeAppointments = onSnapshot(
          appointmentsCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedApts: Appointment[] = [];
              snapshot.forEach((doc) => {
                loadedApts.push(doc.data() as Appointment);
              });
              setAppointments(loadedApts);
            }
          },
          (err) => console.warn('Firestore appointments sync warning:', err)
        );
      } catch (err) {
        console.warn('Firebase initialization note:', err);
      }
    };

    setupFirestore();

    return () => {
      if (unsubscribePets) unsubscribePets();
      if (unsubscribeAppointments) unsubscribeAppointments();
    };
  }, []);

  // Dark mode effect on root html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    setAdminProfile((prev) => {
      const updated = { ...prev, ...profile };
      // Sync admin profile to Firestore doc
      try {
        setDoc(doc(db, 'settings', 'adminProfile'), updated, { merge: true }).catch(() => {});
      } catch (e) {}
      return updated;
    });
    showNotification('Veterinarian clinic profile updated successfully!', 'success');
  };

  const updateOwnerProfile = (profile: Partial<OwnerProfile>) => {
    setOwnerProfile((prev) => {
      const updated = { ...prev, ...profile };
      try {
        if (updated.id) {
          setDoc(doc(db, 'owners', updated.id), updated, { merge: true }).catch(() => {});
        }
      } catch (e) {}
      return updated;
    });
    showNotification('Pet guardian profile updated successfully!', 'success');
  };

  const addPet = (petData: Omit<PetRecord, 'id' | 'createdDate'>): PetRecord => {
    const newId = `pet_${Date.now()}`;
    const autoRegNumber = petData.identificationNumber || generateAnimalRegistrationNumber(petData.species);
    const newPet: PetRecord = {
      ...petData,
      identificationNumber: autoRegNumber,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setPets((prev) => [newPet, ...prev]);
    setSelectedPetId(newId);

    // Persist to Google Firebase Firestore
    try {
      setDoc(doc(db, 'pets', newId), newPet).catch((err) => {
        console.warn('Firebase setDoc warning:', err);
      });
    } catch (e) {}

    showNotification(`Animal profile registered for ${newPet.name} with ID ${autoRegNumber}!`, 'success');
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<PetRecord>) => {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          try {
            setDoc(doc(db, 'pets', id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return p;
      })
    );
    showNotification('Patient medical record updated!', 'success');
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    if (selectedPetId === id) {
      const remaining = pets.filter((p) => p.id !== id);
      if (remaining.length > 0) setSelectedPetId(remaining[0].id);
    }

    // Delete from Google Firebase Firestore
    try {
      deleteDoc(doc(db, 'pets', id)).catch((err) => {
        console.warn('Firebase deleteDoc warning:', err);
      });
    } catch (e) {}

    showNotification('Patient registered record permanently deleted.', 'info');
  };

  const addConsultation = (consData: Omit<ConsultationRecord, 'id'>): ConsultationRecord => {
    const newRecord: ConsultationRecord = {
      ...consData,
      id: `cons_${Date.now()}`,
    };
    setConsultations((prev) => [newRecord, ...prev]);
    try {
      setDoc(doc(db, 'consultations', newRecord.id), newRecord).catch(() => {});
    } catch (e) {}
    showNotification(`Consultation saved for ${newRecord.petName}!`, 'success');
    return newRecord;
  };

  const addLabReport = (labData: Omit<LaboratoryReport, 'id'>): LaboratoryReport => {
    const newReport: LaboratoryReport = {
      ...labData,
      id: `lab_${Date.now()}`,
    };
    setLabReports((prev) => [newReport, ...prev]);
    try {
      setDoc(doc(db, 'labReports', newReport.id), newReport).catch(() => {});
    } catch (e) {}
    showNotification(`Laboratory report saved for ${newReport.petName}!`, 'success');
    return newReport;
  };

  const addImagingRecord = (imgData: Omit<ImagingRecord, 'id'>): ImagingRecord => {
    const newImg: ImagingRecord = {
      ...imgData,
      id: `img_${Date.now()}`,
    };
    setImagingRecords((prev) => [newImg, ...prev]);
    try {
      setDoc(doc(db, 'imagingRecords', newImg.id), newImg).catch(() => {});
    } catch (e) {}
    showNotification(`${newImg.modality} saved with findings!`, 'success');
    return newImg;
  };

  const addECGRecord = (ecgData: Omit<ECGRecord, 'id'>): ECGRecord => {
    const newEcg: ECGRecord = {
      ...ecgData,
      id: `ecg_${Date.now()}`,
    };
    setEcgRecords((prev) => [newEcg, ...prev]);
    try {
      setDoc(doc(db, 'ecgRecords', newEcg.id), newEcg).catch(() => {});
    } catch (e) {}
    showNotification('Veterinary ECG tracing saved with AI assessment!', 'success');
    return newEcg;
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>): Prescription => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx_${Date.now()}`,
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    try {
      setDoc(doc(db, 'prescriptions', newRx.id), newRx).catch(() => {});
    } catch (e) {}
    showNotification(`Prescription ${newRx.prescriptionNumber} generated successfully!`, 'success');
    return newRx;
  };

  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    try {
      setDoc(doc(db, 'appointments', newApt.id), newApt).catch(() => {});
    } catch (e) {}
    showNotification(`Appointment scheduled for ${newApt.date} at ${newApt.time}!`, 'success');
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, status };
          try {
            setDoc(doc(db, 'appointments', id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return a;
      })
    );
    showNotification(`Appointment status updated to ${status}`, 'info');
  };

  const addInvoice = (invData: Omit<BillingInvoice, 'id'>): BillingInvoice => {
    const newInv: BillingInvoice = {
      ...invData,
      id: `inv_${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
    try {
      setDoc(doc(db, 'invoices', newInv.id), newInv).catch(() => {});
    } catch (e) {}
    showNotification(`Invoice ${newInv.invoiceNumber} created!`, 'success');
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: BillingInvoice['paymentStatus']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, paymentStatus: status };
          try {
            setDoc(doc(db, 'invoices', id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return inv;
      })
    );
    showNotification(`Invoice marked as ${status}`, 'info');
  };

  const addVaccination = (vaxData: Omit<VaccinationRecord, 'id'>): VaccinationRecord => {
    const newVax: VaccinationRecord = {
      ...vaxData,
      id: `vax_${Date.now()}`,
    };
    setVaccinations((prev) => [newVax, ...prev]);
    try {
      setDoc(doc(db, 'vaccinations', newVax.id), newVax).catch(() => {});
    } catch (e) {}
    showNotification(`Vaccine recorded: ${newVax.vaccineName}`, 'success');
    return newVax;
  };

  const addDeworming = (dewData: Omit<DewormingRecord, 'id'>): DewormingRecord => {
    const newDew: DewormingRecord = {
      ...dewData,
      id: `dew_${Date.now()}`,
    };
    setDewormings((prev) => [newDew, ...prev]);
    try {
      setDoc(doc(db, 'dewormings', newDew.id), newDew).catch(() => {});
    } catch (e) {}
    showNotification(`Deworming recorded: ${newDew.drugUsed}`, 'success');
    return newDew;
  };

  const updateInventoryStock = (id: string, newCount: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, stockCount: Math.max(0, newCount) };
          try {
            setDoc(doc(db, 'inventory', id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return item;
      })
    );
    showNotification('Inventory stock updated', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        userRole,
        setUserRole,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        isOwnerAuthenticated,
        setIsOwnerAuthenticated,
        isDarkMode,
        setIsDarkMode,
        isAndroidFrameMode,
        setIsAndroidFrameMode,
        isFirebaseConnected,

        adminProfile,
        updateAdminProfile,
        ownerProfile,
        updateOwnerProfile,
        selectedPetId,
        setSelectedPetId,
        selectedPet,

        pets,
        consultations,
        labReports,
        imagingRecords,
        ecgRecords,
        surgeries,
        vaccinations,
        dewormings,
        prescriptions,
        appointments,
        invoices,
        inventory,
        educationArticles,

        addPet,
        updatePet,
        deletePet,
        addConsultation,
        addLabReport,
        addImagingRecord,
        addECGRecord,
        addPrescription,
        addAppointment,
        updateAppointmentStatus,
        addInvoice,
        updateInvoiceStatus,
        addVaccination,
        addDeworming,
        updateInventoryStock,

        adminActiveTab,
        setAdminActiveTab,
        ownerActiveTab,
        setOwnerActiveTab,

        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

