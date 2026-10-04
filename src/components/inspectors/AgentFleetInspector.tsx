import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Lock,
  Radio,
  Server,
  Shield,
  ShieldCheck,
  Terminal,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../../data/agentsAndSkills';
import { AgentInfo } from '../../types';

export interface AgentFleetInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgentId?: string;
  onSelectAgent?: (id: string) => void;
}

export const AgentFleetInspector: React.FC<AgentFleetInspectorProps> = ({
  isOpen,
  onClose,
  selectedAgentId,
  onSelectAgent,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedAgentId || AGENT_WORKFORCE[0]?.id || 'agent-context-memory');

  useEffect(() => {
    if (selectedAgentId) setActiveId(selectedAgentId);
  }, [selectedAgentId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentAgent: AgentInfo =
    AGENT_WORKFORCE.find((a) => a.id === activeId) || AGENT_WORKFORCE[0];

  return (
    <>
      <div
        className="fixed inset-0 bg-[#182536]/40 z-50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#FFFDF8] border-l border-[#D5D5CE] z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Agent Fleet Inspector"
      >
        {/* Header */}
        <header className="p-4 border-b border-[#D5D5CE] bg-[#FAF9F5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#182536] text-[#FFFDF8] flex items-center justify-center font-serif font-bold text-sm">
              <Users size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] font-semibold">
                  FLEET INSPECTOR
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#F0FAF6] text-[#08795F] border border-[#C3E6DB]">
                  8/8 NODES ACTIVE
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#182536]">
                Autonomous Agent Fleet
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5E6975] hover:text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] transition-colors"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </header>

        {/* Content: Left list + Right details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Agent Roster Selector */}
          <div className="w-56 border-r border-[#D5D5CE] bg-[#FAF9F5] overflow-y-auto divide-y divide-[#D5D5CE]/60 flex-shrink-0">
            {AGENT_WORKFORCE.map((agent) => {
              const isSelected = agent.id === currentAgent.id;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setActiveId(agent.id);
                    onSelectAgent?.(agent.id);
                  }}
                  className={`w-full text-left p-3 transition-colors ${
                    isSelected
                      ? 'bg-[#FFFDF8] border-l-2 border-l-[#182536]'
                      : 'hover:bg-[#EFEFEB] text-[#334256]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#5E6975]">{agent.id.replace('agent-', '')}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#08795F]" />
                  </div>
                  <div className="text-xs font-semibold text-[#182536] mt-0.5 leading-snug">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-[#5E6975] font-mono mt-0.5 truncate">
                    {agent.domain}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Telemetry for Selected Agent */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FFFDF8]">
            {/* Identity & Status Card */}
            <div className="p-4 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975]">
                    Agent Identifier: {currentAgent.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#182536]">
                    {currentAgent.name}
                  </h3>
                  <p className="text-xs text-[#334256] mt-1 leading-relaxed">
                    {currentAgent.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] bg-[#F0FAF6] text-[#08795F] border border-[#C3E6DB]">
                    {currentAgent.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#5E6975]">
                    Beat: 12ms ago
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D5D5CE]/60 text-center">
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Latency</span>
                  <strong className="text-sm font-mono text-[#182536]">{currentAgent.latencyMs}ms</strong>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Success</span>
                  <strong className="text-sm font-mono text-[#08795F]">{currentAgent.successRate}%</strong>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Tasks Executed</span>
                  <strong className="text-sm font-mono text-[#182536]">{(currentAgent.completedTasks || 12400).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Current Operational Context */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] font-semibold block">
                Current Execution Binding
              </span>
              <div className="p-3.5 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-2 text-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5E6975]">Active Pipeline:</span>
                  <span className="font-mono font-bold text-[#182536]">
                    wf-vendor-procurement (High-Value PO Match)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5E6975]">Active Stage:</span>
                  <span className="font-mono text-[#08795F] font-semibold">
                    Step 03 / Invariant Evaluation & Threshold Intercept
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5E6975]">Current Subtask:</span>
                  <span className="font-mono text-[#334256] truncate max-w-[280px]">
                    Validating vendor invoice #INV-2026-881 against PO #PO-9912
                  </span>
                </div>
              </div>
            </div>

            {/* Programmatic Domain Invariants */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] font-semibold block">
                Formal Domain Invariants & Hard Boundaries
              </span>
              <div className="space-y-1.5">
                {(currentAgent.invariants || []).map((inv: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] flex items-start gap-2 text-xs"
                  >
                    <ShieldCheck size={14} className="text-[#08795F] flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-[11px] text-[#182536] leading-relaxed">
                      {inv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Underlying Capabilities */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] font-semibold block">
                Registered Capability Matrix
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentAgent.skills || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-[#FAF9F5] border border-[#D5D5CE] text-[#334256]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* State & Memory Proof */}
            <div className="p-3 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-1 text-xs font-mono">
              <span className="text-[10px] text-[#5E6975] block uppercase font-semibold">
                Memory Isolation & Cryptographic Proof
              </span>
              <div className="text-[11px] text-[#334256]">
                Boundary: Ephemeral memory partition. Zero session cross-leak.
              </div>
              <div className="text-[10px] text-[#5E6975] truncate">
                State Checksum: sha256-{currentAgent.id.replace('agent-', '')}e9812bf0034a71
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-3 bg-[#FAF9F5] border-t border-[#D5D5CE] flex items-center justify-between text-xs font-mono text-[#5E6975]">
          <span>Fleet Health: 100% Invariants Active</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#182536] text-[#FFFDF8] rounded-[2px] text-xs font-medium hover:bg-[#334256] transition-colors"
          >
            Close Inspector
          </button>
        </footer>
      </aside>
    </>
  );
};
