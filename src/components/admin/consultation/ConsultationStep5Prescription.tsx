import React, { useState } from 'react';
import {
  Pill,
  Sparkles,
  FileText,
  Upload,
  PlusCircle,
  Trash2,
  Printer,
  Save,
  CheckCircle2,
  ChevronLeft,
  Calendar,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Zap,
} from 'lucide-react';
import { PrescriptionItem } from '../../../types';

interface Step5PrescriptionProps {
  activePet: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: number;
  };
  finalDiagnosis: string;
  suspectedCause: string;

  // AI Suggested Prescription
  aiSuggestedPrescription: any[];

  // Doctor's Rx state
  rxMode: 'write' | 'upload';
  setRxMode: (val: 'write' | 'upload') => void;
  rxItems: PrescriptionItem[];
  setRxItems: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  dietaryAdvice: string;
  setDietaryAdvice: (val: string) => void;
  precautions: string;
  setPrecautions: (val: string) => void;
  followUpDate: string;
  setFollowUpDate: (val: string) => void;

  // Upload Rx slip state
  uploadedRxSlipUrl: string | null;
  setUploadedRxSlipUrl: (val: string | null) => void;
  uploadedRxFileName: string;
  setUploadedRxFileName: (val: string) => void;
  uploadedRxNotes: string;
  setUploadedRxNotes: (val: string) => void;

  // Actions
  onPrintPrescription: () => void;
  onSaveConsultation: (e: React.FormEvent) => void;
  onBackToStep4: () => void;
}

