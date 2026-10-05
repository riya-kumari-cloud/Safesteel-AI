import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { MACHINERY_DATA } from '../data/mockData';
import {
  Cpu,
  PowerOff,
  Lock,
  ShieldCheck,
  Thermometer,
  Activity,
  Radar
} from 'lucide-react';

export default function MachineRisk() {
  const { addToast } = useSafety();
  const [machines] = useState(MACHINERY_DATA);
  const [activeTab, setActiveTab] = useState('ALL');
  const [confirmEStopId, setConfirmEStopId] = useState(null);

  const triggerEStop = (machine) => {
    addToast(`EMERGENCY STOP (E-STOP) ACTIVATED: ${machine.name}. Power isolated. Interlocks engaged!`, 'error');
    setConfirmEStopId(null);
  };

  const filteredMachines = machines.filter((m) => {
    if (activeTab === 'CRITICAL') return m.status === 'CRITICAL_MONITOR' || m.status === 'WARNING';
    if (activeTab === 'OPTIMAL') return m.status === 'OPTIMAL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Heavy Machinery Safety Header */}
      <div className="rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Industrial Heavy Equipment & Crane Proximity Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time IoT sensors tracking motor temperature, load vibration, crane swing envelope, and physical interlocks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Status filter tabs */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'CRITICAL', 'OPTIMAL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-800 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => addToast('Lockout/Tagout (LOTO) registry synchronized with maintenance control unit.', 'info')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>LOTO Permits (3)</span>
          </button>
        </div>
      </div>

      {/* Machine Status Cards Grid with Visual Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMachines.map((m) => {
          const isCritical = m.status === 'CRITICAL_MONITOR';
          const isWarning = m.status === 'WARNING';

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 bg-slate-900/60 backdrop-blur-md shadow-xl transition-all ${
                isCritical
                  ? 'border-red-500/40 bg-red-950/10'
                  : isWarning
                  ? 'border-amber-500/35 bg-amber-950/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-400/90">{m.id}</span>
                    <span className="text-xs text-slate-400">• {m.zone}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5 tracking-tight">{m.name}</h4>
                  <span className="text-xs text-slate-400 font-medium">{m.type}</span>
                </div>

                {/* Visual Risk Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isCritical ? 'CRITICAL RISK' : isWarning ? 'WARNING RISK' : 'OPTIMAL'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Next: {m.nextMaintenance}
                  </span>
                </div>
              </div>

              {/* VISUAL METERS SECTION */}
              <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 mb-4">
                {/* 1. Load Utilization Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <span>Hoist / Operational Load:</span>
                      <strong className="text-white">{m.telemetry.currentLoad}</strong>
                    </span>
                    <span className="text-slate-400">
                      Cap: {m.telemetry.ratedCapacity} ({m.telemetry.utilizationPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.telemetry.utilizationPct > 85
                          ? 'bg-amber-500'
                          : m.telemetry.utilizationPct > 95
                          ? 'bg-red-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${m.telemetry.utilizationPct}%` }}
                    />
                  </div>
                </div>

                {/* 2. Temperature & Vibration Barometer Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60 text-xs font-mono">
                  {/* Temp Barometer */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Core Temp</span>
                      </span>
                      <span className={isWarning ? 'text-amber-400 font-bold' : 'text-slate-200 font-semibold'}>
                        {m.telemetry.hoistMotorTemp}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          m.telemetry.hoistMotorTemp.includes('94°C')
                            ? 'bg-amber-500 w-[78%]'
                            : 'bg-emerald-500 w-[55%]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Vibration Barometer */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Vibration</span>
                      </span>
                      <span className={isWarning ? 'text-amber-400 font-bold' : 'text-slate-200 font-semibold'}>
                        {m.telemetry.vibrationMmS.split(' ')[0]} mm/s
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          m.telemetry.vibrationMmS.includes('5.8')
                            ? 'bg-amber-500 w-[82%]'
                            : 'bg-emerald-500 w-[35%]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Proximity Danger Envelope Indicator */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs mb-4 ${
                  isCritical
                    ? 'bg-red-950/25 border-red-500/40 text-red-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Radar className={`w-4 h-4 ${isCritical ? 'text-red-400 animate-spin' : 'text-emerald-400'}`} />
                  <div>
                    <span className="text-[10px] font-mono uppercase block text-slate-400">
                      Radar Proximity Safety Envelope:
                    </span>
                    <span className="font-semibold">{m.telemetry.proximityAlert}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isCritical ? 'BREACH DETECTED' : 'ZONE SECURE'}
                </span>
              </div>

              {/* Controls Footer with Guarded E-STOP */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Physical Interlock Engaged</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => addToast(`Diagnostic telemetry test requested for ${m.name}`, 'info')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    Diagnose
                  </button>

                  {/* Guarded E-Stop Button */}
                  {confirmEStopId === m.id ? (
                    <div className="flex items-center space-x-1.5 animate-in fade-in duration-150">
                      <button
                        onClick={() => triggerEStop(m)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                      >
                        Confirm E-STOP!
                      </button>
                      <button
                        onClick={() => setConfirmEStopId(null)}
                        className="px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmEStopId(m.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600/15 text-red-300 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>E-STOP</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
