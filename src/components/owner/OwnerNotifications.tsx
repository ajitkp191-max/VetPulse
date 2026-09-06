import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Calendar,
  ShieldCheck,
  FileText,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Filter,
  CheckCheck,
  Heart,
  Pill,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category:
    | 'appointment_confirmation'
    | 'appointment_reminder'
    | 'prescription'
    | 'vaccination_reminder'
    | 'deworming_reminder'
    | 'doctor_message'
    | 'medical_update';
  title: string;
  message: string;
  timestamp: string;
  petName?: string;
  isRead: boolean;
  priority: 'urgent' | 'important' | 'routine';
}

export const OwnerNotifications: React.FC = () => {
  const {
    ownerPets,
    ownerAppointments,
    ownerPrescriptions,
    ownerVaccinations,
    ownerDewormings,
    adminProfile,
    showNotification,
  } = useApp();

  // Synthesize notifications from real live records
  const generateLiveNotifications = (): NotificationItem[] => {
    const list: NotificationItem[] = [];

    // 1. Appointment Confirmations & Reminders
    ownerAppointments.forEach((apt) => {
      if (apt.status === 'Confirmed') {
        list.push({
          id: `apt-conf-${apt.id}`,
          category: 'appointment_confirmation',
          title: `Appointment Confirmed for ${apt.petName}`,
          message: `Your visit with ${apt.veterinarianAssigned || adminProfile.name} on ${apt.date} at ${apt.time} has been officially confirmed.`,
          timestamp: apt.date,
          petName: apt.petName,
          isRead: false,
          priority: 'important',
        });
      }

      list.push({
        id: `apt-rem-${apt.id}`,
        category: 'appointment_reminder',
        title: `Upcoming Clinic Visit: ${apt.petName}`,
        message: `Reminder: Scheduled for "${apt.type}" on ${apt.date} at ${apt.time}. Please arrive 10 minutes before your slot.`,
        timestamp: apt.date,
        petName: apt.petName,
        isRead: false,
        priority: 'routine',
      });
    });

    // 2. Prescriptions
    ownerPrescriptions.forEach((rx) => {
      list.push({
        id: `rx-${rx.id}`,
        category: 'prescription',
        title: `Prescription Available - ${rx.petName}`,
        message: `Dr. ${rx.veterinarianName} issued Rx #${rx.prescriptionNumber} with ${rx.items.length} prescribed medications. Download or print your copy.`,
        timestamp: rx.date,
        petName: rx.petName,
        isRead: false,
        priority: 'important',
      });
    });

    // 3. Vaccination Reminders
    ownerVaccinations.forEach((v) => {
      list.push({
        id: `vac-${v.id}`,
        category: 'vaccination_reminder',
        title: `Vaccine Booster Due - ${v.petName}`,
        message: `${v.vaccineName} booster is scheduled for ${v.nextDueDate}. Active immunity requires booster administration.`,
        timestamp: v.nextDueDate,
        petName: v.petName,
        isRead: false,
        priority: 'urgent',
      });
    });

    // 4. Deworming Reminders
    ownerDewormings.forEach((d) => {
      list.push({
        id: `dew-${d.id}`,
        category: 'deworming_reminder',
        title: `Deworming Scheduled - ${d.petName}`,
        message: `Next prophylactic deworming dose (${d.drugUsed}) is due on ${d.nextDueDate}.`,
        timestamp: d.nextDueDate,
        petName: d.petName,
        isRead: false,
        priority: 'routine',
      });
    });

    // 5. Doctor message / Important medical update defaults
    if (ownerPets.length > 0) {
      list.push({
        id: 'doc-msg-welcome',
        category: 'doctor_message',
        title: `Welcome to ${adminProfile.clinicName}`,
        message: `Welcome! Our veterinary team is available for preventive healthcare, microchipping, and emergency care at ${adminProfile.contactNumber}.`,
        timestamp: 'Just now',
        petName: ownerPets[0].name,
        isRead: false,
        priority: 'routine',
      });
      list.push({
        id: 'med-update-1',
        category: 'medical_update',
        title: `Seasonal Health Advisory for Pets`,
        message: `Warm weather alert: Check your dogs and cats for ticks and ensure adequate hydration during peak daytime heat.`,
        timestamp: 'Today',
        isRead: false,
        priority: 'important',
      });
    }

    return list;
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>(generateLiveNotifications);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterCategory === 'all') return true;
    return n.category === filterCategory;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showNotification('All notifications marked as read', 'success');
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showNotification('Notification dismissed', 'info');
  };

  const getCategoryBadge = (cat: NotificationItem['category']) => {
    switch (cat) {
      case 'appointment_confirmation':
        return { label: 'Appointment Confirmed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', icon: CheckCircle2 };
      case 'appointment_reminder':
        return { label: 'Appointment Reminder', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', icon: Calendar };
      case 'prescription':
        return { label: 'Prescription Ready', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300', icon: FileText };
      case 'vaccination_reminder':
        return { label: 'Vaccination Due', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', icon: ShieldCheck };
      case 'deworming_reminder':
        return { label: 'Deworming Due', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', icon: Pill };
      case 'doctor_message':
        return { label: 'Doctor Message', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300', icon: MessageSquare };
      case 'medical_update':
      default:
        return { label: 'Medical Update', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300', icon: AlertTriangle };
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Reminders & Clinical Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Timely alerts for appointments, vaccinations, dewormings, prescriptions, and clinician communications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'appointment_confirmation', label: 'Confirmations' },
          { id: 'appointment_reminder', label: 'Appointment Reminders' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'vaccination_reminder', label: 'Vaccines' },
          { id: 'deworming_reminder', label: 'Deworming' },
          { id: 'doctor_message', label: 'Doctor Messages' },
          { id: 'medical_update', label: 'Medical Updates' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterCategory(chip.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === chip.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Notifications in This Category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're completely up to date with your companion's veterinary health schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = getCategoryBadge(item.category);
            const Icon = badge.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                  item.isRead
                    ? 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-teal-300 dark:border-teal-700 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      {item.petName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.petName}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.timestamp}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-center">
                  <button
                    onClick={() => toggleRead(item.id)}
                    title={item.isRead ? 'Mark unread' : 'Mark read'}
                    className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${item.isRead ? 'text-teal-500' : 'text-slate-300'}`} />
                  </button>
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Dismiss"
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
