import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  FlaskConical,
  Camera,
  Heart,
  Scissors,
  ShieldCheck,
  Calculator,
  Search,
  Plus,
  ArrowRight,
  Clock,
  Award,
  Sparkles,
  AlertTriangle,
  Pill,
  ChevronRight,
  Activity,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Bug,
} from 'lucide-react';
import { DoctorSidebar } from './DoctorSidebar';
import { PatientManagement } from '../admin/PatientManagement';
import { ConsultationModule } from '../admin/ConsultationModule';
import { LaboratoryModule } from '../admin/LaboratoryModule';
import { ImagingModule } from '../admin/ImagingModule';
import { ECGModule } from '../admin/ECGModule';
import { SurgeryModule } from '../admin/SurgeryModule';
import { VaccinationDewormingAdmin } from '../admin/VaccinationDewormingAdmin';
import { DoctorVaccinationDewormingSection } from '../admin/DoctorVaccinationDewormingSection';
import { PrescriptionGenerator } from '../admin/PrescriptionGenerator';
import { AppointmentAdmin } from '../admin/AppointmentAdmin';
import { InventoryAdmin } from '../admin/InventoryAdmin';
import { BillingModule } from '../admin/BillingModule';
import { ReportsAnalytics } from '../admin/ReportsAnalytics';
import { AdminSettings } from '../admin/AdminSettings';
import { HistoryTakingModule } from './HistoryTakingModule';
import { MultiParameterDiagnosticModule } from '../admin/MultiParameterDiagnosticModule';
import { SupportQueryDesk } from '../common/SupportQueryDesk';
import { PetQuickSearchModal } from '../common/PetQuickSearchModal';
import { AIClinicalAssistantModule } from '../admin/AIClinicalAssistantModule';
import { HospitalizationModule } from '../admin/HospitalizationModule';
import { VeterinaryDoseCalculator } from '../admin/VeterinaryDoseCalculator';

