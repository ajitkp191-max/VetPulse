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
  NavigationHistoryItem,
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
  addDoctor: (doctor: Partial<DoctorAccount> & { name: string; email: string; registrationNumber: string }) => Promise<DoctorAccount>;
  approveDoctor: (id: string, notes?: string) => Promise<void>;
  rejectDoctor: (id: string, reason?: string) => Promise<void>;
  suspendDoctor: (id: string) => Promise<void>;
  reactivateDoctor: (id: string) => Promise<void>;
  updateDoctorRole: (id: string, newRole: UserRole) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<DoctorAccount>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
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
  
  // Navigation tabs & History Controls
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

  // Essential Forward/Backward & History Controls
  navigationHistory: NavigationHistoryItem[];
  historyIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
  navigateTo: (section: AppSection, tab: string, customLabel?: string, petId?: string) => void;
  jumpToHistoryIndex: (index: number) => void;
  currentBreadcrumbs: { label: string; section?: AppSection; tab?: string; onClick?: () => void }[];
  refreshData: () => Promise<void>;
  isRefreshing: boolean;

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

  // Navigation History State
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryItem[]>([
    {
      id: 'nav_init',
      section: 'admin',
      tab: 'dashboard',
      label: 'Doctor Dashboard',
      timestamp: Date.now(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isNavigatingRef = React.useRef(false);

  // Human-readable labels resolver
  const getTabLabel = useCallback((section: AppSection, tab: string): string => {
    if (section === 'super_admin') {
      switch (tab) {
        case 'overview': return 'Super Admin Overview';
        case 'doctors': return 'Doctor Registry & Verifications';
        case 'owners': return 'Pet Owner Registry';
        case 'pets': return 'Patient Records (HQ)';
        case 'clinics': return 'Clinic Accounts';
        case 'analytics': return 'Platform Analytics';
        case 'helpdesk': return 'Doctor Helpdesk';
        case 'audit': return 'Security Audit Ledger';
        case 'settings': return 'System Settings';
        default: return 'Super Admin HQ';
      }
    }
    if (section === 'doctor' || section === 'admin') {
      switch (tab) {
        case 'dashboard': return 'Doctor Dashboard';
        case 'patients': return 'Patients & Medical Records';
        case 'history-taking': return 'Anamnesis & History Taking';
        case 'appointments': return 'Appointments Schedule';
        case 'consultation': return 'Clinical SOAP Consultation';
        case 'laboratory': return 'Laboratory (Biochem/CBC)';
        case 'imaging': return 'Imaging (X-Ray/USG)';
        case 'ecg': return 'ECG Diagnostics';
        case 'multiparameter-diagnostic': return 'AI Diagnostic Fusion';
        case 'surgery': return 'Surgery Library';
        case 'vaccination': return 'Vaccination Tracker';
        case 'deworming': return 'Deworming Tracker';
        case 'prescription': return 'Prescription Generator (Rx)';
        case 'inventory': return 'Inventory & Pharmacy';
        case 'billing': return 'Billing & Invoicing';
        case 'reports': return 'Reports & Analytics';
        case 'support': return 'Platform Support Desk';
        case 'settings': return 'Clinic Settings';
        default: return 'Doctor Station';
      }
    }
    // owner
    switch (tab) {
      case 'dashboard': return 'Pet Parent Home';
      case 'my-pets': return 'My Companions';
      case 'book-appointment': return 'Book Vet Visit';
      case 'prescriptions': return 'Prescriptions (Rx)';
      case 'medical-records': return 'Medical Records Archive';
      case 'vaccine-tracker': return 'Vaccines & Parasite Schedule';
      case 'notifications': return 'Alerts & Reminders';
      case 'passport': return 'Health Passport';
      case 'symptom-checker': return 'AI Symptom Checker';
      case 'emergency-first-aid':
      case 'emergency': return 'Emergency SOS & First Aid';
      case 'owner-profile': return 'Owner Profile';
      default: return 'Pet Owner Portal';
    }
  }, []);

  // Sync state transitions to history stack
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    const currentTab = currentSection === 'owner' ? ownerActiveTab : currentSection === 'super_admin' ? 'overview' : adminActiveTab;
    const label = getTabLabel(currentSection, currentTab);

    setNavigationHistory((prev) => {
      const currentEntry = prev[historyIndex];
      if (
        currentEntry &&
        currentEntry.section === currentSection &&
        currentEntry.tab === currentTab
      ) {
        return prev;
      }
      const newEntry: NavigationHistoryItem = {
        id: `nav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        section: currentSection,
        tab: currentTab,
        label,
        timestamp: Date.now(),
      };
      const updated = [...prev.slice(0, historyIndex + 1), newEntry].slice(-35);
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  }, [currentSection, adminActiveTab, ownerActiveTab, getTabLabel]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationHistory.length - 1;

  const applyNavigationEntry = useCallback((entry: NavigationHistoryItem) => {
    isNavigatingRef.current = true;
    if (entry.section !== currentSection) {
      setCurrentSection(entry.section);
      if (entry.section === 'super_admin') setUserRole('super_admin');
      else if (entry.section === 'owner') setUserRole('owner');
      else setUserRole('doctor');
    }
    if (entry.section === 'owner') {
      setOwnerActiveTab(entry.tab);
    } else if (entry.section === 'admin' || entry.section === 'doctor') {
      setAdminActiveTab(entry.tab);
    }
  }, [currentSection]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetEntry = navigationHistory[targetIndex];
      if (targetEntry) {
        setHistoryIndex(targetIndex);
        applyNavigationEntry(targetEntry);
      }
    }
  }, [historyIndex, navigationHistory, applyNavigationEntry]);

  const goForward = useCallback(() => {
    if (historyIndex < navigationHistory.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetEntry = navigationHistory[targetIndex];
      if (targetEntry) {
        setHistoryIndex(targetIndex);
        applyNavigationEntry(targetEntry);
      }
    }
  }, [historyIndex, navigationHistory, applyNavigationEntry]);

  const navigateTo = useCallback((section: AppSection, tab: string, customLabel?: string, petId?: string) => {
    const label = customLabel || getTabLabel(section, tab);
    isNavigatingRef.current = true;
    setCurrentSection(section);
    if (section === 'super_admin') {
      setUserRole('super_admin');
    } else if (section === 'owner') {
      setUserRole('owner');
      setOwnerActiveTab(tab);
    } else {
      setUserRole('doctor');
      setAdminActiveTab(tab);
    }

    const newEntry: NavigationHistoryItem = {
      id: `nav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      section,
      tab,
      label,
      petId,
      timestamp: Date.now(),
    };

    setNavigationHistory((prev) => {
      const updated = [...prev.slice(0, historyIndex + 1), newEntry].slice(-35);
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  }, [historyIndex, getTabLabel]);

  const goHome = useCallback(() => {
    if (currentSection === 'super_admin') {
      navigateTo('super_admin', 'overview', 'Super Admin Overview');
    } else if (currentSection === 'owner') {
      navigateTo('owner', 'dashboard', 'Pet Parent Home');
    } else {
      navigateTo('admin', 'dashboard', 'Doctor Dashboard');
    }
  }, [currentSection, navigateTo]);

  const jumpToHistoryIndex = useCallback((index: number) => {
    if (index >= 0 && index < navigationHistory.length) {
      const targetEntry = navigationHistory[index];
      if (targetEntry) {
        setHistoryIndex(index);
        applyNavigationEntry(targetEntry);
      }
    }
  }, [navigationHistory, applyNavigationEntry]);

  // Keyboard shortcut listener for Navigation (Alt+Left, Alt+Right, Alt+H, Alt+R, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAdminSearchOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      if (isInput) return;

      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
      } else if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        goHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack, goForward, goHome]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (setNotification) {
        setNotification({ message: 'All records synchronized & up to date with cloud', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      }
    } finally {
      setIsRefreshing(false);
    }
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

  // Reconnect and sync all clinicRegistrations into the doctors list automatically
  useEffect(() => {
    if (!clinicRegistrations || clinicRegistrations.length === 0) return;

    setDoctors((prevDoctors) => {
      let updated = [...prevDoctors];
      let hasChanges = false;

      for (const reg of clinicRegistrations) {
        const docId = `doc_${reg.id}`;
        const exists = updated.some(
          (d) =>
            d.id === docId ||
            (d.email && reg.email && d.email.toLowerCase() === reg.email.toLowerCase()) ||
            (d.registrationNumber && reg.veterinarianIdNumber && d.registrationNumber === reg.veterinarianIdNumber)
        );

        if (!exists) {
          const newDoc: DoctorAccount = {
            id: docId,
            name: reg.name,
            qualification: reg.qualification || 'BVSc & AH / DVM',
            registrationNumber: reg.veterinarianIdNumber || `REG-${Math.floor(100000 + Math.random() * 900000)}`,
            specialization: reg.specialization || 'General Veterinary Medicine & Surgery',
            clinicId: `clinic_${reg.id}`,
            clinicName: reg.clinicName || 'Affiliated Veterinary Clinic',
            clinicAddress: reg.clinicAddress || 'Address on file',
            contactNumber: reg.contactNumber || '',
            email: reg.email ? reg.email.trim() : `doctor_${reg.id}@vetcare.portal`,
            consultationTimings: reg.consultationTimings || 'Mon - Sat: 09:00 AM - 07:00 PM',
            status: reg.status === 'rejected' ? 'suspended' : 'active',
            verificationStatus: reg.status === 'approved' ? 'verified' : reg.status === 'rejected' ? 'rejected' : 'pending',
            patientsCount: 0,
            consultationsCount: 0,
            role: 'doctor',
            registeredDate: reg.registeredAt ? reg.registeredAt.split('T')[0] : new Date().toISOString().split('T')[0],
            bio: `Doctor registered via onboarding portal for ${reg.clinicName}.`,
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
          };
          updated = [newDoc, ...updated];
          hasChanges = true;
        } else {
          updated = updated.map((d) => {
            if (
              d.id === docId ||
              (d.email && reg.email && d.email.toLowerCase() === reg.email.toLowerCase()) ||
              (d.registrationNumber && reg.veterinarianIdNumber && d.registrationNumber === reg.veterinarianIdNumber)
            ) {
              const targetStatus = reg.status === 'approved' ? 'verified' : reg.status === 'rejected' ? 'rejected' : 'pending';
              if (d.verificationStatus !== targetStatus) {
                hasChanges = true;
                return {
                  ...d,
                  verificationStatus: targetStatus,
                  status: reg.status === 'rejected' ? 'suspended' : 'active',
                  name: reg.name || d.name,
                  clinicName: reg.clinicName || d.clinicName,
                  email: reg.email || d.email,
                };
              }
            }
            return d;
          });
        }
      }

      return hasChanges ? updated : prevDoctors;
    });
  }, [clinicRegistrations]);

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
    let unsubscribeDoctors: (() => void) | undefined;
    let unsubscribeClinics: (() => void) | undefined;
    let unsubscribeOwnerAccounts: (() => void) | undefined;
    let unsubscribeSupportTickets: (() => void) | undefined;

    const setupFirestore = () => {
      try {
        const petsCol = collection(db, 'pets');
        const appointmentsCol = collection(db, 'appointments');
        const regCol = collection(db, 'clinic_registrations');
        const doctorsCol = collection(db, 'doctors');
        const clinicsCol = collection(db, 'clinics');
        const ownersCol = collection(db, 'owner_accounts');
        const ticketsCol = collection(db, 'support_tickets');

        // Listen for real-time changes to pets collection immediately
        unsubscribePets = onSnapshot(
          petsCol,
          (snapshot) => {
            const loadedPets: PetRecord[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as PetRecord;
              if (!isPurgedPatient(data?.name, data?.id || d.id)) {
                loadedPets.push({ ...data, id: data.id || d.id });
              }
            });
            if (loadedPets.length > 0) {
              setPets(loadedPets);
            }
            setIsFirebaseConnected(true);
          },
          (error) => {
            // Operate seamlessly in offline mode
            setIsFirebaseConnected(false);
          }
        );

        // Listen for appointments
        unsubscribeAppointments = onSnapshot(
          appointmentsCol,
          (snapshot) => {
            const loadedApts: Appointment[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Appointment;
              if (!isPurgedPatient(data?.petName, data?.petId)) {
                loadedApts.push({ ...data, id: data.id || d.id });
              }
            });
            if (loadedApts.length > 0) {
              setAppointments(loadedApts);
            }
          },
          () => {}
        );

        // Listen for clinic registrations in real time
        unsubscribeRegistrations = onSnapshot(
          regCol,
          (snapshot) => {
            const loadedRegs: ClinicRegistration[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as ClinicRegistration;
              if (!isPurgedAccount(data?.email, data?.id || docSnap.id)) {
                loadedRegs.push({ ...data, id: data.id || docSnap.id });
              }
            });
            if (loadedRegs.length > 0) {
              setClinicRegistrations(loadedRegs);
            }
          },
          () => {}
        );

        // Background non-blocking initial seeds and maintenance
        setTimeout(async () => {
          try {
            // Seed initial clinic registrations if empty
            const regSnapshot = await getDocs(regCol).catch(() => null);
            if (regSnapshot && regSnapshot.empty && initialClinicRegistrations.length > 0) {
              const regBatch = writeBatch(db);
              initialClinicRegistrations.forEach((reg) => {
                const regRef = doc(db, 'clinic_registrations', reg.id);
                regBatch.set(regRef, reg);
              });
              await regBatch.commit().catch(() => {});
            }

            // Seed initial doctors if empty
            const doctorsSnapshot = await getDocs(doctorsCol).catch(() => null);
            if (doctorsSnapshot && doctorsSnapshot.empty && initialDoctors.length > 0) {
              const docBatch = writeBatch(db);
              initialDoctors.forEach((docItem) => {
                const dRef = doc(db, 'doctors', docItem.id);
                docBatch.set(dRef, docItem);
              });
              await docBatch.commit().catch(() => {});
            }

            // Seed initial clinics if empty
            const clinicsSnapshot = await getDocs(clinicsCol).catch(() => null);
            if (clinicsSnapshot && clinicsSnapshot.empty && initialClinics.length > 0) {
              const clinicBatch = writeBatch(db);
              initialClinics.forEach((clinicItem) => {
                const cRef = doc(db, 'clinics', clinicItem.id);
                clinicBatch.set(cRef, clinicItem);
              });
              await clinicBatch.commit().catch(() => {});
            }

            // Seed initial owner accounts if empty
            const ownersSnapshot = await getDocs(ownersCol).catch(() => null);
            if (ownersSnapshot && ownersSnapshot.empty && initialOwnerAccounts.length > 0) {
              const ownerBatch = writeBatch(db);
              initialOwnerAccounts.forEach((ownerItem) => {
                const oRef = doc(db, 'owner_accounts', ownerItem.id);
                ownerBatch.set(oRef, ownerItem);
              });
              await ownerBatch.commit().catch(() => {});
            }

            // Seed initial support tickets if empty
            const ticketsSnapshot = await getDocs(ticketsCol).catch(() => null);
            if (ticketsSnapshot && ticketsSnapshot.empty && initialSupportTickets.length > 0) {
              const ticketBatch = writeBatch(db);
              initialSupportTickets.forEach((ticketItem) => {
                const tRef = doc(db, 'support_tickets', ticketItem.id);
                ticketBatch.set(tRef, ticketItem);
              });
              await ticketBatch.commit().catch(() => {});
            }
          } catch (e) {}
        }, 1200);

        // Listen for doctors in real time
        unsubscribeDoctors = onSnapshot(
          doctorsCol,
          (snapshot) => {
            const loadedDocs: DoctorAccount[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as DoctorAccount;
              if (!isPurgedAccount(data?.email, data?.id || docSnap.id)) {
                loadedDocs.push({
                  ...data,
                  id: data.id || docSnap.id,
                  name: data.name || 'Dr. Veterinary Clinician',
                  email: data.email || '',
                  registrationNumber: data.registrationNumber || 'VET-PENDING',
                  qualification: data.qualification || 'BVSc & AH / DVM',
                  specialization: data.specialization || 'General Veterinary Practice',
                  clinicName: data.clinicName || 'Veterinary Hospital',
                  contactNumber: data.contactNumber || '',
                  status: data.status || 'active',
                  verificationStatus: data.verificationStatus || (data.status === 'active' ? 'verified' : 'pending'),
                  patientsCount: typeof data.patientsCount === 'number' ? data.patientsCount : 0,
                  consultationsCount: typeof data.consultationsCount === 'number' ? data.consultationsCount : 0,
                  role: data.role || 'doctor',
                  registeredDate: data.registeredDate || new Date().toISOString().split('T')[0],
                });
              }
            });
            if (loadedDocs.length > 0) {
              setDoctors(loadedDocs);
            }
          },
          (err) => console.warn('Firestore doctors sync warning:', err)
        );

        // Listen for clinics in real time
        unsubscribeClinics = onSnapshot(
          clinicsCol,
          (snapshot) => {
            const loadedClinics: ClinicAccount[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as ClinicAccount;
              if (!isPurgedAccount(data?.email || data?.adminEmail, data?.id || docSnap.id)) {
                loadedClinics.push({
                  ...data,
                  id: data.id || docSnap.id,
                  name: data.name || 'Veterinary Clinic',
                  status: data.status || 'active',
                  doctorsCount: typeof data.doctorsCount === 'number' ? data.doctorsCount : 0,
                  patientsCount: typeof data.patientsCount === 'number' ? data.patientsCount : 0,
                  appointmentsCount: typeof data.appointmentsCount === 'number' ? data.appointmentsCount : 0,
                });
              }
            });
            if (loadedClinics.length > 0) {
              setClinics(loadedClinics);
            }
          },
          (err) => console.warn('Firestore clinics sync warning:', err)
        );

        // Listen for owner accounts in real time
        unsubscribeOwnerAccounts = onSnapshot(
          ownersCol,
          (snapshot) => {
            const loadedOwners: OwnerAccount[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as OwnerAccount;
              if (!isPurgedAccount(data?.email, data?.id || docSnap.id)) {
                loadedOwners.push({
                  ...data,
                  id: data.id || docSnap.id,
                  name: data.name || 'Pet Owner',
                  email: data.email || '',
                  phone: data.phone || '',
                  address: data.address || '',
                  registeredPetsCount: typeof data.registeredPetsCount === 'number' ? data.registeredPetsCount : 0,
                  status: data.status || 'active',
                  registeredDate: data.registeredDate || new Date().toISOString().split('T')[0],
                });
              }
            });
            if (loadedOwners.length > 0) {
              setOwnerAccounts(loadedOwners);
            }
          },
          (err) => console.warn('Firestore owner accounts sync warning:', err)
        );

        // Listen for support tickets in real time
        unsubscribeSupportTickets = onSnapshot(
          ticketsCol,
          (snapshot) => {
            const loadedTickets: SupportTicket[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as SupportTicket;
              loadedTickets.push({
                ...data,
                id: data.id || docSnap.id,
                messages: Array.isArray(data.messages) ? data.messages : [],
              });
            });
            if (loadedTickets.length > 0) {
              setSupportTickets(loadedTickets);
            }
          },
          (err) => console.warn('Firestore support tickets sync warning:', err)
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
      if (unsubscribeDoctors) unsubscribeDoctors();
      if (unsubscribeClinics) unsubscribeClinics();
      if (unsubscribeOwnerAccounts) unsubscribeOwnerAccounts();
      if (unsubscribeSupportTickets) unsubscribeSupportTickets();
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
    const now = new Date().toISOString();
    const newReg: ClinicRegistration = {
      ...details,
      id: newId,
      status: 'pending',
      registeredAt: now,
      notes: 'Submitted for 24-hour verification review on Firebase.',
    };

    setClinicRegistrations((prev) => [newReg, ...prev]);
    setActivePendingRegistration(newReg);

    // Also immediately provision the corresponding DoctorAccount in 'pending' status so Super Admin sees them in Doctor Registry!
    const doctorId = `doc_${newId}`;
    const newDoctor: DoctorAccount = {
      id: doctorId,
      name: details.name,
      qualification: details.qualification || 'BVSc & AH / DVM',
      registrationNumber: details.veterinarianIdNumber,
      specialization: details.specialization || 'General Veterinary Medicine & Surgery',
      clinicId: `clinic_${newId}`,
      clinicName: details.clinicName || 'Affiliated Veterinary Clinic',
      clinicAddress: details.clinicAddress || 'Address on file',
      contactNumber: details.contactNumber || '',
      email: details.email.trim(),
      consultationTimings: details.consultationTimings || 'Mon - Sat: 09:00 AM - 07:00 PM',
      status: 'pending',
      verificationStatus: 'pending',
      patientsCount: 0,
      consultationsCount: 0,
      role: 'doctor',
      registeredDate: now.split('T')[0],
      bio: `Doctor registered via onboarding portal for ${details.clinicName}.`,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    };

    setDoctors((prev) => {
      const exists = prev.some((d) => d.email.toLowerCase() === details.email.trim().toLowerCase());
      if (exists) {
        return prev.map((d) => (d.email.toLowerCase() === details.email.trim().toLowerCase() ? { ...d, ...newDoctor, id: d.id } : d));
      }
      return [newDoctor, ...prev];
    });

    // Also add to clinics list as pending
    const newClinicAcc: ClinicAccount = {
      id: `clinic_${newId}`,
      name: details.clinicName || `${details.name}'s Practice`,
      address: details.clinicAddress || 'Address on file',
      phone: details.contactNumber || '',
      email: details.email.trim(),
      adminId: doctorId,
      adminName: details.name,
      adminEmail: details.email.trim(),
      doctorsCount: 1,
      patientsCount: 0,
      appointmentsCount: 0,
      status: 'pending',
      registeredDate: now.split('T')[0],
      licenseNumber: details.veterinarianIdNumber || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setClinics((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === newClinicAcc.name.toLowerCase())) return prev;
      return [newClinicAcc, ...prev];
    });

    try {
      await setDoc(doc(db, 'clinic_registrations', newId), newReg);
      await setDoc(doc(db, 'doctors', doctorId), newDoctor);
      await setDoc(doc(db, 'clinics', newClinicAcc.id), newClinicAcc);
      showNotification('New clinic & veterinarian registered! Under verification review.', 'info');
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
            reviewedBy: 'Medical Licensing Board / Super Admin',
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

    // Also approve matching DoctorAccount
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === `doc_${id}` || (approvedReg && d.email.toLowerCase() === approvedReg.email.toLowerCase())) {
          const updated: DoctorAccount = {
            ...d,
            status: 'active',
            verificationStatus: 'verified',
            verifiedAt: now,
          };
          try {
            setDoc(doc(db, 'doctors', updated.id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return d;
      })
    );

    // Also activate matching ClinicAccount
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id === `clinic_${id}` || (approvedReg && (c.adminEmail.toLowerCase() === approvedReg.email.toLowerCase() || c.name === approvedReg.clinicName))) {
          const updated: ClinicAccount = { ...c, status: 'active' };
          try {
            setDoc(doc(db, 'clinics', updated.id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return c;
      })
    );

    try {
      await setDoc(
        doc(db, 'clinic_registrations', id),
        {
          status: 'approved',
          verifiedAt: now,
          reviewedBy: 'Medical Licensing Board / Super Admin',
          notes: reviewerNotes,
        },
        { merge: true }
      );
      showNotification('Clinic & Doctor registration approved on Firebase!', 'success');
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
            reviewedBy: 'Medical Licensing Board / Super Admin',
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

    // Also mark doctor as rejected
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === `doc_${id}` || (rejectedReg && d.email.toLowerCase() === rejectedReg.email.toLowerCase())) {
          const updated: DoctorAccount = {
            ...d,
            status: 'rejected',
            verificationStatus: 'rejected',
            notes: reason,
          };
          try {
            setDoc(doc(db, 'doctors', updated.id), updated, { merge: true }).catch(() => {});
          } catch (e) {}
          return updated;
        }
        return d;
      })
    );

    try {
      await setDoc(
        doc(db, 'clinic_registrations', id),
        {
          status: 'rejected',
          verifiedAt: now,
          reviewedBy: 'Medical Licensing Board / Super Admin',
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
    try {
      setDoc(doc(db, 'audit_logs', newLog.id), newLog).catch(() => {});
    } catch (e) {}
  };

  const addDoctor = async (
    doctorData: Partial<DoctorAccount> & { name: string; email: string; registrationNumber: string }
  ): Promise<DoctorAccount> => {
    const newId = doctorData.id || `doc_${Date.now()}`;
    const now = new Date().toISOString();
    const newDoctor: DoctorAccount = {
      id: newId,
      name: doctorData.name,
      qualification: doctorData.qualification || 'BVSc & AH, MVSc',
      registrationNumber: doctorData.registrationNumber,
      specialization: doctorData.specialization || 'General Veterinary Medicine & Surgery',
      clinicId: doctorData.clinicId || `clinic_${Date.now()}`,
      clinicName: doctorData.clinicName || 'Veterinary Clinical Practice',
      clinicAddress: doctorData.clinicAddress || 'Address on file',
      contactNumber: doctorData.contactNumber || '+1 (555) 000-0000',
      email: doctorData.email.trim(),
      consultationTimings: doctorData.consultationTimings || 'Mon - Sat: 09:00 AM - 07:00 PM',
      emergencyContact: doctorData.emergencyContact || '+1 (555) 911-PETS',
      status: doctorData.status || 'active',
      verificationStatus: doctorData.verificationStatus || 'verified',
      verifiedAt: doctorData.verificationStatus === 'verified' || !doctorData.verificationStatus ? now : undefined,
      registeredDate: doctorData.registeredDate || now.split('T')[0],
      role: doctorData.role || 'doctor',
      patientsCount: doctorData.patientsCount || 0,
      consultationsCount: doctorData.consultationsCount || 0,
      bio: doctorData.bio || 'Licensed veterinary surgeon and clinical healthcare specialist.',
      avatar: doctorData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    };

    setDoctors((prev) => {
      const exists = prev.some((d) => d.id === newDoctor.id || d.email.toLowerCase() === newDoctor.email.toLowerCase());
      if (exists) {
        return prev.map((d) => (d.id === newDoctor.id || d.email.toLowerCase() === newDoctor.email.toLowerCase() ? newDoctor : d));
      }
      return [newDoctor, ...prev];
    });

    try {
      await setDoc(doc(db, 'doctors', newDoctor.id), newDoctor);
    } catch (err) {
      console.warn('Firestore doctor save warning:', err);
    }

    logAuditEvent(
      'add_doctor',
      'doctor',
      newDoctor.id,
      newDoctor.name,
      `Doctor ${newDoctor.name} manually provisioned in platform registry.`
    );

    showNotification(`Doctor ${newDoctor.name} added and registered successfully!`, 'success');
    return newDoctor;
  };

  const approveDoctor = async (id: string, notes?: string) => {
    const now = new Date().toISOString();
    let targetDoc: DoctorAccount | undefined;

    setDoctors((prev) =>
      prev.map((docItem) => {
        if (docItem.id === id || docItem.email.toLowerCase() === id.toLowerCase()) {
          targetDoc = {
            ...docItem,
            status: 'active',
            verificationStatus: 'verified',
            verifiedAt: now,
            notes: notes || docItem.notes,
          };
          logAuditEvent('approve_doctor', 'doctor', docItem.id, docItem.name, `Doctor ${docItem.name} verified and approved. ${notes || ''}`);
          return targetDoc;
        }
        return docItem;
      })
    );

    // Sync matching clinic registration if present
    setClinicRegistrations((prev) =>
      prev.map((r) => {
        if (
          r.id === id ||
          r.id === id.replace('doc_', '') ||
          (targetDoc && (r.email.toLowerCase() === targetDoc.email.toLowerCase() || r.veterinarianIdNumber === targetDoc.registrationNumber))
        ) {
          const updatedReg: ClinicRegistration = {
            ...r,
            status: 'approved',
            verifiedAt: now,
            reviewedBy: 'Super Admin / Licensing Board',
            notes: notes || 'Approved by Super Admin',
          };
          try {
            setDoc(doc(db, 'clinic_registrations', r.id), updatedReg, { merge: true }).catch(() => {});
          } catch (e) {}
          return updatedReg;
        }
        return r;
      })
    );

    if (targetDoc) {
      try {
        await setDoc(doc(db, 'doctors', targetDoc.id), targetDoc, { merge: true });
      } catch (err) {
        console.warn('Firestore doctor approve sync note:', err);
      }
    }

    showNotification('Doctor account verified and approved on live platform', 'success');
  };

  const rejectDoctor = async (id: string, reason?: string) => {
    let targetDoc: DoctorAccount | undefined;
    setDoctors((prev) =>
      prev.map((docItem) => {
        if (docItem.id === id || docItem.email.toLowerCase() === id.toLowerCase()) {
          targetDoc = {
            ...docItem,
            status: 'rejected',
            verificationStatus: 'rejected',
            notes: reason || 'Credentials could not be verified',
          };
          logAuditEvent('reject_doctor', 'doctor', docItem.id, docItem.name, `Doctor ${docItem.name} registration rejected: ${reason || 'Criteria not met'}`);
          return targetDoc;
        }
        return docItem;
      })
    );

    // Sync matching clinic registration
    setClinicRegistrations((prev) =>
      prev.map((r) => {
        if (
          r.id === id ||
          r.id === id.replace('doc_', '') ||
          (targetDoc && (r.email.toLowerCase() === targetDoc.email.toLowerCase() || r.veterinarianIdNumber === targetDoc.registrationNumber))
        ) {
          const updatedReg: ClinicRegistration = {
            ...r,
            status: 'rejected',
            notes: reason || 'Rejected by Super Admin',
          };
          try {
            setDoc(doc(db, 'clinic_registrations', r.id), updatedReg, { merge: true }).catch(() => {});
          } catch (e) {}
          return updatedReg;
        }
        return r;
      })
    );

    if (targetDoc) {
      try {
        await setDoc(doc(db, 'doctors', targetDoc.id), targetDoc, { merge: true });
      } catch (err) {
        console.warn('Firestore doctor reject sync note:', err);
      }
    }

    showNotification('Doctor registration rejected', 'warning');
  };

  const suspendDoctor = async (id: string) => {
    let targetDoc: DoctorAccount | undefined;
    setDoctors((prev) =>
      prev.map((docItem) => {
        if (docItem.id === id) {
          targetDoc = { ...docItem, status: 'suspended' };
          logAuditEvent('suspend_doctor', 'doctor', docItem.id, docItem.name, `Doctor ${docItem.name} account suspended`);
          return targetDoc;
        }
        return docItem;
      })
    );

    if (targetDoc) {
      try {
        await setDoc(doc(db, 'doctors', id), { status: 'suspended' }, { merge: true });
      } catch (e) {}
    }

    showNotification('Doctor account suspended', 'info');
  };

  const reactivateDoctor = async (id: string) => {
    let targetDoc: DoctorAccount | undefined;
    setDoctors((prev) =>
      prev.map((docItem) => {
        if (docItem.id === id) {
          targetDoc = { ...docItem, status: 'active', verificationStatus: 'verified' };
          logAuditEvent('reactivate_doctor', 'doctor', docItem.id, docItem.name, `Doctor ${docItem.name} account reactivated`);
          return targetDoc;
        }
        return docItem;
      })
    );

    if (targetDoc) {
      try {
        await setDoc(doc(db, 'doctors', id), { status: 'active', verificationStatus: 'verified' }, { merge: true });
      } catch (e) {}
    }

    showNotification('Doctor account reactivated', 'success');
  };

  const updateDoctorRole = async (id: string, newRole: UserRole) => {
    setDoctors((prev) =>
      prev.map((docItem) => {
        if (docItem.id === id) {
          logAuditEvent('update_role', 'doctor', docItem.id, docItem.name, `Doctor ${docItem.name} role modified to ${newRole}`);
          return { ...docItem, role: newRole as any };
        }
        return docItem;
      })
    );
    try {
      await setDoc(doc(db, 'doctors', id), { role: newRole }, { merge: true });
    } catch (e) {}
    showNotification(`Doctor role updated to ${newRole}`, 'success');
  };

  const updateDoctor = async (id: string, updates: Partial<DoctorAccount>) => {
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
    try {
      await setDoc(doc(db, 'doctors', id), updates, { merge: true });
    } catch (e) {
      console.warn('Firestore doctor update note:', e);
    }
    showNotification('Doctor information updated successfully', 'success');
  };

  const deleteDoctor = async (id: string) => {
    const target = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    logAuditEvent('delete_doctor', 'doctor', id, target?.name, `Doctor ${target?.name || id} removed from platform.`);
    try {
      await deleteDoc(doc(db, 'doctors', id));
      await deleteDoc(doc(db, 'adminProfiles', id));
      await deleteDoc(doc(db, 'clinic_registrations', id));
      await deleteDoc(doc(db, 'clinic_registrations', id.replace('doc_', '')));
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

        addDoctor,
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

        // Forward/Backward Navigation Exports
        navigationHistory,
        historyIndex,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
        goHome,
        navigateTo,
        jumpToHistoryIndex,
        currentBreadcrumbs: [
          {
            label: currentSection === 'super_admin' ? 'Super Admin HQ' : currentSection === 'owner' ? 'Pet Parent Portal' : 'Doctor Station',
            section: currentSection,
            tab: currentSection === 'owner' ? 'dashboard' : currentSection === 'super_admin' ? 'overview' : 'dashboard',
            onClick: () => navigateTo(currentSection, currentSection === 'owner' ? 'dashboard' : currentSection === 'super_admin' ? 'overview' : 'dashboard'),
          },
          {
            label: getTabLabel(currentSection, currentSection === 'owner' ? ownerActiveTab : currentSection === 'super_admin' ? 'overview' : adminActiveTab),
            section: currentSection,
            tab: currentSection === 'owner' ? ownerActiveTab : currentSection === 'super_admin' ? 'overview' : adminActiveTab,
          },
        ],
        refreshData,
        isRefreshing,

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

