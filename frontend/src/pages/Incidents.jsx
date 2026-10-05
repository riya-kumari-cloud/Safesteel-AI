import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { Search, PlusCircle, X } from 'lucide-react';
import { PLANT_ZONES } from '../data/mockData';

export default function Incidents() {
  const { incidents, resolveIncident, setIsReportModalOpen } = useSafety();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeDossier, setActiveDossier] = useState(null);

  const filteredIncidents = incidents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = selectedZone === 'ALL' || item.zone === selectedZone;
    const matchesSeverity = selectedSeverity === 'ALL' || item.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesZone && matchesSeverity && matchesStatus;
  });

  const underReviewCount = incidents.filter((i) => i.status === 'UNDER_REVIEW').length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* 1. TOP INCIDENT METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Total Logged
          </span>
          <div className="text-2xl font-mono font-black text-white mt-1">{incidents.length}</div>
          <span className="text-[11px] text-slate-400">All shifts this month</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-amber-500/30 bg-amber-950/10 shadow-md">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
            Under Review
          </span>
          <div className="text-2xl font-mono font-black text-amber-400 mt-1">{underReviewCount}</div>
          <span className="text-[11px] text-slate-400">Awaiting supervisor sign-off</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-red-500/30 bg-red-950/10 shadow-md">
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider font-mono">
            Critical Severity
          </span>
          <div className="text-2xl font-mono font-black text-red-400 mt-1">{criticalCount}</div>
          <span className="text-[11px] text-slate-400">Immediate OSHA priority</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 bg-emerald-950/10 shadow-md">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            Resolved & Closed
          </span>
          <div className="text-2xl font-mono font-black text-emerald-400 mt-1">{resolvedCount}</div>
          <span className="text-[11px] text-slate-400">Corrective actions fulfilled</span>
        </div>
      </div>

      {/* 2. FILTER & TOOLBAR */}
      <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident ID, keyword, or reporting officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Zone filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Plant Zones</option>
            {PLANT_ZONES.map((z) => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </select>

          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-sm ml-auto md:ml-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Report Incident</span>
          </button>
        </div>
      </div>

      {/* 3. INCIDENTS DATA TABLE */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800/80 text-[11px]">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Timestamp & Zone</th>
                <th className="p-4">Severity & Category</th>
                <th className="p-4">Observation Narrative</th>
                <th className="p-4">Safety Lead</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    No incident records match your active search filters.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => {
                  const isCritical = incident.severity === 'CRITICAL';
                  const isHigh = incident.severity === 'HIGH';
                  const isResolved = incident.status === 'RESOLVED';

                  return (
                    <tr
                      key={incident.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setActiveDossier(incident)}
                    >
                      <td className="p-4 font-mono font-bold text-amber-400 group-hover:text-amber-300">
                        {incident.id}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-white">{incident.zone}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {incident.date} {incident.time}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded border ${
                              isCritical
                                ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                                : isHigh
                                ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {incident.severity}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium">
                            {incident.category}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 max-w-sm">
                        <div className="font-bold text-slate-100 line-clamp-1">
                          {incident.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">
                          {incident.description}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300 font-medium whitespace-nowrap">
                        {incident.assignedTo}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            isResolved
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isResolved ? 'RESOLVED' : 'UNDER REVIEW'}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {!isResolved ? (
                          <button
                            onClick={() => resolveIncident(incident.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INCIDENT DOSSIER VIEW MODAL */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {activeDossier.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeDossier.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Zone</span>
                <span className="text-white font-bold">{activeDossier.zone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Severity</span>
                <span className="text-amber-400 font-bold">{activeDossier.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Date/Time</span>
                <span className="text-white">{activeDossier.date} {activeDossier.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Reporter</span>
                <span className="text-white truncate">{activeDossier.reportedBy}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 font-mono">
                Hazard Narrative & Surrounding Conditions
              </h4>
              <p className="text-xs text-slate-200 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {activeDossier.description}
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 font-mono">
                Remediation / Corrective Action
              </h4>
              <p className="text-xs text-emerald-300 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20 leading-relaxed">
                {activeDossier.actionTaken || 'No action recorded yet.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Assigned: <strong className="text-slate-200">{activeDossier.assignedTo}</strong>
              </span>

              {activeDossier.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    resolveIncident(activeDossier.id);
                    setActiveDossier(null);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
                >
                  Approve & Resolve Incident
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
