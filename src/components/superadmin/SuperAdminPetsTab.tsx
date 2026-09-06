import React, { useState } from 'react';
import { PetRecord, SpeciesType } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { EditPetModal } from './EditPetModal';

const SPECIES_ICONS: Record<string, string> = {
  'Canine (Dog)': '🐶',
  'Feline (Cat)': '🐱',
  'Equine (Horse)': '🐴',
  'Bovine (Cattle)': '🐄',
  'Avian (Bird)': '🦜',
  'Small Mammal': '🐰',
  'Reptile': '🦎',
  'Other': '🐾',
};

export const SuperAdminPetsTab: React.FC = () => {
  const { pets, deletePet, showNotification, consultations, vaccinations, dewormings, prescriptions } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [selectedPetToEdit, setSelectedPetToEdit] = useState<PetRecord | null>(null);
  const [selectedPetForModal, setSelectedPetForModal] = useState<PetRecord | null>(null);
  const [petToDelete, setPetToDelete] = useState<PetRecord | null>(null);

  // Filtered Pets
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.identificationNumber && pet.identificationNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.microchipNumber && pet.microchipNumber.includes(searchTerm)) ||
      (pet.ownerName && pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.ownerPhone && pet.ownerPhone.includes(searchTerm)) ||
      (pet.ownerEmail && pet.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;

    return matchesSearch && matchesSpecies;
  });

  const getPetStats = (petId: string) => {
    const cons = consultations.filter((c) => c.petId === petId).length;
    const vax = vaccinations.filter((v) => v.petId === petId).length;
    const dew = dewormings.filter((d) => d.petId === petId).length;
    const rx = prescriptions.filter((p) => p.petId === petId).length;
    return { cons, vax, dew, rx };
  };

  const handleDeleteConfirm = () => {
    if (petToDelete) {
      deletePet(petToDelete.id);
      showNotification(`Pet record for "${petToDelete.name}" permanently deleted.`, 'info');
      setPetToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & filters */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pets by name, reg #, breed, microchip, owner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Species:</span>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Species ({pets.length})</option>
            <option value="Canine (Dog)">🐶 Canine (Dog)</option>
            <option value="Feline (Cat)">🐱 Feline (Cat)</option>
            <option value="Equine (Horse)">🐴 Equine (Horse)</option>
            <option value="Bovine (Cattle)">🐄 Bovine (Cattle)</option>
            <option value="Avian (Bird)">🦜 Avian (Bird)</option>
            <option value="Small Mammal">🐰 Small Mammal</option>
            <option value="Reptile">🦎 Reptile</option>
            <option value="Other">🐾 Other</option>
          </select>

          <span className="text-xs text-slate-400 font-medium ml-2">
            Showing {filteredPets.length} of {pets.length} pets
          </span>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPets.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            <Award className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">No pet records found</h3>
            <p className="text-xs mt-1">Try adjusting your search criteria or species filter.</p>
          </div>
        ) : (
          filteredPets.map((pet) => {
            const stats = getPetStats(pet.id);
            const speciesEmoji = SPECIES_ICONS[pet.species] || '🐾';

            return (
              <div
                key={pet.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {speciesEmoji} {pet.species}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {pet.identificationNumber || pet.id}
                    </span>
                  </div>

                  {/* Pet Profile Header */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        pet.photo && pet.photo.trim() !== ''
                          ? pet.photo
                          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
                      }
                      alt={pet.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                          {pet.name}
                        </h3>
                        {pet.isInsured && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full shrink-0">
                            Insured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                        {pet.breed || 'Mixed Breed'} • {pet.sex}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Age: {pet.age || 'Unknown'} {pet.weight ? `• ${pet.weight} kg` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Microchip & Owner Detail Box */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Pet Parent / Owner:</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                        {pet.ownerName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Owner Contact:</span>
                      <span className="font-mono text-[11px] truncate max-w-[160px]">
                        {pet.ownerPhone || pet.ownerEmail}
                      </span>
                    </div>
                    {pet.microchipNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Microchip ISO:</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {pet.microchipNumber}
                        </span>
                      </div>
                    )}
                    {pet.allergies && pet.allergies.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-rose-500 font-semibold text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Allergy Alert:
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 font-semibold text-[10px] truncate max-w-[150px]">
                          {pet.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Medical Ledger Summary Chips */}
                  <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      <div className="font-bold text-xs">{stats.cons}</div>
                      <div className="text-[9px] text-blue-500">Visits</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      <div className="font-bold text-xs">{stats.vax}</div>
                      <div className="text-[9px] text-emerald-500">Vaccines</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                      <div className="font-bold text-xs">{stats.dew}</div>
                      <div className="text-[9px] text-amber-500">Deworm</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      <div className="font-bold text-xs">{stats.rx}</div>
                      <div className="text-[9px] text-purple-500">Rx</div>
                    </div>
                  </div>
                </div>

                {/* Super Admin Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPetForModal(pet)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Dossier
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedPetToEdit(pet)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Pet
                    </button>
                    <button
                      onClick={() => setPetToDelete(pet)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Delete Pet Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: View Full Pet Dossier */}
      {selectedPetForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Digital Pet Health Passport & Dossier
              </h3>
              <button
                onClick={() => setSelectedPetForModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3.5 p-3.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                <img
                  src={
                    selectedPetForModal.photo && selectedPetForModal.photo.trim() !== ''
                      ? selectedPetForModal.photo
                      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
                  }
                  alt={selectedPetForModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-purple-200 dark:border-purple-800"
                />
                <div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedPetForModal.name}
                  </div>
                  <div className="text-purple-700 dark:text-purple-300 font-medium">
                    {selectedPetForModal.species} • {selectedPetForModal.breed}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Registration ID: <span className="font-mono">{selectedPetForModal.identificationNumber || selectedPetForModal.id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <div className="text-slate-400 text-[10px]">Sex & Neuter Status</div>
                  <div className="font-semibold">{selectedPetForModal.sex}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <div className="text-slate-400 text-[10px]">Age / DOB</div>
                  <div className="font-semibold">{selectedPetForModal.age || 'Not specified'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <div className="text-slate-400 text-[10px]">Weight</div>
                  <div className="font-semibold">{selectedPetForModal.weight} kg</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <div className="text-slate-400 text-[10px]">Blood Group</div>
                  <div className="font-semibold">{selectedPetForModal.bloodType || 'Not tested'}</div>
                </div>
              </div>

              {/* Owner Details */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Parent / Owner Information
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold">{selectedPetForModal.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span>{selectedPetForModal.ownerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono">{selectedPetForModal.ownerEmail}</span>
                </div>
                {selectedPetForModal.ownerAddress && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address:</span>
                    <span className="text-right truncate max-w-[200px]">{selectedPetForModal.ownerAddress}</span>
                  </div>
                )}
              </div>

              {/* Medical Alerts */}
              {(selectedPetForModal.allergies?.length ||
                selectedPetForModal.previousDiseases?.length ||
                selectedPetForModal.previousSurgeries?.length) && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl space-y-1 text-rose-900 dark:text-rose-200">
                  <div className="font-bold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Clinical History & Alerts
                  </div>
                  {selectedPetForModal.allergies && selectedPetForModal.allergies.length > 0 && (
                    <p className="text-[11px]">
                      <strong>Allergies:</strong> {selectedPetForModal.allergies.join(', ')}
                    </p>
                  )}
                  {selectedPetForModal.previousDiseases && selectedPetForModal.previousDiseases.length > 0 && (
                    <p className="text-[11px]">
                      <strong>Conditions:</strong> {selectedPetForModal.previousDiseases.join(', ')}
                    </p>
                  )}
                  {selectedPetForModal.previousSurgeries && selectedPetForModal.previousSurgeries.length > 0 && (
                    <p className="text-[11px]">
                      <strong>Surgeries:</strong> {selectedPetForModal.previousSurgeries.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const toEdit = selectedPetForModal;
                  setSelectedPetForModal(null);
                  setSelectedPetToEdit(toEdit);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit This Record
              </button>
              <button
                onClick={() => setSelectedPetForModal(null)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Pet */}
      {selectedPetToEdit && (
        <EditPetModal pet={selectedPetToEdit} onClose={() => setSelectedPetToEdit(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {petToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Pet Record?
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete <strong>{petToDelete.name}</strong> ({petToDelete.species})? All associated clinical consultations and medical history will be permanently wiped from the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPetToDelete(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
