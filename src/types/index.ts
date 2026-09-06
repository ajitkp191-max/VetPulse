export type UserRole = 'super_admin' | 'admin' | 'doctor' | 'owner' | 'vet';
export type AppSection = 'super_admin' | 'admin' | 'doctor' | 'owner';
export type SpeciesType = 'Canine (Dog)' | 'Feline (Cat)' | 'Equine (Horse)' | 'Bovine (Cattle)' | 'Avian (Bird)' | 'Small Mammal' | 'Reptile' | 'Other';

export interface DoctorAccount {
  id: string;
  name: string;
  qualification: string;
  registrationNumber: string;
  specialization: string;
  clinicId: string;
  clinicName: string;
  contactNumber: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  lastLogin?: string;
  patientsCount: number;
  consultationsCount: number;
  role: 'doctor';
  registeredDate: string;
  bio?: string;
  avatar?: string;
}

export interface ClinicAccount {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  doctorsCount: number;
  patientsCount: number;
  appointmentsCount: number;
  status: 'active' | 'inactive' | 'pending';
  registeredDate: string;
  licenseNumber: string;
  emergencyContact?: string;
}

export interface OwnerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredPetsCount: number;
  connectedClinicId?: string;
  connectedClinicName?: string;
  connectedDoctorId?: string;
  connectedDoctorName?: string;
  status: 'active' | 'suspended';
  registeredDate: string;
  lastLogin?: string;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: 'doctor' | 'owner' | 'clinic' | 'admin' | 'patient' | 'system' | 'billing' | 'role';
  targetId?: string;
  targetName?: string;
  description: string;
  details?: Record<string, any>;
}

export interface PlatformStats {
  totalOwners: number;
  totalDoctors: number;
  totalClinics: number;
  totalAdmins: number;
  totalPets: number;
  totalAppointments: number;
  activeAccounts: number;
  inactiveAccounts: number;
  newRegistrationsThisMonth: number;
  systemUptime: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  qualification: string;
  registrationNumber: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  contactNumber: string;
  email: string;
  consultationTimings: string;
  profilePhoto: string;
  emergencyContact: string;
  currency: string;
}

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact?: string;
  photoURL?: string;
  authProvider: 'google' | 'email' | 'demo';
  registeredDate?: string;
}

export interface PetRecord {
  id: string;
  name: string;
  species: SpeciesType;
  breed: string;
  sex: 'Male' | 'Female' | 'Neutered Male' | 'Spayed Female';
  dob: string;
  age: string;
  weight: number; // in kg
  color: string;
  identificationNumber: string;
  microchipNumber?: string;
  photo: string;
  ownerId?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  createdDate: string;
  
  // Medical history summaries
  allergies?: string[];
  currentMedications?: string[];
  previousDiseases?: string[];
  previousSurgeries?: string[];
  vaccinationHistorySummary?: string[];
  dewormingHistorySummary?: string[];
  surgeryHistorySummary?: string[];
  bloodType?: string;
  isInsured?: boolean;
}

export interface ClinicalVitals {
  temperatureC: number;
  heartRateBpm: number;
  respiratoryRateBpm: number;
  pulseQuality: 'Strong' | 'Normal' | 'Weak' | 'Bounding' | 'Thready';
  crtSeconds: number;
  mucousMembrane: 'Pink (Normal)' | 'Pale' | 'Congested/Red' | 'Icteric/Jaundiced' | 'Cyanotic/Blue';
  hydrationStatus: 'Normal (<5%)' | 'Mild (5-6%)' | 'Moderate (7-9%)' | 'Severe (>10%)';
  bcs: '1/9 (Emaciated)' | '3/9 (Thin)' | '5/9 (Ideal)' | '7/9 (Overweight)' | '9/9 (Obese)';
  painScore: '0 - None' | '1 - Mild' | '2 - Moderate' | '3 - Severe' | '4 - Excruciating';
}

export interface SystemicExam {
  lymphNodes: string;
  cardiovascular: string;
  respiratory: string;
  gastrointestinal: string;
  neurological: string;
  musculoskeletal: string;
  dermatological: string;
  urogenital: string;
  eyesEarsOral: string;
  customFindings?: string;
}

