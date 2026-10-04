import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export const LiveIncidentOverlay: React.FC = () => {
  const {
    activeIncidentSeverity,
    incidentDegradedNodes,
    resolveIncidentOverlay,
    triggerIncidentOverlay,
  } = useAxiomEventBus();

  if (!activeIncidentSeverity) {
    return (
      <div className="p-3 bg-[#F0FAF6] border border-[#C3E6DB] rounded-[4px] flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2 text-[#08795F] font-medium">
          <CheckCircle2 size={15} />
          <span>All fleet autonomous nodes nominal. Zero active operational incidents.</span>
        </div>
        <button
          type="button"
          onClick={() => triggerIncidentOverlay('SEV-2', ['policy-engine', 'task-executor'])}
          className="text-xs font-mono text-[#5E6975] hover:text-[#182536] hover:underline"
        >
          [Simulate SEV-2 Incident]
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#FFF5F5] border border-[#F5C2B8] rounded-[4px] space-y-3 animate-fade-in shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D72F40] animate-ping" />
          <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] bg-[#D72F40] text-white">
            {activeIncidentSeverity} INCIDENT ACTIVE
          </span>
          <span className="text-xs font-sans font-semibold text-[#182536]">
            Policy Engine Signature Latency Spiked Above SLO Threshold
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resolveIncidentOverlay}
            className="px-3 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-xs font-semibold rounded-[3px] transition-colors inline-flex items-center gap-1"
          >
            <CheckCircle2 size={12} />
            <span>Engage Standby Policy Engine & Resolve</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#5E6975] bg-white p-2.5 rounded-[3px] border border-[#F5C2B8]">
        <div>
          <span className="text-[9px] uppercase block">Degraded Nodes:</span>
          <span className="font-semibold text-[#D72F40]">
            {incidentDegradedNodes.join(', ') || 'policy-engine'}
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase block">Recovery Action:</span>
          <span className="font-semibold text-[#182536]">
            Routing to hot-standby fallback replica
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase block">Data Integrity Impact:</span>
          <span className="font-semibold text-[#08795F]">0% (Zero loss; Invariants held)</span>
        </div>
      </div>
    </div>
  );
};
