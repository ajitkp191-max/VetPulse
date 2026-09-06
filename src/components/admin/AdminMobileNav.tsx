import React from 'react';
import { useApp } from '../../context/AppContext';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';
import { Search } from 'lucide-react';

export const AdminMobileNav: React.FC = () => {
  const { adminActiveTab, setAdminActiveTab, setIsAdminSearchOpen } = useApp();

  return (
    <div className="lg:hidden sticky top-[61px] z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs px-2 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
      {/* Mobile Search Button */}
      <button
        onClick={() => setIsAdminSearchOpen(true)}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors shadow-2xs"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
      </button>

      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = adminActiveTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setAdminActiveTab(item.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
