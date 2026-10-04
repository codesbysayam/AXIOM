import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const IncidentsPage: React.FC = () => {
  const { incidents, resolveIncident } = useOperationsStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D1C7] pb-4">
        <div>
          <span className="eyebrow block">
            Containment & Safety
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Incidents & Containment Records
          </h1>
          <p className="text-sm font-sans text-[#52647B] mt-1">
            Operational anomalies, automated circuit breaker trips, and operator remedies.
          </p>
        </div>

        <div className="text-xs font-sans font-medium text-[#00866B] bg-[#E8F5F0] px-3 py-1.5 rounded-[4px] border border-[#A8DCCE]">
          Zero Critical Breaches Active
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="axiom-panel p-5 space-y-3 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[6px] shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2 border-b border-[#D5D1C7]/60 pb-2.5">
              <div className="flex items-center gap-2">
                <StatusBadge status={inc.status} size="sm" />
                <span className="text-[11px] font-mono text-[#52647B]">ID: {inc.id}</span>
                <span className="text-[11px] font-mono text-[#52647B]">· {inc.detectedAt}</span>
              </div>
              <span
                className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-[3px] border ${
                  inc.severity === 'critical'
                    ? 'bg-rose-50 text-[#C93645] border-rose-200'
                    : 'bg-amber-50 text-[#B97800] border-amber-200'
                }`}
              >
                {inc.severity} Severity
              </span>
            </div>

            <h3 className="card-title text-base font-sans font-semibold text-[#17263A]">{inc.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-[4px] bg-[#FAF9F5] border border-[#D5D1C7]">
                <span className="text-[10px] font-sans uppercase text-[#52647B] block mb-1 font-semibold tracking-wider">
                  Root Cause Analysis:
                </span>
                <p className="text-[#40516A] leading-relaxed font-sans">{inc.rootCause}</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-[#E8F5F0]/60 border border-[#A8DCCE]">
                <span className="text-[10px] font-sans uppercase text-[#007A61] block mb-1 font-semibold tracking-wider">
                  Remedy & Mitigation Applied:
                </span>
                <p className="text-[#007A61] leading-relaxed font-sans">{inc.remedyAction}</p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#D5D1C7]/50 flex items-center justify-between text-xs font-sans text-[#52647B]">
              <span>Agent Involved: <strong className="text-[#17263A] font-semibold">{inc.agentInvolved}</strong></span>
              {inc.status !== 'resolved' ? (
                <button
                  type="button"
                  onClick={() => resolveIncident(inc.id)}
                  className="axiom-btn-primary py-1 px-3 text-xs h-[32px]"
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
