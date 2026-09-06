import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Building,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  Award,
  Check,
  X,
  AlertTriangle,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    adminProfile,
    updateAdminProfile,
    showNotification,
    clinicRegistrations,
    approveClinicRegistration,
    rejectClinicRegistration,
  } = useApp();

  const [formData, setFormData] = useState({
    name: adminProfile.name,
    qualification: adminProfile.qualification,
    registrationNumber: adminProfile.registrationNumber,
    specialization: adminProfile.specialization,
    contactNumber: adminProfile.contactNumber,
    email: adminProfile.email,
    experience: adminProfile.experience,
    clinicName: adminProfile.clinicName,
    clinicAddress: adminProfile.clinicAddress,
    clinicRegistration: adminProfile.clinicRegistration,
    operatingHours: 'Mon - Sat: 08:00 AM - 08:00 PM | Sun: Emergency Only',
    emergencyHotline: '+1 (555) 911-VETS',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(formData);
    showNotification('Veterinary practice profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Veterinary Practice & Clinic Configuration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Maintain authorized medical credentials, registration licensing, clinic details & operating schedules.
          </p>
        </div>
      </div>

      {/* Firebase Clinic Registration & Licensing Requests Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Firebase Clinic Registrations & Licensing Approvals
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            {clinicRegistrations.filter((r) => r.status === 'pending').length} Pending 24-hr Verifications
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          When a new veterinarian registers their clinic with their <strong>Email, Password, and Veterinarian ID Number</strong>, their application is saved in Firebase. Review their license credentials below and accept their request to grant them full access.
        </p>

        <div className="space-y-3 pt-1">
          {clinicRegistrations.map((reg) => (
            <div
              key={reg.id}
              className={`p-4 rounded-2xl border transition-all ${
                reg.status === 'pending'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                  : reg.status === 'approved'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{reg.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold">
                      {reg.veterinarianIdNumber || 'ID-PENDING'}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        reg.status === 'pending'
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 animate-pulse'
                          : reg.status === 'approved'
                          ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {reg.status === 'pending' ? '⏳ 24-hr Review' : reg.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>🏥 {reg.clinicName}</span>
                    <span>📧 {reg.email}</span>
                    <span>📞 {reg.contactNumber}</span>
                  </div>

                  {reg.qualification && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      🎓 {reg.qualification} • {reg.specialization}
                    </div>
                  )}

                  {reg.notes && (
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      Note: {reg.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {reg.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => approveClinicRegistration(reg.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept on Firebase</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectClinicRegistration(reg.id, 'License ID verification failed')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : reg.status === 'approved' ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Access Granted</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => approveClinicRegistration(reg.id)}
                      className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      Re-approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinician Medical Credentials */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-teal-600" />
            <span>Chief Veterinarian Profile & Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Full Veterinarian Name & Honorific
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Medical Qualification / Degrees
              </label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                State / National Veterinary Council Reg. No.
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-teal-700 dark:text-teal-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Clinical Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Professional Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Clinic / Hospital Establishment Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-teal-600" />
            <span>Clinic & Hospital Establishment Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Hospital / Clinic Name
              </label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Facility License Registration
              </label>
              <input
                type="text"
                value={formData.clinicRegistration}
                onChange={(e) => setFormData({ ...formData, clinicRegistration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Hospital Physical Address
              </label>
              <input
                type="text"
                value={formData.clinicAddress}
                onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Standard Consultation Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                24/7 Emergency Triage Helpline
              </label>
              <input
                type="text"
                value={formData.emergencyHotline}
                onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-red-600"
              />
            </div>
          </div>
        </div>

        {/* Google Firebase Integration Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google Firebase Cloud Database & Synchronization</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connected
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Firebase Project ID</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">diesel-bulwark-h7dgj</div>
              <span className="text-[10px] text-emerald-600 font-medium">Google Cloud Firestore provisioned</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Real-Time Sync Engine</span>
              <div className="font-bold text-slate-900 dark:text-white text-xs">Active Multi-Device Listener</div>
              <span className="text-[10px] text-teal-600 font-medium">Real-time pet dossiers, appointments & vitals</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Profile & Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
