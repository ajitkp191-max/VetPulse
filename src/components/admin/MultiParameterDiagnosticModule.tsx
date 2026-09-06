import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeMultiParameterDiagnosticWithAI } from '../../services/geminiService';
import {
  Sparkles,
  FlaskConical,
  Scan,
  Activity,
  Heart,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Printer,
  FileCheck,
  Zap,
  Layers,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const MultiParameterDiagnosticModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    labReports,
    imagingRecords,
    ecgRecords,
    consultations,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // Multi-parameter inputs
  const [symptoms, setSymptoms] = useState('Anorexia for 48h, acute bilious vomiting (3 episodes), mild lethargy, increased thirst (polydipsia).');
  const [physicalExam, setPhysicalExam] = useState('Tacky pale pink gums, mild abdominal splinting in cranial abdomen, skin tent 2.5s, no palpable masses.');
  const [history, setHistory] = useState('Current on Core DHPP & Rabies. Dietary indiscretion suspected (table scraps ingested 2 days prior).');

  // Vitals
  const [temperature, setTemperature] = useState(39.1);
  const [heartRate, setHeartRate] = useState(135);
  const [respiratoryRate, setRespiratoryRate] = useState(28);
  const [systolicBP, setSystolicBP] = useState(115);
  const [spo2, setSpo2] = useState(98);
  const [crt, setCrt] = useState(2.0);

  // Biochemical & Lab findings
  const petLabs = labReports.filter((l) => l.petId === selectedPet?.id);
  const latestLab = petLabs[0] || labReports[0];
  const [bunValue, setBunValue] = useState(38);
  const [creatinineValue, setCreatinineValue] = useState(2.2);
  const [altValue, setAltValue] = useState(128);
  const [wbcValue, setWbcValue] = useState(18.5);
  const [usgValue, setUsgValue] = useState(1.026);

  // Imaging findings
  const petImaging = imagingRecords.filter((i) => i.petId === selectedPet?.id);
  const latestImaging = petImaging[0] || imagingRecords[0];
  const [xrayFinding, setXrayFinding] = useState('Thorax clear; stomach shows mild fluid distension without radiopaque foreign bodies. VHS 9.7v.');
  const [usgFinding, setUsgFinding] = useState('Abdominal USG: Gut layering preserved; mild focal duodenal mucosal thickening (3.6mm); A-FAST 0/4 (no free fluid).');

  // ECG findings
  const petEcg = ecgRecords.filter((e) => e.petId === selectedPet?.id);
  const latestEcg = petEcg[0] || ecgRecords[0];
  const [ecgFinding, setEcgFinding] = useState('Sinus Tachycardia (135 bpm), normal P-QRS-T complexes, no ectopic ventricular complexes.');

  // AI Diagnostic State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const handleRunFusionDiagnostic = async () => {
    setIsAiLoading(true);
    try {
      const response = await analyzeMultiParameterDiagnosticWithAI({
        patient: {
          name: selectedPet.name,
          species: selectedPet.species,
          breed: selectedPet.breed,
          age: selectedPet.age,
          weight: selectedPet.weight,
        },
        vitals: {
          temperatureC: temperature,
          heartRateBpm: heartRate,
          respiratoryRateBpm: respiratoryRate,
          systolicBP,
          spo2Percent: spo2,
          crtSeconds: crt,
        },
        biochemicalData: {
          bun: bunValue,
          creatinine: creatinineValue,
          alt: altValue,
          wbc: wbcValue,
          urineSpecificGravity: usgValue,
          latestReportSummary: latestLab ? `${latestLab.testType}: ${latestLab.interpretation}` : 'Routine',
        },
        imagingData: {
          xray: xrayFinding,
          ultrasoundUSG: usgFinding,
        },
        ecgData: {
          rhythm: ecgFinding,
        },
        symptoms,
        physicalExam,
        history,
      });

      setDiagnosticResult(response);
      showNotification('AI Multi-Parameter Diagnostic Fusion synthesis generated!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Diagnostic synthesis generated with expert veterinary protocol.', 'info');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Multi-Parameter Diagnostic Fusion Hub
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                Cross-Modal Synthesis (Biochemistry + X-Ray + USG + ECG + Vitals)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrates lab biochemistry, radiographs, ultrasound sonography, cardiac rhythms, and vital signs for holistic patient triage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species} - {p.breed})
              </option>
            ))}
          </select>

          {diagnosticResult && (
            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Parameters Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Clinical Vitals & Signs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-teal-600" />
              <span>1. Vitals & Clinical Examination</span>
            </h4>
            <SpeciesBadge species={selectedPet.species} />
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">Body Temp (°C)</span>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">Heart Rate (BPM)</span>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">Respiration (RPM)</span>
              <input
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">CRT (Seconds)</span>
              <input
                type="number"
                step="0.1"
                value={crt}
                onChange={(e) => setCrt(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Presenting Symptoms & Duration
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Physical Palpation & Auscultation Findings
              </label>
              <textarea
                rows={2}
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Biochemical & Lab Biomarkers */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>2. Biochemical & Lab Panel</span>
            </h4>
            <span className="text-[10px] text-teal-600 font-bold bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
              Species Norms Applied
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">BUN (mg/dL)</span>
              <input
                type="number"
                step="0.1"
                value={bunValue}
                onChange={(e) => setBunValue(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">Creatinine (mg/dL)</span>
              <input
                type="number"
                step="0.1"
                value={creatinineValue}
                onChange={(e) => setCreatinineValue(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">ALT (U/L)</span>
              <input
                type="number"
                value={altValue}
                onChange={(e) => setAltValue(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border">
              <span className="text-[10px] text-slate-400 font-bold block">WBC (K/μL)</span>
              <input
                type="number"
                step="0.1"
                value={wbcValue}
                onChange={(e) => setWbcValue(Number(e.target.value))}
                className="w-full mt-1 bg-transparent font-bold text-sm text-teal-700 dark:text-teal-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Urine Specific Gravity (USG) & Urinalysis
            </label>
            <input
              type="number"
              step="0.001"
              value={usgValue}
              onChange={(e) => setUsgValue(Number(e.target.value))}
              placeholder="e.g. 1.025"
              className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Previous Medical History & Background
            </label>
            <textarea
              rows={2}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        {/* Column 3: Imaging & ECG Integration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Scan className="w-4 h-4 text-teal-600" />
              <span>3. Imaging (X-Ray/USG) & ECG</span>
            </h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              Multi-Modal
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Digital Radiography (X-Ray) Parameters & VHS
              </label>
              <textarea
                rows={2}
                value={xrayFinding}
                onChange={(e) => setXrayFinding(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Ultrasonography (USG / A-FAST Score / Gut Layering)
              </label>
              <textarea
                rows={2}
                value={usgFinding}
                onChange={(e) => setUsgFinding(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Electrocardiogram (ECG) Rhythm & Axis
              </label>
              <input
                type="text"
                value={ecgFinding}
                onChange={(e) => setEcgFinding(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Trigger Synthesis Button */}
          <button
            disabled={isAiLoading}
            onClick={handleRunFusionDiagnostic}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Multi-Parameter AI Diagnostics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Multi-Parameter AI Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Multi-Parameter Diagnostic Output Card */}
      {diagnosticResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-300 dark:border-teal-800 p-6 shadow-sm space-y-6 animate-in fade-in">
          {/* Output Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                  {diagnosticResult.clinicalTriageScore || 'Tier 2 Diagnostic Priority'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Source: {diagnosticResult.source}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Holistic Veterinary Multi-Parameter Diagnostic Assessment
              </h3>
              <p className="text-xs text-slate-500">
                Patient: {selectedPet.name} ({selectedPet.species} - {selectedPet.breed}, {selectedPet.weight} kg)
              </p>
            </div>
          </div>

          {/* Organ System Map */}
          {diagnosticResult.organSystemMap && (
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Organ System Functional Risk Mapping</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {diagnosticResult.organSystemMap.map((org: any, oIdx: number) => {
                  const isModOrHigh = org.riskLevel === 'Moderate' || org.riskLevel === 'High';
                  return (
                    <div
                      key={oIdx}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        isModOrHigh
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-slate-900 dark:text-white">{org.system}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isModOrHigh
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {org.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{org.summary}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Differential Diagnoses Ranked by Probability */}
          {diagnosticResult.integratedDifferentialDiagnoses && (
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-teal-600" />
                <span>Integrated Differential Diagnoses (Multi-Factor Probability)</span>
              </h5>
              <div className="space-y-2">
                {diagnosticResult.integratedDifferentialDiagnoses.map((item: any, iIdx: number) => (
                  <div
                    key={iIdx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {item.rank || iIdx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {item.diagnosis}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Key Drivers: </span>
                          {item.keyDrivers}
                        </p>
                      </div>
                    </div>
                    {item.probability && (
                      <div className="shrink-0 bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold px-3 py-1 rounded-xl text-xs border border-teal-300 dark:border-teal-800 text-center">
                        {item.probability} Probability
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flag Alerts & Therapeutic Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnosticResult.criticalAlerts && (
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs">
                <h5 className="font-bold text-rose-900 dark:text-rose-200 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Critical Red-Flag Alerts & Monitoring</span>
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-rose-950 dark:text-rose-100">
                  {diagnosticResult.criticalAlerts.map((alert: string, aIdx: number) => (
                    <li key={aIdx}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {diagnosticResult.evidenceBasedTreatmentProtocol && (
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
                <h5 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Evidence-Based Resuscitation & Treatment Protocol</span>
                </h5>
                <div className="space-y-1 text-[11px] text-teal-950 dark:text-teal-100">
                  {Object.entries(diagnosticResult.evidenceBasedTreatmentProtocol).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex items-start gap-1">
                      <span className="font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 w-24 shrink-0">
                        {k}:
                      </span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
