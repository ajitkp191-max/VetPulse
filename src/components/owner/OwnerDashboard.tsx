import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Calendar,
  ShieldCheck,
  PlusCircle,
  Clock,
  ChevronRight,
  Pill,
  Activity,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { AnimalAvatar, SpeciesBadge } from '../common/AnimalIllustration';

interface OwnerDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigateTab }) => {
  const {
    ownerPets,
    ownerAppointments,
    ownerVaccinations,
    ownerPrescriptions,
    setSelectedPetId,
    ownerProfile,
  } = useApp();

  // Find user's active pet from their own registered pets
  const [activePetIndex, setActivePetIndex] = useState(0);
  const activePet = ownerPets[activePetIndex] || ownerPets[0];

  const petAppointments = ownerAppointments.filter((a) => a.petId === activePet?.id);
  const petVaccines = ownerVaccinations.filter((v) => v.petId === activePet?.id);
  const petRx = ownerPrescriptions.filter((p) => p.petId === activePet?.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-1">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Pet Guardian Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome, {ownerProfile?.name || 'Pet Parent'}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Manage your registered companion animal health profiles, track vaccinations, view medical prescriptions, and schedule veterinary visits.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('book-appointment')}
              className="bg-white hover:bg-emerald-50 text-teal-800 font-bold px-4 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigateTab('my-pets')}
              className="bg-teal-800/60 hover:bg-teal-800/80 border border-white/30 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all"
            >
              <Heart className="w-4 h-4 text-amber-300" />
              <span>My Registered Pets ({ownerPets.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background paw watermark */}
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none">
          <Heart className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Pet Selection Carousel Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>My Registered Companions ({ownerPets.length})</span>
          </h3>
          <button
            onClick={() => onNavigateTab('my-pets')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>{ownerPets.length > 0 ? 'Manage My Pets' : '+ Register Companion'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {ownerPets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl w-fit mx-auto text-amber-500">
              <Heart className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">No Registered Companions Under Your Account</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You only have access to companion animals registered by you. Register your first pet to view health dossiers, book appointments, and track treatments.
            </p>
            <button
              onClick={() => onNavigateTab('my-pets')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs inline-flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Your Companion</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ownerPets.map((pet, idx) => {
              const isSelected = activePet?.id === pet.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => {
                    setActivePetIndex(idx);
                    setSelectedPetId(pet.id);
                  }}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
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
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {pet.breed}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{pet.age}</span>
                      <span>•</span>
                      <span>{pet.weight} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Pet Quick Health Dashboard Card */}
      {activePet && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Pet Info & Overview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Status Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <AnimalAvatar species={activePet.species} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {activePet.name}
                      </h3>
                      <SpeciesBadge species={activePet.species} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activePet.gender || activePet.sex} • {activePet.breed} • Reg: {activePet.identificationNumber}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('my-pets')}
                  className="bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto border border-teal-200 dark:border-teal-800"
                >
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Full Medical Dossier</span>
                </button>
              </div>

              {/* Quick Health Stats 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Vaccination</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 dark:text-emerald-100 font-semibold">
                    {petVaccines.length > 0 ? 'Up to Date' : 'Due for Booster'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900">
                  <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300 font-bold mb-1">
                    <Pill className="w-4 h-4" />
                    <span>Active Rx</span>
                  </div>
                  <p className="text-[11px] text-teal-900 dark:text-teal-100 font-semibold">
                    {petRx.length > 0 ? `${petRx[0].items.length} Active Meds` : 'No Ongoing Rx'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
                    <Activity className="w-4 h-4" />
                    <span>Weight & BMI</span>
                  </div>
                  <p className="text-[11px] text-blue-900 dark:text-blue-100 font-semibold">
                    {activePet.weight} kg (Healthy)
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Visits</span>
                  </div>
                  <p className="text-[11px] text-purple-900 dark:text-purple-100 font-semibold">
                    {petAppointments.length} Recorded
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments & Health Reminders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Scheduled Visits & Care Timeline</span>
                </h4>
                <button
                  onClick={() => onNavigateTab('book-appointment')}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700"
                >
                  + New Booking
                </button>
              </div>

              {petAppointments.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No scheduled visits for {activePet.name}.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {petAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {apt.type}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>{apt.date} at {apt.time}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Medication Reminder Alarm Strip */}
            {petRx.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-600" />
                    <span>Daily Medication & Dosages</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Rx #{petRx[0].prescriptionNumber}
                  </span>
                </div>

                <div className="space-y-2">
                  {petRx[0].items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-purple-950 dark:text-purple-200">
                          {item.medicineName} ({item.form})
                        </div>
                        <p className="text-[11px] text-purple-800 dark:text-purple-300">
                          {item.dosage} • {item.frequency} • {item.route}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-purple-200">
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Guides & Pet Parent Info */}
          <div className="lg:col-span-4 space-y-4">
            {/* Pet Parent Profile Summary Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Pet Guardian Profile</h4>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Guardian:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ownerProfile?.name || 'Pet Parent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Contact:</span>
                  <span className="font-medium">{ownerProfile?.phone || '+1 (555) 234-5678'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-mono text-[11px] truncate max-w-[150px]">{ownerProfile?.email || 'owner@portal'}</span>
                </div>
                {ownerProfile?.address && (
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Address:</span>
                    {ownerProfile.address}
                  </div>
                )}
              </div>
            </div>

            {/* Emergency First Aid & Toxic Food Guide Widget */}
            <div
              onClick={() => onNavigateTab('emergency-first-aid')}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-amber-600">Explore Guide →</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Pet First Aid & Toxic Food Checker
              </h4>
              <p className="text-[11px] text-slate-500">
                Check immediate life-saving actions for choking, heatstroke, chocolate, or toxic plant poisoning.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
