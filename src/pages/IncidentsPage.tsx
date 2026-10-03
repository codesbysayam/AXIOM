import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const IncidentsPage: React.FC = () => {
  const { incidents, resolveIncident } = useOperationsStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Containment & Safety
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Incidents & Containment Records
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Operational anomalies, automated circuit breaker trips, and operator remedies
          </p>
        </div>

        <div className="text-xs font-mono text-[#0d6b4f] bg-[#f0faf6] px-3 py-1.5 rounded-[2px] border border-[#c7eadf]">
          Zero Critical Breaches Active
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="axiom-panel p-5 space-y-3 bg-white shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2 border-b border-[#f0eee6] pb-2.5">
              <div className="flex items-center gap-2">
                <StatusBadge status={inc.status} size="sm" />
                <span className="text-[11px] font-mono text-[#718096]">ID: {inc.id}</span>
                <span className="text-[11px] font-mono text-[#718096]">· {inc.detectedAt}</span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] border ${
                  inc.severity === 'critical'
                    ? 'bg-rose-50 text-[#c83e4d] border-rose-200'
                    : 'bg-amber-50 text-[#945f00] border-amber-200'
                }`}
              >
                {inc.severity} Severity
              </span>
            </div>

            <h3 className="text-sm font-serif font-bold text-[#17263d]">{inc.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
                <span className="text-[10px] font-mono uppercase text-[#718096] block mb-0.5 font-semibold">
                  Root Cause Analysis:
                </span>
                <p className="text-[#40516a] leading-relaxed">{inc.rootCause}</p>
              </div>

              <div className="p-3 rounded-[2px] bg-[#f0faf6] border border-[#c7eadf]">
                <span className="text-[10px] font-mono uppercase text-[#0d6b4f] block mb-0.5 font-semibold">
                  Remedy & Mitigation Applied:
                </span>
                <p className="text-[#0d6b4f] leading-relaxed">{inc.remedyAction}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0eee6] flex items-center justify-between text-xs font-mono text-[#718096]">
              <span>Agent Involved: {inc.agentInvolved}</span>
              {inc.status !== 'resolved' ? (
                <button
                  type="button"
                  onClick={() => resolveIncident(inc.id)}
                  className="axiom-btn-success py-1 px-3 text-xs"
                >
                  <CheckCircle2 size={12} />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="text-[#0d6b4f] font-semibold">Remedy Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
