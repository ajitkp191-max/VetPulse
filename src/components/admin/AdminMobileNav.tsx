import React from 'react';
import { useApp } from '../../context/AppContext';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';

export const AdminMobileNav: React.FC = () => {
  const { adminActiveTab, setAdminActiveTab } = useApp();

  return (
    <div className="lg:hidden sticky top-[61px] z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs px-2 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
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
