import { useSafety } from '../context/useSafety';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useSafety();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-lg shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              isError
                ? 'bg-red-950/90 border-red-500/60 text-red-200'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            <div className="mr-3 mt-0.5 shrink-0">
              {isError ? (
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              ) : isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
