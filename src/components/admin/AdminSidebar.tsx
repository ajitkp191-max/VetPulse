import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FlaskConical,
  Scan,
  Activity,
  Zap,
  Scissors,
  ShieldCheck,
  Bug,
  FileText,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Command,
  LogOut,
  User,
  MessageSquare,
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients / Animals 🐾', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'consultation', label: 'Consultation', icon: Stethoscope },
  { id: 'laboratory', label: 'Laboratory (Biochem/CBC)', icon: FlaskConical },
  { id: 'imaging', label: 'Imaging (X-Ray/USG)', icon: Scan },
  { id: 'ecg', label: 'ECG Diagnostics', icon: Activity },
  { id: 'multiparameter-diagnostic', label: 'AI Diagnostic Fusion', icon: Zap },
  { id: 'surgery', label: 'Surgery Library', icon: Scissors },
  { id: 'vaccination', label: 'Vaccination', icon: ShieldCheck },
  { id: 'deworming', label: 'Deworming', icon: Bug },
  { id: 'prescription', label: 'Prescription Rx', icon: FileText },
  { id: 'inventory', label: 'Inventory / Drugs', icon: Package },
  { id: 'billing', label: 'Billing & Invoicing', icon: CreditCard },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'support', label: 'Super Admin Helpdesk', icon: MessageSquare },
  { id: 'settings', label: 'Clinic Settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { adminActiveTab, setAdminActiveTab, adminProfile, setIsAdminSearchOpen, setIsPetSearchOpen, logout } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      {/* Clinic & Doctor Badge */}
      <div className="p-3 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-100 dark:border-teal-900/60 mb-3">
        <div className="flex items-center gap-2.5">
          {adminProfile.profilePhoto && adminProfile.profilePhoto.trim() !== '' ? (
            <img
              src={adminProfile.profilePhoto}
              alt={adminProfile.name}
              className="w-10 h-10 rounded-xl object-cover border border-teal-200 dark:border-teal-800 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-200 dark:border-teal-800">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {adminProfile.name}
            </h4>
            <p className="text-[10px] text-teal-700 dark:text-teal-300 truncate">
              {adminProfile.specialization.split('&')[0]}
            </p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
              {adminProfile.registrationNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Search Trigger Input */}
      <button
        onClick={() => setIsAdminSearchOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-medium mb-4 transition-all shadow-2xs group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-500 dark:text-slate-400">Search Records...</span>
        </div>
        <kbd className="text-[9px] font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Navigation Links */}
      <div className="space-y-1 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
          Clinical Modules
        </div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = adminActiveTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Actions & Logout */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          id="admin-sidebar-logout-btn"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-all shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / End Shift</span>
        </button>
        <div className="text-[10px] text-slate-400 text-center">
          <span>VetPulse Clinical OS v2.6</span>
        </div>
      </div>
    </aside>
  );
};
