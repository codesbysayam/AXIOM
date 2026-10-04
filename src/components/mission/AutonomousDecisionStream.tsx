import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  Fingerprint,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { AxiomEvent, useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export interface AutonomousDecisionStreamProps {
  onInspectEvent?: (event: AxiomEvent) => void;
  maxItems?: number;
}

export const AutonomousDecisionStream: React.FC<AutonomousDecisionStreamProps> = ({
  onInspectEvent,
  maxItems = 10,
}) => {
  const { events, inspectEvent } = useAxiomEventBus();

  const handleInspect = (event: AxiomEvent) => {
    inspectEvent(event);
    if (onInspectEvent) {
      onInspectEvent(event);
    }
  };

  const getDecisionBadge = (decision?: string, type?: string) => {
    if (type === 'INCIDENT_CREATED') {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#FDF0ED] text-[#D72F40] border border-[#F5C2B8]">
          ⚠ SEV INCIDENT
        </span>
      );
    }
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#E6F7F2] text-[#08795F] border border-[#C3E6DB]">
            ✓ ALLOW / PASS
          </span>
        );
      case 'HUMAN_GATE':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#FEF3D6] text-[#8A5900] border border-[#F9E2A8]">
            ● HUMAN GATE REQUIRED
          </span>
        );
      case 'WARN':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#FEF3D6] text-[#8A5900] border border-[#F9E2A8]">
            ⚠ POLICY WARNING
          </span>
        );
      case 'BLOCK':
      case 'RECOVER':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#FDF0ED] text-[#D72F40] border border-[#F5C2B8]">
            ✕ BLOCKED / ROLLBACK
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#F0F2F5] text-[#40516A] border border-[#D5D5CE]">
            ORCHESTRATED
          </span>
        );
    }
  };

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Activity size={14} className="text-[#08795F]" />
          <div>
            <span className="eyebrow block">Real-Time Autonomous Decisions</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Live Decision Stream & Evidence Receipts
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#5E6975]">
          Live Bus: <span className="text-[#08795F] font-semibold">{events.length}</span> recorded
        </span>
      </div>

      {/* Decision Cards List */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[520px]">
        {events.slice(0, maxItems).map((evt) => {
          const payload = evt.payload || {};
          return (
            <div
              key={evt.id}
              className="p-3.5 bg-white border border-[#D5D5CE] hover:border-[#182536] rounded-[4px] shadow-2xs transition-all space-y-2.5 group"
            >
              {/* Card Top: Timestamp + Category + Decision Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#5E6975]">{evt.timestamp}</span>
                  <span className="text-[#D5D5CE]">·</span>
                  <span className="text-[10px] font-mono uppercase font-semibold text-[#3569A8]">
                    {evt.category}
                  </span>
                  {evt.executionId && (
                    <span className="text-[10px] font-mono text-[#5E6975]">
                      [{evt.executionId}]
                    </span>
                  )}
                </div>
                {getDecisionBadge(payload.decision, evt.type)}
              </div>

              {/* Title & Summary */}
              <div>
                <h4 className="text-sm font-sans font-semibold text-[#182536]">
                  {evt.label}
                </h4>
                <p className="text-xs font-sans text-[#52647B] mt-0.5 leading-relaxed">
                  {evt.summary}
                </p>
              </div>

              {/* Observed vs Threshold Metrics (If Policy or Agent) */}
              {(payload.observedValue || payload.threshold || payload.riskScore !== undefined) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-[#FAF9F5] rounded-[3px] border border-[#E5E3DB] text-[11px] font-mono">
                  {payload.observedValue && (
                    <div>
                      <span className="text-[#5E6975] block text-[9px] uppercase">Observed</span>
                      <span className="font-semibold text-[#182536]">{payload.observedValue}</span>
                    </div>
                  )}
                  {payload.threshold && (
                    <div>
                      <span className="text-[#5E6975] block text-[9px] uppercase">Threshold</span>
                      <span className="text-[#5E6975]">{payload.threshold}</span>
                    </div>
                  )}
                  {payload.riskScore !== undefined && (
                    <div>
                      <span className="text-[#5E6975] block text-[9px] uppercase">Risk Score</span>
                      <span
                        className={`font-semibold ${
                          payload.riskScore > 0.5 ? 'text-[#D72F40]' : 'text-[#08795F]'
                        }`}
                      >
                        {payload.riskScore.toFixed(2)} / 1.00
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer: Cryptographic Evidence & Action */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F0EEE6] text-[10px] font-mono text-[#5E6975]">
                <div className="flex items-center gap-1.5 truncate max-w-xs">
                  <Fingerprint size={12} className="text-[#3569A8] flex-shrink-0" />
                  <span className="truncate">
                    Proof: {payload.evidenceHash || payload.rollbackToken || '0x8849...21a0'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleInspect(evt)}
                  className="inline-flex items-center gap-1 text-[#3569A8] hover:text-[#182536] font-semibold hover:underline cursor-pointer"
                >
                  <span>Inspect Trace</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
