import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { GlobalNavigationBar } from './components/common/GlobalNavigationBar';
import { MobileBottomNavBar } from './components/common/MobileBottomNavBar';
import { NotificationToast } from './components/common/NotificationToast';
import { AppLoadingScreen } from './components/common/AppLoadingScreen';
import { WelcomeLandingPage } from './components/common/WelcomeLandingPage';

// Admin Components
import { AdminAuth } from './components/admin/AdminAuth';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminMobileNav } from './components/admin/AdminMobileNav';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PatientManagement } from './components/admin/PatientManagement';
import { ConsultationModule } from './components/admin/ConsultationModule';
import { LaboratoryModule } from './components/admin/LaboratoryModule';
import { ImagingModule } from './components/admin/ImagingModule';
import { ECGModule } from './components/admin/ECGModule';
import { MultiParameterDiagnosticModule } from './components/admin/MultiParameterDiagnosticModule';
import { SurgeryModule } from './components/admin/SurgeryModule';
import { VaccinationDewormingAdmin } from './components/admin/VaccinationDewormingAdmin';
import { PrescriptionGenerator } from './components/admin/PrescriptionGenerator';
import { AppointmentAdmin } from './components/admin/AppointmentAdmin';
import { BillingModule } from './components/admin/BillingModule';
import { InventoryAdmin } from './components/admin/InventoryAdmin';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import { HistoryTakingModule } from './components/doctor/HistoryTakingModule';
import { SupportQueryDesk } from './components/common/SupportQueryDesk';
import { PetQuickSearchModal } from './components/common/PetQuickSearchModal';

// Pet Owner Components
import { OwnerAuth } from './components/owner/OwnerAuth';
import { OwnerNav } from './components/owner/OwnerNav';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { MyPetsDossier } from './components/owner/MyPetsDossier';
import { HealthPassport } from './components/owner/HealthPassport';
import { AiSymptomChecker } from './components/owner/AiSymptomChecker';
import { OwnerAppointments } from './components/owner/OwnerAppointments';
import { EmergencyFirstAid } from './components/owner/EmergencyFirstAid';
import { OwnerPrescriptions } from './components/owner/OwnerPrescriptions';
import { OwnerMedicalRecords } from './components/owner/OwnerMedicalRecords';
import { OwnerVaccinationTracker } from './components/owner/OwnerVaccinationTracker';
import { OwnerNotifications } from './components/owner/OwnerNotifications';
import { OwnerProfileView } from './components/owner/OwnerProfileView';

// Multi-tier Role Dashboards
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { SuperAdminAuth } from './components/superadmin/SuperAdminAuth';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';

const MainAppContent: React.FC = () => {
  const {
    currentSection,
    isAdminAuthenticated,
    isSuperAdminAuthenticated,
    isOwnerAuthenticated,
    adminActiveTab,
    setAdminActiveTab,
    ownerActiveTab,
    setOwnerActiveTab,
    isAndroidFrameMode,
  } = useApp();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  useEffect(() => {
    // Initial app bootstrap timer to display the high-fidelity animated loading experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppLoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header />
        <WelcomeLandingPage
          onEnterWorkspace={() => setShowWelcome(false)}
          onSelectRole={() => setShowWelcome(false)}
        />
        <MobileBottomNavBar />
        <NotificationToast />
      </div>
    );
  }

  const renderAdminContent = () => {
    if (!isAdminAuthenticated) {
      return <AdminAuth />;
    }

    switch (adminActiveTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'history-taking':
        return <HistoryTakingModule onNavigateToConsultation={() => setAdminActiveTab('consultation')} />;
      case 'appointments':
        return <AppointmentAdmin />;
      case 'consultation':
        return <ConsultationModule />;
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
        return <VaccinationDewormingAdmin defaultTab="vaccines" />;
      case 'deworming':
        return <VaccinationDewormingAdmin defaultTab="deworming" />;
      case 'prescription':
        return <PrescriptionGenerator />;
      case 'inventory':
        return <InventoryAdmin />;
      case 'billing':
        return <BillingModule />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'support':
        return <SupportQueryDesk role="admin" />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderOwnerContent = () => {
    switch (ownerActiveTab) {
      case 'dashboard':
        return <OwnerDashboard onNavigateTab={setOwnerActiveTab} />;
      case 'my-pets':
        return <MyPetsDossier onNavigateTab={setOwnerActiveTab} />;
      case 'passport':
        return <HealthPassport />;
      case 'symptom-checker':
        return <AiSymptomChecker onNavigateTab={setOwnerActiveTab} />;
      case 'book-appointment':
        return <OwnerAppointments />;
      case 'prescriptions':
        return <OwnerPrescriptions />;
      case 'medical-records':
        return <OwnerMedicalRecords />;
      case 'vaccine-tracker':
        return <OwnerVaccinationTracker onNavigateTab={setOwnerActiveTab} />;
      case 'notifications':
        return <OwnerNotifications />;
      case 'owner-profile':
        return <OwnerProfileView />;
      case 'emergency':
      case 'emergency-first-aid':
        return <EmergencyFirstAid />;
      default:
        return <OwnerDashboard onNavigateTab={setOwnerActiveTab} />;
    }
  };

  const renderSectionView = () => {
    switch (currentSection) {
      case 'super_admin':
        if (!isSuperAdminAuthenticated) {
          return (
            <div className="flex-1 flex items-center justify-center p-4">
              <SuperAdminAuth />
            </div>
          );
        }
        return (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            <SuperAdminDashboard />
          </main>
        );

      case 'doctor':
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <div className="flex-1 flex items-center justify-center p-4">
              <AdminAuth />
            </div>
          );
        }
        return <DoctorDashboard />;

      case 'owner':
      default:
        if (!isOwnerAuthenticated) {
          return (
            <div className="flex-1 flex items-center justify-center p-4">
              <OwnerAuth />
            </div>
          );
        }
        return (
          <div className="flex-1 flex flex-col w-full">
            <OwnerNav />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
              {renderOwnerContent()}
            </main>
          </div>
        );
    }
  };

  const content = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white pb-16 md:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Header />
      <GlobalNavigationBar />
      <NotificationToast />
      {renderSectionView()}
      <PetQuickSearchModal />
      <MobileBottomNavBar />
    </div>
  );

  if (isAndroidFrameMode) {
    return (
      <div className="min-h-screen bg-slate-900 p-2 sm:p-6 flex items-center justify-center">
        {/* Android Frame Mockup Container */}
        <div className="w-full max-w-[430px] h-[92vh] max-h-[890px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col">
          {/* Top Notch / Camera pill */}
          <div className="w-28 h-4 bg-black rounded-full mx-auto mb-1 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          </div>
          {/* App Screen Inside Frame */}
          <div className="flex-1 rounded-[36px] overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
