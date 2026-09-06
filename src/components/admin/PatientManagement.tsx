import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PetRecord, SpeciesType } from '../../types';
import {
  Users,
  Search,
  PlusCircle,
  Filter,
  FileText,
  Activity,
  ShieldCheck,
  Bug,
  Scan,
  FlaskConical,
  Upload,
  Calendar,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  X,
  CheckCircle2,
  ChevronRight,
  Heart,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { SpeciesBadge, AnimalIllustration } from '../common/AnimalIllustration';
import { generateAnimalRegistrationNumber } from '../../utils/petRegistration';

export const PatientManagement: React.FC = () => {
  const {
    currentSection,
    pets,
    addPet,
    updatePet,
    deletePet,
    selectedPetId,
    setSelectedPetId,
    consultations,
    labReports,
    imagingRecords,
    ecgRecords,
    vaccinations,
    dewormings,
    prescriptions,
    setAdminActiveTab,
    showNotification,
  } = useApp();

  const isSuperAdmin = currentSection === 'super_admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<PetRecord | null>(null);
  const [petToEdit, setPetToEdit] = useState<PetRecord | null>(null);
  const [editWeight, setEditWeight] = useState<number | string>('');
  const [editAge, setEditAge] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'overview' | 'consultations' | 'labs' | 'imaging' | 'ecg' | 'vaccines' | 'deworming' | 'prescriptions' | 'documents'>('overview');

  const handleOpenEditPet = (pet: PetRecord) => {
    setPetToEdit(pet);
    setEditWeight(pet.weight);
    setEditAge(pet.age);
    setEditBreed(pet.breed);
  };

  const handleSavePetEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petToEdit) return;
    const parsedWeight = parseFloat(String(editWeight));
    updatePet(petToEdit.id, {
      weight: !isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : petToEdit.weight,
      age: editAge.trim() || petToEdit.age,
      breed: editBreed.trim() || petToEdit.breed,
    });
    showNotification(`Doctor updated ${petToEdit.name}'s weight (${editWeight} kg) & age (${editAge})`, 'success');
    setPetToEdit(null);
  };

  // New Pet Form State
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Canine (Dog)' as SpeciesType,
    breed: '',
    sex: 'Neutered Male' as PetRecord['sex'],
    dob: '2022-01-01',
    age: '4 yrs',
    weight: 12.0,
    color: '',
    identificationNumber: generateAnimalRegistrationNumber('Canine (Dog)'),
    microchipNumber: '',
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    allergies: '',
    previousDiseases: '',
    previousSurgeries: '',
    bloodType: 'DEA 1.1 Negative',
    isInsured: true,
  });

  const filteredPets = pets.filter((pet) => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (pet.name || '').toLowerCase().includes(term) ||
      (pet.ownerName || '').toLowerCase().includes(term) ||
      (pet.identificationNumber || '').toLowerCase().includes(term) ||
      (pet.breed || '').toLowerCase().includes(term);
    const matchesSpecies = speciesFilter === 'All' || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // Medical records associated with active pet
  const petConsultations = consultations.filter((c) => c.petId === currentPet?.id);
  const petLabs = labReports.filter((l) => l.petId === currentPet?.id);
  const petImaging = imagingRecords.filter((i) => i.petId === currentPet?.id);
  const petECGs = ecgRecords.filter((e) => e.petId === currentPet?.id);
  const petVaccines = vaccinations.filter((v) => v.petId === currentPet?.id);
  const petDewormings = dewormings.filter((d) => d.petId === currentPet?.id);
  const petPrescriptions = prescriptions.filter((p) => p.petId === currentPet?.id);

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !newPet.ownerName) {
      showNotification('Please enter Animal Name and Owner Name', 'error');
      return;
    }

    addPet({
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed || 'Mixed Breed',
      sex: newPet.sex,
      dob: newPet.dob,
      age: newPet.age || 'Adult',
      weight: Number(newPet.weight) || 5,
      color: newPet.color || 'Standard',
      identificationNumber: newPet.identificationNumber,
      microchipNumber: newPet.microchipNumber,
      photo: newPet.photo,
      ownerName: newPet.ownerName,
      ownerPhone: newPet.ownerPhone,
      ownerEmail: newPet.ownerEmail,
      ownerAddress: newPet.ownerAddress,
      allergies: newPet.allergies ? newPet.allergies.split(',').map((s) => s.trim()) : [],
      previousDiseases: newPet.previousDiseases ? newPet.previousDiseases.split(',').map((s) => s.trim()) : [],
      previousSurgeries: newPet.previousSurgeries ? newPet.previousSurgeries.split(',').map((s) => s.trim()) : [],
      bloodType: newPet.bloodType,
      isInsured: newPet.isInsured,
    });

    setIsAddModalOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Patient & Animal Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, search, and maintain complete clinical veterinary health dossiers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Animal</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by animal name, owner, registration ID, or breed..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Species ({pets.length})</option>
            <option value="Canine (Dog)">Canine (Dogs)</option>
            <option value="Feline (Cat)">Feline (Cats)</option>
            <option value="Equine (Horse)">Equine (Horses)</option>
            <option value="Avian (Bird)">Avian (Birds)</option>
            <option value="Bovine (Cattle)">Bovine (Cattle)</option>
          </select>
        </div>
      </div>

      {/* Patient Grid & Profile Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Patients */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredPets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              No matching animal records found.
            </div>
          ) : (
            filteredPets.map((pet) => {
              const isSelected = pet.id === currentPet?.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {pet.photo && pet.photo.trim() !== '' ? (
                      <img
                        src={pet.photo}
                        alt={pet.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 border border-slate-200 dark:border-slate-700">
                        <AnimalIllustration species={pet.species} className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {pet.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{pet.identificationNumber.split('-').pop()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {pet.breed} • {pet.age}
                      </p>
                      <p className="text-[10px] text-teal-700 dark:text-teal-300 font-medium truncate">
                        Owner: {pet.ownerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      title={isSuperAdmin ? "Super Admin: Delete Pet Record" : "Deletion restricted to Super Admin"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSuperAdmin) {
                          showNotification('🔒 Restricted: Doctor & Clinic Manager cannot delete registered pets. Only Super Admin has deletion rights.', 'error');
                          return;
                        }
                        setPetToDelete(pet);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        isSuperAdmin
                          ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 opacity-80 group-hover:opacity-100'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Active Patient Dossier */}
        {currentPet && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Dossier Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {currentPet.photo && currentPet.photo.trim() !== '' ? (
                    <img
                      src={currentPet.photo}
                      alt={currentPet.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-400 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-2 border-teal-400 shadow-md shrink-0 flex items-center justify-center bg-slate-800 text-teal-300">
                      <AnimalIllustration species={currentPet.species} className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold tracking-tight">{currentPet.name}</h3>
                      <SpeciesBadge species={currentPet.species} />
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {currentPet.breed} • {currentPet.sex} • {currentPet.weight} kg
                    </p>
                    <p className="text-[11px] text-teal-300 font-mono mt-1">
                      Registration ID: {currentPet.identificationNumber}
                    </p>
                  </div>
                </div>

                {/* Quick Dossier Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenEditPet(currentPet)}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    title="Doctor Edit Body Weight and Age"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit Weight & Age</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPetId(currentPet.id);
                      setAdminActiveTab('history-taking');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Take History</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPetId(currentPet.id);
                      setAdminActiveTab('consultation');
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Clinical Consultation</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPetId(currentPet.id);
                      setAdminActiveTab('prescription');
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Write / Upload Rx</span>
                  </button>

                  <button
                    title={isSuperAdmin ? "Super Admin: Delete Registered Pet Record" : "Deletion restricted to Super Admin"}
                    onClick={() => {
                      if (!isSuperAdmin) {
                        showNotification('🔒 Restricted: Doctor & Clinic Manager cannot delete registered pets. Only Super Admin has deletion rights.', 'error');
                        return;
                      }
                      setPetToDelete(currentPet);
                    }}
                    className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs border ${
                      isSuperAdmin
                        ? 'text-red-300 hover:text-red-100 hover:bg-red-500/20 border-red-500/30'
                        : 'text-slate-400 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline font-semibold">{isSuperAdmin ? 'Delete Pet' : 'Delete (Restricted)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Medical History Sub-Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 overflow-x-auto no-scrollbar text-xs font-semibold">
              {[
                { id: 'overview', label: 'Basic Info & Vitals' },
                { id: 'consultations', label: `Consultations (${petConsultations.length})` },
                { id: 'labs', label: `Lab Reports (${petLabs.length})` },
                { id: 'imaging', label: `Imaging (${petImaging.length})` },
                { id: 'ecg', label: `ECG Traces (${petECGs.length})` },
                { id: 'vaccines', label: `Vaccines (${petVaccines.length})` },
                { id: 'deworming', label: `Deworming (${petDewormings.length})` },
                { id: 'prescriptions', label: `Prescriptions (${petPrescriptions.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveHistoryTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all ${
                    activeHistoryTab === tab.id
                      ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-bold bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab Contents */}
            <div className="p-6">
              {/* 1. OVERVIEW & BASIC INFO */}
              {activeHistoryTab === 'overview' && (
                <div className="space-y-6">
                  {/* Basic Vitals Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Animal Biological Attributes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">Date of Birth</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPet.dob}</div>
                        <span className="text-[10px] text-teal-600 font-medium">({currentPet.age})</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">Body Weight</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPet.weight} kg</div>
                        <span className="text-[10px] text-slate-400">{((Number(currentPet?.weight) || 0) * 2.20462).toFixed(1)} lbs</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">Coat Color / Marking</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPet.color || 'N/A'}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">Blood Type</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPet.bloodType || 'Unchecked'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Contact Information */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Owner & Guardian Information
                    </h4>
                    <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Full Name:</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentPet.ownerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Contact Phone:</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-teal-600" />
                          <span>{currentPet.ownerPhone}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Email & Address:</span>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{currentPet.ownerEmail}</div>
                        <div className="text-[10px] text-slate-500 truncate">{currentPet.ownerAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Flags: Allergies, Previous Diseases, Surgeries */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                      <span className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wider">
                        Known Allergies
                      </span>
                      <div className="mt-2 space-y-1">
                        {currentPet.allergies && currentPet.allergies.length > 0 ? (
                          currentPet.allergies.map((allergy, idx) => (
                            <span key={idx} className="inline-block bg-white dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[11px] font-semibold px-2 py-0.5 rounded-md mr-1 mb-1 border border-red-200 dark:border-red-700">
                              ⚠️ {allergy}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No known drug/food allergies.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        Previous Diseases
                      </span>
                      <div className="mt-2 space-y-1 text-xs text-amber-900 dark:text-amber-200">
                        {currentPet.previousDiseases && currentPet.previousDiseases.length > 0 ? (
                          currentPet.previousDiseases.map((d, idx) => <p key={idx}>• {d}</p>)
                        ) : (
                          <span className="text-slate-400">None on record</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                        Surgical History
                      </span>
                      <div className="mt-2 space-y-1 text-xs text-purple-900 dark:text-purple-200">
                        {currentPet.previousSurgeries && currentPet.previousSurgeries.length > 0 ? (
                          currentPet.previousSurgeries.map((s, idx) => <p key={idx}>• {s}</p>)
                        ) : (
                          <span className="text-slate-400">No previous major surgeries</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CONSULTATIONS HISTORY */}
              {activeHistoryTab === 'consultations' && (
                <div className="space-y-3">
                  {petConsultations.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No consultation records yet.</div>
                  ) : (
                    petConsultations.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Date: {c.date}</span>
                          <span className="text-[10px] text-teal-600 font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950">
                            {c.veterinarianName}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-teal-700 dark:text-teal-300">
                          Provisional Diagnosis: {c.provisionalDiagnosis}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <strong>Chief Complaint:</strong> {c.chiefComplaint} ({c.duration})
                        </p>
                        <div className="mt-2 p-2 rounded-xl bg-white dark:bg-slate-900 text-[11px] text-slate-500 border border-slate-100 dark:border-slate-800">
                          <strong>Treatment Plan:</strong> {c.treatmentPlan}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. LAB REPORTS */}
              {activeHistoryTab === 'labs' && (
                <div className="space-y-3">
                  {petLabs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No laboratory test panels recorded for this patient.</div>
                  ) : (
                    petLabs.map((lab) => (
                      <div key={lab.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-teal-600" />
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{lab.testType}</h5>
                          </div>
                          <span className="text-[10px] text-slate-400">{lab.date}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                          {lab.parameters.map((param, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px]">
                              <span className="text-slate-400 block truncate">{param.name}</span>
                              <span className="font-bold text-slate-900 dark:text-white">{param.value} {param.unit}</span>
                              <span className="text-[9px] text-emerald-600 block">Ref: {param.referenceRange}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <strong>Interpretation:</strong> {lab.interpretation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 4. IMAGING RECORDS */}
              {activeHistoryTab === 'imaging' && (
                <div className="space-y-4">
                  {petImaging.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No radiographs or ultrasound images logged yet.</div>
                  ) : (
                    petImaging.map((img) => (
                      <div key={img.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row gap-4">
                        {img.imageUrl && img.imageUrl.trim() !== '' ? (
                          <img
                            src={img.imageUrl}
                            alt={img.modality}
                            className="w-full sm:w-44 h-36 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-full sm:w-44 h-36 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400 font-mono text-xs shrink-0">
                            {img.modality}
                          </div>
                        )}
                        <div className="space-y-1.5 flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-teal-700 dark:text-teal-300">{img.modality}</span>
                            <span className="text-[10px] text-slate-400">{img.date}</span>
                          </div>
                          <p className="font-semibold text-slate-900 dark:text-white">Region: {img.anatomicalRegion}</p>
                          <div className="text-slate-600 dark:text-slate-300 space-y-0.5">
                            {Array.isArray(img.findings) ? (
                              img.findings.map((f, i) => (
                                <p key={i}>• {f}</p>
                              ))
                            ) : img.findings ? (
                              <p>• {String(img.findings)}</p>
                            ) : (
                              <p className="text-slate-400 italic">No specific findings logged.</p>
                            )}
                          </div>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                            <strong>Interpretation:</strong> {img.interpretation}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 5. ECG RECORDS */}
              {activeHistoryTab === 'ecg' && (
                <div className="space-y-3">
                  {petECGs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No ECG rhythm strips captured for this animal yet.</div>
                  ) : (
                    petECGs.map((ecg) => (
                      <div key={ecg.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-rose-500" />
                            <span>ECG Tracing (Heart Rate: {ecg.heartRate} bpm)</span>
                          </span>
                          <span className="text-[10px] text-slate-400">{ecg.date}</span>
                        </div>
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                          Rhythm: {ecg.rhythm}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div className="p-2 rounded bg-white dark:bg-slate-900">P-Wave: {ecg.pWave}</div>
                          <div className="p-2 rounded bg-white dark:bg-slate-900">PR: {ecg.prInterval}</div>
                          <div className="p-2 rounded bg-white dark:bg-slate-900">QRS: {ecg.qrsDuration}</div>
                          <div className="p-2 rounded bg-white dark:bg-slate-900">Axis: {ecg.electricalAxis}</div>
                        </div>
                        {ecg.aiDiagnosticReport && (
                          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200">
                            <strong>AI Cardiology Review:</strong> {ecg.aiDiagnosticReport}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 6. VACCINES */}
              {activeHistoryTab === 'vaccines' && (
                <div className="space-y-2.5">
                  {petVaccines.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No vaccination records available.</div>
                  ) : (
                    petVaccines.map((v) => (
                      <div key={v.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">{v.vaccineName}</h5>
                          <p className="text-[10px] text-slate-400">Batch: {v.batchNumber} • Given: {v.administeredDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {v.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Next Due: {v.nextDueDate}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 7. DEWORMING */}
              {activeHistoryTab === 'deworming' && (
                <div className="space-y-2.5">
                  {petDewormings.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No deworming treatments logged.</div>
                  ) : (
                    petDewormings.map((d) => (
                      <div key={d.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">{d.drugUsed}</h5>
                          <p className="text-[10px] text-slate-400">Dosage: {d.dosage} • Administered: {d.administeredDate}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            {d.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Next Due: {d.nextDueDate}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 8. PRESCRIPTIONS */}
              {activeHistoryTab === 'prescriptions' && (
                <div className="space-y-3">
                  {petPrescriptions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No prescriptions generated yet.</div>
                  ) : (
                    petPrescriptions.map((rx) => (
                      <div key={rx.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-700 dark:text-teal-300">Rx #{rx.prescriptionNumber}</span>
                          <span className="text-[10px] text-slate-400">{rx.date}</span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white">Diagnosis: {rx.diagnosis}</p>
                        <div className="space-y-1 pt-1">
                          {rx.items.map((item, i) => (
                            <div key={i} className="p-2 rounded bg-white dark:bg-slate-900 text-[11px] flex justify-between">
                              <span><strong>{item.medicineName}</strong> - {item.dosage}</span>
                              <span className="text-slate-400">{item.frequency} ({item.duration})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW ANIMAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Register New Animal / Patient</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4 pt-4 text-xs">
              {/* Auto-assigned default registration number banner */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      Default Animal-Specific Registration Code:
                    </span>
                    <span className="font-mono font-black text-teal-700 dark:text-teal-300 text-sm">
                      {newPet.identificationNumber}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewPet({ ...newPet, identificationNumber: generateAnimalRegistrationNumber(newPet.species) })}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Animal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="e.g. Oscar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Species *
                  </label>
                  <select
                    value={newPet.species}
                    onChange={(e) => {
                      const selectedSpecies = e.target.value as SpeciesType;
                      setNewPet({
                        ...newPet,
                        species: selectedSpecies,
                        identificationNumber: generateAnimalRegistrationNumber(selectedSpecies),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Canine (Dog)">Canine (Dog)</option>
                    <option value="Feline (Cat)">Feline (Cat)</option>
                    <option value="Equine (Horse)">Equine (Horse)</option>
                    <option value="Bovine (Cattle)">Bovine (Cattle)</option>
                    <option value="Avian (Bird)">Avian (Bird)</option>
                    <option value="Small Mammal">Small Mammal (Rabbit/Hamster)</option>
                    <option value="Reptile">Reptile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="e.g. Labrador Retriever"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Sex
                  </label>
                  <select
                    value={newPet.sex}
                    onChange={(e) => setNewPet({ ...newPet, sex: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Neutered Male">Neutered Male</option>
                    <option value="Spayed Female">Spayed Female</option>
                    <option value="Male">Intact Male</option>
                    <option value="Female">Intact Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Body Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPet.weight}
                    onChange={(e) => setNewPet({ ...newPet, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newPet.dob}
                    onChange={(e) => setNewPet({ ...newPet, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Age String
                  </label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="e.g. 2 yrs 3 mos"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Owner Info Section */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Pet Parent / Owner Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={newPet.ownerName}
                      onChange={(e) => setNewPet({ ...newPet, ownerName: e.target.value })}
                      placeholder="Pet Owner Name"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Owner Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={newPet.ownerPhone}
                      onChange={(e) => setNewPet({ ...newPet, ownerPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Owner Email</label>
                    <input
                      type="email"
                      value={newPet.ownerEmail}
                      onChange={(e) => setNewPet({ ...newPet, ownerEmail: e.target.value })}
                      placeholder="owner@example.com"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Address</label>
                    <input
                      type="text"
                      value={newPet.ownerAddress}
                      onChange={(e) => setNewPet({ ...newPet, ownerAddress: e.target.value })}
                      placeholder="City, State"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Animal Photograph
                </label>
                <div className="flex items-center gap-3">
                  {newPet.photo && newPet.photo.trim() !== '' ? (
                    <img src={newPet.photo} alt="Preview" className="w-12 h-12 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-dashed flex items-center justify-center text-slate-400 text-[9px] bg-slate-50 dark:bg-slate-800">
                      No Photo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Save Animal Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Admin Pet Deletion Confirmation Modal */}
      {petToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/50 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Patient Deletion
                </h3>
                <p className="text-xs text-red-500 font-medium">Administrator Privilege</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                {petToDelete.photo && petToDelete.photo.trim() !== '' ? (
                  <img
                    src={petToDelete.photo}
                    alt={petToDelete.name}
                    className="w-12 h-12 rounded-xl object-cover border shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-500 shrink-0 border border-slate-200 dark:border-slate-700">
                    <AnimalIllustration species={petToDelete.species} className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {petToDelete.name}
                  </div>
                  <div className="text-slate-500">
                    {petToDelete.species} • {petToDelete.breed}
                  </div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    ID: {petToDelete.identificationNumber}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <span>Owner: <strong>{petToDelete.ownerName}</strong> ({petToDelete.ownerPhone})</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this animal patient from the registered database and Google Firebase? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPetToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePet(petToDelete.id);
                  setPetToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete Pet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Edit Pet Weight & Age Modal */}
      {petToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 rounded-2xl">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Update Clinical Vitals: {petToEdit.name}
                  </h3>
                  <p className="text-xs text-slate-500">Doctor / Veterinary Station Edit</p>
                </div>
              </div>
              <button
                onClick={() => setPetToEdit(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePetEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Measured Body Weight (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="200"
                      required
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Years 2 Months"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Breed Specifier
                </label>
                <input
                  type="text"
                  value={editBreed}
                  onChange={(e) => setEditBreed(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-teal-50/70 dark:bg-teal-950/30 rounded-xl border border-teal-200/60 dark:border-teal-900/40 text-[11px] text-teal-800 dark:text-teal-300">
                🩺 Updating body weight immediately calibrates milligram-per-kilogram dosage calculations for all subsequent prescriptions and fluid therapy rates.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPetToEdit(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Patient Vitals</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
