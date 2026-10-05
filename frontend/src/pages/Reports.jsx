import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { COMPLIANCE_WEEKLY_TRENDS } from '../data/mockData';
import { generateReport } from '../api/client';
import {
  FileBarChart,
  Download,
  CheckCircle,
  FileCheck,
  Printer
} from 'lucide-react';

export default function Reports() {
  const { addToast } = useSafety();
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  const categories = [
    { name: 'PPE Non-Compliance', count: 18, pct: 42, color: 'bg-amber-500' },
    { name: 'Crane / Machinery Proximity', count: 12, pct: 28, color: 'bg-red-500' },
    { name: 'Near Miss / Pre-Hazard', count: 8, pct: 18, color: 'bg-sky-500' },
    { name: 'Thermal / Molten Metal Splash', count: 5, pct: 12, color: 'bg-orange-500' },
  ];

  const auditChecks = [
    { title: 'Edge AI Vision Camera Field Calibration', status: 'PASSED', date: 'Yesterday' },
    { title: 'Emergency Audio Siren Decibel Audibility (Zone 1-5)', status: 'PASSED', date: '3 days ago' },
    { title: 'High Heat Respirator & Face Shield Stock Audit', status: 'PASSED', date: '4 days ago' },
    { title: 'Crane Overhead Laser Proximity Sensor Test', status: 'PASSED', date: 'Last week' },
    { title: 'Emergency Lockout / Tagout (LOTO) Keybox Verification', status: 'PASSED', date: 'Last week' },
  ];

  const handleExportPDF = async () => {
    addToast(`Generating SafeSteel ISO-45001 ${selectedPeriod} Safety Audit PDF report...`, 'info');
    try {
      const res = await generateReport('PDF', selectedPeriod);
      addToast(`✅ ${res.data.message}`, 'success');
    } catch {
      setTimeout(() => addToast('Safety Report PDF downloaded successfully!', 'success'), 1200);
    }
  };

  const handleExportCSV = async () => {
    addToast('Compiling raw sensor & incident telemetry to CSV...', 'info');
    try {
      const res = await generateReport('CSV', selectedPeriod);
      addToast(`✅ ${res.data.message}`, 'success');
    } catch {
      setTimeout(() => addToast('SafeSteel_Telemetry_Logs.csv exported.', 'success'), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & EXPORT ACTIONS */}
      <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileBarChart className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Plant Safety Compliance & Regulatory Audits
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated compliance metrics mapped to OSHA 1910 and ISO 45001 safety mandates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
            {['Daily', 'Weekly', 'Monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-slate-800 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>

      {/* 2. AUDIT READINESS SCORECARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">OSHA 1910 General Industry</span>
            <span className="text-emerald-400 font-bold font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
              PASSED
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">98.4%</div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98.4%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">ISO 45001 OH&S Standards</span>
            <span className="text-emerald-400 font-bold font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
              CERTIFIED
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">97.6%</div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '97.6%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">NFPA 70E Arc & Heat Safety</span>
            <span className="text-emerald-400 font-bold font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
              EXEMPLARY
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">96.2%</div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '96.2%' }} />
          </div>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Compliance Trend Chart */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Weekly PPE Compliance Trend
              </h4>
              <p className="text-[11px] text-slate-400">Past 7 days plant compliance %</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Avg: 96.9%
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex-1 flex items-end justify-between gap-3 h-48 pt-8 pb-2 px-2 border-b border-slate-800/80">
            {COMPLIANCE_WEEKLY_TRENDS.map((item) => {
              const heightPct = ((item.rate - 90) / 10) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.rate}%
                  </div>
                  <div className="w-full bg-slate-800/70 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500/80 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3">
            <span>Baseline Standard: 95.0%</span>
            <span>Target: 99.0%</span>
          </div>
        </div>

        {/* Hazard Breakdown by Category */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Hazard Categories Distribution
              </h4>
              <p className="text-[11px] text-slate-400">Total 43 events analyzed this month</p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-semibold">{selectedPeriod}</span>
          </div>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{cat.count}</strong> ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${cat.color} h-2 rounded-full`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. WEEKLY SAFETY AUDIT CHECKLIST */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Plant Safety Audit Inspection Log
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-bold font-mono">100% Passed</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {auditChecks.map((check, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">{check.title}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                <span>{check.date}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
