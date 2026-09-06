import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpeciesType } from '../../types';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  ShieldAlert,
  ArrowRight,
  Copy,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

interface FormularyDrug {
  name: string;
  category: string;
  defaultDoseMgKg: number;
  doseRange: string;
  defaultConcentration: number;
  concentrationUnit: string;
  defaultRoute: 'Oral' | 'Subcutaneous' | 'Intravenous' | 'Intramuscular' | 'Otic' | 'Ophthalmic';
  defaultFrequency: string;
  frequencyMultiplier: number; // times per day
  speciesSafety: Partial<Record<SpeciesType, { safe: boolean; warning?: string }>>;
  contraindications: string;
}

const VET_FORMULARY: Record<string, FormularyDrug> = {
  meloxicam: {
    name: 'Meloxicam (Metacam)',
    category: 'NSAID / Analgesic',
    defaultDoseMgKg: 0.1,
    doseRange: '0.1 - 0.2 mg/kg (initial), then 0.05 - 0.1 mg/kg',
    defaultConcentration: 1.5,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Oral',
    defaultFrequency: 'Once Daily (q24h)',
    frequencyMultiplier: 1,
    speciesSafety: {
      'Canine (Dog)': { safe: true },
      'Feline (Cat)': { safe: true, warning: 'Black box warning in cats for chronic use. Single dose only (0.05 mg/kg); monitor renal function strictly.' },
    },
    contraindications: 'Do not use with corticosteroids or other NSAIDs. Contraindicated in dehydrated, hypovolemic, or renal impaired patients.',
  },
  amoxicillin_clav: {
    name: 'Amoxicillin-Clavulanate (Clavamox/Augmentin)',
    category: 'Broad Spectrum Antibiotic',
    defaultDoseMgKg: 13.75,
    doseRange: '12.5 - 20 mg/kg',
    defaultConcentration: 62.5,
    concentrationUnit: 'mg/mL (or 62.5/125/250/375 mg tabs)',
    defaultRoute: 'Oral',
    defaultFrequency: 'Twice Daily (q12h)',
    frequencyMultiplier: 2,
    speciesSafety: {
      'Canine (Dog)': { safe: true },
      'Feline (Cat)': { safe: true },
      'Small Mammal': { safe: false, warning: 'Lethal dysbiosis / enterotoxemia risk in guinea pigs, hamsters, rabbits.' },
    },
    contraindications: 'Known penicillin hypersensitivity. Avoid in lagomorphs and rodents.',
  },
  maropitant: {
    name: 'Maropitant Citrate (Cerenia)',
    category: 'NK-1 Receptor Antagonist Antiemetic',
    defaultDoseMgKg: 1.0,
    doseRange: '1.0 mg/kg (SC/IV) or 2.0 mg/kg (Oral)',
    defaultConcentration: 10,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Subcutaneous',
    defaultFrequency: 'Once Daily (q24h)',
    frequencyMultiplier: 1,
    speciesSafety: {
      'Canine (Dog)': { safe: true },
      'Feline (Cat)': { safe: true },
    },
    contraindications: 'Caution in patients with hepatic dysfunction or GI mechanical foreign body obstruction.',
  },
  gabapentin: {
    name: 'Gabapentin',
    category: 'Neuropathic Analgesic / Anxiolytic',
    defaultDoseMgKg: 10,
    doseRange: '5 - 20 mg/kg',
    defaultConcentration: 50,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Oral',
    defaultFrequency: 'Twice to Three Times Daily (q8-12h)',
    frequencyMultiplier: 2,
    speciesSafety: {
      'Canine (Dog)': { safe: true, warning: 'Ensure human liquid formulations do not contain xylitol (lethal canine hepatotoxin).' },
      'Feline (Cat)': { safe: true },
    },
    contraindications: 'Do not discontinue abruptly. Taper dosage after prolonged administration.',
  },
  enrofloxacin: {
    name: 'Enrofloxacin (Baytril)',
    category: 'Fluoroquinolone Antibiotic',
    defaultDoseMgKg: 5.0,
    doseRange: '5 - 10 mg/kg (Dogs), max 5 mg/kg (Cats)',
    defaultConcentration: 22.7,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Subcutaneous',
    defaultFrequency: 'Once Daily (q24h)',
    frequencyMultiplier: 1,
    speciesSafety: {
      'Canine (Dog)': { safe: true, warning: 'Avoid in young, growing puppies (<8-12 months) due to cartilage articular damage.' },
      'Feline (Cat)': { safe: true, warning: 'Retinal toxicity and irreversible blindness reported at doses >5 mg/kg.' },
    },
    contraindications: 'Growing animals with open epiphyses. Hepatic or severe renal insufficiency.',
  },
  furosemide: {
    name: 'Furosemide (Lasix)',
    category: 'Loop Diuretic',
    defaultDoseMgKg: 2.0,
    doseRange: '1 - 4 mg/kg IV/IM/PO (acute pulmonary edema)',
    defaultConcentration: 50,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Intravenous',
    defaultFrequency: 'Twice to Three Times Daily (q8-12h)',
    frequencyMultiplier: 2,
    speciesSafety: {
      'Canine (Dog)': { safe: true },
      'Feline (Cat)': { safe: true },
    },
    contraindications: 'Anuria, severe electrolyte depletion, hypovolemia, dehydration.',
  },
  propofol: {
    name: 'Propofol Injectable',
    category: 'Anesthetic Induction Agent',
    defaultDoseMgKg: 4.0,
    doseRange: '3 - 6 mg/kg (slow to effect)',
    defaultConcentration: 10,
    concentrationUnit: 'mg/mL',
    defaultRoute: 'Intravenous',
    defaultFrequency: 'Single Pre-Op Induction Dose',
    frequencyMultiplier: 1,
    speciesSafety: {
      'Canine (Dog)': { safe: true },
      'Feline (Cat)': { safe: true, warning: 'Heinz body anemia and delayed recovery with repetitive daily use in cats.' },
    },
    contraindications: 'Pre-existing hypotension, severe cardiac depression. Administer slowly over 60 seconds.',
  },
};

