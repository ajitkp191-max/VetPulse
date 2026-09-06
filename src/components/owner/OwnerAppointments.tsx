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
    ownerPets,
    selectedPetId,
    setSelectedPetId,
    ownerAppointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    adminProfile,
    ownerProfile,
    showNotification,
  } = useApp();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // New Booking State
  const selectedPet = ownerPets.find((p) => p.id === selectedPetId) || ownerPets[0];
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
      ownerName: ownerProfile?.name || selectedPet.ownerName || 'Pet Guardian',
      ownerPhone: ownerProfile?.phone || selectedPet.ownerPhone || '+1 (555) 234-5678',
      ownerEmail: ownerProfile?.email || selectedPet.ownerEmail || '',
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

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !rescheduleDate || !rescheduleTime) {
      showNotification('Please provide both date and time slot.', 'warning');
      return;
    }

    updateAppointment(rescheduleApt.id, {
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'Requested',
    });
    setIsRescheduleModalOpen(false);
    setRescheduleApt(null);
    showNotification('Reschedule request sent to clinic.', 'success');
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
          onClick={() => {
            if (ownerPets.length === 0) {
              showNotification('Please register a companion animal first under My Pets.', 'warning');
              return;
            }
            setIsBookModalOpen(true);
          }}
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
          Your Scheduled & Past Appointments ({ownerAppointments.length})
        </h3>

        {ownerAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">
              No appointments found for your registered companion animals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerAppointments.map((apt) => (
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
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : apt.status === 'Requested'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : apt.status === 'In-Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 animate-pulse'
                          : apt.status === 'Completed'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {apt.status === 'In-Progress' ? 'IN_PROGRESS' : apt.status.toUpperCase()}
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
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setRescheduleApt(apt);
                        setRescheduleDate(apt.date);
                        setRescheduleTime(apt.time);
                        setIsRescheduleModalOpen(true);
                      }}
                      className="text-teal-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                      className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
                  {ownerPets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species}) - Reg: {p.identificationNumber}
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

      {/* RESCHEDULE MODAL */}
      {isRescheduleModalOpen && rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Reschedule Visit - {rescheduleApt.petName}</span>
              </h3>
              <button onClick={() => setIsRescheduleModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleReschedule} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="text-slate-500">Service: <strong className="text-slate-800 dark:text-slate-200">{rescheduleApt.type}</strong></div>
                <div className="text-slate-500">Currently: <span className="font-mono">{rescheduleApt.date} at {rescheduleApt.time}</span></div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Preferred Time Slot *</label>
                <select
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="09:00 AM">09:00 AM - Morning Slot</option>
                  <option value="10:00 AM">10:00 AM - Morning Slot</option>
                  <option value="11:00 AM">11:00 AM - Morning Slot</option>
                  <option value="01:00 PM">01:00 PM - Afternoon Slot</option>
                  <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                  <option value="04:00 PM">04:00 PM - Late Afternoon Slot</option>
                  <option value="05:30 PM">05:30 PM - Evening Slot</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
