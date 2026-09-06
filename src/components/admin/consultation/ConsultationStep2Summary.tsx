import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Activity,
  Thermometer,
  Heart,
  Baby,
  Stethoscope,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { CaseSpecialty } from './ConsultationStep1History';

interface Step2SummaryProps {
  activePet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: number;
    gender?: string;
  };
  caseSpecialty: CaseSpecialty;
  chiefComplaint: string;
  duration: string;
  onsetMode: string;
  triageUrgency: string;
  generalNotes?: string;
  dietDetails?: string;
  preventiveStatus?: string;
  selectedSigns: string[];

  // Vitals
  temp: number;
  tempUnit: 'F' | 'C';
  heartRate: number;
  respiratoryRate: number;
  crt: string;
  mucousMembrane: string;
  hydration: string;
  bcs: string;
  painScore: string;
  bloodPressure?: string;
  bloodGlucose?: string;
  physicalExamNotes?: string;

  // Navigation
  onBackToStep1: () => void;
  onProceedToStep3: () => void;
}

export const ConsultationStep2Summary: React.FC<Step2SummaryProps> = ({
  activePet,
  caseSpecialty,
  chiefComplaint,
  duration,
  onsetMode,
  triageUrgency,
  generalNotes = '',
  dietDetails = '',
  preventiveStatus = '',
  selectedSigns,
  temp,
  tempUnit,
  heartRate,
  respiratoryRate,
  crt,
  mucousMembrane,
  hydration,
  bcs,
  painScore,
  bloodPressure = '120/80 mmHg',
  bloodGlucose = '104 mg/dL',
  physicalExamNotes = '',
  onBackToStep1,
  onProceedToStep3,
}) => {
  // Clinical Parameter Interpretation Badges
  const tempF = tempUnit === 'C' ? (temp * 9) / 5 + 32 : temp;
  const isFebrile = tempF > 102.5;
  const isHypothermic = tempF < 100.0;
  const isTachycardic = heartRate > (activePet.species === 'Cat' ? 220 : 130);
  const isTachypneic = respiratoryRate > 35;
  const isDelayedCRT = crt.includes('2.') || crt.includes('3') || crt.includes('delayed');
  const isDehydrated = !hydration.includes('Normal');
  const isAbnormalMM = !mucousMembrane.includes('Pink');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs">
              Step 2 of 5
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Clinical Summary Review
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Summary of all physical parameters, clinical signs, and history taken. Review before running the AI Diagnostic Tool.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToStep1}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Parameters</span>
        </button>
      </div>

      {/* 1. PATIENT & SPECIALTY OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patient Profile */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Patient Identity
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-base">
              {activePet.species === 'Cat' ? '🐱' : '🐕'}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                {activePet.name}
              </div>
              <div className="text-xs text-slate-500">
                {activePet.species} • {activePet.breed}
              </div>
            </div>
          </div>
          <div className="pt-1 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-2">
            <span>Age: <strong>{activePet.age}</strong></span>
            <span>•</span>
            <span>Weight: <strong>{activePet.weight} kg</strong></span>
            <span>•</span>
            <span>Sex: <strong>{activePet.gender || 'Female (Intact)'}</strong></span>
          </div>
        </div>

        {/* Specialty & Urgency */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Specialty Discipline
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              caseSpecialty === 'Gynecology'
                ? 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'
                : caseSpecialty === 'Surgery'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
            }`}>
              {caseSpecialty === 'Gynecology' && <Baby className="w-5 h-5" />}
              {caseSpecialty === 'Medicine' && <Stethoscope className="w-5 h-5" />}
              {caseSpecialty === 'Surgery' && <Scissors className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                {caseSpecialty === 'Gynecology' && 'Gynecology & Obstetrics'}
                {caseSpecialty === 'Medicine' && 'Internal Medicine'}
                {caseSpecialty === 'Surgery' && 'Surgery & Orthopedics'}
              </div>
              <div className="text-xs text-slate-500">
                Onset: {onsetMode} ({duration})
              </div>
            </div>
          </div>
          <div className="pt-1">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
              triageUrgency === 'Critical' || triageUrgency === 'Emergency'
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                : triageUrgency === 'Urgent'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
            }`}>
              Triage: {triageUrgency}
            </span>
          </div>
        </div>

        {/* Presenting Complaint */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Chief Presenting Complaint
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
            "{chiefComplaint}"
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Duration: <strong className="text-slate-700 dark:text-slate-300">{duration}</strong>
          </p>
        </div>
      </div>

      {/* 2. DOCTOR'S WRITTEN ANAMNESIS & HISTORY */}
      {generalNotes && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Doctor's Written Anamnesis & Clinical History
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
            {generalNotes}
          </div>
          {(dietDetails || preventiveStatus) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              {dietDetails && (
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Diet & Appetite:</span> {dietDetails}
                </div>
              )}
              {preventiveStatus && (
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Preventives:</span> {preventiveStatus}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. PHYSICAL PARAMETERS & VITALS SUMMARY GRID */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recorded Physical Parameters & Vitals
            </h3>
          </div>
          <span className="text-xs text-slate-400">Clinical Evaluation Index</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Temperature */}
          <div className={`p-3.5 rounded-xl border ${
            isFebrile
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : isHypothermic
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Temperature
            </span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {temp} °{tempUnit}
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isFebrile
                ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                : isHypothermic
                ? 'bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {isFebrile ? 'Pyrexia / Fever' : isHypothermic ? 'Hypothermia' : 'Normal (100.5-102.5°F)'}
            </span>
          </div>

          {/* Heart Rate */}
          <div className={`p-3.5 rounded-xl border ${
            isTachycardic
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Heart Rate
            </span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {heartRate} bpm
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isTachycardic
                ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {isTachycardic ? 'Tachycardia (Elevated)' : 'Normal Range'}
            </span>
          </div>

          {/* Respiratory Rate */}
          <div className={`p-3.5 rounded-xl border ${
            isTachypneic
              ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Respiratory Rate
            </span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {respiratoryRate} bpm
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isTachypneic
                ? 'bg-teal-200 text-teal-900 dark:bg-teal-900 dark:text-teal-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {isTachypneic ? 'Tachypnea (Rapid)' : 'Normal (15-30 bpm)'}
            </span>
          </div>

          {/* CRT */}
          <div className={`p-3.5 rounded-xl border ${
            isDelayedCRT
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              CRT Refill Time
            </span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {crt}
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isDelayedCRT
                ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {isDelayedCRT ? 'Delayed Perfusion' : 'Normal (<2s)'}
            </span>
          </div>

          {/* Mucous Membrane */}
          <div className={`p-3.5 rounded-xl border ${
            isAbnormalMM
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Mucous Membrane
            </span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {mucousMembrane}
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isAbnormalMM
                ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {mucousMembrane}
            </span>
          </div>

          {/* Hydration */}
          <div className={`p-3.5 rounded-xl border ${
            isDehydrated
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Hydration Status
            </span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {hydration}
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
              isDehydrated
                ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {isDehydrated ? 'Dehydration Deficit' : 'Euvolemic'}
            </span>
          </div>

          {/* Body Condition Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              BCS Score
            </span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {bcs}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Nutritional profile</span>
          </div>

          {/* Pain Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Pain Score
            </span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {painScore}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Visceral/somatic index</span>
          </div>
        </div>

        {/* Doctor's Physical Exam Notes */}
        {physicalExamNotes && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Doctor's Physical Palpation & Examination Findings:
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200">
              {physicalExamNotes}
            </p>
          </div>
        )}
      </div>

      {/* 4. SELECTED SIGNS & SYMPTOMS LIST */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>Observed Clinical Signs & Symptoms</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {selectedSigns.length} items
            </span>
          </h3>
          <button
            type="button"
            onClick={onBackToStep1}
            className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            + Add / Remove Signs
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedSigns.map((sign) => (
            <span
              key={sign}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-900 dark:text-teal-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{sign}</span>
            </span>
          ))}
        </div>
      </div>

      {/* STEP NAVIGATION BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToStep1}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back: Edit History & Parameters</span>
        </button>

        <button
          type="button"
          onClick={onProceedToStep3}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next: Run Diagnostic AI Tool</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
