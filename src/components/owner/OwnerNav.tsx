import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Calendar,
  AlertOctagon,
  Home,
  LogOut,
  User,
} from 'lucide-react';

export const OWNER_NAV_ITEMS = [
  { id: 'dashboard', label: 'Pet Home', icon: Home },
  { id: 'my-pets', label: 'My Companions', icon: Heart },
  { id: 'book-appointment', label: 'Book Vet Visit', icon: Calendar },
  { id: 'emergency-first-aid', label: 'First Aid & Poison', icon: AlertOctagon },
];

export const OwnerNav: React.FC = () => {
  const {
    ownerActiveTab,
    setOwnerActiveTab,
    ownerProfile,
    setIsOwnerAuthenticated,
    showNotification,
  } = useApp();

  const handleLogout = () => {
    setIsOwnerAuthenticated(false);
    showNotification('Signed out from pet guardian portal', 'info');
  };

  return (
    <>
      {/* Desktop / Tablet Sub-Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {OWNER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = ownerActiveTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setOwnerActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Owner Profile / Logout Button */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {ownerProfile?.photoURL ? (
                  <img
                    src={ownerProfile.photoURL}
                    alt={ownerProfile.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-300 dark:border-amber-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {ownerProfile?.name || 'Pet Parent'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">
                    {ownerProfile?.email || 'owner@portal'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out of Owner Portal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Android style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {OWNER_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = ownerActiveTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setOwnerActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