interface VeterinaryDoseCalculatorProps {
  onInsertPrescription?: (drugData: any) => void;
}

export const VeterinaryDoseCalculator: React.FC<VeterinaryDoseCalculatorProps> = ({ onInsertPrescription }) => {
  const { pets, showNotification, addAuditLog } = useApp();

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || 'custom');
  const [species, setSpecies] = useState<SpeciesType>('Canine (Dog)');
  const [weightKg, setWeightKg] = useState<number>(12.5);
  const [selectedDrugKey, setSelectedDrugKey] = useState<string>('meloxicam');
  const [prescribedDoseMgKg, setPrescribedDoseMgKg] = useState<number>(0.1);
  const [stockConcentration, setStockConcentration] = useState<number>(1.5);
  const [route, setRoute] = useState<string>('Oral');
  const [frequency, setFrequency] = useState<string>('Once Daily (q24h)');
  const [frequencyTimesPerDay, setFrequencyTimesPerDay] = useState<number>(1);
  const [doctorVerified, setDoctorVerified] = useState<boolean>(false);

  const selectedDrug = VET_FORMULARY[selectedDrugKey] || VET_FORMULARY.meloxicam;

  // Sync when pet selection changes
  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
    if (petId === 'custom') return;
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      setSpecies(pet.species);
      setWeightKg(pet.weight || 10);
    }
  };

  // Sync when drug selection changes
  const handleDrugChange = (drugKey: string) => {
    setSelectedDrugKey(drugKey);
    const drug = VET_FORMULARY[drugKey];
    if (drug) {
      setPrescribedDoseMgKg(drug.defaultDoseMgKg);
      setStockConcentration(drug.defaultConcentration);
      setRoute(drug.defaultRoute);
      setFrequency(drug.defaultFrequency);
      setFrequencyTimesPerDay(drug.frequencyMultiplier);
      setDoctorVerified(false);
    }
  };

  // Calculations
  const requiredDoseMg = Number((weightKg * prescribedDoseMgKg).toFixed(3));
  const requiredVolumeMl = stockConcentration > 0 ? Number((requiredDoseMg / stockConcentration).toFixed(3)) : 0;
  const totalDailyDoseMg = Number((requiredDoseMg * frequencyTimesPerDay).toFixed(3));
  const totalDailyVolumeMl = Number((requiredVolumeMl * frequencyTimesPerDay).toFixed(3));

  // Species safety warning check
  const speciesWarning = selectedDrug.speciesSafety[species]?.warning;
  const isSpeciesUnsafe = selectedDrug.speciesSafety[species]?.safe === false;

  const handleCopyToClipboard = () => {
    const text = `${selectedDrug.name}: ${requiredDoseMg} mg (${requiredVolumeMl} mL) via ${route} ${frequency}. Total daily dose: ${totalDailyDoseMg} mg.`;
    navigator.clipboard.writeText(text);
    showNotification('Calculation copied to clipboard!', 'success');
  };

  const handleInsertToRx = () => {
    if (!doctorVerified) {
      showNotification('Doctor must verify dose calculation before inserting into Prescription.', 'warning');
      return;
    }

    if (onInsertPrescription) {
      onInsertPrescription({
        medicineName: selectedDrug.name,
        dosage: `${requiredDoseMg} mg (${requiredVolumeMl} mL)`,
        route,
        frequency,
        duration: '5 days',
        instructions: `Administer ${requiredVolumeMl} mL (${requiredDoseMg} mg) by ${route}.`,
      });
    }

    addAuditLog(
      'Dose Calculation Verified',
      'patient',
      selectedPetId,
      selectedDrug.name,
      `Calculated ${requiredDoseMg}mg (${requiredVolumeMl}mL) for ${weightKg}kg ${species}`
    );

    showNotification(`Added ${selectedDrug.name} to prescription buffer!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Veterinary Weight-Based Dose Calculator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent mathematical formulation & species-specific therapeutic window verification.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Clinical Decision Aid • Requires Licensed Veterinarian Verification</span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Calculation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>Patient & Drug Parameters</span>
              <span className="text-[11px] text-teal-600 font-normal">Step 1: Clinical Input</span>
            </h2>

            {/* Quick Patient Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Patient or Custom Entry
              </label>
              <select
                value={selectedPetId}
                onChange={(e) => handlePetChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                <option value="custom">-- Custom Patient Input --</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} • {p.weight} kg) - {p.ownerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Species
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Canine (Dog)">Canine (Dog)</option>
                  <option value="Feline (Cat)">Feline (Cat)</option>
                  <option value="Equine (Horse)">Equine (Horse)</option>
                  <option value="Bovine (Cattle)">Bovine (Cattle)</option>
                  <option value="Avian (Bird)">Avian (Bird)</option>
                  <option value="Small Mammal">Small Mammal (Rabbit, Rodent)</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Body Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Drug Formulary Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Therapeutic Agent (Formulary)
              </label>
              <select
                value={selectedDrugKey}
                onChange={(e) => handleDrugChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300"
              >
                {Object.entries(VET_FORMULARY).map(([key, drug]) => (
                  <option key={key} value={key}>
                    {drug.name} • {drug.category} ({drug.defaultDoseMgKg} mg/kg)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Typical range: <span className="font-semibold text-slate-600 dark:text-slate-300">{selectedDrug.doseRange}</span>
              </p>
            </div>

            {/* Dose, Concentration, Route Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prescribed Dose (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={prescribedDoseMgKg}
                  onChange={(e) => setPrescribedDoseMgKg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Concentration ({selectedDrug.concentrationUnit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={stockConcentration}
                  onChange={(e) => setStockConcentration(parseFloat(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Oral">Oral (PO)</option>
                  <option value="Subcutaneous">Subcutaneous (SC)</option>
                  <option value="Intravenous">Intravenous (IV)</option>
                  <option value="Intramuscular">Intramuscular (IM)</option>
                  <option value="Otic">Otic (Ear)</option>
                  <option value="Ophthalmic">Ophthalmic (Eye)</option>
                </select>
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dosing Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                    if (e.target.value.includes('q24h') || e.target.value.includes('Once')) setFrequencyTimesPerDay(1);
                    else if (e.target.value.includes('q12h') || e.target.value.includes('Twice')) setFrequencyTimesPerDay(2);
                    else if (e.target.value.includes('q8h') || e.target.value.includes('Three')) setFrequencyTimesPerDay(3);
                    else if (e.target.value.includes('q6h')) setFrequencyTimesPerDay(4);
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Once Daily (q24h)">Once Daily (SID / q24h) - 1x/day</option>
                  <option value="Twice Daily (q12h)">Twice Daily (BID / q12h) - 2x/day</option>
                  <option value="Three Times Daily (q8h)">Three Times Daily (TID / q8h) - 3x/day</option>
                  <option value="Four Times Daily (q6h)">Four Times Daily (QID / q6h) - 4x/day</option>
                  <option value="Single Pre-Op Induction Dose">Single Pre-Op Induction Dose</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dose Administrations / Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={frequencyTimesPerDay}
                  onChange={(e) => setFrequencyTimesPerDay(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Species Warning Box if present */}
            {speciesWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Species Precaution ({species}):</span>
                </div>
                <p className="leading-relaxed">{speciesWarning}</p>
              </div>
            )}

            {isSpeciesUnsafe && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>CONTRAINDICATED IN SPECIES:</span>
                </div>
                <p className="leading-relaxed font-semibold">
                  This pharmaceutical is contraindicated in {species}. Do NOT administer!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Output & Transparent Formula Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-teal-500/30 shadow-xl space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-300">
                Transparent Dosage Math
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                Calculated Dose Output
              </h2>
            </div>

            {/* Primary Result Box */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-teal-200 font-medium">Single Administration Volume:</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">{requiredVolumeMl}</span>
                  <span className="text-sm font-bold text-teal-300 ml-1">mL</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-2 text-xs">
                <span className="text-teal-200">Active Principle per Dose:</span>
                <span className="font-bold text-white text-sm">{requiredDoseMg} mg</span>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-2 text-xs">
                <span className="text-teal-200">Total Daily Requirement:</span>
                <span className="font-bold text-teal-300 text-sm">
                  {totalDailyDoseMg} mg ({totalDailyVolumeMl} mL/day)
                </span>
              </div>
            </div>

            {/* Mathematical Transparency Explanation */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Calculation Transparency Formula
              </span>
              <div className="font-mono text-[11px] space-y-1.5 text-teal-100/90">
                <p>
                  <strong>Dose Required (mg)</strong> = Weight ({weightKg} kg) × Prescribed Dose ({prescribedDoseMgKg} mg/kg)
                  <br />
                  = <span className="text-teal-300 font-bold">{requiredDoseMg} mg</span>
                </p>
                <p>
                  <strong>Volume Required (mL)</strong> = Dose ({requiredDoseMg} mg) ÷ Concentration ({stockConcentration} mg/mL)
                  <br />
                  = <span className="text-teal-300 font-bold">{requiredVolumeMl} mL</span>
                </p>
                <p>
                  <strong>Total Daily Dose</strong> = {requiredDoseMg} mg × {frequencyTimesPerDay} times/day
                  <br />
                  = <span className="text-teal-300 font-bold">{totalDailyDoseMg} mg/day</span>
                </p>
              </div>
            </div>

            {/* Doctor Verification Checkbox */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doctorVerified}
                  onChange={(e) => setDoctorVerified(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-xs text-white leading-relaxed">
                  <strong>Veterinarian Dose Verification:</strong> I have reviewed the clinical weight, stock concentration, and species safety profile and verify that this dosage is clinically indicated.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" /> Copy Prescription Text
              </button>

              <button
                type="button"
                onClick={handleInsertToRx}
                disabled={!doctorVerified || isSpeciesUnsafe}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  doctorVerified && !isSpeciesUnsafe
                    ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md shadow-teal-950/40'
                    : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <FileText className="w-4 h-4" /> Insert into Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
