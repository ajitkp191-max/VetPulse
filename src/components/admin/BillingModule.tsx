import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem } from '../../types';
import {
  CreditCard,
  PlusCircle,
  Printer,
  Trash2,
  Building,
  CheckCircle2,
  DollarSign,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { SpeciesBadge } from '../common/AnimalIllustration';

export const BillingModule: React.FC = () => {
  const {
    pets,
    selectedPetId,
    setSelectedPetId,
    invoices,
    addInvoice,
    adminProfile,
    showNotification,
  } = useApp();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[0]?.id || '');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  // New Invoice State
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Comprehensive Clinical Consultation & Physical Exam', category: 'Consultation', quantity: 1, unitPrice: 50.0, total: 50.0 },
    { description: 'Complete Blood Count (CBC) & Serum Biochemistry Panel', category: 'Laboratory', quantity: 1, unitPrice: 75.0, total: 75.0 },
    { description: 'Rabies Multi-Strain Vaccine (Rabisin)', category: 'Vaccine', quantity: 1, unitPrice: 35.0, total: 35.0 },
    { description: 'Cerenia Antiemetic & Probiotics Rx', category: 'Pharmacy', quantity: 1, unitPrice: 42.0, total: 42.0 },
  ]);

  const [discount, setDiscount] = useState(10.0);
  const [taxPercent, setTaxPercent] = useState(8.0);
  const [paymentMode, setPaymentMode] = useState<Invoice['paymentMethod']>('Credit Card');

  const activeInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      { description: '', category: 'Consultation', quantity: 1, unitPrice: 20.0, total: 20.0 },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemRow = (index: number, field: keyof InvoiceItem, val: any) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = (parseFloat(updated.quantity as any) || 0) * (parseFloat(updated.unitPrice as any) || 0);
        }
        return updated;
      })
    );
  };

  const calculateSubtotal = () => items.reduce((acc, curr) => acc + curr.total, 0);
  const calculateTax = () => ((calculateSubtotal() - discount) * taxPercent) / 100;
  const calculateTotal = () => Math.max(0, calculateSubtotal() - discount + calculateTax());

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !items[0].description) {
      showNotification('Please add at least one line item', 'error');
      return;
    }

    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const grandTotal = calculateTotal();
    const invNum = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const saved = addInvoice({
      invoiceNumber: invNum,
      petId: selectedPet.id,
      petName: selectedPet.name,
      species: selectedPet.species,
      ownerName: selectedPet.ownerName,
      ownerPhone: selectedPet.ownerPhone,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod: paymentMode,
      paymentStatus: 'Paid',
    });

    setSelectedInvoiceId(saved.id);
    setIsNewInvoiceModalOpen(false);
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
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Billing, Point of Sale & Tax Invoicing
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Itemized charges for exams, surgeries, imaging, hospital care, pharmacy & tax compliance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Generate Tax Invoice</span>
        </button>
      </div>

      {/* Grid: Invoice List & Printable Invoice View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Invoices */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Billing Records ({invoices.length})
          </h4>
          {invoices.map((inv) => {
            const isSelected = inv.id === activeInvoice?.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoiceId(inv.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {inv.petName} ({inv.ownerName})
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">#{inv.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300">
                    ${inv.total.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {inv.paymentStatus} • {inv.paymentMethod}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Printable Invoice */}
        {activeInvoice && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 print-container">
            {/* Clinic Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-teal-600">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-600 text-white rounded-2xl">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {adminProfile.clinicName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{adminProfile.clinicAddress}</p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300">
                    Phone: {adminProfile.contactNumber} | GST/Tax ID: VET-TX-98421
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-wider block">
                  TAX INVOICE
                </span>
                <span className="text-xs font-mono text-teal-600 font-bold">#{activeInvoice.invoiceNumber}</span>
                <p className="text-[11px] text-slate-500 mt-1">Date: {activeInvoice.date}</p>
              </div>
            </div>

            {/* Print Action Bar */}
            <div className="flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment:</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {activeInvoice.paymentMethod} (PAID)
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>

            {/* Billed To Meta */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Pet Parent:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeInvoice.ownerName}</div>
                <span className="text-[10px] text-slate-500">{activeInvoice.ownerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400">Patient:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeInvoice.petName}</div>
                <span className="text-[10px] text-slate-500">{activeInvoice.species}</span>
              </div>
              <div>
                <span className="text-slate-400">Attending Clinician:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{adminProfile.name}</div>
                <span className="text-[10px] text-teal-600">Reg: {adminProfile.registrationNumber}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Service / Product Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeInvoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${activeInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Discount:</span>
                  <span className="font-semibold text-emerald-600">-${activeInvoice.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sales Tax / GST:</span>
                  <span className="font-semibold">${activeInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total:</span>
                  <span className="text-teal-700 dark:text-teal-300 text-base">
                    ${activeInvoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <p>Thank you for trusting {adminProfile.clinicName} with your beloved companion!</p>
              <p className="font-mono">Computer Generated Official Receipt</p>
            </div>
          </div>
        )}
      </div>

      {/* CREATE INVOICE MODAL */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>Create New Veterinary Tax Invoice</span>
              </h3>
              <button onClick={() => setIsNewInvoiceModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 pt-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species} • {p.ownerName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI / QR Code">UPI / Instant QR</option>
                    <option value="Pet Insurance">Pet Health Insurance</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Items Table Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold uppercase text-slate-700 dark:text-slate-300">Billable Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-teal-600 font-bold text-xs flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Service / Medication Description"
                        value={item.description}
                        onChange={(e) => handleUpdateItemRow(idx, 'description', e.target.value)}
                        className="flex-1 w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItemRow(idx, 'category', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 w-full sm:w-32"
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Imaging">Imaging</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Vaccine">Vaccine</option>
                        <option value="Hospitalization">Hospital</option>
                      </select>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemRow(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItemRow(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-right font-semibold"
                        />
                        <span className="w-20 text-right font-bold text-slate-900 dark:text-white">
                          ${item.total.toFixed(2)}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discounts & Tax */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Discount ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Tax (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-end text-right">
                  <span className="text-xs text-slate-400">Total Payable:</span>
                  <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewInvoiceModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Issue Invoice & Collect Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
