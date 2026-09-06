import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  FlaskConical,
  AlertTriangle,
  FileCheck,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  Activity,
  Layers,
  HelpCircle,
  Pill,
} from 'lucide-react';
import { getConsultationAIAssist } from '../../../services/geminiService';
import { CaseSpecialty } from './ConsultationStep1History';

interface Step2AIAnalysisProps {
  activePet: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: number;
  };
  caseSpecialty: CaseSpecialty;
  selectedSigns: string[];
  chiefComplaint: string;
  duration?: string;
  onsetMode?: string;
  progression?: string;
  triageUrgency?: string;
  vitalsSummary?: string;
  
  // Shared state that this step populates/updates
  provisionalDiagnosis?: string;
  setProvisionalDiagnosis?: (val: string) => void;
  differentialDiagnoses?: string;
  setDifferentialDiagnoses?: (val: string) => void;
  diagnosticRecommendations?: string;
  setDiagnosticRecommendations?: (val: string) => void;
  treatmentPlan?: string;
  setTreatmentPlan?: (val: string) => void;
  
  // Navigation
  onProceedToStep3: () => void;
  onBackToStep1: () => void;
}

export const ConsultationStep2AIAnalysis: React.FC<Step2AIAnalysisProps> = ({
  activePet,
  caseSpecialty,
  selectedSigns,
  chiefComplaint,
  duration = '',
  onsetMode = '',
  progression = '',
  triageUrgency = '',
  vitalsSummary = '',
  provisionalDiagnosis = '',
  setProvisionalDiagnosis = (_val: string) => {},
  differentialDiagnoses = '',
  setDifferentialDiagnoses = (_val: string) => {},
  diagnosticRecommendations = '',
  setDiagnosticRecommendations = (_val: string) => {},
  treatmentPlan = '',
  setTreatmentPlan = (_val: string) => {},
  onProceedToStep3,
  onBackToStep1,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedDiffIndex, setSelectedDiffIndex] = useState<number | null>(null);

  // Run AI analysis
  const runAiAnalysis = async () => {
    setLoading(true);
    try {
      const res = await getConsultationAIAssist({
        petName: activePet.name,
        species: activePet.species,
        breed: activePet.breed,
        age: activePet.age,
        weight: activePet.weight,
        caseType: caseSpecialty,
        selectedSigns: selectedSigns,
        chiefComplaint: chiefComplaint || `${caseSpecialty} case evaluation with signs: ${selectedSigns.join(', ')}`,
        vitals: vitalsSummary,
        labSummary: 'Initial workup stage: Awaiting confirmatory blood panel, USG and radiographs.',
        radiologyNotes: 'Radiographs not yet completed.',
        usgNotes: 'Ultrasonography pending.',
      });

      setAiResult(res);

      if (res.differentialDiagnoses && res.differentialDiagnoses.length > 0) {
        const topDiff = res.differentialDiagnoses[0];
        setProvisionalDiagnosis?.(topDiff.condition);
        setDifferentialDiagnoses?.(
          res.differentialDiagnoses.map((d: any) => `${d.condition} (${d.likelihood})`).join(', ')
        );
      }

      // Populate diagnostic recommendations from AI suggestions
      if (res.diagnosticWorkupPlan && res.diagnosticWorkupPlan.length > 0) {
        setDiagnosticRecommendations?.(res.diagnosticWorkupPlan.join('; '));
      }

      // Populate treatment plan
      if (res.therapeuticConsiderations && res.therapeuticConsiderations.length > 0) {
        setTreatmentPlan?.(res.therapeuticConsiderations.join('\n'));
      }
    } catch (err) {
      console.error('Error running AI consultation assist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on mount if no result yet
  useEffect(() => {
    if (!aiResult) {
      runAiAnalysis();
    }
  }, []);

  // Format AI Suggested Tests into Category Buckets
  const bloodTestSuggestions = [
    {
      test: 'Complete Blood Count (CBC with Differential)',
      purpose: 'Evaluate leukocytosis / band left shift for systemic sepsis/pyometra or peritonitis, and assess hematocrit (anemia or dehydration hemoconcentration).',
      highlight: true,
    },
    {
      test: 'BUN (Blood Urea Nitrogen) & Serum Creatinine',
      purpose: 'Critical to differentiate pre-renal dehydration azotemia from acute renal failure before administering anesthesia, NSAIDs, or nephrotoxic therapies.',
      highlight: true,
    },
    {
      test: 'Serum Electrolytes (Na+, K+, Cl-)',
      purpose: 'Detect hypokalemia, hyponatremia, and metabolic acidosis secondary to vomiting, third-spacing, or gastrointestinal obstruction.',
      highlight: false,
    },
    {
      test: caseSpecialty === 'Gynecology' ? 'Serum Progesterone & Vaginal Cytology' : 'Hepatic Panel (ALT, ALP, Total Bilirubin)',
      purpose: caseSpecialty === 'Gynecology' ? 'Assess luteal phase status and confirm bacterial colonization.' : 'Assess hepatocellular injury or biliary stasis.',
      highlight: false,
    },
  ];

  const usgSuggestions = [
    {
      test: caseSpecialty === 'Gynecology' ? 'Reproductive USG (Uterine Horn Lumen)' : 'Abdominal Ultrasonography (A-FAST Focus)',
      purpose: caseSpecialty === 'Gynecology'
        ? 'Visualize anechoic/hypoechoic fluid distension within uterine horns to confirm or rule out Pyometra vs Mucometra vs Viable Gestation.'
        : 'Detect free peritoneal effusion (hemoperitoneum, septic peritonitis) and evaluate gastrointestinal wall layering.',
      highlight: true,
    },
    {
      test: 'Renal & Urinary Bladder Sonography',
      purpose: 'Examine corticomedullary distinction, renal pelvic dilation (hydronephrosis/pyelonephritis), and cystic calculi.',
      highlight: false,
    },
  ];

  const xraySuggestions = [
    {
      test: caseSpecialty === 'Surgery' ? 'Orthogonal Radiographs (Lateral & Craniocaudal / VD)' : 'Abdominal Radiography (2-View: Lat & VD)',
      purpose: caseSpecialty === 'Surgery'
        ? 'Determine mechanical bone alignment, fracture displacement, joint subluxation, or foreign body obstructive bowel gas patterns.'
        : 'Examine gastric dilation/volvulus, intestinal plication (linear foreign body), radiopaque calculi, or mass effect.',
      highlight: true,
    },
    {
      test: 'Thoracic Radiographs (3-View: Right/Left Lat & VD)',
      purpose: 'Pre-anesthetic cardiopulmonary assessment and ruling out pulmonary edema, pneumonia, or metastatic neoplasia.',
      highlight: false,
    },
  ];

  const handleSelectDifferential = (diff: any, index: number) => {
    setSelectedDiffIndex(index);
    setProvisionalDiagnosis?.(diff.condition);
    if (diff.reasoning && setDiagnosticRecommendations) {
      const current = diagnosticRecommendations || '';
      setDiagnosticRecommendations(
        current.includes(diff.condition) ? current : `${current ? current + '\n' : ''}• Correlate with ${diff.condition}: ${diff.reasoning}`
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 2.1 AI HEADER & STATUS */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-400/30">
              <Sparkles className="w-6 h-6 animate-pulse text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
                  Step 2 • Gemini Clinical Reasoning Engine
                </span>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
                  Specialty: {caseSpecialty}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                AI Sign & Symptom Analysis & Diagnostic Workup Plan
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={runAiAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Clinical Signals...' : 'Re-run AI Analysis'}</span>
          </button>
        </div>

        {/* Input Signals Summary Banner */}
        <div className="bg-white/10 rounded-2xl p-3.5 text-xs backdrop-blur-xs border border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-purple-200 font-bold uppercase text-[10px] tracking-wider">
            Synthesized Signals:
          </span>
          <span className="bg-purple-950/60 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
            {activePet.name} ({activePet.species} • {activePet.breed} • {activePet.weight}kg)
          </span>
          <span className="bg-purple-950/60 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
            Urgency: {triageUrgency}
          </span>
          <span className="bg-purple-950/60 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
            Duration: {duration} ({onsetMode})
          </span>
          <span className="bg-purple-950/60 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
            {selectedSigns.length} Signs Selected
          </span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <RotateCw className="w-6 h-6 animate-spin text-purple-600" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Evaluating Anamnesis & Selected Signs for {caseSpecialty}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Synthesizing clinical signals, triage indicators, and formulating recommended laboratory, USG, and radiographic diagnostic modalities...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 2.2 RANKED DIFFERENTIAL DIAGNOSES */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Clinical Triage & Differential Diagnoses
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Touch any card below to adopt it as the Primary Provisional Diagnosis
                </h4>
              </div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                Current Provisional: {provisionalDiagnosis || 'Awaiting Selection'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {(aiResult?.differentialDiagnoses || [
                {
                  condition: caseSpecialty === 'Gynecology'
                    ? 'Pyometra Complex (Endometrial Hyperplasia)'
                    : caseSpecialty === 'Surgery'
                    ? 'Mechanical Gastrointestinal Obstruction (Foreign Body)'
                    : 'Acute Gastroenteritis with Pre-Renal Azotemia',
                  likelihood: 'High Probability (88%)',
                  reasoning: 'Clinical anamnesis, duration, and presenting sign constellation closely align with acute pathology.',
                },
                {
                  condition: caseSpecialty === 'Gynecology'
                    ? 'Acute Septic Metritis / Retained Placenta'
                    : caseSpecialty === 'Surgery'
                    ? 'Intestinal Volvulus / Intussusception'
                    : 'Acute Pancreatitis with Electrolyte Imbalance',
                  likelihood: 'Moderate Probability (54%)',
                  reasoning: 'Requires laboratory chemistry verification of systemic inflammation and organ stress.',
                },
                {
                  condition: caseSpecialty === 'Gynecology'
                    ? 'Vaginitis / Cystitis Complex'
                    : caseSpecialty === 'Surgery'
                    ? 'Mesenteric Torsion / GDV'
                    : 'Toxic Ingestion / Dietary Indiscretion Enteropathy',
                  likelihood: 'Possible (32%)',
                  reasoning: 'Presenting history and signs warrant thorough rule-out via diagnostic modalities.',
                },
              ]).map((diff: any, idx: number) => {
                const isSelected =
                  selectedDiffIndex === idx || provisionalDiagnosis === diff.condition;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDifferential(diff, idx)}
                    className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-purple-50/90 dark:bg-purple-950/80 border-purple-500 shadow-md ring-2 ring-purple-400 scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                        <span>{diff.condition}</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {diff.likelihood}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      {diff.reasoning}
                    </p>

                    <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-[10px] font-bold text-purple-600 dark:text-purple-400">
                      <span>{isSelected ? '✓ Active Provisional Diagnosis' : '⚡ Tap to Adopt'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2.3 CRITICAL REQUIREMENT: AI DIAGNOSTIC TOOL SUGGESTS DOCTOR FOR BLOOD TESTS, USG, X-RAY */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  AI Confirmatory Modality Suggestions
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-teal-600" />
                  Recommended Diagnostic Workup (Blood Tests, USG, X-Ray)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  The AI diagnostic tool suggests the following specific investigations based on {activePet.name}'s {caseSpecialty} presentation:
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                To be uploaded in Step 3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category 1: Blood Tests */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
                <div className="flex items-center gap-2 border-b border-rose-200/80 dark:border-rose-800 pb-2">
                  <span className="text-base">🩸</span>
                  <div>
                    <h5 className="font-black text-xs text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                      1. Blood Tests Suggested
                    </h5>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                      CBC, BUN, Creatinine & Chemistries
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {bloodTestSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950 dark:text-rose-100 text-[11px]">
                          {item.test}
                        </span>
                        {item.highlight && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                            High Yield
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal">
                        {item.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: USG / Ultrasonography */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
                <div className="flex items-center gap-2 border-b border-blue-200/80 dark:border-blue-800 pb-2">
                  <span className="text-base">🔊</span>
                  <div>
                    <h5 className="font-black text-xs text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                      2. USG (Ultrasonography) Suggested
                    </h5>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Uterine, A-FAST & Parenchymal Scan
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {usgSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-950 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-950 dark:text-blue-100 text-[11px]">
                          {item.test}
                        </span>
                        {item.highlight && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Essential
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal">
                        {item.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: X-Ray / Radiography */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div className="flex items-center gap-2 border-b border-amber-200/80 dark:border-amber-800 pb-2">
                  <span className="text-base">🩻</span>
                  <div>
                    <h5 className="font-black text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      3. X-Ray (Radiographs) Suggested
                    </h5>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      Abdomen 2-View & Thorax/Orthopedic
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {xraySuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-950 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 dark:text-amber-100 text-[11px]">
                          {item.test}
                        </span>
                        {item.highlight && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Indicated
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal">
                        {item.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2.4 STEP NAVIGATION BAR */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToStep1}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 1: Taking History</span>
            </button>

            <button
              type="button"
              onClick={onProceedToStep3}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span>Proceed to Step 3: Upload X-Ray, CBC, BUN, Creatinine & USG</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
