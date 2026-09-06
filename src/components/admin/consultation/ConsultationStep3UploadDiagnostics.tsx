import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  FlaskConical,
  Activity,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { CaseSpecialty } from './ConsultationStep1History';

interface Step3UploadDiagnosticsProps {
  activePet: {
    name: string;
    species: string;
    weight: number;
  };
  caseSpecialty: CaseSpecialty;

  // Lab CBC & Chemistry
  labTestType: string;
  setLabTestType: (val: string) => void;
  labFileAttached: string | null;
  setLabFileAttached: (val: string | null) => void;
  labFileName: string;
  setLabFileName: (val: string) => void;
  bun: number;
  setBun: (val: number) => void;
  creatinine: number;
  setCreatinine: (val: number) => void;
  wbc: number;
  setWbc: (val: number) => void;
  rbc: number;
  setRbc: (val: number) => void;
  hemoglobin: number;
  setHemoglobin: (val: number) => void;
  hematocrit: number;
  setHematocrit: (val: number) => void;
  platelets: number;
  setPlatelets: (val: number) => void;
  alt: number;
  setAlt: (val: number) => void;
  alp: number;
  setAlp: (val: number) => void;
  bloodGlucoseVal: number;
  setBloodGlucoseVal: (val: number) => void;
  labParametersText: string;
  setLabParametersText: (val: string) => void;
  labNotes: string;
  setLabNotes: (val: string) => void;

  // X-Ray
  xrayRegion: string;
  setXrayRegion: (val: string) => void;
  xrayFileAttached: string | null;
  setXrayFileAttached: (val: string | null) => void;
  xrayFileName: string;
  setXrayFileName: (val: string) => void;
  xrayFindings: string;
  setXrayFindings: (val: string) => void;

  // USG
  usgRegion: string;
  setUsgRegion: (val: string) => void;
  usgFileAttached: string | null;
  setUsgFileAttached: (val: string | null) => void;
  usgFileName: string;
  setUsgFileName: (val: string) => void;
  usgFindings: string;
  setUsgFindings: (val: string) => void;

  // Other Diagnostics
  ecgRhythm: string;
  setEcgRhythm: (val: string) => void;
  cytologyFindings: string;
  setCytologyFindings: (val: string) => void;

  // Navigation
  onProceedToStep4: () => void;
  onBackToStep2: () => void;
  onSkipToPrescription?: () => void;
}

