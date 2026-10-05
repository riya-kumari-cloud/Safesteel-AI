import { useSafety } from '../context/useSafety';
import {
  ShieldAlert,
  LayoutDashboard,
  Eye,
  AlertOctagon,
  Cpu,
  BotMessageSquare,
  FileBarChart,
  Settings,
  Flame,
  X,
  Radio
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { currentPage, setCurrentPage, alerts } = useSafety();

  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hint: 'Executive plant safety overview'
    },
    {
      id: 'ppe',
      label: 'PPE Detection',
      icon: Eye,
      badge: 'Edge AI',
      badgeColor: 'sky',
      hint: 'Multi-camera computer vision'
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertOctagon,
      alertCount: activeAlertsCount,
      hint: 'Active hazards & audit logs'
    },
    {
      id: 'machine-risk',
      label: 'Machine Risk',
      icon: Cpu,
      badge: 'IoT Live',
      badgeColor: 'emerald',
      hint: 'Crane & machinery telemetry'
    },
    {
      id: 'ai-assistant',
      label: 'AI Copilot',
      icon: BotMessageSquare,
      badge: 'OSHA AI',
      badgeColor: 'violet',
      hint: 'Safety regulations assistant'
    },
    {
      id: 'reports',
      label: 'Reports & Audits',
      icon: FileBarChart,
      hint: 'Compliance analytics & exports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      hint: 'Plant parameters & thresholds'
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#090e17] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex items-center justify-center shadow-md shadow-amber-500/10 border border-amber-400/30">
              <ShieldAlert className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-[15px] tracking-wider text-white">
                  SAFESTEEL
                </span>
                <span className="text-[10px] px-1.5 py-0.2 font-bold uppercase rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Enterprise Safety OS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Facility Banner */}
        <div className="px-3.5 py-2.5 mx-3 mt-3.5 rounded-lg bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-[11px] font-semibold text-slate-200 block truncate">
                Jamshedpur Mill #04
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Furnace & Hot Rolling
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 font-mono">
            Shift B
          </span>
        </div>

        {/* Navigation List */}
        <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (onClose) onClose();
                }}
                title={item.hint}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border-l-2 border-l-amber-500 shadow-sm border-y border-r border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-amber-400'
                        : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        item.badgeColor === 'sky'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.alertCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                      {item.alertCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Engine Status Card */}
        <div className="p-3 m-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400 font-medium flex items-center space-x-1.5">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Edge Vision Grid</span>
            </span>
            <span className="text-emerald-400 font-bold text-[10px] font-mono">
              99.8% Online
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[99.8%]" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
            <span>24/24 Nodes</span>
            <span>18ms Latency</span>
          </div>
        </div>
      </aside>
    </>
  );
}
