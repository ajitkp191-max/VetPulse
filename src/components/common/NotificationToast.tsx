import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-teal-700 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white',
  }[notification.type];

  const Icon = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
  }[notification.type];

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-xs sm:text-sm font-medium leading-snug">{notification.message}</p>
      </div>
    </div>
  );
};
