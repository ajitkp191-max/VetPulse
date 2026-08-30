import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  HeartHandshake,
  Sun,
  Moon,
  Smartphone,
  AlertOctagon,
  ShieldCheck,
  Building2,
  Calendar,
  LogOut,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isOwnerAuthenticated,
    setIsOwnerAuthenticated,
    isDarkMode,
    setIsDarkMode,
    isAndroidFrameMode,
    setIsAndroidFrameMode,
    adminProfile,
    selectedPet,
    setOwnerActiveTab,
    showNotification,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Section Indicator */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${
            currentSection === 'admin'
              ? 'bg-gradient-to-tr from-teal-600 to-emerald-500 text-white'
              : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
          }`}>
            {currentSection === 'admin' ? (
              <Stethoscope className="w-5 h-5" />
            ) : (
              <HeartHandshake className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                VetPulse
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                currentSection === 'admin'
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}>
                {currentSection === 'admin' ? 'Clinic Admin' : 'Pet Parent'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentSection === 'admin'
                ? adminProfile.clinicName
                : `Pet Care Portal • Viewing ${selectedPet?.name || 'Pet'}`}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Main Section Switcher Button */}
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setCurrentSection('admin');
                showNotification('Switched to Clinic & Veterinarian Admin Workspace', 'info');
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentSection === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin / Doctor</span>
              <span className="md:hidden">Admin</span>
            </button>
            <button
              onClick={() => {
                setCurrentSection('owner');
                showNotification('Switched to Pet Owner Portal & Digital Health Card', 'info');
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentSection === 'owner'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pet Owner</span>
              <span className="md:hidden">Owner</span>
            </button>
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

          {/* Admin / Owner Logout simulation */}
          {currentSection === 'admin' && isAdminAuthenticated && (
            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                showNotification('Logged out of Admin Portal', 'info');
              }}
              title="Logout / Switch Account"
              className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {currentSection === 'owner' && isOwnerAuthenticated && (
            <button
              onClick={() => {
                setIsOwnerAuthenticated(false);
                showNotification('Logged out of Pet Guardian Portal', 'info');
              }}
              title="Logout / Switch Owner Account"
              className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