export interface ConsultationRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  ownerName: string;
  date: string;
  veterinarianName: string;
  vetRegNumber?: string;
  clinicName?: string;
  
  // History
  chiefComplaint: string;
  duration: string;
  appetite: 'Normal' | 'Decreased' | 'Anorexic' | 'Increased';
  waterIntake: 'Normal' | 'Polydipsia (Increased)' | 'Decreased' | 'None';
  vomiting: boolean;
  vomitingDetails?: string;
  diarrhea: boolean;
  diarrheaDetails?: string;
  urination: 'Normal' | 'Dysuria' | 'Hematuria' | 'Pollakiuria' | 'Anuria';
  defecation: 'Normal' | 'Constipation' | 'Diarrhea' | 'Hematochezia';
  cough: boolean;
  nasalDischarge: boolean;
  exerciseTolerance: 'Normal' | 'Lethargic' | 'Weak' | 'Reluctant to move';
  reproductiveHistory?: string;
  previousTreatment?: string;
  
  // Examination
  vitals: ClinicalVitals;
  systemicExam: SystemicExam;
  
  // Assessment & Plan
  provisionalDiagnosis: string;
  differentialDiagnoses: string[];
  treatmentPlan: string;
  prescribedMeds: string[];
  followUpDate?: string;
  aiInsights?: string;
  status: 'Completed' | 'In-Progress' | 'Follow-up Required';
}

export interface LabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' | 'UNSPECIFIED';
}

export interface LaboratoryReport {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  ownerName: string;
  testType: 'CBC / Hemogram' | 'Biochemistry Panel' | 'Electrolytes' | 'Urinalysis' | 'Fecal Analysis' | 'Thyroid / Endocrinology' | 'Rapid Antigen/PCR';
  date: string;
  parameters: LabParameter[];
  interpretation: string;
  veterinarianNotes: string;
  veterinarianName?: string;
  vetRegNumber?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface ImagingRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  modality: 'X-ray (Radiograph)' | 'Ultrasound (Sonogram)' | 'CT Scan' | 'MRI Scan' | 'Echocardiogram';
  anatomicalRegion: string;
  date: string;
  clinicalHistory: string;
  findings: string[];
  interpretation: string;
  differentialDiagnoses: string[];
  recommendations: string[];
  imageUrl: string;
  aiAnalyzed?: boolean;
  veterinarianName?: string;
  vetRegNumber?: string;
}

export interface ECGRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  date: string;
  heartRate: number;
  rhythm: string;
  pWave: string;
  prInterval: string;
  qrsDuration: string;
  qtInterval: string;
  stSegment: string;
  tWave: string;
  electricalAxis: string;
  arrhythmiaIdentified: string;
  aiDiagnosticReport?: string;
  differentialDiagnoses?: string[];
  imageUrl?: string;
  recordingNotes: string;
}

export interface SurgicalProcedure {
  id: string;
  name: string;
  category: 'Soft Tissue' | 'Orthopedic' | 'Ophthalmic' | 'Reproductive' | 'Emergency' | 'Large Animal' | 'Small Animal';
  speciesApplicability: string[];
  indications: string[];
  contraindications: string[];
  patientPrep: string;
  anesthesiaProtocol: string;
  surgicalApproach: string;
  instrumentsRequired: string[];
  surgicalSteps: string[];
  sutureMaterials: string;
  postOpCare: string;
  complications: string[];
  followUpSchedule: string;
  illustrationType: 'diagram' | 'workflow';
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  vaccineName: string;
  targetDiseases: string;
  batchNumber: string;
  manufacturer: string;
  administeredDate: string;
  nextDueDate: string;
  administeredBy: string;
  veterinarianName?: string;
  vetRegNumber?: string;
  route: 'Subcutaneous' | 'Intramuscular' | 'Intranasal' | 'Oral';
  status: 'Completed' | 'Due Soon' | 'Overdue';
  certificateNumber?: string;
}

