export type UserRole = 'admin' | 'vet' | 'owner';
export type AppSection = 'admin' | 'owner';
export type SpeciesType = 'Canine (Dog)' | 'Feline (Cat)' | 'Equine (Horse)' | 'Bovine (Cattle)' | 'Avian (Bird)' | 'Small Mammal' | 'Reptile' | 'Other';

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
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  createdDate: string;
  
  // Medical history summaries
  allergies?: string[];
  previousDiseases?: string[];
  previousSurgeries?: string[];
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
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
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
  clinicName: string;
  type: 'General Consultation' | 'Follow-up' | 'Emergency' | 'Vaccination' | 'Surgery' | 'Dental / Grooming' | 'Online Tele-Consult';
  date: string;
  time: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
  isEmergency?: boolean;
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
  ownerName: string;
  ownerPhone: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
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

// Convenience Type Aliases
export type Pet = PetRecord;
export type Invoice = BillingInvoice;
export type InvoiceItem = BillItem;
export type ModalityType = ImagingRecord['modality'];
export type InventoryItem = InventoryDrug;
export type SurgeryCategory = SurgicalProcedure['category'];