export const ConsultationStep3UploadDiagnostics: React.FC<Step3UploadDiagnosticsProps> = ({
  activePet,
  caseSpecialty,
  labTestType,
  setLabTestType,
  labFileAttached,
  setLabFileAttached,
  labFileName,
  setLabFileName,
  bun,
  setBun,
  creatinine,
  setCreatinine,
  wbc,
  setWbc,
  rbc,
  setRbc,
  hemoglobin,
  setHemoglobin,
  hematocrit,
  setHematocrit,
  platelets,
  setPlatelets,
  alt,
  setAlt,
  alp,
  setAlp,
  bloodGlucoseVal,
  setBloodGlucoseVal,
  labParametersText,
  setLabParametersText,
  labNotes,
  setLabNotes,
  xrayRegion,
  setXrayRegion,
  xrayFileAttached,
  setXrayFileAttached,
  xrayFileName,
  setXrayFileName,
  xrayFindings,
  setXrayFindings,
  usgRegion,
  setUsgRegion,
  usgFileAttached,
  setUsgFileAttached,
  usgFileName,
  setUsgFileName,
  usgFindings,
  setUsgFindings,
  ecgRhythm,
  setEcgRhythm,
  cytologyFindings,
  setCytologyFindings,
  onProceedToStep4,
  onBackToStep2,
  onSkipToPrescription,
}) => {
  const [activeTab, setActiveTab] = useState<'labs' | 'xray' | 'usg' | 'other'>('labs');

  // Calculate BUN:Creatinine ratio
  const bunCreatRatio = bun > 0 && creatinine > 0 ? (bun / creatinine).toFixed(1) : '—';

  // Clear all lab parameters
  const clearAllLabs = () => {
    setBun('' as any);
    setCreatinine('' as any);
    setWbc('' as any);
    setRbc('' as any);
    setHemoglobin('' as any);
    setHematocrit('' as any);
    setPlatelets('' as any);
    setAlt('' as any);
    setAlp('' as any);
    setBloodGlucoseVal('' as any);
    setLabNotes('');
    setLabParametersText('');
    setLabFileAttached(null);
    setLabFileName('');
  };

  // Apply quick clinical diagnostic presets
  const applyLabPreset = (preset: 'normal' | 'prerenal' | 'pyometra' | 'renal') => {
    if (preset === 'normal') {
      setBun(16);
      setCreatinine(1.0);
      setWbc(11.2);
      setRbc(6.8);
      setHemoglobin(14.5);
      setHematocrit(44);
      setPlatelets(280);
      setAlt(42);
      setAlp(65);
      setBloodGlucoseVal(95);
      setLabNotes('All hematology and serum chemistry parameters within physiological species ranges.');
      setLabParametersText('WBC: 11.2 (Normal), RBC: 6.8, HCT: 44%, BUN: 16 mg/dL, Creatinine: 1.0 mg/dL, ALT: 42 U/L, ALP: 65 U/L');
    } else if (preset === 'prerenal') {
      setBun(36);
      setCreatinine(1.7);
      setWbc(17.4);
      setRbc(8.2);
      setHemoglobin(18.2);
      setHematocrit(53);
      setPlatelets(340);
      setAlt(68);
      setAlp(88);
      setBloodGlucoseVal(112);
      setLabNotes('Marked hemoconcentration with high normal HCT. Disproportionate BUN elevation indicating pre-renal hypovolemic azotemia secondary to dehydration.');
      setLabParametersText('WBC: 17.4 (Mild Leukocytosis), HCT: 53% (Hemoconcentration), BUN: 36 mg/dL (High), Creatinine: 1.7 mg/dL (Mild Elevation), BUN:Creat ratio 21.2');
    } else if (preset === 'pyometra') {
      setWbc(38.5);
      setBun(34);
      setCreatinine(1.6);
      setRbc(5.1);
      setHemoglobin(11.2);
      setHematocrit(33);
      setPlatelets(490);
      setAlt(74);
      setAlp(120);
      setBloodGlucoseVal(104);
      setLabNotes('Severe neutrophilic leukocytosis with degenerative left shift and mild pre-renal azotemia. Strongly diagnostic for severe internal suppurative focus (Pyometra / Peritonitis).');
      setLabParametersText('WBC: 38.5 (Marked Leukocytosis with Left Shift), HCT: 33% (Mild normocytic anemia), BUN: 34 mg/dL (Azotemic), Creatinine: 1.6 mg/dL, ALP: 120 U/L');
    } else if (preset === 'renal') {
      setBun(74);
      setCreatinine(4.2);
      setWbc(14.8);
      setRbc(4.2);
      setHemoglobin(9.5);
      setHematocrit(28);
      setPlatelets(195);
      setAlt(55);
      setAlp(95);
      setBloodGlucoseVal(98);
      setLabNotes('Severe primary intrinsic renal azotemia with marked elevation in both BUN and Creatinine, accompanied by non-regenerative normochromic anemia.');
      setLabParametersText('BUN: 74 mg/dL (Severe Uremia), Creatinine: 4.2 mg/dL (Renal Azotemia), HCT: 28% (Anemia), WBC: 14.8');
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'lab' | 'xray' | 'usg'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'lab') {
        setLabFileAttached(url);
        setLabFileName(file.name);
      } else if (type === 'xray') {
        setXrayFileAttached(url);
        setXrayFileName(file.name);
      } else if (type === 'usg') {
        setUsgFileAttached(url);
        setUsgFileName(file.name);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 3.1 HEADER & MODALITY SELECTOR */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                Step 3 • Diagnostic Modalities
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Patient: {activePet.name} ({activePet.weight} kg)
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-600" />
              Upload & Record Diagnostics (X-Ray, CBC, BUN, Creatinine, USG)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter lab values or attach image/report files. These parameters will be synthesized by the AI in Step 4.
            </p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('labs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'labs'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🩸 CBC & Chemistries (BUN / Creat)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('xray')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'xray'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🩻 X-Ray (Radiographs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('usg')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'usg'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🔊 USG (Ultrasonography)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('other')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'other'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🧪 Other Tests</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CBC & BLOOD CHEMISTRY (BUN, CREATININE, CBC, LIVER) */}
        {/* ========================================================================= */}
        {activeTab === 'labs' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Quick Presets Strip */}
            <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>💡 Presets & Suggestions (Fill manually or click to suggest):</span>
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyLabPreset('normal')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 hover:bg-emerald-100 text-[11px] cursor-pointer"
                >
                  💡 Suggest Healthy Baseline
                </button>
                <button
                  type="button"
                  onClick={() => applyLabPreset('prerenal')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 hover:bg-amber-100 text-[11px] cursor-pointer"
                >
                  ⚡ Suggest Pre-Renal Azotemia
                </button>
                <button
                  type="button"
                  onClick={() => applyLabPreset('pyometra')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 hover:bg-rose-100 text-[11px] cursor-pointer"
                >
                  ⚡ Suggest Sepsis / Pyometra
                </button>
                <button
                  type="button"
                  onClick={() => applyLabPreset('renal')}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 hover:bg-purple-100 text-[11px] cursor-pointer"
                >
                  ⚡ Suggest Renal Failure
                </button>
                <button
                  type="button"
                  onClick={clearAllLabs}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 text-[11px] cursor-pointer"
                >
                  🧹 Clear All Labs
                </button>
              </div>
            </div>

            {/* CRITICAL PARAMETERS: BUN & CREATININE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* BUN Input Card */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-rose-950 dark:text-rose-100 text-xs">
                    Blood Urea Nitrogen (BUN)
                  </label>
                  <button
                    type="button"
                    onClick={() => setBun(16)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 hover:underline cursor-pointer"
                    title="Click to insert normal BUN (16 mg/dL)"
                  >
                    Suggest 16 (7-27)
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={bun === 0 || !bun ? '' : bun}
                    onChange={(e) => setBun(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 16"
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 font-black text-sm text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">mg/dL</span>
                </div>
                <span className={`text-[10px] block font-bold ${bun && bun > 27 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {bun ? (bun > 27 ? '⚠️ Azotemia / Elevation Detected' : '✓ Within normal canine/feline range') : 'Normal: 7 - 27 mg/dL'}
                </span>
              </div>

              {/* Creatinine Input Card */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-rose-950 dark:text-rose-100 text-xs">
                    Serum Creatinine
                  </label>
                  <button
                    type="button"
                    onClick={() => setCreatinine(1.0)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 hover:underline cursor-pointer"
                    title="Click to insert normal Creatinine (1.0 mg/dL)"
                  >
                    Suggest 1.0 (0.5-1.5)
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={creatinine === 0 || !creatinine ? '' : creatinine}
                    onChange={(e) => setCreatinine(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 1.0"
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 font-black text-sm text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">mg/dL</span>
                </div>
                <span className={`text-[10px] block font-bold ${creatinine && creatinine > 1.5 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {creatinine ? (creatinine > 1.5 ? '⚠️ Elevated (Impaired Renal Filtration)' : '✓ Normal GFR biomarker') : 'Normal: 0.5 - 1.5 mg/dL'}
                </span>
              </div>

              {/* Auto-Calculated BUN:Creatinine Ratio */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-indigo-950 dark:text-indigo-100 text-xs">
                    Calculated BUN : Creatinine Ratio
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                    Target: 10 - 20
                  </span>
                </div>
                <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                  {bunCreatRatio}
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {bun && creatinine
                    ? parseFloat(bunCreatRatio) > 20
                      ? 'Ratio > 20 points towards Pre-Renal Azotemia / Dehydration hypovolemia.'
                      : parseFloat(bunCreatRatio) < 10
                      ? 'Low ratio points towards reduced protein intake or liver disease.'
                      : 'Normal ratio between blood urea and creatinine clearance.'
                    : 'Calculates automatically when both BUN and Creatinine are entered.'}
                </p>
              </div>
            </div>

            {/* CBC PARAMETERS GRID */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>Complete Blood Count (CBC) Hematology Profile</span>
                <span className="text-[10px] text-slate-400 font-normal">Manual entry or analyzer values</span>
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    WBC (×10³/µL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={wbc === 0 || !wbc ? '' : wbc}
                    onChange={(e) => setWbc(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 11.2"
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setWbc(11.2)}
                    className="text-[9px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                  >
                    Suggest 11.2 (6-17)
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    RBC (×10⁶/µL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rbc === 0 || !rbc ? '' : rbc}
                    onChange={(e) => setRbc(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 6.8"
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setRbc(6.8)}
                    className="text-[9px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                  >
                    Suggest 6.8 (5.5-8.5)
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Hemoglobin (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hemoglobin === 0 || !hemoglobin ? '' : hemoglobin}
                    onChange={(e) => setHemoglobin(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 14.5"
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setHemoglobin(14.5)}
                    className="text-[9px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                  >
                    Suggest 14.5 (12-18)
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    HCT / PCV (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={hematocrit === 0 || !hematocrit ? '' : hematocrit}
                    onChange={(e) => setHematocrit(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 44"
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setHematocrit(44)}
                    className="text-[9px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                  >
                    Suggest 44 (37-55%)
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Platelets (×10³/µL)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={platelets === 0 || !platelets ? '' : platelets}
                    onChange={(e) => setPlatelets(e.target.value === '' ? ('' as any) : parseFloat(e.target.value))}
                    placeholder="e.g. 280"
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setPlatelets(280)}
                    className="text-[9px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                  >
                    Suggest 280 (200-500)
                  </button>
                </div>
              </div>
            </div>

            {/* LIVER & METABOLIC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ALT (SGPT)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={alt === 0 || !alt ? '' : alt}
                    onChange={(e) => setAlt(e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10))}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 font-bold"
                  />
                  <span className="text-slate-400 font-bold text-[11px]">U/L</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlt(42)}
                  className="text-[10px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                >
                  Suggest 42 (10 - 100 U/L)
                </button>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  ALP (Alk Phos)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={alp === 0 || !alp ? '' : alp}
                    onChange={(e) => setAlp(e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10))}
                    placeholder="e.g. 65"
                    className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 font-bold"
                  />
                  <span className="text-slate-400 font-bold text-[11px]">U/L</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlp(65)}
                  className="text-[10px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                >
                  Suggest 65 (23 - 212 U/L)
                </button>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Blood Glucose
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={bloodGlucoseVal === 0 || !bloodGlucoseVal ? '' : bloodGlucoseVal}
                    onChange={(e) => setBloodGlucoseVal(e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10))}
                    placeholder="e.g. 95"
                    className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 font-bold"
                  />
                  <span className="text-slate-400 font-bold text-[11px]">mg/dL</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBloodGlucoseVal(95)}
                  className="text-[10px] text-teal-600 hover:underline cursor-pointer block mt-0.5"
                >
                  Suggest 95 (70 - 140 mg/dL)
                </button>
              </div>
            </div>

            {/* LAB REPORT FILE UPLOAD & NOTES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <FlaskConical className="w-8 h-8 text-teal-600" />
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                    Upload Laboratory Report Slip / PDF / Image
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports CBC analyzers, Idexx, Zoetis, Heska, or scanned lab slips
                  </span>
                </div>

                <label className="cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                  <span>Browse Lab File</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'lab')}
                    className="hidden"
                  />
                </label>

                {labFileAttached && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-xl text-xs font-bold border border-teal-200">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{labFileName || 'Lab_Report_Attached.pdf'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLabFileAttached(null);
                        setLabFileName('');
                      }}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor / Pathologist Comments on Lab Results
                </label>
                <textarea
                  rows={4}
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  placeholder="e.g. Mild neutrophilia with pre-renal azotemia likely secondary to ongoing vomiting and dehydration..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DIGITAL X-RAY / RADIOGRAPHS */}
        {/* ========================================================================= */}
        {activeTab === 'xray' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Anatomical Radiographic Region
                  </label>
                  <select
                    value={xrayRegion}
                    onChange={(e) => setXrayRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Abdomen (Lateral & Ventrodorsal Views)">Abdomen (Lateral & Ventrodorsal Views)</option>
                    <option value="Thorax (3-View Right/Left Lateral & VD)">Thorax (3-View Right/Left Lateral & VD)</option>
                    <option value="Pelvis & Coxofemoral Joints">Pelvis & Coxofemoral Joints</option>
                    <option value="Hindlimb / Stifle / Tibia-Fibula">Hindlimb / Stifle / Tibia-Fibula</option>
                    <option value="Forelimb / Humerus / Radius-Ulna">Forelimb / Humerus / Radius-Ulna</option>
                    <option value="Cervical / Thoracolumbar Spine">Cervical / Thoracolumbar Spine</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-teal-600 mx-auto" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                    Attach Digital Radiograph (JPEG, PNG, DICOM)
                  </span>
                  <label className="inline-block cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                    <span>Upload X-Ray File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'xray')}
                      className="hidden"
                    />
                  </label>
                  {xrayFileName && (
                    <span className="block text-[11px] font-bold text-teal-600">
                      File: {xrayFileName}
                    </span>
                  )}
                </div>

                {/* Quick findings buttons */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Click to append common radiographic observations:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Gaseous gastric distension with fluid pooling; no obstructive ileus',
                      'Radiopaque foreign body in mid-jejunum with dilated loops',
                      'Marked gastric dilation with soft tissue compartmentalization (GDV)',
                      'Displaced transverse mid-diaphyseal long bone fracture',
                      'Fetal skeletal calcification visible (Viable bone count = 4)',
                      'Normal thoracic silhouette; no pulmonary metastasis',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setXrayFindings((prev) => prev ? `${prev}\n• ${tag}` : tag)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview and Findings Textarea */}
              <div className="space-y-3">
                {xrayFileAttached ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56 bg-black flex items-center justify-center">
                    <img
                      src={xrayFileAttached}
                      alt="Uploaded X-Ray"
                      className="w-full h-full object-contain max-h-52"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                      {xrayRegion}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setXrayFileAttached(null);
                        setXrayFileName('');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs transition-colors cursor-pointer"
                      title="Remove uploaded X-Ray"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    No X-Ray image uploaded yet
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Radiographic Findings & Interpretation
                    </label>
                    {xrayFindings && (
                      <button
                        type="button"
                        onClick={() => setXrayFindings('')}
                        className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        Clear Findings
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={xrayFindings}
                    onChange={(e) => setXrayFindings(e.target.value)}
                    placeholder="Enter radiologist or clinician observations regarding organs, alignment, foreign bodies..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ULTRASONOGRAPHY (USG) */}
        {/* ========================================================================= */}
        {activeTab === 'usg' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sonographic Scan Region / Protocol
                  </label>
                  <select
                    value={usgRegion}
                    onChange={(e) => setUsgRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Abdominal Ultrasonography (A-FAST)">Abdominal Ultrasonography (A-FAST)</option>
                    <option value="Reproductive & Uterine Horn Scan">Reproductive & Uterine Horn Scan</option>
                    <option value="Urinary Bladder & Renal Architecture">Urinary Bladder & Renal Architecture</option>
                    <option value="Hepatobiliary & Gallbladder Focus">Hepatobiliary & Gallbladder Focus</option>
                    <option value="Echocardiography (TTE)">Echocardiography (TTE)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-2">
                  <Activity className="w-8 h-8 text-teal-600 mx-auto" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                    Attach Ultrasound Scan Image or Cine-Loop
                  </span>
                  <label className="inline-block cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                    <span>Upload USG File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'usg')}
                      className="hidden"
                    />
                  </label>
                  {usgFileName && (
                    <span className="block text-[11px] font-bold text-teal-600">
                      File: {usgFileName}
                    </span>
                  )}
                </div>

                {/* Quick sonographic tags */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Click to append sonographic findings:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Marked uterine horn dilation with intraluminal anechoic/turbid fluid (Pyometra)',
                      'A-FAST 0/4 Negative: No free peritoneal effusion in dependent sites',
                      'Mild gastric mucosal thickening (4.8mm) consistent with acute gastritis',
                      'Intact renal corticomedullary architecture; no pelvic dilation',
                      'Hyperechoic cystic calculi with strong acoustic shadowing',
                      'Viable fetal heart beats present with active movement',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setUsgFindings((prev) => prev ? `${prev}\n• ${tag}` : tag)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview and Textarea */}
              <div className="space-y-3">
                {usgFileAttached ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56 bg-black flex items-center justify-center">
                    <img
                      src={usgFileAttached}
                      alt="Uploaded USG Scan"
                      className="w-full h-full object-contain max-h-52"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                      {usgRegion}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUsgFileAttached(null);
                        setUsgFileName('');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs transition-colors cursor-pointer"
                      title="Remove uploaded USG scan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    No USG scan uploaded yet
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Sonographic Findings & Measurement Notes
                    </label>
                    {usgFindings && (
                      <button
                        type="button"
                        onClick={() => setUsgFindings('')}
                        className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        Clear Findings
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={usgFindings}
                    onChange={(e) => setUsgFindings(e.target.value)}
                    placeholder="Enter sonographer measurements, organ echogenicity, fluid accumulations..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OTHER TESTS (ECG, CYTOLOGY, RAPID KITS) */}
        {/* ========================================================================= */}
        {activeTab === 'other' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                ECG Rhythm Analysis
              </label>
              <textarea
                rows={3}
                value={ecgRhythm}
                onChange={(e) => setEcgRhythm(e.target.value)}
                placeholder="e.g. Normal sinus rhythm, rate 120 bpm, normal intervals..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Cytology & Rapid Antigen Test Findings
              </label>
              <textarea
                rows={3}
                value={cytologyFindings}
                onChange={(e) => setCytologyFindings(e.target.value)}
                placeholder="e.g. Vaginal cytology: Cornified superficial epithelial cells 85%..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3.2 STEP NAVIGATION BAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToStep2}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to AI Diagnosis</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {onSkipToPrescription && (
            <button
              type="button"
              onClick={onSkipToPrescription}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Skip Upload & Go to Prescription</span>
            </button>
          )}

          <button
            type="button"
            onClick={onProceedToStep4}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span>Correlate Diagnostics & Re-Diagnose</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
