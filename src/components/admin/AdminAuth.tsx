import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Lock,
  Mail,
  Phone,
  KeyRound,
  Building,
  User,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminAuth: React.FC = () => {
  const { setIsAdminAuthenticated, adminProfile, updateAdminProfile, showNotification } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'otp' | 'register' | 'forgot'>('login');
  
  // Login form state
  const [emailOrPhone, setEmailOrPhone] = useState('dr.sarah@apexvetcare.com');
  const [password, setPassword] = useState('vetdoctor2026');
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  // Registration / Profile Setup state
  const [regForm, setRegForm] = useState({
    name: adminProfile.name,
    qualification: adminProfile.qualification,
    registrationNumber: adminProfile.registrationNumber,
    specialization: adminProfile.specialization,
    clinicName: adminProfile.clinicName,
    clinicAddress: adminProfile.clinicAddress,
    contactNumber: adminProfile.contactNumber,
    email: adminProfile.email,
    consultationTimings: adminProfile.consultationTimings,
    role: 'Chief Veterinarian / Clinic Admin',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      showNotification('Please enter email or phone number', 'error');
      return;
    }
    setIsAdminAuthenticated(true);
    showNotification(`Welcome back, ${adminProfile.name}!`, 'success');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    showNotification(`Verification OTP sent to ${emailOrPhone}. (Demo OTP: 5491)`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      showNotification('Please enter valid 4-digit OTP', 'error');
      return;
    }
    setIsAdminAuthenticated(true);
    showNotification('OTP Verified successfully. Welcome to Clinical Management Portal!', 'success');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(regForm);
    setIsAdminAuthenticated(true);
    showNotification('Clinic & Veterinarian registration complete!', 'success');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 text-white text-center relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Stethoscope className="w-9 h-9 text-teal-100" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Veterinarian & Clinic Portal</h2>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">Authorized Clinical & Hospital Administration</p>

          {/* Quick Demo Access Pill */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-[11px] font-medium border border-teal-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preloaded with Dr. Sarah Jenkins profile & clinical data</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-3 text-center border-b-2 transition-all ${
              authMode === 'login'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Password Login
          </button>
          <button
            onClick={() => setAuthMode('otp')}
            className={`py-3 text-center border-b-2 transition-all ${
              authMode === 'otp'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            OTP Instant Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-3 text-center border-b-2 transition-all ${
              authMode === 'register'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            New Clinic Setup
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* PASSWORD LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Veterinarian Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="doctor@apexvetcare.com or +15553498387"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs text-teal-600 hover:underline dark:text-teal-400 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Sign In to Clinical Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthenticated(true);
                    showNotification('Signed in with 1-Click Doctor Demo Pass', 'success');
                  }}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  ⚡ Fast One-Click Demo Access
                </button>
              </div>
            </form>
          )}

          {/* OTP LOGIN */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Mobile Number or Email
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="+1 (555) 349-8387"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Send Verification Code (OTP)</span>
                    <KeyRound className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-teal-50 dark:bg-teal-950/50 p-3.5 rounded-xl border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200">
                    <p>OTP code dispatched to <strong>{emailOrPhone}</strong></p>
                    <p className="mt-1 font-mono text-[11px] text-teal-600 dark:text-teal-400">Hint: Enter <strong>5491</strong></p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Enter 4-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="5491"
                      className="w-full text-center tracking-widest text-xl font-mono py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Verify & Access Portal</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-slate-500 hover:underline"
                  >
                    Change Phone / Resend OTP
                  </button>
                </form>
              )}
            </div>
          )}

          {/* REGISTRATION & PROFILE SETUP */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Veterinarian Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Medical Registration No.
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.registrationNumber}
                    onChange={(e) => setRegForm({ ...regForm, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Degrees / Qualifications
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.qualification}
                    onChange={(e) => setRegForm({ ...regForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.specialization}
                    onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  required
                  value={regForm.clinicName}
                  onChange={(e) => setRegForm({ ...regForm, clinicName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Clinic Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.contactNumber}
                    onChange={(e) => setRegForm({ ...regForm, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Consultation Schedule / Timings
                </label>
                <input
                  type="text"
                  value={regForm.consultationTimings}
                  onChange={(e) => setRegForm({ ...regForm, consultationTimings: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>Save Clinic Profile & Enter Dashboard</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter your registered veterinarian email to receive a password reset link and SMS authentication key.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="dr.sarah@apexvetcare.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <button
                onClick={() => {
                  showNotification('Password recovery link sent to your email!', 'info');
                  setAuthMode('login');
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md"
              >
                Send Reset Instructions
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-xs text-slate-500 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
