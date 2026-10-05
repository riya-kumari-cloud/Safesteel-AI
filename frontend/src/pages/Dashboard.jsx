import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import StatCard from '../components/StatCard';
import {
  Clock,
  Award,
  AlertTriangle,
  Flame,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Volume2,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { PLANT_ZONES, MACHINERY_DATA } from '../data/mockData';

export default function Dashboard() {
  const { stats, alerts, acknowledgeAlert, resolveAlert, setCurrentPage, addToast } = useSafety();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED');

  const displayedAlerts = activeAlerts.filter((a) => {
    if (filterSeverity === 'CRITICAL') return a.severity === 'CRITICAL';
    if (filterSeverity === 'HIGH') return a.severity === 'HIGH' || a.severity === 'CRITICAL';
    return true;
  });

  const criticalMachinery = MACHINERY_DATA.filter(
    (m) => m.status === 'CRITICAL_MONITOR' || m.status === 'WARNING'
  );

  const isPlantConditionSafe = activeAlerts.filter((a) => a.severity === 'CRITICAL').length === 0;

  return (
    <div className="space-y-6">
      {/* 1. PLANT STATUS HERO BANNER (5-Second Scan) */}
      <div
        className={`rounded-2xl p-5 border backdrop-blur-md transition-all shadow-xl ${
          isPlantConditionSafe
            ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-emerald-500/30'
            : 'bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-950 border-red-500/40'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="mt-1 sm:mt-0 relative flex items-center justify-center">
              <span className="flex h-4 w-4">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isPlantConditionSafe ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-4 w-4 ${
                    isPlantConditionSafe ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase font-mono">
                  {isPlantConditionSafe
                    ? 'PLANT STATUS: NORMAL OPERATING ENVELOPE'
                    : `ATTENTION REQUIRED: ${activeAlerts.length} ACTIVE HAZARD ALERTS`}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono border ${
                    isPlantConditionSafe
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}
                >
                  {isPlantConditionSafe ? 'ZERO LTI RECORDED' : 'HAZARD ELEVATED'}
                </span>
              </div>

              {/* 5-second health summary metrics */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
                <span>Shift B • Jamshedpur Works #04</span>
                <span>•</span>
                <span className="text-slate-300">
                  Compliance: <strong className="text-emerald-400">{stats.ppeComplianceRate}%</strong>
                </span>
                <span>•</span>
                <span className="text-slate-300">
                  Vision Feeds: <strong className="text-sky-400">24/24 Online</strong>
                </span>
                <span>•</span>
                <span className="text-slate-300">
                  Risky Machinery: <strong className="text-amber-400">{criticalMachinery.length} Active</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center space-x-2.5 shrink-0 self-end lg:self-center">
            <button
              onClick={() =>
                addToast('Shift safety briefing broadcast queued for plant floor PA speakers.', 'info')
              }
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Floor PA</span>
            </button>

            <button
              onClick={() => setCurrentPage('ppe')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Vision Streams</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY KPI TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Safe Work Hours"
          value={stats.safeWorkHours}
          subtitle="Hours without Lost Time Injury"
          icon={Clock}
          trend="+240 hrs this week"
          trendPositive={true}
          status="success"
          badgeText="ISO 45001"
        />

        <StatCard
          title="Consecutive Safe Days"
          value={stats.safeDaysConsecutive}
          subtitle="Since last reportable incident"
          icon={Award}
          trend="Plant Record: 180d"
          trendPositive={true}
          status="success"
          badgeText="Target: 365d"
        />

        <StatCard
          title="PPE Compliance Rate"
          value={`${stats.ppeComplianceRate}%`}
          subtitle="Head, Eye, Visor & Vest Scan"
          icon={ShieldCheck}
          trend={stats.ppeComplianceDelta}
          trendPositive={true}
          status="success"
          badgeText="Edge Verified"
        />

        <StatCard
          title="Active Live Hazards"
          value={activeAlerts.length}
          subtitle={`${stats.activeCamerasOnline}/${stats.totalCameras} Edge Cameras Online`}
          icon={AlertTriangle}
          trend={activeAlerts.length > 0 ? `${activeAlerts.length} Require Action` : 'Nominal'}
          trendPositive={activeAlerts.length === 0}
          status={activeAlerts.length > 0 ? 'warning' : 'success'}
          badgeText={activeAlerts.length > 0 ? 'Action Req.' : 'Nominal'}
        />
      </div>

      {/* 3. CORE TWO-COLUMN WORKSPACE: Live Alerts Queue & Zone Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Hazard & Violation Queue */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          {/* Header & Filter Controls */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Edge Hazard & Violation Stream
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time alerts flagged by YOLOv11 & thermal vision sensors
                </p>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
              {[
                { id: 'ALL', label: `All (${activeAlerts.length})` },
                { id: 'CRITICAL', label: 'Critical' },
                { id: 'HIGH', label: 'High Priority' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterSeverity(tab.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    filterSeverity === tab.id
                      ? 'bg-slate-800 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="divide-y divide-slate-800/70 max-h-[460px] overflow-y-auto">
            {displayedAlerts.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-90" />
                <h4 className="text-sm font-bold text-white">No Unresolved Hazards in Selected View</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Edge cameras report 100% compliance across active work stations in this filter category.
                </p>
              </div>
            ) : (
              displayedAlerts.map((alert) => {
                const isCritical = alert.severity === 'CRITICAL';
                return (
                  <div
                    key={alert.id}
                    className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            isCritical
                              ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-xs font-semibold text-slate-200">
                          {alert.type}
                        </span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {alert.timestamp}
                        </span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-xs text-amber-400/90 font-mono">
                          {alert.zone}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-mono pt-1">
                        <span>Personnel: <strong className="text-slate-300">{alert.workerId}</strong></span>
                        <span>Confidence: <strong className="text-emerald-400">{alert.confidence}</strong></span>
                        <span>Feed: <strong className="text-slate-300">{alert.camera}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Plant Zones Risk Monitor */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Zone Risk Status
                </h3>
                <p className="text-[11px] text-slate-400">
                  5 Active Steel Production Sectors
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Real-Time</span>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {PLANT_ZONES.map((zone) => {
              const isHigh = zone.riskLevel === 'HIGH';
              const isMedium = zone.riskLevel === 'MEDIUM';

              return (
                <div
                  key={zone.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{zone.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isHigh
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : isMedium
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {zone.riskLevel} RISK
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{zone.activeWorkers} Personnel</span>
                    </span>
                    <span className="text-amber-400 font-semibold">{zone.temp}</span>
                  </div>

                  {/* Compliance Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>PPE Compliance</span>
                      <span className="font-bold text-slate-200">{zone.compliance}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          zone.compliance >= 98
                            ? 'bg-emerald-500'
                            : zone.compliance >= 95
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${zone.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-center">
            <button
              onClick={() => setCurrentPage('incidents')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>View Full Incident Records</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MACHINERY RISK SNAPSHOT STRIP (Addresses: "Which machines are risky?") */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Critical Heavy Equipment Risk Watchlist
            </h3>
          </div>
          <button
            onClick={() => setCurrentPage('machine-risk')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Telemetry Monitor</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MACHINERY_DATA.slice(0, 3).map((m) => {
            const isAlert = m.status === 'CRITICAL_MONITOR' || m.status === 'WARNING';
            return (
              <div
                key={m.id}
                onClick={() => setCurrentPage('machine-risk')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-300">{m.id}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        m.status === 'CRITICAL_MONITOR'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : m.status === 'WARNING'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {m.status === 'CRITICAL_MONITOR' ? 'PROXIMITY RISK' : m.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">{m.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-mono">
                    {m.telemetry.proximityAlert}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                  <span>Load: {m.telemetry.currentLoad}</span>
                  <span className={isAlert ? 'text-amber-400' : 'text-slate-300'}>
                    Temp: {m.telemetry.hoistMotorTemp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
