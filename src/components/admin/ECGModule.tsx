import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeECGWithAI } from '../../services/geminiService';
import {
  Activity,
  Heart,
  Sparkles,
  Upload,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  FileText,
  Sliders,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const ECGModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    ecgRecords,
    addECGRecord,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedEcgId, setSelectedEcgId] = useState<string>(ecgRecords[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for ECG Strip & Intervals
  const [heartRate, setHeartRate] = useState(110);
  const [rhythm, setRhythm] = useState('Normal Sinus Rhythm with Respiratory Sinus Arrhythmia');
  const [pWave, setPWave] = useState('0.04s, 0.25 mV (Normal)');
  const [prInterval, setPrInterval] = useState('0.09s');
  const [qrsDuration, setQrsDuration] = useState('0.05s (Narrow complex)');
  const [qtInterval, setQtInterval] = useState('0.19s');
  const [stSegment, setStSegment] = useState('Isoelectric');
  const [tWave, setTWave] = useState('Positive, concordant');
  const [electricalAxis, setElectricalAxis] = useState('+70° (Normal MEA)');
  const [notes, setNotes] = useState('Paper speed: 50 mm/s, Calibration: 10 mm/mV (Lead II). Pre-anesthetic screening.');

  // AI State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const activeEcg = ecgRecords.find((e) => e.id === selectedEcgId) || ecgRecords[0];

  const handleRunAiECG = async () => {
    setIsAiAnalyzing(true);
    try {
      const result = await analyzeECGWithAI({
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        heartRate,
        rhythm,
        notes,
      });
      setAiAnalysisResult(result);
      showNotification('Gemini AI Veterinary ECG Diagnostic Report generated!', 'success');
    } catch (err) {
      showNotification('AI ECG evaluation failed', 'error');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSaveEcg = (e: React.FormEvent) => {
    e.preventDefault();
    addECGRecord({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      date: new Date().toISOString().split('T')[0],
      heartRate,
      rhythm,
      pWave,
      prInterval,
      qrsDuration,
      qtInterval,
      stSegment,
      tWave,
      electricalAxis,
      aiDiagnosticReport: aiAnalysisResult ? aiAnalysisResult.summary : 'Normal sinus morphology evaluated.',
      notes,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 rounded-2xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Electrocardiography (ECG / EKG) & Cardiology
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Waveform calipers, interval analysis, arrhythmia classification & AI cardiology interpretation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New ECG Tracing</span>
        </button>
      </div>

      {/* Grid: Saved Traces & Waveform Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of ECGs */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Cardiology Records ({ecgRecords.length})
          </h4>
          {ecgRecords.map((item) => {
            const isSelected = item.id === activeEcg?.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedEcgId(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.petName}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>HR: {item.heartRate} bpm</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                  {item.rhythm}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Active ECG Tracing Visualizer */}
        {activeEcg && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Lead II Rhythm Strip
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{activeEcg.petName} ({activeEcg.species})</span>
                  <SpeciesBadge species={activeEcg.species} />
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 flex items-center justify-end gap-1">
                    <Activity className="w-5 h-5 animate-pulse" />
                    <span>{activeEcg.heartRate} BPM</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">50mm/s • 10mm/mV</span>
                </div>
              </div>
            </div>

            {/* Medical Millimeter Grid ECG Canvas Simulation */}
            <div className="bg-[#121820] p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
              {/* Millimeter Grid Texture */}
              <div
                className="w-full h-44 rounded-xl relative overflow-hidden"
                style={{
                  backgroundColor: '#0a1018',
                  backgroundImage:
                    'linear-gradient(to right, rgba(239, 68, 68, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(239, 68, 68, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(239, 68, 68, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(239, 68, 68, 0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px, 20px 20px, 4px 4px, 4px 4px',
                }}
              >
                {/* SVG Lead II Pulse Waveform */}
                <svg className="w-full h-full" viewBox="0 0 1000 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ecgGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  {/* Repeated P-Q-R-S-T cycles */}
                  <path
                    d="M0,90 L60,90 Q75,76 85,90 L110,90 L120,105 L135,15 L150,125 L160,90 L185,90 Q205,70 220,90 L270,90
                       M270,90 L330,90 Q345,76 355,90 L380,90 L390,105 L405,15 L420,125 L430,90 L455,90 Q475,70 490,90 L540,90
                       M540,90 L600,90 Q615,76 625,90 L650,90 L660,105 L675,15 L690,125 L700,90 L725,90 Q745,70 760,90 L810,90
                       M810,90 L870,90 Q885,76 895,90 L920,90 L930,105 L945,15 L960,125 L970,90 L1000,90"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Lead II • Real-time Calibrated
                  </span>
                </div>
              </div>
            </div>

            {/* Waveform Parameters Caliper Matrix */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Cardiology Caliper Intervals & Axis
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">P-Wave</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.pWave}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">P-R Interval</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.prInterval}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">QRS Complex</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.qrsDuration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Q-T Interval</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.qtInterval}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ST Segment</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.stSegment}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">T-Wave</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.tWave}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mean Electrical Axis</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeEcg.electricalAxis}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Rhythm Diagnosis</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 truncate block">{activeEcg.rhythm}</span>
                </div>
              </div>
            </div>

            {/* AI Cardiology Diagnostic Report */}
            {activeEcg.aiDiagnosticReport && (
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs">
                <h5 className="font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Gemini AI Veterinary Cardiology Interpretation</span>
                </h5>
                <p className="text-teal-950 dark:text-teal-100 leading-relaxed font-medium">
                  {activeEcg.aiDiagnosticReport}
                </p>
                {activeEcg.notes && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    <strong>Study Notes:</strong> {activeEcg.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* NEW ECG TRACING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" />
                <span>Record New ECG Tracing & AI Assessment</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEcg} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Patient
                  </label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    required
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Rhythm Classification
                </label>
                <input
                  type="text"
                  required
                  value={rhythm}
                  onChange={(e) => setRhythm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Intervals Matrix Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">P-Wave</label>
                  <input
                    type="text"
                    value={pWave}
                    onChange={(e) => setPWave(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">P-R Interval</label>
                  <input
                    type="text"
                    value={prInterval}
                    onChange={(e) => setPrInterval(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">QRS Duration</label>
                  <input
                    type="text"
                    value={qrsDuration}
                    onChange={(e) => setQrsDuration(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Electrical Axis</label>
                  <input
                    type="text"
                    value={electricalAxis}
                    onChange={(e) => setElectricalAxis(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* AI Cardiology Trigger Button */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">
                    Gemini AI Veterinary Cardiology Review
                  </span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-300">
                    Automated wave morphology validation & arrhythmia triage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRunAiECG}
                  disabled={isAiAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {isAiAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Assessing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run AI Analysis</span>
                    </>
                  )}
                </button>
              </div>

              {aiAnalysisResult && (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-purple-200 text-xs space-y-1">
                  <p className="font-bold text-purple-900 dark:text-purple-200">
                    Conclusion: {aiAnalysisResult.rhythmAssessment}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">{aiAnalysisResult.summary}</p>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Study Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Save ECG Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
