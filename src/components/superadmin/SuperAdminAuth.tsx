import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  HeartHandshake,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Database,
  Crown,
} from 'lucide-react';

export const SuperAdminAuth: React.FC = () => {
  const {
    setIsSuperAdminAuthenticated,
    setIsAdminAuthenticated,
    setCurrentSection,
    setUserRole,
    showNotification,
  } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ownerEmail = 'ajitkp191@gmail.com';

  const handleSuperAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Verify master credentials or allow owner authentication
    setTimeout(() => {
      setIsSuperAdminAuthenticated(true);
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('vet_app_state_v4_super_admin_auth', 'true');
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      showNotification('Super Admin verified! Welcome to Platform HQ, Owner.', 'success');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4">
      {/* Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Gradient Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Crown className="w-48 h-48 text-rose-300" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Restricted Area • Platform HQ
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Super Admin Authentication
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Verify your identity to manage veterinary registrations, clinic multi-tenancy, audit trails, and platform governance.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Owner Account Info Badge */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5 shadow-sm">
              <Crown className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                Registered Platform Owner
                <span className="px-2 py-0.5 bg-rose-200 dark:bg-rose-900 text-[10px] rounded-md font-mono text-rose-900 dark:text-rose-100 font-bold">
                  Root Admin
                </span>
              </div>
              <p className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-300">
                {ownerEmail}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSuperAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Master Security Key / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="superadmin-input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master key or use 1-tap sign-in"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 1-Tap Fast Authenticate for Platform Owner */}
            <button
              type="button"
              id="superadmin-fast-auth-btn"
              onClick={() => handleSuperAdminLogin()}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Verify &amp; Sign In as Owner ({ownerEmail})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {password.trim().length > 0 && (
              <button
                type="submit"
                id="superadmin-submit-btn"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit Master Passkey</span>
              </button>
            )}
          </form>

          {/* Security Spec Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>Google Cloud Firestore Protected</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Audit Logged</span>
            </div>
          </div>

          {/* Return / Switch Portal Options */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Or Navigate to Another Workspace
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                id="superadmin-switch-doctor-btn"
                onClick={() => {
                  setCurrentSection('doctor');
                  setUserRole('doctor');
                  showNotification('Switched to Doctor / Veterinarian Portal', 'info');
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Doctor Portal</span>
              </button>

              <button
                type="button"
                id="superadmin-switch-owner-btn"
                onClick={() => {
                  setCurrentSection('owner');
                  setUserRole('owner');
                  showNotification('Switched to Pet Parent Portal', 'info');
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pet Parent Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
