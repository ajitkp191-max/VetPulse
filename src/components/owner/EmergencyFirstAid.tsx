import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Heart,
  PhoneCall,
  Flame,
  Search,
  AlertTriangle,
  CheckCircle2,
  Skull,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ToxicItem {
  name: string;
  category: 'Food' | 'Plant' | 'Household';
  toxicTo: 'Dogs & Cats' | 'Dogs only' | 'Cats only (Severe)' | 'All Pets';
  severity: 'Fatal / Severe' | 'Moderate to Severe' | 'Mild to Moderate';
  symptoms: string;
  action: string;
}

const TOXIC_DATABASE: ToxicItem[] = [
  {
    name: 'Chocolate & Cocoa (Theobromine)',
    category: 'Food',
    toxicTo: 'Dogs & Cats',
    severity: 'Fatal / Severe',
    symptoms: 'Vomiting, diarrhea, tachycardia, arrhythmias, seizures, hyperthermia, cardiac arrest.',
    action: 'Seek emergency vet immediately. Calculate ingested amount (Dark chocolate & cocoa powder are most dangerous).',
  },
  {
    name: 'Grapes, Raisins & Sultanas',
    category: 'Food',
    toxicTo: 'Dogs only',
    severity: 'Fatal / Severe',
    symptoms: 'Vomiting, lethargy, anorexia, acute kidney failure (anuria/oliguria) within 24-48 hours.',
    action: 'Even 1-2 grapes can trigger fatal renal shutdown. Induce emesis within 2 hours under vet guidance.',
  },
  {
    name: 'Xylitol / Birch Sugar (Artificial Sweetener)',
    category: 'Food',
    toxicTo: 'Dogs only',
    severity: 'Fatal / Severe',
    symptoms: 'Rapid insulin release causing severe hypoglycemia within 30 mins (seizures, collapse) & acute liver necrosis.',
    action: 'Immediate IV dextrose administration required. Keep patient warm and rush to veterinary hospital.',
  },
  {
    name: 'Onions, Garlic, Leeks & Chives (Allium)',
    category: 'Food',
    toxicTo: 'Dogs & Cats',
    severity: 'Moderate to Severe',
    symptoms: 'Oxidative damage to red blood cells, hemolytic anemia (Heinz body anemia), pale gums, red/brown urine.',
    action: 'Contact veterinarian. Avoid onion powder in table scraps.',
  },
  {
    name: 'Lilies (True Lilies & Daylilies)',
    category: 'Plant',
    toxicTo: 'Cats only (Severe)',
    severity: 'Fatal / Severe',
    symptoms: 'Licking pollen or drinking vase water causes acute irreversible renal failure within 36 hours in felines.',
    action: 'Critical feline emergency. Immediate hospitalization with aggressive IV fluid diuresis within 18 hours.',
  },
  {
    name: 'Human Painkillers (Ibuprofen, Acetaminophen/Paracetamol)',
    category: 'Household',
    toxicTo: 'Dogs & Cats',
    severity: 'Fatal / Severe',
    symptoms: 'Gastric ulceration, methemoglobinemia (chocolate brown blood, cyanosis), liver and kidney destruction.',
    action: 'Never give human medications to pets. Requires N-acetylcysteine or gastric decontamination.',
  },
  {
    name: 'Macadamia Nuts',
    category: 'Food',
    toxicTo: 'Dogs only',
    severity: 'Moderate to Severe',
    symptoms: 'Weakness in hind limbs, ataxia, hyperthermia, vomiting, tremors.',
    action: 'Supportive care, monitoring, fluid therapy.',
  },
  {
    name: 'Avocado (Persin)',
    category: 'Food',
    toxicTo: 'All Pets',
    severity: 'Mild to Moderate',
    symptoms: 'Fluid accumulation around heart and lungs in birds/horses; GI upset in dogs and cats.',
    action: 'Prevent ingestion of pit (choking hazard) and skin.',
  },
];

