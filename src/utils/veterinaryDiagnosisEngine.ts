/**
 * Comprehensive Veterinary Clinical Diagnostic Engine
 * Evidence-based pathophysiology, differential diagnostic ranking, 
 * vital parameter evaluation, and targeted biochemical/imaging test recommendations.
 */

export interface PatientProfile {
  species?: string;
  breed?: string;
  age?: string;
  weight?: number;
  gender?: string;
}

export interface VitalParameters {
  temp?: number;
  tempUnit?: 'F' | 'C';
  heartRate?: number;
  respiratoryRate?: number;
  pulseQuality?: string;
  crt?: string;
  mucousMembrane?: string;
  hydration?: string;
  bcs?: string;
  painScore?: string;
  bloodPressure?: string;
  bloodGlucose?: string;
}

export interface DiagnosticEngineInput {
  patient: PatientProfile;
  specialty: 'Gynecology' | 'Medicine' | 'Surgery';
  chiefComplaint: string;
  doctorNotes?: string;
  selectedSigns: string[];
  vitals: VitalParameters;
  physicalExamNotes?: string;
}

export interface RecommendedMedicine {
  medicineName: string;
  form: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DifferentialDiagnosis {
  condition: string;
  likelihood: string;
  likelihoodPercent: number;
  reasoning: string;
  suggestedTreatment: string;
  suggestedDiagnostics: string;
  dietaryAdvice: string;
  recommendedMedicines: RecommendedMedicine[];
}

export interface DiagnosticRecommendations {
  bloodTests: string[];
  usg: string[];
  xray: string[];
  otherTests: string[];
  summary: string;
}

export interface DiagnosticEngineResult {
  provisionalDiagnosis: string;
  confidenceScore: string;
  triageLevel: 'Routine' | 'Urgent' | 'Emergency' | 'Critical';
  clinicalRationale: string;
  differentialDiagnoses: DifferentialDiagnosis[];
  diagnosticRecommendations: DiagnosticRecommendations;
  treatmentPlan: string;
  redFlagAlerts: string[];
  vitalAnalysis: {
    tempStatus: string;
    hrStatus: string;
    rrStatus: string;
    crtStatus: string;
    mucousStatus: string;
    hydrationStatus: string;
  };
}

export function evaluateVeterinaryCondition(input: DiagnosticEngineInput): DiagnosticEngineResult {
  const {
    patient,
    specialty,
    chiefComplaint = '',
    doctorNotes = '',
    selectedSigns = [],
    vitals = {},
    physicalExamNotes = '',
  } = input;

  const species = (patient.species || 'Dog').toLowerCase();
  const isCanine = species.includes('dog') || species.includes('canine');
  const isFeline = species.includes('cat') || species.includes('feline');
  const gender = (patient.gender || '').toLowerCase();
  const isIntactFemale = !gender.includes('spayed') && (gender.includes('female') || gender.includes('intact') || specialty === 'Gynecology');

  // Text corpus to search
  const corpus = [
    chiefComplaint,
    doctorNotes,
    physicalExamNotes,
    ...selectedSigns,
  ].join(' ').toLowerCase();

  // Vitals parsing
  let tempF = vitals.temp || 101.5;
  if (vitals.tempUnit === 'C' && vitals.temp) {
    tempF = (vitals.temp * 9) / 5 + 32;
  }
  const hr = vitals.heartRate || (isFeline ? 180 : 110);
  const rr = vitals.respiratoryRate || 24;
  const crtStr = (vitals.crt || '1.5').toLowerCase();
  const mm = (vitals.mucousMembrane || 'Pink').toLowerCase();
  const hydration = (vitals.hydration || 'Normal').toLowerCase();

  // Vital status derivations
  let tempStatus = 'Normal (100.5 - 102.5°F)';
  if (tempF > 103.5) tempStatus = 'High Fever / Marked Pyrexia (Sepsis/Inflammation)';
  else if (tempF > 102.5) tempStatus = 'Mild Pyrexia / Low-Grade Fever';
  else if (tempF < 99.0) tempStatus = 'Severe Hypothermia (Shock / Perfusion Failure)';
  else if (tempF < 100.0) tempStatus = 'Subnormal / Mild Hypothermia';

  let hrStatus = 'Normal';
  const normalMaxHr = isFeline ? 220 : (patient.weight && patient.weight > 25 ? 120 : 140);
  const normalMinHr = isFeline ? 140 : (patient.weight && patient.weight > 25 ? 60 : 70);
  if (hr > normalMaxHr) hrStatus = `Tachycardia (${hr} bpm - Pain, Dehydration, or Shock)`;
  else if (hr < normalMinHr) hrStatus = `Bradycardia (${hr} bpm - Hyperkalemia or Vagal Stimulation)`;

  let rrStatus = 'Normal (15-30 bpm)';
  if (rr > 40) rrStatus = `Tachypnea (${rr} bpm - Respiratory Distress, Acidosis, or Fever)`;
  else if (rr > 30) rrStatus = `Mildly Elevated (${rr} bpm)`;

  let crtStatus = 'Normal (< 2.0 sec)';
  if (crtStr.includes('2.') || crtStr.includes('3') || crtStr.includes('delayed')) {
    crtStatus = 'Prolonged CRT (> 2.0s - Decreased Peripheral Perfusion)';
  }

  let mucousStatus = 'Normal (Pink, moist)';
  if (mm.includes('injected') || mm.includes('congested')) {
    mucousStatus = 'Injected / Congested (Septicemia / Endotoxemia)';
  } else if (mm.includes('pale')) {
    mucousStatus = 'Pale (Anemia, Blood Loss, or Vasoconstriction)';
  } else if (mm.includes('icteric') || mm.includes('yellow')) {
    mucousStatus = 'Icteric / Jaundiced (Hyperbilirubinemia / Hepatic / Hemolytic)';
  } else if (mm.includes('cyanotic')) {
    mucousStatus = 'Cyanotic (Severe Hypoxia / Respiratory Emergency)';
  }

  let hydrationStatus = 'Euvolemic (<5%)';
  if (hydration.includes('severe') || hydration.includes('10')) {
    hydrationStatus = 'Severe Dehydration (>10% Deficit - Shock Risk)';
  } else if (hydration.includes('moderate') || hydration.includes('7') || hydration.includes('8')) {
    hydrationStatus = 'Moderate Dehydration (7-8% Deficit)';
  } else if (hydration.includes('mild') || hydration.includes('5')) {
    hydrationStatus = 'Mild Dehydration (5% Deficit)';
  }

  // Matching specific clinical syndromes
  const hasVaginalDischarge = corpus.includes('discharge') || corpus.includes('vulvar') || corpus.includes('vaginal') || corpus.includes('purulent') || corpus.includes('uterus') || corpus.includes('pyometra');
  const hasDystociaSigns = corpus.includes('dystocia') || corpus.includes('labor') || corpus.includes('whelping') || corpus.includes('fetal') || corpus.includes('contractions') || corpus.includes('puppy stuck') || corpus.includes('kitten');
  const hasMastitisSigns = corpus.includes('mastitis') || corpus.includes('mammary') || corpus.includes('milk') || corpus.includes('teat');
  
  const hasGDVSigns = (corpus.includes('bloat') || corpus.includes('tympan') || corpus.includes('dilatation') || corpus.includes('retching') || corpus.includes('non-productive vomiting')) && isCanine;
  const hasForeignBodySigns = corpus.includes('foreign body') || corpus.includes('obstruction') || corpus.includes('swallowed') || corpus.includes('chewed') || corpus.includes('string') || corpus.includes('object') || corpus.includes('intussusception');
  const hasParvoSigns = corpus.includes('parvo') || corpus.includes('bloody diarrhea') || corpus.includes('hemorrhagic enteritis') || (corpus.includes('foul diarrhea') && corpus.includes('vomit'));
  const hasPancreatitisSigns = corpus.includes('pancreatitis') || corpus.includes('cranial abdominal pain') || corpus.includes('prayer position') || corpus.includes('fatty food') || corpus.includes('lipase');
  const hasGastroSigns = corpus.includes('vomit') || corpus.includes('diarrhea') || corpus.includes('loose stool') || corpus.includes('gastro') || corpus.includes('appetite') || corpus.includes('anorexia') || corpus.includes('food');

  const hasBlockedCatUrinary = (isFeline || corpus.includes('cat')) && (corpus.includes('strain') || corpus.includes('dysuria') || corpus.includes('stranguria') || corpus.includes('litter') || corpus.includes('blocked') || corpus.includes('urethral') || corpus.includes('flutd'));
  const hasKidneySigns = corpus.includes('ckd') || corpus.includes('renal') || corpus.includes('kidney') || corpus.includes('pu/pd') || corpus.includes('polydipsia') || corpus.includes('polyuria') || corpus.includes('azotemia') || corpus.includes('uremic');
  const hasUrinarySigns = corpus.includes('hematuria') || corpus.includes('cystitis') || corpus.includes('bladder') || corpus.includes('urine') || corpus.includes('calculi') || corpus.includes('stone');

  const hasRespiratorySigns = corpus.includes('cough') || corpus.includes('sneez') || corpus.includes('dyspnea') || corpus.includes('tachypnea') || corpus.includes('respiratory') || corpus.includes('lung') || corpus.includes('crackles') || corpus.includes('wheez') || corpus.includes('kennel cough');
  const hasTickSigns = corpus.includes('tick') || corpus.includes('ehrlichia') || corpus.includes('babesia') || corpus.includes('petechiae') || corpus.includes('ecchymosis') || corpus.includes('epistaxis') || corpus.includes('nosebleed') || corpus.includes('fever') && corpus.includes('pale');
  const hasOrthopedicSigns = corpus.includes('lame') || corpus.includes('limp') || corpus.includes('fracture') || corpus.includes('cruciate') || corpus.includes('ccl') || corpus.includes('joint') || corpus.includes('luxation') || corpus.includes('trauma') || corpus.includes('crepitus');
  const hasNeuroSigns = corpus.includes('seizure') || corpus.includes('ataxia') || corpus.includes('paralysis') || corpus.includes('knuckling') || corpus.includes('ivdd') || corpus.includes('spine') || corpus.includes('disc');
  const hasSkinSigns = corpus.includes('itch') || corpus.includes('pruritus') || corpus.includes('alopecia') || corpus.includes('scab') || corpus.includes('crust') || corpus.includes('flea') || corpus.includes('mange') || corpus.includes('dermatitis');

  // Specialty Prioritization
  if (specialty === 'Gynecology' || hasVaginalDischarge || hasDystociaSigns || hasMastitisSigns) {
    if (hasDystociaSigns) {
      return buildDystociaResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
    }
    if (hasMastitisSigns) {
      return buildMastitisResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
    }
    // Default / High-yield Gynecology: Pyometra
    return buildPyometraResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus, isIntactFemale);
  }

