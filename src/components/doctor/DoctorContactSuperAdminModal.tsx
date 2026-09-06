import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import {
  MessageSquare,
  Send,
  X,
  Shield,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Stethoscope,
  Building2,
  FileEdit,
} from 'lucide-react';

interface DoctorContactSuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  defaultCategory?: SupportTicket['category'];
  onOpenFullHelpdesk?: () => void;
}

export const DoctorContactSuperAdminModal: React.FC<DoctorContactSuperAdminModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = '',
  defaultCategory = 'Technical / App Bug',
  onOpenFullHelpdesk,
}) => {
  const { adminProfile, addSupportTicket, showNotification } = useApp();

  const [subject, setSubject] = useState(defaultSubject);
  const [category, setCategory] = useState<SupportTicket['category']>(defaultCategory);
  const [priority, setPriority] = useState<SupportTicket['priority']>('High');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showNotification('Please enter a subject and message for the Super Admin.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const ticket = addSupportTicket(
        {
          senderRole: 'doctor',
          senderName: adminProfile.name || 'Dr. Attending Veterinarian',
          senderEmail: adminProfile.email || 'doctor@hospital.com',
          senderId: adminProfile.id || `doc_${Date.now()}`,
          senderRegNumber: adminProfile.registrationNumber || adminProfile.licenseNumber || 'VET-REG-2024',
          clinicName: adminProfile.clinicName || 'Veterinary Clinical Center',
          subject: subject.trim(),
          category,
          priority,
        },
        message.trim()
      );

      showNotification('Direct message sent to Super Admin successfully! Real-time ticket created.', 'success');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
      onClose();

      if (onOpenFullHelpdesk) {
        onOpenFullHelpdesk();
      }
    } catch (err) {
      setIsSubmitting(false);
      showNotification('Failed to dispatch message to Super Admin. Please retry.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Direct Message to Super Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Priority Channel
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contact platform administration directly for changes, system issues, or operational requests.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Meta Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {adminProfile.name || 'Dr. Attending'}
              </span>
              <span className="text-slate-400 text-[11px] block">
                {adminProfile.clinicName || 'Clinical Veterinary Hospital'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
              Reg: {adminProfile.registrationNumber || adminProfile.licenseNumber || 'VET-REG'}
            </span>
          </div>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Issue / Request Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              <option value="Technical / App Bug">Technical Bug / Application Issue</option>
              <option value="Account / Profile Change">Account / Profile / Clinic Info Change</option>
              <option value="Billing & License">Billing, Subscription & Verification</option>
              <option value="Clinical Feature Request">Clinical Feature / UI Request</option>
              <option value="General Query">General Administration Query / Problem</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Topic *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request to correct registered patient data / Dose bug"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Urgent)</option>
                <option value="Critical">Critical (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Details *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue, requested changes, pet record ID, or question in detail for the Super Admin..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {onOpenFullHelpdesk && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullHelpdesk();
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>View Previous Messages & Tickets</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message to Admin'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