export interface DewormingRecord {
  id: string;
  petId: string;
  petName: string;
  drugUsed: string;
  activeIngredients: string;
  dosage: string;
  administeredDate: string;
  nextDueDate: string;
  administeredBy: string;
  veterinarianName?: string;
  vetRegNumber?: string;
  status: 'Completed' | 'Due Soon' | 'Overdue';
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string; // e.g. 250mg or 2.5ml
  form?: string; // e.g. Tablet, Syrup, Injection, Drops
  frequency: string; // e.g. BID (Every 12h), TID, Once daily
  duration: string; // e.g. 7 days
  route: 'Oral' | 'Topical' | 'Otic' | 'Ophthalmic' | 'Subcutaneous' | 'Intravenous';
  instructions: string; // e.g. Give after food
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  breed: string;
  age: string;
  weight: number;
  ownerName: string;
  ownerPhone: string;
  date: string;
  veterinarianName: string;
  vetRegNumber: string;
  clinicName: string;
  clinicAddress: string;
  diagnosis: string;
  items: PrescriptionItem[];
  generalInstructions: string;
  dietaryRecommendations: string;
  nextVisitDate: string;
  attachmentUrl?: string;
  prescriptionType?: 'digital' | 'uploaded';
  uploadedImageUrl?: string;
  uploadedPrescriptionNotes?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  breed: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  veterinarianName: string;
  doctorRegNumber?: string;
  clinicName: string;
  type: 'General Consultation' | 'Follow-up' | 'Emergency' | 'Vaccination' | 'Surgery' | 'Dental / Grooming' | 'Online Tele-Consult';
  date: string;
  time: string;
  status: 'Requested' | 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show';
  reason: string;
  notes?: string;
  isEmergency?: boolean;
}

export interface SupportMessage {
  id: string;
  senderRole: 'doctor' | 'admin' | 'super_admin';
  senderName: string;
  senderId?: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  senderRole: 'doctor' | 'admin';
  senderName: string;
  senderEmail: string;
  senderId: string;
  senderRegNumber: string;
  clinicName: string;
  subject: string;
  category: 'Technical / App Bug' | 'Patient Record Issue' | 'Billing & Payout' | 'Licensing & Verification' | 'Emergency Assistance' | 'Feature Request' | 'General Query';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In-Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface BillItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Medicine' | 'Laboratory' | 'Surgery' | 'Hospitalization' | 'Grooming/Other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  petId: string;
  petName: string;
  species?: SpeciesType;
  ownerName: string;
  ownerPhone: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  total?: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  paymentMethod: 'Cash' | 'Credit/Debit Card' | 'Online / UPI' | 'Insurance Claim';
}

export interface InventoryDrug {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'NSAID / Analgesic' | 'Antiparasitic' | 'Anesthetic' | 'Vaccine' | 'Cardiac' | 'Fluid / Electrolyte' | 'Topical / Otic';
  stockCount: number;
  unit: string;
  minimumThreshold: number;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  supplier: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Nutrition' | 'Vaccination' | 'Deworming' | 'Parasite Prevention' | 'Dental Care' | 'Grooming' | 'Puppy & Kitten Care' | 'Senior Animal Care' | 'Common Diseases' | 'First Aid' | 'Preventive Healthcare';
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  speciesTarget: string;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'vet' | 'ai-assistant';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'document' | 'video';
}

