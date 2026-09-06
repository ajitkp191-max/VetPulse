import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PetRecord, SpeciesType } from '../../types';
import { generateAnimalRegistrationNumber } from '../../utils/petRegistration';
import {
  Heart,
  PlusCircle,
  ShieldCheck,
  FileText,
  X,
  Phone,
  User,
  MapPin,
  Mail,
  Sparkles,
  RefreshCw,
  Activity,
  Calendar,
  Edit3,
  Scale,
  Save,
} from 'lucide-react';
import { AnimalAvatar, SpeciesBadge } from '../common/AnimalIllustration';

interface MyPetsDossierProps {
  onNavigateTab: (tab: any) => void;
}

export const MyPetsDossier: React.FC<MyPetsDossierProps> = ({ onNavigateTab }) => {
  const {
    ownerPets,
    selectedPetId,
    setSelectedPetId,
    addPet,
    updatePet,
    showNotification,
    ownerProfile,
    ownerVaccinations,
    ownerConsultations,
    ownerPrescriptions,
  } = useApp();

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<PetRecord | null>(null);

  // Edit form state
  const [editAge, setEditAge] = useState('');
  const [editWeight, setEditWeight] = useState<number | string>('');
  const [editBreed, setEditBreed] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editAllergies, setEditAllergies] = useState('');

  // Form State for new pet
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<SpeciesType>('Canine (Dog)');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('2 Years');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Neutered Male' | 'Spayed Female'>('Neutered Male');
  const [weight, setWeight] = useState(12.5);
  const [color, setColor] = useState('Golden / White');
  const [allergies, setAllergies] = useState('None known');
  
  // Registration Number & Owner Contact Information
  const [regNumber, setRegNumber] = useState(() => generateAnimalRegistrationNumber('Canine (Dog)'));
  const [ownerName, setOwnerName] = useState(ownerProfile?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(ownerProfile?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(ownerProfile?.email || '');
  const [ownerAddress, setOwnerAddress] = useState(ownerProfile?.address || '');

  // Keep form initialized with active owner details
  useEffect(() => {
    if (ownerProfile) {
      if (ownerProfile.name) setOwnerName(ownerProfile.name);
      if (ownerProfile.phone) setOwnerPhone(ownerProfile.phone);
      if (ownerProfile.email) setOwnerEmail(ownerProfile.email);
      if (ownerProfile.address) setOwnerAddress(ownerProfile.address);
    }
  }, [ownerProfile]);

  // Update default animal-specific registration number when species changes
  useEffect(() => {
    setRegNumber(generateAnimalRegistrationNumber(species));
  }, [species]);

  const openEditPetModal = (pet: PetRecord) => {
    setPetToEdit(pet);
    setEditAge(pet.age);
    setEditWeight(pet.weight);
    setEditBreed(pet.breed);
    setEditColor(pet.color || '');
    setEditAllergies(pet.allergies?.join(', ') || '');
  };

  const handleSavePetEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petToEdit) return;
    const parsedWeight = parseFloat(String(editWeight));
    updatePet(petToEdit.id, {
      age: editAge.trim() || petToEdit.age,
      weight: !isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : petToEdit.weight,
      breed: editBreed.trim() || petToEdit.breed,
      color: editColor.trim() || petToEdit.color,
      allergies: editAllergies.trim() ? [editAllergies.trim()] : [],
    });
    showNotification(`Updated ${petToEdit.name}'s weight (${editWeight} kg) & age (${editAge})`, 'success');
    setPetToEdit(null);
  };

  const selectedPet = ownerPets.find((p) => p.id === selectedPetId) || ownerPets[0];
  const petVaccines = ownerVaccinations.filter((v) => v.petId === selectedPet?.id);
  const petConsults = ownerConsultations.filter((c) => c.petId === selectedPet?.id);

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assignedRegNo = regNumber || generateAnimalRegistrationNumber(species);

    addPet({
      name: name.trim(),
      species,
      breed: breed.trim() || 'Domestic Mix',
      age,
      dob: '2023-01-01',
      sex: gender,
      weight: Number(weight) || 5.0,
      color: color || 'Standard',
      identificationNumber: assignedRegNo,
      photo: species === 'Canine (Dog)'
        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
        : species === 'Feline (Cat)'
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500'
        : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500',
      ownerId: ownerProfile?.id,
      ownerName: ownerName.trim() || ownerProfile?.name || 'Pet Parent',
      ownerPhone: ownerPhone.trim() || ownerProfile?.phone || '+1 (555) 234-5678',
      ownerEmail: ownerEmail.trim() || ownerProfile?.email || 'owner@portal.com',
      ownerAddress: ownerAddress.trim() || ownerProfile?.address || 'Metro City',
      allergies: allergies ? [allergies] : [],
      previousDiseases: [],
      previousSurgeries: [],
      bloodType: species === 'Canine (Dog)' ? 'DEA 1.1' : 'Type A',
      isInsured: true,
    });

    setIsAddPetModalOpen(false);
    setName('');
    setBreed('');
    setRegNumber(generateAnimalRegistrationNumber(species));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-2xl">
            <Heart className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              My Registered Companions & Pet Dossiers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each animal is assigned an official species-specific registration code with complete owner contact details.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setRegNumber(generateAnimalRegistrationNumber(species));
            setIsAddPetModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Companion</span>
        </button>
      </div>

      {/* Grid: Pet List Left, Active Pet History Right */}
      {ownerPets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-3xl w-fit mx-auto text-amber-500">
            <Heart className="w-10 h-10" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No Companion Animals Registered
            </h3>
            <p className="text-xs text-slate-500">
              You are signed in as <strong className="text-slate-700 dark:text-slate-300">{ownerProfile?.name || 'Pet Parent'}</strong> ({ownerProfile?.email || ''}). Any animal you register will be permanently tied to your profile and isolated from other users.
            </p>
          </div>
          <button
            onClick={() => {
              setRegNumber(generateAnimalRegistrationNumber(species));
              setIsAddPetModalOpen(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md inline-flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Your First Companion</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pets List */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>My Registered Animals ({ownerPets.length})</span>
              <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">Select to View</span>
            </h4>

            {ownerPets.map((pet) => {
              const isSelected = pet.id === selectedPet?.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="shrink-0">
                    <AnimalAvatar species={pet.species} size="md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {pet.name}
                      </h4>
                      <SpeciesBadge species={pet.species} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {pet.breed} • {pet.age}
                    </p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                        Reg: {pet.identificationNumber || 'CAN-2026-001'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {pet.weight} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        {/* Right Active Pet Full Medical Dossier */}
        {selectedPet && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <AnimalAvatar species={selectedPet.species} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedPet.name}
                    </h3>
                    <SpeciesBadge species={selectedPet.species} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedPet.gender || selectedPet.sex} • {selectedPet.breed} • Age: {selectedPet.age}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300">
                    <span>Animal Reg #: {selectedPet.identificationNumber || 'VET-2026-REG'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditPetModal(selectedPet)}
                  className="bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                  title="Update Pet Body Weight and Age"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Edit Weight & Age</span>
                </button>
                <button
                  onClick={() => onNavigateTab('book-appointment')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

            {/* Registered Owner Contact & Address Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Registered Guardian / Owner Information</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Verified Contact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Owner Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPet.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Contact Phone & Email</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{selectedPet.ownerPhone}</span>
                  <span className="text-slate-500 text-[11px] block truncate">{selectedPet.ownerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Residential Address</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPet.ownerAddress}</span>
                </div>
              </div>
            </div>

            {/* Vitals & Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 block">Body Weight</span>
                  <button
                    onClick={() => openEditPetModal(selectedPet)}
                    className="text-amber-600 dark:text-amber-400 hover:underline text-[10px] font-semibold flex items-center gap-0.5"
                    title="Edit Weight"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPet.weight} kg</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Coat Color</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPet.color || 'Standard'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Blood Type</span>
                <span className="font-bold text-teal-700 dark:text-teal-300 font-mono text-[11px] truncate block">
                  {selectedPet.bloodType || 'DEA 1.1 Negative'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Known Allergies</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-[11px] truncate block">
                  {selectedPet.allergies?.join(', ') || 'None reported'}
                </span>
              </div>
            </div>

            {/* Medical History Tabs Summary */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lifetime Medical Records & Timeline
              </h4>

              <div className="space-y-3 text-xs">
                {/* Consultations */}
                <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Clinical Consultations ({petConsults.length})</span>
                    </span>
                  </div>
                  {petConsults.length === 0 ? (
                    <p className="text-[11px] text-slate-400">No clinical exams recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {petConsults.map((c) => (
                        <div key={c.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-900 dark:text-white font-bold">🩺 Dx: {c.diagnosis}</span>
                            <span className="text-[10px] text-slate-400">{c.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">💊 Tx: {c.treatmentPlan}</p>
                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-teal-700 dark:text-teal-300 font-medium">
                              Attending: Dr. {c.veterinarianName || 'Attending Clinician'}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              Reg: {c.vetRegNumber || 'VET-REG-2024'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vaccines */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Vaccinations & Immunizations ({petVaccines.length})</span>
                    </span>
                  </div>
                  {petVaccines.length === 0 ? (
                    <p className="text-[11px] text-slate-400">No vaccine certificates on file.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {petVaccines.map((v) => (
                        <div key={v.id} className="p-2 bg-white dark:bg-slate-900 rounded-xl border flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{v.vaccineName}</span>
                            <span className="text-[10px] text-slate-400 ml-2">Batch: {v.batchNumber}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">Next: {v.nextDueDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* REGISTER NEW PET MODAL WITH DEFAULT REGISTRATION NUMBER & OWNER CONTACT */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Register Companion Animal</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Assigns an animal-specific default registration number and links owner address/contact.
                </p>
              </div>
              <button
                onClick={() => setIsAddPetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4 pt-3 text-xs">
              {/* Auto-assigned default registration number banner */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      Default Animal-Specific Registration Number:
                    </span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                      {regNumber}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRegNumber(generateAnimalRegistrationNumber(species))}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Animal Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800">
                  1. Companion Animal Identification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Companion's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Milo / Charlie"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Species *
                    </label>
                    <select
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Canine (Dog)">Canine (Dog)</option>
                      <option value="Feline (Cat)">Feline (Cat)</option>
                      <option value="Equine (Horse)">Equine (Horse)</option>
                      <option value="Bovine (Cattle)">Bovine (Cattle)</option>
                      <option value="Avian (Bird)">Avian (Bird)</option>
                      <option value="Small Mammal">Small Mammal / Rabbit</option>
                      <option value="Reptile">Reptile</option>
                      <option value="Other">Other Species</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Breed</label>
                    <input
                      type="text"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 2 Years 4 Months"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="Neutered Male">Neutered Male</option>
                      <option value="Spayed Female">Spayed Female</option>
                      <option value="Male">Intact Male</option>
                      <option value="Female">Intact Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Coat Color</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Golden / Tri-color"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Contact and Residential Address */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>2. Owner Contact & Residential Address</span>
                  <span className="text-[10px] text-amber-600 font-semibold lowercase">linked to owner record</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Guardian / Owner Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Owner Name"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Owner Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Owner Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="owner@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Residential / Postal Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
                        placeholder="Street, City, Postal Code"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Complete Animal Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pet Body Weight & Age Modal (For Pet Owner) */}
      {petToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 rounded-2xl">
                  <Scale className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Update {petToEdit.name}'s Details
                  </h3>
                  <p className="text-xs text-slate-500">Edit Body Weight & Age (Owner Portal)</p>
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
                    Body Weight (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="150"
                      required
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pet Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Years 3 Months"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={editBreed}
                  onChange={(e) => setEditBreed(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Coat Color
                  </label>
                  <input
                    type="text"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    placeholder="None, or specify"
                    value={editAllergies}
                    onChange={(e) => setEditAllergies(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
                💡 Keeping weight and age accurate ensures proper clinical dosage calculations during prescriptions and veterinary consultations.
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
