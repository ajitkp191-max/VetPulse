import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImagingRecord, ModalityType } from '../../types';
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

  // New Imaging Form State
  const [modality, setModality] = useState<ModalityType>('X-Ray');
  const [region, setRegion] = useState('Thorax - Right Lateral & VD');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [findingsInput, setFindingsInput] = useState('Cardiac silhouette normal in size (VHS 9.6). Lungs show mild bronchointerstitial pattern. Diaphragm intact.');
  const [interpretationInput, setInterpretationInput] = useState('Mild allergic bronchitis. No evidence of pulmonary edema or metastatic disease.');

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Image manipulation in viewer
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);

  const activeRecord = imagingRecords.find((r) => r.id === selectedImgId) || imagingRecords[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setImageBase64(base64String.split(',')[1]);
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
        clinicalHistory: 'Routine screening and clinical follow-up',
        imageBase64,
        mimeType: 'image/jpeg',
      });
      setAiReport(result);
      if (result.interpretations?.length) {
        setInterpretationInput(result.interpretations.join(' '));
      }
      if (result.findings?.length) {
        setFindingsInput(result.findings.join(' '));
      }
      showNotification('Gemini AI Radiograph Vision Interpretation generated!', 'success');
    } catch (err) {
      showNotification('AI Vision analysis failed', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addImagingRecord({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      date: new Date().toISOString().split('T')[0],
      modality,
      anatomicalRegion: region,
      imageUrl,
      findings: findingsInput.split('\n').filter((f) => f.trim().length > 0),
      interpretation: interpretationInput,
      aiAnalysis: aiReport ? JSON.stringify(aiReport) : undefined,
    });
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Diagnostic Imaging & Radiology Suite
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-resolution DICOM / radiograph viewer, ultrasound review, and AI-assisted veterinary vision analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Study / Radiograph</span>
        </button>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Study List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Diagnostic Studies ({imagingRecords.length})
          </h4>
          {imagingRecords.map((item) => {
            const isSelected = item.id === activeRecord?.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedImgId(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex gap-3 ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.modality}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-black"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.petName}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate">
                    {item.modality} - {item.anatomicalRegion}
                  </p>
                  <div className="mt-1">
                    <SpeciesBadge species={item.species} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Study Viewer */}
        {activeRecord && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Viewer Controls Header */}
            <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-400">{activeRecord.modality} Study</span>
                <h4 className="text-sm font-semibold">{activeRecord.anatomicalRegion} ({activeRecord.petName} - {activeRecord.species})</h4>
              </div>

              {/* Manipulation Tool Bar */}
              <div className="flex items-center gap-2">
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
                  className={`p-1.5 rounded-lg text-xs font-mono font-bold ${invert ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                  title="Invert Grayscale LUT"
                >
                  INV
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setBrightness(100);
                    setContrast(100);
                    setInvert(false);
                  }}
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Darkroom Diagnostic Canvas View */}
            <div className="bg-black p-4 flex items-center justify-center min-h-[380px] overflow-hidden relative">
              <img
                src={activeRecord.imageUrl}
                alt={activeRecord.anatomicalRegion}
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-h-[420px] max-w-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-teal-400 border border-teal-500/30">
                Study Date: {activeRecord.date} | Zoom: {Math.round(zoomLevel * 100)}%
              </div>
            </div>

            {/* Findings and Radiologist Diagnostic Text */}
            <div className="p-6 space-y-4">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Radiological Findings & Anatomical Markers
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeRecord.findings.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs">
                <h5 className="font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Diagnostic Conclusion / Impression</span>
                </h5>
                <p className="text-teal-950 dark:text-teal-100 font-medium">
                  {activeRecord.interpretation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD IMAGING STUDY MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Scan className="w-5 h-5 text-teal-600" />
                <span>Upload Radiograph / Imaging Study</span>
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 pt-4 text-xs">
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
                    Modality
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as ModalityType)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="X-Ray">Digital Radiography (X-Ray)</option>
                    <option value="Ultrasound">Abdominal / Cardiac Ultrasound</option>
                    <option value="CT Scan">Computed Tomography (CT)</option>
                    <option value="MRI">Magnetic Resonance Imaging (MRI)</option>
                    <option value="Endoscopy">Endoscopy / Fluoroscopy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Anatomical Region / Projection Views
                </label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Abdomen - Lateral & VD, Left Stifle AP"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Upload Input & AI Button */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Select Study Image / Radiograph File
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiVisionAnalysis}
                    disabled={isAiLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Vision...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Radiograph Assist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="p-2 bg-black rounded-xl text-center">
                  <img src={imageUrl} alt="Study Preview" className="max-h-48 mx-auto rounded object-contain" />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Radiological Findings
                </label>
                <textarea
                  rows={3}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Impression / Interpretation
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
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Save Imaging Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
