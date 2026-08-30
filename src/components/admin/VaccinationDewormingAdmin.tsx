import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bug,
  PlusCircle,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Send,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const VaccinationDewormingAdmin: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    vaccinations,
    dewormings,
    addVaccination,
    addDeworming,
    adminProfile,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vaccination' | 'deworming'>('vaccination');
  const [isVaxModalOpen, setIsVaxModalOpen] = useState(false);
  const [isDewModalOpen, setIsDewModalOpen] = useState(false);

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // New Vaccine Form State
  const [vaccineName, setVaccineName] = useState('Rabies Multi-Strain Vaccine (Rabisin)');
  const [batchNumber, setBatchNumber] = useState(`RB-${Date.now().toString().slice(-5)}`);
  const [manufacturer, setManufacturer] = useState('Boehringer Ingelheim / Merial');
  const [dose, setDose] = useState('1.0 mL');
  const [route, setRoute] = useState('Subcutaneous (SC)');
  const [adminDate, setAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [intervalMonths, setIntervalMonths] = useState(12);

  // Auto calculate next due date
  const computeNextDate = (start: string, months: number) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  // New Deworming Form State
  const [dewormDrug, setDewormDrug] = useState('Drontal Plus (Praziquantel / Pyrantel / Febantel)');
  const [dewormDose, setDewormDose] = useState('1 tablet per 10kg');
  const [dewormAdminDate, setDewormAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [dewormIntervalMonths, setDewormIntervalMonths] = useState(3);

  const handleSaveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const nextDue = computeNextDate(adminDate, intervalMonths);
    addVaccination({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      vaccineName,
      batchNumber,
      manufacturer,
      dose,
      route,
      administeredDate: adminDate,
      nextDueDate: nextDue,
      veterinarianName: adminProfile.name,
      status: 'Completed',
    });
    setIsVaxModalOpen(false);
  };

  const handleSaveDeworming = (e: React.FormEvent) => {
    e.preventDefault();
    const nextDue = computeNextDate(dewormAdminDate, dewormIntervalMonths);
    addDeworming({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      drugUsed: dewormDrug,
      dosage: dewormDose,
      administeredDate: dewormAdminDate,
      nextDueDate: nextDue,
      administeredBy: adminProfile.name,
      status: 'Completed',
    });
    setIsDewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Preventive Healthcare, Immunization & Deworming
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated booster scheduling, batch tracking, reminders, and printable health certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVaxModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administer Vaccine</span>
          </button>
          <button
            onClick={() => setIsDewModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
          >
            <Bug className="w-4 h-4" />
            <span>Log Deworming</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-xs">
        <button
          onClick={() => setActiveTab('vaccination')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'vaccination'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Vaccination Registry ({vaccinations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('deworming')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deworming'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Deworming Protocols ({dewormings.length})</span>
        </button>
      </div>

      {/* VACCINATION TABLE */}
      {activeTab === 'vaccination' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                <th className="py-3 px-3">Patient / Animal</th>
                <th className="py-3 px-3">Vaccine & Manufacturer</th>
                <th className="py-3 px-3">Batch & Route</th>
                <th className="py-3 px-3">Given Date</th>
                <th className="py-3 px-3">Next Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vaccinations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{v.petName}</div>
                    <SpeciesBadge species={v.species} />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{v.vaccineName}</div>
                    <div className="text-[10px] text-slate-400">{v.manufacturer}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div>{v.batchNumber}</div>
                    <span className="text-[10px] text-teal-600 font-sans">{v.route}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{v.administeredDate}</td>
                  <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">{v.nextDueDate}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        showNotification(`Dispatched WhatsApp/SMS reminder for ${v.petName}'s booster!`, 'success');
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-teal-600 text-xs font-semibold"
                      title="Send Booster Reminder"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DEWORMING TABLE */}
      {activeTab === 'deworming' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                <th className="py-3 px-3">Patient / Animal</th>
                <th className="py-3 px-3">Anthelmintic Drug</th>
                <th className="py-3 px-3">Dosage / Instructions</th>
                <th className="py-3 px-3">Given Date</th>
                <th className="py-3 px-3">Next Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dewormings.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{d.petName}</div>
                    <SpeciesBadge species={d.species} />
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {d.drugUsed}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{d.dosage}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{d.administeredDate}</td>
                  <td className="py-3 px-3 font-bold text-purple-600 dark:text-purple-400">{d.nextDueDate}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        showNotification(`Deworming schedule notification sent to ${d.petName}'s owner!`, 'success');
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-purple-600 text-xs font-semibold"
                      title="Send Deworming Reminder"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADMINISTER VACCINE MODAL */}
      {isVaxModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span>Administer Immunization Vaccine</span>
              </h3>
              <button onClick={() => setIsVaxModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveVaccine} className="space-y-3.5 pt-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Vaccine Name</label>
                  <input
                    type="text"
                    required
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Dose</label>
                  <input
                    type="text"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Route</label>
                  <input
                    type="text"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Booster Due (Mos)</label>
                  <input
                    type="number"
                    value={intervalMonths}
                    onChange={(e) => setIntervalMonths(parseInt(e.target.value) || 12)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsVaxModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Record Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG DEWORMING MODAL */}
      {isDewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-purple-600" />
                <span>Record Deworming Treatment</span>
              </h3>
              <button onClick={() => setIsDewModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDeworming} className="space-y-3.5 pt-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Drug Used</label>
                  <input
                    type="text"
                    required
                    value={dewormDrug}
                    onChange={(e) => setDewormDrug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dewormDose}
                    onChange={(e) => setDewormDose(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Next Cycle (Months)</label>
                  <input
                    type="number"
                    value={dewormIntervalMonths}
                    onChange={(e) => setDewormIntervalMonths(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsDewModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Save Deworming
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
