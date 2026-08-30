import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeConsultationWithAI } from '../../services/geminiService';
import {
  Sparkles,
  Heart,
  Send,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  PhoneCall,
  Calendar,
  Loader2,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { AnimalAvatar, SpeciesBadge } from '../common/AnimalIllustration';

interface AiSymptomCheckerProps {
  onNavigateTab: (tab: any) => void;
}

export const AiSymptomChecker: React.FC<AiSymptomCheckerProps> = ({ onNavigateTab }) => {
  const { pets, selectedPetId, setSelectedPetId, adminProfile, showNotification } = useApp();
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [symptomsInput, setSymptomsInput] = useState('Lethargic since yesterday, refusing food, and vomited yellowish bile twice this morning.');
  const [duration, setDuration] = useState('24 - 48 Hours');
  const [appetite, setAppetite] = useState('Complete Anorexia (No eating)');
  const [waterIntake, setWaterIntake] = useState('Normal drinking');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [triageReport, setTriageReport] = useState<any>(null);

  const quickSymptoms = [
    'Vomiting bile/food',
    'Diarrhea / Loose stool',
    'Lethargy & Weakness',
    'Limping on paw',
    'Excessive scratching / Ear itching',
    'Coughing / Wheezing',
    'Frequent urination / Straining',
    'Red, weeping eyes',
  ];

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsAiLoading(true);
    try {
      const fullClinicalStory = `Pet Parent Observation:\nSymptoms: ${symptomsInput}\nDuration: ${duration}\nAppetite: ${appetite}\nWater Intake: ${waterIntake}`;
      const result = await analyzeConsultationWithAI({
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        weight: selectedPet.weight,
        symptoms: fullClinicalStory,
      });

      setTriageReport(result);
      showNotification('Gemini AI Pet Symptom Triage assessment generated!', 'success');
    } catch (err) {
      showNotification('AI analysis failed. Please consult your vet.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleToggleQuickSymptom = (sym: string) => {
    if (symptomsInput.includes(sym)) {
      setSymptomsInput((prev) => prev.replace(sym, '').trim());
    } else {
      setSymptomsInput((prev) => (prev ? `${prev}, ${sym}` : sym));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini AI Veterinary Clinical Triage Assistant</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          AI Pet Health Symptom Checker
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-2xl">
          Enter observations about {selectedPet ? selectedPet.name : 'your pet'}'s behavior, diet, or symptoms. Our intelligent veterinary model provides immediate triage guidance, red flags, and next steps.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <form onSubmit={handleRunTriage} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Select Pet
              </label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} • {p.breed})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                How long have symptoms lasted?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Just started today (< 12 hours)">Just started today (&lt; 12 hours)</option>
                <option value="24 - 48 Hours">24 - 48 Hours</option>
                <option value="Several days (3-7 days)">Several days (3-7 days)</option>
                <option value="Chronic / Ongoing (> 1-2 weeks)">Chronic / Ongoing (&gt; 1-2 weeks)</option>
              </select>
            </div>
          </div>

          {/* Quick Select Symptom Tags */}
          <div>
            <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
              Common Observable Signs (Click to add)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickSymptoms.map((sym) => {
                const isSelected = symptomsInput.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleToggleQuickSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description of Symptoms & Behavior
            </label>
            <textarea
              rows={4}
              required
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="Describe what you see: posture, stool consistency, coughing sound, energy level..."
              className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Appetite / Food Intake</label>
              <select
                value={appetite}
                onChange={(e) => setAppetite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Normal appetite">Normal appetite</option>
                <option value="Reduced appetite (eating half)">Reduced appetite (eating half)</option>
                <option value="Complete Anorexia (No eating)">Complete Anorexia (Refusing all food)</option>
                <option value="Excessive hunger (Polyphagia)">Excessive hunger (Polyphagia)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Drinking / Water Intake</label>
              <select
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Normal drinking">Normal drinking</option>
                <option value="Excessive thirst (Polydipsia)">Excessive thirst (Polydipsia)</option>
                <option value="Refusing water (Dehydration risk)">Refusing water (Dehydration risk)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isAiLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md flex items-center gap-2"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Veterinary AI Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Symptoms & Get Triage Advice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Triage Results Card */}
      {triageReport && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-500 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  AI Triage Assessment for {selectedPet.name} ({selectedPet.species})
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Clinical Recommendations & Severity Evaluation
                </h3>
              </div>
            </div>

            {/* Severity Pill */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide self-start sm:self-auto ${
                triageReport.urgencyLevel === 'Immediate Emergency'
                  ? 'bg-red-600 text-white animate-pulse'
                  : triageReport.urgencyLevel === 'Urgent (Within 24h)'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              Triage: {triageReport.urgencyLevel || 'Urgent (Within 24h)'}
            </span>
          </div>

          {/* Differential Diagnosis Possibilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Potential Underlying Clinical Conditions (Differentials)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {triageReport.differentialDiagnoses?.map((diag: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white font-bold">{diag.condition}</strong>
                    <span className="text-[10px] font-mono text-teal-600 font-bold">{diag.likelihood} Likelihood</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{diag.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Home Care & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Immediate Comfort & Monitoring Measures</span>
              </span>
              <ul className="space-y-1 text-emerald-950 dark:text-emerald-100 text-[11px]">
                {triageReport.immediateActions?.map((act: string, i: number) => (
                  <li key={i}>• {act}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-2">
              <span className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>Critical Red Flags (Rush to Vet Immediately If Observed)</span>
              </span>
              <ul className="space-y-1 text-red-950 dark:text-red-100 text-[11px]">
                {triageReport.redFlags?.map((flag: string, i: number) => (
                  <li key={i}>• {flag}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              Disclaimer: AI triage is for guidance and does not replace in-person physical veterinary exam.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigateTab('book-appointment')}
                className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Vet Appointment</span>
              </button>
              <a
                href={`tel:${adminProfile.contactNumber}`}
                className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Emergency Call</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
