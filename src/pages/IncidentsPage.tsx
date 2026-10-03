import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const IncidentsPage: React.FC = () => {
  const { incidents, resolveIncident } = useOperationsStore();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Incidents & Containment Records
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Operational anomalies, automated circuit breaker trips, and operator remedies
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200">
          Zero Critical Breaches Active
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={inc.status} size="sm" />
                <span className="text-[11px] font-mono text-slate-400">ID: {inc.id}</span>
                <span className="text-[11px] font-mono text-slate-400">· {inc.detectedAt}</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  inc.severity === 'critical'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {inc.severity} Severity
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-900">{inc.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                  Root Cause Analysis:
                </span>
                <p className="text-slate-700 leading-relaxed">{inc.rootCause}</p>
              </div>

              <div className="p-3 rounded bg-emerald-50/50 border border-emerald-200/60">
                <span className="text-[10px] font-mono uppercase text-emerald-800 block mb-0.5">
                  Remedy & Mitigation Applied:
                </span>
                <p className="text-slate-800 leading-relaxed">{inc.remedyAction}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Agent Involved: {inc.agentInvolved}</span>
              {inc.status !== 'resolved' ? (
                <button
                  type="button"
                  onClick={() => resolveIncident(inc.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans text-xs font-medium"
                >
                  Mark Resolved
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold">Remedy Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
