import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Building2,
  Stethoscope,
  HeartHandshake,
  Sun,
  Moon,
  Smartphone,
  AlertOctagon,
  LogOut,
  Search,
  Command,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AdminGlobalSearch } from '../admin/AdminGlobalSearch';
import { AndroidApkReleaseModal } from './AndroidApkReleaseModal';
import { AppDownloadButton } from './AppDownloadButton';

export const Header: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    userRole,
    setUserRole,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isSuperAdminAuthenticated,
    isOwnerAuthenticated,
    setIsOwnerAuthenticated,
    isDarkMode,
    setIsDarkMode,
    isAndroidFrameMode,
    setIsAndroidFrameMode,
    adminProfile,
    ownerProfile,
    selectedPet,
    setOwnerActiveTab,
    isAdminSearchOpen,
    setIsAdminSearchOpen,
    setIsPetSearchOpen,
    logout,
    showNotification,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const getRoleConfig = () => {
    switch (currentSection) {
      case 'super_admin':
        return {
          title: 'Super Admin',
          subtitle: 'App Owner & Platform HQ',
          badge: 'Super Admin',
          badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
          iconBg: 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white',
          Icon: ShieldAlert,
        };
      case 'doctor':
      case 'admin':
        return {
          title: 'Doctor Station',
          subtitle: `Dr. ${adminProfile.name} • ${adminProfile.clinicName || 'Veterinary Hospital'}`,
          badge: 'Doctor / Vet',
          badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
          iconBg: 'bg-gradient-to-tr from-teal-600 to-emerald-500 text-white',
          Icon: Stethoscope,
        };
      case 'owner':
      default:
        return {
          title: 'Pet Parent',
          subtitle: `Pet Portal • ${selectedPet?.name || 'My Pets'}`,
          badge: 'Pet Owner',
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white',
          Icon: HeartHandshake,
        };
    }
  };

  const roleConfig = getRoleConfig();
  const CurrentIcon = roleConfig.Icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Section Indicator */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${roleConfig.iconBg}`}>
            <CurrentIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                VetPulse
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleConfig.badgeClass}`}>
                {roleConfig.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {roleConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Universal Pet Search Button - Strictly restricted to Doctor and Super Admin only */}
          {currentSection !== 'owner' && (
            <button
              id="header-universal-pet-search-btn"
              onClick={() => setIsPetSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-bold transition-all shadow-2xs group"
              title="Search Pet by Name or Registration Number (Doctor & Super Admin)"
            >
              <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search Pet 🔍</span>
              <span className="sm:hidden">Pet 🔍</span>
            </button>
          )}

          {/* Admin / Doctor Global Search Button */}
          {(currentSection === 'admin' || currentSection === 'doctor') && isAdminAuthenticated && (
            <>
              <button
                onClick={() => setIsAdminSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs transition-all shadow-2xs group"
                title="Global Clinical Search (Ctrl+K or Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Search patients, Rx, records...
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-400">
                  <Command className="w-2.5 h-2.5" />K
                </span>
              </button>

              <button
                onClick={() => setIsAdminSearchOpen(true)}
                className="md:hidden p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </>
          )}

          {/* 4-Level Role Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Role:</span>
                <span>{roleConfig.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu for Roles */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 tracking-wider">
                  Select Active Workspace Role
                </div>

                {/* 1. Doctor / Veterinarian */}
                <button
                  onClick={() => {
                    setCurrentSection('doctor');
                    setUserRole('doctor');
                    setRoleDropdownOpen(false);
                    showNotification('Switched to Doctor / Veterinarian Station', 'info');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${
                    currentSection === 'doctor' || currentSection === 'admin'
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-300">
                    <Stethoscope className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold">Doctor / Veterinarian</div>
                    <div className="text-[10px] text-slate-500">Intake, SOAP, labs, imaging, Rx & clinical ops</div>
                  </div>
                </button>

                {/* 2. Owner / Pet Parent */}
                <button
                  onClick={() => {
                    setCurrentSection('owner');
                    setUserRole('owner');
                    setRoleDropdownOpen(false);
                    showNotification('Switched to Pet Parent Portal', 'info');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${
                    currentSection === 'owner'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300">
                    <HeartHandshake className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold">Owner / Pet Parent</div>
                    <div className="text-[10px] text-slate-500">My pets, health passports, appointments</div>
                  </div>
                </button>

                {/* 3. Super Admin */}
                <button
                  onClick={() => {
                    setCurrentSection('super_admin');
                    setUserRole('super_admin');
                    setRoleDropdownOpen(false);
                    showNotification('Switched to Super Admin (Platform Owner Control Panel)', 'success');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${
                    currentSection === 'super_admin'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      Super Admin (Platform HQ)
                      <span className="px-1.5 py-0.2 bg-rose-200 dark:bg-rose-800 text-[9px] rounded text-rose-900 dark:text-rose-100">HQ</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Doctors, owners, pets & platform governance</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick SOS Emergency Trigger Button */}
          <button
            onClick={() => {
              if (currentSection !== 'owner') setCurrentSection('owner');
              setOwnerActiveTab('emergency-first-aid');
              showNotification('Emergency SOS Activated — Showing immediate triage & contacts', 'error');
            }}
            title="Emergency SOS"
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-all animate-pulse-subtle"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">SOS Emergency</span>
          </button>

          {/* One-Tap Automatic Download Button (Device-Aware) */}
          <AppDownloadButton onOpenModal={() => setIsApkModalOpen(true)} />

          {/* Android Mobile Frame Simulation Toggle */}
          <button
            onClick={() => setIsAndroidFrameMode((prev) => !prev)}
            title={isAndroidFrameMode ? "Switch to Desktop Responsive View" : "Simulate Android Mobile App View"}
            className={`p-2 rounded-xl text-xs border transition-colors ${
              isAndroidFrameMode
                ? 'bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-950 dark:border-teal-700 dark:text-teal-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Global / Contextual Logout Button */}
          {((currentSection === 'owner' && isOwnerAuthenticated) ||
            ((currentSection === 'admin' || currentSection === 'doctor') && isAdminAuthenticated) ||
            (currentSection === 'super_admin' && isSuperAdminAuthenticated)) && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <button
                id="header-btn-logout"
                onClick={logout}
                title={`Log out of ${roleConfig.title} session`}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs group"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Admin Search Modal */}
      {(currentSection === 'admin' || currentSection === 'doctor') && (
        <AdminGlobalSearch
          isOpen={isAdminSearchOpen}
          onClose={() => setIsAdminSearchOpen(false)}
        />
      )}

      {/* Android App & APK Release Modal */}
      <AndroidApkReleaseModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </header>
  );
};
