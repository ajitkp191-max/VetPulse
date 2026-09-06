import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Users,
  Calendar,
  Stethoscope,
  FlaskConical,
  Scan,
  Activity,
  Zap,
  Scissors,
  ShieldCheck,
  Bug,
  FileText,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  CornerDownLeft,
  ChevronRight,
  History,
  Sparkles,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';
import { initialSurgeries } from '../../data/mockData';

export type SearchCategory =
  | 'all'
  | 'patients'
  | 'consultations'
  | 'diagnostics'
  | 'inventory'
  | 'appointments'
  | 'billing'
  | 'modules';

interface SearchResultItem {
  id: string;
  category: 'patient' | 'consultation' | 'lab' | 'imaging' | 'ecg' | 'prescription' | 'inventory' | 'appointment' | 'billing' | 'surgery' | 'module';
  categoryLabel: string;
  title: string;
  subtitle: string;
  extraInfo?: string;
  badge?: string;
  badgeColor?: string;
  icon: any;
  petId?: string;
  action: () => void;
}

interface AdminGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGlobalSearch: React.FC<AdminGlobalSearchProps> = ({ isOpen, onClose }) => {
  const {
    pets,
    consultations,
    labReports,
    imagingRecords,
    ecgRecords,
    vaccinations,
    dewormings,
    prescriptions,
    appointments,
    invoices,
    inventory,
    setAdminActiveTab,
    setSelectedPetId,
    showNotification,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vet_admin_recent_searches');
      return saved ? JSON.parse(saved) : ['Canine', 'Vaccination', 'Amoxicillin', 'CBC'];
    } catch {
      return ['Canine', 'Vaccination', 'Amoxicillin', 'CBC'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const saveSearchQuery = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('vet_admin_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('vet_admin_recent_searches');
    } catch {}
  };

  // Compile all searchable clinical records
  const allResults = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // 1. Navigation Modules
    ADMIN_NAV_ITEMS.forEach((nav) => {
      if (
        !q ||
        nav.label.toLowerCase().includes(q) ||
        nav.id.toLowerCase().includes(q) ||
        'navigation module tab'.includes(q)
      ) {
        items.push({
          id: `module_${nav.id}`,
          category: 'module',
          categoryLabel: 'Module',
          title: nav.label,
          subtitle: `Navigate to ${nav.label} workspace`,
          badge: 'Clinical Tab',
          badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
          icon: nav.icon,
          action: () => {
            setAdminActiveTab(nav.id);
            saveSearchQuery(nav.label);
            onClose();
          },
        });
      }
    });

    // 2. Patients / Pets
    pets.forEach((pet) => {
      const matches =
        !q ||
        pet.name.toLowerCase().includes(q) ||
        pet.species.toLowerCase().includes(q) ||
        pet.breed.toLowerCase().includes(q) ||
        pet.ownerName.toLowerCase().includes(q) ||
        pet.ownerPhone.toLowerCase().includes(q) ||
        pet.ownerEmail.toLowerCase().includes(q) ||
        pet.identificationNumber.toLowerCase().includes(q) ||
        (pet.microchipNumber && pet.microchipNumber.toLowerCase().includes(q)) ||
        (pet.bloodType && pet.bloodType.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `pet_${pet.id}`,
          category: 'patient',
          categoryLabel: 'Patient',
          title: pet.name,
          subtitle: `${pet.species} • ${pet.breed} • Owner: ${pet.ownerName} (${pet.ownerPhone})`,
          extraInfo: `Reg: ${pet.identificationNumber} | ${pet.weight}kg`,
          badge: pet.species.split(' ')[0],
          badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
          icon: Users,
          petId: pet.id,
          action: () => {
            setSelectedPetId(pet.id);
            setAdminActiveTab('patients');
            saveSearchQuery(pet.name);
            showNotification(`Selected patient ${pet.name}`, 'info');
            onClose();
          },
        });
      }
    });

    // 3. Consultations & Diagnoses
    consultations.forEach((cons) => {
      const matches =
        !q ||
        cons.petName.toLowerCase().includes(q) ||
        cons.chiefComplaint.toLowerCase().includes(q) ||
        cons.provisionalDiagnosis.toLowerCase().includes(q) ||
        cons.treatmentPlan.toLowerCase().includes(q) ||
        cons.veterinarianName.toLowerCase().includes(q) ||
        cons.differentialDiagnoses.some((d) => d.toLowerCase().includes(q)) ||
        cons.prescribedMeds.some((m) => m.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `cons_${cons.id}`,
          category: 'consultation',
          categoryLabel: 'Consultation',
          title: `Dx: ${cons.provisionalDiagnosis || 'General Clinical Exam'}`,
          subtitle: `Patient: ${cons.petName} • Complaint: ${cons.chiefComplaint}`,
          extraInfo: `Date: ${cons.date} • Dr: ${cons.veterinarianName}`,
          badge: cons.status,
          badgeColor:
            cons.status === 'Completed'
              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
          icon: Stethoscope,
          petId: cons.petId,
          action: () => {
            setSelectedPetId(cons.petId);
            setAdminActiveTab('consultation');
            saveSearchQuery(cons.provisionalDiagnosis || cons.petName);
            onClose();
          },
        });
      }
    });

    // 4. Laboratory Diagnostics
    labReports.forEach((lab) => {
      const matches =
        !q ||
        lab.petName.toLowerCase().includes(q) ||
        lab.testType.toLowerCase().includes(q) ||
        lab.interpretation.toLowerCase().includes(q) ||
        lab.parameters.some((p) => p.name.toLowerCase().includes(q) || p.value.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `lab_${lab.id}`,
          category: 'lab',
          categoryLabel: 'Lab Test',
          title: `${lab.testType} — ${lab.petName}`,
          subtitle: `Interpretation: ${lab.interpretation.slice(0, 90)}...`,
          extraInfo: `Date: ${lab.date} • Owner: ${lab.ownerName}`,
          badge: 'Lab Report',
          badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
          icon: FlaskConical,
          petId: lab.petId,
          action: () => {
            setSelectedPetId(lab.petId);
            setAdminActiveTab('laboratory');
            saveSearchQuery(lab.testType);
            onClose();
          },
        });
      }
    });

    // 5. Imaging Records (X-Ray, Ultrasound, CT)
    imagingRecords.forEach((img) => {
      const findingsList: string[] = Array.isArray(img.findings)
        ? img.findings
        : typeof (img as any).findings === 'string' && (img as any).findings
          ? [(img as any).findings]
          : [];

      const matches =
        !q ||
        (img.petName && img.petName.toLowerCase().includes(q)) ||
        (img.modality && img.modality.toLowerCase().includes(q)) ||
        (img.anatomicalRegion && img.anatomicalRegion.toLowerCase().includes(q)) ||
        (img.interpretation && img.interpretation.toLowerCase().includes(q)) ||
        findingsList.some((f) => typeof f === 'string' && f.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `img_${img.id}`,
          category: 'imaging',
          categoryLabel: 'Imaging',
          title: `${img.modality || 'Imaging'} (${img.anatomicalRegion || 'General'}) — ${img.petName || 'Patient'}`,
          subtitle: `Findings: ${findingsList.join(', ').slice(0, 85)}`,
          extraInfo: `Date: ${img.date}`,
          badge: 'Radiology',
          badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300',
          icon: Scan,
          petId: img.petId,
          action: () => {
            setSelectedPetId(img.petId);
            setAdminActiveTab('imaging');
            saveSearchQuery(img.modality || 'Imaging');
            onClose();
          },
        });
      }
    });

    // 6. ECG Diagnostics
    ecgRecords.forEach((ecg) => {
      const matches =
        !q ||
        ecg.petName.toLowerCase().includes(q) ||
        ecg.rhythm.toLowerCase().includes(q) ||
        ecg.arrhythmiaIdentified.toLowerCase().includes(q) ||
        ecg.recordingNotes.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `ecg_${ecg.id}`,
          category: 'ecg',
          categoryLabel: 'ECG',
          title: `ECG Tracing: ${ecg.rhythm} — ${ecg.petName}`,
          subtitle: `HR: ${ecg.heartRate} bpm • Arrhythmia: ${ecg.arrhythmiaIdentified}`,
          extraInfo: `Date: ${ecg.date}`,
          badge: `${ecg.heartRate} BPM`,
          badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
          icon: Activity,
          petId: ecg.petId,
          action: () => {
            setSelectedPetId(ecg.petId);
            setAdminActiveTab('ecg');
            saveSearchQuery(`ECG ${ecg.rhythm}`);
            onClose();
          },
        });
      }
    });

    // 7. Prescriptions (Rx)
    prescriptions.forEach((rx) => {
      const matches =
        !q ||
        rx.petName.toLowerCase().includes(q) ||
        rx.prescriptionNumber.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q) ||
        rx.items.some((item) => item.medicineName.toLowerCase().includes(q) || item.dosage.toLowerCase().includes(q));

      if (matches) {
        const medsSummary = rx.items.map((i) => i.medicineName).join(', ');
        items.push({
          id: `rx_${rx.id}`,
          category: 'prescription',
          categoryLabel: 'Prescription',
          title: `Rx #${rx.prescriptionNumber} — ${rx.petName}`,
          subtitle: `Meds: ${medsSummary} • Dx: ${rx.diagnosis}`,
          extraInfo: `Date: ${rx.date} • Owner: ${rx.ownerName}`,
          badge: 'Rx Script',
          badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
          icon: FileText,
          petId: rx.petId,
          action: () => {
            setSelectedPetId(rx.petId);
            setAdminActiveTab('prescription');
            saveSearchQuery(rx.prescriptionNumber);
            onClose();
          },
        });
      }
    });

    // 8. Pharmacy / Drug Inventory
    inventory.forEach((drug) => {
      const matches =
        !q ||
        drug.name.toLowerCase().includes(q) ||
        drug.category.toLowerCase().includes(q) ||
        drug.genericComposition.toLowerCase().includes(q) ||
        drug.batchNumber.toLowerCase().includes(q) ||
        drug.supplier.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `drug_${drug.id}`,
          category: 'inventory',
          categoryLabel: 'Pharmacy',
          title: drug.name,
          subtitle: `${drug.genericComposition} • Category: ${drug.category} • Batch: ${drug.batchNumber}`,
          extraInfo: `Stock: ${drug.stockCount} ${drug.unit} | Unit: $${drug.unitPrice.toFixed(2)}`,
          badge: drug.stockCount <= drug.minimumThreshold ? 'Low Stock' : 'In Stock',
          badgeColor:
            drug.stockCount <= drug.minimumThreshold
              ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
          icon: Package,
          action: () => {
            setAdminActiveTab('inventory');
            saveSearchQuery(drug.name);
            onClose();
          },
        });
      }
    });

    // 9. Appointments
    appointments.forEach((apt) => {
      const matches =
        !q ||
        apt.petName.toLowerCase().includes(q) ||
        apt.ownerName.toLowerCase().includes(q) ||
        apt.type.toLowerCase().includes(q) ||
        apt.reason.toLowerCase().includes(q) ||
        apt.date.toLowerCase().includes(q) ||
        apt.status.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `apt_${apt.id}`,
          category: 'appointment',
          categoryLabel: 'Appointment',
          title: `${apt.type}: ${apt.petName} (${apt.species})`,
          subtitle: `Client: ${apt.ownerName} (${apt.ownerPhone}) • Reason: ${apt.reason}`,
          extraInfo: `${apt.date} at ${apt.time}`,
          badge: apt.status,
          badgeColor:
            apt.status === 'Confirmed'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
              : apt.status === 'Requested'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
          icon: Calendar,
          petId: apt.petId,
          action: () => {
            if (apt.petId) setSelectedPetId(apt.petId);
            setAdminActiveTab('appointments');
            saveSearchQuery(apt.petName);
            onClose();
          },
        });
      }
    });

    // 10. Billing & Invoices
    invoices.forEach((inv) => {
      const matches =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.petName.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q) ||
        inv.items.some((item) => item.description.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `inv_${inv.id}`,
          category: 'billing',
          categoryLabel: 'Billing',
          title: `Invoice #${inv.invoiceNumber} — ${inv.clientName}`,
          subtitle: `Patient: ${inv.petName} • Total: $${(inv.grandTotal ?? inv.total ?? 0).toFixed(2)}`,
          extraInfo: `Date: ${inv.date} • ${inv.paymentMethod || 'Card'}`,
          badge: inv.status,
          badgeColor:
            inv.status === 'Paid'
              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
          icon: CreditCard,
          petId: inv.petId,
          action: () => {
            if (inv.petId) setSelectedPetId(inv.petId);
            setAdminActiveTab('billing');
            saveSearchQuery(inv.invoiceNumber);
            onClose();
          },
        });
      }
    });

    // 11. Surgery Catalog
    initialSurgeries.forEach((surg) => {
      const matches =
        !q ||
        surg.name.toLowerCase().includes(q) ||
        surg.category.toLowerCase().includes(q) ||
        surg.indications.some((ind) => ind.toLowerCase().includes(q));

      if (matches) {
        items.push({
          id: `surg_${surg.id}`,
          category: 'surgery',
          categoryLabel: 'Surgery',
          title: surg.name,
          subtitle: `Category: ${surg.category} • Indications: ${surg.indications.join(', ').slice(0, 80)}`,
          extraInfo: `Applicability: ${surg.speciesApplicability.join(', ')}`,
          badge: surg.category,
          badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300',
          icon: Scissors,
          action: () => {
            setAdminActiveTab('surgery');
            saveSearchQuery(surg.name);
            onClose();
          },
        });
      }
    });

    return items;
  }, [
    query,
    pets,
    consultations,
    labReports,
    imagingRecords,
    ecgRecords,
    vaccinations,
    dewormings,
    prescriptions,
    appointments,
    invoices,
    inventory,
    setAdminActiveTab,
    setSelectedPetId,
    showNotification,
    onClose,
  ]);

  // Filter items by category
  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') return allResults;
    if (activeCategory === 'patients') return allResults.filter((r) => r.category === 'patient');
    if (activeCategory === 'consultations')
      return allResults.filter((r) => r.category === 'consultation' || r.category === 'prescription');
    if (activeCategory === 'diagnostics')
      return allResults.filter((r) => r.category === 'lab' || r.category === 'imaging' || r.category === 'ecg');
    if (activeCategory === 'inventory') return allResults.filter((r) => r.category === 'inventory');
    if (activeCategory === 'appointments') return allResults.filter((r) => r.category === 'appointment');
    if (activeCategory === 'billing') return allResults.filter((r) => r.category === 'billing');
    if (activeCategory === 'modules')
      return allResults.filter((r) => r.category === 'module' || r.category === 'surgery');
    return allResults;
  }, [allResults, activeCategory]);

  // Handle keyboard navigation inside search list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 sm:pt-14 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search patients, consultations, medications, lab tests, appointments, invoices, or modules..."
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-1 rounded-md">
              <span>ESC</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'all', label: 'All Results', count: allResults.length },
            { id: 'patients', label: 'Patients', count: pets.length },
            { id: 'consultations', label: 'Consultations & Rx', count: consultations.length + prescriptions.length },
            { id: 'diagnostics', label: 'Labs & Imaging', count: labReports.length + imagingRecords.length + ecgRecords.length },
            { id: 'inventory', label: 'Pharmacy & Drugs', count: inventory.length },
            { id: 'appointments', label: 'Appointments', count: appointments.length },
            { id: 'billing', label: 'Invoices', count: invoices.length },
            { id: 'modules', label: 'Modules & Surgery', count: ADMIN_NAV_ITEMS.length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as SearchCategory);
                setSelectedIndex(0);
              }}
              className={`shrink-0 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? 'bg-teal-700/80 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Recent Search Queries / Quick Recommendations (if query is empty) */}
        {!query.trim() && recentSearches.length > 0 && (
          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <History className="w-3.5 h-3.5" /> Recent / Popular:
              </span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear history
            </button>
          </div>
        )}

        {/* Results List */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredResults.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No matching records found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any patients, consultations, lab diagnostics, medications, or invoices matching "{query}". Try checking your spelling or using a broader query.
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-teal-100 dark:group-hover:bg-teal-950 group-hover:text-teal-700 dark:group-hover:text-teal-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                              item.badgeColor || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                          • {item.categoryLabel}
                        </span>
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>

                      {item.extraInfo && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">
                          {item.extraInfo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    <span className="text-[11px] font-semibold hidden sm:inline">Open</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">↓</kbd>
              <span className="hidden sm:inline">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">↵</kbd>
              <span className="hidden sm:inline">Select / Open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">ESC</kbd>
              <span className="hidden sm:inline">Close</span>
            </span>
          </div>

          <div className="text-[11px] font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VetPulse Search Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
