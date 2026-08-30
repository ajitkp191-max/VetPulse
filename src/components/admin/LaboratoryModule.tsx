import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LaboratoryReport } from '../../types';
import { VET_LAB_REFERENCES, getReferenceFlag } from '../../data/labReferences';
import {
  FlaskConical,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileText,
  Search,
  Upload,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const LaboratoryModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    labReports,
    addLabReport,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedReportId, setSelectedReportId] = useState<string | null>(labReports[0]?.id || null);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);

  // New Lab Report Form State
  const [testType, setTestType] = useState('Complete Blood Count (CBC) & Serum Biochemistry');
  const [sampleType, setSampleType] = useState('Whole Blood (EDTA) & Serum');
  const [technicianName, setTechnicianName] = useState('Clinical Pathology Laboratory');
  const [interpretation, setInterpretation] = useState('Mild azotemia and elevated ALT. Recommend repeat panel in 7 days.');

  // Prepopulated lab parameters
  const [paramsList, setParamsList] = useState<Array<{ name: string; key: string; value: number; unit: string }>>([
    { name: 'Red Blood Cells (RBC)', key: 'RBC', value: 6.8, unit: 'M/μL' },
    { name: 'Hemoglobin (Hb)', key: 'Hb', value: 14.5, unit: 'g/dL' },
    { name: 'Hematocrit (PCV)', key: 'PCV', value: 42.0, unit: '%' },
    { name: 'White Blood Cells (WBC)', key: 'WBC', value: 18.2, unit: 'K/μL' },
    { name: 'Platelets', key: 'Platelets', value: 320, unit: 'K/μL' },
    { name: 'Blood Glucose', key: 'Glucose', value: 110, unit: 'mg/dL' },
    { name: 'Blood Urea Nitrogen (BUN)', key: 'BUN', value: 34, unit: 'mg/dL' },
    { name: 'Creatinine', key: 'Creatinine', value: 2.1, unit: 'mg/dL' },
    { name: 'Alanine Aminotransferase (ALT)', key: 'ALT', value: 112, unit: 'U/L' },
  ]);

  const activeReport = labReports.find((r) => r.id === selectedReportId) || labReports[0];

  const handleCreateLabReport = (e: React.FormEvent) => {
    e.preventDefault();
    const species = selectedPet.species;
    const refTable = VET_LAB_REFERENCES[species] || VET_LAB_REFERENCES['Canine (Dog)'];

    const formattedParams = paramsList.map((p) => {
      const ref = refTable[p.key] || { low: 0, high: 100, unit: p.unit };
      const flag = getReferenceFlag(species, p.key, p.value);
      return {
        name: p.name,
        value: p.value,
        unit: p.unit,
        referenceRange: `${ref.low} - ${ref.high} ${ref.unit}`,
        flag,
      };
    });

    addLabReport({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      date: new Date().toISOString().split('T')[0],
      testType,
      sampleType,
      technicianName,
      veterinarianName: adminProfile.name,
      parameters: formattedParams,
      interpretation,
      status: 'Final',
    });

    setIsNewTestModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Clinical Diagnostic Laboratory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hematology (CBC), Biochemistry, Urinalysis, Fecal flotation & Rapid serological panels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewTestModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Lab Panel</span>
          </button>
        </div>
      </div>

      {/* Lab Reports Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Lab Reports */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Archived Test Panels ({labReports.length})
          </h4>
          {labReports.map((report) => {
            const isSelected = report.id === activeReport?.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {report.petName}
                  </span>
                  <span className="text-[10px] text-slate-400">{report.date}</span>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate">
                  {report.testType}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <SpeciesBadge species={report.species} />
                  <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    {report.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Lab Report Print & Analysis View */}
        {activeReport && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            {/* Header with Print */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Official Pathology Examination Report
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeReport.testType}
                </h3>
                <p className="text-xs text-slate-500">
                  Sample: {activeReport.sampleType} • Date: {activeReport.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Lab Report</span>
                </button>
              </div>
            </div>

            {/* Patient Meta Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Patient:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.petName}</div>
              </div>
              <div>
                <span className="text-slate-400">Species:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.species}</div>
              </div>
              <div>
                <span className="text-slate-400">Referring Vet:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeReport.veterinarianName}</div>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <div className="font-bold text-emerald-600 mt-0.5">{activeReport.status}</div>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="py-2.5 px-3">Analyte / Parameter</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Reference Interval ({activeReport.species})</th>
                    <th className="py-2.5 px-3 text-center">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeReport.parameters.map((param, index) => {
                    const isHigh = param.flag === 'HIGH';
                    const isLow = param.flag === 'LOW';
                    const isCritical = param.flag === 'CRITICAL';
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                          isCritical
                            ? 'bg-rose-50/50 dark:bg-rose-950/20'
                            : isHigh || isLow
                            ? 'bg-amber-50/30 dark:bg-amber-950/10'
                            : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {param.name}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {param.value} {param.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {param.referenceRange}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isHigh && (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <TrendingUp className="w-3 h-3" /> HIGH
                            </span>
                          )}
                          {isLow && (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              <TrendingDown className="w-3 h-3" /> LOW
                            </span>
                          )}
                          {isCritical && (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              <AlertTriangle className="w-3 h-3" /> CRITICAL
                            </span>
                          )}
                          {!isHigh && !isLow && !isCritical && (
                            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pathologist Clinical Interpretation */}
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs">
              <h5 className="font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Pathologist Diagnostic Interpretation</span>
              </h5>
              <p className="text-teal-950 dark:text-teal-100 leading-relaxed">
                {activeReport.interpretation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* NEW LAB TEST MODAL */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-600" />
                <span>Log New Diagnostic Laboratory Test</span>
              </h3>
              <button onClick={() => setIsNewTestModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLabReport} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient
                  </label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Test Panel Type
                  </label>
                  <input
                    type="text"
                    required
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Sample Specimen
                </label>
                <input
                  type="text"
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  placeholder="e.g. EDTA Whole Blood, Serum, Free-catch Urine"
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Analyte Value Inputs */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Parameters & Values ({selectedPet.species} Reference Intervals Auto-Computed)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {paramsList.map((p, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                      <span className="font-semibold text-[11px] block truncate">{p.name}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          step="0.1"
                          value={p.value}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setParamsList((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, value: val } : item))
                            );
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border text-xs font-bold text-teal-700 dark:text-teal-300"
                        />
                        <span className="text-[10px] text-slate-400 shrink-0">{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Pathologist / Veterinarian Interpretation
                </label>
                <textarea
                  rows={3}
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Save Lab Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
