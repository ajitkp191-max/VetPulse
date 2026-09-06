import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LaboratoryReport } from '../../types';
import { VET_LAB_REFERENCES, getReferenceFlag } from '../../data/labReferences';
import { analyzeBiochemicalReportWithAI } from '../../services/geminiService';
import {
  FlaskConical,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileText,
  Upload,
  TrendingDown,
  TrendingUp,
  X,
  Sparkles,
  Loader2,
  Activity,
  ShieldAlert,
  HelpCircle,
  Copy,
  Layers,
  FileCheck,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  Filter,
  Check,
  Info,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

interface AnalyteItem {
  name: string;
  key: string;
  value: number | string;
  unit: string;
  isExtracted?: boolean;
  referenceRange?: string;
}

export const LaboratoryModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    labReports,
    addLabReport,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedReportId, setSelectedReportId] = useState<string | null>(labReports[0]?.id || null);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'biochemical' | 'cbc' | 'urinalysis'>('all');

  // New Lab Report Form State
  const [testType, setTestType] = useState('Comprehensive Chemistry & CBC Panel');
  const [sampleType, setSampleType] = useState('Whole Blood (EDTA) & Serum');
  const [clinicalNotes, setClinicalNotes] = useState('Patient presented for diagnostic biochemical triage and health screening.');
  const [interpretation, setInterpretation] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // AI & OCR State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDiagnosticResult, setAiDiagnosticResult] = useState<any>(null);
  const [ocrStatus, setOcrStatus] = useState<{
    scanned: boolean;
    extractedCount: number;
    unspecifiedCount: number;
  } | null>(null);

  // Analyte filter inside modal
  const [analyteFilter, setAnalyteFilter] = useState<'all' | 'filled' | 'unspecified'>('all');

  // Custom Analyte Modal / Inline Form State
  const [isAddingCustomAnalyte, setIsAddingCustomAnalyte] = useState(false);
  const [customAnalyteName, setCustomAnalyteName] = useState('');
  const [customAnalyteKey, setCustomAnalyteKey] = useState('');
  const [customAnalyteUnit, setCustomAnalyteUnit] = useState('mg/dL');
  const [customAnalyteValue, setCustomAnalyteValue] = useState('');

  // Preset analyte lists
  const PRESET_PANELS: Record<string, Array<{ name: string; key: string; value: number | string; unit: string }>> = {
    'Comprehensive Chemistry & CBC Panel': [
      { name: 'Red Blood Cells (RBC)', key: 'RBC', value: 6.8, unit: 'M/μL' },
      { name: 'Hemoglobin (Hb)', key: 'Hb', value: 14.5, unit: 'g/dL' },
      { name: 'Hematocrit (PCV)', key: 'PCV', value: 42.0, unit: '%' },
      { name: 'White Blood Cells (WBC)', key: 'WBC', value: 18.2, unit: 'K/μL' },
      { name: 'Platelets', key: 'Platelets', value: 320, unit: 'K/μL' },
      { name: 'Blood Urea Nitrogen (BUN)', key: 'BUN', value: 34, unit: 'mg/dL' },
      { name: 'Creatinine', key: 'Creatinine', value: 2.1, unit: 'mg/dL' },
      { name: 'Alanine Aminotransferase (ALT)', key: 'ALT', value: 115, unit: 'U/L' },
      { name: 'Alkaline Phosphatase (ALP)', key: 'ALP', value: 140, unit: 'U/L' },
      { name: 'Total Bilirubin', key: 'Total Bilirubin', value: 0.4, unit: 'mg/dL' },
      { name: 'Blood Glucose', key: 'Glucose', value: 110, unit: 'mg/dL' },
      { name: 'Total Protein', key: 'Total Protein', value: 6.9, unit: 'g/dL' },
      { name: 'Albumin', key: 'Albumin', value: 3.2, unit: 'g/dL' },
      { name: 'Globulin', key: 'Globulin', value: 3.7, unit: 'g/dL' },
      { name: 'Phosphorus', key: 'Phosphorus', value: 4.8, unit: 'mg/dL' },
      { name: 'Calcium', key: 'Calcium', value: 9.8, unit: 'mg/dL' },
    ],
    'Renal Function Profile (KFT / Kidney)': [
      { name: 'Blood Urea Nitrogen (BUN)', key: 'BUN', value: 48, unit: 'mg/dL' },
      { name: 'Creatinine', key: 'Creatinine', value: 2.8, unit: 'mg/dL' },
      { name: 'Phosphorus', key: 'Phosphorus', value: 6.2, unit: 'mg/dL' },
      { name: 'Calcium', key: 'Calcium', value: 10.1, unit: 'mg/dL' },
      { name: 'Albumin', key: 'Albumin', value: 2.9, unit: 'g/dL' },
      { name: 'Sodium', key: 'Sodium', value: 144, unit: 'mEq/L' },
      { name: 'Potassium', key: 'Potassium', value: 4.6, unit: 'mEq/L' },
      { name: 'SDMA Renal Biomarker', key: 'SDMA', value: 18, unit: 'μg/dL' },
    ],
    'Hepatic & Biliary Panel (LFT / Liver)': [
      { name: 'Alanine Aminotransferase (ALT)', key: 'ALT', value: 195, unit: 'U/L' },
      { name: 'Aspartate Aminotransferase (AST)', key: 'AST', value: 78, unit: 'U/L' },
      { name: 'Alkaline Phosphatase (ALP)', key: 'ALP', value: 260, unit: 'U/L' },
      { name: 'Gamma-Glutamyl Transferase (GGT)', key: 'GGT', value: 12, unit: 'U/L' },
      { name: 'Total Bilirubin', key: 'Total Bilirubin', value: 1.2, unit: 'mg/dL' },
      { name: 'Albumin', key: 'Albumin', value: 2.8, unit: 'g/dL' },
      { name: 'Total Protein', key: 'Total Protein', value: 6.5, unit: 'g/dL' },
      { name: 'Blood Glucose', key: 'Glucose', value: 95, unit: 'mg/dL' },
    ],
    'Urinalysis & Urine Specific Gravity (USG)': [
      { name: 'Urine Specific Gravity (USG)', key: 'USG', value: 1.022, unit: 'index' },
      { name: 'Urine pH', key: 'pH', value: 6.5, unit: 'pH' },
      { name: 'Urine Protein', key: 'Protein', value: 30, unit: 'mg/dL' },
      { name: 'Urine Glucose', key: 'Glucose', value: 0, unit: 'mg/dL' },
      { name: 'Urine Ketones', key: 'Ketones', value: 0, unit: 'mg/dL' },
      { name: 'Urine Bilirubin', key: 'Bilirubin', value: 0, unit: 'mg/dL' },
      { name: 'Urine Blood / Hemoglobin', key: 'Blood', value: 0, unit: 'Ery/μL' },
    ],
    'Electrolytes & Acid-Base Balance': [
      { name: 'Sodium (Na+)', key: 'Sodium', value: 142, unit: 'mEq/L' },
      { name: 'Potassium (K+)', key: 'Potassium', value: 4.4, unit: 'mEq/L' },
      { name: 'Chloride (Cl-)', key: 'Chloride', value: 110, unit: 'mEq/L' },
      { name: 'Bicarbonate (HCO3-)', key: 'Bicarbonate', value: 21, unit: 'mEq/L' },
      { name: 'Total Calcium', key: 'Calcium', value: 9.6, unit: 'mg/dL' },
      { name: 'Inorganic Phosphorus', key: 'Phosphorus', value: 4.2, unit: 'mg/dL' },
    ]
  };

  const [paramsList, setParamsList] = useState<AnalyteItem[]>(
    PRESET_PANELS['Comprehensive Chemistry & CBC Panel']
  );

  const activeReport = labReports.find((r) => r.id === selectedReportId) || labReports[0];

  const handlePanelPresetChange = (presetName: string) => {
    setTestType(presetName);
    if (PRESET_PANELS[presetName]) {
      setParamsList(PRESET_PANELS[presetName]);
      setOcrStatus(null);
    }
  };

  // Helper to run OCR analysis and autofill extracted values
  const processImageAnalysisAndAutofill = async (base64Raw: string) => {
    setIsAiLoading(true);
    try {
      const species = selectedPet.species;
      const refTable = VET_LAB_REFERENCES[species] || VET_LAB_REFERENCES['Canine (Dog)'];

      const formattedParams = paramsList.map((p) => {
        const ref = refTable[p.key] || { low: 0, high: 100, unit: p.unit };
        const flag = getReferenceFlag(species, p.key, p.value);
        return {
          name: p.name,
          key: p.key,
          value: typeof p.value === 'number' ? p.value : parseFloat(String(p.value)) || 0,
          unit: p.unit,
          referenceRange: `${ref.low} - ${ref.high} ${ref.unit}`,
          flag,
        };
      });

      const response = await analyzeBiochemicalReportWithAI({
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        weight: selectedPet.weight,
        panelType: testType,
        parameters: formattedParams,
        clinicalNotes,
        imageBase64: base64Raw,
        mimeType: 'image/jpeg',
      });

      setAiDiagnosticResult(response);
      if (response.pathophysiologySummary) {
        setInterpretation(response.pathophysiologySummary);
      }

      // AUTOFILL LOGIC FOR ANALYTES & BIOMARKERS
      const extractedList: Array<any> = Array.isArray(response.extractedParameters)
        ? response.extractedParameters
        : [];

      if (extractedList.length > 0) {
        // Map existing preset parameters: if found in extractedList, autofill it; if not found, leave blank/unspecified
        const matchedKeys = new Set<string>();
        let filledCount = 0;
        let unspecifiedCount = 0;

        const updatedList: AnalyteItem[] = paramsList.map((currentParam) => {
          const normKey = currentParam.key.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normName = currentParam.name.toLowerCase().replace(/[^a-z0-9]/g, '');

          const match = extractedList.find((ext: any) => {
            const extKey = (ext.key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const extName = (ext.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return (
              extKey === normKey ||
              extName === normName ||
              (normKey && extKey.includes(normKey)) ||
              (normKey && extName.includes(normKey))
            );
          });

          if (match && match.value !== null && match.value !== undefined && match.value !== '') {
            matchedKeys.add((match.key || match.name).toLowerCase());
            filledCount++;
            return {
              ...currentParam,
              value: typeof match.value === 'number' ? match.value : parseFloat(String(match.value)) || match.value,
              unit: match.unit || currentParam.unit,
              isExtracted: true,
            };
          } else {
            // Unspecified / not present on report image -> leave blank!
            unspecifiedCount++;
            return {
              ...currentParam,
              value: '', // Blank for admin to review or fill
              isExtracted: false,
            };
          }
        });

        // Add any novel analytes found in the report image that weren't in preset
        extractedList.forEach((ext: any) => {
          const extKeyStr = (ext.key || ext.name || '').toLowerCase();
          const alreadyMatched = updatedList.some(
            (p) =>
              p.key.toLowerCase().replace(/[^a-z0-9]/g, '') === extKeyStr.replace(/[^a-z0-9]/g, '') ||
              p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === extKeyStr.replace(/[^a-z0-9]/g, '')
          );

          if (!alreadyMatched && ext.value !== null && ext.value !== undefined && ext.value !== '') {
            updatedList.push({
              name: ext.name || ext.key,
              key: ext.key || ext.name,
              value: typeof ext.value === 'number' ? ext.value : parseFloat(String(ext.value)) || ext.value,
              unit: ext.unit || 'units',
              isExtracted: true,
            });
            filledCount++;
          }
        });

        setParamsList(updatedList);
        setOcrStatus({
          scanned: true,
          extractedCount: filledCount,
          unspecifiedCount: unspecifiedCount,
        });

        showNotification(
          `✨ Image Analyzed: ${filledCount} analytes autofilled. ${unspecifiedCount} left blank for manual review.`,
          'success'
        );
      } else {
        showNotification('AI Clinical Pathology diagnostic completed!', 'success');
      }
    } catch (err) {
      console.error(err);
      showNotification('Pathology analysis encountered an issue; fallback diagnostics loaded.', 'warning');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImagePreview(base64);
        const cleanBase64 = base64.split(',')[1];
        setUploadedImageBase64(cleanBase64);
        showNotification('Biochemical image uploaded. Starting Vision OCR & Analyte extraction...', 'info');
        // Automatically analyze and autofill
        processImageAnalysisAndAutofill(cleanBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiAnalysis = async () => {
    await processImageAnalysisAndAutofill(uploadedImageBase64 || '');
  };

  const handleAddCustomAnalyte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnalyteName.trim()) return;

    const key = customAnalyteKey.trim() || customAnalyteName.trim();
    const val = customAnalyteValue.trim() === '' ? '' : parseFloat(customAnalyteValue) || customAnalyteValue;

    setParamsList((prev) => [
      ...prev,
      {
        name: customAnalyteName.trim(),
        key: key,
        value: val,
        unit: customAnalyteUnit.trim() || 'units',
        isExtracted: false,
      },
    ]);

    setCustomAnalyteName('');
    setCustomAnalyteKey('');
    setCustomAnalyteValue('');
    setIsAddingCustomAnalyte(false);
    showNotification(`Added biomarker "${customAnalyteName}" to active panel.`, 'success');
  };

  const handleRemoveAnalyte = (indexToRemove: number) => {
    setParamsList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllValues = () => {
    setParamsList((prev) => prev.map((p) => ({ ...p, value: '', isExtracted: false })));
    setOcrStatus(null);
    showNotification('All analyte fields cleared to blank for manual input.', 'info');
  };

  const handleResetToPresetDefaults = () => {
    if (PRESET_PANELS[testType]) {
      setParamsList(PRESET_PANELS[testType]);
      setOcrStatus(null);
      showNotification(`Reset panel to "${testType}" default reference values.`, 'info');
    }
  };

  const handleCreateLabReport = (e: React.FormEvent) => {
    e.preventDefault();
    const species = selectedPet.species;
    const refTable = VET_LAB_REFERENCES[species] || VET_LAB_REFERENCES['Canine (Dog)'];

    const formattedParams = paramsList.map((p) => {
      const ref = refTable[p.key] || { low: 0, high: 100, unit: p.unit };
      const isValEmpty = p.value === '' || p.value === null || p.value === undefined;
      const flag = isValEmpty ? 'UNSPECIFIED' : getReferenceFlag(species, p.key, p.value);
      return {
        name: p.name,
        value: isValEmpty ? 'Unspecified' : String(p.value),
        unit: p.unit,
        referenceRange: `${ref.low} - ${ref.high} ${ref.unit}`,
        flag: flag as any,
      };
    });

    const newReport = addLabReport({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      ownerName: selectedPet.ownerName,
      date: new Date().toISOString().split('T')[0],
      testType: testType as any,
      parameters: formattedParams,
      interpretation: interpretation || 'Parameters evaluated against species-specific reference ranges.',
      veterinarianNotes: aiDiagnosticResult
        ? `AI Clinical Pathology: ${aiDiagnosticResult.triageLevel || 'Evaluated'}. Organ stress: ${JSON.stringify(aiDiagnosticResult.organSystemScores || {})}`
        : 'Diagnostic evaluation documented by clinical laboratory.',
      attachmentUrl: uploadedImagePreview || undefined,
      attachmentName: uploadedImagePreview ? 'Biochemical_Report_Scan.jpg' : undefined,
    });

    setSelectedReportId(newReport.id);
    setIsNewTestModalOpen(false);
    showNotification('Biochemical Lab Report saved to patient history!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredReports = labReports.filter((r) => {
    const t = (r.testType || '').toLowerCase();
    if (activeTab === 'biochemical') return t.includes('chem') || t.includes('biochem') || t.includes('kidney') || t.includes('liver');
    if (activeTab === 'cbc') return t.includes('cbc') || t.includes('blood') || t.includes('hemogram');
    if (activeTab === 'urinalysis') return t.includes('urine') || t.includes('usg');
    return true;
  });

  // Filter analytes in modal based on filled/unspecified
  const displayedParams = paramsList.filter((p) => {
    const isFilled = p.value !== '' && p.value !== null && p.value !== undefined;
    if (analyteFilter === 'filled') return isFilled;
    if (analyteFilter === 'unspecified') return !isFilled;
    return true;
  });

  const filledCount = paramsList.filter((p) => p.value !== '' && p.value !== null && p.value !== undefined).length;
  const unspecifiedCount = paramsList.length - filledCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Veterinary Clinical Laboratory & Biochemical Diagnostic Suite
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                AI Pathologist Vision & Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated image OCR, multi-analyte panels (CBC, LFT, KFT, Electrolytes, USG, Endocrinology) and species reference diagnostics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewTestModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload & Run AI Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Panels ({labReports.length})
        </button>
        <button
          onClick={() => setActiveTab('biochemical')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'biochemical'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Biochemistry & Organ Panels
        </button>
        <button
          onClick={() => setActiveTab('cbc')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cbc'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Hematology (CBC)
        </button>
        <button
          onClick={() => setActiveTab('urinalysis')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'urinalysis'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Urinalysis & USG
        </button>
      </div>

      {/* Lab Reports Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Lab Reports */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[800px] overflow-y-auto pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Diagnostic Records ({filteredReports.length})
          </h4>
          {filteredReports.map((report) => {
            const isSelected = report.id === activeReport?.id;
            const hasCritical = report.parameters?.some((p) => p.flag === 'CRITICAL');
            const hasHighOrLow = report.parameters?.some((p) => p.flag === 'HIGH' || p.flag === 'LOW');

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs ring-1 ring-teal-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {report.petName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{report.date}</span>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate">
                  {report.testType}
                </p>
                <div className="flex items-center justify-between mt-2.5 text-[10px]">
                  <SpeciesBadge species={report.species} />
                  {hasCritical ? (
                    <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Critical Alert
                    </span>
                  ) : hasHighOrLow ? (
                    <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" /> Shift Detected
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Within Norms
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Lab Report Print & Analysis View */}
        {activeReport ? (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Header with Print */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Official Clinical Pathology Examination Report
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeReport.testType}
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {activeReport.petName} ({activeReport.species}) • Date: {activeReport.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
              </div>
            </div>

            {/* Patient Meta Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Patient:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.petName}</div>
              </div>
              <div>
                <span className="text-slate-400">Species:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.species}</div>
              </div>
              <div>
                <span className="text-slate-400">Owner:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.ownerName || 'Registered Client'}</div>
              </div>
              <div>
                <span className="text-slate-400">Pathology Review:</span>
                <div className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">Verified / AI Synced</div>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="py-2.5 px-3">Analyte / Biomarker</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Reference Interval ({activeReport.species})</th>
                    <th className="py-2.5 px-3 text-center">Diagnostic Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeReport.parameters.map((param, index) => {
                    const isUnspecified =
                      param.flag === 'UNSPECIFIED' ||
                      param.value === 'Unspecified' ||
                      param.value === '' ||
                      param.value === undefined;
                    const isHigh = param.flag === 'HIGH';
                    const isLow = param.flag === 'LOW';
                    const isCritical = param.flag === 'CRITICAL';
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                          isCritical
                            ? 'bg-rose-50/60 dark:bg-rose-950/20'
                            : isHigh || isLow
                            ? 'bg-amber-50/40 dark:bg-amber-950/10'
                            : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {param.name}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {isUnspecified ? (
                            <span className="text-slate-400 font-normal italic">— (Not Provided)</span>
                          ) : (
                            <span>
                              {param.value} {param.unit}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {param.referenceRange}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isUnspecified ? (
                            <span className="inline-flex items-center gap-1 font-medium text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              — Unspecified
                            </span>
                          ) : isHigh ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <TrendingUp className="w-3 h-3" /> HIGH
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              <TrendingDown className="w-3 h-3" /> LOW
                            </span>
                          ) : isCritical ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              <AlertTriangle className="w-3 h-3" /> CRITICAL
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pathologist Clinical Interpretation */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
              <h5 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Pathologist Diagnostic Interpretation & AI Review</span>
              </h5>
              <p className="text-teal-950 dark:text-teal-100 leading-relaxed">
                {activeReport.interpretation}
              </p>
              {activeReport.veterinarianNotes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-teal-200/50 dark:border-teal-800/50 pt-2 font-mono">
                  {activeReport.veterinarianNotes}
                </p>
              )}
            </div>

            {/* Attachment preview if any */}
            {activeReport.attachmentUrl && activeReport.attachmentUrl.trim() !== '' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-teal-600" />
                  <span>Uploaded Laboratory Document / Slip</span>
                </h5>
                <img
                  src={activeReport.attachmentUrl}
                  alt="Lab report scan"
                  className="max-h-64 rounded-xl border object-contain bg-white dark:bg-slate-950 p-1"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No lab reports available. Click "Upload & Run AI Diagnostic" to create one.
          </div>
        )}
      </div>

      {/* NEW LAB TEST & AI OCR DIAGNOSTIC MODAL */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-700 rounded-xl">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    AI Diagnostic Laboratory & Biochemical Examination Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload physical lab reports for Vision OCR autofill, or manually enter/edit values. Unspecified parameters remain blank.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTestModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLabReport} className="space-y-5 pt-4 text-xs">
              {/* Patient and Preset Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient
                  </label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species} - {p.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Select Diagnostic Panel Preset
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => handlePanelPresetChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-teal-700 dark:text-teal-300"
                  >
                    {Object.keys(PRESET_PANELS).map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Specimen / Sample Type
                  </label>
                  <input
                    type="text"
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload Physical Biochemical Report Scan/Slip with Automated Vision OCR */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/90 dark:border-teal-800/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Biochemical Image Upload & Vision OCR Auto-Analysis</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Upload lab slip (Idexx, VetScan, Mindray, blood slip). AI extracts & autofills all detected analytes, leaving missing parameters blank for admin input.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload & Auto-Analyze</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Image Preview & Scanning Bar */}
                {uploadedImagePreview && uploadedImagePreview.trim() !== '' && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded report preview"
                        className="w-16 h-16 object-cover rounded-xl border shrink-0 bg-slate-100 dark:bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                          Biochemical Report Document Attached
                        </span>
                        {isAiLoading ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-teal-600 font-semibold mt-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Scanning image with Gemini Vision OCR & extracting analytes...</span>
                          </div>
                        ) : ocrStatus ? (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              Vision Scan Complete: {ocrStatus.extractedCount} values autofilled, {ocrStatus.unspecifiedCount} left unspecified/blank
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Info className="w-3 h-3 text-teal-600" /> Ready for AI Analysis & Autofill
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleRunAiAnalysis}
                          disabled={isAiLoading}
                          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-lg font-bold text-[10px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Re-scan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedImageBase64(null);
                            setUploadedImagePreview(null);
                            setOcrStatus(null);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-lg"
                          title="Remove attached image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Analytes & Biomarkers Section */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>Analytes & Biomarkers</span>
                      <span className="text-slate-400 font-normal">({selectedPet.species} Reference Limits)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Values extracted from image are filled. Blank fields remain unspecified unless you type a value.
                    </p>
                  </div>

                  {/* Filter & Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* View Filters */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setAnalyteFilter('all')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          analyteFilter === 'all'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        All ({paramsList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnalyteFilter('filled')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          analyteFilter === 'filled'
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Filled ({filledCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnalyteFilter('unspecified')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          analyteFilter === 'unspecified'
                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Blank / Unspecified ({unspecifiedCount})
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingCustomAnalyte(!isAddingCustomAnalyte)}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-lg font-bold text-[10px] flex items-center gap-1 border border-teal-200 dark:border-teal-800"
                    >
                      <Plus className="w-3 h-3" /> Add Custom
                    </button>

                    <button
                      type="button"
                      onClick={handleClearAllValues}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-semibold"
                      title="Set all analyte values to blank"
                    >
                      Clear to Blank
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToPresetDefaults}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-semibold"
                      title="Reset to standard template averages"
                    >
                      Defaults
                    </button>
                  </div>
                </div>

                {/* Inline Add Custom Analyte Form */}
                {isAddingCustomAnalyte && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-teal-900 dark:text-teal-200">
                        Add Custom Analyte / Biomarker
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomAnalyte(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Analyte Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Cortisol, SDMA, Troponin I"
                          value={customAnalyteName}
                          onChange={(e) => setCustomAnalyteName(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Key / Code</label>
                        <input
                          type="text"
                          placeholder="e.g. SDMA"
                          value={customAnalyteKey}
                          onChange={(e) => setCustomAnalyteKey(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Unit</label>
                        <input
                          type="text"
                          placeholder="e.g. mg/dL, U/L, ng/mL"
                          value={customAnalyteUnit}
                          onChange={(e) => setCustomAnalyteUnit(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Value (Optional)</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Leave blank or enter value"
                            value={customAnalyteValue}
                            onChange={(e) => setCustomAnalyteValue(e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomAnalyte}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analyte Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1.5 border rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                  {displayedParams.map((p) => {
                    const actualIdx = paramsList.findIndex((item) => item.key === p.key && item.name === p.name);
                    const isBlank = p.value === '' || p.value === null || p.value === undefined;
                    const flag = isBlank ? 'UNSPECIFIED' : getReferenceFlag(selectedPet.species, p.key, p.value);
                    const refTable = VET_LAB_REFERENCES[selectedPet.species] || VET_LAB_REFERENCES['Canine (Dog)'];
                    const refObj = refTable[p.key];

                    return (
                      <div
                        key={actualIdx >= 0 ? actualIdx : p.key}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          p.isExtracted
                            ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800'
                            : isBlank
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate" title={p.name}>
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {p.isExtracted && (
                              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300" title="Autofilled from Image OCR">
                                ✨ OCR
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveAnalyte(actualIdx)}
                              className="text-slate-300 hover:text-rose-500 p-0.5"
                              title="Remove analyte from panel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Reference Range Indicator */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                          <span>
                            Ref: {refObj ? `${refObj.low} - ${refObj.high} ${refObj.unit}` : `Normal: ${p.unit}`}
                          </span>
                          {flag === 'HIGH' && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                              HIGH
                            </span>
                          )}
                          {flag === 'LOW' && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">
                              LOW
                            </span>
                          )}
                          {flag === 'CRITICAL' && (
                            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                              CRITICAL
                            </span>
                          )}
                          {flag === 'NORMAL' && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                              NORMAL
                            </span>
                          )}
                          {flag === 'UNSPECIFIED' && (
                            <span className="text-[9px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-dashed border-slate-300 dark:border-slate-700">
                              Unspecified
                            </span>
                          )}
                        </div>

                        {/* Interactive Input with Clear Button */}
                        <div className="flex items-center gap-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="— Unspecified —"
                              value={p.value}
                              onChange={(e) => {
                                const rawVal = e.target.value;
                                setParamsList((prev) =>
                                  prev.map((item, i) =>
                                    i === actualIdx ? { ...item, value: rawVal, isExtracted: false } : item
                                  )
                                );
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                                isBlank
                                  ? 'bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700 italic placeholder:text-slate-300 dark:placeholder:text-slate-600'
                                  : 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700 shadow-xs'
                              }`}
                            />
                            {!isBlank && (
                              <button
                                type="button"
                                onClick={() => {
                                  setParamsList((prev) =>
                                    prev.map((item, i) =>
                                      i === actualIdx ? { ...item, value: '', isExtracted: false } : item
                                    )
                                  );
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                                title="Clear value"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold shrink-0">{p.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Presenting Clinical Signs */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Context & Presenting Signs
                </label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Lethargy, polydipsia, anorexia for 3 days, acute vomiting"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* AI Diagnostic Trigger Button */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-900 to-emerald-900 rounded-2xl text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                  <div>
                    <span className="font-bold text-xs block">AI Clinical Pathology & Ratio Diagnostic Engine</span>
                    <span className="text-[10px] text-teal-200">
                      Calculates BUN:Creatinine, A:G ratio, Na:K ratio, organ risk scores, and differentials from active values
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={handleRunAiAnalysis}
                  className="bg-white text-teal-900 hover:bg-teal-50 font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                      <span>Synthesizing Pathology...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-700" />
                      <span>Run AI Diagnostic</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Diagnostic Results Panel (if generated) */}
              {aiDiagnosticResult && (
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-200 dark:border-teal-800">
                    <span className="font-bold text-xs text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>AI Clinical Pathology Assessment ({aiDiagnosticResult.triageLevel || 'Evaluated'})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Engine: {aiDiagnosticResult.source}</span>
                  </div>

                  {/* Organ System Function Risk Map */}
                  {aiDiagnosticResult.organSystemScores && (
                    <div>
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-teal-950 dark:text-teal-200 mb-2">
                        Organ System Functional Analysis
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        {Object.entries(aiDiagnosticResult.organSystemScores).map(([sys, score]: [string, any]) => (
                          <div key={sys} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">{sys}</span>
                            <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-200 truncate block mt-0.5">
                              {String(score)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculated Clinical Ratios */}
                  {aiDiagnosticResult.calculatedRatios && aiDiagnosticResult.calculatedRatios.length > 0 && (
                    <div>
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-teal-950 dark:text-teal-200 mb-2">
                        Computed Diagnostic Ratios & Indices
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {aiDiagnosticResult.calculatedRatios.map((ratio: any, rIdx: number) => (
                          <div key={rIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-[11px]">
                            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                              <span>{ratio.name}</span>
                              <span className="text-teal-600 dark:text-teal-400 font-mono">{ratio.value}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">{ratio.interpretation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Differential Diagnoses */}
                  {aiDiagnosticResult.differentialDiagnoses && aiDiagnosticResult.differentialDiagnoses.length > 0 && (
                    <div>
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-teal-950 dark:text-teal-200 mb-2">
                        Differential Diagnoses (Ranked by Likelihood)
                      </h5>
                      <div className="space-y-1.5">
                        {aiDiagnosticResult.differentialDiagnoses.map((diff: any, dIdx: number) => (
                          <div key={dIdx} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800 flex items-start gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                              {diff.likelihood || 'Likely'}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {diff.condition}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-0.5">{diff.reasoning}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Recommendations */}
                  {aiDiagnosticResult.clinicalRecommendations && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800">
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-teal-900 dark:text-teal-200 mb-1.5">
                        Evidence-Based Clinical & Therapeutic Action Plan
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {aiDiagnosticResult.clinicalRecommendations.map((rec: string, recIdx: number) => (
                          <li key={recIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Pathologist Final Interpretation */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Pathologist & Diagnostic Summary
                </label>
                <textarea
                  rows={3}
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Summary of laboratory findings, organ stress markers, and diagnostic recommendations..."
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Save Lab Results to Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

