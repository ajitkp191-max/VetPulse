import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription, PrescriptionItem } from '../../types';
import {
  FileText,
  PlusCircle,
  Trash2,
  Printer,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Search,
  Building,
  Award,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const PrescriptionGenerator: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    prescriptions,
    addPrescription,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Prescription State
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Gastroenteritis with Mild Dehydration');
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([
    {
      medicineName: 'Cerenia (Maropitant Citrate)',
      form: 'Injection / Tablet',
      dosage: '1.0 mg/kg (12mg)',
      route: 'Oral (PO)',
      frequency: 'Once daily (q24h)',
      duration: '4 days',
      instructions: 'Administer with a small piece of food 2 hours prior to main meal.',
    },
    {
      medicineName: 'Famotidine',
      form: 'Tablet',
      dosage: '0.5 mg/kg (6mg)',
      route: 'Oral (PO)',
      frequency: 'Twice daily (q12h)',
      duration: '5 days',
      instructions: 'Give 30 minutes before meal.',
    },
    {
      medicineName: 'Pro-Kolin Advanced Probiotic',
      form: 'Paste',
      dosage: '2 mL',
      route: 'Oral (PO)',
      frequency: 'Twice daily (q12h)',
      duration: '5 days',
      instructions: 'Administer directly into mouth or mix with boiled chicken.',
    },
  ]);

  const [dietaryAdvice, setDietaryAdvice] = useState('Bland diet: 2:1 ratio of boiled white rice and boiled skinless chicken breast for 3-5 days. Transition back to regular diet gradually.');
  const [precautions, setPrecautions] = useState('Ensure continuous access to fresh water. If vomiting recurs more than twice in 12 hours, report immediately.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-02');

  const activeRx = prescriptions.find((r) => r.id === selectedRxId) || prescriptions[0];

  const handleAddMedicineRow = () => {
    setRxItems((prev) => [
      ...prev,
      {
        medicineName: '',
        form: 'Tablet',
        dosage: '1 tablet',
        route: 'Oral (PO)',
        frequency: 'Twice daily (q12h)',
        duration: '5 days',
        instructions: 'After food',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescriptionItem, val: string) => {
    setRxItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxItems.length === 0 || !rxItems[0].medicineName) {
      showNotification('Please add at least one valid medication', 'error');
      return;
    }

    const rxNum = `RX-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const saved = addPrescription({
      prescriptionNumber: rxNum,
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      breed: selectedPet.breed,
      ownerName: selectedPet.ownerName,
      ownerPhone: selectedPet.ownerPhone,
      date: new Date().toISOString().split('T')[0],
      veterinarianName: adminProfile.name,
      registrationNumber: adminProfile.registrationNumber,
      diagnosis: rxDiagnosis,
      items: rxItems,
      dietaryAdvice,
      precautions,
      followUpDate,
      signature: adminProfile.name,
    });

    setSelectedRxId(saved.id);
    setIsCreateModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Digital Prescription (Rx) Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weight-based dosing, pharmacy formulations, dietary guidance & printable official Rx.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Prescription</span>
          </button>
        </div>
      </div>

      {/* Grid: List of Saved Rx & Active Rx Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Saved Rx List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Prescription Archive ({prescriptions.length})
          </h4>
          {prescriptions.map((rx) => {
            const isSelected = rx.id === activeRx?.id;
            return (
              <div
                key={rx.id}
                onClick={() => setSelectedRxId(rx.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {rx.petName} ({rx.species})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">#{rx.prescriptionNumber}</span>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate">
                  Dx: {rx.diagnosis}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>{rx.items.length} Medications</span>
                  <span>{rx.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Printable Medical Rx Sheet */}
        {activeRx && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 print-container">
            {/* Clinic Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-teal-600">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-600 text-white rounded-2xl">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {adminProfile.clinicName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{adminProfile.clinicAddress}</p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                    Phone: {adminProfile.contactNumber} | Email: {adminProfile.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{activeRx.veterinarianName}</h4>
                <p className="text-[11px] text-slate-500">{adminProfile.qualification}</p>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-mono">
                  Reg No: {activeRx.registrationNumber}
                </p>
              </div>
            </div>

            {/* Print & Action Bar */}
            <div className="flex items-center justify-between no-print">
              <span className="text-xs font-mono text-slate-400">
                Prescription Ref: <strong>{activeRx.prescriptionNumber}</strong>
              </span>
              <button
                onClick={handlePrint}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Rx</span>
              </button>
            </div>

            {/* Patient & Owner Meta Strip */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Patient:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeRx.petName}</div>
                <span className="text-[10px] text-slate-500">{activeRx.species} • {activeRx.breed}</span>
              </div>
              <div>
                <span className="text-slate-400">Pet Parent:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeRx.ownerName}</div>
                <span className="text-[10px] text-slate-500">{activeRx.ownerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400">Prescription Date:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeRx.date}</div>
              </div>
              <div>
                <span className="text-slate-400">Clinical Diagnosis:</span>
                <div className="font-bold text-teal-700 dark:text-teal-300 mt-0.5">{activeRx.diagnosis}</div>
              </div>
            </div>

            {/* Medications Rx Symbol Table */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-serif font-black text-teal-700 dark:text-teal-400">℞</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Prescribed Pharmaceuticals & Regimen
                </h4>
              </div>

              <div className="space-y-3">
                {activeRx.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-600">{idx + 1}.</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.medicineName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold">
                          {item.form}
                        </span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Duration: {item.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                      <div><strong>Dosage:</strong> {item.dosage}</div>
                      <div><strong>Route:</strong> {item.route}</div>
                      <div><strong>Frequency:</strong> {item.frequency}</div>
                    </div>

                    {item.instructions && (
                      <div className="mt-2 text-[11px] text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-teal-100 dark:border-teal-900">
                        <strong>Directions:</strong> {item.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Diet, Precautions & Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                  🥗 Dietary & Feeding Instructions
                </span>
                <p className="text-amber-950 dark:text-amber-100 text-[11px] leading-relaxed">
                  {activeRx.dietaryAdvice}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">
                  ⚠️ Precautions & Re-evaluation Date
                </span>
                <p className="text-blue-950 dark:text-blue-100 text-[11px] leading-relaxed">
                  {activeRx.precautions}
                </p>
                {activeRx.followUpDate && (
                  <p className="text-[11px] font-bold text-teal-700 dark:text-teal-300 mt-2">
                    Scheduled Re-Check: {activeRx.followUpDate}
                  </p>
                )}
              </div>
            </div>

            {/* Digital Signature Footer */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-[10px] text-slate-400">
                <p>Valid only with registered veterinarian seal.</p>
                <p>VetPulse Clinical OS • Generated securely.</p>
              </div>

              <div className="text-center">
                <div className="font-serif italic text-base text-teal-700 dark:text-teal-400 font-bold border-b border-slate-400 pb-1 px-4">
                  {activeRx.veterinarianName}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 block mt-1">
                  Authorized Veterinary Practitioner
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW PRESCRIPTION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Compose Digital Veterinary Prescription</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4 pt-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species} • {p.weight} kg)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Dynamic Drug Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold uppercase text-slate-700 dark:text-slate-300">Medications List</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-teal-600 font-bold text-xs flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Drug</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {rxItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-600">Medicine #{idx + 1}</span>
                        {rxItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Medicine Name (e.g. Amoxicillin)"
                          value={item.medicineName}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'medicineName', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        />
                        <select
                          value={item.form}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'form', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Syrup / Liquid">Syrup / Liquid</option>
                          <option value="Injection">Injection</option>
                          <option value="Paste">Paste / Gel</option>
                          <option value="Ointment / Cream">Ointment / Cream</option>
                          <option value="Eye Drops">Eye Drops</option>
                          <option value="Ear Drops">Ear Drops</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 10 mg/kg)"
                          value={item.dosage}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'dosage', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={item.route}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'route', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        >
                          <option value="Oral (PO)">Oral (PO)</option>
                          <option value="Subcutaneous (SC)">Subcutaneous (SC)</option>
                          <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                          <option value="Intravenous (IV)">Intravenous (IV)</option>
                          <option value="Topical">Topical</option>
                        </select>
                        <select
                          value={item.frequency}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'frequency', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        >
                          <option value="Once daily (q24h)">Once daily (q24h)</option>
                          <option value="Twice daily (q12h)">Twice daily (q12h)</option>
                          <option value="Three times daily (q8h)">Three times daily (q8h)</option>
                          <option value="As needed (SOS)">As needed (SOS)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Duration (e.g. 5 days)"
                          value={item.duration}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'duration', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Specific instructions (e.g. After food with plenty of water)"
                        value={item.instructions}
                        onChange={(e) => handleUpdateMedicineRow(idx, 'instructions', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Dietary Advice</label>
                  <textarea
                    rows={2}
                    value={dietaryAdvice}
                    onChange={(e) => setDietaryAdvice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 mb-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
