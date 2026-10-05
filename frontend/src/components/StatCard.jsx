export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  status = 'default',
  badgeText
}) {
  const statusStyles = {
    default: 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700',
    success: 'border-emerald-500/20 bg-slate-900/50 hover:border-emerald-500/40',
    warning: 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50',
    danger: 'border-red-500/30 bg-red-950/15 hover:border-red-500/50',
  };

  const badgeStyles = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 border backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
        statusStyles[status] || statusStyles.default
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
            <Icon className="w-4 h-4 text-amber-400/90" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded border ${
              trendPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>
        {badgeText && (
          <span
            className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${
              badgeStyles[status] || badgeStyles.default
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