export const DoctorDashboard: React.FC = () => {
  const {
    adminProfile,
    pets,
    appointments,
    consultations,
    setSelectedPetId,
    setIsPetSearchOpen,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [patientSearch, setPatientSearch] = useState('');

  // Drug dose calculator internal state
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcDrug, setCalcDrug] = useState<string>('meloxicam');
  const [calcConcentration, setCalcConcentration] = useState<number>(1.5);

  const drugFormulary: Record<string, { name: string; doseMgKg: number; defaultConc: number; unit: string; route: string }> = {
    meloxicam: { name: 'Meloxicam Oral Suspension', doseMgKg: 0.1, defaultConc: 1.5, unit: 'mg/ml', route: 'PO Once Daily' },
    amoxicillin_clav: { name: 'Amoxicillin + Clavulanic Acid', doseMgKg: 12.5, defaultConc: 50, unit: 'mg/ml', route: 'PO BID (q12h)' },
    tramadol: { name: 'Tramadol HCl', doseMgKg: 3.0, defaultConc: 50, unit: 'mg/tablet', route: 'PO TID (q8h)' },
    gabapentin: { name: 'Gabapentin', doseMgKg: 10.0, defaultConc: 100, unit: 'mg/capsule', route: 'PO BID-TID' },
    propofol: { name: 'Propofol Injectable', doseMgKg: 4.0, defaultConc: 10, unit: 'mg/ml', route: 'IV Slow to Effect' },
  };

  const selectedDrugData = drugFormulary[calcDrug] || drugFormulary.meloxicam;
  const calculatedDoseMg = calcWeight * selectedDrugData.doseMgKg;
  const calculatedVolume = (calculatedDoseMg / (calcConcentration || selectedDrugData.defaultConc)).toFixed(2);

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.species.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.breed.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.identificationNumber.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientManagement />;
      case 'history-taking':
      case 'consultation':
        return <ConsultationModule initialStep={1} />;
      case 'appointments':
        return <AppointmentAdmin />;
      case 'laboratory':
        return <LaboratoryModule />;
      case 'imaging':
        return <ImagingModule />;
      case 'ecg':
        return <ECGModule />;
      case 'multiparameter-diagnostic':
        return <MultiParameterDiagnosticModule />;
      case 'surgery':
        return <SurgeryModule />;
      case 'vaccination':
      case 'vaccines':
      case 'deworming':
        return <DoctorVaccinationDewormingSection />;
      case 'prescription':
        return <PrescriptionGenerator />;
      case 'inventory':
        return <InventoryAdmin />;
      case 'billing':
        return <BillingModule />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'ai-assistant':
      case 'clinical-decision-support':
        return <AIClinicalAssistantModule />;
      case 'hospitalization':
        return <HospitalizationModule />;
      case 'calculator':
        return <VeterinaryDoseCalculator onInsertPrescription={() => setActiveTab('prescription')} />;
      case 'message-superadmin':
      case 'contact-superadmin':
      case 'support':
        return <SupportQueryDesk role="doctor" />;
      case 'profile':
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="space-y-6">
            {/* Top Doctor Greeting & Active Patient Search */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      <Stethoscope className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome, {adminProfile.name || 'Doctor'}
                      </h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {adminProfile.clinicName || 'Metropolitan Veterinary Referral Hospital'} • {adminProfile.specialization || 'Clinical Veterinary Care'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsPetSearchOpen(true)}
                    className="px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Search Pet 🔍</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('vaccines')}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>+ Give Vaccine 💉</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('deworming')}
                    className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Bug className="w-4 h-4" />
                    <span>+ Give Deworming 💊</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('consultation')}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Stethoscope className="w-4 h-4" /> History & SOAP Consultation 🩺
                  </button>
                  <button
                    onClick={() => setActiveTab('message-superadmin')}
                    className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 border border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Message Super Admin 💬</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('prescription')}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Write Rx
                  </button>
                </div>
              </div>

              {/* Patient Quick Finder Bar */}
              <div className="mt-6 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick Search Patient by Name, Breed, Owner, Microchip or Pet Registration Number..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Patient Results Preview if Searching */}
              {patientSearch && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Matching Patients ({filteredPets.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredPets.slice(0, 6).map((pet) => (
                      <div
                        key={pet.id}
                        onClick={() => {
                          setSelectedPetId(pet.id);
                          setActiveTab('consultation');
                        }}
                        className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {pet.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {pet.species} • {pet.breed}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Clinical Tool Modules Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => setActiveTab('consultation')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 shadow-xs text-left transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">SOAP Consultation</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Vitals, BCS, Differentials</p>
              </button>

              <button
                onClick={() => setActiveTab('vaccines')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs text-left transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Vaccine & Deworming</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Live Administration</p>
              </button>

              <button
                onClick={() => setActiveTab('laboratory')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 shadow-xs text-left transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Lab & Diagnostics</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">CBC & Biochemistry</p>
              </button>

              <button
                onClick={() => setActiveTab('imaging')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 shadow-xs text-left transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Radiology & US</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">DICOM & X-Ray Viewer</p>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 shadow-xs text-left transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Dose Calculator</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Weight-based mg/kg</p>
              </button>
            </div>

            {/* Patients & Scheduled Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Patients List */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Assigned Patients ({pets.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {pets.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No patients registered yet.
                    </div>
                  ) : (
                    pets.slice(0, 4).map((pet) => (
                      <div
                        key={pet.id}
                        onClick={() => {
                          setSelectedPetId(pet.id);
                          setActiveTab('consultation');
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={pet.photo && pet.photo.trim() !== '' ? pet.photo : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'}
                            alt={pet.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {pet.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {pet.species} • {pet.breed} • {pet.weight} kg
                            </div>
                            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                              Owner: {pet.ownerName}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                          Examine →
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Scheduled Appointments */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Today's Clinical Calendar
                  </h2>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No appointments scheduled for today.
                    </div>
                  ) : (
                    appointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{apt.petName}</span>
                            <span className="text-[10px] font-normal text-slate-400">({apt.ownerName})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {apt.reason || 'General Clinical Consultation'}
                          </div>
                          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                            {apt.date} • {apt.time}
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Dedicated Doctor Section on Vaccination and Deworming */}
            <div className="pt-2">
              <DoctorVaccinationDewormingSection />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full">
      <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {renderContent()}
      </main>
      <PetQuickSearchModal />
    </div>
  );
};
