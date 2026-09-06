import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Camera,
  Save,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const OwnerProfileView: React.FC = () => {
  const { ownerProfile, updateOwnerProfile, ownerPets, showNotification } = useApp();

  const [name, setName] = useState(ownerProfile?.name || '');
  const [photoURL, setPhotoURL] = useState(ownerProfile?.photoURL || '');
  const [phone, setPhone] = useState(ownerProfile?.phone || '');
  const [email, setEmail] = useState(ownerProfile?.email || '');
  const [address, setAddress] = useState(ownerProfile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(ownerProfile?.emergencyContact || '');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar presets for quick selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateOwnerProfile({
      name: name.trim() || 'Pet Guardian',
      photoURL: photoURL.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      emergencyContact: emergencyContact.trim(),
    });
    showNotification('Pet Guardian profile updated successfully!', 'success');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Pet Guardian Profile & Account Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your personal contact details, residential address, emergency contacts, and profile photo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Guardian
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card & Avatar Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Profile Photo & Avatar</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={name || 'Owner Profile'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 dark:border-amber-600 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center font-black text-2xl border-4 border-amber-300 dark:border-amber-700 shadow-md">
                  {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 w-full">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Or pick a photo preset:
                </span>
                <div className="flex items-center gap-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoURL(preset)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                        photoURL === preset
                          ? 'border-amber-500 scale-105 ring-2 ring-amber-400/40'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {photoURL && (
                    <button
                      type="button"
                      onClick={() => setPhotoURL('')}
                      className="text-[11px] text-slate-400 hover:text-rose-500 font-semibold px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contact & Profile Fields */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            <span>Guardian Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Primary Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 345-6789"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                Emergency Contact (Name & Phone) *
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. John Jenkins (Spouse) - +1 (555) 987-6543"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Contacted immediately if your companion requires urgent veterinary authorization.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Residential / Postal Address *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Registered Companions Overview */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm text-slate-900 dark:text-white block">
                {ownerPets.length} Registered Companion{ownerPets.length === 1 ? '' : 's'}
              </strong>
              <p className="text-xs text-slate-500">
                {ownerPets.map((p) => p.name).join(', ') || 'No companions registered yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
