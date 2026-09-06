import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Activity,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Calendar,
  Pill,
  Search,
  Lock,
  Layers,
  Heart,
  ChevronRight,
  Play,
  Users,
  Building,
  Award,
} from 'lucide-react';

interface WelcomeLandingPageProps {
  onSelectRole?: (role: 'doctor' | 'owner' | 'super_admin') => void;
  onEnterWorkspace?: () => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({
  onSelectRole,
  onEnterWorkspace,
}) => {
  const {
    setCurrentSection,
    setUserRole,
    setIsAdminAuthenticated,
    setIsOwnerAuthenticated,
    setIsSuperAdminAuthenticated,
    showNotification,
    pets,
    doctors,
    clinicRegistrations,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'doctor' | 'owner' | 'super_admin'>('all');

  const handleLaunchDoctor = (demo: boolean = false) => {
    setCurrentSection('doctor');
    setUserRole('doctor');
    if (demo) {
      setIsAdminAuthenticated(true);
      showNotification('Welcome Dr. Emily Chen! Doctor station ready.', 'success');
    }
    if (onSelectRole) onSelectRole('doctor');
    if (onEnterWorkspace) onEnterWorkspace();
  };

  const handleLaunchOwner = (demo: boolean = false) => {
    setCurrentSection('owner');
    setUserRole('owner');
    if (demo) {
      setIsOwnerAuthenticated(true);
      showNotification('Welcome Sarah Jenkins! Pet Parent Portal ready.', 'success');
    }
    if (onSelectRole) onSelectRole('owner');
    if (onEnterWorkspace) onEnterWorkspace();
  };

  const handleLaunchSuperAdmin = (demo: boolean = false) => {
    setCurrentSection('super_admin');
    setUserRole('super_admin');
    if (demo) {
      setIsSuperAdminAuthenticated(true);
      showNotification('Welcome Super Admin! Platform HQ ready.', 'success');
    }
    if (onSelectRole) onSelectRole('super_admin');
    if (onEnterWorkspace) onEnterWorkspace();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative overflow-x-hidden">
      {/* Background Animated Gradient Meshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      {/* Hero Header Banner */}
      <section className="relative z-10 pt-12 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg mb-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
          <span>Next-Generation Veterinary Hospital & Pet Parent Ecosystem</span>
        </div>

        {/* Dynamic Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-5 animate-in fade-in slide-in-from-bottom-3 duration-600">
          Intelligent Veterinary EMR, Clinical AI & <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-indigo-400 bg-clip-text text-transparent">Pet Care Portal</span>
        </h1>

        {/* Supportive Description */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          A unified, cloud-synchronized clinical operating system connecting licensed veterinarians, multi-specialty pet hospitals, platform administrators, and caring pet parents.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-800">
          <button
            onClick={() => handleLaunchDoctor(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs sm:text-sm hover:from-teal-400 hover:to-emerald-400 transition-all shadow-xl shadow-teal-500/20 active:scale-95 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Launch Doctor Station (1-Click)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => handleLaunchOwner(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Pet Parent Portal (1-Click)</span>
          </button>
        </div>
      </section>

      {/* Live Ecosystem Metric Counters */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">100%</div>
            <div className="text-[11px] font-semibold text-slate-400">Clinical SOAP & Rx Formulary</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {Math.max(pets.length, 12)}+
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Active Animal Patients</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
              <Building className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {Math.max(clinicRegistrations.length, 4)}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Connected Animal Clinics</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">24/7</div>
            <div className="text-[11px] font-semibold text-slate-400">Live Cloud Firestore Sync</div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Role Portals */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-16 w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Choose Your Dedicated Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Select a portal to enter directly with tailored workflows, permissions, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Doctor / Veterinarian */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-900/90 border border-teal-500/30 hover:border-teal-400/80 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 transition-all flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-800">
                  Doctor / Clinic
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Doctor & Veterinarian Station
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Complete clinical management suite with SOAP consultations, CBC/Biochem lab reporting, X-ray/USG imaging, and automated digital prescriptions.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Interactive SOAP & Clinical Intake</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Lab CBC, Serum Biochemistry & Imaging</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Digital Prescription Formulary & Billing</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleLaunchDoctor(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Enter Doctor Station (Demo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleLaunchDoctor(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Doctor Sign In / Register
              </button>
            </div>
          </div>

          {/* Card 2: Pet Parent / Owner */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-900/90 border border-amber-500/30 hover:border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-800">
                  Pet Parent
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Pet Parent & Companion Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Digital health passport for your dogs, cats & companion animals. Track vaccine dates, access AI symptom triage, and book vet appointments instantly.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Digital Pet Health Passports with QR</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>AI Symptom Checker & Health Triage</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Vaccination Countdown & Emergency SOS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleLaunchOwner(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Enter Pet Parent Portal (Demo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleLaunchOwner(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Pet Parent Sign In / Register
              </button>
            </div>
          </div>

          {/* Card 3: Super Admin HQ */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-900/90 border border-rose-500/30 hover:border-rose-400/80 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-rose-500/10 transition-all flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-800">
                  Super Admin HQ
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                Super Admin Platform HQ
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Centralized platform governance, multi-clinic hospital approvals, doctor licensing verification, data security audits, and global analytics.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Clinic Licensing & Verification Approvals</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Doctor Directory & Direct Provisioning</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Security Audits & Platform Telemetry</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleLaunchSuperAdmin(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Access Super Admin HQ (Demo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleLaunchSuperAdmin(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Super Admin Security Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Bento Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-16 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-teal-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Built for Modern Veterinary Care</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Comprehensive Clinical Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">AI Diagnostic Assistant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clinical decision support analyzing vital signs, CBC hematology parameters, and multi-modal symptom narratives.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Full EMR & Prescription Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated drug dosage calculations, interaction checks, deworming calendars, and printable digital health dossiers.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Encrypted Cloud Sync</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live Google Cloud Firestore synchronization with zero-loss offline caching and real-time multi-device updates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="relative z-10 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 VetPulse Clinical Operating System • All rights reserved</p>
      </footer>
    </div>
  );
};
