import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  User,
  Heart,
  PlusCircle,
  Filter,
  Pill,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

interface OwnerVaccinationTrackerProps {
  onNavigateTab?: (tab: string) => void;
}

export const OwnerVaccinationTracker: React.FC<OwnerVaccinationTrackerProps> = ({ onNavigateTab }) => {
  const {
    ownerPets,
    selectedPetId,
    setSelectedPetId,
    ownerVaccinations,
    ownerDewormings,
    adminProfile,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vaccines' | 'deworming'>('vaccines');
  const [filterPetId, setFilterPetId] = useState<string>(selectedPetId || 'all');

  const filteredVaccines = ownerVaccinations.filter((v) => {
    if (filterPetId === 'all') return true;
    return v.petId === filterPetId;
  });

  const filteredDewormings = ownerDewormings.filter((d) => {
    if (filterPetId === 'all') return true;
    return d.petId === filterPetId;
  });

  // Calculate status: Active, Due, Overdue
  const calculateStatus = (dueDateStr: string): { label: 'Active' | 'Due' | 'Overdue'; colorClass: string } => {
    if (!dueDateStr) return { label: 'Active', colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    const today = new Date();
    const due = new Date(dueDateStr);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Overdue', colorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' };
    }
    if (diffDays <= 30) {
      return { label: 'Due', colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' };
    }
    return { label: 'Active', colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
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
              Immunization & Parasite Control Trackers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active immunity certificates, next booster schedules, and internal parasite protection logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {ownerPets.length > 0 && (
            <select
              value={filterPetId}
              onChange={(e) => setFilterPetId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="all">All Companions ({ownerPets.length})</option>
              {ownerPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>
          )}

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('book-appointment')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Book Booster Visit
            </button>
          )}
        </div>
      </div>

      {/* Switch Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vaccines'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Vaccination Tracker ({filteredVaccines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deworming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'deworming'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Deworming Tracker ({filteredDewormings.length})</span>
        </button>
      </div>

      {/* 1. Vaccination Tracker Table / Cards */}
      {activeTab === 'vaccines' && (
        <div className="space-y-4">
          {filteredVaccines.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Vaccination Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Records administered by your veterinarian will be automatically updated here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVaccines.map((v) => {
                const status = calculateStatus(v.nextDueDate);
                return (
                  <div
                    key={v.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-teal-400 dark:hover:border-teal-700 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">
                            {v.vaccineName}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Patient: <strong>{v.petName}</strong> ({v.species})
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${status.colorClass}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Date Given</span>
                        <strong className="text-slate-800 dark:text-slate-200">{v.administeredDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Due Date</span>
                        <strong className="text-teal-600 dark:text-teal-400 font-bold">{v.nextDueDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Doctor / Clinic</span>
                        <span className="text-slate-700 dark:text-slate-300">{v.veterinarianName || v.administeredBy || adminProfile.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Route & Batch</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{v.route} • {v.batchNumber}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Deworming Tracker Table / Cards */}
      {activeTab === 'deworming' && (
        <div className="space-y-4">
          {filteredDewormings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Deworming Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Antiparasitic treatments administered or prescribed will be logged here with due dates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDewormings.map((d) => {
                const status = calculateStatus(d.nextDueDate);
                return (
                  <div
                    key={d.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-teal-400 dark:hover:border-teal-700 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-xl">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">
                            {d.drugUsed}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Patient: <strong>{d.petName}</strong> • Dose: {d.dosage}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${status.colorClass}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Date Given</span>
                        <strong className="text-slate-800 dark:text-slate-200">{d.administeredDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Due Date</span>
                        <strong className="text-teal-600 dark:text-teal-400 font-bold">{d.nextDueDate}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
