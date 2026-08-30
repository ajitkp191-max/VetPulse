import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ShieldCheck,
  Printer,
  QrCode,
  Calendar,
  Building,
  Heart,
  FileText,
  User,
  CheckCircle2,
  Bug,
} from 'lucide-react';
import { AnimalAvatar, SpeciesBadge } from '../common/AnimalIllustration';

export const HealthPassport: React.FC = () => {
  const { pets, selectedPetId, setSelectedPetId, vaccinations, dewormings, prescriptions, adminProfile } = useApp();

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const petVaccines = vaccinations.filter((v) => v.petId === activePet?.id);
  const petDewormings = dewormings.filter((d) => d.petId === activePet?.id);
  const petRx = prescriptions.filter((p) => p.petId === activePet?.id);

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Digital Companion Animal Passport & Health Record
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified immunization certificates, microchip registry & international travel health history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activePet?.id}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
          <button
            onClick={handlePrintPassport}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Passport</span>
          </button>
        </div>
      </div>

      {/* Main Passport Document Card */}
      {activePet && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-600 p-6 sm:p-8 shadow-xl space-y-6 print-container max-w-4xl mx-auto">
          {/* Passport Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-teal-600">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-teal-600 text-white rounded-2xl shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  Global Veterinary Medical Federation
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  Companion Animal Health Passport
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Passport Unique Identifier: <strong>VET-PASS-{activePet.id.toUpperCase()}</strong>
                </p>
              </div>
            </div>

            {/* QR Code Verification Simulation */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 self-start sm:self-auto">
              <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200" />
              <div className="text-[10px] text-slate-500">
                <span className="font-bold text-teal-600 block">QR Authenticated</span>
                <span>Scan for Live Verification</span>
              </div>
            </div>
          </div>

          {/* Section 1: Pet Identification */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <span>Section I: Animal Identification & Microchip</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-3 flex justify-center">
                <AnimalAvatar species={activePet.species} size="lg" />
              </div>

              <div className="sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Pet Name</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{activePet.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Species & Breed</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{activePet.species} • {activePet.breed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sex & Neutered</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{activePet.gender} (Neutered)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / DOB</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{activePet.age}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Recorded Weight</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{activePet.weight} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ISO 11784/11785 Microchip</span>
                  <span className="text-teal-700 dark:text-teal-300 font-mono font-bold">{activePet.microchipId || '985141002948210'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Owner & Issuing Clinic */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <span>Section II: Ownership & Registered Veterinary Hospital</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Registered Guardian / Owner</span>
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activePet.ownerName}</p>
                <p className="text-slate-500">Phone: {activePet.ownerPhone}</p>
                <p className="text-slate-500">Address: {activePet.ownerAddress}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-600" />
                  <span>Issuing Veterinary Practice</span>
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{adminProfile.clinicName}</p>
                <p className="text-slate-500">Attending Vet: {adminProfile.name} ({adminProfile.qualification})</p>
                <p className="text-teal-700 dark:text-teal-300 font-mono text-[10px]">License Reg: {adminProfile.registrationNumber}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Rabies & Core Vaccination Registry */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <span>Section III: Official Vaccination & Immunization Certificate</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Vaccine / Manufacturer</th>
                    <th className="py-2.5 px-3 font-mono">Batch / Lot</th>
                    <th className="py-2.5 px-3">Administered</th>
                    <th className="py-2.5 px-3">Valid Until</th>
                    <th className="py-2.5 px-3 text-center">Authorized Vet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {petVaccines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No official vaccination entries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    petVaccines.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {v.vaccineName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">{v.batchNumber}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{v.administeredDate}</td>
                        <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-teal-300">{v.nextDueDate}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> {v.veterinarianName}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Anthelmintic / Parasite Treatments */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <span>Section IV: Echinococcus & Internal Parasite Treatments</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Anthelmintic Drug</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Treatment Date</th>
                    <th className="py-2.5 px-3">Next Due</th>
                    <th className="py-2.5 px-3 text-center">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {petDewormings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No deworming records logged.
                      </td>
                    </tr>
                  ) : (
                    petDewormings.map((d) => (
                      <tr key={d.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {d.drugUsed}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{d.dosage}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{d.administeredDate}</td>
                        <td className="py-2.5 px-3 font-bold text-purple-700 dark:text-purple-300">{d.nextDueDate}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">{d.administeredBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t-2 border-teal-600 flex items-end justify-between text-xs">
            <div className="text-[10px] text-slate-400 max-w-sm">
              <p>This digital passport is recognized by participating veterinary clinics and travel boards.</p>
              <p className="mt-0.5">Apex Veterinary Hospital System • ISO Verified</p>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-sm text-teal-700 dark:text-teal-400 font-bold border-b border-slate-400 pb-1 px-4">
                {adminProfile.name}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                Official Veterinary Medical Seal
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
