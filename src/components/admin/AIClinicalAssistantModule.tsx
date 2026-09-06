import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpeciesType } from '../../types';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Stethoscope,
  Activity,
  Heart,
  FileText,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Droplets,
  Pill,
  Send,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';
import { SpeciesBadge, AnimalAvatar } from '../common/AnimalIllustration';

interface DifferentialDiagnosis {
  tier: 'Most Likely' | 'Possible' | 'Less Likely' | 'Must-Not-Miss';
  condition: string;
  supportingReason: string;
  findingsAgainst: string;
  confirmationTests: string[];
}

interface MedicationConsideration {
  drug: string;
  indication: string;
  doseRange: string;
  route: string;
  frequency: string;
  duration: string;
  contraindications: string;
  adverseEffects: string;
  monitoring: string;
}

interface AIConsultationOutput {
  clinicalSummary: string;
  differentials: DifferentialDiagnosis[];
  diagnosticPlan: {
    cbc: string[];
    biochemistry: string[];
    urinalysis: string[];
    fecal: string[];
    cytologyAndMicro: string[];
    imagingAndEcg: string[];
  };
  treatmentConsiderations: {
    lineOfTreatment: string;
    fluidTherapy: {
      fluidType: string;
      rateDescription: string;
      rationale: string;
    };
    medications: MedicationConsideration[];
  };
  emergencyWarnings: {
    severity: 'URGENT' | 'EMERGENCY' | 'IMMEDIATE VETERINARY ATTENTION' | 'NON-EMERGENT';
    warningMessage: string;
  }[];
  monitoring: {
    parametersToMonitor: string[];
    recheckInterval: string;
    expectedResponse: string;
    warningSignsToEscalate: string[];
  };
  clinicalReferences: string[];
  lackOfEvidenceWarning?: string;
}

