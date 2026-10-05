import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { X, ShieldAlert, Check } from 'lucide-react';
import { PLANT_ZONES } from '../data/mockData';

export default function IncidentModal() {
  const { isReportModalOpen, setIsReportModalOpen, addIncident } = useSafety();

  const [formData, setFormData] = useState({
    title: '',
    zone: PLANT_ZONES[0].name,
    category: 'PPE Non-Compliance',
    severity: 'HIGH',
    description: '',
    actionTaken: '',
    assignedTo: 'Shift Safety Lead',
  });

  if (!isReportModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    addIncident(formData);
    setIsReportModalOpen(false);
    setFormData({
      title: '',
      zone: PLANT_ZONES[0].name,
      category: 'PPE Non-Compliance',
      severity: 'HIGH',
      description: '',
      actionTaken: '',
      assignedTo: 'Shift Safety Lead',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Log Safety Incident or Observation
              </h3>
              <p className="text-[11px] text-slate-400">
                SafeSteel AI Real-Time Shift Hazard Registry
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
              Incident / Observation Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Worker observed without molten face visor near runner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                Plant Sector Zone *
              </label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {PLANT_ZONES.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="CRITICAL">CRITICAL (Immediate Work Stop)</option>
                <option value="HIGH">HIGH (Urgent Review)</option>
                <option value="MEDIUM">MEDIUM (Standard Hazard)</option>
                <option value="LOW">LOW (Advisory / Observation)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                Hazard Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="PPE Non-Compliance">PPE Non-Compliance</option>
                <option value="Machine Proximity">Machine / Crane Proximity</option>
                <option value="Near Miss">Near Miss</option>
                <option value="Thermal / Heat Stress">Thermal / Heat Hazard</option>
                <option value="Chemical / Gas Hazard">Chemical / CO Gas Anomaly</option>
                <option value="Lockout / Tagout (LOTO)">LOTO Protocol Breach</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                Assigned Safety Officer
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
              Detailed Observation Narrative *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe worker actions, equipment in operation, and environmental factors..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
              Immediate Corrective Action
            </label>
            <input
              type="text"
              placeholder="e.g. Worker redirected; compliant face shield issued at safety depot"
              value={formData.actionTaken}
              onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/15 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Submit & Broadcast Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
