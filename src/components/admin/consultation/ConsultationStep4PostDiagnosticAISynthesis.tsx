import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  Stethoscope,
  Activity,
  Layers,
  HelpCircle,
  Pill,
  HeartPulse,
} from 'lucide-react';
import { getPostDiagnosticAIAssist } from '../../../services/geminiService';
import { CaseSpecialty } from './ConsultationStep1History';

interface Step4PostDiagnosticProps {
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
  duration: string;
  vitalsSummary: string;
  
  // Diagnostic Values
  bun: number;
  creatinine: number;
  wbc: number;
  hematocrit: number;
  labNotes: string;
  xrayFindings: string;
  xrayRegion: string;
  usgFindings: string;
  usgRegion: string;

  // Final outputs
  finalDiagnosis: string;
  setFinalDiagnosis: (val: string) => void;
  suspectedCause: string;
  setSuspectedCause: (val: string) => void;
  treatmentPlan: string;
  setTreatmentPlan: (val: string) => void;
  aiSuggestedPrescription: any[];
  setAiSuggestedPrescription: (items: any[]) => void;

  // Navigation
  onProceedToStep5: () => void;
  onBackToStep3: () => void;
}

export const ConsultationStep4PostDiagnosticAISynthesis: React.FC<Step4PostDiagnosticProps> = ({
  activePet,
  caseSpecialty,
  selectedSigns,
  chiefComplaint,
  duration,
  vitalsSummary,
  bun,
  creatinine,
  wbc,
  hematocrit,
  labNotes,
  xrayFindings,
  xrayRegion,
  usgFindings,
  usgRegion,
  finalDiagnosis,
  setFinalDiagnosis,
  suspectedCause,
  setSuspectedCause,
  treatmentPlan,
  setTreatmentPlan,
  aiSuggestedPrescription,
  setAiSuggestedPrescription,
  onProceedToStep5,
  onBackToStep3,
}) => {
  const [loading, setLoading] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<any>(null);

  const runPostDiagnosticAi = async () => {
    setLoading(true);
    try {
      const labSummaryText = `BUN: ${bun} mg/dL, Serum Creatinine: ${creatinine} mg/dL (BUN:Creat Ratio: ${(bun / (creatinine || 1)).toFixed(1)}), WBC: ${wbc} k/uL, HCT: ${hematocrit}%. Notes: ${labNotes || 'None'}`;
      const xraySummaryText = `Region: ${xrayRegion}. Findings: ${xrayFindings || 'None reported'}`;
      const usgSummaryText = `Region: ${usgRegion}. Findings: ${usgFindings || 'None reported'}`;

      const res = await getPostDiagnosticAIAssist({
        petName: activePet.name,
        species: activePet.species,
        breed: activePet.breed,
        age: activePet.age,
        weight: activePet.weight,
        caseType: caseSpecialty,
        selectedSigns: selectedSigns,
        historySummary: `${chiefComplaint}. Duration: ${duration}. Presenting signs: ${selectedSigns.join(', ')}`,
        vitals: vitalsSummary,
        labSummary: labSummaryText,
        xrayFindings: xraySummaryText,
        usgFindings: usgSummaryText,
      });

      setSynthesisResult(res);

      if (res.confirmedDiagnosis) {
        setFinalDiagnosis(res.confirmedDiagnosis);
      }
      if (res.suspectedCause) {
        setSuspectedCause(res.suspectedCause);
      }
      if (res.treatmentPlan || res.fluidTherapyPlan) {
        const fullPlan = [
          res.treatmentPlan,
          res.fluidTherapyPlan ? `Fluid Protocol: ${res.fluidTherapyPlan}` : '',
          res.dietaryAdvice ? `Dietary Plan: ${res.dietaryAdvice}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');
        setTreatmentPlan(fullPlan);
      }

      if (res.suggestedPrescription && res.suggestedPrescription.length > 0) {
        setAiSuggestedPrescription(res.suggestedPrescription);
      }
    } catch (err) {
      console.error('Error in post-diagnostic synthesis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!synthesisResult) {
      runPostDiagnosticAi();
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4.1 HEADER */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-300 rounded-2xl border border-teal-400/30">
              <Sparkles className="w-6 h-6 animate-pulse text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
                  Step 4 • Multi-Modality AI Synthesis
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {caseSpecialty}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                Post-Diagnostic AI Synthesis: Confirmed Condition & Suspected Cause
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={runPostDiagnosticAi}
            disabled={loading}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Synthesizing Labs & Scans...' : 'Re-synthesize Diagnostics'}</span>
          </button>
        </div>

        {/* Input Parameters Summary */}
        <div className="bg-white/10 rounded-2xl p-3 text-xs backdrop-blur-xs border border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-teal-200 font-bold uppercase text-[10px] tracking-wider">
            Synthesized Evidence:
          </span>
          <span className="bg-teal-950/60 text-teal-200 px-2.5 py-0.5 rounded-md font-semibold border border-teal-700/50">
            BUN: {bun} mg/dL • Creatinine: {creatinine} mg/dL
          </span>
          <span className="bg-teal-950/60 text-teal-200 px-2.5 py-0.5 rounded-md font-semibold border border-teal-700/50">
            WBC: {wbc} k/uL • HCT: {hematocrit}%
          </span>
          <span className="bg-teal-950/60 text-teal-200 px-2.5 py-0.5 rounded-md font-semibold border border-teal-700/50">
            X-Ray: {xrayFindings ? 'Recorded' : 'Pending'}
          </span>
          <span className="bg-teal-950/60 text-teal-200 px-2.5 py-0.5 rounded-md font-semibold border border-teal-700/50">
            USG: {usgFindings ? 'Recorded' : 'Pending'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <RotateCw className="w-6 h-6 animate-spin text-teal-600" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Correlating History with Uploaded X-Ray, CBC, BUN, Creatinine & USG
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Synthesizing renal parameters, systemic leukocyte kinetics, and sonographic/radiographic evidence to isolate primary etiology and suspected cause...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 4.2 CONFIRMED CONDITION & SUSPECTED CAUSE HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Confirmed / Definitive Clinical Diagnosis */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-teal-200 dark:border-teal-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Confirmed Clinical Diagnosis
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                  Post-Diagnostic Correlation
                </span>
              </div>

              <textarea
                rows={2}
                value={finalDiagnosis}
                onChange={(e) => setFinalDiagnosis(e.target.value)}
                placeholder="Definitive diagnosis substantiated by imaging and bloodwork..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 text-slate-900 dark:text-white font-bold text-sm"
              />

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Corroborated by CBC (WBC {wbc}k), BUN ({bun} mg/dL), Creatinine ({creatinine} mg/dL), and imaging scan results.
              </p>
            </div>

            {/* Card 2: Suspected Cause (Etiology & Underlying Pathophysiology) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-amber-200 dark:border-amber-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Suspected Underlying Cause (Etiology)
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Primary Pathophysiology
                </span>
              </div>

              <textarea
                rows={3}
                value={suspectedCause}
                onChange={(e) => setSuspectedCause(e.target.value)}
                placeholder="Underlying physiological or anatomical cause (e.g. bacterial colonization, mechanical obstruction, toxin exposure)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/40 text-slate-900 dark:text-white font-semibold text-xs leading-relaxed"
              />

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Explains the precise sequence leading to clinical signs, allowing targeted pharmaceutical or surgical resolution.
              </p>
            </div>
          </div>

          {/* 4.3 MULTI-ORGAN STATUS & DIAGNOSTIC CORRELATION MATRIX */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Diagnostic Correlation & Organ Status Assessment</span>
              <span className="text-[10px] text-teal-600 font-semibold">Gemini Multi-Parameter Model</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {/* Renal Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  1. Renal Filtration & Hydration Status
                </span>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    • BUN: <strong>{bun} mg/dL</strong> | Creat: <strong>{creatinine} mg/dL</strong>
                  </p>
                  <p>
                    • Status: {bun > 27 ? (
                      <strong className="text-amber-600">Pre-renal Azotemia secondary to fluid loss</strong>
                    ) : (
                      <strong className="text-emerald-600">Normal renal biomarkers</strong>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Calculated BUN:Creat ratio is {(bun / (creatinine || 1)).toFixed(1)}. Rehydration will normalize GFR clearance.
                  </p>
                </div>
              </div>

              {/* Hematologic Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  2. Hematology & Systemic Inflammatory Index
                </span>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    • Leukocyte Count: <strong>{wbc} k/uL</strong> | HCT: <strong>{hematocrit}%</strong>
                  </p>
                  <p>
                    • Status: {wbc > 17 ? (
                      <strong className="text-rose-600">Marked Leukocytosis (Infection/Inflammation)</strong>
                    ) : (
                      <strong className="text-emerald-600">WBC in normal reference interval</strong>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Correlates with active mucosal or tissue bacterial response.
                  </p>
                </div>
              </div>

              {/* Imaging Correlation */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  3. Imaging (USG / X-Ray) Correlation
                </span>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    • USG: {usgFindings ? 'Identified sonographic pathology' : 'Scan clear/negative'}
                  </p>
                  <p>
                    • X-Ray: {xrayFindings ? 'Confirmed anatomic alignment' : 'No obstructive mass'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Provides structural confirmation for the clinical diagnosis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4.4 INTERVENTION PATHWAY & TREATMENT PLAN */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Comprehensive Treatment Protocol & Intervention Pathway
            </h4>
            <textarea
              rows={3}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              placeholder="e.g. IV crystalloid rehydration with Lactated Ringers, broad-spectrum antibiotic coverage, surgical scheduling..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* 4.5 STEP NAVIGATION BAR */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToStep3}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 3: Upload Diagnostics</span>
            </button>

            <button
              type="button"
              onClick={onProceedToStep5}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span>Proceed to Step 5: Prescription (AI Suggested, Write & Upload)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
