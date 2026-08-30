import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Phone,
  Search,
  Filter,
  User,
  X,
  Send,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const AppointmentAdmin: React.FC = () => {
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

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Appointment Form State
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [aptDate, setAptDate] = useState('2026-08-30');
  const [aptTime, setAptTime] = useState('02:30 PM');
  const [aptType, setAptType] = useState<Appointment['type']>('Clinical Consultation');
  const [aptReason, setAptReason] = useState('General follow-up and vaccination booster review.');
  const [isEmergency, setIsEmergency] = useState(false);

  const filteredAppointments = appointments.filter((a) => {
    return filterStatus === 'All' || a.status === filterStatus;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      ownerName: selectedPet.ownerName,
      ownerPhone: selectedPet.ownerPhone,
      date: aptDate,
      time: aptTime,
      type: aptType,
      reason: aptReason,
      status: 'Confirmed',
      isEmergency,
      veterinarianAssigned: adminProfile.name,
    });
    setIsModalOpen(false);
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
              Appointment Scheduling & Emergency Triage Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage in-clinic consultations, surgeries, vaccinations, and emergency admissions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-xs overflow-x-auto">
        {['All', 'Requested', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {st} ({st === 'All' ? appointments.length : appointments.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className={`p-4 rounded-3xl border transition-all space-y-3 ${
              apt.isEmergency
                ? 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{apt.petName}</span>
                <SpeciesBadge species={apt.species} />
              </div>
              {apt.isEmergency ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
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

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {apt.date} at {apt.time}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Type: {apt.type}
              </p>
              <p className="text-slate-500 text-[11px] line-clamp-2">
                Reason: {apt.reason}
              </p>
            </div>

            {/* Owner Info & Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">{apt.ownerName}</span>
                <span className="text-[10px] text-slate-400">{apt.ownerPhone}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {apt.status === 'Requested' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                    className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg"
                    title="Confirm Appointment"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                {apt.status !== 'Completed' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                    className="p-1.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg text-[10px] font-bold px-2"
                  >
                    Mark Done
                  </button>
                )}
                {apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                    className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg"
                    title="Cancel"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Schedule New Patient Appointment</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 pt-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Select Patient</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} • Owner: {p.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Visit Type</label>
                <select
                  value={aptType}
                  onChange={(e) => setAptType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Clinical Consultation">General Clinical Consultation</option>
                  <option value="Vaccination">Vaccination / Immunization</option>
                  <option value="Surgery">Surgery / Dental Procedure</option>
                  <option value="Emergency">Emergency / Critical Care</option>
                  <option value="Follow-up">Follow-up Re-check</option>
                  <option value="Grooming / Spa">Medical Grooming / Bath</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Chief Reason for Visit</label>
                <textarea
                  rows={2}
                  required
                  value={aptReason}
                  onChange={(e) => setAptReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isEmerg"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="isEmerg" className="text-xs font-bold text-red-900 dark:text-red-200 cursor-pointer">
                  Mark as Critical Emergency Triage
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
