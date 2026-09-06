import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  PawPrint,
  Stethoscope,
  FileText,
  ShieldCheck,
  Phone,
  User,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { SpeciesBadge } from './AnimalIllustration';

export const PetQuickSearchModal: React.FC = () => {
  const {
    isPetSearchOpen,
    setIsPetSearchOpen,
    pets,
    setSelectedPetId,
    setAdminActiveTab,
    setCurrentSection,
    currentSection,
    showNotification,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPetSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSpeciesFilter('all');
    }
  }, [isPetSearchOpen]);

  // Filter pets by name, registration number, microchip, breed, owner name, phone
  const filteredPets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pets.filter((pet) => {
      const matchesSpecies = speciesFilter === 'all' || pet.species.toLowerCase() === speciesFilter.toLowerCase();
      if (!matchesSpecies) return false;

      if (!q) return true;

      const regNum = (pet.identificationNumber || '').toLowerCase();
      const petName = (pet.name || '').toLowerCase();
      const breed = (pet.breed || '').toLowerCase();
      const owner = (pet.ownerName || '').toLowerCase();
      const phone = (pet.ownerPhone || '').toLowerCase();
      const chip = (pet.microchipNumber || '').toLowerCase();

      return (
        petName.includes(q) ||
        regNum.includes(q) ||
        breed.includes(q) ||
        owner.includes(q) ||
        phone.includes(q) ||
        chip.includes(q)
      );
    });
  }, [pets, searchQuery, speciesFilter]);

  if (!isPetSearchOpen || currentSection === 'owner') return null;

  const handleSelectPet = (petId: string, targetAction: 'consultation' | 'patients' | 'prescription' | 'vaccines') => {
    setSelectedPetId(petId);
    setIsPetSearchOpen(false);

    if (currentSection === 'doctor') {
      if (targetAction === 'vaccines') {
        setAdminActiveTab('vaccines');
      } else {
        setAdminActiveTab(targetAction);
      }
    } else if (currentSection === 'admin') {
      if (targetAction === 'vaccines') {
        setAdminActiveTab('vaccination');
      } else {
        setAdminActiveTab(targetAction);
      }
    } else if (currentSection === 'super_admin') {
      showNotification(`Selected patient record: ${petId}`, 'info');
    }
  };

  return (
    <div
      id="pet-quick-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-xs transition-all animate-in fade-in duration-200"
      onClick={() => setIsPetSearchOpen(false)}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs shrink-0 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Universal Pet Search</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                  🐾 {pets.length} Registered Patients
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Search instantly by Pet Name, Registration ID (e.g. CAN-2026-001), Microchip, Breed, or Guardian.
              </p>
            </div>
          </div>

          <button
            id="close-pet-search-btn"
            onClick={() => setIsPetSearchOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Close Search (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input and Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type Pet Name or Registration Number (e.g., Charlie, CAN-2026-001, Luna)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Species Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Species 🐾' },
              { id: 'Dog', label: 'Canine / Dogs 🐶' },
              { id: 'Cat', label: 'Feline / Cats 🐱' },
              { id: 'Bird', label: 'Avian / Birds 🦜' },
              { id: 'Rabbit', label: 'Rabbits / Small 🐰' },
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSpeciesFilter(sp.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  speciesFilter.toLowerCase() === sp.id.toLowerCase()
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredPets.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No matching pets found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No animal profile matched "{searchQuery}". Check the registration number format (e.g. CAN-2026-001) or try searching by guardian name or breed.
              </p>
            </div>
          ) : (
            filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="pt-2.5 first:pt-0 p-3 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Pet Identity & Vital Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={
                      pet.photo && pet.photo.trim() !== ''
                        ? pet.photo
                        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={pet.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {pet.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[11px] font-mono font-bold text-teal-700 dark:text-teal-300">
                        {pet.identificationNumber || 'CAN-2026-001'}
                      </span>
                      <SpeciesBadge species={pet.species} />
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        <strong className="text-slate-700 dark:text-slate-300">Breed:</strong> {pet.breed}
                      </span>
                      <span>
                        <strong className="text-slate-700 dark:text-slate-300">Age:</strong> {pet.age}
                      </span>
                      <span>
                        <strong className="text-slate-700 dark:text-slate-300">Weight:</strong> {pet.weight} kg
                      </span>
                      {pet.microchipNumber && (
                        <span className="font-mono text-[11px] text-slate-500">
                          Chip: {pet.microchipNumber}
                        </span>
                      )}
                    </div>

                    {/* Owner Attribution */}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <User className="w-3 h-3 text-teal-600" /> {pet.ownerName}
                      </span>
                      {pet.ownerPhone && (
                        <span className="flex items-center gap-1 text-slate-500 font-mono">
                          <Phone className="w-3 h-3" /> {pet.ownerPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action CTAs */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleSelectPet(pet.id, 'consultation')}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Examine & Start SOAP Consultation"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Examine</span>
                  </button>

                  <button
                    onClick={() => handleSelectPet(pet.id, 'patients')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                    title="Open Full Dossier"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>

                  <button
                    onClick={() => handleSelectPet(pet.id, 'prescription')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                    title="Write Prescription"
                  >
                    <span>💊 Rx</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All veterinary doctors have immediate access to complete hospital pet dossiers.</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
