import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Clock,
  Stethoscope,
  ShieldAlert,
  ShieldCheck,
  Bug,
  Activity,
  AlertTriangle,
  DollarSign,
  Package,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  AlertOctagon,
  Search,
  Command,
  Sparkles,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';
import { DoctorVaccinationDewormingSection } from './DoctorVaccinationDewormingSection';

export const AdminDashboard: React.FC = () => {
  const {
    pets,
    appointments,
    consultations,
    vaccinations,
    dewormings,
    invoices,
    inventory,
    setAdminActiveTab,
    setSelectedPetId,
    adminProfile,
    setIsAdminSearchOpen,
  } = useApp();

  // Metrics calculations
  const totalPatients = pets.length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter((a) => a.date === '2026-08-30' || a.date === todayDateStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'Requested' || a.status === 'Confirmed');
  const emergencyAppointments = appointments.filter((a) => a.isEmergency || a.type === 'Emergency');
  
  const vaccinationsDue = vaccinations.filter((v) => v.status === 'Due Soon' || v.status === 'Overdue');
  const dewormingDue = dewormings.filter((d) => d.status === 'Due Soon' || d.status === 'Overdue');
  
  const totalRevenue = invoices.reduce(
    (acc, curr) => acc + (curr.grandTotal ?? (curr as any).total ?? 0),
    0
  );
  const lowStockDrugs = inventory.filter((item) => item.stockCount <= item.minimumThreshold);
  const expiredDrugs = inventory.filter((item) => new Date(item.expiryDate) < new Date('2027-01-01'));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-400/30 text-xs font-semibold text-teal-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Clinic Live Operations</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/70 border border-emerald-400/40 text-[11px] font-semibold text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                <span>Google Firebase Connected</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Good day, {adminProfile.name}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
              {adminProfile.clinicName} • Hospital management overview, patient triage, and cloud-synced database.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAdminSearchOpen(true)}
              className="bg-teal-900/60 hover:bg-teal-900/80 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-teal-400/30 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-teal-300" />
              <span>Search Records</span>
              <span className="hidden sm:inline text-[10px] font-mono bg-teal-950/70 px-1.5 py-0.5 rounded text-teal-300">⌘K</span>
            </button>
            <button
              onClick={() => setAdminActiveTab('consultation')}
              className="bg-white hover:bg-teal-50 text-teal-800 font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>New Consultation</span>
            </button>
            <button
              onClick={() => setAdminActiveTab('patients')}
              className="bg-teal-600/90 hover:bg-teal-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-teal-400/40 shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Clinical Search Bar on Dashboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            onClick={() => setIsAdminSearchOpen(true)}
            className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-teal-500/60 dark:hover:border-teal-500/60 cursor-pointer transition-all group"
          >
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block truncate">
                Search patients, microchips, phone numbers, Rx, drugs, lab reports, or invoices...
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-400">
              <Command className="w-3 h-3" />K
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
            <span className="text-[11px] text-slate-400 shrink-0 hidden md:inline">Quick Find:</span>
            {[
              { label: 'Patients', tab: 'patients' },
              { label: 'Prescriptions', tab: 'prescription' },
              { label: 'Lab Reports', tab: 'laboratory' },
              { label: 'Inventory', tab: 'inventory' },
              { label: 'Billing', tab: 'billing' },
            ].map((shortcut) => (
              <button
                key={shortcut.tab}
                onClick={() => setAdminActiveTab(shortcut.tab)}
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition-colors"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency & Urgent Notice Banner (if any emergency cases) */}
      {emergencyAppointments.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                {emergencyAppointments.length} Active Emergency Triage Case(s)
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                {emergencyAppointments[0].petName} ({emergencyAppointments[0].species}) - {emergencyAppointments[0].reason}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminActiveTab('appointments')}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
          >
            Review Triage
          </button>
        </div>
      )}

      {/* AI Diagnostic Quick-Launch Suites */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 text-white border border-teal-800/60 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Diagnostic Center & Diagnostics Hub</h3>
              <p className="text-[11px] text-teal-200/80">
                Multimodal AI for biochemical upload OCR, X-Ray / USG sonography, and multi-parameter triage
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30">
            Pathology & Vision AI Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setAdminActiveTab('laboratory')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-teal-500/20 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-teal-300 group-hover:text-teal-200">Biochemical & Lab AI</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300">
              Upload lab slips, CBC, KFT, LFT, Electrolytes & calculate BUN:Cr and A:G ratios.
            </p>
          </button>

          <button
            onClick={() => setAdminActiveTab('imaging')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-teal-500/20 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-teal-300 group-hover:text-teal-200">X-Ray & USG Vision AI</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300">
              Digital Radiography & Ultrasound sonography with Vertebral Heart Score & A-FAST scores.
            </p>
          </button>

          <button
            onClick={() => setAdminActiveTab('multiparameter-diagnostic')}
            className="p-3.5 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-emerald-300 group-hover:text-emerald-200">Multi-Parameter Fusion</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-teal-100">
              Fuse Bloodwork + X-Ray/USG + ECG + Vitals + Symptoms for complete patient risk mapping.
            </p>
          </button>
        </div>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Patients */}
        <div
          onClick={() => setAdminActiveTab('patients')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/60 rounded-xl text-teal-600 dark:text-teal-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPatients}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active registered animals</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => setAdminActiveTab('appointments')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Schedule</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {todayAppointments.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {pendingAppointments.length} pending / confirmed
          </div>
        </div>

        {/* Vaccinations Due */}
        <div
          onClick={() => setAdminActiveTab('vaccination')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vaccines Due</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {vaccinationsDue.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            <span>Automated reminders sent</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          onClick={() => setAdminActiveTab('billing')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {invoices.length} invoices generated
          </div>
        </div>
      </div>

      {/* Secondary Quick Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setAdminActiveTab('deworming')}
          className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
        >
          <div className="p-2 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 rounded-lg">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Deworming Due</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{dewormingDue.length} Pets</div>
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('consultation')}
          className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
        >
          <div className="p-2 bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 rounded-lg">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Consultations</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{consultations.length} Cases</div>
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('inventory')}
          className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
        >
          <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Stock Alerts</div>
            <div className="text-sm font-bold text-amber-600">{lowStockDrugs.length} Items Low</div>
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('ecg')}
          className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
        >
          <div className="p-2 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Cardiology & ECG</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">AI Analyzer Ready</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Recent Clinical Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Today's Appointment Schedule</h3>
            </div>
            <button
              onClick={() => setAdminActiveTab('appointments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No more appointments scheduled for today.</p>
            ) : (
              todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    setSelectedPetId(apt.petId);
                    setAdminActiveTab('consultation');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    apt.isEmergency
                      ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-teal-50/50 dark:hover:bg-teal-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                      {apt.time.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{apt.petName}</span>
                        <SpeciesBadge species={apt.species} />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {apt.type} • {apt.reason}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {apt.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{apt.ownerName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Cases & Medical Consultations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Clinical Consultations</h3>
            </div>
            <button
              onClick={() => setAdminActiveTab('consultation')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Consultation Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {consultations.slice(0, 3).map((cons) => (
              <div
                key={cons.id}
                onClick={() => {
                  setSelectedPetId(cons.petId);
                  setAdminActiveTab('patients');
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-teal-400 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{cons.petName}</span>
                    <SpeciesBadge species={cons.species} />
                  </div>
                  <span className="text-[10px] text-slate-400">{cons.date}</span>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold">
                  Dx: {cons.provisionalDiagnosis}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  Chief Complaint: {cons.chiefComplaint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccination & Deworming Clinical Administration Section on Doctor Dashboard */}
      <DoctorVaccinationDewormingSection />

      {/* Stock Alerts & Expired Medicine Watch */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pharmacy Stock & Expiry Alerts</h3>
          </div>
          <button
            onClick={() => setAdminActiveTab('inventory')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Manage Inventory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lowStockDrugs.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">{item.name}</h5>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Batch: {item.batchNumber} • Expiry: {item.expiryDate}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                  Stock: {item.stockCount} {item.unit}
                </span>
                <p className="text-[10px] text-amber-600 mt-0.5">Threshold: {item.minimumThreshold}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
