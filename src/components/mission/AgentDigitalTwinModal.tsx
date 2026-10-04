import React from 'react';
import {
  Activity,
  AlertOctagon,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../../data/agentsAndSkills';
import { AgentInfo } from '../../types';

export interface AgentDigitalTwinModalProps {
  agentId: string | null;
  onClose: () => void;
  onSimulateOutage?: (agentId: string) => void;
}

export const AgentDigitalTwinModal: React.FC<AgentDigitalTwinModalProps> = ({
  agentId,
  onClose,
  onSimulateOutage,
}) => {
  if (!agentId) return null;

  const agent: AgentInfo | undefined =
    AGENT_WORKFORCE.find((a) => a.id === agentId || a.name.toLowerCase().includes(agentId.toLowerCase())) ||
    AGENT_WORKFORCE[3]; // Default to Task Executor

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="twin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#182536]/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#FFFDF8] border border-[#D5D5CE] shadow-2xl rounded-[6px] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D5D5CE] bg-[#F7F5EE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#182536] flex items-center justify-center text-white">
              <Cpu size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="eyebrow">Digital Twin Specification</span>
                <span className="text-[10px] font-mono text-[#08795F] bg-[#E6F7F2] px-1.5 py-0.2 rounded-[2px] font-semibold">
                  ● ACTIVE TWIN
                </span>
              </div>
              <h3 id="twin-title" className="text-lg font-serif font-semibold text-[#182536]">
                {agent.name} <span className="text-xs font-mono text-[#5E6975]">v{agent.version}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSimulateOutage && (
              <button
                type="button"
                onClick={() => onSimulateOutage(agent.id)}
                className="px-2.5 py-1 text-xs font-semibold bg-[#FDF0ED] text-[#D72F40] border border-[#F5C2B8] hover:bg-[#FCE6E2] rounded-[3px] transition-colors inline-flex items-center gap-1"
              >
                <AlertOctagon size={12} />
                <span>Simulate Outage</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#5E6975] hover:text-[#182536] rounded-[3px]"
              aria-label="Close digital twin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Real-time Telemetry & Heartbeat Pulse */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px]">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Operating Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#08795F] animate-ping" />
                <span className="text-xs font-sans font-bold text-[#08795F] uppercase">
                  {agent.status}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px]">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Median Latency</span>
              <span className="text-base font-mono font-bold text-[#182536] block mt-0.5">
                {agent.latencyMs}<span className="text-xs font-normal text-[#5E6975]">ms</span>
              </span>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px]">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Success Ratio</span>
              <span className="text-base font-mono font-bold text-[#08795F] block mt-0.5">
                {agent.successRate}%
              </span>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px]">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Executed Tasks</span>
              <span className="text-base font-mono font-bold text-[#182536] block mt-0.5">
                {agent.completedTasks.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Current Mission & Live Invariant Envelope */}
          <div className="p-4 rounded-[4px] bg-[#F7F5EE] border border-[#E5E3DB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Active Mission & Parameter Envelope</span>
              <span className="text-[10px] font-mono text-[#3569A8] font-semibold">RUN #AX-93821</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[#5E6975] text-[10px]">MISSION DIRECTIVE:</div>
                <div className="text-[#182536] font-semibold">
                  Vendor Disbursement Audit & Idempotent API Dispatch
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[#5E6975] text-[10px]">INPUT PAYLOAD:</div>
                <div className="text-[#182536]">
                  Northwind Corp PO-88219 ($18,420.00 USD)
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[#5E6975] text-[10px]">EVALUATED RISK VECTOR:</div>
                <div className="text-[#8A5900] font-semibold">0.81 (Elevated Risk - High Value Outlay)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[#5E6975] text-[10px]">POLICY GOVERNOR:</div>
                <div className="text-[#08795F] font-semibold">FIN-042 (Human Gate Route Enforced)</div>
              </div>
            </div>
          </div>

          {/* Hard Invariants */}
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#5E6975] tracking-wider block mb-2">
              Bound Mathematical Invariants
            </span>
            <div className="space-y-1.5">
              {agent.invariants.map((inv, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-white border border-[#D5D5CE] rounded-[3px] text-xs font-sans text-[#182536]"
                >
                  <ShieldCheck size={14} className="text-[#08795F] mt-0.5 flex-shrink-0" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Skills & Execution Grants */}
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#5E6975] tracking-wider block mb-2">
              Assigned Skills & Capability Grants
            </span>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[3px] text-xs font-sans text-[#182536]"
                >
                  <Zap size={12} className="text-[#3569A8]" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#D5D5CE] bg-[#F7F5EE]">
          <span className="text-[11px] font-mono text-[#5E6975]">
            Cryptographic Node ID: {agent.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="axiom-btn-secondary py-1 px-3 text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
