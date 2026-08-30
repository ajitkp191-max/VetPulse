import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SurgicalProcedure, SurgeryCategory } from '../../types';
import {
  Scissors,
  PlusCircle,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Syringe,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const SurgeryModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    surgeries,
    adminProfile,
    showNotification,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurgeryId, setSelectedSurgeryId] = useState<string>(surgeries[0]?.id || '');
  const [isLogSurgeryModalOpen, setIsLogSurgeryModalOpen] = useState(false);

  const filteredSurgeries = surgeries.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.speciesTarget.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeProcedure = surgeries.find((s) => s.id === selectedSurgeryId) || surgeries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Surgical Reference & Operating Theater Suite
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Soft tissue, Orthopedic, Ophthalmic, Reproductive, and Emergency surgical protocols with step-by-step techniques.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            showNotification('Procedure protocol printed for Operating Theater clipboard!', 'success');
            window.print();
          }}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
        >
          <FileCheck className="w-4 h-4 text-teal-600" />
          <span>Print OT Checklist</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search procedures by name, anesthetic protocol, or instruments..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Categories ({surgeries.length})</option>
            <option value="Soft Tissue">Soft Tissue</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Reproductive">Reproductive</option>
            <option value="Ophthalmic">Ophthalmic</option>
            <option value="Emergency">Emergency</option>
            <option value="Large Animal">Large Animal</option>
          </select>
        </div>
      </div>

      {/* Main Surgery Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Procedure Library ({filteredSurgeries.length})
          </h4>
          {filteredSurgeries.map((proc) => {
            const isSelected = proc.id === activeProcedure?.id;
            return (
              <div
                key={proc.id}
                onClick={() => setSelectedSurgeryId(proc.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {proc.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {proc.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  Target: {proc.speciesTarget}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Procedure Dossier */}
        {activeProcedure && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Title Banner */}
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {activeProcedure.category} Surgical Protocol
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeProcedure.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Species Applicability: {activeProcedure.speciesTarget}
                </p>
              </div>

              <div className="p-3 bg-teal-50 dark:bg-teal-950 rounded-2xl text-teal-700 dark:text-teal-300">
                <Scissors className="w-6 h-6" />
              </div>
            </div>

            {/* Quick Badges: Instruments & Sutures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Scissors className="w-4 h-4 text-teal-600" />
                  <span>Required Surgical Instruments</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProcedure.requiredInstruments.map((inst, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] rounded-lg border">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Suture Materials & Patterns</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {activeProcedure.sutureMaterials}
                </p>
              </div>
            </div>

            {/* Pre-Op & Anesthesia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pre-Operative Preparation</span>
                </span>
                <p className="text-amber-950 dark:text-amber-100 leading-relaxed text-[11px]">
                  {activeProcedure.preOpPrep}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 space-y-1.5">
                <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Syringe className="w-4 h-4 text-blue-600" />
                  <span>Anesthesia & Analgesia Protocol</span>
                </span>
                <p className="text-blue-950 dark:text-blue-100 leading-relaxed text-[11px]">
                  {activeProcedure.anestheticProtocol}
                </p>
              </div>
            </div>

            {/* Step-by-Step Surgical Technique */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Surgical Technique
              </h4>
              <div className="space-y-2">
                {activeProcedure.stepByStepTechnique.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                      {idx + 1}
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complications & Post-Op */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 space-y-1.5">
                <span className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Intra-Operative Complications</span>
                </span>
                <ul className="space-y-1 text-[11px] text-red-950 dark:text-red-200">
                  {activeProcedure.intraOpComplications.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Post-Operative Care & Monitoring</span>
                </span>
                <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed text-[11px]">
                  {activeProcedure.postOpCare}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