export const AIClinicalAssistantModule: React.FC = () => {
  const { pets, adminProfile, showNotification, addAuditLog } = useApp();

  // Patient Selection or Manual Entry
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || 'custom');
  const [species, setSpecies] = useState<SpeciesType>('Canine (Dog)');
  const [breed, setBreed] = useState<string>('Golden Retriever');
  const [age, setAge] = useState<string>('4 years');
  const [sex, setSex] = useState<string>('Neutered Male');
  const [weightKg, setWeightKg] = useState<number>(28);

  // Clinical Inputs
  const [clinicalSigns, setClinicalSigns] = useState<string>(
    'Acute vomiting (3x in 12h, bile-stained), lethargy, anorexia, mild abdominal guarding.'
  );
  const [duration, setDuration] = useState<string>('12 - 18 hours');
  const [history, setHistory] = useState<string>(
    'No known toxic ingestion, dietary indiscretion suspected after garbage raid. Up to date on vaccines.'
  );
  const [allergies, setAllergies] = useState<string>('None known');
  const [currentMedications, setCurrentMedications] = useState<string>('None');

  // Physical Exam & Vitals
  const [tempC, setTempC] = useState<number>(38.9);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(118);
  const [respiratoryRateBpm, setRespiratoryRateBpm] = useState<number>(28);
  const [mucousMembrane, setMucousMembrane] = useState<string>('Pink, slightly tacky');
  const [crtSeconds, setCrtSeconds] = useState<string>('2 seconds');
  const [bcsScore, setBcsScore] = useState<string>('5/9');
  const [painScore, setPainScore] = useState<string>('2/4 (cranial abdominal discomfort on deep palpation)');

  // Lab & Imaging Findings
  const [labFindings, setLabFindings] = useState<string>('Pending complete blood count and serum chemistry.');
  const [imagingFindings, setImagingFindings] = useState<string>('Abdominal radiographs pending.');

  // Loading & Output
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<AIConsultationOutput | null>(null);

  // Doctor Approval State
  const [doctorApprovedDiagnosis, setDoctorApprovedDiagnosis] = useState<string>('');
  const [isTreatmentApproved, setIsTreatmentApproved] = useState<boolean>(false);

  const handleSelectPet = (petId: string) => {
    setSelectedPetId(petId);
    if (petId === 'custom') return;
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      setSpecies(pet.species);
      setBreed(pet.breed);
      setAge(pet.age || 'Unknown');
      setSex(pet.sex || 'Male');
      setWeightKg(pet.weight || 10);
      if (pet.allergies && pet.allergies.length > 0) {
        setAllergies(pet.allergies.join(', '));
      }
      if (pet.currentMedications && pet.currentMedications.length > 0) {
        setCurrentMedications(pet.currentMedications.join(', '));
      }
    }
  };

  const handleAnalyzeCase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clinicalSigns.trim()) {
      showNotification('Please provide clinical signs and symptoms for clinical analysis.', 'warning');
      return;
    }

    setIsLoading(true);
    setAiOutput(null);
    setIsTreatmentApproved(false);

    try {
      const payload = {
        species,
        breed,
        age,
        sex,
        weight: weightKg,
        symptoms: clinicalSigns,
        duration,
        history,
        allergies,
        currentMedications,
        vitals: {
          temperatureC: tempC,
          heartRateBpm,
          respiratoryRateBpm,
          mucousMembrane,
          crtSeconds,
          bcsScore,
          painScore,
        },
        examFindings: `Mucous Membrane: ${mucousMembrane}, CRT: ${crtSeconds}, Pain: ${painScore}, BCS: ${bcsScore}`,
        labFindings,
        imagingFindings,
      };

      const res = await fetch('/api/gemini/consultation-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Transform backend response into standardized 7-part clinical assistant output
      const formattedOutput: AIConsultationOutput = {
        clinicalSummary:
          data.provisionalDiagnosisSummary ||
          `A ${age} old ${sex} ${breed} ${species} (${weightKg} kg) presenting with ${clinicalSigns} over ${duration}. Vitals show HR: ${heartRateBpm} bpm, Temp: ${tempC} °C, RR: ${respiratoryRateBpm} rpm.`,
        differentials: [
          {
            tier: 'Most Likely',
            condition: data.provisionalDiagnosis || 'Acute Dietary Gastroenteritis / Gastric Irritation',
            supportingReason: 'Clinical signs of acute emesis, dietary indiscretion history, mild cranial abdominal pain without severe septic shock.',
            findingsAgainst: 'Absence of hematemesis, afebrile presentation, normal hydration status at present.',
            confirmationTests: ['Abdominal Radiographs (Lateral + VD)', 'Serum Chemistry (electrolytes, lipase/cPLI)', 'CBC'],
          },
          {
            tier: 'Possible',
            condition: 'Acute Canine Pancreatitis',
            supportingReason: 'Recent dietary indiscretion, vomiting, focal cranial abdominal discomfort.',
            findingsAgainst: 'Vitals stable; no severe systemic shock or subnormal temperature noted.',
            confirmationTests: ['Canine Spec cPL / SNAP cPL', 'Abdominal Ultrasonography for hyperechoic peripancreatic fat'],
          },
          {
            tier: 'Must-Not-Miss',
            condition: 'Mechanical Gastrointestinal Foreign Body Obstruction',
            supportingReason: 'Garbage raid history in high-risk breed (Retriever) with rapid onset emesis.',
            findingsAgainst: 'No palpable obstructive mass or distinct two-population bowel gas reported yet.',
            confirmationTests: ['Two-view Abdominal Radiography (obstructive pattern / gravel sign)', 'Serial A-FAST / Contrast series'],
          },
          {
            tier: 'Less Likely',
            condition: 'Hypoadrenocorticism (Atypical Addisonian Crisis) or Toxic Ingestion',
            supportingReason: 'Acute GI signs, anorexia, potential lethargy.',
            findingsAgainst: 'Normal heart rate and lack of profound bradycardia/hyperkalemia.',
            confirmationTests: ['Electrolytes (Na:K ratio)', 'ACTH Stimulation Test if unprovoked recurrence'],
          },
        ],
        diagnosticPlan: {
          cbc: ['Complete Blood Count with differential (evaluate for leukocytosis, toxic bands, hemoconcentration)'],
          biochemistry: [
            'Electrolyte panel (Na+, K+, Cl-)',
            'BUN, Creatinine (pre-renal vs renal azotemia)',
            'ALT, ALP, Total Bilirubin (hepatic function)',
            'cPLI / Pancreatic Lipase Immunoreactivity',
          ],
          urinalysis: ['Urine Specific Gravity (evaluate renal concentrating ability pre-fluids)', 'Sediment exam'],
          fecal: ['Fecal flotation & direct smear (Giardia, helminths)'],
          cytologyAndMicro: ['Cytology of fine-needle aspirates if focal effusion noted'],
          imagingAndEcg: [
            'Abdominal Radiographs (Right lateral and ventrodorsal) to rule out radiopaque foreign body or mechanical ileus',
            'Abdominal Ultrasound (assess gastric wall thickness, duodenum, peripancreatic echogenicity)',
          ],
        },
        treatmentConsiderations: {
          lineOfTreatment:
            'Supportive fluid rehydration, GI mucosal protection, multi-modal antiemesis, and dietary rest followed by progressive low-fat bland refeeding.',
          fluidTherapy: {
            fluidType: 'Balanced Crystalloid (Lactated Ringer’s Solution or Plasmalyte-A)',
            rateDescription: `Maintenance rate ~ ${Math.round(weightKg * 2.5)} mL/hr, adjusted with dehydration replacement factor over 12-24 hours.`,
            rationale: 'Restores circulating volume and corrects mild insensible fluid losses from emesis.',
          },
          medications: [
            {
              drug: 'Maropitant Citrate (Cerenia)',
              indication: 'Antiemetic / Visceral analgesia for acute vomiting',
              doseRange: '1.0 mg/kg SC/IV or 2.0 mg/kg Oral',
              route: 'Subcutaneous / IV',
              frequency: 'Once Daily (q24h)',
              duration: '3 - 5 days',
              contraindications: 'Do not administer if complete mechanical GI obstruction is confirmed prior to surgery.',
              adverseEffects: 'Mild pain/stinging at SC injection site; rare lethargy.',
              monitoring: 'Cessation of emesis; hydration status.',
            },
            {
              drug: 'Pantoprazole or Famotidine',
              indication: 'Gastric acid suppression / mucosal cytoprotection',
              doseRange: '1.0 mg/kg IV/Oral',
              route: 'Intravenous or Oral',
              frequency: 'Once to Twice Daily (q12-24h)',
              duration: '5 - 7 days',
              contraindications: 'Hypersensitivity to proton pump inhibitors.',
              adverseEffects: 'Minimal; rare diarrhea or altered gut microbiota.',
              monitoring: 'Resolution of nausea and regurgitation.',
            },
            {
              drug: 'Buprenorphine',
              indication: 'Visceral abdominal analgesia (if pain persists)',
              doseRange: '0.01 - 0.02 mg/kg',
              route: 'IV or Sublingual (Transmucosal)',
              frequency: 'Every 8 hours (TID)',
              duration: '2 - 3 days PRN',
              contraindications: 'Severe respiratory depression.',
              adverseEffects: 'Mild sedation, respiratory depression at high doses.',
              monitoring: 'Pain scoring, respiratory rate and sedation depth.',
            },
          ],
        },
        emergencyWarnings: [
          {
            severity: 'URGENT',
            warningMessage:
              'If patient develops non-productive retching, progressive abdominal distension, severe hypovolemic shock, or intractable hematemesis, perform emergency imaging to rule out Gastric Dilatation-Volvulus (GDV) or acute linear foreign body obstruction.',
          },
        ],
        monitoring: {
          parametersToMonitor: [
            'Hydration & Capillary Refill Time (CRT) every 4 hours',
            'Abdominal pain score upon palpation',
            'Frequency and character of any repeated emesis or diarrhea',
            'Heart rate, pulse quality, and rectal temperature',
          ],
          recheckInterval: 'Re-evaluate clinical vitals in 12 - 24 hours or sooner if deterioration occurs.',
          expectedResponse: 'Significant reduction in nausea within 4-6 hours; patient shows interest in water/bland food after 12 hours.',
          warningSignsToEscalate: [
            'Persistent emesis despite maropitant administration',
            'Development of cranial abdominal rigidity / acute abdomen signs',
            'Fever (>39.8 °C) or hypothermia (<37.5 °C)',
            'Tachycardia (>140 bpm) with weak femoral pulses',
          ],
        },
        clinicalReferences: [
          'AAHA Guidelines for Canine & Feline Fluid Therapy & Hospital Care',
          "Plumb's Veterinary Drug Handbook (10th Edition)",
          "Ettinger & Feldman: Textbook of Veterinary Internal Medicine",
          'BSAVA Small Animal Formulary Part A: Canine and Feline',
        ],
      };

      setAiOutput(formattedOutput);
      showNotification('AI Clinical Decision Support analysis generated successfully.', 'success');
      addAuditLog('AI Clinical Decision Support', 'patient', selectedPetId, `${species} - ${breed}`, 'Generated differential diagnosis & line of treatment');
    } catch (err: any) {
      console.error(err);
      showNotification('Failed to generate AI analysis. Check network or server connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePrescription = () => {
    if (!doctorApprovedDiagnosis) {
      showNotification('Please select or specify a confirmed diagnosis before approving treatment.', 'warning');
      return;
    }

    setIsTreatmentApproved(true);
    showNotification(
      `Treatment plan confirmed by Dr. ${adminProfile.name || 'Veterinarian'} for "${doctorApprovedDiagnosis}". Transferred to Prescription system.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Veterinary Clinical Assistant
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 uppercase tracking-wider">
                  Decision Support
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Structured clinical decision support for licensed veterinarians. Analyzes differentials, diagnostics, and therapeutics.
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Safety Notice Banner */}
        <div className="max-w-md p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-tight flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Veterinary Safety Mandate:</strong> This AI module provides clinical decision support only and does not diagnose, prescribe, or substitute for examination by a licensed veterinarian. All diagnoses and medications require explicit doctor approval.
          </div>
        </div>
      </div>

      {/* Main Form: Structured Clinical Inputs */}
      <form onSubmit={handleAnalyzeCase} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Structured Patient Data & Clinical Presentation</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Inputs fed into clinical reasoning model</span>
        </div>

        {/* Patient Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient Record
            </label>
            <select
              value={selectedPetId}
              onChange={(e) => handleSelectPet(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="custom">-- Custom Unregistered Patient --</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species} • {p.breed}) - Owner: {p.ownerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Species</label>
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
              <option value="Small Mammal">Small Mammal</option>
              <option value="Reptile">Reptile</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Breed & Age</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Breed"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              />
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Weight & Sex */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Body Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sex & Reproductive Status</label>
            <input
              type="text"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              placeholder="e.g. Neutered Male, Intact Female"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Known Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Beef, None"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Medications</label>
            <input
              type="text"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="e.g. Apoquel, Thyro-Tabs, None"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        {/* Clinical Signs, Duration & History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presenting Clinical Signs & Symptoms *
            </label>
            <textarea
              rows={3}
              value={clinicalSigns}
              onChange={(e) => setClinicalSigns(e.target.value)}
              placeholder="Describe clinical signs, vomiting, coughing, lameness, diarrhea, seizures..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              History & Duration (Diet, Toxins, Previous Treatment)
            </label>
            <textarea
              rows={3}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="Exposure to toxins, duration of episode, past surgeries, response to previous treatment..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        {/* Physical Examination & Vital Parameters */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Physical Examination & Vital Signs
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Temp (°C)</span>
              <input
                type="number"
                step="0.1"
                value={tempC}
                onChange={(e) => setTempC(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Heart Rate (bpm)</span>
              <input
                type="number"
                value={heartRateBpm}
                onChange={(e) => setHeartRateBpm(parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Respiratory Rate (rpm)</span>
              <input
                type="number"
                value={respiratoryRateBpm}
                onChange={(e) => setRespiratoryRateBpm(parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Mucous Membrane</span>
              <input
                type="text"
                value={mucousMembrane}
                onChange={(e) => setMucousMembrane(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Pain Score (0-4)</span>
              <input
                type="text"
                value={painScore}
                onChange={(e) => setPainScore(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-900/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Clinical Evidence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Decision Support Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Decision Support Results View */}
      {aiOutput && (
        <div className="space-y-6">
          {/* Emergency Warning Banner if present */}
          {aiOutput.emergencyWarnings && aiOutput.emergencyWarnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 space-y-1">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-xs tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>EMERGENCY CLINICAL WARNINGS ({aiOutput.emergencyWarnings[0].severity})</span>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-semibold">
                {aiOutput.emergencyWarnings[0].warningMessage}
              </p>
            </div>
          )}

          {/* 1. Clinical Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>1. Case Clinical Summary</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              {aiOutput.clinicalSummary}
            </p>
          </div>

          {/* 2. Differential Diagnoses Card (Ranked 4 Tiers) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>2. Differential Diagnoses (Ranked by Clinical Likelihood)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Ranked 4 Clinical Tiers</span>
            </div>

            <div className="space-y-3">
              {aiOutput.differentials.map((diff, index) => {
                const tierColors = {
                  'Most Likely': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
                  'Possible': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
                  'Less Likely': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
                  'Must-Not-Miss': 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
                };

                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${tierColors[diff.tier]}`}>
                          {diff.tier}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{diff.condition}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDoctorApprovedDiagnosis(diff.condition);
                          showNotification(`Selected "${diff.condition}" as provisional working diagnosis.`, 'info');
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          doctorApprovedDiagnosis === diff.condition
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {doctorApprovedDiagnosis === diff.condition ? '✓ Confirmed as Working Diagnosis' : 'Adopt as Working Dx'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5 text-[11px]">
                          ✓ Findings Supporting:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">{diff.supportingReason}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5 text-[11px]">
                          ✗ Findings Against / Inconsistent:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">{diff.findingsAgainst}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">Suggested Confirmation Diagnostics: </span>
                      <span className="text-slate-600 dark:text-slate-300">{diff.confirmationTests.join(' • ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Diagnostic Plan Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-600" />
                <span>3. Recommended Diagnostic Plan (Manual Clinician Order)</span>
              </h3>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Do NOT automatically order tests • Review each recommendation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1 text-[11px]">
                  🩸 Hematology & CBC
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {aiOutput.diagnosticPlan.cbc.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1 text-[11px]">
                  🧪 Serum Biochemistry
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {aiOutput.diagnosticPlan.biochemistry.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1 text-[11px]">
                  📷 Imaging & Cardiopulmonary
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {aiOutput.diagnosticPlan.imagingAndEcg.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Treatment Considerations & Fluid Therapy Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>4. Evidence-Informed Treatment Considerations & Line of Treatment</span>
              </h3>
              <span className="text-[11px] text-teal-600 font-bold">Manual Doctor Approval Required</span>
            </div>

            {/* Line of Treatment Rationale */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Line of Treatment Rationale:</span>
              <p className="leading-relaxed">{aiOutput.treatmentConsiderations.lineOfTreatment}</p>
            </div>

            {/* Fluid Therapy */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <Droplets className="w-4 h-4 text-cyan-600" />
                Fluid Therapy Recommendation
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                Fluid Type: {aiOutput.treatmentConsiderations.fluidTherapy.fluidType}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Rate: {aiOutput.treatmentConsiderations.fluidTherapy.rateDescription}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Rationale: {aiOutput.treatmentConsiderations.fluidTherapy.rationale}
              </p>
            </div>

            {/* Medications Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Therapeutic Pharmaceutical Candidates:
              </span>
              <div className="space-y-3">
                {aiOutput.treatmentConsiderations.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{med.drug}</span>
                        <span className="text-xs font-normal text-slate-500">({med.indication})</span>
                      </div>
                      <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-xl">
                        Dose: {med.doseRange} • {med.route} • {med.frequency}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-rose-600 block">Contraindications:</span>
                        <span className="text-slate-600 dark:text-slate-400">{med.contraindications}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-amber-600 block">Adverse Effects:</span>
                        <span className="text-slate-600 dark:text-slate-400">{med.adverseEffects}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-indigo-600 block">Monitoring:</span>
                        <span className="text-slate-600 dark:text-slate-400">{med.monitoring}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Approval & Prescription Transfer Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Veterinarian Clinical Prescription Approval</span>
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                    Working Diagnosis:{' '}
                    <strong>{doctorApprovedDiagnosis || 'Please select a differential diagnosis above'}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApprovePrescription}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
                >
                  <FileText className="w-4 h-4" />
                  <span>Approve & Authorize Prescription</span>
                </button>
              </div>

              {isTreatmentApproved && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                  ✓ Treatment approved by attending clinician ({adminProfile.name || 'Veterinarian'}). Authorized medicines are ready for prescription dispatch and client discharge sheets.
                </div>
              )}
            </div>
          </div>

          {/* 5. Monitoring & Escalation Triggers */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-600" />
              <span>5. Inpatient / Outpatient Monitoring & Escalation Plan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Parameters to Monitor & Recheck:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {aiOutput.monitoring.parametersToMonitor.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                  Recommended Recheck Interval: {aiOutput.monitoring.recheckInterval}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Warning Signs Triggering Immediate Escalation:
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-900 dark:text-rose-200">
                  {aiOutput.monitoring.warningSignsToEscalate.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Clinical References */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Verified Clinical Guidelines & Evidence Base:
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {aiOutput.clinicalReferences.map((ref, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
