import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Stethoscope,
  Shield,
  Filter,
  Search,
  User,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const SuperAdminSupportHub: React.FC = () => {
  const {
    supportTickets,
    sendSupportMessage,
    updateSupportTicketStatus,
    showNotification,
  } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(
    supportTickets.length > 0 ? supportTickets[0].id : null
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');

  const filteredTickets = supportTickets.filter((tkt) => {
    const matchesStatus = filterStatus === 'all' || tkt.status.toLowerCase() === filterStatus.toLowerCase();
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tkt.ticketNumber.toLowerCase().includes(q) ||
      tkt.subject.toLowerCase().includes(q) ||
      tkt.senderName.toLowerCase().includes(q) ||
      tkt.senderRegNumber.toLowerCase().includes(q) ||
      tkt.clinicName.toLowerCase().includes(q)
    );
  });

  const activeTicket = supportTickets.find((t) => t.id === activeTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !replyText.trim()) return;

    sendSupportMessage(
      activeTicketId,
      replyText.trim(),
      'super_admin',
      'Platform Super Admin Support Team',
      'super_admin_core'
    );

    // If ticket was Open, mark as In-Progress automatically on admin reply
    if (activeTicket && activeTicket.status === 'Open') {
      updateSupportTicketStatus(activeTicketId, 'In-Progress');
    }

    setReplyText('');
    showNotification('Reply sent to clinician / clinic manager.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-300" />
                <span>Centralized Support & Helpdesk Operations</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200">
                ⚡ Real-time Dispatch
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>Doctor & Clinic Queries Management Hub</span>
              <span>💬</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Communicate directly with registered veterinarians and clinic managers, resolve operational queries, and maintain platform audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 text-center min-w-[100px]">
              <div className="text-xs text-slate-400">Total Queries</div>
              <div className="text-xl font-bold text-white">{supportTickets.length}</div>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 text-center min-w-[100px]">
              <div className="text-xs text-amber-400">Open / Pending</div>
              <div className="text-xl font-bold text-amber-400">
                {supportTickets.filter((t) => t.status !== 'Resolved').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          {/* Search and Filters */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, doctor, clinic, reg number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Queries' },
                { id: 'open', label: '🟢 Open' },
                { id: 'in-progress', label: '🟡 In-Progress' },
                { id: 'resolved', label: '🔵 Resolved' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterStatus === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No tickets matching criteria
                </p>
              </div>
            ) : (
              filteredTickets.map((tkt) => {
                const isSelected = activeTicketId === tkt.id;
                return (
                  <div
                    key={tkt.id}
                    onClick={() => setActiveTicketId(tkt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {tkt.ticketNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tkt.senderRole === 'doctor'
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          }`}
                        >
                          {tkt.senderRole === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Clinic Mgr'}
                        </span>
                      </div>

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

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tkt.senderName}
                      </span>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                        {tkt.senderRegNumber}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[150px]">{tkt.clinicName}</span>
                      <span>{new Date(tkt.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Super Admin Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs min-h-[500px] flex flex-col justify-between">
          {activeTicket ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Ticket Top Meta & Status Changer */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                        {activeTicket.ticketNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                        {activeTicket.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Priority: <strong className="text-slate-700 dark:text-slate-300">{activeTicket.priority}</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {activeTicket.subject}
                    </h3>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateSupportTicketStatus(activeTicket.id, 'In-Progress')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                      title="Set In-Progress"
                    >
                      🟡 In-Progress
                    </button>
                    <button
                      onClick={() => updateSupportTicketStatus(activeTicket.id, 'Resolved')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                      title="Mark as Resolved"
                    >
                      ✅ Resolve
                    </button>
                  </div>
                </div>

                {/* Sender Dossier Card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submitted By:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeTicket.senderName}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{activeTicket.senderEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registration Number:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{activeTicket.senderRegNumber}</span>
                    <span className="text-[10px] text-slate-500 block">{activeTicket.senderRole.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hospital / Facility:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{activeTicket.clinicName}</span>
                  </div>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 max-h-[300px]">
                {activeTicket.messages.map((msg) => {
                  const isSuperAdmin = msg.senderRole === 'super_admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSuperAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                          {isSuperAdmin ? '🛡️ Super Admin Team (You)' : `👨‍⚕️ ${msg.senderName}`}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isSuperAdmin
                            ? 'bg-indigo-600 text-white rounded-tr-xs shadow-2xs font-medium'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Super Admin Reply Box */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeTicket.senderName} (${activeTicket.senderRegNumber})...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto py-12 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                💬
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Select a Query to Open Chat
              </h3>
              <p className="text-xs text-slate-500">
                Pick a ticket from the left panel to review message thread and respond.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
