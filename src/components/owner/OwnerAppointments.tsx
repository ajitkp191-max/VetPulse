import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertOctagon,
  PhoneCall,
  User,
  Heart,
  X,
  XCircle,
  Building,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const OwnerAppointments: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    adminProfile,
    showNotification,
  } = useApp();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Booking State
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [date, setDate] = useState('2026-09-01');
  const [time, setTime] = useState('11:00 AM');
  const [visitType, setVisitType] = useState<Appointment['type']>('Clinical Consultation');
  const [reason, setReason] = useState('Routine annual health checkup and rabies vaccination.');
  const [isEmergency, setIsEmergency] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      showNotification('Please register a companion animal before booking an appointment.', 'warning');
      return;
    }

    addAppointment({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      ownerName: selectedPet.ownerName || 'Pet Guardian',
      ownerPhone: selectedPet.ownerPhone || '+1 (555) 234-5678',
      date,
      time,
      type: visitType,
      reason,
      status: 'Requested',
      isEmergency,
      veterinarianAssigned: adminProfile.name,
    });
    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Clinic Appointments & Bookings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Schedule in-person visits, health checkups, vaccination boosters & surgeries with {adminProfile.clinicName}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Visit</span>
        </button>
      </div>

      {/* Hospital Banner */}
      <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white block text-sm">{adminProfile.clinicName}</strong>
            <span className="text-slate-500">{adminProfile.clinicAddress} • Mon-Sat 08:00 AM - 08:00 PM</span>
          </div>
        </div>

        <a
          href={`tel:${adminProfile.contactNumber}`}
          className="bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-bold px-3.5 py-2 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4 text-teal-600" />
          <span>Clinic Hotline: {adminProfile.contactNumber}</span>
        </a>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Your Scheduled & Past Appointments ({appointments.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                apt.isEmergency
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{apt.petName}</span>
                  <SpeciesBadge species={apt.species} />
                </div>
                {apt.isEmergency ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3" /> EMERGENCY
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : apt.status === 'Requested'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {apt.status}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>{apt.date} at {apt.time}</span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {apt.type}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Reason: {apt.reason}
                </p>
                <p className="text-[11px] text-teal-600 font-medium pt-1">
                  Attending Vet: {apt.veterinarianAssigned}
                </p>
              </div>

              {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                    className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Book Appointment for Your Companion</span>
              </h3>
              <button onClick={() => setIsBookModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3.5 pt-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Select Companion</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Preferred Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="09:00 AM">09:00 AM - Morning Slot</option>
                    <option value="10:30 AM">10:30 AM - Morning Slot</option>
                    <option value="11:30 AM">11:30 AM - Midday Slot</option>
                    <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                    <option value="04:30 PM">04:30 PM - Evening Slot</option>
                    <option value="06:30 PM">06:30 PM - Evening Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Type of Visit</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Clinical Consultation">General Health Consultation</option>
                  <option value="Vaccination">Vaccination / Booster Shot</option>
                  <option value="Follow-up">Follow-up Re-check</option>
                  <option value="Surgery">Surgical / Dental Consultation</option>
                  <option value="Grooming / Spa">Medical Grooming / Bath</option>
                  <option value="Emergency">Urgent Clinical Care</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Symptoms / Notes for Vet</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ownerEmerg"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="ownerEmerg" className="text-xs font-bold text-rose-900 dark:text-rose-200 cursor-pointer">
                  Urgent Emergency (Immediate Triage requested upon arrival)
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsBookModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
