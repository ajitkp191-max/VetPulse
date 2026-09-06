import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription, PrescriptionItem } from '../../types';
import {
  FileText,
  Download,
  Printer,
  Eye,
  Calendar,
  User,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  Building,
  Heart,
  X,
  Stethoscope,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const OwnerPrescriptions: React.FC = () => {
  const {
    ownerPets,
    selectedPetId,
    setSelectedPetId,
    ownerPrescriptions,
    adminProfile,
    showNotification,
  } = useApp();

  const [filterPetId, setFilterPetId] = useState<string>(selectedPetId || 'all');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const filteredPrescriptions = ownerPrescriptions.filter((rx) => {
    if (filterPetId === 'all') return true;
    return rx.petId === filterPetId;
  });

  const handlePrint = (rx: Prescription) => {
    setSelectedRx(rx);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleDownload = (rx: Prescription) => {
    const rxHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Veterinary Prescription - ${rx.prescriptionNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 20px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #0f766e; }
          .badge { display: inline-block; padding: 4px 10px; background: #ccfbf1; color: #0f766e; border-radius: 9999px; font-size: 12px; font-weight: bold; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 12px; }
          .rx-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .rx-table th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 12px; border-bottom: 2px solid #cbd5e1; }
          .rx-table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          .doctor-sig { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">${rx.clinicName || adminProfile.clinicName}</div>
          <div style="font-size: 12px; color: #64748b;">${rx.clinicAddress || adminProfile.clinicAddress} • Contact: ${adminProfile.contactNumber}</div>
          <div style="margin-top: 8px;"><span class="badge">OFFICIAL VETERINARY PRESCRIPTION</span></div>
        </div>

        <div class="meta-grid">
          <div>
            <strong>Rx Number:</strong> ${rx.prescriptionNumber}<br>
            <strong>Prescription Date:</strong> ${rx.date}<br>
            <strong>Attending Doctor:</strong> ${rx.veterinarianName} (${rx.vetRegNumber || 'VET-REG'})<br>
            <strong>Clinical Diagnosis:</strong> ${rx.diagnosis || 'Clinical evaluation'}
          </div>
          <div>
            <strong>Patient Name:</strong> ${rx.petName} (${rx.species})<br>
            <strong>Breed & Age:</strong> ${rx.breed} • ${rx.age}<br>
            <strong>Patient Weight:</strong> ${rx.weight} kg<br>
            <strong>Pet Guardian:</strong> ${rx.ownerName} (${rx.ownerPhone})
          </div>
        </div>

        <h3>Prescribed Medications (Rx)</h3>
        <table class="rx-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Strength / Dose</th>
              <th>Route</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${rx.items.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.medicineName}</strong></td>
                <td>${item.dosage}</td>
                <td>${item.route}</td>
                <td>${item.frequency}</td>
                <td>${item.duration}</td>
                <td>${item.instructions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${rx.generalInstructions ? `<p style="margin-top: 20px; font-size: 13px;"><strong>General Instructions:</strong> ${rx.generalInstructions}</p>` : ''}
        ${rx.dietaryRecommendations ? `<p style="font-size: 13px;"><strong>Dietary Care:</strong> ${rx.dietaryRecommendations}</p>` : ''}
        ${rx.nextVisitDate ? `<p style="font-size: 13px;"><strong>Next Follow-up Visit:</strong> ${rx.nextVisitDate}</p>` : ''}

        <div class="footer">
          <div>Issued via VetCare Pro Electronic Medical Records Platform</div>
          <div class="doctor-sig">
            <strong>${rx.veterinarianName}</strong><br>
            Authorized Veterinary Clinician
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([rxHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription-${rx.petName}-${rx.prescriptionNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded Rx: ${rx.prescriptionNumber}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Veterinary Prescriptions (Rx)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View, download, and print authorized medical prescriptions issued by your attending veterinarian.
            </p>
          </div>
        </div>

        {/* Filter by companion */}
        {ownerPets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Filter Pet:</span>
            <select
              value={filterPetId}
              onChange={(e) => setFilterPetId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="all">All Companions ({ownerPrescriptions.length})</option>
              {ownerPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
          <div className="p-4 bg-teal-50 dark:bg-teal-950/60 rounded-3xl w-fit mx-auto text-teal-600">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            No Prescriptions Issued Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When your veterinarian conducts a consultation and generates a prescription for your pet, it will appear here with full dosage and administration guidelines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-teal-400 dark:hover:border-teal-700 transition-all space-y-5"
            >
              {/* Rx Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500 text-white rounded-2xl shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white font-mono">
                        {rx.prescriptionNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        Authorized Rx
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Issued: <strong>{rx.date}</strong></span>
                      <span>•</span>
                      <span>Doctor: <strong>{rx.veterinarianName}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedRx(rx)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Details</span>
                  </button>
                  <button
                    onClick={() => handleDownload(rx)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={() => handlePrint(rx)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print Rx</span>
                  </button>
                </div>
              </div>

              {/* Patient & Diagnosis Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{rx.petName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Species / Breed</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{rx.species} • {rx.breed}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight / Age</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{rx.weight} kg • {rx.age}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Diagnosis</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{rx.diagnosis || 'Clinical evaluation'}</span>
                </div>
              </div>

              {/* Prescribed Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Medicine</th>
                      <th className="py-2 px-3">Strength / Dose</th>
                      <th className="py-2 px-3">Route</th>
                      <th className="py-2 px-3">Frequency</th>
                      <th className="py-2 px-3">Duration</th>
                      <th className="py-2 px-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rx.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-teal-500" />
                          <span>{item.medicineName}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-teal-700 dark:text-teal-300">
                          {item.dosage}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                          {item.route}
                        </td>
                        <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold">
                          {item.frequency}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {item.duration}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {item.instructions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Special Instructions & Next Visit */}
              {(rx.generalInstructions || rx.nextVisitDate) && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  {rx.generalInstructions && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Instructions:</span>
                      <span>{rx.generalInstructions}</span>
                    </div>
                  )}
                  {rx.nextVisitDate && (
                    <div className="flex items-center gap-1.5 text-teal-600 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Next Follow-up Visit: {rx.nextVisitDate}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-600 text-white rounded-2xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Prescription Details - {selectedRx.prescriptionNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Issued by {selectedRx.veterinarianName} on {selectedRx.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <div>
                  <strong>Clinic:</strong> {selectedRx.clinicName || adminProfile.clinicName}<br />
                  <strong>Address:</strong> {selectedRx.clinicAddress || adminProfile.clinicAddress}<br />
                  <strong>Doctor:</strong> {selectedRx.veterinarianName} ({selectedRx.vetRegNumber || 'VET-REG'})
                </div>
                <div>
                  <strong>Patient:</strong> {selectedRx.petName} ({selectedRx.species})<br />
                  <strong>Diagnosis:</strong> {selectedRx.diagnosis || 'Clinical evaluation'}<br />
                  <strong>Follow-up:</strong> {selectedRx.nextVisitDate || 'As needed'}
                </div>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white pt-2">
                Prescribed Medications
              </h4>

              <div className="space-y-3">
                {selectedRx.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-teal-700 dark:text-teal-300">
                        {idx + 1}. {item.medicineName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[10px]">
                        {item.dosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-400 pt-1">
                      <div><strong className="text-slate-800 dark:text-slate-200">Route:</strong> {item.route}</div>
                      <div><strong className="text-slate-800 dark:text-slate-200">Frequency:</strong> {item.frequency}</div>
                      <div><strong className="text-slate-800 dark:text-slate-200">Duration:</strong> {item.duration}</div>
                    </div>
                    <div className="text-slate-500 pt-1">
                      <strong className="text-slate-800 dark:text-slate-200">Instructions:</strong> {item.instructions}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleDownload(selectedRx)}
                className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={() => handlePrint(selectedRx)}
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
