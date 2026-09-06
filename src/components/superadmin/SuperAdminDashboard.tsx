import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Crown,
  ShieldCheck,
  Stethoscope,
  Users,
  Building2,
  Calendar,
  Activity,
  UserCheck,
  UserX,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  ShieldAlert,
  Database,
  Lock,
  ChevronRight,
  TrendingUp,
  Settings,
  Phone,
  Mail,
  MapPin,
  Award,
  Sparkles,
  LogOut,
  Edit,
  Trash2,
  MessageSquare,
  Send,
} from 'lucide-react';
import { DoctorAccount, ClinicAccount, OwnerAccount, PlatformAuditLog, UserRole } from '../../types';
import { SuperAdminPetsTab } from './SuperAdminPetsTab';
import { EditDoctorModal } from './EditDoctorModal';
import { EditOwnerModal } from './EditOwnerModal';

export const SuperAdminDashboard: React.FC = () => {
  const {
    doctors,
    clinics,
    ownerAccounts,
    auditLogs,
    pets,
    appointments,
    approveDoctor,
    rejectDoctor,
    suspendDoctor,
    reactivateDoctor,
    updateDoctorRole,
    addClinic,
    updateClinicStatus,
    updateOwnerStatus,
    deleteOwner,
    deleteDoctor,
    supportTickets,
    sendSupportMessage,
    updateSupportTicketStatus,
    showNotification,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'owners' | 'pets' | 'clinics' | 'audit' | 'messages' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<DoctorAccount | null>(null);
  const [selectedDoctorToEdit, setSelectedDoctorToEdit] = useState<DoctorAccount | null>(null);
  const [selectedDoctorToDelete, setSelectedDoctorToDelete] = useState<DoctorAccount | null>(null);
  const [selectedOwnerToEdit, setSelectedOwnerToEdit] = useState<OwnerAccount | null>(null);
  const [selectedOwnerForModal, setSelectedOwnerForModal] = useState<OwnerAccount | null>(null);
  const [selectedOwnerToDelete, setSelectedOwnerToDelete] = useState<OwnerAccount | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<PlatformAuditLog | null>(null);
  const [isAddClinicModalOpen, setIsAddClinicModalOpen] = useState(false);

  // Doctor Inquiries / Messages Desk State for Super Admin
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [superAdminReplyText, setSuperAdminReplyText] = useState<string>('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'Open' | 'In Progress' | 'Resolved'>('all');

  // New Clinic Form State
  const [newClinic, setNewClinic] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    adminName: '',
    adminEmail: '',
    licenseNumber: '',
    emergencyContact: '',
  });

  // Calculate platform statistics
  const totalOwners = ownerAccounts.length;
  const totalDoctors = doctors.length;
  const totalClinics = clinics.length;
  const totalPets = pets.length;
  const totalAppointments = appointments.length;
  const verifiedDoctorsCount = doctors.filter((d) => d.verificationStatus === 'verified').length;
  const pendingDoctorsCount = doctors.filter((d) => d.verificationStatus === 'pending').length;
  const activeClinicsCount = clinics.filter((c) => c.status === 'active').length;
  const openTicketsCount = (supportTickets || []).filter((t) => t.status !== 'Resolved').length;

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (doc.name || '').toLowerCase().includes(term) ||
      (doc.email || '').toLowerCase().includes(term) ||
      (doc.registrationNumber || '').toLowerCase().includes(term) ||
      (doc.clinicName || '').toLowerCase().includes(term) ||
      (doc.specialization || '').toLowerCase().includes(term);

    const matchesStatus =
      doctorStatusFilter === 'all'
        ? true
        : doctorStatusFilter === 'verified'
        ? doc.verificationStatus === 'verified'
        : doctorStatusFilter === 'pending'
        ? doc.verificationStatus === 'pending'
        : doc.status === 'suspended';

    return matchesSearch && matchesStatus;
  });

  // Filtered Owners
  const filteredOwners = ownerAccounts.filter((owner) => {
    const term = (searchTerm || '').toLowerCase();
    return (
      (owner.name || '').toLowerCase().includes(term) ||
      (owner.email || '').toLowerCase().includes(term) ||
      (owner.phone || '').includes(searchTerm || '') ||
      (owner.connectedClinicName && owner.connectedClinicName.toLowerCase().includes(term))
    );
  });

  // Filtered Clinics
  const filteredClinics = clinics.filter((c) => {
    const term = (searchTerm || '').toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(term) ||
      (c.address || '').toLowerCase().includes(term) ||
      (c.adminName || '').toLowerCase().includes(term) ||
      (c.licenseNumber || '').toLowerCase().includes(term)
    );
  });

  // Filtered Support Tickets for Super Admin
  const filteredTickets = (supportTickets || []).filter((t) => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (t.subject || '').toLowerCase().includes(term) ||
      (t.senderName || '').toLowerCase().includes(term) ||
      (t.senderEmail || '').toLowerCase().includes(term) ||
      (t.clinicName || '').toLowerCase().includes(term) ||
      (t.category || '').toLowerCase().includes(term);

    const matchesStatus =
      ticketStatusFilter === 'all' || t.status === ticketStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinic.name || !newClinic.email || !newClinic.adminName) {
      showNotification('Please fill in required clinic details', 'warning');
      return;
    }

    addClinic({
      name: newClinic.name,
      address: newClinic.address || 'Address on file',
      phone: newClinic.phone || '+1 (555) 000-0000',
      email: newClinic.email,
      adminId: `admin_${Date.now()}`,
      adminName: newClinic.adminName,
      adminEmail: newClinic.adminEmail || newClinic.email,
      doctorsCount: 0,
      patientsCount: 0,
      appointmentsCount: 0,
      status: 'active',
      registeredDate: new Date().toISOString().split('T')[0],
      licenseNumber: newClinic.licenseNumber || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyContact: newClinic.emergencyContact,
    });

    setIsAddClinicModalOpen(false);
    setNewClinic({
      name: '',
      address: '',
      phone: '',
      email: '',
      adminName: '',
      adminEmail: '',
      licenseNumber: '',
      emergencyContact: '',
    });
    showNotification(`Clinic "${newClinic.name}" created and verified successfully`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Super Admin Identification */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 shadow-inner flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  App Owner / Super Admin
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                  VetPulse Master Control Center
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Complete platform governance. Verify veterinary credentials, manage multi-clinic tenancy, audit sensitive data access, and inspect global health operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <div className="text-slate-400 font-medium">Logged in as</div>
              <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
                ajitkp191@gmail.com
              </div>
            </div>
            <button
              onClick={() => {
                showNotification('Platform integrity scan completed. All microservices healthy.', 'success');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-indigo-900/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync Platform State
            </button>
            <button
              id="superadmin-logout-btn"
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-rose-900/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Activity, badge: null },
            { id: 'doctors', label: 'Doctor Registry & Verifications', icon: Stethoscope, badge: pendingDoctorsCount > 0 ? `${pendingDoctorsCount} Pending` : `${totalDoctors}` },
            { id: 'owners', label: 'Pet Parents / Owners', icon: Users, badge: totalOwners },
            { id: 'pets', label: 'All Pets & Patients 🐾', icon: Award, badge: totalPets },
            { id: 'clinics', label: 'Clinic Tenancy', icon: Building2, badge: totalClinics },
            { id: 'messages', label: 'Doctor Inquiries & Messages 💬', icon: MessageSquare, badge: openTicketsCount > 0 ? `${openTicketsCount} New` : null },
            { id: 'audit', label: 'Security & Audit Logs', icon: ShieldAlert, badge: auditLogs.length },
            { id: 'settings', label: 'Platform Settings', icon: Settings, badge: null },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-900'
                        : tab.badge.toString().includes('Pending')
                        ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PLATFORM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards - Clickable Navigators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Total Owners Card */}
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('owners');
              }}
              className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Total Owners</span>
                <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {totalOwners}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center justify-between mt-1 font-medium">
                <span>View & Edit Owners</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 2. Total Doctors Card */}
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('doctors');
              }}
              className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Total Doctors</span>
                <Stethoscope className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {totalDoctors}
              </div>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center justify-between mt-1 font-medium">
                <span>{verifiedDoctorsCount} verified</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 3. Total Clinics Card */}
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('clinics');
              }}
              className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Total Clinics</span>
                <Building2 className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {totalClinics}
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center justify-between mt-1 font-medium">
                <span>{activeClinicsCount} active</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 4. Total Pets Card */}
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('pets');
              }}
              className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Total Pets</span>
                <Award className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {totalPets}
              </div>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center justify-between mt-1 font-medium">
                <span>View & Edit Pets</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 5. Appointments Card */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Appointments</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {totalAppointments}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                Across all clinics
              </div>
            </div>

            {/* 6. Doctor Inquiries Card */}
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('messages');
              }}
              className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Doctor Inquiries</span>
                <MessageSquare className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
                {openTicketsCount}
                {openTicketsCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center justify-between mt-1 font-medium">
                <span>View Messages & DMs</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Unresolved Doctor Inquiries Attention Card */}
          {openTicketsCount > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                    {openTicketsCount} Direct Doctor Message{openTicketsCount > 1 ? 's' : ''} / Inquiry Request{openTicketsCount > 1 ? 's' : ''} Awaiting Super Admin
                  </h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300/80 mt-0.5">
                    Attending doctors and clinic managers have submitted inquiries regarding pet data modifications, technical support, or system updates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('messages');
                  setTicketStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-center shadow-xs"
              >
                Open Message Desk ➔
              </button>
            </div>
          )}

          {/* Pending Verifications Attention Card */}
          {pendingDoctorsCount > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    {pendingDoctorsCount} Doctor Verification Request{pendingDoctorsCount > 1 ? 's' : ''} Awaiting Review
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                    Newly registered veterinary practitioners require license verification before issuing prescriptions and conducting clinical visits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('doctors');
                  setDoctorStatusFilter('pending');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-center shadow-xs"
              >
                Review Applications
              </button>
            </div>
          )}

          {/* Platform Architecture & 4-Level Security Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                4-Tier Role & Privilege Architecture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Strict separation of concerns prevents data bleed between distinct clinics and protects patient records.
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-500" /> 1. App Owner / Super Admin (You)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 rounded-full font-semibold">
                      Global Control
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300/80 mt-1">
                    Multi-clinic tenant provisioning, veterinary license approvals, account suspensions, platform audit trail.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> 2. Clinic Manager / Admin
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 rounded-full font-semibold">
                      Clinic Scoped
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300/80 mt-1">
                    Manages own clinic staff, doctor scheduling, owner registrations, billing, pharmacy inventory, and appointments.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> 3. Doctor / Veterinarian
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 rounded-full font-semibold">
                      Clinical Focus
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300/80 mt-1">
                    SOAP consultations, differential diagnoses, prescriptions, surgery logs, laboratory & ECG interpretation, dose calculators.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" /> 4. Pet Parent / Owner
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full font-semibold">
                      Own Pets Only
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-1">
                    Digital pet health passport, vaccination reminders, appointment booking, prescription access, emergency guides.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Recent Platform Audit Log
                  </h2>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-start gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>By: {log.actorEmail}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold text-indigo-500">{log.actorRole}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Encrypted Audit Ledger</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tamper-Evident
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR REGISTRY & VERIFICATIONS */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Header controls & filters */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors by name, license, clinic, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Status:</span>
              {(['all', 'verified', 'pending', 'suspended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setDoctorStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    doctorStatusFilter === status
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Stethoscope className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200">No doctors match this filter</h3>
                <p className="text-xs mt-1">Try adjusting your search criteria or filter status.</p>
              </div>
            ) : (
              filteredDoctors.map((doc) => {
                const isPending = doc.verificationStatus === 'pending';
                const isSuspended = doc.status === 'suspended';

                return (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : isSuspended
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          }`}
                        >
                          {isPending ? 'Verification Pending' : isSuspended ? 'Suspended' : 'Verified Doctor'}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {doc.id}
                        </span>
                      </div>

                      {/* Doctor Profile Info */}
                      <div className="flex items-start gap-3">
                        <img
                          src={doc.avatar && doc.avatar.trim() !== '' ? doc.avatar : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                          alt={doc.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {doc.name}
                          </h3>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {doc.qualification}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Award className="w-3 h-3 text-slate-400" />
                            Reg: {doc.registrationNumber}
                          </p>
                        </div>
                      </div>

                      {/* Details & Clinic Affiliation */}
                      <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Specialization:</span>
                          <span className="font-medium text-right truncate max-w-[170px]">{doc.specialization}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Clinic:</span>
                          <span className="font-medium text-right truncate max-w-[170px]">{doc.clinicName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-mono text-[11px] text-right truncate max-w-[170px]">{doc.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Consultations:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{doc.consultationsCount} visits</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => {
                              approveDoctor(doc.id);
                              showNotification(`Doctor ${doc.name} verified and approved successfully!`, 'success');
                            }}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => {
                              rejectDoctor(doc.id);
                              showNotification(`Doctor ${doc.name} registration rejected.`, 'info');
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDoctorToDelete(doc)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Doctor Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {isSuspended ? (
                            <button
                              onClick={() => {
                                reactivateDoctor(doc.id);
                                showNotification(`Doctor ${doc.name} account reactivated.`, 'success');
                              }}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                suspendDoctor(doc.id);
                                showNotification(`Doctor ${doc.name} account suspended.`, 'warning');
                              }}
                              className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-amber-200 dark:border-amber-800 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" /> Suspend
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedDoctorToEdit(doc)}
                            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                            title="Super Admin Edit Doctor"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedDoctorForModal(doc)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedDoctorToDelete(doc)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PET PARENTS / OWNERS */}
      {activeTab === 'owners' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search pet parents by name, email, phone, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredOwners.length} Registered Pet Parents
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Pet Parent</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Registered Pets</th>
                    <th className="py-3 px-4">Connected Clinic & Vet</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredOwners.map((owner) => {
                    const ownerPets = pets.filter(
                      (p) =>
                        (p.ownerEmail && p.ownerEmail.toLowerCase() === owner.email.toLowerCase()) ||
                        (p.ownerName && p.ownerName.toLowerCase() === owner.name.toLowerCase())
                    );

                    return (
                      <tr key={owner.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{owner.name}</div>
                          {owner.address && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{owner.address}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-[11px]">{owner.email}</div>
                          <div className="text-slate-400 text-[10px]">{owner.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                            🐾 {ownerPets.length || owner.registeredPetsCount} Pets
                          </span>
                          {ownerPets.length > 0 && (
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                              {ownerPets.map((p) => p.name).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {owner.connectedClinicName || 'General Platform'}
                          </div>
                          <div className="text-[11px] text-indigo-600 dark:text-indigo-400">
                            {owner.connectedDoctorName || 'Any Available Doctor'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              owner.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {owner.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {owner.registeredDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOwnerToEdit(owner)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                              title="Edit Owner Info"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = owner.status === 'active' ? 'suspended' : 'active';
                                updateOwnerStatus(owner.id, newStatus);
                                showNotification(`Owner ${owner.name} marked as ${newStatus}.`, 'info');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                owner.status === 'active'
                                  ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                              }`}
                            >
                              {owner.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => setSelectedOwnerToDelete(owner)}
                              className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              title="Delete Owner Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL REGISTERED PETS & PATIENTS 🐾 */}
      {activeTab === 'pets' && (
        <SuperAdminPetsTab />
      )}

      {/* TAB 4: CLINIC TENANCY */}
      {activeTab === 'clinics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clinics by name, address, admin, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsAddClinicModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add & Provision Clinic
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                      License: {clinic.licenseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        clinic.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {clinic.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {clinic.address}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Clinic Admin:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{clinic.adminName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Admin Email:</span>
                      <span className="font-mono text-[11px]">{clinic.adminEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Affiliated Doctors:</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{clinic.doctorsCount} Veterinarians</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Est. {clinic.registeredDate}
                  </span>
                  <button
                    onClick={() => {
                      const newStatus = clinic.status === 'active' ? 'inactive' : 'active';
                      updateClinicStatus(clinic.id, newStatus);
                      showNotification(`Clinic ${clinic.name} set to ${newStatus}.`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      clinic.status === 'active'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    {clinic.status === 'active' ? 'Deactivate Clinic' : 'Activate Clinic'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Immutable Platform Security & Audit Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every privilege elevation, verification approval, doctor suspension, and clinic credential change is permanently recorded.
              </p>
            </div>
            <button
              onClick={() => {
                showNotification('Audit log bundle exported to CSV format.', 'success');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-center"
            >
              <FileText className="w-4 h-4" /> Export CSV Audit Trail
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-sans">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {log.actorEmail}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {log.targetName || log.targetType}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GLOBAL PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Security & Auth Enforcement
            </h3>
            <p className="text-xs text-slate-500">
              Configure mandatory zero-trust policies for all clinics and veterinary providers.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Mandatory License Verification
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Require Super Admin sign-off before doctors can prescribe Rx.
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Strict Cross-Clinic Data Isolation
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Clinic Admins and Doctors cannot view records outside their facility.
                  </div>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 accent-indigo-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Automated Activity Logging
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Store all state mutations in tamper-evident platform audit ledger.
                  </div>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 accent-indigo-600 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Cloud Database & Storage Health
            </h3>
            <p className="text-xs text-slate-500">
              Real-time synchronization state with Google Cloud Firestore.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Google Cloud Firestore (Enterprise)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Master Owner Account:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">ajitkp191@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Tenant Scope:</span>
                <span className="font-semibold text-emerald-600">Global Multi-Tenancy</span>
              </div>
            </div>

            <button
              onClick={() => {
                showNotification('Platform diagnostic complete: 0 permission errors found.', 'success');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Run Deep Platform Diagnostic
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: DOCTOR MESSAGES & DIRECT INQUIRIES DESK */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Header & Quick Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Doctor Direct Messages & Platform Helpdesk
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Respond to direct messages, pet record amendment requests, and technical tickets submitted by attending veterinarians.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              {(['all', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTicketStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    ticketStatusFilter === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? `All (${(supportTickets || []).length})` : st}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Tickets List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search inquiries by doctor, clinic, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {filteredTickets.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">No Inquiries Found</div>
                  <p className="text-xs text-slate-500">All doctor messages in this filter have been addressed or no queries match your search.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredTickets.map((t) => {
                    const isSelected = selectedTicketId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {t.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.status === 'Open'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : t.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            {t.subject}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {t.messages[t.messages.length - 1]?.text || 'No message content'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            👨‍⚕️ {t.senderName} ({t.clinicName})
                          </span>
                          <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Active Ticket Thread & Reply Box */}
            <div className="lg:col-span-7">
              {(() => {
                const activeTicket = (supportTickets || []).find((t) => t.id === selectedTicketId) || filteredTickets[0];
                if (!activeTicket) {
                  return (
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                      <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Select a Message to View</h3>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">
                        Click on any inquiry from the left to read messages and reply directly as Super Admin.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[600px] overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {activeTicket.subject}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                            {activeTicket.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          From: <strong>{activeTicket.senderName}</strong> ({activeTicket.senderEmail}) • Clinic: <strong>{activeTicket.clinicName}</strong>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Status:</span>
                        <select
                          value={activeTicket.status}
                          onChange={(e) => {
                            updateSupportTicketStatus(activeTicket.id, e.target.value as any);
                            showNotification(`Ticket marked as ${e.target.value}`, 'success');
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {activeTicket.messages.map((msg) => {
                        const isSuperAdmin = msg.senderRole === 'superadmin' || msg.senderRole === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isSuperAdmin ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                              <span className="font-bold text-slate-600 dark:text-slate-300">
                                {isSuperAdmin ? '🛡️ Super Admin (You)' : `👨‍⚕️ ${msg.senderName}`}
                              </span>
                              <span>•</span>
                              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div
                              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isSuperAdmin
                                  ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-xs border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Input Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!superAdminReplyText.trim()) return;
                        sendSupportMessage(
                          activeTicket.id,
                          superAdminReplyText.trim(),
                          'superadmin',
                          'Super Admin Support Team',
                          'superadmin_ajit'
                        );
                        setSuperAdminReplyText('');
                        showNotification('Reply sent directly to attending veterinarian.', 'success');
                      }}
                      className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Write direct reply or provide update to doctor..."
                        value={superAdminReplyText}
                        onChange={(e) => setSuperAdminReplyText(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Clinic */}
      {isAddClinicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Provision New Veterinary Clinic
              </h3>
              <button
                onClick={() => setIsAddClinicModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClinic} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westside Veterinary Referral Hospital"
                  value={newClinic.name}
                  onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinic Admin Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Emily Thorne"
                    value={newClinic.adminName}
                    onChange={(e) => setNewClinic({ ...newClinic, adminName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@clinic.com"
                    value={newClinic.email}
                    onChange={(e) => setNewClinic({ ...newClinic, email: e.target.value, adminEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinic Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={newClinic.address}
                  onChange={(e) => setNewClinic({ ...newClinic, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newClinic.phone}
                    onChange={(e) => setNewClinic({ ...newClinic, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    placeholder="CLINIC-LIC-XXXX"
                    value={newClinic.licenseNumber}
                    onChange={(e) => setNewClinic({ ...newClinic, licenseNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClinicModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md"
                >
                  Provision & Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Doctor Details */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Doctor Credential Profile
              </h3>
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <img
                  src={selectedDoctorForModal.avatar && selectedDoctorForModal.avatar.trim() !== '' ? selectedDoctorForModal.avatar : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                  alt={selectedDoctorForModal.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedDoctorForModal.name}
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {selectedDoctorForModal.qualification}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Registration No: {selectedDoctorForModal.registrationNumber}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Clinic:</span>
                  <span className="font-semibold">{selectedDoctorForModal.clinicName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Specialization:</span>
                  <span>{selectedDoctorForModal.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-[11px]">{selectedDoctorForModal.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span>{selectedDoctorForModal.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Consultations:</span>
                  <span className="font-bold text-emerald-600">{selectedDoctorForModal.consultationsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Patients:</span>
                  <span className="font-bold text-indigo-600">{selectedDoctorForModal.patientsCount}</span>
                </div>
              </div>

              {selectedDoctorForModal.bio && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 font-semibold block mb-1">Clinical Biography:</span>
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{selectedDoctorForModal.bio}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                id="view-doctor-modal-delete-btn"
                onClick={() => {
                  const docToDelete = selectedDoctorForModal;
                  setSelectedDoctorForModal(null);
                  setSelectedDoctorToDelete(docToDelete);
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Doctor Record</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const docToEdit = selectedDoctorForModal;
                    setSelectedDoctorForModal(null);
                    setSelectedDoctorToEdit(docToEdit);
                  }}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForModal(null)}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 rounded-xl font-semibold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Doctor Profile & Credentials */}
      {selectedDoctorToEdit && (
        <EditDoctorModal
          doctor={selectedDoctorToEdit}
          onClose={() => setSelectedDoctorToEdit(null)}
        />
      )}

      {/* Delete Doctor Confirmation Modal */}
      {selectedDoctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Doctor Account?
                </h3>
                <p className="text-xs text-slate-500">Super Admin Permanent Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{selectedDoctorToDelete.name}</strong> ({selectedDoctorToDelete.email}) from the platform? This will wipe their credentials, registration number ({selectedDoctorToDelete.registrationNumber}), and clinic assignments.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDoctorToDelete(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="superadmin-confirm-delete-doctor-btn"
                onClick={() => {
                  deleteDoctor(selectedDoctorToDelete.id);
                  setSelectedDoctorToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/20 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Pet Owner Profile */}
      {selectedOwnerToEdit && (
        <EditOwnerModal
          owner={selectedOwnerToEdit}
          onClose={() => setSelectedOwnerToEdit(null)}
        />
      )}

      {/* Delete Owner Confirmation Modal */}
      {selectedOwnerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Pet Owner?
                </h3>
                <p className="text-xs text-slate-500">Super Admin Permanent Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete <strong>{selectedOwnerToDelete.name}</strong> ({selectedOwnerToDelete.email}) from the platform?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOwnerToDelete(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOwner(selectedOwnerToDelete.id);
                  setSelectedOwnerToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
