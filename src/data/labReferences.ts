export interface SpeciesReferenceRange {
  name: string;
  unit: string;
  low: number;
  high: number;
}

export const VET_LAB_REFERENCES: Record<string, Record<string, SpeciesReferenceRange>> = {
  'Canine (Dog)': {
    'RBC': { name: 'Red Blood Cells (RBC)', unit: 'M/μL', low: 5.5, high: 8.5 },
    'Hb': { name: 'Hemoglobin (Hb)', unit: 'g/dL', low: 12.0, high: 18.0 },
    'PCV': { name: 'Hematocrit (PCV)', unit: '%', low: 37.0, high: 55.0 },
    'WBC': { name: 'White Blood Cells (WBC)', unit: 'K/μL', low: 6.0, high: 17.0 },
    'Platelets': { name: 'Platelets', unit: 'K/μL', low: 200, high: 500 },
    'Glucose': { name: 'Blood Glucose', unit: 'mg/dL', low: 70, high: 140 },
    'BUN': { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', low: 7, high: 27 },
    'Creatinine': { name: 'Creatinine', unit: 'mg/dL', low: 0.5, high: 1.8 },
    'ALT': { name: 'Alanine Aminotransferase (ALT)', unit: 'U/L', low: 10, high: 100 },
    'AST': { name: 'Aspartate Aminotransferase (AST)', unit: 'U/L', low: 0, high: 50 },
    'ALP': { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', low: 23, high: 212 },
    'Total Protein': { name: 'Total Protein', unit: 'g/dL', low: 5.2, high: 8.2 },
    'Albumin': { name: 'Albumin', unit: 'g/dL', low: 2.3, high: 4.0 },
    'Globulin': { name: 'Globulin', unit: 'g/dL', low: 2.5, high: 4.5 },
    'Total Bilirubin': { name: 'Total Bilirubin', unit: 'mg/dL', low: 0.0, high: 0.9 },
    'Sodium': { name: 'Sodium (Na+)', unit: 'mmol/L', low: 144, high: 160 },
    'Potassium': { name: 'Potassium (K+)', unit: 'mmol/L', low: 3.5, high: 5.8 },
    'Chloride': { name: 'Chloride (Cl-)', unit: 'mmol/L', low: 109, high: 122 },
  },
  'Feline (Cat)': {
    'RBC': { name: 'Red Blood Cells (RBC)', unit: 'M/μL', low: 5.0, high: 10.0 },
    'Hb': { name: 'Hemoglobin (Hb)', unit: 'g/dL', low: 8.0, high: 15.0 },
    'PCV': { name: 'Hematocrit (PCV)', unit: '%', low: 24.0, high: 45.0 },
    'WBC': { name: 'White Blood Cells (WBC)', unit: 'K/μL', low: 5.5, high: 19.5 },
    'Platelets': { name: 'Platelets', unit: 'K/μL', low: 300, high: 700 },
    'Glucose': { name: 'Blood Glucose', unit: 'mg/dL', low: 74, high: 159 },
    'BUN': { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', low: 16, high: 36 },
    'Creatinine': { name: 'Creatinine', unit: 'mg/dL', low: 0.8, high: 2.4 },
    'ALT': { name: 'Alanine Aminotransferase (ALT)', unit: 'U/L', low: 12, high: 130 },
    'AST': { name: 'Aspartate Aminotransferase (AST)', unit: 'U/L', low: 0, high: 48 },
    'ALP': { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', low: 14, high: 111 },
    'Total Protein': { name: 'Total Protein', unit: 'g/dL', low: 5.7, high: 8.9 },
    'Albumin': { name: 'Albumin', unit: 'g/dL', low: 2.5, high: 3.9 },
    'Globulin': { name: 'Globulin', unit: 'g/dL', low: 2.8, high: 5.1 },
    'Total Bilirubin': { name: 'Total Bilirubin', unit: 'mg/dL', low: 0.0, high: 0.4 },
    'Sodium': { name: 'Sodium (Na+)', unit: 'mmol/L', low: 150, high: 165 },
    'Potassium': { name: 'Potassium (K+)', unit: 'mmol/L', low: 3.5, high: 5.8 },
    'Chloride': { name: 'Chloride (Cl-)', unit: 'mmol/L', low: 112, high: 129 },
  },
  'Equine (Horse)': {
    'RBC': { name: 'Red Blood Cells (RBC)', unit: 'M/μL', low: 6.8, high: 12.9 },
    'Hb': { name: 'Hemoglobin (Hb)', unit: 'g/dL', low: 11.0, high: 19.0 },
    'PCV': { name: 'Hematocrit (PCV)', unit: '%', low: 32.0, high: 53.0 },
    'WBC': { name: 'White Blood Cells (WBC)', unit: 'K/μL', low: 5.4, high: 14.3 },
    'Platelets': { name: 'Platelets', unit: 'K/μL', low: 100, high: 350 },
    'Glucose': { name: 'Blood Glucose', unit: 'mg/dL', low: 75, high: 115 },
    'BUN': { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', low: 10, high: 24 },
    'Creatinine': { name: 'Creatinine', unit: 'mg/dL', low: 1.2, high: 1.9 },
    'ALT': { name: 'Alanine Aminotransferase (ALT)', unit: 'U/L', low: 3, high: 23 },
    'AST': { name: 'Aspartate Aminotransferase (AST)', unit: 'U/L', low: 226, high: 366 },
    'ALP': { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', low: 70, high: 227 },
    'Total Protein': { name: 'Total Protein', unit: 'g/dL', low: 5.8, high: 8.7 },
    'Albumin': { name: 'Albumin', unit: 'g/dL', low: 2.2, high: 3.7 },
    'Globulin': { name: 'Globulin', unit: 'g/dL', low: 2.6, high: 4.0 },
    'Total Bilirubin': { name: 'Total Bilirubin', unit: 'mg/dL', low: 0.2, high: 2.0 },
    'Sodium': { name: 'Sodium (Na+)', unit: 'mmol/L', low: 132, high: 146 },
    'Potassium': { name: 'Potassium (K+)', unit: 'mmol/L', low: 2.4, high: 4.7 },
    'Chloride': { name: 'Chloride (Cl-)', unit: 'mmol/L', low: 99, high: 109 },
  }
};

export function getReferenceFlag(species: string, paramKey: string, val: number): 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' {
  const table = VET_LAB_REFERENCES[species] || VET_LAB_REFERENCES['Canine (Dog)'];
  const ref = table[paramKey];
  if (!ref || isNaN(val)) return 'NORMAL';
  if (val < ref.low * 0.7) return 'CRITICAL';
  if (val > ref.high * 1.5) return 'CRITICAL';
  if (val < ref.low) return 'LOW';
  if (val > ref.high) return 'HIGH';
  return 'NORMAL';
}
