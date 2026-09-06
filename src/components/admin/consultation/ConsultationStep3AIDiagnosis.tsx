import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Stethoscope,
  Activity,
  Layers,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  ClipboardList,
  TestTube2,
  Image as ImageIcon,
  Check,
  FastForward,
} from 'lucide-react';
import { CaseSpecialty } from './ConsultationStep1History';
import { getConsultationAIAssist } from '../../../services/geminiService';
import {
  evaluateVeterinaryCondition,
  DiagnosticEngineResult,
} from '../../../utils/veterinaryDiagnosisEngine';

interface Step3AIDiagnosisProps {
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

  // Diagnosis outputs
  provisionalDiagnosis: string;
  setProvisionalDiagnosis: (val: string) => void;
  differentialDiagnoses: string;
  setDifferentialDiagnoses: (val: string) => void;
  diagnosticRecommendations: string;
  setDiagnosticRecommendations: (val: string) => void;
  treatmentPlan: string;
  setTreatmentPlan: (val: string) => void;

  // Navigation
  onBackToStep2: () => void;
  onProceedToStep4Upload: () => void;
  onSkipToStep5Prescription: () => void;
}

export const ConsultationStep3AIDiagnosis: React.FC<Step3AIDiagnosisProps> = ({
  activePet,
  caseSpecialty,
  chiefComplaint,
  duration,
  onsetMode,
  triageUrgency,
  generalNotes = '',
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
  provisionalDiagnosis,
  setProvisionalDiagnosis,
  differentialDiagnoses,
  setDifferentialDiagnoses,
  diagnosticRecommendations,
  setDiagnosticRecommendations,
  treatmentPlan,
  setTreatmentPlan,
  onBackToStep2,
  onProceedToStep4Upload,
  onSkipToStep5Prescription,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticEngineResult | null>(null);
  const [prescribedTests, setPrescribedTests] = useState<string[]>([]);
  const [testsPrescribedSuccess, setTestsPrescribedSuccess] = useState<boolean>(false);

  // Execute Evidence-Based Diagnostic Engine
  const runDiagnosticAI = async () => {
    setLoading(true);
    try {
      // 1. Calculate clinical rule-based disease prediction using the veterinary engine
      const localResult = evaluateVeterinaryCondition({
        patient: {
          species: activePet.species,
          breed: activePet.breed,
          age: activePet.age,
          weight: activePet.weight,
          gender: activePet.gender,
        },
        specialty: caseSpecialty,
        chiefComplaint,
        doctorNotes: generalNotes,
        selectedSigns,
        vitals: {
          temp,
          tempUnit,
          heartRate,
          respiratoryRate,
          crt,
          mucousMembrane,
          hydration,
          bcs,
          painScore,
          bloodPressure,
          bloodGlucose,
        },
        physicalExamNotes,
      });

      // 2. Also query backend API for Gemini reinforcement
      let apiResult: any = null;
      try {
        apiResult = await getConsultationAIAssist({
          petName: activePet.name,
          species: activePet.species,
          breed: activePet.breed,
          age: activePet.age,
          weight: activePet.weight,
          symptoms: `${chiefComplaint}. ${selectedSigns.join(', ')}. Duration: ${duration}`,
          vitals: `Temp: ${temp}°${tempUnit}, HR: ${heartRate} bpm, RR: ${respiratoryRate} bpm, CRT: ${crt}, MM: ${mucousMembrane}, Hydration: ${hydration}, Pain: ${painScore}`,
          history: generalNotes || 'None',
          examFindings: physicalExamNotes || 'Abdominal palpation performed',
          caseType: caseSpecialty,
          selectedSigns,
        });
      } catch (e) {
        console.warn('API consultation assist fallback to clinical engine:', e);
      }

      // Merge results intelligently
      const finalRes: DiagnosticEngineResult = {
        ...localResult,
        provisionalDiagnosis: apiResult?.provisionalDiagnosis || localResult.provisionalDiagnosis,
        treatmentPlan: apiResult?.treatmentPlan || localResult.treatmentPlan,
      };

      setDiagnosticResult(finalRes);
      setProvisionalDiagnosis(finalRes.provisionalDiagnosis);
      setDifferentialDiagnoses(
        finalRes.differentialDiagnoses.map((d) => `${d.condition} (${d.likelihood})`).join('; ')
      );
      setDiagnosticRecommendations(finalRes.diagnosticRecommendations.summary);
      if (finalRes.treatmentPlan) {
        setTreatmentPlan(finalRes.treatmentPlan);
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnosticAI();
  }, []);

  const handlePrescribeAllTests = () => {
    if (!diagnosticResult) return;
    const all = [
      ...diagnosticResult.diagnosticRecommendations.bloodTests,
      ...diagnosticResult.diagnosticRecommendations.usg,
      ...diagnosticResult.diagnosticRecommendations.xray,
      ...diagnosticResult.diagnosticRecommendations.otherTests,
    ];
    setPrescribedTests(all);
    setTestsPrescribedSuccess(true);
    setTimeout(() => setTestsPrescribedSuccess(false), 4000);
  };

  const togglePrescribeTest = (test: string) => {
    setPrescribedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs">
              Step 3 of 5
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Diagnostic AI Disease Prediction & Lab Test Suggester</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pathophysiological analysis from physical parameters, vital signs, and anamnesis for {activePet.name} ({activePet.species}).
          </p>
        </div>

        <button
          type="button"
          onClick={runDiagnosticAI}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-Run Diagnostic AI'}</span>
        </button>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-spin">
            <RotateCw className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Correlating Vitals, Symptoms & Pathophysiology...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Evaluating vital parameter abnormalities, species predispositions, and clinical indicators for {activePet.name}.
          </p>
        </div>
      )}

      {!loading && diagnosticResult && (
        <div className="space-y-6">
          {/* 1. PRIMARY PROVISIONAL DIAGNOSIS CARD */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold tracking-wider uppercase">
                  Primary Predicted Diagnosis
                </span>
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
                  Confidence: {diagnosticResult.confidenceScore}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                diagnosticResult.triageLevel === 'Critical' || diagnosticResult.triageLevel === 'Emergency'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {diagnosticResult.triageLevel} Priority
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {diagnosticResult.provisionalDiagnosis}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {diagnosticResult.clinicalRationale}
              </p>
            </div>

            {/* Vital Signs Correlation Badges */}
            <div className="pt-2 border-t border-teal-100 dark:border-teal-900/60">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Physical Parameters Contributing to Prediction:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  🌡️ Temp: {temp}°{tempUnit} ({diagnosticResult.vitalAnalysis.tempStatus})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  ❤️ HR: {heartRate} bpm ({diagnosticResult.vitalAnalysis.hrStatus})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  ⏱️ CRT: {crt} ({diagnosticResult.vitalAnalysis.crtStatus})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  💧 Hydration: {hydration} ({diagnosticResult.vitalAnalysis.hydrationStatus})
                </span>
              </div>
            </div>
          </div>

          {/* 2. DIFFERENTIAL DIAGNOSES RANKING */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ranked Differential Diagnoses & Evidence
            </h4>
            <div className="space-y-3">
              {diagnosticResult.differentialDiagnoses.map((diff, idx) => (
                <div
                  key={diff.condition}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {diff.condition}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {diff.likelihood}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Clinical Evidence:</strong> {diff.reasoning}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Suggested Protocol:</strong> {diff.suggestedTreatment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. BIOCHEMICAL & IMAGING TESTS REQUIRED (USER REQUEST: SUGGEST DOCTOR TO PRESCRIBE FOR TEST) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <TestTube2 className="w-4 h-4 text-teal-600" />
                  <span>Required Diagnostic Tests to Prescribe</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI-recommended biochemical, sonographic, and radiographic tests to confirm diagnosis.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrescribeAllTests}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Prescribe All Recommended Tests</span>
              </button>
            </div>

            {testsPrescribedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All recommended laboratory and imaging tests added to clinical prescription!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Blood & Biochemical Tests */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <TestTube2 className="w-3.5 h-3.5 text-rose-500" />
                    Biochemical & Hematology Panels
                  </span>
                  <span className="text-[10px] text-slate-400">Required</span>
                </div>
                <div className="space-y-1.5">
                  {diagnosticResult.diagnosticRecommendations.bloodTests.map((test) => {
                    const isPrescribed = prescribedTests.includes(test);
                    return (
                      <div
                        key={test}
                        onClick={() => togglePrescribeTest(test)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2 ${
                          isPrescribed
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-100 font-semibold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                          isPrescribed ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isPrescribed && <Check className="w-3 h-3" />}
                        </div>
                        <span className="leading-snug">{test}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ultrasound & Radiographs */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    Imaging Tests (USG & X-Ray)
                  </span>
                  <span className="text-[10px] text-slate-400">Diagnostic</span>
                </div>
                <div className="space-y-1.5">
                  {[...diagnosticResult.diagnosticRecommendations.usg, ...diagnosticResult.diagnosticRecommendations.xray].map((test) => {
                    const isPrescribed = prescribedTests.includes(test);
                    return (
                      <div
                        key={test}
                        onClick={() => togglePrescribeTest(test)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2 ${
                          isPrescribed
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-100 font-semibold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                          isPrescribed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isPrescribed && <Check className="w-3 h-3" />}
                        </div>
                        <span className="leading-snug">{test}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. RED FLAG CLINICAL WARNINGS */}
          {diagnosticResult.redFlagAlerts && diagnosticResult.redFlagAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Critical Pathological Monitoring Indicators:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300 pl-1">
                {diagnosticResult.redFlagAlerts.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* USER REQUESTED DECISION BAR:
          1. Upload report & correlate
          2. If don't want to upload photo/report of biochemical parameters -> skip that portion! */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToStep2}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Summary</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* SKIP BUTTON (USER REQUEST: If don't want to upload photo or report of any biochemical parameters than skip that portion) */}
          <button
            type="button"
            onClick={onSkipToStep5Prescription}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <FastForward className="w-4 h-4 text-slate-400" />
            <span>Skip Upload & Go to Prescription</span>
          </button>

          {/* UPLOAD & CORRELATE BUTTON (USER REQUEST: Allow to upload report if report is upload than again diagnosis on basis of all data and report and correlate them) */}
          <button
            type="button"
            onClick={onProceedToStep4Upload}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Upload Reports & Correlate</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
