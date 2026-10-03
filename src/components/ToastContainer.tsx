import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useOperationsStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200 bg-white text-slate-800';
        let Icon = Info;
        let iconColor = 'text-blue-600';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 bg-amber-50/95 text-amber-950';
          Icon = AlertCircle;
          iconColor = 'text-amber-600';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200 bg-rose-50/95 text-rose-950';
          Icon = XCircle;
          iconColor = 'text-rose-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${borderClass}`}
            role="status"
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold tracking-tight">{toast.title}</div>
              <div className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