export const EmergencyFirstAid: React.FC = () => {
  const { adminProfile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAid, setExpandedAid] = useState<string | null>('cpr');

  const filteredToxins = TOXIC_DATABASE.filter((t) => {
    const term = (searchTerm || '').toLowerCase();
    return (
      (t.name || '').toLowerCase().includes(term) ||
      (t.symptoms || '').toLowerCase().includes(term) ||
      (t.category || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Emergency First Aid Guidance Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase">
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>Emergency First Aid & Life-Saving Protocols</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Emergency Triage & Toxic Substance Guide
          </h2>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            Follow standard life-support maneuvers, CPR compressions, and toxic ingestion countermeasures. Always stabilize the animal's airway immediately.
          </p>
        </div>
      </div>

      {/* SECTION 1: FIRST AID PROTOCOLS ACCORDION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Essential Pet First Aid Protocols & Life-Saving Maneuvers
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* Card 1: CPR */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedAid(expandedAid === 'cpr' ? null : 'cpr')}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600">
                  <Heart className="w-4 h-4" />
                </span>
                <span>Cardiopulmonary Resuscitation (CPR) & Artificial Respiration</span>
              </div>
              {expandedAid === 'cpr' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedAid === 'cpr' && (
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p><strong>1. Verify Unresponsiveness:</strong> Check for breathing by placing hand near nose; check femoral pulse inside inner thigh.</p>
                <p><strong>2. Position:</strong> Lay animal on right side on a firm flat surface.</p>
                <p><strong>3. Chest Compressions:</strong> Place hands over widest part of chest (behind elbow). Compress 1/3 to 1/2 chest width at rate of <strong>100–120 compressions per minute</strong> (match beat of "Stayin' Alive").</p>
                <p><strong>4. Rescue Breaths:</strong> Close pet's mouth tightly, cover nose with your mouth, blow 2 breaths after every 30 compressions until chest rises.</p>
              </div>
            )}
          </div>

          {/* Card 2: Choking & Heimlich */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedAid(expandedAid === 'choking' ? null : 'choking')}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span>Choking & Airway Obstruction (Heimlich Maneuver)</span>
              </div>
              {expandedAid === 'choking' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedAid === 'choking' && (
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p><strong>1. Inspect Mouth:</strong> Gently open jaws and look inside. Sweep finger only if you clearly see foreign object (caution: panicking pets may bite).</p>
                <p><strong>2. Small Dogs & Cats:</strong> Hold pet upside down with spine against your chest. Press fist gently upward into abdomen behind ribs 4-5 times.</p>
                <p><strong>3. Medium/Large Dogs:</strong> Stand behind standing dog. Clasp hands around abdomen directly below ribcage. Deliver 4-5 sharp thrusts upward toward spine.</p>
              </div>
            )}
          </div>

          {/* Card 3: Heatstroke */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedAid(expandedAid === 'heat' ? null : 'heat')}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600">
                  <Flame className="w-4 h-4" />
                </span>
                <span>Heatstroke & Hyperthermia Emergency</span>
              </div>
              {expandedAid === 'heat' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedAid === 'heat' && (
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p><strong>Symptoms:</strong> Heavy panting, brick-red gums, thick sticky saliva, dizziness, collapse (Rectal temp &gt; 104°F / 40°C).</p>
                <p><strong>1. Immediate Cooling:</strong> Move to shade or AC room. Apply <strong>tepid/cool tap water</strong> to paw pads, groin, armpits, and ears. Turn on fan.</p>
                <p><strong>2. DO NOT use ice or ice-water baths:</strong> Ice water causes peripheral vasoconstriction, trapping core heat inside organs and causing hypothermic shock.</p>
                <p><strong>3. Stop cooling:</strong> Once body temperature reaches 103°F (39.4°C) to prevent overshoot hypothermia. Transport to clinic immediately.</p>
              </div>
            )}
          </div>

          {/* Card 4: Bleeding */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedAid(expandedAid === 'bleeding' ? null : 'bleeding')}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600">
                  <AlertOctagon className="w-4 h-4" />
                </span>
                <span>Severe Bleeding & Wound Pressure</span>
              </div>
              {expandedAid === 'bleeding' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedAid === 'bleeding' && (
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p><strong>1. Direct Pressure:</strong> Place sterile gauze or clean cloth directly over bleeding wound and press firmly for at least 5 unbroken minutes.</p>
                <p><strong>2. Do Not Remove Blood-Soaked Gauze:</strong> If blood soaks through, add another layer on top to preserve forming clotting factors.</p>
                <p><strong>3. Elevate:</strong> If injury is on limb, gently elevate above heart level while applying pressure bandage.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TOXIC FOODS & PLANTS SEARCHABLE DATABASE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Skull className="w-5 h-5 text-rose-600" />
              <span>Toxic Foods, Plants & Chemical Substances Index</span>
            </h3>
            <p className="text-xs text-slate-500">
              Instant checker for household hazards, poisonous garden plants, and dangerous foods for dogs & cats.
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type food or plant name (e.g. Chocolate, Lily, Grapes, Xylitol, Onions)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Toxic Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredToxins.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 dark:text-white text-sm font-bold">{t.name}</strong>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    t.severity.includes('Fatal')
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {t.severity}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  {t.toxicTo}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{t.category}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                <strong>Symptoms:</strong> {t.symptoms}
              </p>

              <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-[11px] text-rose-900 dark:text-rose-200 font-medium">
                <strong>Emergency Action:</strong> {t.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