export interface ClinicRegistration {
  id: string;
  email: string;
  password?: string;
  veterinarianIdNumber: string;
  name: string;
  qualification: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  contactNumber: string;
  consultationTimings: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  verifiedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface EssentialClinicalParameters {
  dietType: 'Commercial Dry Kibble' | 'Wet Canned' | 'Raw Meat / BARF' | 'Home Cooked' | 'Prescription / Therapeutic Diet' | 'Mixed';
  dietBrand?: string;
  feedingFrequency: 'Once Daily' | 'Twice Daily (q12h)' | 'Free Choice / Ad Libitum' | 'Multiple Small Meals';
  waterIntake: 'Normal' | 'Polydipsia (Increased)' | 'Oligodipsia (Decreased)' | 'Adipsia (None)';
  environment: 'Strictly Indoor' | 'Indoor with Supervised Outdoor' | 'Free Roaming Outdoor' | 'Farm / Agricultural' | 'Shelter / Kennel';
  housingDetails?: string;
  exposureRisk: {
    toxins: boolean;
    toxicPlants: boolean;
    humanMeds: boolean;
    rodenticides: boolean;
    garbageRaiding: boolean;
    ticksFleas: boolean;
    strayAnimals: boolean;
    notes?: string;
  };
  reproductiveStatus: 'Intact Male' | 'Intact Female' | 'Neutered Male (Castrated)' | 'Spayed Female (OHE)' | 'Pregnant' | 'Lactating' | 'Unknown';
  lastEstrusHeatDate?: string;
  knownAllergies: string[];
  currentMedications: string[];
  pastMedicalConditions: string[];
  pastSurgeries: string[];
}

export interface SignsAndSymptomsReview {
  chiefComplaint: string;
  duration: string;
  onset: 'Peracute (<6 hrs)' | 'Acute (24-48 hrs)' | 'Subacute (3-7 days)' | 'Chronic (>2 weeks)';
  progression: 'Rapidly Worsening' | 'Gradually Worsening' | 'Static / Unchanged' | 'Fluctuating / Intermittent' | 'Improving';
  triagePriority: 'Level 1 - Resuscitation' | 'Level 2 - Emergent' | 'Level 3 - Urgent' | 'Level 4 - Standard' | 'Level 5 - Non-Urgent';
  
  // Organ Systems Signs
  gastrointestinal: {
    vomiting: boolean;
    vomitingFreq?: string;
    vomitingCharacter?: string; // bile, food, blood, froth
    diarrhea: boolean;
    diarrheaType?: string; // watery, mucoid, hematochezia, melena
    appetite: 'Normal' | 'Hyporexia' | 'Anorexia' | 'Polyphagia' | 'Pica';
    dysphagiaRegurgitation: boolean;
    abdominalPain: boolean;
    notes?: string;
  };
  respiratory: {
    cough: boolean;
    coughCharacter?: 'Dry / Non-productive' | 'Moist / Productive' | 'Honking' | 'Paroxysmal';
    sneezingReverseSneeze: boolean;
    nasalDischarge: boolean;
    dischargeType?: 'Serous' | 'Mucoid' | 'Purulent' | 'Epistaxis';
    dyspneaTachypnea: boolean;
    stridorStertor: boolean;
    notes?: string;
  };
  cardiovascular: {
    exerciseIntolerance: boolean;
    syncopeCollapse: boolean;
    cyanosis: boolean;
    knownMurmurArrhythmia: boolean;
    weakness: boolean;
    notes?: string;
  };
  dermatological: {
    pruritusSeverity: number; // 0 to 10
    alopecia: boolean;
    erythemaRash: boolean;
    crustsScalesPustules: boolean;
    otitisHeadShaking: boolean;
    fleaTickInfestation: boolean;
    pawLickingPododermatitis: boolean;
    notes?: string;
  };
  musculoskeletal: {
    lameness: boolean;
    affectedLimb?: 'Left Fore' | 'Right Fore' | 'Left Hind' | 'Right Hind' | 'Multiple Limbs' | 'Shifting';
    jointStiffness: boolean;
    spinalPainKyphosis: boolean;
    reluctanceToJumpStairs: boolean;
    swellingAtrophy: boolean;
    notes?: string;
  };
  neurological: {
    mentation: 'Alert & Responsive' | 'Depressed / Obtunded' | 'Stuporous' | 'Comatose' | 'Disoriented';
    seizuresTremors: boolean;
    seizureDetails?: string;
    ataxiaIncoordination: boolean;
    headTiltNystagmus: boolean;
    behavioralChanges: boolean;
    notes?: string;
  };
  urogenital: {
    urinationPattern: 'Normal' | 'Pollakiuria (Frequent)' | 'Stranguria / Dysuria' | 'Hematuria (Blood)' | 'Incontinence' | 'Anuria / Oliguria';
    discharge: boolean;
    dischargeType?: string;
    notes?: string;
  };
  ophthalmic: {
    ocularDischarge: boolean;
    squintingBlepharospasm: boolean;
    cornealCloudingUlcer: boolean;
    visionDeficit: boolean;
    notes?: string;
  };
}

export interface HistoryTakingRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  breed: string;
  age: string;
  weightKg: number;
  sex: string;
  ownerName: string;
  ownerPhone: string;
  date: string;
  takenByDoctorName: string;
  takenByDoctorRegNumber: string;
  clinicName: string;
  
