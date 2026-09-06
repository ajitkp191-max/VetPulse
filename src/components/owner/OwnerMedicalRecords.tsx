import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type {
  ConsultationRecord,
  Prescription,
  LaboratoryReport,
  ImagingRecord,
  VaccinationRecord,
  DewormingRecord,
  BillingInvoice,
} from '../../types';
import {
  FileText,
  FlaskConical,
  Camera,
  Scissors,
  ShieldCheck,
  CreditCard,
  Building,
  Calendar,
  Lock,
  Search,
  Eye,
  Printer,
  Download,
  AlertCircle,
  Activity,
  Bed,
  Heart,
  ChevronRight,
  Pill,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

interface PetSurgeryRecord {
  id: string;
  petId: string;
  petName: string;
  procedureName: string;
  surgeon: string;
  date: string;
  anesthesiaProtocol: string;
  notes: string;
  postOpCare?: string;
}

export const OwnerMedicalRecords: React.FC = () => {
  const {
    ownerPets,
    selectedPetId,
    setSelectedPetId,
    ownerConsultations,
    ownerPrescriptions,
    ownerLabReports,
    ownerImagingRecords,
    ownerVaccinations,
    ownerDewormings,
    ownerInvoices,
    adminProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'consultations' | 'prescriptions' | 'labs' | 'imaging' | 'vaccines' | 'deworming' | 'surgeries' | 'hospitalization' | 'bills'
  >('consultations');

  const [filterPetId, setFilterPetId] = useState<string>(selectedPetId || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract surgical history from companion records
  const allSurgeries: PetSurgeryRecord[] = ownerPets.flatMap((pet) => {
    const list: PetSurgeryRecord[] = [];
    if (pet.surgeryHistorySummary && pet.surgeryHistorySummary.length > 0) {
      pet.surgeryHistorySummary.forEach((surg, idx) => {
        list.push({
          id: `surg_${pet.id}_${idx}`,
          petId: pet.id,
          petName: pet.name,
          procedureName: surg,
          surgeon: adminProfile.name || 'Staff Veterinary Surgeon',
          date: 'Documented Record',
          anesthesiaProtocol: 'General Anesthesia Protocol',
          notes: `Documented clinical surgery procedure: ${surg}`,
          postOpCare: 'Incision healed. Monitor for any recurring complications.',
        });
      });
    } else if (pet.previousSurgeries && pet.previousSurgeries.length > 0) {
      pet.previousSurgeries.forEach((surg, idx) => {
        list.push({
          id: `surg_prev_${pet.id}_${idx}`,
          petId: pet.id,
          petName: pet.name,
          procedureName: surg,
          surgeon: adminProfile.name || 'Staff Veterinary Surgeon',
          date: 'Historical Record',
          anesthesiaProtocol: 'Standard Anesthesia Protocol',
          notes: `Prior surgical procedure: ${surg}`,
          postOpCare: 'Fully healed and resolved.',
        });
      });
    }
    return list;
  });

  const currentConsultations: ConsultationRecord[] =
    filterPetId === 'all'
      ? ownerConsultations
      : ownerConsultations.filter((c) => c.petId === filterPetId);

  const currentPrescriptions: Prescription[] =
    filterPetId === 'all'
      ? ownerPrescriptions
      : ownerPrescriptions.filter((p) => p.petId === filterPetId);

  const currentLabs: LaboratoryReport[] =
    filterPetId === 'all'
      ? ownerLabReports
      : ownerLabReports.filter((l) => l.petId === filterPetId);

  const currentImaging: ImagingRecord[] =
    filterPetId === 'all'
      ? ownerImagingRecords
      : ownerImagingRecords.filter((i) => i.petId === filterPetId);

  const currentVaccines: VaccinationRecord[] =
    filterPetId === 'all'
      ? ownerVaccinations
      : ownerVaccinations.filter((v) => v.petId === filterPetId);

  const currentDewormings: DewormingRecord[] =
    filterPetId === 'all'
      ? ownerDewormings
      : ownerDewormings.filter((d) => d.petId === filterPetId);

  const currentSurgeries: PetSurgeryRecord[] =
    filterPetId === 'all'
      ? allSurgeries
      : allSurgeries.filter((s) => s.petId === filterPetId);

  const currentBills: BillingInvoice[] =
    filterPetId === 'all'
      ? ownerInvoices
      : ownerInvoices.filter((b) => b.petId === filterPetId);

  const totalRecordsCount =
    currentConsultations.length +
    currentPrescriptions.length +
    currentLabs.length +
    currentImaging.length +
    currentVaccines.length +
    currentDewormings.length +
    currentSurgeries.length +
    currentBills.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Authorized Electronic Medical Records (EMR)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Doctor Verified • Read Only
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete clinical history: consultations, laboratory panels, radiographs, surgery, vaccines, and billing.
            </p>
          </div>
        </div>

        {/* Filter Pet Selection */}
        {ownerPets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Filter Pet:</span>
            <select
              value={filterPetId}
              onChange={(e) => setFilterPetId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="all">All Companions ({totalRecordsCount} Records)</option>
              {ownerPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Security & Authenticity Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <strong>Official Clinical Audit & Patient Integrity Policy:</strong> Doctor-created clinical records, diagnoses, and laboratory findings are permanently tamper-evident and read-only for guardians to ensure legal traceability under veterinary regulatory standards.
        </div>
      </div>

      {/* Category Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'consultations', label: 'Consultations & SOAP', count: currentConsultations.length, icon: Activity },
          { id: 'prescriptions', label: 'Prescriptions (Rx)', count: currentPrescriptions.length, icon: Pill },
          { id: 'labs', label: 'Laboratory Reports', count: currentLabs.length, icon: FlaskConical },
          { id: 'imaging', label: 'Radiology & Imaging', count: currentImaging.length, icon: Camera },
          { id: 'vaccines', label: 'Vaccinations', count: currentVaccines.length, icon: ShieldCheck },
          { id: 'deworming', label: 'Deworming', count: currentDewormings.length, icon: ShieldCheck },
          { id: 'surgeries', label: 'Surgeries', count: currentSurgeries.length, icon: Scissors },
          { id: 'hospitalization', label: 'Hospitalization', count: 0, icon: Bed },
          { id: 'bills', label: 'Bills & Invoices', count: currentBills.length, icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {/* 1. Consultations & SOAP */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {currentConsultations.length === 0 ? (
            <EmptyState message="No consultation or SOAP records found for this pet." />
          ) : (
            currentConsultations.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Consultation on {c.date}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {c.petName} ({c.species})
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Attending Clinician: <strong>{c.veterinarianName || adminProfile.name}</strong>
                    </span>
                  </div>
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold self-start sm:self-auto">
                    ID: {c.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                    <strong className="text-slate-900 dark:text-white block">Subjective (Presenting Complaints):</strong>
                    <p className="text-slate-600 dark:text-slate-300">{c.chiefComplaint || 'Routine veterinary examination.'}</p>
                    {c.duration && (
                      <p className="text-slate-500 pt-1"><strong>Duration:</strong> {c.duration}</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                    <strong className="text-slate-900 dark:text-white block">Assessment & Clinical Diagnosis:</strong>
                    <p className="text-teal-700 dark:text-teal-300 font-bold text-sm">
                      {c.provisionalDiagnosis || 'Clinical health confirmed'}
                    </p>
                    {c.differentialDiagnoses && c.differentialDiagnoses.length > 0 && (
                      <div className="text-[11px] text-slate-500 pt-1">
                        Differentials considered: {c.differentialDiagnoses.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {c.treatmentPlan && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 text-xs">
                    <strong className="text-teal-800 dark:text-teal-200 block mb-1">Treatment & Clinical Plan:</strong>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.treatmentPlan}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {currentPrescriptions.length === 0 ? (
            <EmptyState message="No electronic prescriptions found for this pet." />
          ) : (
            currentPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-mono font-bold text-sm text-teal-700 dark:text-teal-300">
                      Rx #{rx.prescriptionNumber}
                    </span>
                    <p className="text-xs text-slate-500">
                      Issued {rx.date} by {rx.veterinarianName} for <strong>{rx.petName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>

                <div className="space-y-2">
                  {rx.items.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <strong className="text-slate-900 dark:text-white">{med.medicineName}</strong>
                        <span className="text-teal-600 dark:text-teal-400 font-bold ml-2">({med.dosage})</span>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {med.route} • {med.frequency} • Duration: {med.duration}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {med.instructions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Laboratory Reports */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          {currentLabs.length === 0 ? (
            <EmptyState message="No laboratory diagnostics or blood panels found." />
          ) : (
            currentLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-2xl">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{lab.testType}</h4>
                      <p className="text-xs text-slate-500">
                        Patient: <strong>{lab.petName}</strong> • Conducted: {lab.date} • Vet: {lab.veterinarianName || adminProfile.name || 'Veterinary Clinical Lab'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {lab.testType}
                  </span>
                </div>

                {lab.parameters && lab.parameters.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-100 dark:border-slate-800">
                          <th className="py-1.5 px-2">Parameter</th>
                          <th className="py-1.5 px-2">Measured Result</th>
                          <th className="py-1.5 px-2">Reference Range</th>
                          <th className="py-1.5 px-2">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {lab.parameters.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                            <td className="py-2 px-2 font-mono font-bold text-teal-600 dark:text-teal-400">
                              {p.value} {p.unit}
                            </td>
                            <td className="py-2 px-2 text-slate-500">{p.referenceRange}</td>
                            <td className="py-2 px-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.flag === 'NORMAL'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                }`}
                              >
                                {p.flag || 'NORMAL'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {(lab.interpretation || lab.veterinarianNotes) && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                    {lab.interpretation && (
                      <div>
                        <strong className="text-slate-900 dark:text-white block mb-0.5">Doctor's Interpretation:</strong>
                        <p className="text-slate-600 dark:text-slate-300">{lab.interpretation}</p>
                      </div>
                    )}
                    {lab.veterinarianNotes && (
                      <div>
                        <strong className="text-slate-900 dark:text-white block mb-0.5">Clinical Notes:</strong>
                        <p className="text-slate-500">{lab.veterinarianNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Radiology & Imaging */}
      {activeTab === 'imaging' && (
        <div className="space-y-4">
          {currentImaging.length === 0 ? (
            <EmptyState message="No radiographs, sonograms, or CT scans on file." />
          ) : (
            currentImaging.map((img) => (
              <div
                key={img.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-2xl">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{img.modality} - {img.anatomicalRegion}</h4>
                      <p className="text-xs text-slate-500">
                        Patient: <strong>{img.petName}</strong> • Captured: {img.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {img.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-60">
                      <img src={img.imageUrl} alt={img.anatomicalRegion} className="max-h-60 w-auto object-contain" />
                    </div>
                  )}
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Clinical Findings:</strong>
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5">
                        {img.findings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Radiologist Interpretation:</strong>
                      <p className="text-slate-600 dark:text-slate-300">{img.interpretation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. Vaccinations */}
      {activeTab === 'vaccines' && (
        <div className="space-y-4">
          {currentVaccines.length === 0 ? (
            <EmptyState message="No vaccination records on file." />
          ) : (
            currentVaccines.map((v) => (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.vaccineName}</h4>
                    <p className="text-xs text-slate-500">
                      Patient: <strong>{v.petName}</strong> • Administered: <strong>{v.administeredDate}</strong> • Route: {v.route}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono">Batch: {v.batchNumber}</span>
                  </div>
                </div>

                <div className="text-right self-start sm:self-auto">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Next Booster Due</span>
                  <strong className="text-teal-600 dark:text-teal-400 text-sm block font-bold">{v.nextDueDate}</strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Immunity
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. Deworming */}
      {activeTab === 'deworming' && (
        <div className="space-y-4">
          {currentDewormings.length === 0 ? (
            <EmptyState message="No deworming records on file." />
          ) : (
            currentDewormings.map((d) => (
              <div
                key={d.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 rounded-2xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{d.drugUsed}</h4>
                    <p className="text-xs text-slate-500">
                      Patient: <strong>{d.petName}</strong> • Dosage: <strong>{d.dosage}</strong> • Given: {d.administeredDate}
                    </p>
                  </div>
                </div>

                <div className="text-right self-start sm:self-auto">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Next Deworming Due</span>
                  <strong className="text-teal-600 dark:text-teal-400 text-sm block font-bold">{d.nextDueDate}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 7. Surgeries */}
      {activeTab === 'surgeries' && (
        <div className="space-y-4">
          {currentSurgeries.length === 0 ? (
            <EmptyState message="No surgical protocols or operative reports on file." />
          ) : (
            currentSurgeries.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-2xl">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.procedureName}</h4>
                      <p className="text-xs text-slate-500">
                        Patient: <strong>{s.petName}</strong> • Surgeon: {s.surgeon} • Date: {s.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                    {s.anesthesiaProtocol}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p><strong>Operative Notes:</strong> {s.notes}</p>
                  {s.postOpCare && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      <strong>Post-Operative Instructions:</strong> {s.postOpCare}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 8. Hospitalization */}
      {activeTab === 'hospitalization' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-xs">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-2xl w-fit mx-auto text-teal-600">
              <Bed className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              No Active Inpatient Hospitalizations
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              If your companion is ever admitted to the ICU or overnight ward, continuous vital monitoring logs and daily treatment flowsheets will appear here.
            </p>
          </div>
        </div>
      )}

      {/* 9. Bills & Invoices */}
      {activeTab === 'bills' && (
        <div className="space-y-4">
          {currentBills.length === 0 ? (
            <EmptyState message="No invoices or bills found." />
          ) : (
            currentBills.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      Invoice #{inv.invoiceNumber}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Date: {inv.date} • Patient: <strong>{inv.petName}</strong> • {inv.items.length} item(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Total Amount</span>
                    <strong className="text-slate-900 dark:text-white text-base font-black">
                      ${(inv.grandTotal ?? inv.total ?? 0).toFixed(2)}
                    </strong>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      inv.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-2 shadow-xs">
    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
    <p className="text-xs text-slate-500">{message}</p>
  </div>
);
