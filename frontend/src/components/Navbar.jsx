import { useState } from 'react';
import { useSafety } from '../context/useSafety';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  PlusCircle,
  Zap,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function Navbar({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const {
    currentPage,
    alerts,
    acknowledgeAlert,
    triggerSimulatedAlert,
    setIsReportModalOpen
  } = useSafety();

  const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  const pageMeta = {
    dashboard: {
      category: 'Overview',
      title: 'Plant Safety Dashboard',
      subtitle: 'Real-time hazard monitoring, safety scores & zone risk telemetry'
    },
    ppe: {
      category: 'AI Vision',
      title: 'PPE Compliance & Edge Vision',
      subtitle: 'Multi-stream computer vision, bounding-box overlays & violation logging'
    },
    incidents: {
      category: 'Safety Management',
      title: 'Incident & Observation Logs',
      subtitle: 'OSHA / ISO 45001 compliance logs, investigation dossiers & corrective actions'
    },
    'machine-risk': {
      category: 'Telemetry',
      title: 'Heavy Equipment & Crane Safety',
      subtitle: 'Collision exclusion radii, hoist load analysis & emergency interlocks'
    },
    'ai-assistant': {
      category: 'Intelligence',
      title: 'SafeSteel Safety Copilot',
      subtitle: 'Enterprise AI knowledge engine trained on OSHA 1910 and steelmaking SOPs'
    },
    reports: {
      category: 'Audits',
      title: 'Compliance Reports & Audits',
      subtitle: '7-day compliance curves, violation categorization & audit certification'
    },
    settings: {
      category: 'System',
      title: 'Plant & Inference Settings',
      subtitle: 'Edge sensor thresholds, exclusion distances & emergency dispatch channels'
    },
  };

  const current = pageMeta[currentPage] || {
    category: 'System',
    title: 'SafeSteel AI',
    subtitle: 'Industrial Safety Platform'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                {current.category}
              </span>
              <span className="text-slate-400 text-xs">/</span>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {current.title}
              </h1>
              <span className="hidden md:inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions & Officer Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Secondary Action: Demo Alert Trigger */}
          <button
            onClick={triggerSimulatedAlert}
            title="Inject a realistic real-time AI hazard detection for testing"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
            <span>Simulate AI Alert</span>
          </button>

          {/* Primary Action: Log Incident */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Incident</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAlertMenuOpen(!isAlertMenuOpen)}
              className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="View live alerts"
            >
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#090e17]">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {isAlertMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Active Plant Alerts ({activeAlerts.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAlertMenuOpen(false)}
                    className="text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/70">
                  {activeAlerts.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      All plant sectors report normal compliance.
                    </div>
                  ) : (
                    activeAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {alert.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-100 mt-1">
                          {alert.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[11px]">
                          <span className="text-slate-400 font-mono text-[10px]">
                            {alert.zone}
                          </span>
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center space-x-2.5 pl-2.5 border-l border-slate-800/80">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-slate-200">{user?.name || 'A. Mehta'}</div>
              <div className="text-[10px] text-slate-400 font-mono">{user?.role || 'Chief Safety Officer'}</div>
            </div>
            <button
              onClick={logout}
              className="ml-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] text-slate-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