  // Section 1: Signs & Symptoms
  signsAndSymptoms: SignsAndSymptomsReview;
  
  // Section 2: Clinical Parameters & Vitals
  clinicalVitals: ClinicalVitals & {
    temperatureF: number;
    systolicBP?: number;
    diastolicBP?: number;
    meanArterialPressure?: number;
    spo2Percent?: number;
    bloodGlucoseMgDl?: number;
    painScoreScale: number; // 0-10
  };
  
  // Section 3: Vaccination Status
  vaccinationStatus: {
    isFullyVaccinated: boolean;
    statusSummary: 'Up to Date' | 'Boosters Due Soon' | 'Overdue' | 'Unvaccinated';
    lastVaccineGiven?: string;
    lastVaccineDate?: string;
    nextVaccineDue?: string;
    recentRecords: VaccinationRecord[];
    clinicalNotes?: string;
  };
  
  // Section 4: Deworming Status
  dewormingStatus: {
    statusSummary: 'Current' | 'Due Soon' | 'Overdue' | 'Never Dewormed';
    lastDewormingDate?: string;
    lastDrugUsed?: string;
    nextDueDate?: string;
    parasitePreventionProtocol?: string;
    recentRecords: DewormingRecord[];
    clinicalNotes?: string;
  };
  
  // Section 5: Essential Parameters
  essentialParameters: EssentialClinicalParameters;
  
  // Section 6: Assessment & Next Steps
  clinicalImpression: string;
  triageSummary: string;
  recommendedAction: 'Proceed to SOAP Consultation' | 'Immediate Emergency Stabilization' | 'Direct Lab Diagnostics' | 'Prescription Refill' | 'Vaccination & Deworming Admin';
  aiAssistedSummary?: string;
  status: 'Completed' | 'Draft';
}

// Convenience Type Aliases
export interface InpatientMedication {
  id: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  scheduledTimes: string[];
  given: boolean;
  administeredBy?: string;
  notes?: string;
}

export interface HospitalizationDailySheet {
  id: string;
  date: string;
  weightKg: number;
  temperatureC: number;
  heartRateBpm: number;
  respiratoryRateBpm: number;
  fluidTherapy: {
    fluidType: string;
    rateMlPerHour: number;
    additives?: string;
    totalAdministeredMl: number;
  };
  foodIntake: 'Normal' | 'Partial (25-50%)' | 'Minimal (<25%)' | 'None (Anorexic)' | 'Force Fed';
  urineOutput: 'Normal' | 'Reduced' | 'Absent (Oliguria/Anuria)' | 'Excessive (Polyuria)';
  stoolConsistency: 'Normal' | 'Soft' | 'Diarrhea' | 'None/Constipated' | 'Melena/Blood';
  medications: InpatientMedication[];
  progressNotes: string;
  recordedBy: string;
}

export interface HospitalizationRecord {
  id: string;
  petId: string;
  petName: string;
  species: SpeciesType;
  breed: string;
  ownerName: string;
  ownerPhone: string;
  admissionDate: string;
  dischargeDate?: string;
  wardNumber: string;
  cageKennel: string;
  provisionalDiagnosis: string;
  attendingDoctor: string;
  vetRegNumber?: string;
  status: 'Admitted' | 'Critical Care' | 'Stable' | 'Discharged';
  dailySheets: HospitalizationDailySheet[];
  dischargeSummary?: string;
  dischargeInstructions?: string;
  emergencyAlert?: string;
}

export type Pet = PetRecord;
export type Invoice = BillingInvoice;
export type InvoiceItem = BillItem;
export type ModalityType = ImagingRecord['modality'];
export type InventoryItem = InventoryDrug;
export type SurgeryCategory = SurgicalProcedure['category'];



