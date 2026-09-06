import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import {
  Package,
  PlusCircle,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  TrendingDown,
  X,
} from 'lucide-react';

export const InventoryAdmin: React.FC = () => {
  const { inventory, updateInventoryStock, showNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [addQty, setAddQty] = useState(50);

  const filteredInventory = inventory.filter((item) => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(term) ||
      (item.batchNumber || '').toLowerCase().includes(term) ||
      (item.supplier || '').toLowerCase().includes(term);
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRestock = (item: InventoryItem) => {
    setSelectedItem(item);
    setAddQty(50);
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateInventoryStock(selectedItem.id, selectedItem.currentStock + addQty);
      setIsRestockModalOpen(false);
      showNotification(`Added ${addQty} units to ${selectedItem.name}`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Pharmacy & Clinic Inventory Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Medicines, vaccines, surgical sutures, fluids, and diagnostic reagents tracking with automated reorder alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock by item name, batch number, or manufacturer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Medicine">Medicines & Pharmaceuticals</option>
            <option value="Vaccine">Vaccines & Biologicals</option>
            <option value="Surgical Consumable">Surgical & Suture Consumables</option>
            <option value="Diagnostics">Lab Reagents & Rapid Kits</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
              <th className="py-3 px-3">Item Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Batch & Expiry</th>
              <th className="py-3 px-3 text-center">Current Stock</th>
              <th className="py-3 px-3 text-right">Unit Price</th>
              <th className="py-3 px-3">Supplier</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInventory.map((item) => {
              const isLowStock = item.currentStock <= item.minStockLevel;
              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    {isLowStock && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                        <AlertTriangle className="w-3 h-3" /> Low Stock Alert (Min: {item.minStockLevel})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div>{item.batchNumber}</div>
                    <span className="text-[10px] text-slate-400 font-sans">Exp: {item.expiryDate}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                        isLowStock
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                    ${(Number(item.unitPrice) || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{item.supplier}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenRestock(item)}
                      className="px-3 py-1 bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold rounded-lg text-xs"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RESTOCK MODAL */}
      {isRestockModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                <span>Restock Inventory Item</span>
              </h3>
              <button onClick={() => setIsRestockModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-4 pt-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Item:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedItem.name}</span>
                <p className="text-slate-500 mt-1">
                  Current Stock: <strong>{selectedItem.currentStock} {selectedItem.unit}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Units to Add ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addQty}
                  onChange={(e) => setAddQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm font-bold text-teal-600"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsRestockModalOpen(false)} className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl shadow-md">
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
