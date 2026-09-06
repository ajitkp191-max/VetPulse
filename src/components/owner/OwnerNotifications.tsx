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
  Smartphone,
  Send,
  Zap,
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

  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>('granted');

  const handleTogglePush = () => {
    const nextState = !pushEnabled;
    setPushEnabled(nextState);
    if (nextState) {
      setPushPermissionStatus('granted');
      showNotification('Push notifications enabled successfully! You will receive instant alerts for upcoming vaccinations & dewormings.', 'success');
    } else {
      setPushPermissionStatus('disabled');
      showNotification('Push notifications disabled', 'info');
    }
  };

  const handleTestPushNotification = () => {
    if (!pushEnabled) {
      showNotification('Please enable push notifications first.', 'error');
      return;
    }
    const samplePet = ownerPets[0]?.name || 'Your Pet';
    showNotification(`🔔 [Push Notification Sent]: Vaccine Booster Due for ${samplePet}! Please schedule your visit.`, 'success');
  };

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

    // 3. Vaccination Reminders (High Priority)
    ownerVaccinations.forEach((v) => {
      list.push({
        id: `vac-${v.id}`,
        category: 'vaccination_reminder',
        title: `Vaccine Booster Due - ${v.petName}`,
        message: `${v.vaccineName} booster is scheduled for ${v.nextDueDate}. Active immunity requires timely booster administration.`,
        timestamp: v.nextDueDate,
        petName: v.petName,
        isRead: false,
        priority: 'urgent',
      });
    });

    // 4. Deworming Reminders (High Priority)
    ownerDewormings.forEach((d) => {
      list.push({
        id: `dew-${d.id}`,
        category: 'deworming_reminder',
        title: `Deworming Scheduled - ${d.petName}`,
        message: `Next prophylactic deworming dose (${d.drugUsed}) is due on ${d.nextDueDate}. Protect against internal parasites.`,
        timestamp: d.nextDueDate,
        petName: d.petName,
        isRead: false,
        priority: 'urgent',
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
  const vaccinationDueCount = ownerVaccinations.length;
  const dewormingDueCount = ownerDewormings.length;

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
                App Notifications & Push Alerts
              </h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scheduled vaccination boosters, parasite deworming doses, clinic appointment reminders & push notification controls.
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

      {/* Push Notification Controls & Status Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 border border-teal-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Browser & Mobile Push Notifications</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                pushEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {pushEnabled ? 'Push Active' : 'Push Muted'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Get immediate alerts when your pet's vaccination boosters or deworming tablets are due.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleTogglePush}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              pushEnabled
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {pushEnabled ? 'Disable Push' : 'Enable Push Notifications'}
          </button>
          <button
            onClick={handleTestPushNotification}
            className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Push Alert</span>
          </button>
        </div>
      </div>

      {/* Upcoming Vaccination & Deworming Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-500/10 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Upcoming Vaccinations Due</h4>
              <p className="text-lg font-black text-rose-600 dark:text-rose-400">{vaccinationDueCount} Active Reminders</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
            Booster Alerts On
          </span>
        </div>

        <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Deworming Schedules Due</h4>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{dewormingDueCount} Active Reminders</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Parasite Protection On
          </span>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'vaccination_reminder', label: `Vaccines (${ownerVaccinations.length})` },
          { id: 'deworming_reminder', label: `Deworming (${ownerDewormings.length})` },
          { id: 'appointment_reminder', label: 'Appointments' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'doctor_message', label: 'Doctor Messages' },
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

