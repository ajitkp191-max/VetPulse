import React, { useState } from 'react';
import {
  ShieldCheck,
  Bug,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Stethoscope,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpeciesBadge } from '../common/AnimalIllustration';
import { VaccinationRecord, DewormingRecord, SpeciesType } from '../../types';

export const DoctorVaccinationDewormingSection: React.FC = () => {
  const {
    pets,
    vaccinations,
    dewormings,
    addVaccination,
    addDeworming,
    showNotification,
    adminProfile,
    isDoctorLoggedIn,
    currentDoctor,
    setSelectedPetId,
    setAdminActiveTab,
  } = useApp();

  const activeDoctorName = isDoctorLoggedIn && currentDoctor ? currentDoctor.name : adminProfile.name;
  const activeDoctorReg = isDoctorLoggedIn && currentDoctor ? currentDoctor.licenseNumber : adminProfile.licenseNumber;

  // Tabs: 'all' | 'vaccines' | 'deworming' | 'due'
  const [filterTab, setFilterTab] = useState<'all' | 'vaccines' | 'deworming' | 'due'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isDewormingModalOpen, setIsDewormingModalOpen] = useState(false);

  // Form states - Vaccine
  const [vaxPetId, setVaxPetId] = useState(pets[0]?.id || '');
  const [vaxName, setVaxName] = useState('Rabies (3-Year Booster)');
  const [vaxTarget, setVaxTarget] = useState('Rabies Lyssavirus');
  const [vaxBatch, setVaxBatch] = useState('RAB-2026-98X');
  const [vaxManufacturer, setVaxManufacturer] = useState('Zoetis Animal Health');
  const [vaxRoute, setVaxRoute] = useState<'Subcutaneous' | 'Intramuscular' | 'Intranasal'>('Subcutaneous');
  const [vaxAdminDate, setVaxAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [vaxNextDueDate, setVaxNextDueDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [vaxNotes, setVaxNotes] = useState('Administered in right hind flank. Patient tolerated well, no acute reaction.');

  // Form states - Deworming
  const [dewPetId, setDewPetId] = useState(pets[0]?.id || '');
  const [dewDrug, setDewDrug] = useState('Drontal Plus Flavored Tablets');
  const [dewIngredients, setDewIngredients] = useState('Praziquantel (50mg), Pyrantel Pamoate (144mg), Febantel (150mg)');
  const [dewDosage, setDewDosage] = useState('1 Tablet (for 10kg body weight)');
  const [dewAdminDate, setDewAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [dewNextDueDate, setDewNextDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  const [dewNotes, setDewNotes] = useState('Broad spectrum deworming against tapeworms, roundworms, and hookworms.');

  // Preset libraries for quick doctor administration
  const COMMON_VACCINES = [
    { name: 'Rabies (3-Year Booster)', target: 'Rabies Virus', manufacturer: 'Zoetis', intervalYears: 3 },
    { name: 'DHPP / DAPP (5-in-1)', target: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', manufacturer: 'Boehringer Ingelheim', intervalYears: 1 },
    { name: 'Bordetella Bronchiseptica', target: 'Kennel Cough / Infectious Tracheobronchitis', manufacturer: 'Merck Animal Health', intervalYears: 1 },
    { name: 'Leptospirosis 4-Way', target: 'L. canicola, icterohaemorrhagiae, grippotyphosa, pomona', manufacturer: 'Zoetis', intervalYears: 1 },
    { name: 'FVRCP Core (Feline)', target: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', manufacturer: 'Elanco', intervalYears: 1 },
    { name: 'FeLV (Feline Leukemia)', target: 'Feline Leukemia Virus', manufacturer: 'Boehringer Ingelheim', intervalYears: 1 },
  ];

  const COMMON_DEWORMERS = [
    { name: 'Drontal Plus Flavored', ingredients: 'Praziquantel, Pyrantel Pamoate, Febantel', intervalMonths: 3, doseGuide: '1 tablet per 10kg' },
    { name: 'Panacur (Fenbendazole 10%)', ingredients: 'Fenbendazole (100mg/mL)', intervalMonths: 3, doseGuide: '50mg/kg daily for 3 days' },
    { name: 'NexGard Spectra (Oral Chew)', ingredients: 'Afoxolaner + Milbemycin Oxime', intervalMonths: 1, doseGuide: '1 chewable monthly' },
    { name: 'Milbemax Tablets', ingredients: 'Milbemycin Oxime + Praziquantel', intervalMonths: 3, doseGuide: '1 tablet per 5-25kg' },
    { name: 'Pyrantel Pamoate Suspension', ingredients: 'Pyrantel Pamoate (50mg/mL)', intervalMonths: 1, doseGuide: '1 mL per 5kg' },
  ];

  // Actions
  const handleGiveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === vaxPetId);
    if (!pet) {
      showNotification('Please select a valid patient', 'error');
      return;
    }

    const newVax: Omit<VaccinationRecord, 'id'> = {
      petId: pet.id,
      petName: pet.name,
      species: pet.species as SpeciesType,
      vaccineName: vaxName,
      targetDiseases: vaxTarget,
      batchNumber: vaxBatch || `VAX-${Date.now().toString().slice(-6)}`,
      manufacturer: vaxManufacturer,
      administeredDate: vaxAdminDate,
      nextDueDate: vaxNextDueDate,
      administeredBy: activeDoctorName,
      veterinarianName: activeDoctorName,
      vetRegNumber: activeDoctorReg,
      route: vaxRoute,
      status: 'Completed',
      certificateNumber: `VC-VAX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    addVaccination(newVax);
    showNotification(`Vaccine "${vaxName}" successfully administered to ${pet.name}!`, 'success');
    setIsVaccineModalOpen(false);
  };

  const handleGiveDeworming = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === dewPetId);
    if (!pet) {
      showNotification('Please select a valid patient', 'error');
      return;
    }

    const newDew: Omit<DewormingRecord, 'id'> = {
      petId: pet.id,
      petName: pet.name,
      drugUsed: dewDrug,
      activeIngredients: dewIngredients,
      dosage: dewDosage,
      administeredDate: dewAdminDate,
      nextDueDate: dewNextDueDate,
      administeredBy: activeDoctorName,
      veterinarianName: activeDoctorName,
      vetRegNumber: activeDoctorReg,
      status: 'Completed',
    };

    addDeworming(newDew);
    showNotification(`Deworming dose of "${dewDrug}" successfully given to ${pet.name}!`, 'success');
    setIsDewormingModalOpen(false);
  };

  // Quick helper to auto-fill modal from a due pet
  const openVaccineForPet = (petId: string, suggestedVax?: string) => {
    setVaxPetId(petId);
    if (suggestedVax) {
      setVaxName(suggestedVax);
    }
    setIsVaccineModalOpen(true);
  };

  const openDewormingForPet = (petId: string, suggestedDrug?: string) => {
    setDewPetId(petId);
    const pet = pets.find((p) => p.id === petId);
    if (pet?.weight) {
      setDewDosage(`${(pet.weight / 10).toFixed(1)} tablet(s) for ${pet.weight}kg`);
    }
    if (suggestedDrug) {
      setDewDrug(suggestedDrug);
    }
    setIsDewormingModalOpen(true);
  };

  // Combined Records for the list
  const dueVaccines = vaccinations.filter((v) => v.status === 'Due Soon' || v.status === 'Overdue');
  const dueDewormings = dewormings.filter((d) => d.status === 'Due Soon' || d.status === 'Overdue');

  const filteredVaccines = vaccinations.filter(
    (v) =>
      v.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vaccineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDewormings = dewormings.filter(
    (d) =>
      d.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.drugUsed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP CLINICAL BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-950/70 border border-teal-400/40 text-[11px] font-bold text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Veterinary Preventive Medicine Station</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 text-[10px] font-bold">
                Doctor Live Administration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Vaccination & Deworming Clinical Administration
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Administer core vaccines, record batch/lot tracking, issue immunization certificates, and dispense weight-calculated anthelmintics.
            </p>
          </div>

          {/* TWO PRIMARY DOCTOR ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setVaxPetId(pets[0]?.id || '');
                setIsVaccineModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>+ Give Vaccine</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDewPetId(pets[0]?.id || '');
                setIsDewormingModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              <span>+ Give Deworming</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & DUE SCHEDULE CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Due/Overdue Vaccines */}
        <div
          onClick={() => setFilterTab('due')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Vaccines Due</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {dueVaccines.length}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">
            {dueVaccines.filter((v) => v.status === 'Overdue').length} Overdue
          </span>
        </div>

        {/* Due/Overdue Deworming */}
        <div
          onClick={() => setFilterTab('due')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Deworming Due</span>
            <Bug className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {dueDewormings.length}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
            Quarterly cycle
          </span>
        </div>

        {/* Total Vaccines Given */}
        <div
          onClick={() => setFilterTab('vaccines')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Vaccines Given</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {vaccinations.filter((v) => v.status === 'Completed').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            Immunized patients
          </span>
        </div>

        {/* Total Deworming Given */}
        <div
          onClick={() => setFilterTab('deworming')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Deworming Recorded</span>
            <Bug className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {dewormings.filter((d) => d.status === 'Completed').length}
          </div>
          <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block">
            Protected against parasites
          </span>
        </div>
      </div>

      {/* 3. PATIENTS REQUIRING IMMEDIATE ATTENTION (QUICK DOCTOR ACTION BAR) */}
      {(dueVaccines.length > 0 || dueDewormings.length > 0) && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Patients Due for Vaccine or Deworming
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
              Click "Give Now" to administer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueVaccines.map((vax) => (
              <div
                key={`due-vax-${vax.id}`}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-2xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {vax.petName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {vax.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    💉 {vax.vaccineName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Due Date: <strong>{vax.nextDueDate}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openVaccineForPet(vax.petId, vax.vaccineName)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Give Vaccine
                </button>
              </div>
            ))}

            {dueDewormings.map((dew) => (
              <div
                key={`due-dew-${dew.id}`}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-2xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {dew.petName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {dew.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    💊 {dew.drugUsed}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Due Date: <strong>{dew.nextDueDate}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openDewormingForPet(dew.petId, dew.drugUsed)}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Give Deworming
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN RECORDS LIST & FILTERS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Records ({vaccinations.length + dewormings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('vaccines')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterTab === 'vaccines'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vaccines ({vaccinations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('deworming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterTab === 'deworming'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Deworming ({dewormings.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('due')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterTab === 'due'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Due Soon ({dueVaccines.length + dueDewormings.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, vaccine or drug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* 4.1 VACCINATIONS TABLE */}
        {(filterTab === 'all' || filterTab === 'vaccines' || filterTab === 'due') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vaccination Log ({filteredVaccines.length})
              </span>
              <button
                type="button"
                onClick={() => setIsVaccineModalOpen(true)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline normal-case font-semibold"
              >
                + Administer New Vaccine
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVaccines.map((vax) => (
                <div
                  key={vax.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      💉
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {vax.petName}
                        </span>
                        <span className="text-[10px] text-slate-400">({vax.species})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          vax.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : vax.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {vax.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        {vax.vaccineName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                        <span>Batch: {vax.batchNumber}</span>
                        <span>•</span>
                        <span>Mfr: {vax.manufacturer}</span>
                        <span>•</span>
                        <span>Route: {vax.route}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Given: <strong className="text-slate-800 dark:text-slate-200">{vax.administeredDate}</strong>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Next Due: <strong className="text-emerald-700 dark:text-emerald-400">{vax.nextDueDate}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Dr. {vax.veterinarianName || vax.administeredBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4.2 DEWORMING TABLE */}
        {(filterTab === 'all' || filterTab === 'deworming' || filterTab === 'due') && (
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-purple-600" />
                Deworming Log ({filteredDewormings.length})
              </span>
              <button
                type="button"
                onClick={() => setIsDewormingModalOpen(true)}
                className="text-purple-600 dark:text-purple-400 hover:underline normal-case font-semibold"
              >
                + Record Deworming Dose
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDewormings.map((dew) => (
                <div
                  key={dew.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      💊
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {dew.petName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dew.status === 'Completed'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : dew.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {dew.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        {dew.drugUsed} ({dew.dosage})
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Active: {dew.activeIngredients}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Given: <strong className="text-slate-800 dark:text-slate-200">{dew.administeredDate}</strong>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Next Due: <strong className="text-purple-700 dark:text-purple-400">{dew.nextDueDate}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Dr. {dew.veterinarianName || dew.administeredBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: GIVE VACCINE */}
      {/* ========================================================================= */}
      {isVaccineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Administer Vaccine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record vaccine batch, route, and schedule next immunization booster.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVaccineModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGiveVaccine} className="space-y-4 text-xs">
              {/* Select Patient */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Patient *
                </label>
                <select
                  value={vaxPetId}
                  onChange={(e) => setVaxPetId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  required
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.species} ({p.breed}, {p.weight}kg) • Owner: {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Common Vaccine Presets */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Quick Select Common Vaccine:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_VACCINES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setVaxName(preset.name);
                        setVaxTarget(preset.target);
                        setVaxManufacturer(preset.manufacturer);
                        const d = new Date(vaxAdminDate);
                        d.setFullYear(d.getFullYear() + preset.intervalYears);
                        setVaxNextDueDate(d.toISOString().split('T')[0]);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        vaxName === preset.name
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.manufacturer}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vaccine Name & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Vaccine Product Name *
                  </label>
                  <input
                    type="text"
                    value={vaxName}
                    onChange={(e) => setVaxName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Pathogens / Diseases
                  </label>
                  <input
                    type="text"
                    value={vaxTarget}
                    onChange={(e) => setVaxTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Batch & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Batch / Lot Number *
                  </label>
                  <input
                    type="text"
                    value={vaxBatch}
                    onChange={(e) => setVaxBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={vaxManufacturer}
                    onChange={(e) => setVaxManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Route of Admin
                  </label>
                  <select
                    value={vaxRoute}
                    onChange={(e) => setVaxRoute(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Subcutaneous">Subcutaneous (SC)</option>
                    <option value="Intramuscular">Intramuscular (IM)</option>
                    <option value="Intranasal">Intranasal (IN)</option>
                    <option value="Oral">Oral</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Administered Date
                  </label>
                  <input
                    type="date"
                    value={vaxAdminDate}
                    onChange={(e) => setVaxAdminDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Next Due Date (Booster) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={vaxNextDueDate}
                      onChange={(e) => setVaxNextDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(vaxAdminDate);
                        d.setFullYear(d.getFullYear() + 1);
                        setVaxNextDueDate(d.toISOString().split('T')[0]);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold whitespace-nowrap"
                    >
                      +1 Yr
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(vaxAdminDate);
                        d.setFullYear(d.getFullYear() + 3);
                        setVaxNextDueDate(d.toISOString().split('T')[0]);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold whitespace-nowrap"
                    >
                      +3 Yrs
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical Notes & Injection Site
                </label>
                <input
                  type="text"
                  value={vaxNotes}
                  onChange={(e) => setVaxNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Injected in right hind limb. No adverse reaction observed."
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVaccineModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition-colors"
                >
                  Confirm & Give Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GIVE DEWORMING */}
      {/* ========================================================================= */}
      {isDewormingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Administer Deworming Dose
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record weight-based anthelmintic medication and schedule next prophylaxis.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDewormingModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGiveDeworming} className="space-y-4 text-xs">
              {/* Select Patient */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Patient *
                </label>
                <select
                  value={dewPetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setDewPetId(id);
                    const pet = pets.find((p) => p.id === id);
                    if (pet?.weight) {
                      setDewDosage(`${(pet.weight / 10).toFixed(1)} tablet(s) for ${pet.weight}kg`);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  required
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.species} ({p.weight} kg) • Owner: {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Common Dewormers */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Quick Select Common Anthelmintic:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_DEWORMERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setDewDrug(preset.name);
                        setDewIngredients(preset.ingredients);
                        const pet = pets.find((p) => p.id === dewPetId);
                        if (pet?.weight) {
                          setDewDosage(`${(pet.weight / 10).toFixed(1)} tablet(s) (${pet.weight}kg)`);
                        }
                        const d = new Date(dewAdminDate);
                        d.setMonth(d.getMonth() + preset.intervalMonths);
                        setDewNextDueDate(d.toISOString().split('T')[0]);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        dewDrug === preset.name
                          ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-400 text-purple-900 dark:text-purple-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.doseGuide}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drug Name & Active Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Drug Name *
                  </label>
                  <input
                    type="text"
                    value={dewDrug}
                    onChange={(e) => setDewDrug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Active Ingredients
                  </label>
                  <input
                    type="text"
                    value={dewIngredients}
                    onChange={(e) => setDewIngredients(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Dosage & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dosage Given *
                  </label>
                  <input
                    type="text"
                    value={dewDosage}
                    onChange={(e) => setDewDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. 1 Tablet (or 2.5 mL)"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Administered Date
                  </label>
                  <input
                    type="date"
                    value={dewAdminDate}
                    onChange={(e) => setDewAdminDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Next Due Date *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dewNextDueDate}
                      onChange={(e) => setDewNextDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(dewAdminDate);
                        d.setMonth(d.getMonth() + 3);
                        setDewNextDueDate(d.toISOString().split('T')[0]);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold whitespace-nowrap"
                    >
                      +3 Mo
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical Notes / Parasite Coverage
                </label>
                <input
                  type="text"
                  value={dewNotes}
                  onChange={(e) => setDewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Regular quarterly prophylactic deworming."
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDewormingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition-colors"
                >
                  Confirm & Give Deworming
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
