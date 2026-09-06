import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  ClinicRegistration,
  DoctorAccount,
  ClinicAccount,
  OwnerAccount,
  PlatformAuditLog,
  SupportTicket,
  SupportMessage,
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
  initialClinicRegistrations,
  initialDoctors,
  initialClinics,
  initialOwnerAccounts,
  initialAuditLogs,
  initialSupportTickets,
} from '../data/mockData';
import { generateAnimalRegistrationNumber } from '../utils/petRegistration';

interface AppContextType {
  currentSection: AppSection;
  setCurrentSection: (section: AppSection) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  isSuperAdminAuthenticated: boolean;
  setIsSuperAdminAuthenticated: (val: boolean) => void;
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
  ownerPets: PetRecord[];
  consultations: ConsultationRecord[];
  ownerConsultations: ConsultationRecord[];
  labReports: LaboratoryReport[];
  ownerLabReports: LaboratoryReport[];
  imagingRecords: ImagingRecord[];
  ownerImagingRecords: ImagingRecord[];
  ecgRecords: ECGRecord[];
  surgeries: SurgicalProcedure[];
  vaccinations: VaccinationRecord[];
  ownerVaccinations: VaccinationRecord[];
  dewormings: DewormingRecord[];
  ownerDewormings: DewormingRecord[];
  prescriptions: Prescription[];
  ownerPrescriptions: Prescription[];
  appointments: Appointment[];
  ownerAppointments: Appointment[];
  invoices: BillingInvoice[];
  ownerInvoices: BillingInvoice[];
  inventory: InventoryDrug[];
  educationArticles: EducationalArticle[];
  clinicRegistrations: ClinicRegistration[];
  activePendingRegistration: ClinicRegistration | null;
  setActivePendingRegistration: (reg: ClinicRegistration | null) => void;
  isPetOwnedByCurrentOwner: (pet: PetRecord) => boolean;

  // Multi-tier Role Stores
  doctors: DoctorAccount[];
  clinics: ClinicAccount[];
  ownerAccounts: OwnerAccount[];
  auditLogs: PlatformAuditLog[];
  supportTickets: SupportTicket[];

  // Support System Queries & Chat
  addSupportTicket: (
    ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessageText: string
  ) => SupportTicket;
  sendSupportMessage: (
    ticketId: string,
    messageText: string,
    senderRole: 'doctor' | 'admin' | 'super_admin',
    senderName: string,
    senderId?: string
  ) => void;
  updateSupportTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Super Admin & Clinic Management Mutations
  approveDoctor: (id: string, notes?: string) => void;
  rejectDoctor: (id: string, reason?: string) => void;
  suspendDoctor: (id: string) => void;
  reactivateDoctor: (id: string) => void;
  updateDoctorRole: (id: string, newRole: UserRole) => void;
  updateDoctor: (id: string, updates: Partial<DoctorAccount>) => void;
  deleteDoctor: (id: string) => void;
  addClinic: (clinic: ClinicAccount) => void;
  updateClinic: (id: string, updates: Partial<ClinicAccount>) => void;
  deleteClinic: (id: string) => void;
  updateClinicStatus: (id: string, status: ClinicAccount['status']) => void;
  updateOwner: (id: string, updates: Partial<OwnerAccount>) => void;
  deleteOwner: (id: string) => void;
  updateOwnerStatus: (id: string, status: OwnerAccount['status']) => void;
  logAuditEvent: (
    action: string,
    targetType: PlatformAuditLog['targetType'],
    targetId?: string,
    targetName?: string,
    description?: string,
    details?: Record<string, any>
  ) => void;

  // Clinic & Vet Registration Mutations
  registerClinic: (details: Omit<ClinicRegistration, 'id' | 'status' | 'registeredAt'>) => Promise<ClinicRegistration>;
  approveClinicRegistration: (id: string, reviewerNotes?: string) => Promise<void>;
  rejectClinicRegistration: (id: string, reason?: string) => Promise<void>;
  checkRegistrationStatus: (emailOrId: string) => Promise<ClinicRegistration | null>;

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
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addInvoice: (inv: Omit<BillingInvoice, 'id'>) => BillingInvoice;
  updateInvoiceStatus: (id: string, status: BillingInvoice['paymentStatus']) => void;
  addVaccination: (vax: Omit<VaccinationRecord, 'id'>) => VaccinationRecord;
  addDeworming: (dew: Omit<DewormingRecord, 'id'>) => DewormingRecord;
  updateInventoryStock: (id: string, newCount: number) => void;
  
  // Navigation tabs helper
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ownerActiveTab: string;
  setOwnerActiveTab: (tab: string) => void;
  isAdminSearchOpen: boolean;
  setIsAdminSearchOpen: (open: boolean) => void;
  isPetSearchOpen: boolean;
  setIsPetSearchOpen: (open: boolean) => void;

