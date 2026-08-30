import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Award,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

const COLORS = ['#0d9488', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

export const ReportsAnalytics: React.FC = () => {
  const { pets, appointments, invoices, consultations, showNotification } = useApp();
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  // Species breakdown data
  const speciesCounts = pets.reduce((acc: Record<string, number>, pet) => {
    acc[pet.species] = (acc[pet.species] || 0) + 1;
    return acc;
  }, {});

  const speciesPieData = Object.keys(speciesCounts).map((sp) => ({
    name: sp.split(' ')[0],
    value: speciesCounts[sp],
  }));

  // Monthly Revenue & Patient Volume Data
  const monthlyRevenueData = [
    { month: 'Mar', revenue: 4200, patients: 38, surgeries: 6 },
    { month: 'Apr', revenue: 5100, patients: 45, surgeries: 8 },
    { month: 'May', revenue: 5800, patients: 52, surgeries: 11 },
    { month: 'Jun', revenue: 6400, patients: 61, surgeries: 9 },
    { month: 'Jul', revenue: 7200, patients: 68, surgeries: 14 },
    { month: 'Aug', revenue: 8450, patients: 74, surgeries: 16 },
  ];

  // Clinical Disease Trends
  const diseaseTrendsData = [
    { disease: 'Gastroenteritis', cases: 28 },
    { disease: 'Skin / Dermatitis', cases: 24 },
    { disease: 'Vaccination / Wellness', cases: 46 },
    { disease: 'Orthopedic / Fractures', cases: 14 },
    { disease: 'Dental Disease', cases: 18 },
    { disease: 'Respiratory / Asthma', cases: 11 },
  ];

  const handleExportCSV = () => {
    showNotification('Exported clinical intelligence analytics summary (CSV)!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Veterinary Clinical Intelligence & Practice Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Practice revenue, epidemiological disease trends, patient species demographics & surgical volume.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-4 h-4 text-teal-600" />
          <span>Export Practice Data (CSV)</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Active Patients</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pets.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold">+18% this month</span>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Monthly Practice Revenue</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">$8,450.00</div>
          <span className="text-[10px] text-emerald-600 font-bold">+14.2% vs prev month</span>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Consultations Completed</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{consultations.length}</div>
          <span className="text-[10px] text-teal-600 font-bold">100% electronic health logged</span>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Scheduled Appointments</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{appointments.length}</div>
          <span className="text-[10px] text-blue-600 font-bold">Zero wait-time triage</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue & Patient Flow Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Monthly Clinical Revenue & Patient Inflow</span>
              </h3>
              <p className="text-[11px] text-slate-400">Revenue in USD ($) vs Total Patients Handled</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#0d9488" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="patients" name="Patients Handled" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Demographics Pie */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <span>Species Demographics</span>
            </h3>
            <p className="text-[11px] text-slate-400">Distribution of registered veterinary patients</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {speciesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disease Incidence Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>Clinical Pathology & Disease Morbidity Trends</span>
          </h3>
          <p className="text-[11px] text-slate-400">Most frequent clinical presentations and diagnostic categories</p>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diseaseTrendsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="disease" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="cases" name="Cases Diagnosed" fill="#0d9488" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