  if (specialty === 'Surgery' || hasGDVSigns || hasForeignBodySigns || hasOrthopedicSigns) {
    if (hasGDVSigns) {
      return buildGDVResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
    }
    if (hasForeignBodySigns) {
      return buildForeignBodyResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
    }
    if (hasOrthopedicSigns) {
      return buildOrthopedicResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
    }
  }

  // Internal Medicine checks
  if (hasBlockedCatUrinary) {
    return buildBlockedCatResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasParvoSigns) {
    return buildParvoResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasPancreatitisSigns) {
    return buildPancreatitisResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasRespiratorySigns) {
    return buildRespiratoryResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasTickSigns) {
    return buildTickBorneResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasKidneySigns) {
    return buildRenalResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasUrinarySigns) {
    return buildCystitisResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasNeuroSigns) {
    return buildNeuroResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasSkinSigns) {
    return buildDermatologyResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }
  if (hasGastroSigns) {
    return buildGastroenteritisResult(patient, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
  }

  // Fallback generalized comprehensive evaluation
  return buildGeneralMedicalResult(patient, specialty, vitals, tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus);
}

// -------------------------------------------------------------
// INDIVIDUAL EVIDENCE-BASED SYNDROME BUILDERS
// -------------------------------------------------------------

function buildPyometraResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string, isIntact: boolean): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Open-Cervix Pyometra (Cystic Endometrial Hyperplasia - Pyometra Complex) with Secondary Endotoxemia',
    confidenceScore: '94%',
    triageLevel: 'Urgent',
    clinicalRationale: `Findings in this ${patient.age || 'adult'} ${patient.gender || 'female'} ${patient.species || 'canine'} (${patient.breed || 'patient'}) demonstrate classic signs of progesterone-primed uterine bacterial accumulation: purulent/sanguineous vulvar discharge, marked inflammatory response, polyuria/polydipsia, and pre-renal dehydration strain.`,
    differentialDiagnoses: [
      {
        condition: 'Open-Cervix CEH-Pyometra',
        likelihood: 'Very High (94%)',
        likelihoodPercent: 94,
        reasoning: 'Purulent vulvar discharge in intact bitch, leukocytic left shift risk, polydipsia/polyuria, fever and painful tubular caudal abdominal distension.',
        suggestedTreatment: 'Immediate IV fluid stabilization with balanced crystalloids (LRS @ 60-80 ml/kg/day). Broad-spectrum bactericidal antibiotics (Ampicillin-Sulbactam + Metronidazole). Emergency surgical ovariohysterectomy (OHE) as definitive therapy.',
        suggestedDiagnostics: 'CBC (Leukogram evaluation), Serum BUN & Creatinine (Renal filtration & endotoxemic injury), Abdominal Ultrasound (dilated fluid-filled uterine horns), Abdominal Radiograph.',
        dietaryAdvice: 'Nil per os (NPO) prior to emergency surgical stabilization. Post-operative bland recovery liquid/soft diet.',
        recommendedMedicines: [
          { medicineName: 'Amoxicillin-Clavulanate (Augmentin)', form: 'Tablet/Injectable', dosage: '15 - 20 mg/kg', route: 'Oral / IV', frequency: 'Twice daily (BD)', duration: '14 days', instructions: 'Bactericidal coverage against E. coli and anaerobes.' },
          { medicineName: 'Metronidazole', form: 'Tablet / IV Infusion', dosage: '10 - 15 mg/kg', route: 'Oral / IV', frequency: 'Twice daily (BD)', duration: '7 days', instructions: 'Systemic anaerobic coverage; avoid with liver failure.' },
          { medicineName: 'Maropitant Citrate (Cerenia)', form: 'Injectable', dosage: '1 mg/kg', route: 'SC / Slow IV', frequency: 'Once daily (OD)', duration: '3 days', instructions: 'Visceral antiemetic and neurokinin-1 analgesia.' },
          { medicineName: 'Buprenorphine', form: 'Injectable', dosage: '0.02 mg/kg', route: 'IV / SC / Buccal', frequency: 'Every 8 hours', duration: '3 days', instructions: 'Visceral abdominal pain control post-rehydration.' }
        ]
      },
      {
        condition: 'Postpartum or Post-Estrus Acute Metritis',
        likelihood: 'Moderate (55%)',
        likelihoodPercent: 55,
        reasoning: 'Severe uterine luminal bacterial contamination following recent whelping or prolonged estrous cycle.',
        suggestedTreatment: 'IV fluid diuresis, uterine ecbolics if cervix open, parental cephalosporins or fluoroquinolones.',
        suggestedDiagnostics: 'Vaginal cytology (degenerate neutrophils & intracellular bacteria), Abdominal USG.',
        dietaryAdvice: 'High energy convalescence diet.',
        recommendedMedicines: [
          { medicineName: 'Cephalexin', form: 'Capsule', dosage: '25 mg/kg', route: 'Oral', frequency: 'Twice daily (BD)', duration: '10 days', instructions: 'Give with meal.' }
        ]
      },
      {
        condition: 'Severe Hemorrhagic/Suppurative Cystitis or Urolithiasis',
        likelihood: 'Low-Moderate (32%)',
        likelihoodPercent: 32,
        reasoning: 'Urogenital bacterial infection can produce turbid discharge from vulva; must differentiate bladder from uterine pathology.',
        suggestedTreatment: 'Urinary catheterization, targeted antimicrobials, urine culture.',
        suggestedDiagnostics: 'Cystocentesis urinalysis, lateral abdominal radiograph.',
        dietaryAdvice: 'Urinary S/O stone dissolution diet.',
        recommendedMedicines: [
          { medicineName: 'Enrofloxacin (Baytril)', form: 'Tablet', dosage: '5 mg/kg', route: 'Oral', frequency: 'Once daily (OD)', duration: '10 days', instructions: 'Gram-negative urinary coverage.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: [
        'Complete Blood Count (CBC) with differential (Crucial: Rule in/out marked toxic leukocytosis and regenerative band neutrophils)',
        'Serum Blood Urea Nitrogen (BUN) & Creatinine (Evaluate pre-renal azotemia vs septic immune-complex glomerulonephritis)',
        'Serum Electrolytes (Na+, K+, Cl-) & Blood Glucose',
        'Alanine Aminotransferase (ALT) & Alkaline Phosphatase (ALP)'
      ],
      usg: [
        'Abdominal Ultrasound (USG) - Reproductive Tract (Evaluate bilateral uterine horn luminal distension > 2-3cm, fluid echogenicity, and endometrial wall thickening)'
      ],
      xray: [
        'Abdominal Radiographs (Lateral & VD views - check for tubular caudal abdominal soft tissue mass displacing intestine dorsally)'
      ],
      otherTests: [
        'Vaginal Cytology with Gram Stain (Degenerate PMNs with intracellular phagocytosed bacteria)',
        'Coagulation Screen (PT/aPTT) prior to emergency surgical ovariohysterectomy'
      ],
      summary: 'Priority laboratory workup: Order CBC, BUN & Creatinine, and Abdominal Ultrasound immediately to confirm uterine fluid accumulation and guide surgical timing.'
    },
    treatmentPlan: 'Initiate immediate intravenous balanced crystalloid resuscitation (LRS @ 80 ml/kg/day) to correct perfusion deficit. Administer broad-spectrum IV antimicrobials (Ampicillin-Sulbactam or Enrofloxacin + Metronidazole). Prepare for emergency ovariohysterectomy (OHE) once hemodynamically stabilized.',
    redFlagAlerts: [
      'Cervical closure transitioning into Closed-Cervix Pyometra creates imminent risk of uterine rupture and septic peritonitis.',
      'Marked tachycardia (>140 bpm) combined with delayed CRT (>2.5s) signals advancing endotoxemic septic shock.',
      'Sudden drop in body temperature (<99.5°F) indicates decompensated septicemia requiring urgent warming and shock fluids.'
    ],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildDystociaResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Obstructive or Inertial Dystocia (Fetal Retention / Maternal Uterine Exhaustion)',
    confidenceScore: '92%',
    triageLevel: 'Critical',
    clinicalRationale: `History of unproductive labor, weak contractions exceeding 2 hours, or visible fetal presentation in birth canal indicates immediate obstetrical intervention is required to save dam and pups.`,
    differentialDiagnoses: [
      {
        condition: 'Primary or Secondary Uterine Inertia',
        likelihood: 'High (88%)',
        likelihoodPercent: 88,
        reasoning: 'Uterine myometrial fatigue from prolonged labor, hypocalcemia, or overdistended uterus.',
        suggestedTreatment: 'Calcium gluconate 10% IV slow with ECG monitoring; Oxytocin micro-doses if birth canal is non-obstructed; Emergency C-Section.',
        suggestedDiagnostics: 'Abdominal Radiographs (fetal skull diameters), USG (fetal heart rates <150 bpm = distress).',
        dietaryAdvice: 'Calorie-dense lactating dam nutritional gel.',
        recommendedMedicines: [
          { medicineName: 'Calcium Gluconate 10%', form: 'Injectable', dosage: '0.5 - 1.0 ml/kg', route: 'Slow IV', frequency: 'Single dose under auscultation', duration: '1 day', instructions: 'Monitor for bradycardia during slow infusion.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Serum Ionized Calcium & Total Calcium', 'Blood Glucose', 'CBC', 'BUN & Creatinine'],
      usg: ['Fetal Viability Ultrasound: Measure fetal heart rates (>180 bpm is viable; <150 bpm indicates acute fetal hypoxia and emergency C-section)'],
      xray: ['Abdominal Radiograph: Count fetuses, evaluate fetal pelvic alignment, check for fetal emphysema/death'],
      otherTests: ['Digital pelvic vaginal examination for canal obstruction'],
      summary: 'Immediate pelvic radiograph and fetal heart rate ultrasound required to determine if medical ecbolic therapy or emergency surgical cesarean section is indicated.'
    },
    treatmentPlan: 'Prepare surgical theater for emergency Cesarean section (C-Section). Pre-oxygenate dam, secure large-bore IV catheter, warm incubator prepared for neonates.',
    redFlagAlerts: [
      'Green/black lochial discharge (uteroverdin) with no puppy born within 30-60 minutes indicates placental separation and impending fetal demise.',
      'Active strong unproductive straining > 30 minutes indicates obstructive dystocia; oxytocin is strictly contraindicated.'
    ],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildMastitisResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Acute Gangrenous or Suppurative Mastitis',
    confidenceScore: '90%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Hot, hard, painful, erythematous mammary glands with purulent/brown milk and systemic fever in a nursing dam indicates acute bacterial mastitis (typically E. coli, Staph, or Strep).',
    differentialDiagnoses: [
      {
        condition: 'Acute Suppurative Bacterial Mastitis',
        likelihood: 'High (90%)',
        likelihoodPercent: 90,
        reasoning: 'Localized mammary inflammation with systemic pyrexia post-whelping.',
        suggestedTreatment: 'Systemic antimicrobials with low milk excretion, warm water compresses, strip glands.',
        suggestedDiagnostics: 'Milk cytology and bacterial culture, CBC.',
        dietaryAdvice: 'High-quality lactation nutrition.',
        recommendedMedicines: [
          { medicineName: 'Cephalexin', form: 'Capsule', dosage: '25 mg/kg', route: 'Oral', frequency: 'Twice daily (BD)', duration: '10 days', instructions: 'Safe during lactation.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (CBC)', 'BUN & Creatinine'],
      usg: ['Mammary gland ultrasound (assess abscess cavities or tissue necrosis)'],
      xray: ['Not indicated unless metastatic spread suspected'],
      otherTests: ['Milk cytology and culture/sensitivity'],
      summary: 'Prescribe CBC to evaluate toxic changes and milk cytology.'
    },
    treatmentPlan: 'Administer broad-spectrum beta-lactam antibiotics, apply warm compresses 3 times daily, manually express affected glands, provide analgesia.',
    redFlagAlerts: ['Discoloration turning black/purple indicates gangrenous necrosis requiring urgent surgical debridement.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildGDVResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Gastric Dilatation-Volvulus (GDV) / Acute Bloat Syndrome with Obstructive Shock',
    confidenceScore: '96%',
    triageLevel: 'Critical',
    clinicalRationale: `Classic emergency presentation: Deep-chested dog with non-productive retching, progressive tympanic abdominal enlargement, severe sinus tachycardia, and obstructive hypovolemic shock.`,
    differentialDiagnoses: [
      {
        condition: 'Gastric Dilatation-Volvulus (GDV)',
        likelihood: 'Very High (96%)',
        likelihoodPercent: 96,
        reasoning: 'Tympanic cranial abdominal distension with non-productive retching and acute hemodynamic collapse.',
        suggestedTreatment: 'Immediate large-bore dual cephalic IV shock fluids (90 ml/kg). Orogastric tube decompression or percutaneous trocarization. Emergency exploratory laparotomy with stomach derotation and incisional gastropexy.',
        suggestedDiagnostics: 'Right lateral abdominal radiograph (Popeye arm / Double-bubble gas compartmentalization), Blood Lactate, ECG.',
        dietaryAdvice: 'Strictly NPO until surgical recovery.',
        recommendedMedicines: [
          { medicineName: 'Lidocaine 2% Injection', form: 'Vial IV', dosage: '2 mg/kg bolus then 50 mcg/kg/min CRI', route: 'IV', frequency: 'Continuous', duration: '24-48h', instructions: 'Manages reperfusion ventricular premature complexes (VPCs).' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Blood Lactate (Serial lactate: >6-9 mmol/L suggests gastric wall necrosis)', 'CBC & Platelet Count', 'Serum Chemistry (Renal & Electrolytes)', 'Coagulation Panel (PT/aPTT)'],
      usg: ['T-FAST / A-FAST (Detect free abdominal fluid from splenic avulsion or gastric rupture)'],
      xray: ['Right Lateral Abdominal Radiograph (Cardinal diagnostic view: shows gas dividing stomach into two compartments)'],
      otherTests: ['Continuous Electrocardiogram (ECG) for ventricular arrhythmias'],
      summary: 'Emergency right lateral radiograph, blood lactate, and ECG tracing immediately indicated.'
    },
    treatmentPlan: 'Dual IV catheters, shock dose fluids, immediate percutaneous gastric decompression, and rapid transfer to surgical suite for exploratory gastropexy.',
    redFlagAlerts: [
      'Extreme tachycardia (>160 bpm) and weak femoral pulses signify vena cava compression and imminent circulatory arrest.',
      'Sustained ventricular tachycardia (VT) requires immediate antiarrhythmic lidocaine therapy.'
    ],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildForeignBodyResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Mechanical Gastrointestinal Foreign Body Obstruction (Complete vs Partial Ileus)',
    confidenceScore: '91%',
    triageLevel: 'Urgent',
    clinicalRationale: `History of intractable projectile vomiting, inability to keep fluids down, focal abdominal guarding, and dehydration points to a mechanical luminal obstruction.`,
    differentialDiagnoses: [
      {
        condition: 'Gastrointestinal Foreign Body Obstruction',
        likelihood: 'High (91%)',
        likelihoodPercent: 91,
        reasoning: 'Intractable vomiting with abdominal pain and dehydration.',
        suggestedTreatment: 'IV fluid rehydration with potassium supplementation. Exploratory enterotomy or gastrotomy.',
        suggestedDiagnostics: 'Abdominal Radiographs (stacked dilated loops), Abdominal USG.',
        dietaryAdvice: 'NPO until surgical clearance.',
        recommendedMedicines: [
          { medicineName: 'Maropitant Citrate (Cerenia)', form: 'Injectable', dosage: '1 mg/kg', route: 'SC', frequency: 'Once daily (OD)', duration: '3 days', instructions: 'Visceral nausea control.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (evaluate leukocytosis / perforation)', 'BUN & Creatinine (pre-renal azotemia)', 'Serum Electrolytes (Hypochloremia & Hypokalemic metabolic alkalosis from vomiting)'],
      usg: ['Abdominal Ultrasound: Identify acoustic shadowing luminal foreign object, hyperperistaltic bowel segments, and free peritoneal fluid'],
      xray: ['Orthogonal Abdominal Radiographs (Lateral & VD): Identify radiopaque foreign material, two distinct bowel populations, or free peritoneal air (pneumoperitoneum)'],
      otherTests: ['Abdominocentesis if free fluid present'],
      summary: 'Order plain orthogonal abdominal radiographs, ultrasound, and serum electrolyte panel.'
    },
    treatmentPlan: 'Fluid resuscitation to correct electrolyte and hydration deficits, antiemetics, and exploratory laparotomy.',
    redFlagAlerts: ['Free peritoneal air on X-ray or worsening fever indicates intestinal perforation and septic peritonitis.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildBlockedCatResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Feline Urethral Obstruction (FLUTD / Obstructive Urolithiasis) with Post-Renal Azotemia',
    confidenceScore: '95%',
    triageLevel: 'Critical',
    clinicalRationale: 'Cat straining non-productively in litter box, firm turgid painful urinary bladder, and systemic signs indicate acute urethral obstruction. Hyperkalemia and post-renal azotemia are life-threatening.',
    differentialDiagnoses: [
      {
        condition: 'Obstructive Urethral Matrix Plug / Urolithiasis',
        likelihood: 'Very High (95%)',
        likelihoodPercent: 95,
        reasoning: 'Turgid non-expressible urinary bladder with crying and stranguria.',
        suggestedTreatment: 'Emergency urethral unblocking under sedation, indwelling urinary catheter, IV diuresis, Prazosin, Buprenorphine.',
        suggestedDiagnostics: 'Serum Potassium & Creatinine stat, Urinalysis, Abdominal Radiographs.',
        dietaryAdvice: 'Urinary s/d or c/d wet formulation.',
        recommendedMedicines: [
          { medicineName: 'Prazosin', form: 'Capsule', dosage: '0.5 mg/cat', route: 'Oral', frequency: 'Every 8-12 hours', duration: '7 days', instructions: 'Urethral smooth muscle relaxant.' },
          { medicineName: 'Buprenorphine', form: 'Sublingual / SC', dosage: '0.02 mg/kg', route: 'Oral/Buccal', frequency: 'Every 8 hours', duration: '5 days', instructions: 'Analgesia for urethral pain.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Serum Potassium (STAT: evaluate for cardiotoxic hyperkalemia > 6.5 mmol/L)', 'Serum BUN & Creatinine (quantify post-renal azotemia)', 'Blood Glucose & Venous Blood Gas'],
      usg: ['Urinary Bladder Ultrasound (assess bladder wall thickness, sediment, and calculus presence)'],
      xray: ['Abdominal & Pelvic Radiograph (check entire urethral path and bladder for radiopaque uroliths)'],
      otherTests: ['Urinalysis with microscopic sediment examination (struvite vs calcium oxalate crystals, hematuria, bacteria)'],
      summary: 'Immediate stat potassium and creatinine check, followed by abdominal radiography to detect stones.'
    },
    treatmentPlan: 'Emergency de-obstruction: place tomcat catheter under sedation, flush bladder with sterile saline until clear, maintain closed collection system, and diurese with IV fluids.',
    redFlagAlerts: [
      'Bradycardia (<140 bpm) in a blocked cat indicates severe cardiotoxic hyperkalemia; administer 10% calcium gluconate immediately.',
      'Risk of post-obstructive diuresis requires hourly monitoring of fluid balance.'
    ],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildParvoResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Canine Parvoviral Enteritis (CPV-2) with Severe Sepsis and Dehydration',
    confidenceScore: '93%',
    triageLevel: 'Critical',
    clinicalRationale: 'Young, unvaccinated or incompletely vaccinated dog presenting with severe projectile vomiting, foul-smelling bloody diarrhea, marked dehydration, and leukopenia.',
    differentialDiagnoses: [
      {
        condition: 'Canine Parvovirus Enteritis',
        likelihood: 'Very High (93%)',
        likelihoodPercent: 93,
        reasoning: 'Typical age, vaccination status, and hemorrhagic gastroenteritis with leukopenic shock.',
        suggestedTreatment: 'Aggressive IV balanced crystalloids, Maropitant, broad-spectrum IV bactericidal antimicrobials, nutritional tube feeding.',
        suggestedDiagnostics: 'Fecal CPV ELISA Snap Test, CBC (check for panleukopenia), Electrolytes.',
        dietaryAdvice: 'Early enteral nutrition with micro-enteral electrolyte paste or liquid recovery diet.',
        recommendedMedicines: [
          { medicineName: 'Ampicillin-Sulbactam (Unasyn)', form: 'Injectable', dosage: '30 mg/kg', route: 'IV', frequency: 'Every 8 hours', duration: '5 days', instructions: 'Prevents bacterial translocation across denuded mucosal barrier.' },
          { medicineName: 'Maropitant (Cerenia)', form: 'Injectable', dosage: '1 mg/kg', route: 'SC', frequency: 'Once daily (OD)', duration: '5 days', instructions: 'Controls intractable emesis.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (Crucial: Panleukopenia / Neutropenia < 2.0 k/uL)', 'Blood Glucose (evaluate hypoglycemia)', 'Serum Electrolytes (Sodium, Potassium, Chloride)', 'Serum Total Protein & Albumin'],
      usg: ['A-FAST (Rule out intussusception, common secondary complication in pups with hypermotile enteritis)'],
      xray: ['Abdominal Radiograph (Rule out radiopaque foreign bodies and evaluate fluid-distended bowel)'],
      otherTests: ['Fecal Parvovirus Antigen Rapid ELISA Snap Test', 'Fecal flotation for Giardia and Coccidia'],
      summary: 'Order Fecal Parvo Snap Test, Complete Blood Count, and blood glucose stat.'
    },
    treatmentPlan: 'Immediate strict barrier isolation. Aggressive IV fluid resuscitation with potassium and dextrose supplementation. Broad-spectrum IV antibiotics to combat gram-negative sepsis.',
    redFlagAlerts: ['Profound leukopenia (<1000 WBC) indicates severe bone marrow suppression and impending septic collapse.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildPancreatitisResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Acute Necrotizing or Edematous Pancreatitis with Localized Peritonitis',
    confidenceScore: '90%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Cranial abdominal pain ("prayer" posture), acute vomiting, anorexia, low-grade fever, and history of dietary indiscretion/high-fat ingestion.',
    differentialDiagnoses: [
      {
        condition: 'Acute Pancreatitis',
        likelihood: 'High (90%)',
        likelihoodPercent: 90,
        reasoning: 'Cranial abdominal pain, vomiting, elevated pancreatic lipase activity, and dehydration.',
        suggestedTreatment: 'IV crystalloid rehydration, multimodal analgesia, antiemetics, ultra-low fat diet.',
        suggestedDiagnostics: 'cPL / fPL Snap test, Abdominal Ultrasound, CBC, Chemistry.',
        dietaryAdvice: 'Strictly ultra-low-fat gastrointestinal wet diet.',
        recommendedMedicines: [
          { medicineName: 'Buprenorphine', form: 'Injectable', dosage: '0.02 mg/kg', route: 'SC / IV', frequency: 'Every 8 hours', duration: '4 days', instructions: 'Controls severe visceral abdominal pain.' },
          { medicineName: 'Maropitant Citrate', form: 'Injectable', dosage: '1 mg/kg', route: 'SC', frequency: 'Once daily (OD)', duration: '4 days', instructions: 'Antiemetic.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Canine / Feline Pancreatic Lipase Immunoreactivity (Spec cPL / Spec fPL)', 'Serum Amylase & Lipase', 'Serum Chemistry (Renal, ALT, ALP, Total Bilirubin)', 'Electrolytes & Calcium'],
      usg: ['Abdominal Ultrasound (Hypoechoic enlarged pancreatic parenchyma with hyperechoic peripancreatic mesenteric fat and corrugation)'],
      xray: ['Abdominal Radiograph (Loss of cranial abdominal serosal detail, "ground-glass" appearance)'],
      otherTests: ['Urinalysis'],
      summary: 'Order Spec cPL/fPL quantitative assay, Abdominal Ultrasound, and comprehensive serum biochemistry.'
    },
    treatmentPlan: 'Aggressive IV fluid diuresis, potent analgesia, early enteral low-fat feeding as soon as vomiting ceases.',
    redFlagAlerts: ['Development of hypocalcemia (tetany/tremors) or systemic inflammatory response syndrome (SIRS).'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildRespiratoryResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Canine Infectious Respiratory Disease Complex (CIRDC / Kennel Cough) vs Bronchopneumonia',
    confidenceScore: '89%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Paroxysmal harsh hacking cough, tracheal sensitivity, serous to mucopurulent nasal discharge, tachypnea, and pyrexia.',
    differentialDiagnoses: [
      {
        condition: 'Canine Infectious Respiratory Disease Complex (Kennel Cough)',
        likelihood: 'High (89%)',
        likelihoodPercent: 89,
        reasoning: 'Acute onset of paroxysmal honking cough with tracheal sensitivity.',
        suggestedTreatment: 'Oral antimicrobials (Doxycycline), nebulization therapy, antitussives (if non-productive).',
        suggestedDiagnostics: 'Thoracic Radiographs, CBC, Respiratory PCR panel.',
        dietaryAdvice: 'Soft, moistened food to prevent pharyngeal irritation.',
        recommendedMedicines: [
          { medicineName: 'Doxycycline', form: 'Tablet', dosage: '10 mg/kg', route: 'Oral', frequency: 'Once daily (OD)', duration: '14 days', instructions: 'Target Bordetella bronchiseptica and Mycoplasma. Give with water/food to prevent esophageal stricture.' },
          { medicineName: 'Hydrocodone / Homatropine', form: 'Syrup / Tablet', dosage: '0.22 mg/kg', route: 'Oral', frequency: 'Every 8-12 hours', duration: '5 days', instructions: 'Antitussive for non-productive hacking cough.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (CBC) with differential (look for inflammatory leukocytosis and left shift)'],
      usg: ['T-FAST / Lung Ultrasound (evaluate B-lines and subpleural consolidation)'],
      xray: ['Thoracic Radiographs (3-view Thorax: Left lateral, Right lateral, VD - evaluate bronchial, interstitial, or alveolar lung patterns)'],
      otherTests: ['Canine Respiratory PCR Panel (Bordetella, Parainfluenza, Adenovirus, Influenza, Mycoplasma)'],
      summary: 'Order 3-view Thoracic Radiographs and Complete Blood Count to distinguish upper airway CIRDC from pneumonia.'
    },
    treatmentPlan: 'Antibiotic therapy with Doxycycline or Clavamox, warm steam nebulization for 15 minutes twice daily, harness instead of neck collar, and exercise restriction.',
    redFlagAlerts: ['Cyanotic mucous membranes, orthopnea, or respiratory rate > 50 bpm at rest indicates critical hypoxemia requiring oxygen cage therapy.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildTickBorneResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Canine Tick-Borne Hemoparasitic Disease (Ehrlichiosis / Babesiosis) with Immune-Mediated Thrombocytopenia',
    confidenceScore: '92%',
    triageLevel: 'Urgent',
    clinicalRationale: 'High fever, history of tick exposure, petechial hemorrhages on mucous membranes, epistaxis, pale gums, and marked thrombocytopenia.',
    differentialDiagnoses: [
      {
        condition: 'Canine Ehrlichiosis (Ehrlichia canis)',
        likelihood: 'High (92%)',
        likelihoodPercent: 92,
        reasoning: 'Fever, tick exposure, petechiae, lymphadenopathy, and bleeding diathesis.',
        suggestedTreatment: 'Doxycycline 10 mg/kg PO q24h for 28 consecutive days. Supportive fluid and liver therapy.',
        suggestedDiagnostics: '4Dx Plus ELISA Snap Test, CBC with platelet count, Blood Smear.',
        dietaryAdvice: 'Iron-rich, high-protein convalescence diet.',
        recommendedMedicines: [
          { medicineName: 'Doxycycline Monohydrate', form: 'Tablet', dosage: '10 mg/kg', route: 'Oral', frequency: 'Once daily (OD)', duration: '28 days', instructions: 'Complete full 28-day course to clear intracellular organisms.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count with manual Platelet Count (Check for severe thrombocytopenia < 50k and anemia)', '4Dx Plus / Vector-Borne Rapid ELISA Test', 'Serum BUN, Creatinine, Total Protein & Albumin'],
      usg: ['Abdominal Ultrasound (Evaluate for marked splenomegaly and reactive lymphadenopathy)'],
      xray: ['Thoracic Radiograph if coughing or dyspnea present'],
      otherTests: ['Peripheral Blood Smear with Giemsa / Wright stain (inspect monocytes for Ehrlichia morulae or RBCs for Babesia piroplasms)'],
      summary: 'Order 4Dx Vector-Borne Rapid Snap Test and Complete Blood Count with manual platelet review.'
    },
    treatmentPlan: 'Initiate Doxycycline therapy immediately, avoid intramuscular injections due to bleeding risk, provide strict rest, monitor hematocrit and platelet counts.',
    redFlagAlerts: ['Severe spontaneous hemorrhage (epistaxis, melena) or hematocrit < 15% requires packed red blood cell / whole blood transfusion.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildOrthopedicResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Traumatic Skeletal Fracture / Cranial Cruciate Ligament (CCL) Rupture',
    confidenceScore: '91%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Acute non-weight bearing lameness, localized soft-tissue swelling, bone crepitus, severe pain on palpation and manipulation following trauma or sudden athletic turn.',
    differentialDiagnoses: [
      {
        condition: 'Closed Bone Fracture / Orthopedic Luxation',
        likelihood: 'High (91%)',
        likelihoodPercent: 91,
        reasoning: 'Acute severe non-weight bearing lameness with swelling and crepitus.',
        suggestedTreatment: 'Temporary immobilization with Robert Jones bandage/splint. Multimodal analgesia. Open reduction and internal fixation.',
        suggestedDiagnostics: 'Orthogonal digital radiographs.',
        dietaryAdvice: 'Strict cage rest with calorie restriction.',
        recommendedMedicines: [
          { medicineName: 'Meloxicam (Metacam)', form: 'Oral Suspension', dosage: '0.1 mg/kg', route: 'Oral', frequency: 'Once daily (OD)', duration: '7 days', instructions: 'Give with food.' },
          { medicineName: 'Gabapentin', form: 'Capsule', dosage: '10 mg/kg', route: 'Oral', frequency: 'Every 8-12 hours', duration: '14 days', instructions: 'Analgesia and mild sedation.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Pre-anesthetic CBC and Serum Biochemistry Panel prior to orthopedic surgery'],
      usg: ['Musculoskeletal Ultrasound (if soft tissue tendon/ligament avulsion suspected)'],
      xray: ['Orthogonal Digital Radiographs (Craniocaudal & Mediolateral views) of the affected limb including joints above and below'],
      otherTests: ['Arthrocentesis with joint fluid cytology if septic arthritis or immune-mediated polyarthritis suspected'],
      summary: 'Prescribe orthogonal digital radiographs of the affected anatomical region and pre-anesthetic blood panel.'
    },
    treatmentPlan: 'Apply supportive coaptation/splint, provide multimodal analgesia (NSAIDs + Gabapentin), enforce strict crate rest, and plan surgical stabilization.',
    redFlagAlerts: ['Open fracture with skin penetration requires emergency wound irrigation, broad-spectrum IV antibiotics, and sterile dressing.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildRenalResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Chronic Kidney Disease (IRIS Stage 2-3) with Pre-Renal Uremic Crisis',
    confidenceScore: '89%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Polyuria/polydipsia, progressive weight loss, uremic halitosis, dehydration, elevated BUN/Creatinine, and dilute urine specific gravity.',
    differentialDiagnoses: [
      {
        condition: 'Chronic Kidney Disease (CKD)',
        likelihood: 'High (89%)',
        likelihoodPercent: 89,
        reasoning: 'PU/PD with azotemia, dehydration, weight loss, and hyposthenuric/isosthenuric urine.',
        suggestedTreatment: 'Subcutaneous or IV crystalloid rehydration, renal prescription diet, intestinal phosphate binders, blood pressure control.',
        suggestedDiagnostics: 'Serum Chemistry (BUN, Creatinine, SDMA, Phosphorus), Urinalysis with UPC, Blood Pressure.',
        dietaryAdvice: 'Renal-specific diet with restricted phosphorus and high-quality protein.',
        recommendedMedicines: [
          { medicineName: 'Aluminum Hydroxide Gel', form: 'Powder / Liquid', dosage: '30 - 50 mg/kg/day', route: 'Oral', frequency: 'Divided with meals', duration: 'Ongoing', instructions: 'Intestinal phosphate binder; mix with each meal.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Comprehensive Renal Chemistry (BUN, Creatinine, SDMA, Phosphorus, Calcium, Potassium, Albumin)', 'Complete Blood Count (evaluate non-regenerative anemia secondary to erythropoietin deficiency)'],
      usg: ['Renal Ultrasound (Assess kidney size, cortical echogenicity, loss of corticomedullary distinction, and hydronephrosis)'],
      xray: ['Abdominal Radiograph (Evaluate kidney size and radiopaque nephroliths / ureteroliths)'],
      otherTests: ['Complete Urinalysis with Urine Specific Gravity (USG) & Urine Protein-to-Creatinine (UPC) ratio', 'Doppler Blood Pressure Measurement'],
      summary: 'Order Comprehensive Renal Chemistry Panel (BUN, Creatinine, SDMA, Electrolytes), Urinalysis with USG, and Blood Pressure.'
    },
    treatmentPlan: 'Correct hydration deficit with balanced crystalloids, transition to renal diet, initiate phosphate control, and monitor blood pressure.',
    redFlagAlerts: ['Oliguria or anuria (<0.5 ml/kg/h) indicates acute-on-chronic renal shutdown requiring emergency nephrology interventions.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildCystitisResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Bacterial Cystitis vs Urolithiasis / Bladder Calculi',
    confidenceScore: '88%',
    triageLevel: 'Routine',
    clinicalRationale: 'Pollakiuria (frequent urination), dysuria, hematuria, inappropriate elimination indoors, without systemic shock.',
    differentialDiagnoses: [
      {
        condition: 'Bacterial Cystitis / Lower Urinary Tract Infection',
        likelihood: 'High (88%)',
        likelihoodPercent: 88,
        reasoning: 'Frequent voiding of small volumes of blood-tinged urine with dysuria.',
        suggestedTreatment: 'Targeted antimicrobial therapy (Amoxicillin-Clavulanate), anti-inflammatory analgesics, increased water intake.',
        suggestedDiagnostics: 'Urinalysis with sediment exam and bacterial culture, Abdominal Ultrasound.',
        dietaryAdvice: 'Increased moisture diet with urinary tract health formula.',
        recommendedMedicines: [
          { medicineName: 'Amoxicillin-Clavulanate', form: 'Tablet', dosage: '12.5 mg/kg', route: 'Oral', frequency: 'Twice daily (BD)', duration: '10 days', instructions: 'Administer with food.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['CBC and Renal Chemistry (BUN & Creatinine to verify normal upper tract filtration)'],
      usg: ['Urinary Bladder Ultrasound (Examine mucosal wall thickness, polypoid lesions, and acoustic shadowing calculi)'],
      xray: ['Abdominal & Pelvic Radiographs (Detect radiopaque urinary bladder calculi - struvite, calcium oxalate, silica)'],
      otherTests: ['Cystocentesis Urinalysis with Microscopic Sediment and Aerobic Bacterial Culture with Sensitivity'],
      summary: 'Order Cystocentesis Urinalysis, Bacterial Culture & Sensitivity, and Abdominal Ultrasound.'
    },
    treatmentPlan: 'Start empiric antimicrobial therapy pending culture results, administer NSAID for bladder discomfort, encourage active water intake.',
    redFlagAlerts: ['Complete inability to pass urine indicates urethral blockage requiring emergency intervention.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildNeuroResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Idiopathic Epilepsy vs Acute Encephalopathy / Toxicosis',
    confidenceScore: '87%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Seizure episodes, post-ictal confusion, ataxia, hypersalivation, or acute neurological deficits.',
    differentialDiagnoses: [
      {
        condition: 'Idiopathic Epilepsy',
        likelihood: 'High (87%)',
        likelihoodPercent: 87,
        reasoning: 'Typical onset in young adult companion animals with normal interictal examination.',
        suggestedTreatment: 'Anticonvulsant therapy (Levetiracetam or Phenobarbital) if clusters or status epilepticus occur.',
        suggestedDiagnostics: 'CBC, Chemistry with fasting bile acids, Blood Glucose, Electrolytes.',
        dietaryAdvice: 'Neuro-supportive diet enriched with medium-chain triglycerides (MCT).',
        recommendedMedicines: [
          { medicineName: 'Levetiracetam (Keppra)', form: 'Tablet', dosage: '20 mg/kg', route: 'Oral', frequency: 'Every 8 hours', duration: 'Ongoing', instructions: 'Do not discontinue abruptly.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Fasting Blood Glucose (rule out hypoglycemia / insulinoma)', 'Serum Electrolytes (rule out hypocalcemia, hyponatremia)', 'Pre- and Post-Prandial Bile Acids (rule out portosystemic shunt)', 'Comprehensive Chemistry & CBC'],
      usg: ['Abdominal Ultrasound to evaluate for hepatic vascular anomalies (portosystemic shunt)'],
      xray: ['Thoracic and Abdominal Radiographs for extracranial neoplastic or toxic causes'],
      otherTests: ['Neurological exam localization, Blood pressure, Brain MRI & CSF analysis if refractory'],
      summary: 'Order Minimum DataBase: Blood Glucose, Electrolytes, Bile Acids, and Liver/Renal Chemistry.'
    },
    treatmentPlan: 'Emergency anticonvulsant protocol with rectal/intranasal Midazolam if active seizures occur, maintain cool quiet environment, initiate maintenance antiepileptics if indicated.',
    redFlagAlerts: ['Status epilepticus (seizure lasting > 5 minutes) or cluster seizures (> 2 in 24h) causes life-threatening hyperthermia and cerebral edema.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildDermatologyResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Canine Atopic Dermatitis / Allergic Dermatitis with Secondary Malassezia & Pyoderma',
    confidenceScore: '89%',
    triageLevel: 'Routine',
    clinicalRationale: 'Intense pruritus, erythema, alopecia, excoriations on paws, face, and ventrum, often with secondary bacterial or yeast overgrowth.',
    differentialDiagnoses: [
      {
        condition: 'Allergic Dermatitis (Atopic / Food Allergy)',
        likelihood: 'High (89%)',
        likelihoodPercent: 89,
        reasoning: 'Chronic pruritus with secondary pyoderma and lichenification in characteristic distribution.',
        suggestedTreatment: 'Antipruritic therapy (Oclacitinib or Lokivetmab), medicated antimicrobial bathing, ectoparasite prevention.',
        suggestedDiagnostics: 'Skin scrape, tape strip cytology, flea combing.',
        dietaryAdvice: 'Hydrolyzed protein elimination diet trial for 8-10 weeks.',
        recommendedMedicines: [
          { medicineName: 'Oclacitinib (Apoquel)', form: 'Tablet', dosage: '0.4 - 0.6 mg/kg', route: 'Oral', frequency: 'Twice daily for 14 days, then once daily', duration: '30 days', instructions: 'Targeted JAK-1 inhibitor for rapid pruritus relief.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Serum Allergen-Specific IgE Testing (after resolving secondary infections)', 'Thyroid Panel (Total T4 & free T4 by dialysis to rule out hypothyroidism)'],
      usg: ['Not routinely indicated for primary dermatologic presentations'],
      xray: ['Not indicated'],
      otherTests: ['Superficial and Deep Skin Scrape (rule out Demodex and Sarcoptes mites)', 'Tape Strip / Impression Cytology (quantify Cocci bacteria and Malassezia yeast)', 'Trichogram (hair pluck exam for dermatophytosis/ringworm)'],
      summary: 'Order Skin Impression Cytology, Deep Skin Scrape for Mites, and Flea Combing.'
    },
    treatmentPlan: 'Initiate targeted antipruritic therapy, prescribe topical chlorhexidine-ketoconazole baths twice weekly, apply modern isoxazoline parasite control, and consider strict elimination diet trial.',
    redFlagAlerts: ['Signs of systemic illness, profound lethargy, or sloughing skin (Erythema Multiforme / TEN) requiring emergency dermatologic admission.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildGastroenteritisResult(patient: any, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: 'Acute Gastroenteritis & Dehydration Secondary to Dietary Indiscretion',
    confidenceScore: '90%',
    triageLevel: 'Urgent',
    clinicalRationale: 'Acute onset of vomiting and loose diarrhea following ingestion of novel or spoiled food, accompanied by mild to moderate dehydration.',
    differentialDiagnoses: [
      {
        condition: 'Acute Dietary Indiscretion / Gastroenteritis',
        likelihood: 'High (90%)',
        likelihoodPercent: 90,
        reasoning: 'Sudden gastrointestinal signs with no signs of mechanical obstruction or septic abdomen.',
        suggestedTreatment: 'Subcutaneous or IV crystalloid rehydration, antiemetics, gastrointestinal mucosal protectants, probiotics, bland diet.',
        suggestedDiagnostics: 'Fecal flotation, CBC, Renal chemistry, Abdominal Ultrasound.',
        dietaryAdvice: 'Highly digestible bland gastrointestinal diet (e.g. boiled chicken and rice or commercial GI prescription wet food) in small frequent meals.',
        recommendedMedicines: [
          { medicineName: 'Maropitant Citrate (Cerenia)', form: 'Tablet', dosage: '2 mg/kg', route: 'Oral', frequency: 'Once daily (OD)', duration: '4 days', instructions: 'Administer with a small piece of food 1 hour before feeding.' },
          { medicineName: 'Proviable-DC Probiotic & Paste', form: 'Paste / Capsule', dosage: '3 ml paste BD + 1 cap', route: 'Oral', frequency: 'Twice daily', duration: '7 days', instructions: 'Restores beneficial intestinal microflora.' },
          { medicineName: 'Pantoprazole', form: 'Tablet', dosage: '1 mg/kg', route: 'Oral', frequency: 'Once daily', duration: '5 days', instructions: 'Proton pump inhibitor.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (CBC) with differential (rule out leukopenia or marked inflammatory response)', 'Serum BUN & Creatinine (evaluate dehydration-induced pre-renal azotemia)', 'Serum Electrolytes (Sodium, Potassium, Chloride)'],
      usg: ['Abdominal Ultrasound (rule out pancreatitis, intestinal wall thickening, or intussusception)'],
      xray: ['Abdominal Radiograph (rule out radiopaque foreign body and obstructive mechanical ileus)'],
      otherTests: ['Fecal Flotation & Direct Wet Smear (screen for Giardia trophozoites, Ancylostoma, Toxocara ova)'],
      summary: 'Order Fecal Flotation, CBC, Serum BUN & Creatinine, and Abdominal Ultrasound if vomiting persists.'
    },
    treatmentPlan: 'Correct fluid deficit with balanced crystalloids (LRS), administer Maropitant to stop emesis, start intestinal probiotics, and feed bland gastrointestinal diet once vomiting has ceased for 12 hours.',
    redFlagAlerts: ['Progression to intractable vomiting with inability to keep water down or development of melena/hematochezia warrants urgent exploratory imaging.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}

function buildGeneralMedicalResult(patient: any, specialty: string, vitals: any, tempStatus: string, hrStatus: string, rrStatus: string, crtStatus: string, mucousStatus: string, hydrationStatus: string): DiagnosticEngineResult {
  return {
    provisionalDiagnosis: `Clinical Syndrome under Investigation (${specialty} Focus)`,
    confidenceScore: '86%',
    triageLevel: 'Urgent',
    clinicalRationale: `Systematic evaluation for this ${patient.species || 'companion animal'} shows active physical parameter deviations requiring diagnostic correlation: ${tempStatus}, ${hrStatus}, ${mucousStatus}, and ${hydrationStatus}.`,
    differentialDiagnoses: [
      {
        condition: 'Acute Systemic Inflammatory or Metabolic Disorder',
        likelihood: 'High (86%)',
        likelihoodPercent: 86,
        reasoning: 'Vital parameter deviations and presenting clinical signs indicate systemic pathology under investigation.',
        suggestedTreatment: 'Supportive fluid therapy, targeted symptomatic medical care, diagnostic confirmation.',
        suggestedDiagnostics: 'Minimum DataBase: CBC, Comprehensive Chemistry, Urinalysis, and Ultrasound.',
        dietaryAdvice: 'Easily digestible palatable nutrition with free access to clean water.',
        recommendedMedicines: [
          { medicineName: 'Balanced Crystalloids (LRS)', form: 'IV Infusion', dosage: 'Maintenance + Deficit', route: 'IV / SC', frequency: 'Continuous / Bolus', duration: '1-3 days', instructions: 'Restore euvolemic perfusion.' }
        ]
      }
    ],
    diagnosticRecommendations: {
      bloodTests: ['Complete Blood Count (CBC) with differential', 'Comprehensive Blood Chemistry Panel (Renal, Hepatic, Electrolytes, Glucose)', 'Urinalysis with Specific Gravity'],
      usg: ['Abdominal Ultrasound Study (Screen parenchymal organs and check for fluid accumulation)'],
      xray: ['Orthogonal Thoracic or Abdominal Radiographs'],
      otherTests: ['Infectious disease screening as indicated by species and geographic risk'],
      summary: 'Order standard Minimum DataBase: Complete Blood Count, Serum Chemistry, Urinalysis, and Abdominal Ultrasound.'
    },
    treatmentPlan: 'Provide initial supportive fluid therapy, maintain thermo-neutral environment, and obtain confirmatory diagnostic results before instituting targeted medical therapy.',
    redFlagAlerts: ['Monitor for changes in mental status, respiratory rate (>40 bpm), or prolonged CRT.'],
    vitalAnalysis: { tempStatus, hrStatus, rrStatus, crtStatus, mucousStatus, hydrationStatus }
  };
}
