import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  PlusCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Stethoscope,
  User,
  Shield,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { SupportTicket, SupportMessage } from '../../types';

interface SupportQueryDeskProps {
  role: 'doctor' | 'admin';
}

export const SupportQueryDesk: React.FC<SupportQueryDeskProps> = ({ role }) => {
  const {
    adminProfile,
    supportTickets,
    addSupportTicket,
    sendSupportMessage,
    showNotification,
  } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  // New ticket state
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<SupportTicket['category']>('Technical / App Bug');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [initialMessage, setInitialMessage] = useState<string>('');

  // Filter tickets relevant to this doctor or clinic manager (or all tickets submitted from this session)
  const myTickets = supportTickets.filter(
    (t) =>
      t.senderRole === role ||
      t.senderEmail === adminProfile.email ||
      t.senderRegNumber === adminProfile.registrationNumber
  );

  const activeTicket = supportTickets.find((t) => t.id === activeTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) {
      showNotification('Please provide both a subject and details for your query.', 'warning');
      return;
    }

    const newTicket = addSupportTicket(
      {
        senderRole: role,
        senderName: adminProfile.name || (role === 'doctor' ? 'Dr. Attending Veterinarian' : 'Clinic Manager'),
        senderEmail: adminProfile.email || 'doctor@hospital.com',
        senderId: adminProfile.id || `user_${Date.now()}`,
        senderRegNumber: adminProfile.registrationNumber || 'VET-REG-2024-8891',
        clinicName: adminProfile.clinicName || 'Metropolitan Veterinary Referral Hospital',
        subject: subject.trim(),
        category,
        priority,
      },
      initialMessage.trim()
    );

    setSubject('');
    setInitialMessage('');
    setIsCreatingTicket(false);
    setActiveTicketId(newTicket.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !replyText.trim()) return;

    sendSupportMessage(
      activeTicketId,
      replyText.trim(),
      role,
      adminProfile.name || (role === 'doctor' ? 'Dr. Attending Veterinarian' : 'Clinic Manager'),
      adminProfile.id
    );

    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-900/60 border border-teal-400/30 text-xs font-semibold text-teal-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-300" />
                <span>Super Admin Helpdesk & Inquiries</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200">
                🟢 Direct Channel Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>Support & Query Desk</span>
              <span>💬</span>
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
              Submit issues, license verifications, DICOM/radiology integrations, or queries directly to the Platform Super Admin and chat in real-time.
            </p>
          </div>

          <button
            id="create-new-query-ticket-btn"
            onClick={() => {
              setIsCreatingTicket(true);
              setActiveTicketId(null);
            }}
            className="px-4 py-2.5 bg-white hover:bg-teal-50 text-teal-900 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md self-start sm:self-center shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>New Query to Super Admin</span>
          </button>
        </div>
      </div>

      {/* Main Support Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>My Query Tickets ({myTickets.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Reg: {adminProfile.registrationNumber || 'VET-REG-2024'}
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto">
            {myTickets.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-xl">
                  📬
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No support tickets raised yet
                </p>
                <p className="text-[11px] text-slate-500">
                  Click "New Query to Super Admin" above if you encounter any issue or need assistance.
                </p>
              </div>
            ) : (
              myTickets.map((tkt) => {
                const isSelected = activeTicketId === tkt.id;
                return (
                  <div
                    key={tkt.id}
                    onClick={() => {
                      setActiveTicketId(tkt.id);
                      setIsCreatingTicket(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {tkt.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tkt.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : tkt.status === 'In-Progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {tkt.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {tkt.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                      <span className="truncate max-w-[120px]">{tkt.category}</span>
                      <span>{new Date(tkt.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Details & Chat or New Ticket Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs min-h-[460px] flex flex-col justify-between">
          {isCreatingTicket ? (
            /* Create Ticket Form */
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Submit Query to Super Admin</span>
                    <span>📝</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your name and registration number will be automatically attached.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              {/* Sender Details Readout */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Sender Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{adminProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registration Number:</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{adminProfile.registrationNumber || 'VET-REG-2024-8891'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hospital / Clinic:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{adminProfile.clinicName}</span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Query Subject / Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Need assistance setting up DICOM scanner bridge in Surgery Room"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Technical / App Bug">Technical / App Bug ⚙️</option>
                    <option value="Licensing & Verification">Licensing & Verification 📜</option>
                    <option value="Patient / Case Assistance">Patient / Case Assistance 🐾</option>
                    <option value="Inventory / Pharmacy Request">Inventory / Pharmacy Request 💊</option>
                    <option value="Billing & Platform Support">Billing & Platform Support 💳</option>
                    <option value="Other Query">Other Query ❓</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority 🔥</option>
                    <option value="Urgent">Urgent / Emergency 🚨</option>
                  </select>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Query / Message for Super Admin *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or query thoroughly. The Super Admin team will review and reply in this thread."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket to Super Admin</span>
                </button>
              </div>
            </form>
          ) : activeTicket ? (
            /* Active Ticket Thread & Live Chat */
            <div className="flex flex-col h-full space-y-4">
              {/* Ticket Top Info */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                      {activeTicket.ticketNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        activeTicket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : activeTicket.status === 'In-Progress'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {activeTicket.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Priority: <strong className="text-slate-700 dark:text-slate-300">{activeTicket.priority}</strong>
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                    {activeTicket.subject}
                  </h3>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <div>Opened: {new Date(activeTicket.createdAt).toLocaleDateString()}</div>
                  <div className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{activeTicket.senderRegNumber}</div>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 max-h-[320px]">
                {activeTicket.messages.map((msg) => {
                  const isSuperAdmin = msg.senderRole === 'super_admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSuperAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                          {isSuperAdmin ? '🛡️ Super Admin Team' : `👨‍⚕️ ${msg.senderName}`}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isSuperAdmin
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-xs shadow-2xs'
                            : 'bg-teal-600 text-white rounded-tr-xs shadow-2xs font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type your reply to Super Admin..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            /* Empty selection state */
            <div className="flex flex-col items-center justify-center my-auto py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center text-3xl">
                💬
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Support & Super Admin Direct Desk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Select an existing query from the left to view messages and replies, or create a new query ticket.
              </p>
              <button
                onClick={() => setIsCreatingTicket(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Ticket</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
