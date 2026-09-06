import React, { useState } from 'react';
import { PetRecord, SpeciesType } from '../../types';
import { useApp } from '../../context/AppContext';
import { Award, XCircle, Save, User, Phone, Mail, MapPin, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

interface EditPetModalProps {
  pet: PetRecord;
  onClose: () => void;
}

const SPECIES_OPTIONS: SpeciesType[] = [
  'Canine (Dog)',
  'Feline (Cat)',
  'Equine (Horse)',
  'Bovine (Cattle)',
  'Avian (Bird)',
  'Small Mammal',
  'Reptile',
  'Other',
];

export const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose }) => {
  const { updatePet, showNotification } = useApp();

  const [formData, setFormData] = useState({
    name: pet.name || '',
    species: pet.species || 'Canine (Dog)',
    breed: pet.breed || '',
    sex: pet.sex || 'Male',
    dob: pet.dob || '',
    age: pet.age || '',
    weight: pet.weight ? String(pet.weight) : '',
    color: pet.color || '',
    identificationNumber: pet.identificationNumber || '',
    microchipNumber: pet.microchipNumber || '',
    photo: pet.photo || '',
    ownerName: pet.ownerName || '',
    ownerPhone: pet.ownerPhone || '',
    ownerEmail: pet.ownerEmail || '',
    ownerAddress: pet.ownerAddress || '',
    bloodType: pet.bloodType || '',
    allergies: pet.allergies ? pet.allergies.join(', ') : '',
    previousDiseases: pet.previousDiseases ? pet.previousDiseases.join(', ') : '',
    previousSurgeries: pet.previousSurgeries ? pet.previousSurgeries.join(', ') : '',
    isInsured: pet.isInsured ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ownerName.trim()) {
      showNotification('Pet Name and Owner Name are required.', 'warning');
      return;
    }

    const allergiesArray = formData.allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const diseasesArray = formData.previousDiseases
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const surgeriesArray = formData.previousSurgeries
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updatePet(pet.id, {
      name: formData.name.trim(),
      species: formData.species as SpeciesType,
      breed: formData.breed.trim(),
      sex: formData.sex as any,
      dob: formData.dob,
      age: formData.age.trim(),
      weight: parseFloat(formData.weight) || pet.weight || 0,
      color: formData.color.trim(),
      identificationNumber: formData.identificationNumber.trim(),
      microchipNumber: formData.microchipNumber.trim(),
      photo: formData.photo.trim(),
      ownerName: formData.ownerName.trim(),
      ownerPhone: formData.ownerPhone.trim(),
      ownerEmail: formData.ownerEmail.trim(),
      ownerAddress: formData.ownerAddress.trim(),
      bloodType: formData.bloodType.trim(),
      allergies: allergiesArray,
      previousDiseases: diseasesArray,
      previousSurgeries: surgeriesArray,
      isInsured: formData.isInsured,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Pet Health Passport & Ownership
              </h3>
              <p className="text-xs text-slate-500">Super Admin Direct Authority • ID: {pet.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Pet Basic Information */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 text-purple-600 dark:text-purple-400">
              1. Patient Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bella"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Species *
                </label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value as SpeciesType })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  {SPECIES_OPTIONS.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="e.g. Golden Retriever"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sex / Neuter Status
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Male">Male (Intact)</option>
                  <option value="Female">Female (Intact)</option>
                  <option value="Neutered Male">Neutered Male</option>
                  <option value="Spayed Female">Spayed Female</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age / DOB
                </label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 3 Years 2 Months"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g. 28.5"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.identificationNumber}
                  onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                  placeholder="e.g. CAN-2024-8849"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Microchip ISO ID
                </label>
                <input
                  type="text"
                  value={formData.microchipNumber}
                  onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                  placeholder="e.g. 981098123456789"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Color / Coat Pattern
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g. Golden Honey"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 text-indigo-600 dark:text-indigo-400">
              2. Owner & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Phone
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="eleanor@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Address
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.ownerAddress}
                    onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                    placeholder="124 Cedar Grove Lane, Austin, TX"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical Alerts & History */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 text-rose-600 dark:text-rose-400">
              3. Clinical History & Alerts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Known Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Beef Protein, Flea Saliva"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group / Type
                </label>
                <input
                  type="text"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  placeholder="e.g. DEA 1.1 Positive or Type A"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chronic Conditions / Previous Diseases
                </label>
                <input
                  type="text"
                  value={formData.previousDiseases}
                  onChange={(e) => setFormData({ ...formData, previousDiseases: e.target.value })}
                  placeholder="e.g. Canine Atopic Dermatitis, Mild Hip Dysplasia"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Surgical History
                </label>
                <input
                  type="text"
                  value={formData.previousSurgeries}
                  onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
                  placeholder="e.g. Ovariohysterectomy (2022)"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isInsuredCheck"
                checked={formData.isInsured}
                onChange={(e) => setFormData({ ...formData, isInsured: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <label htmlFor="isInsuredCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Patient has Active Pet Health Insurance Coverage
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Pet Record Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
