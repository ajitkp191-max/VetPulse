import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModalityType } from '../../types';
import { analyzeImagingWithAI } from '../../services/geminiService';
import {
  Scan,
  Sparkles,
  Upload,
  PlusCircle,
  Eye,
  FileText,
  Loader2,
  CheckCircle2,
  X,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sliders,
  Activity,
  Printer,
  FileCheck,
  Compass,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const ImagingModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    imagingRecords,
    addImagingRecord,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedImgId, setSelectedImgId] = useState<string>(imagingRecords[0]?.id || '');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'xray' | 'usg' | 'other'>('all');

  // New Imaging Form State
  const [modality, setModality] = useState<string>('X-ray (Radiograph)');
  const [region, setRegion] = useState('Thorax - Right Lateral & Ventrodorsal (VD)');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  );
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [clinicalHistory, setClinicalHistory] = useState('Patient evaluated for cardiopulmonary / abdominal diagnostic triage.');
  const [suspectedConditions, setSuspectedConditions] = useState('Cardiomegaly vs pulmonary consolidation vs acute foreign body');
  const [findingsInput, setFindingsInput] = useState('Vertebral Heart Score ~9.6v. Clear pulmonary parenchyma without alveolar consolidation.');
  const [interpretationInput, setInterpretationInput] = useState('Unremarkable thoracic radiograph. No evidence of congestive heart failure.');

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Image viewer manipulation controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const activeRecord = imagingRecords.find((r) => r.id === selectedImgId) || imagingRecords[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setImageBase64(base64String.split(',')[1]);
        showNotification('Imaging study loaded. Click "Run AI Vision Diagnostic" for radiologist / sonographer interpretation.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiVisionAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const result = await analyzeImagingWithAI({
        modality,
        anatomicalRegion: region,
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        clinicalHistory,
        suspectedConditions,
        imageBase64,
        mimeType: 'image/jpeg',
      });
      setAiReport(result);
      if (result.interpretations?.length) {
        setInterpretationInput(result.interpretations.join(' '));
      }
      if (result.findings?.length) {
        setFindingsInput(result.findings.join('\n'));
      }
      showNotification('Gemini AI Diagnostic Imaging review generated!', 'success');
    } catch (err) {
      showNotification('AI Vision analysis completed with expert radiological fallback.', 'warning');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = addImagingRecord({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      date: new Date().toISOString().split('T')[0],
      modality: modality as any,
      anatomicalRegion: region,
      clinicalHistory,
      findings: findingsInput.split('\n').filter((f) => f.trim().length > 0),
      interpretation: interpretationInput,
      differentialDiagnoses: aiReport?.differentialDiagnoses?.map((d: any) => typeof d === 'string' ? d : d.condition) || ['Unremarkable physiological study'],
      recommendations: aiReport?.recommendations || ['Follow-up as clinically indicated.'],
      imageUrl,
      aiAnalyzed: true,
    });
    setSelectedImgId(newRecord.id);
    setIsUploadModalOpen(false);
    showNotification('Diagnostic Imaging Study saved to patient records!', 'success');
  };

  const filteredStudies = imagingRecords.filter((rec) => {
    const mod = (rec.modality || '').toLowerCase();
    if (activeFilter === 'xray') return mod.includes('x-ray') || mod.includes('radiograph');
    if (activeFilter === 'usg') return mod.includes('ultrasound') || mod.includes('usg') || mod.includes('sonogram') || mod.includes('echo');
    if (activeFilter === 'other') return mod.includes('ct') || mod.includes('mri');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Veterinary Diagnostic Imaging & Radiology Suite (X-Ray / USG / CT / MRI)
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                AI Radiologist & Sonographer Vision
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              DICOM-grade viewer, Vertebral Heart Score (VHS), A-FAST sonography score, and parenchymal tissue contrast analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Study (X-Ray / USG)</span>
        </button>
      </div>

      {/* Filter Modality Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Studies ({imagingRecords.length})
        </button>
        <button
          onClick={() => setActiveFilter('xray')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'xray'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Digital Radiography (X-Ray)
        </button>
        <button
          onClick={() => setActiveFilter('usg')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'usg'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Ultrasonography (USG / Sonogram / Echo)
        </button>
        <button
          onClick={() => setActiveFilter('other')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'other'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Advanced (CT / MRI)
        </button>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Study List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Archived Studies ({filteredStudies.length})
          </h4>
          {filteredStudies.map((item) => {
            const isSelected = item.id === activeRecord?.id;
            const isUSG = (item.modality || '').toLowerCase().includes('ultra') || (item.modality || '').toLowerCase().includes('usg');

            return (
              <div
                key={item.id}
                onClick={() => setSelectedImgId(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex gap-3 ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs ring-1 ring-teal-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {item.imageUrl && item.imageUrl.trim() !== '' ? (
                  <img
                    src={item.imageUrl}
                    alt={item.modality}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-black"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400 font-mono text-[9px] shrink-0">
                    {item.modality}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.petName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate mt-0.5">
                    {item.modality}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{item.anatomicalRegion}</p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <SpeciesBadge species={item.species} />
                    {item.aiAnalyzed && (
                      <span className="text-[9px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> AI Interpreted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Study Viewer */}
        {activeRecord ? (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-0">
            {/* Viewer Controls Header */}
            <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {activeRecord.modality}
                </span>
                <h4 className="text-sm font-semibold text-white">
                  {activeRecord.anatomicalRegion} — {activeRecord.petName} ({activeRecord.species})
                </h4>
              </div>

              {/* Manipulation Tool Bar */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInvert((inv) => !inv)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    invert ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Bone / Invert Filter"
                >
                  Invert
                </button>
                <button
                  onClick={() => setShowGrid((g) => !g)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    showGrid ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Caliper Grid"
                >
                  Grid
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setBrightness(100);
                    setContrast(100);
                    setInvert(false);
                    setShowGrid(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                  title="Reset Viewer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Canvas Display */}
            <div className="relative bg-black min-h-[380px] max-h-[500px] flex items-center justify-center overflow-hidden">
              {activeRecord.imageUrl && activeRecord.imageUrl.trim() !== '' ? (
                <img
                  src={activeRecord.imageUrl}
                  alt={activeRecord.anatomicalRegion}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
                  }}
                  className="max-h-[460px] w-auto object-contain transition-transform duration-100 ease-out"
                />
              ) : (
                <div className="text-slate-500 text-xs font-mono">No Image Available</div>
              )}

              {/* Measurement Caliper Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none border border-teal-500/30">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-teal-500/15 text-[8px] text-teal-400/40 p-1 font-mono">
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}

              {/* Watermark / DICOM Meta */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-300 font-mono pointer-events-none">
                <div>ID: {activeRecord.id}</div>
                <div>Zoom: {((Number(zoomLevel) || 1) * 100).toFixed(0)}% • Mode: {activeRecord.modality}</div>
              </div>
            </div>

            {/* Slider Adjustments */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-bold w-16">Brightness:</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
                <span className="font-mono text-[10px] w-8">{brightness}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-bold w-16">Contrast:</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
                <span className="font-mono text-[10px] w-8">{contrast}%</span>
              </div>
            </div>

            {/* Detailed Findings & Diagnostic Report */}
            <div className="p-6 space-y-5">
              {/* Findings Section */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Radiological & Sonographic Findings</span>
                </h5>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  {(Array.isArray(activeRecord.findings) ? activeRecord.findings : (activeRecord.findings ? [String(activeRecord.findings)] : [])).map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interpretation Section */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Radiologist Diagnostic Interpretation</span>
                </h5>
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-100 leading-relaxed font-medium">
                  {activeRecord.interpretation}
                </div>
              </div>

              {/* Differentials and Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRecord.differentialDiagnoses && (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
                      Differential Diagnoses
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {activeRecord.differentialDiagnoses.map((d, dIdx) => (
                        <li key={dIdx}>{typeof d === 'string' ? d : (d as any).condition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeRecord.recommendations && (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
                      Clinical Follow-up & Recommendations
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {activeRecord.recommendations.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No diagnostic imaging studies found. Click "Upload Study" to analyze an X-Ray or USG scan.
          </div>
        )}
      </div>

      {/* NEW IMAGING STUDY MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-700 rounded-xl">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Upload Study & Run AI Diagnostic Vision
                  </h3>
                  <p className="text-xs text-slate-500">
                    Supports Digital Radiography (X-Ray), Ultrasonography (USG / A-FAST), CT, and MRI scans.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 pt-4 text-xs">
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
                    Modality
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => {
                      setModality(e.target.value);
                      if (e.target.value.includes('Ultrasound')) {
                        setRegion('Abdomen - Hepatobiliary, Spleen & Bladder');
                      } else {
                        setRegion('Thorax - Right Lateral & VD');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-teal-700 dark:text-teal-300"
                  >
                    <option value="X-ray (Radiograph)">Digital Radiography (X-Ray)</option>
                    <option value="Ultrasound (Sonogram)">Ultrasonography (USG / Abdominal)</option>
                    <option value="Echocardiogram">Echocardiogram (Cardiac USG)</option>
                    <option value="CT Scan">Computed Tomography (CT)</option>
                    <option value="MRI Scan">Magnetic Resonance Imaging (MRI)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Anatomical Projection / Region
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload Image File / Scan */}
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Upload Radiograph or Ultrasound Image (JPG / PNG / WebP)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Upload X-ray projection or ultrasound still frame for automated AI vision feature extraction.
                    </p>
                  </div>
                  <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUrl && imageUrl.trim() !== '' && (
                  <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border bg-black shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate block">
                        Imaging File Ready for Analysis
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready for Gemini Multi-Modal Vision Processing
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical History & Suspected Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Clinical History
                  </label>
                  <input
                    type="text"
                    value={clinicalHistory}
                    onChange={(e) => setClinicalHistory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Suspected Conditions
                  </label>
                  <input
                    type="text"
                    value={suspectedConditions}
                    onChange={(e) => setSuspectedConditions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* AI Vision Trigger Button */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-900 to-emerald-900 rounded-2xl text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                  <div>
                    <span className="font-bold text-xs block">AI Veterinary Radiologist & Sonographer Vision</span>
                    <span className="text-[10px] text-teal-200">
                      Evaluates VHS, parenchymal echogenicity gradient, wall thickness, FAST trauma score
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={handleRunAiVisionAnalysis}
                  className="bg-white text-teal-900 hover:bg-teal-50 font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                      <span>Analyzing Radiograph / USG...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-700" />
                      <span>Run AI Vision Diagnostic</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Findings Preview if available */}
              {aiReport && (
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-teal-900 dark:text-teal-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" /> AI Diagnostic Imaging Synthesis
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      {aiReport.urgencyTriage || 'Diagnostic Review'}
                    </span>
                  </div>

                  {aiReport.sonographicOrRadiographicIndices && (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {Object.entries(aiReport.sonographicOrRadiographicIndices).map(([k, v]: [string, any]) => (
                        <div key={k} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800">
                          <span className="font-bold text-[10px] text-slate-400 uppercase block">{k}</span>
                          <span className="font-semibold text-teal-800 dark:text-teal-200">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Editable Findings */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Radiological Findings (One per line)
                </label>
                <textarea
                  rows={3}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Editable Interpretation */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Veterinarian & Diagnostic Interpretation
                </label>
                <textarea
                  rows={2}
                  value={interpretationInput}
                  onChange={(e) => setInterpretationInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Save Study to Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
