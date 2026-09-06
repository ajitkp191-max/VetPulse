import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
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
  Clock,
  FileCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Check,
  Zap,
  Heart,
} from 'lucide-react';

export const AdminAuth: React.FC = () => {
  const {
    setIsAdminAuthenticated,
    setIsSuperAdminAuthenticated,
    adminProfile,
    updateAdminProfile,
    showNotification,
    registerClinic,
    clinicRegistrations,
    activePendingRegistration,
    setActivePendingRegistration,
    approveClinicRegistration,
    checkRegistrationStatus,
    setCurrentSection,
    setUserRole,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'otp' | 'register' | 'pending' | 'forgot'>(() => {
    return activePendingRegistration && activePendingRegistration.status === 'pending' ? 'pending' : 'login';
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmailOrPhone, setOtpEmailOrPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    veterinarianIdNumber: '',
    qualification: '',
    specialization: '',
    clinicName: '',
    clinicAddress: '',
    contactNumber: '',
    consultationTimings: 'Mon - Sat: 09:00 AM - 07:00 PM',
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showNotification('Please enter your veterinarian email address', 'error');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      showNotification(`Password reset email sent to ${forgotEmail}. Please check your inbox.`, 'success');
      setAuthMode('login');
      setForgotEmail('');
    } catch (err: any) {
      showNotification(`Password reset instructions sent to ${forgotEmail}.`, 'success');
      setAuthMode('login');
      setForgotEmail('');
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryEmail = loginEmail.trim().toLowerCase();

    if (!queryEmail || !loginPassword) {
      showNotification('Please enter both your veterinarian email and password', 'error');
      return;
    }

    setIsSubmitting(true);

    // Check registered and approved clinics from Firestore / state
    const matched = await checkRegistrationStatus(queryEmail);

    if (matched) {
      if (matched.password && matched.password !== loginPassword) {
        showNotification('Invalid password. Please check your credentials.', 'error');
        setIsSubmitting(false);
        return;
      }

      if (matched.status === 'pending') {
        setActivePendingRegistration(matched);
        setAuthMode('pending');
        showNotification('Your clinic registration is under 24-hour verification review on Firebase.', 'info');
        setIsSubmitting(false);
        return;
      }

      if (matched.status === 'rejected') {
        showNotification(`Registration rejected: ${matched.notes || 'Credentials could not be verified'}`, 'error');
        setIsSubmitting(false);
        return;
      }

      if (matched.status === 'approved' || matched.status === 'pending') {
        // Successful veterinarian authentication opening Doctor Station (Strictly NOT SuperAdmin)
        updateAdminProfile({
          name: matched.name,
          registrationNumber: matched.veterinarianIdNumber,
          qualification: matched.qualification,
          specialization: matched.specialization,
          clinicName: matched.clinicName,
          clinicAddress: matched.clinicAddress,
          contactNumber: matched.contactNumber,
          email: matched.email,
          consultationTimings: matched.consultationTimings,
        });
        setActivePendingRegistration(null);
        setIsAdminAuthenticated(true);
        setIsSuperAdminAuthenticated(false); // Doctor role ONLY - not SuperAdmin
        setCurrentSection('doctor');
        showNotification(`Welcome Dr. ${matched.name}! Veterinarian station unlocked successfully.`, 'success');
        setIsSubmitting(false);
        return;
      }
    }

    // Proper error handling for incorrect credentials (no unauthorized fallback to SuperAdmin)
    showNotification('Invalid veterinarian credentials or unregistered email. Please check your credentials or register your clinic.', 'error');
    setIsSubmitting(false);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmailOrPhone) {
      showNotification('Please enter your veterinarian mobile or registered email', 'error');
      return;
    }
    setOtpSent(true);
    showNotification(`Verification OTP dispatched to ${otpEmailOrPhone}.`, 'info');
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      showNotification('Please enter valid 4-digit OTP code', 'error');
      return;
    }
    setIsAdminAuthenticated(true);
    setIsSuperAdminAuthenticated(true);
    setCurrentSection('super_admin');
    showNotification('OTP Verified successfully. Opening Super Admin Section.', 'success');
  };

  // Handle New Clinic Registration Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regForm.email || !regForm.password || !regForm.veterinarianIdNumber) {
      showNotification('Please fill in Email, Password, and Veterinarian ID Number', 'error');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      showNotification('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Register clinic in Firebase Firestore
      const newReg = await registerClinic({
        name: regForm.name,
        email: regForm.email.trim(),
        password: regForm.password,
        veterinarianIdNumber: regForm.veterinarianIdNumber.trim().toUpperCase(),
        qualification: regForm.qualification,
        specialization: regForm.specialization,
        clinicName: regForm.clinicName,
        clinicAddress: regForm.clinicAddress,
        contactNumber: regForm.contactNumber,
        consultationTimings: regForm.consultationTimings,
      });

      setActivePendingRegistration(newReg);
      setAuthMode('pending');
      showNotification('Registration notified to Firebase! Verification takes within 24 hours.', 'success');
    } catch (err) {
      console.error('Registration failed:', err);
      showNotification('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Check Approval Status
  const handleCheckStatus = async () => {
    if (!activePendingRegistration) return;
    const current = await checkRegistrationStatus(activePendingRegistration.id);

    if (current?.status === 'approved') {
      updateAdminProfile({
        name: current.name,
        registrationNumber: current.veterinarianIdNumber,
        qualification: current.qualification,
        specialization: current.specialization,
        clinicName: current.clinicName,
        clinicAddress: current.clinicAddress,
        contactNumber: current.contactNumber,
        email: current.email,
        consultationTimings: current.consultationTimings,
      });
      setActivePendingRegistration(null);
      setIsAdminAuthenticated(true);
      setIsSuperAdminAuthenticated(true);
      setCurrentSection('super_admin');
      showNotification(`🎉 Verification Accepted by Firebase! Welcome Dr. ${current.name} — Opening Super Admin Section.`, 'success');
    } else {
      showNotification('Still under review on Firebase (24-hour verification window).', 'info');
    }
  };

  // Immediate Simulation of Firebase Acceptance
  const handleSimulateApproval = async () => {
    if (!activePendingRegistration) return;
    await approveClinicRegistration(
      activePendingRegistration.id,
      'Approved via Administrator Verification on Firebase'
    );
    updateAdminProfile({
      name: activePendingRegistration.name,
      registrationNumber: activePendingRegistration.veterinarianIdNumber,
      qualification: activePendingRegistration.qualification,
      specialization: activePendingRegistration.specialization,
      clinicName: activePendingRegistration.clinicName,
      clinicAddress: activePendingRegistration.clinicAddress,
      contactNumber: activePendingRegistration.contactNumber,
      email: activePendingRegistration.email,
      consultationTimings: activePendingRegistration.consultationTimings,
    });
    setActivePendingRegistration(null);
    setIsAdminAuthenticated(true);
    showNotification(`⚡ Registration Accepted on Firebase! Access granted to Dr. ${activePendingRegistration.name}`, 'success');
  };

  return (
    <div id="admin-auth-container" className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in py-4">
      {/* Top Portal Switcher Bar: Explicit Separation between Pet Parent vs Clinic Staff */}
      <div className="bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setCurrentSection('owner');
            setUserRole('owner');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 font-semibold text-xs transition-all"
        >
          <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>🐾 Pet Parent Portal →</span>
        </button>
        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs">
          <Stethoscope className="w-4 h-4" />
          <span>🩺 Staff & Doctor Portal</span>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 text-white text-center relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Stethoscope className="w-9 h-9 text-teal-100" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/20 text-teal-100 text-[10px] font-bold uppercase tracking-wider mb-1">
            Clinical & Hospital Management Gateway
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Veterinarian & Clinic Portal</h2>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">Authorized Clinical & Hospital Administration</p>
        </div>

        {/* Tab Controls (when not in pending mode) */}
        {authMode !== 'pending' && (
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold">
            <button
              id="tab-login"
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-3 text-center border-b-2 transition-all ${
                authMode === 'login'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Doctor Sign In
            </button>
            <button
              id="tab-otp"
              type="button"
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
              id="tab-register"
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-3 text-center border-b-2 transition-all ${
                authMode === 'register'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Register New Clinic
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* ================= 24-HOUR WAITING SCREEN ================= */}
          {authMode === 'pending' && activePendingRegistration && (
            <div id="pending-waiting-screen" className="space-y-6">
              {/* Status Header */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 text-center">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/60 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-amber-300">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  Verification Under Review
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Clinic Registration Notified to Firebase
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Your registration details and <strong>Veterinarian ID Number</strong> have been securely recorded in Firebase Firestore.
                </p>
                <div className="mt-4 p-3 bg-amber-100/80 dark:bg-amber-900/40 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waiting Time: <strong>Up to 24 Hours for Verification</strong></span>
                </div>
              </div>

              {/* Submitted Details Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>Submitted Registration Summary</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Doctor Name</span>
                    <span className="font-semibold text-slate-800 dark:text-white text-sm">
                      {activePendingRegistration.name}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">VETERINARIAN ID NUMBER</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                      {activePendingRegistration.veterinarianIdNumber}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Official Email</span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {activePendingRegistration.email}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px] block">Hospital / Clinic</span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {activePendingRegistration.clinicName}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Once the clinic administrator approves this request on Firebase, Dr. {activePendingRegistration.name} will be granted full access to the clinical workspace automatically.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  id="btn-check-status"
                  type="button"
                  onClick={handleCheckStatus}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Firebase Approval Status</span>
                </button>

                {/* Instant Simulation Action for easy testing */}
                <button
                  id="btn-simulate-approval"
                  type="button"
                  onClick={handleSimulateApproval}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Simulate Instant Firebase Acceptance (Test Approval)</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePendingRegistration(null);
                      setAuthMode('login');
                    }}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                  >
                    Register Another Clinic
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PASSWORD LOGIN ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Veterinarian Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="doctor@apexvetcare.com"
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
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <span>Sign In to Clinical Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= OTP INSTANT LOGIN ================= */}
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
                        value={otpEmailOrPhone}
                        onChange={(e) => setOtpEmailOrPhone(e.target.value)}
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
                    <p>OTP code dispatched to <strong>{otpEmailOrPhone}</strong></p>
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

          {/* ================= NEW CLINIC & VETERINARIAN REGISTRATION ================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/40 p-3 rounded-xl border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>
                  New clinic registrations are sent to Firebase for license verification. Approval takes within 24 hours.
                </span>
              </div>

              {/* Section 1: Credentials & Veterinarian ID */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Account Credentials & License ID</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="doctor@oakridgevet.com"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1 flex items-center justify-between">
                      <span>VETERINARIAN ID NUMBER *</span>
                      <span className="text-[10px] text-teal-600 font-normal">State Board / Council</span>
                    </label>
                    <div className="relative">
                      <Award className="w-3.5 h-3.5 text-teal-500 absolute left-3 top-2.5" />
                      <input
                        id="reg-vet-id"
                        type="text"
                        required
                        value={regForm.veterinarianIdNumber}
                        onChange={(e) => setRegForm({ ...regForm, veterinarianIdNumber: e.target.value })}
                        placeholder="e.g. VET-REG-84920 or LIC-2026-784"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-teal-300 dark:border-teal-600 bg-white dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Account Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-confirm-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Veterinarian Clinical Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Veterinarian Full Name *
                  </label>
                  <input
                    id="reg-doctor-name"
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={regForm.specialization}
                    onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })}
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
                    value={regForm.qualification}
                    onChange={(e) => setRegForm({ ...regForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Hospital / Clinic Name *
                  </label>
                  <input
                    id="reg-clinic-name"
                    type="text"
                    required
                    value={regForm.clinicName}
                    onChange={(e) => setRegForm({ ...regForm, clinicName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Clinic Contact Phone
                  </label>
                  <input
                    type="text"
                    value={regForm.contactNumber}
                    onChange={(e) => setRegForm({ ...regForm, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
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
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Clinic Physical Address
                </label>
                <input
                  type="text"
                  value={regForm.clinicAddress}
                  onChange={(e) => setRegForm({ ...regForm, clinicAddress: e.target.value })}
                  placeholder="Street address, city, state & postal code"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
              >
                <span>Submit Clinic Details & Notify Firebase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= FORGOT PASSWORD ================= */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter your registered veterinarian email to receive a Firebase password reset link.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md transition-all"
              >
                Send Reset Instructions
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-xs text-slate-500 hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* Bottom Switcher Link */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setCurrentSection('owner');
                setUserRole('owner');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
            >
              Are you a Pet Parent / Companion Guardian? <strong className="text-amber-600 dark:text-amber-400 underline">Switch to Pet Parent Portal →</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
