import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  FlaskConical,
  Camera,
  Activity,
  Scissors,
  ShieldCheck,
  Calculator,
  Pill,
  Clock,
  Heart,
  ChevronRight,
  TrendingUp,
  LogOut,
  Search,
  MessageSquare,
  ClipboardList,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Sparkles,
  Bed,
} from 'lucide-react';

interface DoctorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { pets, appointments, supportTickets, logout, setIsPetSearchOpen, adminProfile } = useApp();

  const openTicketsCount = supportTickets.filter(
    (t) => (t.senderRole === 'doctor' || t.senderEmail === adminProfile.email) && t.status !== 'Resolved'
  ).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity, count: null },
    { id: 'patients', label: 'Patients 🐾', icon: Users, count: pets.length },
    { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { id: 'consultation', label: 'Consultations 🩺', icon: Stethoscope, count: null, highlight: true },
    { id: 'ai-assistant', label: 'AI Clinical Assistant ✨', icon: Sparkles, count: null, highlight: true },
    { id: 'prescription', label: 'Prescriptions', icon: FileText, count: null },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical, count: null },
    { id: 'imaging', label: 'Imaging & X-Ray', icon: Camera, count: null },
    { id: 'surgery', label: 'Surgery', icon: Scissors, count: null },
    { id: 'hospitalization', label: 'Hospitalization 🏥', icon: Bed, count: null },
    { id: 'vaccination', label: 'Vaccination 💉', icon: ShieldCheck, count: null },
    { id: 'deworming', label: 'Deworming 💊', icon: ShieldCheck, count: null },
    { id: 'calculator', label: 'AI Dose Calculator', icon: Calculator, count: null },
    { id: 'inventory', label: 'Inventory', icon: Package, count: null },
    { id: 'billing', label: 'Billing', icon: CreditCard, count: null },
    { id: 'reports', label: 'Reports', icon: BarChart3, count: null },
    { id: 'message-superadmin', label: 'Message Super Admin 💬', icon: MessageSquare, count: openTicketsCount > 0 ? `${openTicketsCount} Open` : null },
    { id: 'settings', label: 'Profile & Settings', icon: Settings, count: null },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-60px)]">
      <div className="space-y-4">
        {/* Universal Search Pet Button */}
        <button
          id="doctor-quick-pet-search-btn"
          onClick={() => setIsPetSearchOpen(true)}
          className="w-full p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 font-bold text-xs flex items-center justify-between transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
            <span>Search Pet 🔍</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-mono">
            Pet ID
          </span>
        </button>

        {/* Doctor Station Tag */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Clinician Station</span>
            </div>
            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">
              {adminProfile.registrationNumber || 'VET-REG-2024'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {adminProfile.name || 'Dr. Attending'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-teal-700 text-white'
                        : item.id === 'support'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Clinical Assist & Sign Out */}
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Shift Status
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Consultations & On Call
          </div>
        </div>

        <button
          id="doctor-sidebar-logout-btn"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-all shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / End Shift</span>
        </button>
      </div>
    </aside>
  );
};