export const ConsultationStep5Prescription: React.FC<Step5PrescriptionProps> = ({
  activePet,
  finalDiagnosis,
  suspectedCause,
  aiSuggestedPrescription,
  rxMode,
  setRxMode,
  rxItems,
  setRxItems,
  dietaryAdvice,
  setDietaryAdvice,
  precautions,
  setPrecautions,
  followUpDate,
  setFollowUpDate,
  uploadedRxSlipUrl,
  setUploadedRxSlipUrl,
  uploadedRxFileName,
  setUploadedRxFileName,
  uploadedRxNotes,
  setUploadedRxNotes,
  onPrintPrescription,
  onSaveConsultation,
  onBackToStep4,
}) => {
  const [adoptedNotice, setAdoptedNotice] = useState(false);

  // Adopt AI Generated Prescription to Rx Pad
  const handleAdoptAiPrescription = () => {
    if (!aiSuggestedPrescription || aiSuggestedPrescription.length === 0) return;

    const formattedItems: PrescriptionItem[] = aiSuggestedPrescription.map((m: any) => ({
      medicineName: m.medicineName || m.drug || 'Veterinary Medication',
      form: m.form || 'Tablet',
      dosage: m.dosage || `${activePet.weight * 10} mg`,
      route: m.route || 'Oral',
      frequency: m.frequency || 'Twice daily (q12h)',
      duration: m.duration || '7 days',
      instructions: m.instructions || 'Administer with meal.',
    }));

    setRxItems(formattedItems);
    setRxMode('write');
    setAdoptedNotice(true);
    setTimeout(() => setAdoptedNotice(false), 4000);
  };

  // Add a medication row
  const handleAddMedicineRow = () => {
    setRxItems((prev) => [
      ...prev,
      {
        medicineName: '',
        form: 'Tablet',
        dosage: '',
        route: 'Oral',
        frequency: 'Twice daily (q12h)',
        duration: '5 days',
        instructions: 'Administer with food.',
      },
    ]);
  };

  // Remove a medication row
  const handleRemoveMedicineRow = (index: number) => {
    setRxItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update a single field in a medication row
  const handleUpdateMedicineRow = (
    index: number,
    field: keyof PrescriptionItem,
    value: string
  ) => {
    setRxItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle upload of physical Rx slip
  const handleUploadRxSlip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedRxSlipUrl(url);
      setUploadedRxFileName(file.name);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 5.1 1ST OF ALL: SUGGEST AI GENERATED PRESCRIPTION */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-purple-900 text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-300 rounded-2xl border border-teal-400/30">
              <Sparkles className="w-6 h-6 animate-pulse text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
                  Step 5 • 1st: AI Suggested Prescription
                </span>
                <span className="text-[10px] font-bold text-teal-200 bg-teal-950/60 px-2.5 py-0.5 rounded-full">
                  Dosed for {activePet.weight} kg {activePet.species}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                AI Suggested Prescription for: {finalDiagnosis}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdoptAiPrescription}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Adopt AI Prescription to Rx Slip (1-Click)</span>
          </button>
        </div>

        {/* Adopt Notice Banner */}
        {adoptedNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>
              Successfully adopted {aiSuggestedPrescription.length} medications to doctor's digital prescription slip below!
            </span>
          </div>
        )}

        {/* AI Suggested Items Preview Table */}
        <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-xs border border-white/10 overflow-x-auto">
          <div className="min-w-[650px]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-teal-200 uppercase tracking-wider">
                  <th className="pb-2 font-bold">Suggested Medication</th>
                  <th className="pb-2 font-bold">Form</th>
                  <th className="pb-2 font-bold">Dosage (Weight-Adjusted)</th>
                  <th className="pb-2 font-bold">Route & Frequency</th>
                  <th className="pb-2 font-bold">Duration</th>
                  <th className="pb-2 font-bold">Clinical Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(aiSuggestedPrescription && aiSuggestedPrescription.length > 0 ? aiSuggestedPrescription : [
                  {
                    medicineName: 'Amoxicillin-Clavulanate (Synulox/Clavamox)',
                    form: 'Tablet',
                    dosage: `${Math.round(activePet.weight * 12.5)} mg (12.5 mg/kg)`,
                    route: 'Oral',
                    frequency: 'Twice daily (BD / q12h)',
                    duration: '10 days',
                    instructions: 'Administer directly with or immediately after food.',
                  },
                  {
                    medicineName: 'Pantoprazole Gastroprotectant',
                    form: 'Tablet',
                    dosage: `${Math.round(activePet.weight * 1.0)} mg (1 mg/kg)`,
                    route: 'Oral',
                    frequency: 'Once daily (SID / q24h)',
                    duration: '5 days',
                    instructions: 'Give 30 minutes prior to first morning meal.',
                  },
                  {
                    medicineName: 'Metoclopramide / Maropitant (Cerenia)',
                    form: 'Tablet',
                    dosage: `${Math.round(activePet.weight * 2.0)} mg (2 mg/kg)`,
                    route: 'Oral',
                    frequency: 'Once daily (q24h)',
                    duration: '3 days',
                    instructions: 'Antiemetic support for mucosal recovery.',
                  },
                ]).map((med, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>{med.medicineName}</span>
                    </td>
                    <td className="py-2.5 text-teal-100">{med.form}</td>
                    <td className="py-2.5 text-teal-200 font-bold">{med.dosage}</td>
                    <td className="py-2.5 text-teal-100">{med.route} • {med.frequency}</td>
                    <td className="py-2.5 text-teal-200">{med.duration}</td>
                    <td className="py-2.5 text-slate-300 text-[11px]">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5.2 DOCTOR'S PRESCRIPTION WORKSPACE: DUAL MODE (WRITE OR UPLOAD) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Doctor's Prescription Center: Write Digital Slip or Upload Physical Rx
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor can review and edit digital medications, or attach a photo/scan of a handwritten slip.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRxMode('write')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                rxMode === 'write'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Option A: Digital Rx Writer</span>
            </button>

            <button
              type="button"
              onClick={() => setRxMode('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                rxMode === 'upload'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Option B: Upload Handwritten Slip</span>
            </button>
          </div>
        </div>

        {/* ================= OPTION A: DIGITAL PRESCRIPTION WRITER ================= */}
        {rxMode === 'write' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Prescription Items ({rxItems.length} medications listed)
              </span>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Medication Row</span>
              </button>
            </div>

            {/* Editable Medicines List */}
            <div className="space-y-3">
              {rxItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center text-xs"
                >
                  {/* Medicine Name */}
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Medication #{index + 1} Name & Strength *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amoxicillin Clavulanate 250mg"
                      value={item.medicineName}
                      onChange={(e) => handleUpdateMedicineRow(index, 'medicineName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  {/* Form */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Form
                    </label>
                    <select
                      value={item.form}
                      onChange={(e) => handleUpdateMedicineRow(index, 'form', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup / Liquid">Syrup / Liquid</option>
                      <option value="Injection">Injection</option>
                      <option value="Paste">Paste</option>
                      <option value="Eye/Ear Drops">Eye/Ear Drops</option>
                      <option value="Ointment">Ointment</option>
                    </select>
                  </div>

                  {/* Dosage */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 tab (250mg)"
                      value={item.dosage}
                      onChange={(e) => handleUpdateMedicineRow(index, 'dosage', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  {/* Frequency */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Frequency
                    </label>
                    <select
                      value={item.frequency}
                      onChange={(e) => handleUpdateMedicineRow(index, 'frequency', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Once daily (q24h)">Once daily (SID)</option>
                      <option value="Twice daily (q12h)">Twice daily (BID)</option>
                      <option value="Thrice daily (q8h)">Thrice daily (TID)</option>
                      <option value="Every 4-6 hours">Every 4-6 hours</option>
                      <option value="As needed (PRN)">As needed (PRN)</option>
                    </select>
                  </div>

                  {/* Duration & Delete */}
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7 days"
                        value={item.duration}
                        onChange={(e) => handleUpdateMedicineRow(index, 'duration', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    {rxItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        className="mt-4 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="md:col-span-12">
                    <input
                      type="text"
                      placeholder="Doctor instructions: e.g. Give 1 hour before meals, crush tablet in treat, complete full course..."
                      value={item.instructions || ''}
                      onChange={(e) => handleUpdateMedicineRow(index, 'instructions', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dietary & Precautions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary & Nutrition Protocol
                </label>
                <textarea
                  rows={3}
                  value={dietaryAdvice}
                  onChange={(e) => setDietaryAdvice(e.target.value)}
                  placeholder="e.g. Bland boiled chicken breast and rice in small frequent meals..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Warning Signs & Precautions
                </label>
                <textarea
                  rows={3}
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  placeholder="e.g. Seek emergency veterinary check if vomiting recurs, pale gums develop..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Scheduled Re-check date */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Scheduled Follow-up Re-Check:
              </span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>
        )}

        {/* ================= OPTION B: UPLOAD HANDWRITTEN PRESCRIPTION ================= */}
        {rxMode === 'upload' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border-2 border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 text-center space-y-3">
                <Upload className="w-10 h-10 text-teal-600 mx-auto" />
                <div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                    Upload Photograph / Scan of Handwritten Prescription
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports camera photos, JPG, PNG, and PDF slips
                  </span>
                </div>

                <label className="inline-block cursor-pointer px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                  <span>Browse / Take Photo</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleUploadRxSlip}
                    className="hidden"
                  />
                </label>

                {uploadedRxFileName && (
                  <span className="block text-xs font-bold text-teal-600">
                    File: {uploadedRxFileName}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {uploadedRxSlipUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-52 bg-black flex items-center justify-center">
                    <img
                      src={uploadedRxSlipUrl}
                      alt="Uploaded Prescription Slip"
                      className="w-full h-full object-contain max-h-48"
                    />
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    No physical prescription slip uploaded yet
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Doctor's Upload Notes & Dispensing Comments
                  </label>
                  <textarea
                    rows={3}
                    value={uploadedRxNotes}
                    onChange={(e) => setUploadedRxNotes(e.target.value)}
                    placeholder="e.g. Prescribed on clinic letterhead. 3 items dispensed from internal pharmacy..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5.3 FINAL ACTION BUTTONS: PRINT & SAVE DOSSIER */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToStep4}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Step 4: AI Synthesis</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={onPrintPrescription}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-teal-600" />
            <span>Print Official Rx Slip</span>
          </button>

          <button
            type="button"
            onClick={onSaveConsultation}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-2 transition-transform active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Complete Consultation & Rx Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
