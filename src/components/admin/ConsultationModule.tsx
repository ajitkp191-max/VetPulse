import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Sparkles,
  Upload,
  Brain,
  Pill,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  Edit,
  Printer,
  X,
  Share2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrescriptionItem } from '../../types';
import { ConsultationStep1History, CaseSpecialty } from './consultation/ConsultationStep1History';
import { ConsultationStep2Summary } from './consultation/ConsultationStep2Summary';
import { ConsultationStep3AIDiagnosis } from './consultation/ConsultationStep3AIDiagnosis';
import { ConsultationStep3UploadDiagnostics } from './consultation/ConsultationStep3UploadDiagnostics';
import { ConsultationStep4PostDiagnosticAISynthesis } from './consultation/ConsultationStep4PostDiagnosticAISynthesis';
import { ConsultationStep5Prescription } from './consultation/ConsultationStep5Prescription';

interface ConsultationModuleProps {
  initialStep?: number;
  onNavigateToPet?: (petId: string) => void;
}

export const ConsultationModule: React.FC<ConsultationModuleProps> = ({
  initialStep = 1,
  onNavigateToPet,
}) => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    addConsultation,
    addPrescription,
    addLabReport,
    addImagingRecord,
    updatePet,
    showNotification,
    adminProfile,
    isDoctorLoggedIn,
    currentDoctor,
    setActiveTab,
  } = useApp();

  const activeDoctorName = isDoctorLoggedIn && currentDoctor ? currentDoctor.name : adminProfile.name;
  const activeDoctorReg = isDoctorLoggedIn && currentDoctor ? currentDoctor.licenseNumber : adminProfile.licenseNumber;
  const activeClinicName = adminProfile.clinicName;
  const activeClinicAddress = adminProfile.clinicAddress;

  // Active Pet
  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0] || {
    id: 'p1',
    name: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    weight: 28,
    gender: 'Female (Intact)',
    ownerName: 'Sarah Jenkins',
    ownerPhone: '+1 (555) 234-5678',
  };

  // Stepper state: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [step4SubMode, setStep4SubMode] = useState<'upload' | 'synthesis'>('upload');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Pet Quick Edit Modal
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [petWeightEdit, setPetWeightEdit] = useState<string | number>(activePet?.weight || 15);
  const [petAgeEdit, setPetAgeEdit] = useState<string>(activePet?.age || '3 years');

  // STEP 1: HISTORY TAKING
  const [caseSpecialty, setCaseSpecialty] = useState<CaseSpecialty>('Medicine');
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [duration, setDuration] = useState('');
  const [onsetMode, setOnsetMode] = useState<'Sudden / Acute' | 'Gradual / Progressive' | 'Chronic / Intermittent'>('Sudden / Acute');
  const [triageUrgency, setTriageUrgency] = useState<'Routine' | 'Urgent' | 'Emergency' | 'Critical'>('Routine');

  // Vitals
  const [temp, setTemp] = useState<number>('' as any); // F
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [heartRate, setHeartRate] = useState<number>('' as any); // bpm
  const [respiratoryRate, setRespiratoryRate] = useState<number>('' as any); // bpm
  const [mucousMembrane, setMucousMembrane] = useState<'Pink' | 'Pale' | 'Cyanotic' | 'Icteric' | 'Congested / Injected'>('' as any);
  const [hydration, setHydration] = useState<'Normal (<5%)' | 'Mild (5%)' | 'Moderate (7-8%)' | 'Severe (>10%)'>('' as any);
  const [crt, setCrt] = useState<string>('');
  const [bcs, setBcs] = useState<string>('');
  const [painScore, setPainScore] = useState<string>('');
  const [progression, setProgression] = useState<'Worsening' | 'Static' | 'Fluctuating' | 'Improving'>('Worsening');
  const [pulseQuality, setPulseQuality] = useState<'Strong & Synchronous' | 'Moderate' | 'Weak & Thready' | 'Bounding'>('' as any);
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [bloodGlucose, setBloodGlucose] = useState<string>('');
  const [dietDetails, setDietDetails] = useState<string>('');
  const [toxinExposure, setToxinExposure] = useState<string>('');
  const [preventiveStatus, setPreventiveStatus] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');

  // Physical Exam
  const [physicalExamNotes, setPhysicalExamNotes] = useState('');

  // STEP 2: AI WORKUP (AI Analysis Result from Step 2)
  const [aiWorkupResult, setAiWorkupResult] = useState<any>(null);
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<string>('');
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string>('');
  const [diagnosticRecommendations, setDiagnosticRecommendations] = useState<string>('');

  // STEP 3: UPLOAD DIAGNOSTICS
  // Labs: BUN, Creatinine, CBC, Hepatic
  const [labTestType, setLabTestType] = useState('CBC & Renal/Hepatic Chemistry Panel');
  const [labFileAttached, setLabFileAttached] = useState<string | null>(null);
  const [labFileName, setLabFileName] = useState<string>('');
  const [bun, setBun] = useState<number>('' as any); // mg/dL
  const [creatinine, setCreatinine] = useState<number>('' as any); // mg/dL
  const [wbc, setWbc] = useState<number>('' as any); // k/uL
  const [rbc, setRbc] = useState<number>('' as any);
  const [hemoglobin, setHemoglobin] = useState<number>('' as any);
  const [hematocrit, setHematocrit] = useState<number>('' as any); // %
  const [platelets, setPlatelets] = useState<number>('' as any);
  const [alt, setAlt] = useState<number>('' as any);
  const [alp, setAlp] = useState<number>('' as any);
  const [bloodGlucoseVal, setBloodGlucoseVal] = useState<number>('' as any);
  const [labParametersText, setLabParametersText] = useState('');
  const [labNotes, setLabNotes] = useState('');

  // X-Ray
  const [xrayRegion, setXrayRegion] = useState('Abdomen (Lateral & Ventrodorsal Views)');
  const [xrayFileAttached, setXrayFileAttached] = useState<string | null>(null);
  const [xrayFileName, setXrayFileName] = useState<string>('');
  const [xrayFindings, setXrayFindings] = useState('');

  // USG
  const [usgRegion, setUsgRegion] = useState('Abdominal Ultrasonography (A-FAST)');
  const [usgFileAttached, setUsgFileAttached] = useState<string | null>(null);
  const [usgFileName, setUsgFileName] = useState<string>('');
  const [usgFindings, setUsgFindings] = useState('');

  // Other Diagnostics
  const [ecgRhythm, setEcgRhythm] = useState('');
  const [cytologyFindings, setCytologyFindings] = useState('');

  // STEP 4: POST-DIAGNOSTIC AI SYNTHESIS (Diagnosis & Suspected Cause)
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [suspectedCause, setSuspectedCause] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [aiSuggestedPrescription, setAiSuggestedPrescription] = useState<any[]>([]);

  // STEP 5: PRESCRIPTION
  const [rxMode, setRxMode] = useState<'write' | 'upload'>('write');
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([]);
  const [dietaryAdvice, setDietaryAdvice] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [uploadedRxSlipUrl, setUploadedRxSlipUrl] = useState<string | null>(null);
  const [uploadedRxFileName, setUploadedRxFileName] = useState<string>('');
  const [uploadedRxNotes, setUploadedRxNotes] = useState('');

  // Auto-sync pet attributes
  useEffect(() => {
    if (activePet) {
      setPetWeightEdit(activePet.weight);
      setPetAgeEdit(activePet.age);
    }
  }, [selectedPetId]);

  // Handle saving the full consultation dossier
  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();

    const historyText = `[Specialty: ${caseSpecialty}]\nChief Complaint: ${chiefComplaint}. Duration: ${duration}. Onset: ${onsetMode}.\nSelected Signs: ${selectedSigns.join(', ')}.\nPhysical Exam: ${physicalExamNotes}`;

    addConsultation({
      petId: activePet.id,
      petName: activePet.name,
      species: activePet.species,
      breed: activePet.breed,
      age: activePet.age,
      weight: activePet.weight,
      date: new Date().toISOString().split('T')[0],
      veterinarianName: activeDoctorName,
      chiefComplaint: chiefComplaint ? `${caseSpecialty}: ${chiefComplaint}` : `${caseSpecialty} Clinical Examination`,
      history: {
        duration: duration || 'Not specified',
        appetite: 'Normal',
        waterIntake: 'Normal',
        vomiting: 'None',
        stool: 'Normal',
        coughSneeze: 'None',
        urination: 'Normal',
        behaviorChanges: selectedSigns.length > 0 ? selectedSigns.join('; ') : 'None',
        dietaryHistory: dietDetails || 'Standard diet',
      },
      vitals: {
        temperature: temp || 0,
        heartRate: heartRate || 0,
        respiratoryRate: respiratoryRate || 0,
        mucousMembrane: mucousMembrane || 'Pink',
        capillaryRefillTime: crt || '< 2.0 sec',
        hydrationStatus: hydration || 'Normal (<5%)',
        bodyConditionScore: bcs || '5/9 Ideal',
        painScore: painScore || '0/4 Sound',
        bloodPressure: bloodPressure || '',
        bloodGlucose: bloodGlucose ? `${bloodGlucose}` : bloodGlucoseVal ? `${bloodGlucoseVal} mg/dL` : '',
      },
      systemicExam: {
        cardiovascular: heartRate ? `HR: ${heartRate} bpm, Rhythm: ${ecgRhythm || 'Normal'}` : 'Normal',
        respiratory: respiratoryRate ? `RR: ${respiratoryRate} bpm` : 'Clear',
        gastrointestinal: physicalExamNotes ? physicalExamNotes : usgFindings ? `USG: ${usgFindings}` : 'Normal on palpation',
        musculoskeletal: 'Ambulatory x 4',
        integumentary: 'Clean coat',
        ophthalmicOtic: 'Eyes clear',
        dental: 'Clean',
        lymphNodes: 'Normal',
        customFindings: physicalExamNotes || 'Clinical examination complete.',
      },
      provisionalDiagnosis: provisionalDiagnosis || finalDiagnosis || 'Clinical Examination',
      differentialDiagnosis: differentialDiagnoses ? differentialDiagnoses.split(';').map(s => s.trim()) : [caseSpecialty],
      finalDiagnosis: finalDiagnosis || 'Clinical Examination Complete',
      treatmentPlan: treatmentPlan || 'Supportive care & observation as indicated.',
      diagnosticRecommendations: diagnosticRecommendations || (xrayFindings || usgFindings || bun ? `Diagnostics: ${xrayFindings ? 'X-Ray ' : ''}${usgFindings ? 'USG ' : ''}${bun ? 'Blood chemistry' : ''}` : 'Routine assessment'),
      followUpDate,
    });

    // Record prescription
    if (rxMode === 'write') {
      addPrescription({
        petId: activePet.id,
        petName: activePet.name,
        species: activePet.species,
        breed: activePet.breed,
        age: activePet.age,
        weight: activePet.weight,
        ownerName: activePet.ownerName,
        ownerPhone: activePet.ownerPhone,
        date: new Date().toISOString().split('T')[0],
        veterinarianName: activeDoctorName,
        vetRegNumber: activeDoctorReg,
        clinicName: activeClinicName,
        clinicAddress: activeClinicAddress,
        diagnosis: finalDiagnosis || 'Clinical Examination Complete',
        items: rxItems,
        generalInstructions: precautions,
        dietaryRecommendations: dietaryAdvice,
        nextVisitDate: followUpDate,
        prescriptionType: 'digital',
      });
    } else {
      addPrescription({
        petId: activePet.id,
        petName: activePet.name,
        species: activePet.species,
        breed: activePet.breed,
        age: activePet.age,
        weight: activePet.weight,
        ownerName: activePet.ownerName,
        ownerPhone: activePet.ownerPhone,
        date: new Date().toISOString().split('T')[0],
        veterinarianName: activeDoctorName,
        vetRegNumber: activeDoctorReg,
        clinicName: activeClinicName,
        clinicAddress: activeClinicAddress,
        diagnosis: finalDiagnosis || 'Clinical Examination Complete',
        items: [
          {
            medicineName: 'As per attached physical prescription slip',
            dosage: 'Refer to attachment',
            route: 'Oral',
            frequency: 'As indicated',
            duration: 'As indicated',
            instructions: uploadedRxNotes || 'Follow prescribed veterinary dosage regimen.',
          },
        ],
        generalInstructions: uploadedRxNotes,
        dietaryRecommendations: dietaryAdvice,
        nextVisitDate: followUpDate,
        prescriptionType: 'uploaded',
        uploadedImageUrl: uploadedRxSlipUrl || '',
        uploadedPrescriptionNotes: uploadedRxNotes,
      });
    }

    // Also record lab report & imaging if files exist
    if (labFileAttached) {
      addLabReport({
        petId: activePet.id,
        petName: activePet.name,
        testType: labTestType,
        date: new Date().toISOString().split('T')[0],
        results: {
          wbc: `${wbc} k/uL`,
          bun: `${bun} mg/dL`,
          creatinine: `${creatinine} mg/dL`,
          hct: `${hematocrit}%`,
          alt: `${alt} U/L`,
        },
        referenceRanges: {
          wbc: '6.0 - 17.0',
          bun: '7 - 27',
          creatinine: '0.5 - 1.5',
        },
        notes: labNotes,
        interpretation: `BUN:Creat ratio ${(bun / (creatinine || 1)).toFixed(1)}. ${labNotes}`,
        status: 'Completed',
        doctorName: activeDoctorName,
      });
    }

    if (xrayFileAttached || usgFileAttached) {
      const findingsList: string[] = [];
      if (xrayFindings) findingsList.push(xrayFindings);
      if (usgFindings && usgFindings !== xrayFindings) findingsList.push(usgFindings);
      if (findingsList.length === 0) findingsList.push('No gross abnormality detected.');

      addImagingRecord({
        petId: activePet.id,
        petName: activePet.name,
        species: activePet.species as any,
        modality: xrayFileAttached ? 'X-ray (Radiograph)' : 'Ultrasound (Sonogram)',
        anatomicalRegion: (xrayFileAttached ? xrayRegion : usgRegion) || 'Abdomen',
        date: new Date().toISOString().split('T')[0],
        clinicalHistory: chiefComplaint,
        findings: findingsList,
        interpretation: finalDiagnosis || 'Clinical correlation required.',
        differentialDiagnoses: [suspectedCause].filter(Boolean),
        recommendations: ['Follow-up imaging as clinically indicated.'],
        imageUrl: xrayFileAttached || usgFileAttached || '',
      });
    }

    setSaveSuccess(true);
    showNotification('Complete consultation dossier, diagnostics & prescription saved successfully!');
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleUpdatePetVitals = () => {
    updatePet(activePet.id, {
      weight: typeof petWeightEdit === 'string' ? parseFloat(petWeightEdit) || activePet.weight : petWeightEdit,
      age: petAgeEdit,
    });
    setIsEditPetModalOpen(false);
    showNotification('Patient weight and age updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* 0. TOP PATIENT HEADER & VITALS BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Patient Info & Selector */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-base shadow-xs">
            {activePet.name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {activePet.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {activePet.species} • {activePet.breed}
              </span>
              <button
                type="button"
                onClick={() => setIsEditPetModalOpen(true)}
                className="text-[10px] text-slate-400 hover:text-teal-600 flex items-center gap-0.5 transition-colors"
                title="Edit Weight / Age"
              >
                <Edit className="w-3 h-3" />
                <span>Edit Weight</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Owner: <strong>{activePet.ownerName}</strong> ({activePet.ownerPhone}) • Weight:{' '}
              <strong className="text-teal-600 dark:text-teal-400">{activePet.weight} kg</strong> • Age:{' '}
              {activePet.age}
            </p>
          </div>
        </div>

        {/* Patient Switcher Dropdown */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <label className="text-xs font-bold text-slate-500 hidden sm:inline">
            Active Patient:
          </label>
          <select
            value={selectedPetId || activePet.id}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species} • {p.weight} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 0.1 SAVE SUCCESS NOTIFICATION */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-md flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <div>
              <span className="font-bold text-sm block">
                Clinical Consultation & Prescription Saved!
              </span>
              <span className="text-xs opacity-90">
                Full 5-step dossier recorded into {activePet.name}'s medical history.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Slip</span>
          </button>
        </div>
      )}

      {/* 0.2 THE 5-STEP CLINICAL WORKFLOW STEPPER */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-2xl text-left transition-all relative ${
              currentStep === 1
                ? 'bg-teal-600 text-white shadow-md'
                : currentStep > 1
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 1
                    ? 'bg-white text-teal-700'
                    : currentStep > 1
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                1
              </span>
              <span className="text-xs font-black truncate">Taking History</span>
            </div>
            <span className="text-[10px] block mt-1 opacity-80 truncate">
              Specialty & Vitals
            </span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-2xl text-left transition-all relative ${
              currentStep === 2
                ? 'bg-teal-600 text-white shadow-md'
                : currentStep > 2
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 2
                    ? 'bg-white text-teal-700'
                    : currentStep > 2
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                2
              </span>
              <span className="text-xs font-black truncate">Review Summary</span>
            </div>
            <span className="text-[10px] block mt-1 opacity-80 truncate">
              Parameters & Signs
            </span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-2xl text-left transition-all relative ${
              currentStep === 3
                ? 'bg-teal-600 text-white shadow-md'
                : currentStep > 3
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 3
                    ? 'bg-white text-teal-700'
                    : currentStep > 3
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                3
              </span>
              <span className="text-xs font-black truncate">AI Diagnostic Tool</span>
            </div>
            <span className="text-[10px] block mt-1 opacity-80 truncate">
              Predict & Suggest Tests
            </span>
          </button>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => {
              setStep4SubMode('upload');
              setCurrentStep(4);
            }}
            className={`p-3 rounded-2xl text-left transition-all relative ${
              currentStep === 4
                ? 'bg-teal-600 text-white shadow-md'
                : currentStep > 4
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 4
                    ? 'bg-white text-teal-700'
                    : currentStep > 4
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                4
              </span>
              <span className="text-xs font-black truncate">Upload & Correlate</span>
            </div>
            <span className="text-[10px] block mt-1 opacity-80 truncate">
              CBC, BUN, X-Ray (Optional)
            </span>
          </button>

          {/* Step 5 */}
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className={`p-3 rounded-2xl text-left transition-all relative col-span-2 sm:col-span-1 ${
              currentStep === 5
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 5
                    ? 'bg-white text-teal-700'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                5
              </span>
              <span className="text-xs font-black truncate">Prescription</span>
            </div>
            <span className="text-[10px] block mt-1 opacity-80 truncate">
              AI Suggest / Write / Upload
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STEP 1: HISTORY TAKING */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <ConsultationStep1History
          activePet={activePet}
          caseSpecialty={caseSpecialty}
          setCaseSpecialty={setCaseSpecialty}
          selectedSigns={selectedSigns}
          setSelectedSigns={setSelectedSigns}
          chiefComplaint={chiefComplaint}
          setChiefComplaint={setChiefComplaint}
          duration={duration}
          setDuration={setDuration}
          onsetMode={onsetMode}
          setOnsetMode={setOnsetMode}
          progression={progression}
          setProgression={setProgression}
          triageUrgency={triageUrgency}
          setTriageUrgency={setTriageUrgency}
          dietDetails={dietDetails}
          setDietDetails={setDietDetails}
          toxinExposure={toxinExposure}
          setToxinExposure={setToxinExposure}
          preventiveStatus={preventiveStatus}
          setPreventiveStatus={setPreventiveStatus}
          generalNotes={generalNotes}
          setGeneralNotes={setGeneralNotes}
          temp={temp}
          setTemp={setTemp}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          heartRate={heartRate}
          setHeartRate={setHeartRate}
          respiratoryRate={respiratoryRate}
          setRespiratoryRate={setRespiratoryRate}
          pulseQuality={pulseQuality}
          setPulseQuality={setPulseQuality}
          mucousMembrane={mucousMembrane}
          setMucousMembrane={setMucousMembrane}
          hydration={hydration}
          setHydration={setHydration}
          crt={crt}
          setCrt={setCrt}
          bcs={bcs}
          setBcs={setBcs}
          painScore={painScore}
          setPainScore={setPainScore}
          bloodPressure={bloodPressure}
          setBloodPressure={setBloodPressure}
          bloodGlucose={bloodGlucose}
          setBloodGlucose={setBloodGlucose}
          physicalExamNotes={physicalExamNotes}
          setPhysicalExamNotes={setPhysicalExamNotes}
          onProceedToStep2={() => setCurrentStep(2)}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. STEP 2: SUMMARY OF PHYSICAL PARAMETERS AND SIGNS (NO AI) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <ConsultationStep2Summary
          activePet={activePet}
          caseSpecialty={caseSpecialty}
          chiefComplaint={chiefComplaint}
          duration={duration}
          onsetMode={onsetMode}
          triageUrgency={triageUrgency}
          generalNotes={generalNotes}
          dietDetails={dietDetails}
          preventiveStatus={preventiveStatus}
          selectedSigns={selectedSigns}
          temp={temp}
          tempUnit={tempUnit}
          heartRate={heartRate}
          respiratoryRate={respiratoryRate}
          crt={crt}
          mucousMembrane={mucousMembrane}
          hydration={hydration}
          bcs={bcs}
          painScore={painScore}
          bloodPressure={bloodPressure}
          bloodGlucose={bloodGlucose}
          physicalExamNotes={physicalExamNotes}
          onBackToStep1={() => setCurrentStep(1)}
          onProceedToStep3={() => setCurrentStep(3)}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. STEP 3: AI DIAGNOSTIC TOOL & LAB TEST SUGGESTER */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <ConsultationStep3AIDiagnosis
          activePet={activePet}
          caseSpecialty={caseSpecialty}
          chiefComplaint={chiefComplaint}
          duration={duration}
          onsetMode={onsetMode}
          triageUrgency={triageUrgency}
          generalNotes={generalNotes}
          selectedSigns={selectedSigns}
          temp={temp}
          tempUnit={tempUnit}
          heartRate={heartRate}
          respiratoryRate={respiratoryRate}
          crt={crt}
          mucousMembrane={mucousMembrane}
          hydration={hydration}
          bcs={bcs}
          painScore={painScore}
          bloodPressure={bloodPressure}
          bloodGlucose={bloodGlucose}
          physicalExamNotes={physicalExamNotes}
          provisionalDiagnosis={provisionalDiagnosis}
          setProvisionalDiagnosis={setProvisionalDiagnosis}
          differentialDiagnoses={differentialDiagnoses}
          setDifferentialDiagnoses={setDifferentialDiagnoses}
          diagnosticRecommendations={diagnosticRecommendations}
          setDiagnosticRecommendations={setDiagnosticRecommendations}
          treatmentPlan={treatmentPlan}
          setTreatmentPlan={setTreatmentPlan}
          onBackToStep2={() => setCurrentStep(2)}
          onProceedToStep4Upload={() => {
            setStep4SubMode('upload');
            setCurrentStep(4);
          }}
          onSkipToStep5Prescription={() => setCurrentStep(5)}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. STEP 4: UPLOAD LAB/IMAGING REPORTS & RE-CORRELATE (OR SKIP) */}
      {/* ========================================================================= */}
      {currentStep === 4 && step4SubMode === 'upload' && (
        <ConsultationStep3UploadDiagnostics
          activePet={activePet}
          caseSpecialty={caseSpecialty}
          labTestType={labTestType}
          setLabTestType={setLabTestType}
          labFileAttached={labFileAttached}
          setLabFileAttached={setLabFileAttached}
          labFileName={labFileName}
          setLabFileName={setLabFileName}
          bun={bun}
          setBun={setBun}
          creatinine={creatinine}
          setCreatinine={setCreatinine}
          wbc={wbc}
          setWbc={setWbc}
          rbc={rbc}
          setRbc={setRbc}
          hemoglobin={hemoglobin}
          setHemoglobin={setHemoglobin}
          hematocrit={hematocrit}
          setHematocrit={setHematocrit}
          platelets={platelets}
          setPlatelets={setPlatelets}
          alt={alt}
          setAlt={setAlt}
          alp={alp}
          setAlp={setAlp}
          bloodGlucoseVal={bloodGlucoseVal}
          setBloodGlucoseVal={setBloodGlucoseVal}
          labParametersText={labParametersText}
          setLabParametersText={setLabParametersText}
          labNotes={labNotes}
          setLabNotes={setLabNotes}
          xrayRegion={xrayRegion}
          setXrayRegion={setXrayRegion}
          xrayFileAttached={xrayFileAttached}
          setXrayFileAttached={setXrayFileAttached}
          xrayFileName={xrayFileName}
          setXrayFileName={setXrayFileName}
          xrayFindings={xrayFindings}
          setXrayFindings={setXrayFindings}
          usgRegion={usgRegion}
          setUsgRegion={setUsgRegion}
          usgFileAttached={usgFileAttached}
          setUsgFileAttached={setUsgFileAttached}
          usgFileName={usgFileName}
          setUsgFileName={setUsgFileName}
          usgFindings={usgFindings}
          setUsgFindings={setUsgFindings}
          ecgRhythm={ecgRhythm}
          setEcgRhythm={setEcgRhythm}
          cytologyFindings={cytologyFindings}
          setCytologyFindings={setCytologyFindings}
          onProceedToStep4={() => setStep4SubMode('synthesis')}
          onBackToStep2={() => setCurrentStep(3)}
          onSkipToPrescription={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 4 && step4SubMode === 'synthesis' && (
        <ConsultationStep4PostDiagnosticAISynthesis
          activePet={activePet}
          caseSpecialty={caseSpecialty}
          selectedSigns={selectedSigns}
          chiefComplaint={chiefComplaint}
          duration={duration}
          vitalsSummary={`Temp: ${temp}°${tempUnit}, HR: ${heartRate} bpm, RR: ${respiratoryRate} bpm, CRT: ${crt}, Hydration: ${hydration}, MM: ${mucousMembrane}`}
          bun={bun}
          creatinine={creatinine}
          wbc={wbc}
          hematocrit={hematocrit}
          labNotes={labNotes}
          xrayFindings={xrayFindings}
          xrayRegion={xrayRegion}
          usgFindings={usgFindings}
          usgRegion={usgRegion}
          finalDiagnosis={finalDiagnosis}
          setFinalDiagnosis={setFinalDiagnosis}
          suspectedCause={suspectedCause}
          setSuspectedCause={setSuspectedCause}
          treatmentPlan={treatmentPlan}
          setTreatmentPlan={setTreatmentPlan}
          aiSuggestedPrescription={aiSuggestedPrescription}
          setAiSuggestedPrescription={setAiSuggestedPrescription}
          onProceedToStep5={() => setCurrentStep(5)}
          onBackToStep3={() => setStep4SubMode('upload')}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. STEP 5: PRESCRIPTION (1st AI Generated, Write or Upload) */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <ConsultationStep5Prescription
          activePet={activePet}
          finalDiagnosis={finalDiagnosis}
          suspectedCause={suspectedCause}
          aiSuggestedPrescription={aiSuggestedPrescription}
          rxMode={rxMode}
          setRxMode={setRxMode}
          rxItems={rxItems}
          setRxItems={setRxItems}
          dietaryAdvice={dietaryAdvice}
          setDietaryAdvice={setDietaryAdvice}
          precautions={precautions}
          setPrecautions={setPrecautions}
          followUpDate={followUpDate}
          setFollowUpDate={setFollowUpDate}
          uploadedRxSlipUrl={uploadedRxSlipUrl}
          setUploadedRxSlipUrl={setUploadedRxSlipUrl}
          uploadedRxFileName={uploadedRxFileName}
          setUploadedRxFileName={setUploadedRxFileName}
          uploadedRxNotes={uploadedRxNotes}
          setUploadedRxNotes={setUploadedRxNotes}
          onPrintPrescription={() => setIsPrintModalOpen(true)}
          onSaveConsultation={handleSaveConsultation}
          onBackToStep4={() => setCurrentStep(4)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PET WEIGHT & AGE */}
      {/* ========================================================================= */}
      {isEditPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Update {activePet.name}'s Vitals
              </h3>
              <button
                type="button"
                onClick={() => setIsEditPetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={petWeightEdit}
                  onChange={(e) => setPetWeightEdit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={petAgeEdit}
                  onChange={(e) => setPetAgeEdit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditPetModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdatePetVitals}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OFFICIAL VETERINARY PRESCRIPTION PRINT SLIP */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 print:border-none print:shadow-none print:p-0">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Prescription Slip Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Prescription Body */}
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4">
                <div>
                  <h1 className="text-xl font-black text-teal-800 tracking-tight">
                    {activeClinicName}
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">{activeClinicAddress}</p>
                  <p className="text-[11px] text-slate-500">
                    Emergency Hotline: +1 (800) 555-VETS • 24/7 Surgical Care
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-serif italic font-black text-slate-900 text-base block">
                    Dr. {activeDoctorName}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Reg: {activeDoctorReg}</span>
                  <span className="text-[10px] text-teal-700 font-bold block mt-1 uppercase">
                    Veterinary Surgeon
                  </span>
                </div>
              </div>

              {/* Patient & Owner Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
                  <strong className="text-slate-900">{activePet.name}</strong> ({activePet.species})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Breed & Age</span>
                  <strong className="text-slate-900">{activePet.breed}</strong> • {activePet.age}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Body Weight</span>
                  <strong className="text-teal-700">{activePet.weight} kg</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Owner</span>
                  <strong className="text-slate-900">{activePet.ownerName}</strong>
                </div>
              </div>

              {/* Diagnosis & Suspected Cause */}
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs space-y-1">
                <div>
                  <strong className="text-teal-900">Diagnosis: </strong>
                  <span className="font-semibold text-slate-800">{finalDiagnosis}</span>
                </div>
                <div>
                  <strong className="text-amber-800">Suspected Etiology: </strong>
                  <span className="text-slate-700">{suspectedCause}</span>
                </div>
              </div>

              {/* Rx Symbol & Medication Table */}
              <div className="space-y-2">
                <div className="text-2xl font-serif font-black text-teal-700">℞</div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="pb-1.5 font-bold">#</th>
                      <th className="pb-1.5 font-bold">Medication</th>
                      <th className="pb-1.5 font-bold">Form</th>
                      <th className="pb-1.5 font-bold">Dose</th>
                      <th className="pb-1.5 font-bold">Frequency</th>
                      <th className="pb-1.5 font-bold">Duration</th>
                      <th className="pb-1.5 font-bold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rxItems.map((item, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-2 font-bold text-slate-900">{item.medicineName}</td>
                        <td className="py-2 text-slate-600">{item.form}</td>
                        <td className="py-2 font-bold text-teal-800">{item.dosage}</td>
                        <td className="py-2 text-slate-600">{item.frequency}</td>
                        <td className="py-2 font-semibold text-slate-700">{item.duration}</td>
                        <td className="py-2 text-slate-500 text-[11px]">{item.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice & Precautions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Dietary Advice</span>
                  <p className="text-slate-600 text-[11px]">{dietaryAdvice}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Owner Warning Signs</span>
                  <p className="text-slate-600 text-[11px]">{precautions}</p>
                </div>
              </div>

              {/* Signature & Date */}
              <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Consultation Date</span>
                  <span className="font-bold text-slate-800">
                    {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </span>
                  <span className="text-slate-400 block text-[10px] mt-1">Scheduled Follow-up</span>
                  <span className="font-bold text-teal-700">{followUpDate}</span>
                </div>

                <div className="text-center">
                  <div className="font-serif italic text-lg text-teal-800 border-b border-slate-400 pb-1 px-6">
                    Dr. {activeDoctorName}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Authorized Veterinarian Signature & Seal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