  // Notifications & Auth
  logout: (targetSection?: AppSection) => void;
  notification: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vet_app_state_v4';

// Patient names and demo IDs to permanently purge
const PURGED_PATIENT_NAMES = ['max', 'luna', 'bella', 'thunder'];
const PURGED_PATIENT_IDS = ['pet_1', 'pet_2', 'pet_3', 'pet_4', 'pet_5'];

const isPurgedPatient = (name?: string, id?: string) => {
  if (id && PURGED_PATIENT_IDS.includes(id)) return true;
  if (name) {
    const lower = name.trim().toLowerCase();
    return PURGED_PATIENT_NAMES.some(
      (purged) => lower === purged || lower.startsWith(`${purged} `) || lower.endsWith(` ${purged}`)
    );
  }
  return false;
};

// Demo accounts (admin and owner) to permanently purge
const PURGED_DEMO_EMAILS = [
  'dr.sarah@vetcare.com',
  'dr.sarah@apexvetcare.com',
  'dr.robert@greenwoodvet.com',
  'demo@vetcare.com',
  'owner@demo.com',
];
const PURGED_DEMO_IDS = [
  'admin_1',
  'reg_sarah_jenkins',
  'reg_robert_hayes',
  'google_owner_ajit',
];

const isPurgedAccount = (email?: string, id?: string) => {
  if (id && PURGED_DEMO_IDS.includes(id)) return true;
  if (email) {
    const lower = email.trim().toLowerCase();
    return PURGED_DEMO_EMAILS.includes(lower);
  }
  return false;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<AppSection>('admin');
  const [userRole, setUserRole] = useState<UserRole>('vet');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_super_admin_auth`);
      if (saved === 'false') return false;
      if (saved === 'true') return true;
    } catch (e) {}
    // Default to true so active super admin sessions are seamlessly preserved until explicit sign-out
    return true;
  });
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAndroidFrameMode, setIsAndroidFrameMode] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [ownerActiveTab, setOwnerActiveTab] = useState<string>('dashboard');
  const [isAdminSearchOpen, setIsAdminSearchOpen] = useState<boolean>(false);
  const [isPetSearchOpen, setIsPetSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAdminSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Initialize state from LocalStorage or mock data
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_admin_profile`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!isPurgedAccount(parsed.email, parsed.id)) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialAdminProfile;
  });

  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_owner_profile`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!isPurgedAccount(parsed.email, parsed.id)) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialOwnerProfile;
  });

  const [pets, setPets] = useState<PetRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pets`);
    const initial = saved ? JSON.parse(saved) : initialPets;
    return Array.isArray(initial)
      ? initial.filter((p: PetRecord) => !isPurgedPatient(p.name, p.id))
      : [];
  });

  const [selectedPetId, setSelectedPetId] = useState<string>('');

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_consultations`);
    const initial = saved ? JSON.parse(saved) : initialConsultations;
    return Array.isArray(initial)
      ? initial.filter((c: ConsultationRecord) => !isPurgedPatient(c.petName, c.petId))
      : [];
  });

  const [labReports, setLabReports] = useState<LaboratoryReport[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lab_reports`);
    const initial = saved ? JSON.parse(saved) : initialLabReports;
    return Array.isArray(initial)
      ? initial.filter((l: LaboratoryReport) => !isPurgedPatient(l.petName, l.petId))
      : [];
  });

  const [imagingRecords, setImagingRecords] = useState<ImagingRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_imaging`);
    const initial = saved ? JSON.parse(saved) : initialImagingRecords;
    if (!Array.isArray(initial)) return [];
    return initial
      .filter((i: ImagingRecord) => !isPurgedPatient(i.petName, i.petId))
      .map((i: any) => ({
        ...i,
        findings: Array.isArray(i.findings)
          ? i.findings
          : typeof i.findings === 'string' && i.findings
            ? [i.findings]
            : [],
      }));
  });

  const [ecgRecords, setEcgRecords] = useState<ECGRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ecg`);
    const initial = saved ? JSON.parse(saved) : initialECGRecords;
    return Array.isArray(initial)
      ? initial.filter((e: ECGRecord) => !isPurgedPatient(e.petName, e.petId))
      : [];
  });

  const [surgeries] = useState<SurgicalProcedure[]>(initialSurgeries);

  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vaccinations`);
    const initial = saved ? JSON.parse(saved) : initialVaccinations;
    return Array.isArray(initial)
      ? initial.filter((v: VaccinationRecord) => !isPurgedPatient(v.petName, v.petId))
      : [];
  });

  const [dewormings, setDewormings] = useState<DewormingRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_dewormings`);
    const initial = saved ? JSON.parse(saved) : initialDewormings;
    return Array.isArray(initial)
      ? initial.filter((d: DewormingRecord) => !isPurgedPatient(d.petName, d.petId))
      : [];
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_prescriptions`);
    const initial = saved ? JSON.parse(saved) : initialPrescriptions;
    return Array.isArray(initial)
      ? initial.filter((p: Prescription) => !isPurgedPatient(p.petName, p.petId))
      : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    const initial = saved ? JSON.parse(saved) : initialAppointments;
    return Array.isArray(initial)
      ? initial.filter((a: Appointment) => !isPurgedPatient(a.petName, a.petId))
      : [];
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
    const initial = saved ? JSON.parse(saved) : initialInvoices;
    return Array.isArray(initial)
      ? initial.filter((inv: BillingInvoice) => !isPurgedPatient(inv.petName, inv.petId))
      : [];
  });

  const [inventory, setInventory] = useState<InventoryDrug[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [clinicRegistrations, setClinicRegistrations] = useState<ClinicRegistration[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clinic_registrations`);
    const initial = saved ? JSON.parse(saved) : initialClinicRegistrations;
    return Array.isArray(initial)
      ? initial.filter((r: ClinicRegistration) => !isPurgedAccount(r.email, r.id))
      : [];
  });

  const [activePendingRegistration, setActivePendingRegistration] = useState<ClinicRegistration | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_pending_reg`);
    return saved ? JSON.parse(saved) : null;
  });

  const [doctors, setDoctors] = useState<DoctorAccount[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_doctors`);
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [clinics, setClinics] = useState<ClinicAccount[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clinics`);
    return saved ? JSON.parse(saved) : initialClinics;
  });

  const [ownerAccounts, setOwnerAccounts] = useState<OwnerAccount[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_owner_accounts`);
    return saved ? JSON.parse(saved) : initialOwnerAccounts;
  });

  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_support_tickets`);
    return saved ? JSON.parse(saved) : initialSupportTickets;
  });

  const [educationArticles] = useState<EducationalArticle[]>(initialEducationArticles);

  // Sync multi-tier stores to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_doctors`, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clinics`, JSON.stringify(clinics));
  }, [clinics]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_owner_accounts`, JSON.stringify(ownerAccounts));
  }, [ownerAccounts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_support_tickets`, JSON.stringify(supportTickets));
  }, [supportTickets]);

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

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clinic_registrations`, JSON.stringify(clinicRegistrations));
  }, [clinicRegistrations]);

  useEffect(() => {
    if (activePendingRegistration) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_pending_reg`, JSON.stringify(activePendingRegistration));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_active_pending_reg`);
    }
  }, [activePendingRegistration]);

  // Real-time Firebase Firestore synchronization
  useEffect(() => {
    let unsubscribePets: (() => void) | undefined;
    let unsubscribeAppointments: (() => void) | undefined;
    let unsubscribeRegistrations: (() => void) | undefined;

    const setupFirestore = async () => {
      try {
        const petsCol = collection(db, 'pets');
        const snapshotCol = await getDocs(petsCol);

        // Purge any existing records of Max, Luna, Bella, Thunder and demo accounts from Firestore
        const collectionsToPurge = [
          'pets',
          'consultations',
          'labReports',
          'imagingRecords',
          'ecgRecords',
          'vaccinations',
          'dewormings',
          'prescriptions',
          'appointments',
          'invoices',
          'clinic_registrations',
          'owners',
          'adminProfiles'
        ];

        for (const colName of collectionsToPurge) {
          try {
            const colRef = collection(db, colName);
            const colSnap = await getDocs(colRef);
            colSnap.forEach((d) => {
              const data = d.data() as any;
              if (
                isPurgedPatient(data?.name || data?.petName, data?.id || data?.petId) ||
                PURGED_PATIENT_IDS.includes(d.id) ||
                isPurgedAccount(data?.email || data?.loginEmail, data?.id || d.id)
              ) {
                deleteDoc(doc(db, colName, d.id)).catch(() => {});
              }
            });
          } catch (e) {}
        }

        // Seed initial clinic registrations to Firestore if collection is empty
        const regCol = collection(db, 'clinic_registrations');
        const regSnapshot = await getDocs(regCol);
        if (regSnapshot.empty && initialClinicRegistrations.length > 0) {
          const regBatch = writeBatch(db);
          initialClinicRegistrations.forEach((reg) => {
            const regRef = doc(db, 'clinic_registrations', reg.id);
            regBatch.set(regRef, reg);
          });
          await regBatch.commit();
        }

        // Listen for real-time changes to pets collection
        unsubscribePets = onSnapshot(
          petsCol,
          (snapshot) => {
            const loadedPets: PetRecord[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as PetRecord;
              if (!isPurgedPatient(data?.name, data?.id || d.id)) {
                loadedPets.push(data);
              }
            });
            setPets(loadedPets);
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
            const loadedApts: Appointment[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Appointment;
              if (!isPurgedPatient(data?.petName, data?.petId)) {
                loadedApts.push(data);
              }
            });
            setAppointments(loadedApts);
          },
          (err) => console.warn('Firestore appointments sync warning:', err)
        );

        // Listen for clinic registrations in real time
        unsubscribeRegistrations = onSnapshot(
          regCol,
          (snapshot) => {
            const loadedRegs: ClinicRegistration[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as ClinicRegistration;
              if (!isPurgedAccount(data?.email, data?.id || docSnap.id)) {
                loadedRegs.push(data);
              }
            });
            setClinicRegistrations(loadedRegs);
          },
          (err) => console.warn('Firestore clinic registration sync warning:', err)
        );
      } catch (err) {
        console.warn('Firebase initialization note:', err);
      }
    };

    setupFirestore();

    return () => {
      if (unsubscribePets) unsubscribePets();
      if (unsubscribeAppointments) unsubscribeAppointments();
      if (unsubscribeRegistrations) unsubscribeRegistrations();
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

  const isPetOwnedByCurrentOwner = useCallback(
    (pet: PetRecord): boolean => {
      if (!ownerProfile) return false;
      // 1. Direct ownerId match
      if (pet.ownerId && ownerProfile.id && pet.ownerId === ownerProfile.id) return true;
      // 2. Case-insensitive email match
      if (
        ownerProfile.email &&
        pet.ownerEmail &&
        ownerProfile.email.trim().toLowerCase() === pet.ownerEmail.trim().toLowerCase()
      ) {
        return true;
      }
      // 3. Digit-normalized phone match
      if (ownerProfile.phone && pet.ownerPhone) {
        const cleanProfilePhone = ownerProfile.phone.replace(/\D/g, '');
        const cleanPetPhone = pet.ownerPhone.replace(/\D/g, '');
        if (cleanProfilePhone && cleanPetPhone && cleanProfilePhone === cleanPetPhone) return true;
      }
      // 4. Exact trimmed name match fallback
      if (
        ownerProfile.name &&
        pet.ownerName &&
        ownerProfile.name.trim().toLowerCase() === pet.ownerName.trim().toLowerCase()
      ) {
        return true;
      }
      return false;
    },
    [ownerProfile]
  );

  const ownerPets = useMemo(() => {
    if (!ownerProfile) return [];
    return pets.filter((p) => isPetOwnedByCurrentOwner(p));
  }, [pets, ownerProfile, isPetOwnedByCurrentOwner]);

  const ownerPetIdSet = useMemo(() => new Set(ownerPets.map((p) => p.id)), [ownerPets]);

  const selectedPet = useMemo(() => {
    if (currentSection === 'owner') {
      return ownerPets.find((p) => p.id === selectedPetId) || ownerPets[0] || undefined;
    }
    return pets.find((p) => p.id === selectedPetId) || pets[0] || undefined;
  }, [currentSection, ownerPets, pets, selectedPetId]);

  const ownerAppointments = useMemo(() => {
    if (!ownerProfile) return [];
    return appointments.filter(
      (a) =>
        ownerPetIdSet.has(a.petId) ||
        (ownerProfile.email && a.ownerEmail && a.ownerEmail.trim().toLowerCase() === ownerProfile.email.trim().toLowerCase()) ||
        (ownerProfile.phone && a.ownerPhone && a.ownerPhone.replace(/\D/g, '') === ownerProfile.phone?.replace(/\D/g, '')) ||
        (ownerProfile.name && a.ownerName && a.ownerName.trim().toLowerCase() === ownerProfile.name.trim().toLowerCase())
    );
  }, [appointments, ownerProfile, ownerPetIdSet]);

  const ownerVaccinations = useMemo(() => {
    return vaccinations.filter((v) => ownerPetIdSet.has(v.petId));
  }, [vaccinations, ownerPetIdSet]);

  const ownerDewormings = useMemo(() => {
    return dewormings.filter((d) => ownerPetIdSet.has(d.petId));
  }, [dewormings, ownerPetIdSet]);

  const ownerPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => ownerPetIdSet.has(p.petId));
  }, [prescriptions, ownerPetIdSet]);

  const ownerConsultations = useMemo(() => {
    return consultations.filter((c) => ownerPetIdSet.has(c.petId));
  }, [consultations, ownerPetIdSet]);

  const ownerLabReports = useMemo(() => {
    return labReports.filter((l) => ownerPetIdSet.has(l.petId));
  }, [labReports, ownerPetIdSet]);

  const ownerImagingRecords = useMemo(() => {
    return imagingRecords.filter((i) => ownerPetIdSet.has(i.petId));
  }, [imagingRecords, ownerPetIdSet]);

  const ownerInvoices = useMemo(() => {
    return invoices.filter((inv) => ownerPetIdSet.has(inv.petId));
  }, [invoices, ownerPetIdSet]);

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
    
    // Associate owner information automatically if in owner portal session
    const effectiveOwnerId =
      petData.ownerId ||
      (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.id : undefined);
    const effectiveOwnerName =
      petData.ownerName ||
      (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.name : 'Pet Guardian');
    const effectiveOwnerEmail =
      petData.ownerEmail ||
      (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.email : '');
    const effectiveOwnerPhone =
      petData.ownerPhone ||
      (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.phone : '');
    const effectiveOwnerAddress =
      petData.ownerAddress ||
      (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.address : '');

    const newPet: PetRecord = {
      ...petData,
      ownerId: effectiveOwnerId,
      ownerName: effectiveOwnerName,
      ownerEmail: effectiveOwnerEmail,
      ownerPhone: effectiveOwnerPhone,
      ownerAddress: effectiveOwnerAddress,
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
    setConsultations((prev) => prev.filter((c) => c.petId !== id));
    setLabReports((prev) => prev.filter((l) => l.petId !== id));
    setImagingRecords((prev) => prev.filter((i) => i.petId !== id));
    setEcgRecords((prev) => prev.filter((e) => e.petId !== id));
    setVaccinations((prev) => prev.filter((v) => v.petId !== id));
    setDewormings((prev) => prev.filter((d) => d.petId !== id));
    setPrescriptions((prev) => prev.filter((p) => p.petId !== id));
    setAppointments((prev) => prev.filter((a) => a.petId !== id));
    setInvoices((prev) => prev.filter((inv) => inv.petId !== id));

    if (selectedPetId === id) {
      const remaining = pets.filter((p) => p.id !== id);
      setSelectedPetId(remaining.length > 0 ? remaining[0].id : '');
    }

    // Cascade delete from Google Firebase Firestore
    try {
      deleteDoc(doc(db, 'pets', id)).catch(() => {});
      const relatedCollections = [
        'consultations',
        'labReports',
        'imagingRecords',
        'ecgRecords',
        'vaccinations',
        'dewormings',
        'prescriptions',
        'appointments',
        'invoices'
      ];
      relatedCollections.forEach(async (colName) => {
        try {
          const snap = await getDocs(collection(db, colName));
          snap.forEach((d) => {
            const data = d.data() as any;
            if (data?.petId === id) {
              deleteDoc(doc(db, colName, d.id)).catch(() => {});
            }
          });
        } catch (e) {}
      });
    } catch (e) {}

    showNotification('Patient profile and all medical history permanently deleted.', 'info');
  };

  const addConsultation = (consData: Omit<ConsultationRecord, 'id'>): ConsultationRecord => {
    const newRecord: ConsultationRecord = {
      ...consData,
      veterinarianName: consData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: consData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
      clinicName: consData.clinicName || adminProfile.clinicName || 'Metropolitan Veterinary Referral Hospital',
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
      veterinarianName: labData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: labData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
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
    const findings = Array.isArray(imgData.findings)
      ? imgData.findings
      : typeof (imgData as any).findings === 'string' && (imgData as any).findings
        ? [(imgData as any).findings]
        : [];
    const newImg: ImagingRecord = {
      ...imgData,
      findings,
      veterinarianName: imgData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: imgData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
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
      veterinarianName: rxData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: rxData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
      clinicName: rxData.clinicName || adminProfile.clinicName || 'Apex Central Veterinary Hospital',
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
    const effectiveOwnerName = aptData.ownerName || (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.name : 'Pet Guardian') || 'Pet Guardian';
    const effectiveOwnerEmail = aptData.ownerEmail || (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.email : '') || '';
    const effectiveOwnerPhone = aptData.ownerPhone || (currentSection === 'owner' || isOwnerAuthenticated ? ownerProfile?.phone : '') || '';

    const newApt: Appointment = {
      ...aptData,
      veterinarianName: aptData.veterinarianName || (currentSection === 'doctor' || currentSection === 'admin' ? adminProfile.name : 'Dr. Sarah Jenkins, BVSc'),
      doctorRegNumber: aptData.doctorRegNumber || (currentSection === 'doctor' || currentSection === 'admin' ? adminProfile.registrationNumber : 'VET-REG-2024-8891'),
      ownerName: effectiveOwnerName,
      ownerEmail: effectiveOwnerEmail,
      ownerPhone: effectiveOwnerPhone,
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

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          try {
            setDoc(doc(db, 'appointments', id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return a;
      })
    );
    showNotification(`Appointment updated successfully`, 'success');
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
      veterinarianName: vaxData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: vaxData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
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
      veterinarianName: dewData.veterinarianName || adminProfile.name || 'Attending Veterinary Clinician',
      vetRegNumber: dewData.vetRegNumber || adminProfile.registrationNumber || 'VET-REG-2024-8891',
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

  const registerClinic = async (details: Omit<ClinicRegistration, 'id' | 'status' | 'registeredAt'>): Promise<ClinicRegistration> => {
    const newId = `reg_${Date.now()}`;
    const newReg: ClinicRegistration = {
      ...details,
      id: newId,
      status: 'pending',
      registeredAt: new Date().toISOString(),
      notes: 'Submitted for 24-hour verification review on Firebase.',
    };

    setClinicRegistrations((prev) => [newReg, ...prev]);
    setActivePendingRegistration(newReg);

    try {
      await setDoc(doc(db, 'clinic_registrations', newId), newReg);
      showNotification('New clinic registered & notified to Firebase! Verification under 24-hour review.', 'info');
    } catch (err) {
      console.warn('Firestore clinic registration sync warning:', err);
    }

    return newReg;
  };

  const approveClinicRegistration = async (id: string, reviewerNotes = 'Verified against State Veterinary Board Registry & Firebase approval') => {
    const now = new Date().toISOString();
    let approvedReg: ClinicRegistration | undefined;

    setClinicRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          approvedReg = {
            ...r,
            status: 'approved',
            verifiedAt: now,
            reviewedBy: 'Medical Licensing Board / Firebase Admin',
            notes: reviewerNotes,
          };
          return approvedReg;
        }
        return r;
      })
    );

    if (activePendingRegistration && activePendingRegistration.id === id && approvedReg) {
      setActivePendingRegistration(approvedReg);
    }

    try {
      await setDoc(
        doc(db, 'clinic_registrations', id),
        {
          status: 'approved',
          verifiedAt: now,
          reviewedBy: 'Medical Licensing Board / Firebase Admin',
          notes: reviewerNotes,
        },
        { merge: true }
      );
      showNotification('Clinic registration approved & access granted on Firebase!', 'success');
    } catch (err) {
      console.warn('Firestore approval sync warning:', err);
    }
  };

  const rejectClinicRegistration = async (id: string, reason = 'Credentials or license could not be verified') => {
    const now = new Date().toISOString();
    let rejectedReg: ClinicRegistration | undefined;

    setClinicRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          rejectedReg = {
            ...r,
            status: 'rejected',
            verifiedAt: now,
            reviewedBy: 'Medical Licensing Board / Firebase Admin',
            notes: reason,
          };
          return rejectedReg;
        }
        return r;
      })
    );

    if (activePendingRegistration && activePendingRegistration.id === id && rejectedReg) {
      setActivePendingRegistration(rejectedReg);
    }

    try {
      await setDoc(
        doc(db, 'clinic_registrations', id),
        {
          status: 'rejected',
          verifiedAt: now,
          reviewedBy: 'Medical Licensing Board / Firebase Admin',
          notes: reason,
        },
        { merge: true }
      );
      showNotification('Clinic registration rejected', 'warning');
    } catch (err) {
      console.warn('Firestore rejection sync warning:', err);
    }
  };

  const logAuditEvent = (
    action: string,
    targetType: PlatformAuditLog['targetType'],
    targetId?: string,
    targetName?: string,
    description?: string,
    details?: Record<string, any>
  ) => {
    const newLog: PlatformAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'ajitkp191@gmail.com',
      actorRole: userRole || 'super_admin',
      action,
      targetType,
      targetId,
      targetName,
      description: description || `Action ${action} performed on ${targetType}`,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const approveDoctor = (id: string, notes?: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          logAuditEvent('approve_doctor', 'doctor', doc.id, doc.fullName, `Doctor ${doc.fullName} verified and approved. ${notes || ''}`);
          return { ...doc, status: 'active', verifiedAt: new Date().toISOString() };
        }
        return doc;
      })
    );
    showNotification('Doctor account verified and approved', 'success');
  };

  const rejectDoctor = (id: string, reason?: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          logAuditEvent('reject_doctor', 'doctor', doc.id, doc.fullName, `Doctor ${doc.fullName} registration rejected: ${reason || 'Criteria not met'}`);
          return { ...doc, status: 'rejected' };
        }
        return doc;
      })
    );
    showNotification('Doctor registration rejected', 'warning');
  };

  const suspendDoctor = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          logAuditEvent('suspend_doctor', 'doctor', doc.id, doc.fullName, `Doctor ${doc.fullName} suspended`);
          return { ...doc, status: 'suspended' };
        }
        return doc;
      })
    );
    showNotification('Doctor account suspended', 'info');
  };

  const reactivateDoctor = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          logAuditEvent('reactivate_doctor', 'doctor', doc.id, doc.fullName, `Doctor ${doc.fullName} reactivated`);
          return { ...doc, status: 'active' };
        }
        return doc;
      })
    );
    showNotification('Doctor account reactivated', 'success');
  };

  const updateDoctorRole = (id: string, newRole: UserRole) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          logAuditEvent('update_role', 'doctor', doc.id, doc.fullName, `Doctor ${doc.fullName} role modified to ${newRole}`);
          return { ...doc, role: newRole };
        }
        return doc;
      })
    );
    showNotification(`Doctor role updated to ${newRole}`, 'success');
  };

  const updateDoctor = (id: string, updates: Partial<DoctorAccount>) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, ...updates };
          logAuditEvent('update_doctor_details', 'doctor', d.id, d.name, `Doctor details updated for ${d.name}`);
          return updated;
        }
        return d;
      })
    );
    showNotification('Doctor information updated successfully', 'success');
  };

  const deleteDoctor = (id: string) => {
    const target = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    logAuditEvent('delete_doctor', 'doctor', id, target?.name, `Doctor ${target?.name || id} removed from platform.`);
    try {
      deleteDoc(doc(db, 'doctors', id)).catch(() => {});
      deleteDoc(doc(db, 'adminProfiles', id)).catch(() => {});
      deleteDoc(doc(db, 'clinic_registrations', id)).catch(() => {});
    } catch (e) {
      console.warn('Firestore doctor deletion note:', e);
    }
    showNotification(`Doctor ${target?.name || id} removed permanently`, 'info');
  };

  const addClinic = (clinic: ClinicAccount) => {
    setClinics((prev) => [clinic, ...prev]);
    logAuditEvent('create_clinic', 'clinic', clinic.id, clinic.name, `New clinic tenant provisioned: ${clinic.name}`);
    showNotification(`Clinic ${clinic.name} registered`, 'success');
  };

  const updateClinic = (id: string, updates: Partial<ClinicAccount>) => {
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          logAuditEvent('update_clinic_details', 'clinic', c.id, c.name, `Clinic details updated for ${c.name}`);
          return updated;
        }
        return c;
      })
    );
    showNotification('Clinic details updated successfully', 'success');
  };

  const deleteClinic = (id: string) => {
    const target = clinics.find((c) => c.id === id);
    setClinics((prev) => prev.filter((c) => c.id !== id));
    logAuditEvent('delete_clinic', 'clinic', id, target?.name, `Clinic ${target?.name || id} removed from platform.`);
    showNotification('Clinic removed permanently', 'info');
  };

  const updateClinicStatus = (id: string, status: ClinicAccount['status']) => {
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          logAuditEvent('update_clinic_status', 'clinic', c.id, c.name, `Clinic status changed to ${status}`);
          return { ...c, status };
        }
        return c;
      })
    );
    showNotification(`Clinic status set to ${status}`, 'info');
  };

  const updateOwner = (id: string, updates: Partial<OwnerAccount>) => {
    setOwnerAccounts((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, ...updates };
          logAuditEvent('update_owner_details', 'owner', o.id, o.name, `Pet Owner details updated for ${o.name}`);
          return updated;
        }
        return o;
      })
    );
    showNotification('Pet Owner information updated successfully', 'success');
  };

  const deleteOwner = (id: string) => {
    const target = ownerAccounts.find((o) => o.id === id);
    setOwnerAccounts((prev) => prev.filter((o) => o.id !== id));
    logAuditEvent('delete_owner', 'owner', id, target?.name, `Pet Owner ${target?.name || id} removed from platform.`);
    showNotification('Pet Owner account removed permanently', 'info');
  };

  const updateOwnerStatus = (id: string, status: OwnerAccount['status']) => {
    setOwnerAccounts((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          logAuditEvent('update_owner_status', 'owner', o.id, o.name, `Pet owner status set to ${status}`);
          return { ...o, status };
        }
        return o;
      })
    );
    showNotification(`Owner account updated`, 'info');
  };

  // Support Tickets & Helpdesk Queries
  const addSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessageText: string
  ): SupportTicket => {
    const now = new Date().toISOString();
    const id = `tkt_${Date.now()}`;
    const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      senderRole: ticketData.senderRole,
      senderName: ticketData.senderName,
      senderId: ticketData.senderId,
      text: initialMessageText,
      timestamp: now,
    };

    const newTicket: SupportTicket = {
      ...ticketData,
      id,
      ticketNumber,
      createdAt: now,
      updatedAt: now,
      status: 'Open',
      messages: [initialMessage],
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    try {
      setDoc(doc(db, 'support_tickets', newTicket.id), newTicket).catch(() => {});
    } catch (e) {}

    logAuditEvent(
      'create_support_ticket',
      'system',
      newTicket.id,
      newTicket.subject,
      `Support ticket ${ticketNumber} raised by ${newTicket.senderName} (${newTicket.senderRole})`
    );

    showNotification(`Query ticket #${ticketNumber} sent to Super Admin!`, 'success');
    return newTicket;
  };

  const sendSupportMessage = (
    ticketId: string,
    messageText: string,
    senderRole: 'doctor' | 'admin' | 'super_admin',
    senderName: string,
    senderId?: string
  ) => {
    const now = new Date().toISOString();
    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}`,
      senderRole,
      senderName,
      senderId,
      text: messageText,
      timestamp: now,
    };

    setSupportTickets((prev) =>
      prev.map((tkt) => {
        if (tkt.id === ticketId) {
          const updated = {
            ...tkt,
            updatedAt: now,
            messages: [...tkt.messages, newMsg],
          };
          try {
            setDoc(doc(db, 'support_tickets', ticketId), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return tkt;
      })
    );

    showNotification('Reply sent successfully', 'success');
  };

  const updateSupportTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets((prev) =>
      prev.map((tkt) => {
        if (tkt.id === ticketId) {
          const updated = {
            ...tkt,
            status,
            updatedAt: new Date().toISOString(),
          };
          try {
            setDoc(doc(db, 'support_tickets', ticketId), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return tkt;
      })
    );
    showNotification(`Ticket status updated to ${status}`, 'info');
  };

  const checkRegistrationStatus = async (emailOrId: string): Promise<ClinicRegistration | null> => {
    const query = emailOrId.toLowerCase().trim();
    const found = clinicRegistrations.find(
      (r) =>
        r.id === emailOrId ||
        (r.email && r.email.toLowerCase() === query) ||
        (r.veterinarianIdNumber && r.veterinarianIdNumber.toLowerCase() === query)
    );
    return found || null;
  };

  const logout = (targetSection?: AppSection) => {
    setIsAdminAuthenticated(false);
    setIsSuperAdminAuthenticated(false);
    setIsOwnerAuthenticated(false);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_super_admin_auth`, 'false');
    } catch (e) {}
    logAuditEvent(
      'USER_LOGOUT',
      'system',
      undefined,
      'User Session',
      `User signed out from ${currentSection} workspace session`
    );
    if (targetSection) {
      setCurrentSection(targetSection);
      if (targetSection === 'doctor' || targetSection === 'admin') {
        setUserRole('doctor');
      } else if (targetSection === 'owner') {
        setUserRole('owner');
      }
    }
    showNotification('You have been securely signed out.', 'info');
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
        isSuperAdminAuthenticated,
        setIsSuperAdminAuthenticated,
        isOwnerAuthenticated,
        setIsOwnerAuthenticated,
        logout,
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
        ownerPets,
        consultations,
        ownerConsultations,
        labReports,
        ownerLabReports,
        imagingRecords,
        ownerImagingRecords,
        ecgRecords,
        surgeries,
        vaccinations,
        ownerVaccinations,
        dewormings,
        ownerDewormings,
        prescriptions,
        ownerPrescriptions,
        appointments,
        ownerAppointments,
        invoices,
        ownerInvoices,
        inventory,
        educationArticles,
        clinicRegistrations,
        activePendingRegistration,
        setActivePendingRegistration,
        isPetOwnedByCurrentOwner,

        doctors,
        clinics,
        ownerAccounts,
        auditLogs,
        supportTickets,

        addSupportTicket,
        sendSupportMessage,
        updateSupportTicketStatus,

        approveDoctor,
        rejectDoctor,
        suspendDoctor,
        reactivateDoctor,
        updateDoctorRole,
        updateDoctor,
        deleteDoctor,
        addClinic,
        updateClinic,
        deleteClinic,
        updateClinicStatus,
        updateOwner,
        deleteOwner,
        updateOwnerStatus,
        logAuditEvent,

        registerClinic,
        approveClinicRegistration,
        rejectClinicRegistration,
        checkRegistrationStatus,

        addPet,
        updatePet,
        deletePet,
        addConsultation,
        addLabReport,
        addImagingRecord,
        addECGRecord,
        addPrescription,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        addInvoice,
        updateInvoiceStatus,
        addVaccination,
        addDeworming,
        updateInventoryStock,

        adminActiveTab,
        setAdminActiveTab,
        activeTab: adminActiveTab,
        setActiveTab: setAdminActiveTab,
        ownerActiveTab,
        setOwnerActiveTab,
        isAdminSearchOpen,
        setIsAdminSearchOpen,
        isPetSearchOpen,
        setIsPetSearchOpen,

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

