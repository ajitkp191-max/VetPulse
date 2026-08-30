import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Sparkles,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  AlertCircle,
  Eye,
  CheckCircle2,
  FileText,
  Save,
  Clock,
  Send,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import { getConsultationAIAssist } from '../../services/geminiService';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const ConsultationModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    addConsultation,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('Acute vomiting after meal, lethargy, reduced appetite for 2 days.');
  const [duration, setDuration] = useState('48 hours');

  // Detailed History
  const [appetite, setAppetite] = useState<'Normal' | 'Reduced' | 'Anorexia' | 'Increased'>('Reduced');
  const [waterIntake, setWaterIntake] = useState<'Normal' | 'Polydipsia' | 'Reduced' | 'None'>('Normal');
  const [vomiting, setVomiting] = useState('2-3 times yesterday with yellow bile');
  const [stool, setStool] = useState('Soft, unformed, no gross melena');
  const [coughSneeze, setCoughSneeze] = useState('None');
  const [urination, setUrination] = useState('Normal volume and frequency');
  const [behavior, setBehavior] = useState('Dull, reluctant to play');
  const [toxinExposure, setToxinExposure] = useState('Possible garbage raiding 2 days ago');

  // Physical Examination & Vitals
  const [temp, setTemp] = useState(101.8);
  const [heartRate, setHeartRate] = useState(115);
  const [respiratoryRate, setRespiratoryRate] = useState(26);
  const [crt, setCrt] = useState('< 2 sec (Normal)');
  const [mucousMembrane, setMucousMembrane] = useState<'Pink' | 'Pale' | 'Cyanotic' | 'Icteric' | 'Congested'>('Pink');
  const [hydration, setHydration] = useState<'Normal' | 'Mild (5%)' | 'Moderate (7-8%)' | 'Severe (>10%)'>('Mild (5%)');
  const [bcs, setBcs] = useState('5/9 (Ideal)');
  const [painScore, setPainScore] = useState('1/4 (Mild cranial abdominal discomfort)');

  // System examination
  const [cardiovascular, setCardiovascular] = useState('No audible murmurs or arrhythmias. Strong synchronous femoral pulses.');
  const [respiratory, setRespiratory] = useState('Clear vesicular lung sounds bilaterally. No wheezes or crackles.');
  const [gastrointestinal, setGastrointestinal] = useState('Mild cranial abdominal tension on deep palpation. No palpable foreign body.');
  const [musculoskeletal, setMusculoskeletal] = useState('Ambulatory x 4, no obvious lameness or joint effusion.');
  const [integumentary, setIntegumentary] = useState('Clean coat, mild flea allergy dermatitis history, skin turgor slightly delayed.');
  const [ophthalmicOtic, setOphthalmicOtic] = useState('Eyes clear with brisk pupillary light reflexes. Bilateral ears clean.');
  const [lymphNodes, setLymphNodes] = useState('Prescapular and popliteal lymph nodes normal in size and symmetry.');
  const [dental, setDental] = useState('Mild grade 1 periodontal tartar; oral mucosa intact.');
  const [customFindings, setCustomFindings] = useState('');

  // Diagnoses
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('Acute Gastritis / Enteropathy secondary to dietary indiscretion');
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState('Gastric Foreign Body, Pancreatitis, Viral Enteritis');
  const [finalDiagnosis, setFinalDiagnosis] = useState('Acute Dietary Indiscretion Gastritis');

  // Plan
  const [treatmentPlan, setTreatmentPlan] = useState('1. Maropitant (Cerenia) 1mg/kg SQ once\n2. Famotidine 0.5mg/kg PO q12h x 5d\n3. Probiotic paste PO q12h\n4. Bland diet (boiled chicken + rice) for 48 hours');
  const [diagnosticRecommendations, setDiagnosticRecommendations] = useState('Abdominal radiograph if vomiting persists >24h; CBC/Biochem if fever develops.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-02');

  // AI Assistant State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const handleRunAiAssist = async () => {
    setIsAiLoading(true);
    try {
      const result = await getConsultationAIAssist({
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        weight: selectedPet.weight,
        symptoms: `${chiefComplaint}. Appetite: ${appetite}, Water: ${waterIntake}, Vomiting: ${vomiting}, Stool: ${stool}, Exposure: ${toxinExposure}`,
        vitals: {
          temperature: `${temp} °F`,
          heartRate: `${heartRate} bpm`,
          respiratoryRate: `${respiratoryRate} bpm`,
          mucousMembrane,
          hydration,
          painScore,
        },
        examFindings: `GI: ${gastrointestinal}, Card: ${cardiovascular}, Resp: ${respiratory}, Skin: ${integumentary}`,
      });
      setAiSuggestions(result);
      showNotification('Gemini AI Diagnostic Assessment generated!', 'success');
    } catch (err) {
      showNotification('AI diagnosis assist encountered an error', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = (diff: { condition: string; likelihood: string }) => {
    setDifferentialDiagnosis((prev) => (prev ? `${prev}, ${diff.condition}` : diff.condition));
    showNotification(`Added "${diff.condition}" to differentials`, 'info');
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    addConsultation({
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      date: new Date().toISOString().split('T')[0],
      veterinarianName: adminProfile.name,
      chiefComplaint,
      duration,
      history: {
        appetite,
        waterIntake,
        vomiting,
        stool,
        coughSneeze,
        urination,
        behavior,
        toxinExposure,
      },
      vitals: {
        temperature: temp,
        heartRate,
        respiratoryRate,
        crt,
        mucousMembrane,
        hydration,
        bcs,
        painScore,
      },
      systemExamination: {
        cardiovascular,
        respiratory,
        gastrointestinal,
        musculoskeletal,
        integumentary,
        ophthalmicOtic,
        lymphNodes,
        dental,
        customFindings,
      },
      provisionalDiagnosis,
      differentialDiagnosis: differentialDiagnosis.split(',').map((s) => s.trim()),
      finalDiagnosis,
      treatmentPlan,
      diagnosticRecommendations,
      followUpDate,
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Clinical Examination & Consultation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System-wise physical exam, vital assessment, AI diagnostics & treatment planning.
            </p>
          </div>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Patient:</span>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-slate-800 text-xs font-bold text-teal-900 dark:text-teal-200 focus:outline-none"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species} • {p.breed} • Owner: {p.ownerName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Consultation Form */}
      <form onSubmit={handleSaveConsultation} className="space-y-6">
        {/* Section 1: Chief Complaint & Detailed History */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>1. Chief Complaint & Clinical Anamnesis / History</span>
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Chief Presenting Complaint *
              </label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Vomiting, persistent itching, cough, refusal to bear weight"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Duration of Symptoms
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 48 hours, 3 days, 1 week"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Anamnesis Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Appetite</label>
              <select
                value={appetite}
                onChange={(e) => setAppetite(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Reduced">Reduced / Picky</option>
                <option value="Anorexia">Complete Anorexia</option>
                <option value="Increased">Polyphagia / Increased</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Water Intake</label>
              <select
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Polydipsia">Polydipsia (Increased)</option>
                <option value="Reduced">Reduced</option>
                <option value="None">Adipsia (Refusing water)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Vomiting / Regurgitation</label>
              <input
                type="text"
                value={vomiting}
                onChange={(e) => setVomiting(e.target.value)}
                placeholder="Frequency / contents"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Stool Consistency</label>
              <input
                type="text"
                value={stool}
                onChange={(e) => setStool(e.target.value)}
                placeholder="Normal / Diarrhea / Melena"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Cough / Sneezing</label>
              <input
                type="text"
                value={coughSneeze}
                onChange={(e) => setCoughSneeze(e.target.value)}
                placeholder="None / dry cough / sneezing"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Urination</label>
              <input
                type="text"
                value={urination}
                onChange={(e) => setUrination(e.target.value)}
                placeholder="Normal / Stranguria / Hematuria"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Behavior / Activity</label>
              <input
                type="text"
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                placeholder="Alert / Depressed / Restless"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Toxin / Foreign Exposure</label>
              <input
                type="text"
                value={toxinExposure}
                onChange={(e) => setToxinExposure(e.target.value)}
                placeholder="Trash / Human food / Chemicals"
                className="w-full px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Vitals & Triage Examination */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-teal-600" />
              <span>2. Vital Signs & Triage Physical Exam</span>
            </h3>
            <span className="text-xs text-slate-400">Step 2 of 4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/60">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                className="w-full font-bold text-sm text-teal-700 dark:text-teal-300 bg-transparent border-b border-teal-300 dark:border-teal-700 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 100.5 - 102.5 °F</span>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/60">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                className="w-full font-bold text-sm text-teal-700 dark:text-teal-300 bg-transparent border-b border-teal-300 dark:border-teal-700 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 70 - 140 bpm</span>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/60">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Respiratory Rate</label>
              <input
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(parseInt(e.target.value) || 0)}
                className="w-full font-bold text-sm text-teal-700 dark:text-teal-300 bg-transparent border-b border-teal-300 dark:border-teal-700 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 18 - 34 bpm</span>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/60">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mucous Membrane</label>
              <select
                value={mucousMembrane}
                onChange={(e) => setMucousMembrane(e.target.value as any)}
                className="w-full font-bold text-xs text-teal-700 dark:text-teal-300 bg-transparent border-b border-teal-300 dark:border-teal-700 focus:outline-none"
              >
                <option value="Pink">Pink (Healthy)</option>
                <option value="Pale">Pale (Anemic/Shock)</option>
                <option value="Cyanotic">Cyanotic (Hypoxic)</option>
                <option value="Icteric">Icteric (Jaundiced)</option>
                <option value="Congested">Congested / Injected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Capillary Refill (CRT)</label>
              <input
                type="text"
                value={crt}
                onChange={(e) => setCrt(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Hydration Status</label>
              <select
                value={hydration}
                onChange={(e) => setHydration(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Normal">Normal (&lt;5%)</option>
                <option value="Mild (5%)">Mild Dehydration (5%)</option>
                <option value="Moderate (7-8%)">Moderate (7-8%)</option>
                <option value="Severe (>10%)">Severe Dehydration (&gt;10%)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Body Condition (BCS)</label>
              <input
                type="text"
                value={bcs}
                onChange={(e) => setBcs(e.target.value)}
                placeholder="5/9 Ideal"
                className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Pain Score (0-4)</label>
              <input
                type="text"
                value={painScore}
                onChange={(e) => setPainScore(e.target.value)}
                placeholder="0 = No pain, 4 = Severe"
                className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: System-Wise Examination */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>3. System-Wise Organ Examination</span>
            </h3>
            <span className="text-xs text-slate-400">Step 3 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cardiovascular System</label>
              <textarea
                rows={2}
                value={cardiovascular}
                onChange={(e) => setCardiovascular(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Respiratory System</label>
              <textarea
                rows={2}
                value={respiratory}
                onChange={(e) => setRespiratory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gastrointestinal & Abdomen</label>
              <textarea
                rows={2}
                value={gastrointestinal}
                onChange={(e) => setGastrointestinal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Musculoskeletal & Locomotion</label>
              <textarea
                rows={2}
                value={musculoskeletal}
                onChange={(e) => setMusculoskeletal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Integumentary (Skin & Coat)</label>
              <textarea
                rows={2}
                value={integumentary}
                onChange={(e) => setIntegumentary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ophthalmic & Otic (Eyes & Ears)</label>
              <textarea
                rows={2}
                value={ophthalmicOtic}
                onChange={(e) => setOphthalmicOtic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Oral Cavity & Dental</label>
              <textarea
                rows={2}
                value={dental}
                onChange={(e) => setDental(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Custom / Other Clinical Notes</label>
              <textarea
                rows={2}
                value={customFindings}
                onChange={(e) => setCustomFindings(e.target.value)}
                placeholder="Additional notes, palpation, special reflexes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: AI Diagnostic Assistant & Final Diagnosis */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>4. AI Differential Diagnosis & Treatment Plan</span>
            </h3>
            <button
              type="button"
              onClick={handleRunAiAssist}
              disabled={isAiLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Differentials</span>
                </>
              )}
            </button>
          </div>

          {/* AI Suggestions Callout */}
          {aiSuggestions && (
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl space-y-3 animate-in fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Clinical Insights & Differentials (Gemini 2.5)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200 font-semibold">
                  Triage: {aiSuggestions.triageLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {aiSuggestions.differentialDiagnoses?.map((item: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-950 dark:text-purple-100">{item.condition}</span>
                      <p className="text-[10px] text-slate-500">{item.reasoning}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyAiSuggestion(item)}
                      className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-1 rounded hover:bg-purple-200"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>

              {aiSuggestions.diagnosticWorkupPlan && (
                <div className="text-[11px] text-purple-950 dark:text-purple-200 pt-1">
                  <strong>Recommended Diagnostics:</strong> {aiSuggestions.diagnosticWorkupPlan.join(' • ')}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Provisional Diagnosis *
              </label>
              <input
                type="text"
                required
                value={provisionalDiagnosis}
                onChange={(e) => setProvisionalDiagnosis(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Differential Diagnoses
              </label>
              <input
                type="text"
                value={differentialDiagnosis}
                onChange={(e) => setDifferentialDiagnosis(e.target.value)}
                placeholder="Comma separated"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Final Confirmed Diagnosis
              </label>
              <input
                type="text"
                value={finalDiagnosis}
                onChange={(e) => setFinalDiagnosis(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Treatment & Therapeutics Plan
              </label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Recommended Diagnostics & Follow-up Date
              </label>
              <textarea
                rows={2}
                value={diagnosticRecommendations}
                onChange={(e) => setDiagnosticRecommendations(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mb-2"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Review Date:</span>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sign Consultation Record</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
