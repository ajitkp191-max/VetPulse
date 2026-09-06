import React, { useState } from 'react';
import {
  Clock,
  Thermometer,
  Heart,
  Activity,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  Scissors,
  Baby,
  Check,
  Plus,
  X,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';
import { SpeciesType } from '../../../types';

export type CaseSpecialty = 'Gynecology' | 'Medicine' | 'Surgery';

interface Step1HistoryProps {
  activePet: {
    id: string;
    name: string;
    species: SpeciesType | string;
    breed: string;
    age: string;
    weight: number;
    gender?: string;
  };
  caseSpecialty: CaseSpecialty;
  setCaseSpecialty: (val: CaseSpecialty) => void;
  selectedSigns: string[];
  setSelectedSigns: React.Dispatch<React.SetStateAction<string[]>>;

  // History & Doctor's written text
  chiefComplaint: string;
  setChiefComplaint: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  onsetMode: 'Sudden / Acute' | 'Gradual / Progressive' | 'Chronic / Intermittent';
  setOnsetMode: (val: 'Sudden / Acute' | 'Gradual / Progressive' | 'Chronic / Intermittent') => void;
  progression?: 'Worsening' | 'Static' | 'Fluctuating' | 'Improving';
  setProgression?: (val: 'Worsening' | 'Static' | 'Fluctuating' | 'Improving') => void;
  triageUrgency: 'Routine' | 'Urgent' | 'Emergency' | 'Critical';
  setTriageUrgency: (val: 'Routine' | 'Urgent' | 'Emergency' | 'Critical') => void;
  dietDetails?: string;
  setDietDetails?: (val: string) => void;
  toxinExposure?: string;
  setToxinExposure?: (val: string) => void;
  preventiveStatus?: string;
  setPreventiveStatus?: (val: string) => void;
  generalNotes?: string;
  setGeneralNotes?: (val: string) => void;

  // Vitals
  tempUnit: 'F' | 'C';
  setTempUnit: (val: 'F' | 'C') => void;
  temp: number;
  setTemp: (val: number) => void;
  heartRate: number;
  setHeartRate: (val: number) => void;
  respiratoryRate: number;
  setRespiratoryRate: (val: number) => void;
  pulseQuality?: 'Strong & Synchronous' | 'Moderate' | 'Weak & Thready' | 'Bounding';
  setPulseQuality?: (val: 'Strong & Synchronous' | 'Moderate' | 'Weak & Thready' | 'Bounding') => void;
  crt: string;
  setCrt: (val: string) => void;
  mucousMembrane: 'Pink' | 'Pale' | 'Cyanotic' | 'Icteric' | 'Congested / Injected';
  setMucousMembrane: (val: 'Pink' | 'Pale' | 'Cyanotic' | 'Icteric' | 'Congested / Injected') => void;
  hydration: 'Normal (<5%)' | 'Mild (5%)' | 'Moderate (7-8%)' | 'Severe (>10%)';
  setHydration: (val: 'Normal (<5%)' | 'Mild (5%)' | 'Moderate (7-8%)' | 'Severe (>10%)') => void;
  bcs: string;
  setBcs: (val: string) => void;
  painScore: string;
  setPainScore: (val: string) => void;
  bloodPressure?: string;
  setBloodPressure?: (val: string) => void;
  bloodGlucose?: string;
  setBloodGlucose?: (val: string) => void;

  // Physical exam
  physicalExamNotes?: string;
  setPhysicalExamNotes?: (val: string) => void;

  // Navigation
  onProceedToStep2: () => void;
}

export const ConsultationStep1History: React.FC<Step1HistoryProps> = ({
  activePet,
  caseSpecialty,
  setCaseSpecialty,
  selectedSigns,
  setSelectedSigns,
  chiefComplaint,
  setChiefComplaint,
  duration,
  setDuration,
  onsetMode,
  setOnsetMode,
  progression = 'Worsening',
  setProgression = (_val: any) => {},
  triageUrgency,
  setTriageUrgency,
  dietDetails = '',
  setDietDetails = (_val: string) => {},
  toxinExposure = '',
  setToxinExposure = (_val: string) => {},
  preventiveStatus = '',
  setPreventiveStatus = (_val: string) => {},
  generalNotes = '',
  setGeneralNotes = (_val: string) => {},
  tempUnit,
  setTempUnit,
  temp,
  setTemp,
  heartRate,
  setHeartRate,
  respiratoryRate,
  setRespiratoryRate,
  pulseQuality = 'Strong & Synchronous',
  setPulseQuality = (_val: any) => {},
  crt,
  setCrt,
  mucousMembrane,
  setMucousMembrane,
  hydration,
  setHydration,
  bcs,
  setBcs,
  painScore,
  setPainScore,
  bloodPressure = '120/80 mmHg',
  setBloodPressure = (_val: string) => {},
  bloodGlucose = '100 mg/dL',
  setBloodGlucose = (_val: string) => {},
  physicalExamNotes = '',
  setPhysicalExamNotes = (_val: string) => {},
  onProceedToStep2,
}) => {
  const [customSignInput, setCustomSignInput] = useState('');
  const [signSearchFilter, setSignSearchFilter] = useState('');

  // Toggle selection of clinical sign
  const toggleSign = (sign: string) => {
    setSelectedSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    );
  };

  const handleAddCustomSign = () => {
    const trimmed = customSignInput.trim();
    if (trimmed && !selectedSigns.includes(trimmed)) {
      setSelectedSigns((prev) => [...prev, trimmed]);
      setCustomSignInput('');
    }
  };

  // Curated, high-yield signs by specialty for fast clean doctor selection
  const specialtySigns: Record<CaseSpecialty, string[]> = {
    Gynecology: [
      'Vaginal discharge (purulent / foul)',
      'Bloody / serosanguinous vulvar discharge',
      'Intact female (unspayed)',
      'Polydipsia & Polyuria (PU/PD)',
      'Abdominal distension / palpable uterine loop',
      'Lethargy / Anorexia',
      'Unproductive labor contractions (>30 min)',
      'Weak intermittent labor (>2 hrs)',
      'Green/black lochia before 1st pup',
      'Swollen painful hot mammary glands',
      'Estrus in past 4-8 weeks',
      'Vaginal prolapse / mucosal mass',
    ],
    Medicine: [
      'Vomiting / Emesis (food or bile)',
      'Diarrhea / Loose watery stool',
      'Bloody diarrhea (melena / hematochezia)',
      'Anorexia / Inappetence',
      'Polydipsia & Polyuria (PU/PD)',
      'Lethargy / Depression',
      'Coughing (harsh dry hacking)',
      'Dyspnea / Tachypnea (rapid breathing)',
      'Nasal discharge / Sneezing',
      'Fever / Pyrexia',
      'Pale gums / Mucous membranes',
      'Petechiae / Ecchymoses / Bleeding',
      'Straining to urinate / Dysuria / Hematuria',
      'Cranial abdominal guarding / Pain',
      'Weight loss / Muscle wasting',
      'Pruritus / Severe itching / Alopecia',
    ],
    Surgery: [
      'Acute non-weight bearing lameness / Limp',
      'Localized limb swelling / Bone crepitus',
      'Non-productive retching / Bloat / Tympanic abdomen',
      'Persistent projectile vomiting (foreign body risk)',
      'Cranial abdominal pain / Guarding',
      'Laceration / Trauma / Soft tissue wound',
      'Suspected fracture / Joint dislocation',
      'Visible palpable subcutaneous mass / Hernia',
      'Severe pain on spinal palpation / Arched back',
      'Weakness in hind limbs / Ataxia / Knuckling',
    ],
  };

  const currentSpecialtySigns = specialtySigns[caseSpecialty] || [];
  const filteredSigns = signSearchFilter
    ? currentSpecialtySigns.filter((s) => s.toLowerCase().includes(signSearchFilter.toLowerCase()))
    : currentSpecialtySigns;

  // Systemic examination review states
  const [systemExamStatus, setSystemExamStatus] = useState<Record<string, 'Normal' | 'Abnormal' | 'WNL'>>({
    General: 'Normal',
    EyesEars: 'Normal',
    Cardiovascular: 'Normal',
    Respiratory: 'Normal',
    Abdominal: 'Normal',
    Musculoskeletal: 'Normal',
    Integumentary: 'Normal',
    LymphNodes: 'Normal',
  });

  const toggleSystemStatus = (sysKey: string) => {
    setSystemExamStatus((prev) => {
      const nextVal = prev[sysKey] === 'Normal' ? 'Abnormal' : 'Normal';
      return { ...prev, [sysKey]: nextVal };
    });
  };

  const getNormalExamText = () => {
    return `Physical Examination (All Systems Normal / WNL):
• Mentation & General: Bright, alert, and responsive (BAR). Normal posture and ambulation.
• Eyes, Ears, Nose & Throat (EENT): Symmetrical, clear corneas, no discharge, auditory canals clean without erythema.
• Cardiovascular: Normal S1 and S2 sounds auscultated, no murmurs, no gallops, regular rhythm. Femoral pulse strong and synchronous.
• Respiratory: Vesicular breath sounds clear bilaterally across all lung fields; no stertor, stridor, or crackles.
• Abdominal Palpation: Soft, supple, non-painful, non-distended. No splenomegaly, hepatomegaly, or palpable intra-abdominal masses.
• Lymph Nodes: Submandibular, prescapular, and popliteal lymph nodes symmetrical, normal size, non-tender.
• Musculoskeletal & Neurological: Weight-bearing x 4, normal range of motion in all joints, no spinal hyperpathia.
• Integumentary: Clean coat, normal skin elasticity and turgor, no ectoparasites, alopecia, or cutaneous lesions.`;
  };

  const markAllSystemsNormal = () => {
    setSystemExamStatus({
      General: 'Normal',
      EyesEars: 'Normal',
      Cardiovascular: 'Normal',
      Respiratory: 'Normal',
      Abdominal: 'Normal',
      Musculoskeletal: 'Normal',
      Integumentary: 'Normal',
      LymphNodes: 'Normal',
    });
    setPhysicalExamNotes(getNormalExamText());
  };

  const isCat =
    (activePet.species || '').toString().toLowerCase().includes('cat') ||
    (activePet.species || '').toString().toLowerCase().includes('fel');

  // Clear all vitals and exam notes for clean slate
  const clearAllVitals = () => {
    setTemp('' as any);
    setHeartRate('' as any);
    setRespiratoryRate('' as any);
    if (setPulseQuality) setPulseQuality('' as any);
    setCrt('');
    setMucousMembrane('' as any);
    setHydration('' as any);
    setBcs('');
    setPainScore('');
    if (setBloodPressure) setBloodPressure('');
    if (setBloodGlucose) setBloodGlucose('');
    setPhysicalExamNotes('');
  };

  // Quick Vitals presets for rapid clinical entry
  const applyPreset = (preset: 'normal' | 'fever' | 'shock') => {

    if (preset === 'normal') {
      setTemp(tempUnit === 'F' ? 101.5 : 38.6);
      setHeartRate(isCat ? 180 : 95);
      setRespiratoryRate(22);
      if (setPulseQuality) setPulseQuality('Strong & Synchronous');
      setCrt('1.5 sec');
      setMucousMembrane('Pink');
      setHydration('Normal (<5%)');
      setBcs('5/9 Ideal');
      setPainScore('0/4 Sound');
      if (setBloodPressure) setBloodPressure(isCat ? '125/80 mmHg' : '120/80 mmHg');
      if (setBloodGlucose) setBloodGlucose(isCat ? '105 mg/dL' : '95 mg/dL');
      markAllSystemsNormal();
    } else if (preset === 'fever') {
      setTemp(tempUnit === 'F' ? 103.8 : 39.9);
      setHeartRate(isCat ? 220 : 145);
      setRespiratoryRate(38);
      if (setPulseQuality) setPulseQuality('Strong & Synchronous');
      setCrt('2.5 sec');
      setMucousMembrane('Congested / Injected');
      setHydration('Moderate (7-8%)');
      setBcs('5/9 Ideal');
      setPainScore('2/4 Moderate');
      if (setBloodPressure) setBloodPressure('135/85 mmHg');
      if (setBloodGlucose) setBloodGlucose('115 mg/dL');
      setSystemExamStatus((prev) => ({
        ...prev,
        General: 'Abnormal',
        Abdominal: 'Abnormal',
      }));
      setPhysicalExamNotes(
        `Physical examination (Febrile State): Patient is quiet, lethargic, warm to the touch. Hyperemic/congested mucous membranes, moderate tachypnea and tachycardia. Discomfort elicited on deep caudal abdominal palpation. Skin turgor mildly delayed consistent with moderate dehydration (~7-8%).`
      );
    } else if (preset === 'shock') {
      setTemp(tempUnit === 'F' ? 98.2 : 36.8);
      setHeartRate(isCat ? 140 : 175);
      setRespiratoryRate(46);
      if (setPulseQuality) setPulseQuality('Weak & Thready');
      setCrt('3.0 sec');
      setMucousMembrane('Pale');
      setHydration('Severe (>10%)');
      setBcs('4/9 Lean');
      setPainScore('4/4 Severe');
      if (setBloodPressure) setBloodPressure('80/50 mmHg');
      if (setBloodGlucose) setBloodGlucose('65 mg/dL');
      setSystemExamStatus({
        General: 'Abnormal',
        EyesEars: 'Normal',
        Cardiovascular: 'Abnormal',
        Respiratory: 'Abnormal',
        Abdominal: 'Abnormal',
        Musculoskeletal: 'Abnormal',
        Integumentary: 'Abnormal',
        LymphNodes: 'Normal',
      });
      setPhysicalExamNotes(
        `Physical examination (Critical / Shock): Patient is in lateral recumbency, severely depressed/obtunded. Hypothermic extremities. Pale porcelain mucous membranes with CRT > 3.0 sec. Weak, thready femoral pulses with marked tachycardia. Sunken ocular globes and persistent skin tenting consistent with severe dehydration (>10%).`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. COMPACT PATIENT SUMMARY BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-extrabold text-base shrink-0">
            {activePet.species === 'Cat' ? '🐱' : '🐕'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {activePet.name}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activePet.species} • {activePet.breed}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Age: <span className="font-semibold text-slate-700 dark:text-slate-300">{activePet.age}</span> • Weight:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{activePet.weight} kg</span> • Sex:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{activePet.gender || 'Female (Intact)'}</span>
            </p>
          </div>
        </div>

        {/* Urgency Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Triage Priority:</span>
          {(['Routine', 'Urgent', 'Emergency', 'Critical'] as const).map((urg) => (
            <button
              key={urg}
              type="button"
              onClick={() => setTriageUrgency(urg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                triageUrgency === urg
                  ? urg === 'Critical' || urg === 'Emergency'
                    ? 'bg-red-600 text-white shadow-xs'
                    : urg === 'Urgent'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CLINICAL CASE SPECIALTY SELECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          1. Clinical Specialty Area (Primary Case Type)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setCaseSpecialty('Gynecology')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              caseSpecialty === 'Gynecology'
                ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 text-pink-950 dark:text-pink-100 shadow-xs ring-2 ring-pink-400/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-pink-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              caseSpecialty === 'Gynecology' ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Gynecology & Obstetrics</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pyometra, dystocia, whelping, vaginal discharge, mastitis, reproductive cycles
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaseSpecialty('Medicine')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              caseSpecialty === 'Medicine'
                ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 shadow-xs ring-2 ring-teal-400/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              caseSpecialty === 'Medicine' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Internal Medicine</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                GI (vomiting/diarrhea), respiratory, renal/urinary, tick fever, endocrine, dermatologic
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaseSpecialty('Surgery')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              caseSpecialty === 'Surgery'
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs ring-2 ring-indigo-400/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              caseSpecialty === 'Surgery' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Surgery & Orthopedics</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                GDV/bloat, foreign body obstruction, fractures, cruciate tears, soft tissue trauma
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. DOCTOR'S CLINICAL HISTORY & ANAMNESIS NOTES (USER REQUEST: ALLOW DOCTOR TO WRITE SOMETHING) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              2. Clinical History & Anamnesis Notes
            </h3>
          </div>
          <span className="text-xs text-slate-400">Doctor's Clinical Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Chief Presenting Complaint
            </label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Vulvar purulent discharge, lethargy, and increased thirst for 4 days"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Duration of Illness
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 days, 12 hours, 2 weeks"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Free-text Doctor Anamnesis Notes Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Doctor's Detailed Anamnesis & Patient History (Free-text)</span>
            <span className="text-[11px] font-normal text-slate-400">Write symptoms, owner observations, progression, past treatments, diet</span>
          </label>
          <textarea
            rows={4}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Write clinical anamnesis here: e.g. Owner noticed thick yellow/creamy discharge from vulva 4 days ago. Dog is drinking 3x more water than usual. Depressed, refusing dry food, only eating chicken broth. No prior surgeries. Was in heat 5 weeks ago. No vomiting noted."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Onset Pattern
            </label>
            <select
              value={onsetMode}
              onChange={(e) => setOnsetMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            >
              <option value="Sudden / Acute">Sudden / Acute (&lt; 24-48 hrs)</option>
              <option value="Gradual / Progressive">Gradual / Progressive (Days)</option>
              <option value="Chronic / Intermittent">Chronic / Intermittent (Weeks/Months)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Dietary & Appetite History
            </label>
            <input
              type="text"
              value={dietDetails}
              onChange={(e) => setDietDetails(e.target.value)}
              placeholder="e.g. Dry kibble, anorexia for 2 days"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Vaccination & Deworming History
            </label>
            <input
              type="text"
              value={preventiveStatus}
              onChange={(e) => setPreventiveStatus(e.target.value)}
              placeholder="e.g. Up to date on DHPP/Rabies; dewormed 2mo ago"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. CLEAN CLINICAL SIGNS & SYMPTOMS PICKER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>3. Presenting Signs & Symptoms</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {selectedSigns.length} selected
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click to select or unselect relevant clinical signs, or type custom sign below.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={signSearchFilter}
              onChange={(e) => setSignSearchFilter(e.target.value)}
              placeholder="Filter signs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Clickable Signs Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredSigns.map((sign) => {
            const isSelected = selectedSigns.includes(sign);
            return (
              <button
                key={sign}
                type="button"
                onClick={() => toggleSign(sign)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{sign}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Signs Bar (if custom or non-default signs selected) */}
        {selectedSigns.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Active Signs:</span>
            {selectedSigns.map((sign) => (
              <span
                key={sign}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/80 text-[11px] font-bold text-teal-800 dark:text-teal-200"
              >
                <span>{sign}</span>
                <button
                  type="button"
                  onClick={() => toggleSign(sign)}
                  className="hover:text-red-500 transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Custom Sign Field */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customSignInput}
            onChange={(e) => setCustomSignInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSign();
              }
            }}
            placeholder="Type other observed symptom or clinical sign..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddCustomSign}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sign</span>
          </button>
        </div>
      </div>

      {/* 4. PHYSICAL EXAMINATION & VITALS PARAMETERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>4. Physical Examination & Vitals Parameters</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record physical exam findings, systemic evaluation, and clinical vitals for {activePet.name} ({activePet.species}).
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">Quick Suggestions:</span>
            <button
              type="button"
              id="btn-preset-normal"
              onClick={() => applyPreset('normal')}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>💡 Suggest Normal (WNL)</span>
            </button>
            <button
              type="button"
              id="btn-preset-fever"
              onClick={() => applyPreset('fever')}
              className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>⚡ Suggest Febrile</span>
            </button>
            <button
              type="button"
              id="btn-preset-shock"
              onClick={() => applyPreset('shock')}
              className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>🚨 Suggest Shock / Critical</span>
            </button>
            <button
              type="button"
              onClick={clearAllVitals}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <span>🧹 Clear Vitals</span>
            </button>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Temperature</span>
              <button
                type="button"
                onClick={() => setTempUnit(tempUnit === 'F' ? 'C' : 'F')}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                °{tempUnit}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="number"
                step="0.1"
                value={temp === 0 || !temp ? '' : temp}
                onChange={(e) => setTemp(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                placeholder={tempUnit === 'F' ? '101.5' : '38.6'}
                className="w-full bg-transparent text-base font-extrabold text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => setTemp(tempUnit === 'F' ? 101.5 : 38.6)}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Normal: {tempUnit === 'F' ? '100.5 - 102.5°F' : '38.0 - 39.2°C'} (Suggest)
            </button>
          </div>

          {/* Heart Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Heart Rate (bpm)</span>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600 shrink-0" />
              <input
                type="number"
                value={heartRate === 0 || !heartRate ? '' : heartRate}
                onChange={(e) => setHeartRate(e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10))}
                placeholder={isCat ? '180' : '95'}
                className="w-full bg-transparent text-base font-extrabold text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => setHeartRate(isCat ? 180 : 95)}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer text-left"
            >
              {isCat ? 'Feline: 140-220 (Suggest 180)' : 'Canine: 70-140 (Suggest 95)'}
            </button>
          </div>

          {/* Respiratory Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Resp Rate (bpm)</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600 shrink-0" />
              <input
                type="number"
                value={respiratoryRate === 0 || !respiratoryRate ? '' : respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10))}
                placeholder="22"
                className="w-full bg-transparent text-base font-extrabold text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => setRespiratoryRate(22)}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Normal: 15 - 30 bpm (Suggest)
            </button>
          </div>

          {/* Pulse Quality */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Pulse Quality</span>
            <select
              value={pulseQuality}
              onChange={(e) => setPulseQuality && setPulseQuality(e.target.value as any)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="Strong & Synchronous">Strong & Synchronous</option>
              <option value="Moderate">Moderate</option>
              <option value="Weak & Thready">Weak & Thready</option>
              <option value="Bounding">Bounding</option>
            </select>
            <button
              type="button"
              onClick={() => setPulseQuality && setPulseQuality('Strong & Synchronous')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal
            </button>
          </div>

          {/* Capillary Refill Time */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">CRT Refill</span>
            <select
              value={crt}
              onChange={(e) => setCrt(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="1.0 sec">&lt; 1.5 sec (Rapid / Normal)</option>
              <option value="1.5 sec">1.5 - 2.0 sec (Normal)</option>
              <option value="2.5 sec">2.5 sec (Prolonged)</option>
              <option value="3.0 sec">&gt; 3.0 sec (Shock)</option>
            </select>
            <button
              type="button"
              onClick={() => setCrt('1.5 sec')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal (&lt;2s)
            </button>
          </div>

          {/* Mucous Membrane */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Mucous Membrane</span>
            <select
              value={mucousMembrane}
              onChange={(e) => setMucousMembrane(e.target.value as any)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="Pink">Pink (Normal)</option>
              <option value="Pale">Pale (Anemia / Shock)</option>
              <option value="Congested / Injected">Congested / Injected</option>
              <option value="Icteric">Icteric (Jaundice)</option>
              <option value="Cyanotic">Cyanotic (Hypoxia)</option>
            </select>
            <button
              type="button"
              onClick={() => setMucousMembrane('Pink')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal (Pink)
            </button>
          </div>

          {/* Hydration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Hydration Status</span>
            <select
              value={hydration}
              onChange={(e) => setHydration(e.target.value as any)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="Normal (<5%)">Normal (&lt;5% deficit)</option>
              <option value="Mild (5%)">Mild (5% deficit)</option>
              <option value="Moderate (7-8%)">Moderate (7-8% deficit)</option>
              <option value="Severe (>10%)">Severe (&gt;10% deficit)</option>
            </select>
            <button
              type="button"
              onClick={() => setHydration('Normal (<5%)')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal (&lt;5%)
            </button>
          </div>

          {/* Body Condition Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Body Condition (BCS)</span>
            <select
              value={bcs}
              onChange={(e) => setBcs(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="3/9 Underweight">3/9 Underweight</option>
              <option value="4/9 Lean">4/9 Lean</option>
              <option value="5/9 Ideal">5/9 Ideal</option>
              <option value="6/9 Overweight">6/9 Overweight</option>
              <option value="7/9 Obese">7/9 Obese</option>
            </select>
            <button
              type="button"
              onClick={() => setBcs('5/9 Ideal')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Ideal (5/9)
            </button>
          </div>

          {/* Pain Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Pain Score (0-4)</span>
            <select
              value={painScore}
              onChange={(e) => setPainScore(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            >
              <option value="">-- Not Recorded --</option>
              <option value="0/4 Sound">0/4 Sound (No pain)</option>
              <option value="1/4 Mild">1/4 Mild</option>
              <option value="2/4 Moderate">2/4 Moderate</option>
              <option value="3/4 Moderate to Severe">3/4 Moderate to Severe</option>
              <option value="4/4 Severe">4/4 Severe / Excruciating</option>
            </select>
            <button
              type="button"
              onClick={() => setPainScore('0/4 Sound')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Sound (0/4)
            </button>
          </div>

          {/* Blood Pressure */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Blood Pressure</span>
            <input
              type="text"
              value={bloodPressure}
              onChange={(e) => setBloodPressure && setBloodPressure(e.target.value)}
              placeholder="120/80 mmHg"
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            />
            <button
              type="button"
              onClick={() => setBloodPressure && setBloodPressure(isCat ? '125/80 mmHg' : '120/80 mmHg')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal (120/80)
            </button>
          </div>

          {/* Blood Glucose */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Blood Glucose</span>
            <input
              type="text"
              value={bloodGlucose}
              onChange={(e) => setBloodGlucose && setBloodGlucose(e.target.value)}
              placeholder="100 mg/dL"
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden mt-1"
            />
            <button
              type="button"
              onClick={() => setBloodGlucose && setBloodGlucose(isCat ? '105 mg/dL' : '95 mg/dL')}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline block mt-1 cursor-pointer"
            >
              Suggest Normal ({isCat ? '105' : '95'} mg/dL)
            </button>
            <span className="text-[10px] text-slate-400 block mt-1">Normal: 80 - 120 mg/dL</span>
          </div>
        </div>

        {/* Systemic Physical Examination Review Badges */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Systemic Physical Examination Checklist
              </span>
            </div>
            <button
              type="button"
              id="btn-mark-systems-normal"
              onClick={markAllSystemsNormal}
              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Check className="w-3 h-3" />
              <span>Mark All Systems Normal (WNL)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { key: 'General', label: 'Mentation & Attitude' },
              { key: 'EyesEars', label: 'Eyes, Ears & Nose (EENT)' },
              { key: 'Cardiovascular', label: 'Cardiovascular / Heart' },
              { key: 'Respiratory', label: 'Respiratory / Lungs' },
              { key: 'Abdominal', label: 'Abdominal Palpation' },
              { key: 'LymphNodes', label: 'Peripheral Lymph Nodes' },
              { key: 'Musculoskeletal', label: 'Musculoskeletal & Gait' },
              { key: 'Integumentary', label: 'Skin, Coat & Dermis' },
            ].map((sys) => {
              const status = systemExamStatus[sys.key] || 'Normal';
              const isNormal = status === 'Normal';
              return (
                <button
                  key={sys.key}
                  type="button"
                  onClick={() => toggleSystemStatus(sys.key)}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                    isNormal
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold'
                  }`}
                >
                  <span className="text-[11px] font-medium truncate pr-1">{sys.label}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isNormal
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                    }`}
                  >
                    {status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor's Physical Palpation / Exam Findings Textarea */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Doctor's Physical Palpation & Examination Findings</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-autofill-normal-exam"
                onClick={() => setPhysicalExamNotes(getNormalExamText())}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Suggest Normal Exam Template</span>
              </button>
              <button
                type="button"
                onClick={() => setPhysicalExamNotes('')}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            rows={4}
            value={physicalExamNotes}
            onChange={(e) => setPhysicalExamNotes(e.target.value)}
            placeholder="e.g. Physical Examination: Patient is bright, alert, responsive. Thoracic auscultation clear. Abdomen soft on palpation, no masses palpable..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden font-normal leading-relaxed"
          />
        </div>
      </div>

      {/* PROCEED ACTION BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Step 1 of 5: History & Physical Parameters Complete
        </div>

        <button
          type="button"
          onClick={onProceedToStep2}
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <span>Next: Review Parameters & Symptoms Summary</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
