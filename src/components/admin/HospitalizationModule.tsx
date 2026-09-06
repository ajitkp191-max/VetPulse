import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalizationRecord, HospitalizationDailySheet, InpatientMedication } from '../../types';
import {
  Bed,
  PlusCircle,
  Activity,
  Calendar,
  Clock,
  Heart,
  Droplet,
  Pill,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Search,
  ChevronRight,
  Printer,
  Download,
  X,
  Stethoscope,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react';
import { AnimalAvatar, SpeciesBadge } from '../common/AnimalIllustration';

export const HospitalizationModule: React.FC = () => {
  const { pets, adminProfile, showNotification, addAuditLog } = useApp();

  // In-memory / localStorage state for Hospitalization records
  const [hospitalizations, setHospitalizations] = useState<HospitalizationRecord[]>(() => {
    const saved = localStorage.getItem('vetcare_hospitalizations_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial mock if none
    return [
      {
        id: 'HOSP-2025-001',
        petId: pets[0]?.id || 'PET-001',
        petName: pets[0]?.name || 'Charlie',
        species: pets[0]?.species || 'Canine (Dog)',
        breed: pets[0]?.breed || 'Golden Retriever',
        ownerName: pets[0]?.ownerName || 'Sarah Jenkins',
        ownerPhone: pets[0]?.ownerPhone || '+1 (555) 234-5678',
        admissionDate: new Date().toISOString().split('T')[0],
        wardNumber: 'ICU Ward 1',
        cageKennel: 'Kennel A-04',
        provisionalDiagnosis: 'Acute Pancreatitis with Dehydration',
        attendingDoctor: adminProfile.name || 'Dr. Attending',
        vetRegNumber: adminProfile.registrationNumber || 'VET-REG-2024',
        status: 'Critical Care',
        dailySheets: [
          {
            id: 'DS-01',
            date: new Date().toISOString().split('T')[0],
            weightKg: 28.4,
            temperatureC: 39.2,
            heartRateBpm: 124,
            respiratoryRateBpm: 32,
            fluidTherapy: {
              fluidType: 'Lactated Ringers (LRS)',
              rateMlPerHour: 90,
              additives: 'KCl 20 mEq/L',
              totalAdministeredMl: 1200,
            },
            foodIntake: 'Minimal (<25%)',
            urineOutput: 'Normal',
            stoolConsistency: 'Soft',
            medications: [
              {
                id: 'M1',
                drug: 'Maropitant (Cerenia)',
                dose: '1 mg/kg IV',
                route: 'IV',
                frequency: 'SID (q24h)',
                scheduledTimes: ['08:00', '20:00'],
                given: true,
                administeredBy: 'Nurse Emily',
              },
              {
                id: 'M2',
                drug: 'Buprenorphine',
                dose: '0.02 mg/kg IV',
                route: 'IV',
                frequency: 'TID (q8h)',
                scheduledTimes: ['08:00', '16:00', '00:00'],
                given: true,
                administeredBy: 'Dr. Attending',
              },
            ],
            progressNotes: 'Patient resting comfortably. Abdominal pain improving post-analgesia. Mild nausea noted in early morning.',
            recordedBy: adminProfile.name || 'Dr. Attending',
          },
        ],
        emergencyAlert: 'Monitor for vomiting; keep on strict NPO for 12 hours.',
      },
    ];
  });

  const saveHospitalizations = (newList: HospitalizationRecord[]) => {
    setHospitalizations(newList);
    try {
      localStorage.setItem('vetcare_hospitalizations_v1', JSON.stringify(newList));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  const [selectedRecord, setSelectedRecord] = useState<HospitalizationRecord | null>(hospitalizations[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isAddDailySheetOpen, setIsAddDailySheetOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

  // New Admission Form State
  const [admitPetId, setAdmitPetId] = useState(pets[0]?.id || '');
  const [admitWard, setAdmitWard] = useState('ICU Ward 1');
  const [admitKennel, setAdmitKennel] = useState('Kennel A-01');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('');
  const [admitAlert, setAdmitAlert] = useState('');
  const [admitWeight, setAdmitWeight] = useState(10);
  const [admitTemp, setAdmitTemp] = useState(38.5);
  const [admitHR, setAdmitHR] = useState(100);
  const [admitRR, setAdmitRR] = useState(24);
  const [admitFluidType, setAdmitFluidType] = useState('Lactated Ringers (LRS)');
  const [admitFluidRate, setAdmitFluidRate] = useState(50);

  // New Daily Sheet Form State
  const [sheetWeight, setSheetWeight] = useState(selectedRecord?.dailySheets[0]?.weightKg || 10);
  const [sheetTemp, setSheetTemp] = useState(38.6);
  const [sheetHR, setSheetHR] = useState(110);
  const [sheetRR, setSheetRR] = useState(26);
  const [sheetFluidType, setSheetFluidType] = useState('Lactated Ringers (LRS)');
  const [sheetFluidRate, setSheetFluidRate] = useState(60);
  const [sheetFluidAdditives, setSheetFluidAdditives] = useState('KCl 10 mEq/L');
  const [sheetTotalFluid, setSheetTotalFluid] = useState(1000);
  const [sheetFood, setSheetFood] = useState<HospitalizationDailySheet['foodIntake']>('Partial (25-50%)');
  const [sheetUrine, setSheetUrine] = useState<HospitalizationDailySheet['urineOutput']>('Normal');
  const [sheetStool, setSheetStool] = useState<HospitalizationDailySheet['stoolConsistency']>('Normal');
  const [sheetNotes, setSheetNotes] = useState('');
  const [sheetMeds, setSheetMeds] = useState<InpatientMedication[]>([
    {
      id: 'med-' + Date.now(),
      drug: 'Ampicillin/Sulbactam',
      dose: '30 mg/kg IV',
      route: 'IV',
      frequency: 'TID (q8h)',
      scheduledTimes: ['08:00', '16:00', '00:00'],
      given: false,
    },
  ]);

  // Discharge Form State
  const [dischargeSummary, setDischargeSummary] = useState('Patient clinically stable, afebrile, eating well. Vital signs within normal reference ranges.');
  const [dischargeInstructions, setDischargeInstructions] = useState('Continue oral medications for 7 days. Monitor appetite and hydration. Follow-up recheck in 5 days.');

  const filteredHospitalizations = hospitalizations.filter((h) => {
    const matchesStatus = filterStatus === 'All' || h.status === filterStatus;
    const matchesSearch =
      h.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.provisionalDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.wardNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === admitPetId);
    if (!pet) {
      showNotification('Please select a registered patient to admit', 'error');
      return;
    }

    const newRecord: HospitalizationRecord = {
      id: `HOSP-${new Date().getFullYear()}-${String(hospitalizations.length + 1).padStart(3, '0')}`,
      petId: pet.id,
      petName: pet.name,
      species: pet.species,
      breed: pet.breed,
      ownerName: pet.ownerName,
      ownerPhone: pet.ownerPhone,
      admissionDate: new Date().toISOString().split('T')[0],
      wardNumber: admitWard,
      cageKennel: admitKennel,
      provisionalDiagnosis: admitDiagnosis || 'Inpatient Observation & Supportive Care',
      attendingDoctor: adminProfile.name || 'Dr. Attending',
      vetRegNumber: adminProfile.registrationNumber,
      status: 'Admitted',
      dailySheets: [
        {
          id: 'DS-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          weightKg: Number(admitWeight) || pet.weight,
          temperatureC: Number(admitTemp),
          heartRateBpm: Number(admitHR),
          respiratoryRateBpm: Number(admitRR),
          fluidTherapy: {
            fluidType: admitFluidType,
            rateMlPerHour: Number(admitFluidRate),
            additives: 'None',
            totalAdministeredMl: Number(admitFluidRate) * 4,
          },
          foodIntake: 'Minimal (<25%)',
          urineOutput: 'Normal',
          stoolConsistency: 'Normal',
          medications: [],
          progressNotes: 'Initial admission completed. Catheter placed, fluid therapy initiated.',
          recordedBy: adminProfile.name || 'Attending Doctor',
        },
      ],
      emergencyAlert: admitAlert || undefined,
    };

    const updated = [newRecord, ...hospitalizations];
    saveHospitalizations(updated);
    setSelectedRecord(newRecord);
    setIsAdmitModalOpen(false);
    showNotification(`Patient ${pet.name} admitted to ${admitWard} successfully!`, 'success');
    addAuditLog('Admit Inpatient', 'patient', pet.id, pet.name, `Admitted to ${admitWard} (${admitKennel})`);
  };

  const handleAddDailySheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const newSheet: HospitalizationDailySheet = {
      id: 'DS-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(sheetWeight),
      temperatureC: Number(sheetTemp),
      heartRateBpm: Number(sheetHR),
      respiratoryRateBpm: Number(sheetRR),
      fluidTherapy: {
        fluidType: sheetFluidType,
        rateMlPerHour: Number(sheetFluidRate),
        additives: sheetFluidAdditives,
        totalAdministeredMl: Number(sheetTotalFluid),
      },
      foodIntake: sheetFood,
      urineOutput: sheetUrine,
      stoolConsistency: sheetStool,
      medications: sheetMeds,
      progressNotes: sheetNotes || 'Daily assessment recorded. Patient monitored per ICU protocol.',
      recordedBy: adminProfile.name || 'Dr. Attending',
    };

    const updatedRecords = hospitalizations.map((h) => {
      if (h.id === selectedRecord.id) {
        return {
          ...h,
          dailySheets: [newSheet, ...h.dailySheets],
        };
      }
      return h;
    });

    saveHospitalizations(updatedRecords);
    setSelectedRecord({
      ...selectedRecord,
      dailySheets: [newSheet, ...selectedRecord.dailySheets],
    });
    setIsAddDailySheetOpen(false);
    showNotification(`Daily treatment sheet recorded for ${selectedRecord.petName}!`, 'success');
  };

  const handleDischargePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const updatedRecords = hospitalizations.map((h) => {
      if (h.id === selectedRecord.id) {
        return {
          ...h,
          status: 'Discharged' as const,
          dischargeDate: new Date().toISOString().split('T')[0],
          dischargeSummary,
          dischargeInstructions,
        };
      }
      return h;
    });

    saveHospitalizations(updatedRecords);
    setSelectedRecord({
      ...selectedRecord,
      status: 'Discharged',
      dischargeDate: new Date().toISOString().split('T')[0],
      dischargeSummary,
      dischargeInstructions,
    });
    setIsDischargeModalOpen(false);
    showNotification(`Patient ${selectedRecord.petName} successfully discharged!`, 'success');
    addAuditLog('Discharge Patient', 'patient', selectedRecord.petId, selectedRecord.petName, 'Patient discharged from inpatient ward');
  };

  const handleToggleMedicationGiven = (sheetIndex: number, medIndex: number) => {
    if (!selectedRecord) return;
    const updatedSheets = [...selectedRecord.dailySheets];
    const sheet = { ...updatedSheets[sheetIndex] };
    const meds = [...sheet.medications];
    meds[medIndex] = {
      ...meds[medIndex],
      given: !meds[medIndex].given,
      administeredBy: !meds[medIndex].given ? adminProfile.name || 'Clinician' : undefined,
    };
    sheet.medications = meds;
    updatedSheets[sheetIndex] = sheet;

    const updatedRecords = hospitalizations.map((h) => (h.id === selectedRecord.id ? { ...h, dailySheets: updatedSheets } : h));
    saveHospitalizations(updatedRecords);
    setSelectedRecord({ ...selectedRecord, dailySheets: updatedSheets });
    showNotification('Medication status updated', 'info');
  };

  const activeInpatientsCount = hospitalizations.filter((h) => h.status !== 'Discharged').length;
  const criticalCount = hospitalizations.filter((h) => h.status === 'Critical Care').length;
  const stableCount = hospitalizations.filter((h) => h.status === 'Stable' || h.status === 'Admitted').length;

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <Bed className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Inpatient & Hospitalization Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live ICU / Ward bed occupancy, daily treatment flowsheets, IV fluid therapy, and progress tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdmitModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-900/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Admit Inpatient</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Inpatients</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeInpatientsCount}</div>
          <span className="text-[10px] text-slate-500">Currently admitted in wards</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-xs">
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Critical Care / ICU
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{criticalCount}</div>
          <span className="text-[10px] text-slate-500">High acuity monitoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Stable & Recuperating
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stableCount}</div>
          <span className="text-[10px] text-slate-500">Step-down ward recovery</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Discharged</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {hospitalizations.filter((h) => h.status === 'Discharged').length}
          </div>
          <span className="text-[10px] text-slate-500">Completed inpatient cases</span>
        </div>
      </div>

      {/* Main Layout: List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, ward, diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['All', 'Critical Care', 'Admitted', 'Stable', 'Discharged'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredHospitalizations.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No hospitalization records match your query.
              </div>
            ) : (
              filteredHospitalizations.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <AnimalAvatar species={record.species} size="sm" />
                        <div>
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            {record.petName}
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              ({record.wardNumber})
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                            {record.provisionalDiagnosis}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          record.status === 'Critical Care'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : record.status === 'Discharged'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Admitted: {record.admissionDate}</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{record.cageKennel}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Details & Daily Flowsheet (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedRecord ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
              {/* Header Info Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <AnimalAvatar species={selectedRecord.species} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedRecord.petName}
                      </h2>
                      <SpeciesBadge species={selectedRecord.species} />
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          selectedRecord.status === 'Critical Care'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : selectedRecord.status === 'Discharged'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {selectedRecord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Parent: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedRecord.ownerName}</span> ({selectedRecord.ownerPhone}) • ID: {selectedRecord.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedRecord.status !== 'Discharged' && (
                    <>
                      <button
                        onClick={() => setIsAddDailySheetOpen(true)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Record Flowsheet</span>
                      </button>
                      <button
                        onClick={() => setIsDischargeModalOpen(true)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Discharge Patient</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl"
                    title="Print Daily Treatment Sheet"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location & Admission Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 block font-medium">Ward & Location</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.wardNumber} • {selectedRecord.cageKennel}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 block font-medium">Admission Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.admissionDate}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 block font-medium">Attending Clinician</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.attendingDoctor}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 block font-medium">Diagnosis</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{selectedRecord.provisionalDiagnosis}</span>
                </div>
              </div>

              {/* Emergency Alert Banner if present */}
              {selectedRecord.emergencyAlert && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span><strong>Special Inpatient Instructions:</strong> {selectedRecord.emergencyAlert}</span>
                </div>
              )}

              {/* Discharge Summary if Discharged */}
              {selectedRecord.status === 'Discharged' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-1.5">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Discharged on {selectedRecord.dischargeDate}</span>
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-300"><strong>Summary:</strong> {selectedRecord.dischargeSummary}</p>
                  <p className="text-emerald-800 dark:text-emerald-300"><strong>Home Care Instructions:</strong> {selectedRecord.dischargeInstructions}</p>
                </div>
              )}

              {/* Daily Treatment Sheets (Chronological Flowsheet) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Daily Treatment Flowsheets ({selectedRecord.dailySheets.length} Entries)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Standard Veterinary Inpatient Flowsheet</span>
                </div>

                {selectedRecord.dailySheets.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                    No daily sheets recorded yet. Click "+ Record Flowsheet" above to add vitals and fluid therapy.
                  </div>
                ) : (
                  selectedRecord.dailySheets.map((sheet, sheetIdx) => (
                    <div
                      key={sheet.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      {/* Sheet Header & Vitals Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            📅 Date: {sheet.date}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            • Recorded by {sheet.recordedBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="text-indigo-600 dark:text-indigo-400">⚖️ {sheet.weightKg} kg</span>
                          <span className={sheet.temperatureC > 39.5 ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-300'}>
                            🌡️ {sheet.temperatureC} °C
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">💓 {sheet.heartRateBpm} bpm</span>
                          <span className="text-slate-600 dark:text-slate-300">🫁 {sheet.respiratoryRateBpm} rpm</span>
                        </div>
                      </div>

                      {/* Fluid Therapy & Excretion Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1 text-[11px]">
                            <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                            Fluid Therapy
                          </span>
                          <p className="text-slate-600 dark:text-slate-400 text-xs">
                            <span className="font-semibold">{sheet.fluidTherapy.fluidType}</span> @ <span className="font-bold text-cyan-700 dark:text-cyan-300">{sheet.fluidTherapy.rateMlPerHour} mL/hr</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Additives: {sheet.fluidTherapy.additives || 'None'} • Total Administered: {sheet.fluidTherapy.totalAdministeredMl} mL
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                            🍽️ Nutrition & Excretion
                          </span>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600 dark:text-slate-400 text-xs">
                            <span>Food: <strong>{sheet.foodIntake}</strong></span>
                            <span>Urine: <strong>{sheet.urineOutput}</strong></span>
                            <span>Stool: <strong>{sheet.stoolConsistency}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Inpatient Medications List */}
                      {sheet.medications && sheet.medications.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-teal-600" />
                            Inpatient Scheduled Medications
                          </span>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {sheet.medications.map((med, medIdx) => (
                              <div key={med.id} className="py-1.5 flex items-center justify-between gap-2">
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200">{med.drug}</span>
                                  <span className="text-slate-500 ml-2">({med.dose}, {med.route}, {med.frequency})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {med.given ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                      <CheckCircle2 className="w-3 h-3" /> Given {med.administeredBy ? `by ${med.administeredBy}` : ''}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleToggleMedicationGiven(sheetIdx, medIdx)}
                                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      Mark as Administered
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clinical Progress Notes */}
                      <div className="p-2.5 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 font-semibold block mb-0.5 text-[10px] uppercase tracking-wider">Clinician Progress Notes:</span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                          "{sheet.progressNotes}"
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
              Select an admitted patient on the left to review hospital sheets, or admit a new inpatient.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Admit New Inpatient */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bed className="w-5 h-5 text-indigo-600" />
                <span>Admit Patient to Hospital / ICU</span>
              </h2>
              <button onClick={() => setIsAdmitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmission} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Patient *</label>
                <select
                  value={admitPetId}
                  onChange={(e) => setAdmitPetId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} • {p.breed}) — Owner: {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward Location *</label>
                  <select
                    value={admitWard}
                    onChange={(e) => setAdmitWard(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="ICU Ward 1">ICU Ward 1</option>
                    <option value="Step-down Ward">Step-down Ward</option>
                    <option value="Isolation Ward (Infectious)">Isolation Ward (Infectious)</option>
                    <option value="Feline Quiet Ward">Feline Quiet Ward</option>
                    <option value="Post-Op Recovery">Post-Op Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Kennel / Bed #</label>
                  <input
                    type="text"
                    value={admitKennel}
                    onChange={(e) => setAdmitKennel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    placeholder="e.g. Cage B-02"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Provisional Diagnosis *</label>
                <input
                  type="text"
                  value={admitDiagnosis}
                  onChange={(e) => setAdmitDiagnosis(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. Acute Gastroenteritis with 8% Dehydration"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={admitWeight}
                    onChange={(e) => setAdmitWeight(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={admitTemp}
                    onChange={(e) => setAdmitTemp(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">HR (bpm)</label>
                  <input
                    type="number"
                    value={admitHR}
                    onChange={(e) => setAdmitHR(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">RR (rpm)</label>
                  <input
                    type="number"
                    value={admitRR}
                    onChange={(e) => setAdmitRR(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">IV Fluid Type</label>
                  <select
                    value={admitFluidType}
                    onChange={(e) => setAdmitFluidType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Lactated Ringers (LRS)">Lactated Ringers (LRS)</option>
                    <option value="0.9% Normal Saline (NaCl)">0.9% Normal Saline (NaCl)</option>
                    <option value="Plasmalyte-A">Plasmalyte-A</option>
                    <option value="Dextrose 5% in Water (D5W)">Dextrose 5% in Water (D5W)</option>
                    <option value="0.45% NaCl + 2.5% Dextrose">0.45% NaCl + 2.5% Dextrose</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fluid Rate (mL/hr)</label>
                  <input
                    type="number"
                    value={admitFluidRate}
                    onChange={(e) => setAdmitFluidRate(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency / Caution Flags</label>
                <input
                  type="text"
                  value={admitAlert}
                  onChange={(e) => setAdmitAlert(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. Caution: Aggressive when painful; Monitor blood glucose q4h"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Admit Inpatient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Daily Flowsheet Entry */}
      {isAddDailySheetOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <span>Record Daily Treatment Sheet</span>
                </h2>
                <p className="text-xs text-slate-400">Patient: {selectedRecord.petName} ({selectedRecord.wardNumber})</p>
              </div>
              <button onClick={() => setIsAddDailySheetOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDailySheet} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sheetWeight}
                    onChange={(e) => setSheetWeight(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sheetTemp}
                    onChange={(e) => setSheetTemp(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">HR (bpm)</label>
                  <input
                    type="number"
                    value={sheetHR}
                    onChange={(e) => setSheetHR(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">RR (rpm)</label>
                  <input
                    type="number"
                    value={sheetRR}
                    onChange={(e) => setSheetRR(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fluid Type & Rate</label>
                  <select
                    value={sheetFluidType}
                    onChange={(e) => setSheetFluidType(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Lactated Ringers (LRS)">Lactated Ringers (LRS)</option>
                    <option value="0.9% Normal Saline">0.9% Normal Saline</option>
                    <option value="Plasmalyte-A">Plasmalyte-A</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rate (mL/hr)</label>
                  <input
                    type="number"
                    value={sheetFluidRate}
                    onChange={(e) => setSheetFluidRate(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Food Intake</label>
                  <select
                    value={sheetFood}
                    onChange={(e) => setSheetFood(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Normal">Normal (100%)</option>
                    <option value="Partial (25-50%)">Partial (25-50%)</option>
                    <option value="Minimal (<25%)">Minimal (&lt;25%)</option>
                    <option value="None (Anorexic)">None (Anorexic)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Urine Output</label>
                  <select
                    value={sheetUrine}
                    onChange={(e) => setSheetUrine(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Absent (Oliguria/Anuria)">Absent (Anuria)</option>
                    <option value="Excessive (Polyuria)">Excessive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Stool Output</label>
                  <select
                    value={sheetStool}
                    onChange={(e) => setSheetStool(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Soft">Soft</option>
                    <option value="Diarrhea">Diarrhea</option>
                    <option value="None/Constipated">None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Progress Notes & Observations</label>
                <textarea
                  rows={3}
                  value={sheetNotes}
                  onChange={(e) => setSheetNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. Patient bright, alert and responsive. CRT < 2s. No vomiting in last 12 hours. Continue current IV rate."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDailySheetOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Daily Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Discharge Patient */}
      {isDischargeModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Discharge Inpatient</span>
              </h2>
              <button onClick={() => setIsDischargeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDischargePatient} className="space-y-3.5 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                You are about to discharge <strong>{selectedRecord.petName}</strong>. Please provide final clinical discharge summary and owner instructions.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Discharge Summary</label>
                <textarea
                  rows={3}
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Home Care & Follow-up Instructions</label>
                <textarea
                  rows={3}
                  value={dischargeInstructions}
                  onChange={(e) => setDischargeInstructions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDischargeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Discharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
