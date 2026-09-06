import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Stethoscope,
  ShieldCheck,
  Bug,
  Activity,
  Heart,
  Thermometer,
  Eye,
  AlertTriangle,
  Plus,
  Save,
  FileText,
  Printer,
  ChevronRight,
  CheckCircle2,
  Check,
  Sparkles,
  Info,
  Clock,
  Calendar,
  AlertCircle,
  HelpCircle,
  Pill,
  Utensils,
  Home,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';
import { VaccinationRecord, DewormingRecord, PetRecord } from '../../types';

export const HistoryTakingModule: React.FC<{ onNavigateToConsultation?: () => void }> = ({ onNavigateToConsultation }) => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    vaccinations,
    dewormings,
    addVaccination,
    addDeworming,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [activeSubTab, setActiveSubTab] = useState<'symptoms' | 'vitals' | 'vaccines' | 'deworming' | 'essential' | 'summary'>('symptoms');

  // Signs and symptoms state
  const [chiefComplaint, setChiefComplaint] = useState('Acute lethargy, decreased appetite, and 2 episodes of vomiting');
  const [duration, setDuration] = useState('48 hours');
  const [onsetMode, setOnsetMode] = useState<'Sudden / Acute' | 'Gradual / Subacute' | 'Chronic / Intermittent'>('Sudden / Acute');
  const [progression, setProgression] = useState<'Worsening' | 'Static' | 'Fluctuating' | 'Improving'>('Worsening');
  const [triagePriority, setTriagePriority] = useState<'Urgent' | 'Standard' | 'Emergency' | 'Non-Urgent'>('Urgent');

  // Systemic signs flags & notes
  const [giVomiting, setGiVomiting] = useState(true);
  const [giVomitingFreq, setGiVomitingFreq] = useState('2-3 times/day with yellow bile');
  const [giDiarrhea, setGiDiarrhea] = useState(false);
  const [giAppetite, setGiAppetite] = useState<'Normal' | 'Reduced / Hyporexia' | 'Anorexia' | 'Increased'>('Reduced / Hyporexia');
  
  const [respCough, setRespCough] = useState(false);
  const [respSneezing, setRespSneezing] = useState(false);
  const [respNasalDischarge, setRespNasalDischarge] = useState(false);
  const [respDyspnea, setRespDyspnea] = useState(false);

  const [cardioExerciseIntolerance, setCardioExerciseIntolerance] = useState(true);
  const [cardioSyncope, setCardioSyncope] = useState(false);

  const [dermPruritus, setDermPruritus] = useState(2); // 0-10
  const [dermAlopecia, setDermAlopecia] = useState(false);
  const [dermOtitis, setDermOtitis] = useState(false);
  const [dermTicks, setDermTicks] = useState(false);

  const [musculoLameness, setMusculoLameness] = useState(false);
  const [musculoStiffness, setMusculoStiffness] = useState(false);

  const [neuroMentation, setNeuroMentation] = useState<'Alert & Active' | 'Dull / Depressed' | 'Stuporous' | 'Disoriented'>('Dull / Depressed');
  const [neuroSeizures, setNeuroSeizures] = useState(false);

  const [uroUrination, setUroUrination] = useState<'Normal' | 'Increased / Polyuria' | 'Straining / Dysuria' | 'Blood / Hematuria'>('Normal');
  const [uroWaterIntake, setUroWaterIntake] = useState<'Normal' | 'Increased / Polydipsia' | 'Decreased' | 'None'>('Normal');

  // Clinical Parameters & Vitals
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [tempVal, setTempVal] = useState(101.8);
  const [heartRate, setHeartRate] = useState(115);
  const [respRate, setRespRate] = useState(28);
  const [pulseQuality, setPulseQuality] = useState<'Strong & Synchronous' | 'Normal' | 'Weak / Thready' | 'Bounding'>('Normal');
  const [crt, setCrt] = useState<'< 2 sec (Normal)' | 'Prolonged (2-3 sec)' | 'Severely Prolonged (>3 sec)'>('< 2 sec (Normal)');
  const [mucousMembrane, setMucousMembrane] = useState<'Pink (Normal)' | 'Pale / Anemic' | 'Cyanotic' | 'Icteric / Jaundiced' | 'Congested / Red'>('Pink (Normal)');
  const [bcs, setBcs] = useState('5/9 (Ideal)');
  const [hydrationStatus, setHydrationStatus] = useState<'Normal (<5%)' | 'Mild (5%)' | 'Moderate (7-8%)' | 'Severe (>10%)'>('Mild (5%)');
  const [systolicBP, setSystolicBP] = useState(125);
  const [diastolicBP, setDiastolicBP] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [bloodGlucose, setBloodGlucose] = useState(105);
  const [painScore, setPainScore] = useState(2); // 0-10

  const applyVitalsPreset = (preset: 'normal' | 'fever' | 'shock') => {
    const isCat =
      (selectedPet?.species || '').toLowerCase().includes('cat') ||
      (selectedPet?.species || '').toLowerCase().includes('fel');
    if (preset === 'normal') {
      setTempVal(tempUnit === 'F' ? 101.5 : 38.6);
      setHeartRate(isCat ? 180 : 95);
      setRespRate(22);
      setPulseQuality('Normal');
      setCrt('< 2 sec (Normal)');
      setMucousMembrane('Pink (Normal)');
      setHydrationStatus('Normal (<5%)');
      setBcs('5/9 (Ideal)');
      setPainScore(0);
      setSystolicBP(isCat ? 125 : 120);
      setDiastolicBP(80);
      setSpo2(99);
      setBloodGlucose(isCat ? 105 : 95);
    } else if (preset === 'fever') {
      setTempVal(tempUnit === 'F' ? 103.8 : 39.9);
      setHeartRate(isCat ? 220 : 145);
      setRespRate(38);
      setPulseQuality('Strong & Synchronous');
      setCrt('Prolonged (2-3 sec)');
      setMucousMembrane('Congested / Red');
      setHydrationStatus('Moderate (7-8%)');
      setPainScore(3);
      setSystolicBP(135);
      setDiastolicBP(85);
      setSpo2(97);
      setBloodGlucose(115);
    } else if (preset === 'shock') {
      setTempVal(tempUnit === 'F' ? 98.2 : 36.8);
      setHeartRate(isCat ? 140 : 175);
      setRespRate(46);
      setPulseQuality('Weak / Thready');
      setCrt('Severely Prolonged (>3 sec)');
      setMucousMembrane('Pale / Anemic');
      setHydrationStatus('Severe (>10%)');
      setPainScore(5);
      setSystolicBP(80);
      setDiastolicBP(50);
      setSpo2(91);
      setBloodGlucose(65);
    }
  };

  // Essential Background Parameters
  const [dietType, setDietType] = useState('Commercial Dry Kibble + occasional wet food');
  const [feedingFreq, setFeedingFreq] = useState('Twice Daily (Morning & Evening)');
  const [environment, setEnvironment] = useState('Indoor home with daily backyard & leashed walks');
  const [toxinExposure, setToxinExposure] = useState('No known rodenticide or human drug ingestion. Possible trash can access.');
  const [reproductiveStatus, setReproductiveStatus] = useState(selectedPet?.sex.includes('Neutered') || selectedPet?.sex.includes('Spayed') ? 'Neutered / Spayed' : 'Intact');
  const [knownAllergies, setKnownAllergies] = useState('No known drug allergies reported');
  const [currentMeds, setCurrentMeds] = useState('Monthly Flea/Tick chewable (NexGard)');
  const [pastMedicalHistory, setPastMedicalHistory] = useState('Mild puppy gastroenteritis at 6 months; fully resolved.');

  // Quick Add Vaccine / Deworming Modals
  const [isAddVaxOpen, setIsAddVaxOpen] = useState(false);
  const [vaxForm, setVaxForm] = useState({
    vaccineName: 'DHPP + Rabies Booster',
    targetDiseases: 'Distemper, Hepatitis, Parvovirus, Parainfluenza, Rabies',
    batchNumber: 'VAC-2026-B88',
    manufacturer: 'Zoetis / Boehringer',
    route: 'Subcutaneous' as const,
  });

  const [isAddDewormOpen, setIsAddDewormOpen] = useState(false);
  const [dewormForm, setDewormForm] = useState({
    drugUsed: 'Drontal Plus (Praziquantel + Pyrantel + Febantel)',
    activeIngredients: 'Praziquantel 50mg, Pyrantel embonate 144mg, Febantel 150mg',
    dosage: '1 tablet per 10kg body weight',
  });

  // Filtered pet records
  const petVaccines = vaccinations.filter((v) => v.petId === selectedPet?.id);
  const petDewormings = dewormings.filter((d) => d.petId === selectedPet?.id);

  // Compute Vital Status Indicators
  const getTempStatus = () => {
    const f = tempUnit === 'F' ? tempVal : (tempVal * 9) / 5 + 32;
    if (f < 99.5) return { label: 'Hypothermic', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (f <= 102.5) return { label: 'Normal Body Temp', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (f <= 103.5) return { label: 'Mild Pyrexia (Fever)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'High Fever / Hyperthermia', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const getHRStatus = () => {
    const isCat = selectedPet?.species.includes('Feline');
    const normalMin = isCat ? 140 : 70;
    const normalMax = isCat ? 220 : 140;
    if (heartRate < normalMin) return { label: 'Bradycardia', color: 'text-blue-600' };
    if (heartRate > normalMax) return { label: 'Tachycardia', color: 'text-rose-600' };
    return { label: 'Normal HR', color: 'text-emerald-600' };
  };

  const handleSaveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    addVaccination({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      vaccineName: vaxForm.vaccineName,
      targetDiseases: vaxForm.targetDiseases,
      batchNumber: vaxForm.batchNumber,
      manufacturer: vaxForm.manufacturer,
      administeredDate: today,
      nextDueDate: nextYear.toISOString().split('T')[0],
      administeredBy: adminProfile.name || 'Dr. Attending',
      veterinarianName: adminProfile.name || 'Dr. Attending',
      vetRegNumber: adminProfile.registrationNumber || 'VET-REG',
      route: vaxForm.route,
      status: 'Completed',
    });

    setIsAddVaxOpen(false);
    showNotification(`Vaccine recorded for ${selectedPet.name}`, 'success');
  };

  const handleSaveDeworming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    const today = new Date().toISOString().split('T')[0];
    const nextThreeMonths = new Date();
    nextThreeMonths.setMonth(nextThreeMonths.getMonth() + 3);

    addDeworming({
      petId: selectedPet.id,
      petName: selectedPet.name,
      drugUsed: dewormForm.drugUsed,
      activeIngredients: dewormForm.activeIngredients,
      dosage: dewormForm.dosage,
      administeredDate: today,
      nextDueDate: nextThreeMonths.toISOString().split('T')[0],
      administeredBy: adminProfile.name || 'Dr. Attending',
      veterinarianName: adminProfile.name || 'Dr. Attending',
      vetRegNumber: adminProfile.registrationNumber || 'VET-REG',
      status: 'Completed',
    });

    setIsAddDewormOpen(false);
    showNotification(`Deworming administered to ${selectedPet.name}`, 'success');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-md">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Clinical History Taking & Patient Intake
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Live Intake Suite
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive anamnesis, vital parameters, vaccination, deworming, review of systems & background history.
            </p>
          </div>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Active Patient:
          </label>
          <select
            value={selectedPet?.id || ''}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          >
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species.split(' ')[0]} - {pet.breed}) • Owner: {pet.ownerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Profile Bar */}
      {selectedPet && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-5 rounded-3xl border border-teal-500/30 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {selectedPet.photo ? (
                <img
                  src={selectedPet.photo}
                  alt={selectedPet.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400/60 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-teal-800 text-teal-200 flex items-center justify-center font-bold text-lg">
                  {selectedPet.name[0]}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white">{selectedPet.name}</h2>
                  <SpeciesBadge species={selectedPet.species} />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
                    {selectedPet.identificationNumber}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-teal-200/80 mt-1 flex-wrap">
                  <span>Breed: <strong>{selectedPet.breed}</strong></span>
                  <span>•</span>
                  <span>Age: <strong>{selectedPet.age}</strong></span>
                  <span>•</span>
                  <span>Weight: <strong>{selectedPet.weight} kg</strong></span>
                  <span>•</span>
                  <span>Sex: <strong>{selectedPet.sex}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t sm:border-t-0 sm:border-l border-teal-800/80 sm:pl-4 pt-3 sm:pt-0 text-xs">
              <div>
                <div className="text-teal-300/80 text-[10px] uppercase font-bold">Owner / Contact</div>
                <div className="font-bold text-white">{selectedPet.ownerName}</div>
                <div className="text-teal-200/70 text-[11px] font-mono">{selectedPet.ownerPhone}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs for History Taking */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'symptoms', label: '1. Signs & Symptoms Review', icon: Stethoscope },
          { id: 'vitals', label: '2. Clinical Parameters & Vitals', icon: Activity },
          { id: 'vaccines', label: '3. Vaccination History', icon: ShieldCheck, badge: petVaccines.length },
          { id: 'deworming', label: '4. Deworming Schedule', icon: Bug, badge: petDewormings.length },
          { id: 'essential', label: '5. Essential Parameters & Diet', icon: Utensils },
          { id: 'summary', label: '6. Case Sheet & Intake Summary', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-teal-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: SIGNS & SYMPTOMS REVIEW */}
      {activeSubTab === 'symptoms' && (
        <div className="space-y-6">
          {/* Chief Complaint & Timeline */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-teal-600" />
              Chief Complaint & Onset Chronology
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Presenting Complaint / Owner Observation
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Vomiting since yesterday, not eating food, lethargic..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 48 hours / 3 days"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Triage Priority
                  </label>
                  <select
                    value={triagePriority}
                    onChange={(e) => setTriagePriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Non-Urgent">Level 5 - Non-Urgent (Routine)</option>
                    <option value="Standard">Level 4 - Standard Consultation</option>
                    <option value="Urgent">Level 3 - Urgent (Same day care)</option>
                    <option value="Emergency">Level 2 - Emergent (Immediate attention)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mode of Onset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sudden / Acute', 'Gradual / Subacute', 'Chronic / Intermittent'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setOnsetMode(mode as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                        onsetMode === mode
                          ? 'bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-800 dark:text-teal-200'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Progression
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Worsening', 'Static', 'Fluctuating', 'Improving'].map((prog) => (
                    <button
                      key={prog}
                      type="button"
                      onClick={() => setProgression(prog as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                        progression === prog
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {prog}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Organ Systems Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Gastrointestinal */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🍽️ Gastrointestinal System
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">GI Tract</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giVomiting}
                    onChange={(e) => setGiVomiting(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Vomiting / Emesis</span>
                </label>
                {giVomiting && (
                  <input
                    type="text"
                    value={giVomitingFreq}
                    onChange={(e) => setGiVomitingFreq(e.target.value)}
                    placeholder="Vomiting frequency and character (bile, food, blood)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                )}

                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giDiarrhea}
                    onChange={(e) => setGiDiarrhea(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Diarrhea / Loose Stools</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Appetite Level</label>
                  <select
                    value={giAppetite}
                    onChange={(e) => setGiAppetite(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Normal">Normal Appetite</option>
                    <option value="Reduced / Hyporexia">Reduced / Hyporexia</option>
                    <option value="Anorexia">Complete Anorexia (Not eating)</option>
                    <option value="Increased">Increased (Polyphagia)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Respiratory */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🫁 Respiratory & ENT
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Lungs & Airways</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={respCough}
                    onChange={(e) => setRespCough(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold">Coughing</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={respSneezing}
                    onChange={(e) => setRespSneezing(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold">Sneezing</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={respNasalDischarge}
                    onChange={(e) => setRespNasalDischarge(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold">Nasal Discharge</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={respDyspnea}
                    onChange={(e) => setRespDyspnea(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-semibold">Labored Breathing</span>
                </label>
              </div>
            </div>

            {/* 3. Dermatological */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🐾 Skin, Coat & Ears
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Dermatology</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Pruritus / Itchiness Score (0 to 10):</span>
                  <span className="text-teal-600 font-extrabold">{dermPruritus} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={dermPruritus}
                  onChange={(e) => setDermPruritus(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-semibold cursor-pointer">
                  <input type="checkbox" checked={dermAlopecia} onChange={(e) => setDermAlopecia(e.target.checked)} />
                  <span>Hair Loss</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-semibold cursor-pointer">
                  <input type="checkbox" checked={dermOtitis} onChange={(e) => setDermOtitis(e.target.checked)} />
                  <span>Ear Shaking</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-semibold cursor-pointer">
                  <input type="checkbox" checked={dermTicks} onChange={(e) => setDermTicks(e.target.checked)} />
                  <span>Fleas / Ticks</span>
                </label>
              </div>
            </div>

            {/* 4. Neurological & Mentation */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🧠 Neurological & Mentation
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Mental State</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Patient Mentation</label>
                <select
                  value={neuroMentation}
                  onChange={(e) => setNeuroMentation(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  <option value="Alert & Active">Alert, Active & Responsive</option>
                  <option value="Dull / Depressed">Dull / Depressed / Lethargic</option>
                  <option value="Stuporous">Stuporous (Only responds to noxious stimuli)</option>
                  <option value="Disoriented">Disoriented / Head pressing</option>
                </select>
              </div>

              <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={neuroSeizures}
                  onChange={(e) => setNeuroSeizures(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-xs font-semibold">History of Seizures / Tremors / Incoordination</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveSubTab('vitals')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Next: Record Clinical Parameters & Vitals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: CLINICAL PARAMETERS & VITALS */}
      {activeSubTab === 'vitals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Objective Clinical Parameters & Vitals
                </h3>
                <p className="text-xs text-slate-500">Real-time physiological measurements and range validations</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => applyVitalsPreset('normal')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Normal Vitals</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyVitalsPreset('fever')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950 transition-colors"
                  >
                    Febrile
                  </button>
                  <button
                    type="button"
                    onClick={() => applyVitalsPreset('shock')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                  >
                    Critical
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTempUnit('F')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tempUnit === 'F' ? 'bg-white dark:bg-slate-700 text-teal-700 shadow-xs' : 'text-slate-500'}`}
                  >
                    °F
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit('C')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tempUnit === 'C' ? 'bg-white dark:bg-slate-700 text-teal-700 shadow-xs' : 'text-slate-500'}`}
                  >
                    °C
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Temperature */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-rose-500" /> Temperature</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getTempStatus().color}`}>
                    {getTempStatus().label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={tempVal}
                    onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white"
                  />
                  <span className="text-sm font-bold text-slate-500">°{tempUnit}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Normal: 100.5 - 102.5 °F (38.0 - 39.2 °C)</div>
              </div>

              {/* 2. Heart Rate */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> Heart Rate</span>
                  <span className={`text-[10px] font-bold ${getHRStatus().color}`}>{getHRStatus().label}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-500">bpm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Canine: 70-140 | Feline: 140-220</div>
              </div>

              {/* 3. Respiratory Rate */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-teal-500" /> Resp Rate</span>
                  <span className="text-[10px] font-bold text-teal-600">{respRate > 35 ? 'Tachypnea' : 'Normal'}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={respRate}
                    onChange={(e) => setRespRate(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-500">brpm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Normal: 15 - 30 breaths/min</div>
              </div>

              {/* 4. Pulse Quality */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pulse Quality
                </span>
                <select
                  value={pulseQuality}
                  onChange={(e) => setPulseQuality(e.target.value as any)}
                  className="w-full mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="Strong & Synchronous">Strong & Synchronous</option>
                  <option value="Normal">Normal</option>
                  <option value="Weak / Thready">Weak / Thready</option>
                  <option value="Bounding">Bounding</option>
                </select>
                <div className="text-[10px] text-slate-400 mt-2">Femoral pulse palpation</div>
              </div>
            </div>

            {/* Row 2: Perfusion & Hydration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mucous Membranes
                </label>
                <select
                  value={mucousMembrane}
                  onChange={(e) => setMucousMembrane(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="Pink (Normal)">Pink (Normal Gingiva)</option>
                  <option value="Pale / Anemic">Pale / Anemic (Loss of perfusion/blood)</option>
                  <option value="Cyanotic">Cyanotic (Blue/Hypoxemia)</option>
                  <option value="Icteric / Jaundiced">Icteric / Jaundiced (Hyperbilirubinemia)</option>
                  <option value="Congested / Red">Congested / Brick Red (Sepsis/Heat stroke)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Capillary Refill Time (CRT)
                </label>
                <select
                  value={crt}
                  onChange={(e) => setCrt(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="< 2 sec (Normal)">&lt; 2 sec (Normal)</option>
                  <option value="Prolonged (2-3 sec)">Prolonged (2-3 sec - Vasoconstriction)</option>
                  <option value="Severely Prolonged (>3 sec)">Severely Prolonged (&gt;3 sec - Shock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hydration Status / Skin Turgor
                </label>
                <select
                  value={hydrationStatus}
                  onChange={(e) => setHydrationStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="Normal (<5%)">Normal (&lt; 5% Dehydration)</option>
                  <option value="Mild (5%)">Mild (5% - Slight skin tent delay)</option>
                  <option value="Moderate (7-8%)">Moderate (7-8% - Dry gums, delayed turgor)</option>
                  <option value="Severe (>10%)">Severe (&gt; 10% - Sunken eyes, shock risk)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Diagnostic Numbers (BP, SpO2, Glucose, BCS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Blood Pressure (mmHg)</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={diastolicBP}
                    onChange={(e) => setDiastolicBP(parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">SpO2 Oxygen Saturation</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(parseInt(e.target.value) || 0)}
                    className="w-20 p-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Blood Glucose</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(parseInt(e.target.value) || 0)}
                    className="w-20 p-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
                  />
                  <span className="text-xs font-bold text-slate-500">mg/dL</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Body Condition (BCS)</span>
                <select
                  value={bcs}
                  onChange={(e) => setBcs(e.target.value)}
                  className="w-full mt-1 p-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold"
                >
                  <option value="1/9 (Emaciated)">1/9 (Emaciated)</option>
                  <option value="3/9 (Underweight)">3/9 (Underweight)</option>
                  <option value="5/9 (Ideal)">5/9 (Ideal Condition)</option>
                  <option value="7/9 (Overweight)">7/9 (Overweight)</option>
                  <option value="9/9 (Obese)">9/9 (Severely Obese)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveSubTab('symptoms')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Symptoms
            </button>
            <button
              onClick={() => setActiveSubTab('vaccines')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Next: Review Vaccination Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: VACCINATION STATUS */}
      {activeSubTab === 'vaccines' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Immunization & Vaccination Records for {selectedPet?.name}
                </h3>
                <p className="text-xs text-slate-500">Core vaccines, anti-rabies, and booster history verification</p>
              </div>
              <button
                onClick={() => setIsAddVaxOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Log Vaccine Administration
              </button>
            </div>

            {petVaccines.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Prior Vaccinations Recorded</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Log this patient's immunization history or administer the initial puppy/kitten core vaccine protocol today.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddVaxOpen(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Vaccine Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Vaccine & Coverage</th>
                      <th className="py-3 px-4">Administered Date</th>
                      <th className="py-3 px-4">Next Booster Due</th>
                      <th className="py-3 px-4">Batch / Manufacturer</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {petVaccines.map((vax) => (
                      <tr key={vax.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          <div>{vax.vaccineName}</div>
                          <div className="text-[10px] text-slate-400">{vax.targetDiseases}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {vax.administeredDate}
                        </td>
                        <td className="py-3 px-4 text-teal-600 dark:text-teal-400 font-bold font-mono text-[11px]">
                          {vax.nextDueDate}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          <div>{vax.batchNumber}</div>
                          <div className="text-[10px]">{vax.manufacturer}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {vax.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveSubTab('vitals')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Vitals
            </button>
            <button
              onClick={() => setActiveSubTab('deworming')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Next: Review Deworming Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: DEWORMING SCHEDULE */}
      {activeSubTab === 'deworming' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bug className="w-4 h-4 text-teal-600" />
                  Deworming & Parasite Control Protocols for {selectedPet?.name}
                </h3>
                <p className="text-xs text-slate-500">Endoparasite prophylactic history, target helminths, and scheduled repeat doses</p>
              </div>
              <button
                onClick={() => setIsAddDewormOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Log Deworming Dose
              </button>
            </div>

            {petDewormings.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <Bug className="w-10 h-10 text-amber-500 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Deworming Administered Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Regular deworming every 3 months is essential for preventing zoonotic nematodes and cestodes.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddDewormOpen(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Administer Dewormer
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Anthelmintic Drug</th>
                      <th className="py-3 px-4">Administered Date</th>
                      <th className="py-3 px-4">Next Due Date</th>
                      <th className="py-3 px-4">Dosage / Details</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {petDewormings.map((dew) => (
                      <tr key={dew.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          <div>{dew.drugUsed}</div>
                          <div className="text-[10px] text-slate-400">{dew.activeIngredients}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {dew.administeredDate}
                        </td>
                        <td className="py-3 px-4 text-teal-600 dark:text-teal-400 font-bold font-mono text-[11px]">
                          {dew.nextDueDate}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{dew.dosage}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {dew.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveSubTab('vaccines')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Vaccines
            </button>
            <button
              onClick={() => setActiveSubTab('essential')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Next: Essential Parameters & Diet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: ESSENTIAL PARAMETERS & BACKGROUND */}
      {activeSubTab === 'essential' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              Dietary, Environmental & Essential Anamnesis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Diet & Feeding */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" /> Feeding & Diet Details
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Diet Regimen</label>
                  <input
                    type="text"
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Feeding Frequency</label>
                  <input
                    type="text"
                    value={feedingFreq}
                    onChange={(e) => setFeedingFreq(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Environment & Housing */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-indigo-500" /> Living Environment & Habitat
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Housing & Activity</label>
                  <input
                    type="text"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Toxin / Foreign Body Exposure Risk</label>
                  <input
                    type="text"
                    value={toxinExposure}
                    onChange={(e) => setToxinExposure(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Reproductive & Allergies */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Reproductive & Allergies
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Reproductive Status</label>
                  <input
                    type="text"
                    value={reproductiveStatus}
                    onChange={(e) => setReproductiveStatus(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Drug Allergies / Hypersensitivity</label>
                  <input
                    type="text"
                    value={knownAllergies}
                    onChange={(e) => setKnownAllergies(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* Medical History & Current Drugs */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-500" /> Current Medications & Past Illness
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Ongoing Drugs / Supplements</label>
                  <input
                    type="text"
                    value={currentMeds}
                    onChange={(e) => setCurrentMeds(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Past Surgical / Medical History</label>
                  <input
                    type="text"
                    value={pastMedicalHistory}
                    onChange={(e) => setPastMedicalHistory(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveSubTab('deworming')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Deworming
            </button>
            <button
              onClick={() => setActiveSubTab('summary')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>View Case Sheet & Complete Intake</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 6: CASE SHEET & INTAKE SUMMARY */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 print:border-none print:shadow-none">
            {/* Case Sheet Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                  Clinical Anamnesis & Intake Case Sheet
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {adminProfile.clinicName || 'Veterinary Clinical Center'}
                </h2>
                <p className="text-xs text-slate-500">
                  Doctor: {adminProfile.name || 'Dr. Attending'} • Reg: {adminProfile.registrationNumber || 'VET-REG'} • Date: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrintSummary}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Case Sheet
                </button>
                {onNavigateToConsultation && (
                  <button
                    onClick={onNavigateToConsultation}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Stethoscope className="w-4 h-4" /> Proceed to SOAP Consultation
                  </button>
                )}
              </div>
            </div>

            {/* Patient Header Block */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Patient Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPet?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Species & Breed</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPet?.species.split(' ')[0]} • {selectedPet?.breed}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Age & Body Weight</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPet?.age} • {selectedPet?.weight} kg</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Owner Contact</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPet?.ownerName} ({selectedPet?.ownerPhone})</span>
              </div>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Chief Complaint */}
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-2">
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-teal-600" /> Presenting History
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {chiefComplaint}
                </p>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                  Duration: {duration} • Onset: {onsetMode} • Progression: {progression}
                </div>
              </div>

              {/* 2. Key Vitals */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" /> Vitals & Parameters
                </span>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <strong className="text-rose-600 font-bold">{tempVal} °{tempUnit} ({getTempStatus().label})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Heart Rate:</span>
                    <strong>{heartRate} bpm ({getHRStatus().label})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Resp Rate:</span>
                    <strong>{respRate} breaths/min</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CRT & MM:</span>
                    <strong>{crt.split(' ')[0]} • {mucousMembrane.split(' ')[0]}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hydration & BCS:</span>
                    <strong>{hydrationStatus.split(' ')[0]} • {bcs.split(' ')[0]}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Prophylaxis & Background */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Prophylaxis & Allergies
                </span>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    Vaccinations: <strong className="text-emerald-600">{petVaccines.length} on record</strong>
                  </div>
                  <div>
                    Deworming: <strong className="text-emerald-600">{petDewormings.length} on record</strong>
                  </div>
                  <div>
                    Allergies: <strong className="text-rose-600">{knownAllergies}</strong>
                  </div>
                  <div className="truncate">
                    Diet: <span className="text-slate-600 dark:text-slate-400">{dietType}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                History intake recorded successfully. Ready for clinical examination, SOAP notes, lab workups, or prescription dispensing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG VACCINATION */}
      {isAddVaxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Administer Vaccine to {selectedPet?.name}
              </h3>
              <button onClick={() => setIsAddVaxOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveVaccine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vaccine Name</label>
                <input
                  type="text"
                  required
                  value={vaxForm.vaccineName}
                  onChange={(e) => setVaxForm({ ...vaxForm, vaccineName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Diseases</label>
                <input
                  type="text"
                  required
                  value={vaxForm.targetDiseases}
                  onChange={(e) => setVaxForm({ ...vaxForm, targetDiseases: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Batch / Lot #</label>
                  <input
                    type="text"
                    required
                    value={vaxForm.batchNumber}
                    onChange={(e) => setVaxForm({ ...vaxForm, batchNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={vaxForm.manufacturer}
                    onChange={(e) => setVaxForm({ ...vaxForm, manufacturer: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVaxOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold"
                >
                  Save & Certify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG DEWORMING */}
      {isAddDewormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-teal-600" />
                Administer Deworming to {selectedPet?.name}
              </h3>
              <button onClick={() => setIsAddDewormOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveDeworming} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drug Name / Brand</label>
                <input
                  type="text"
                  required
                  value={dewormForm.drugUsed}
                  onChange={(e) => setDewormForm({ ...dewormForm, drugUsed: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Active Principle</label>
                <input
                  type="text"
                  required
                  value={dewormForm.activeIngredients}
                  onChange={(e) => setDewormForm({ ...dewormForm, activeIngredients: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dosage Given</label>
                <input
                  type="text"
                  required
                  value={dewormForm.dosage}
                  onChange={(e) => setDewormForm({ ...dewormForm, dosage: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDewormOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold"
                >
                  Confirm Administration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
