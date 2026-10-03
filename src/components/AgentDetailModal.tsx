import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { AgentInfo } from '../types';
import { StatusBadge } from './StatusBadge';
import { AgentThroughputSparkline } from './AgentThroughputSparkline';

export interface AgentDetailModalProps {
  agent: AgentInfo | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-[2px] shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={agent.status} size="sm" />
              <span className="text-xs font-mono text-[#718096]">Version: {agent.version}</span>
            </div>
            <h3 className="text-base font-serif font-bold text-[#17263d] mt-1">{agent.name}</h3>
            <p className="text-xs text-[#718096] font-mono mt-0.5">Domain: {agent.domain}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#718096] hover:text-[#17263d] p-1 rounded-[2px]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-mono uppercase text-[#718096] font-semibold mb-1">
              Agent Functional Role
            </h4>
            <p className="text-xs text-[#40516a] leading-relaxed bg-[#fbfaf7] p-3 rounded-[2px] border border-[#dce1e7]">
              {agent.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
              <div className="text-[10px] font-mono uppercase text-[#718096]">Success Rate</div>
              <div className="text-base font-bold font-mono text-[#159a72] mt-0.5">
                {agent.successRate}%
              </div>
            </div>
            <div className="p-3 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
              <div className="text-[10px] font-mono uppercase text-[#718096]">Median Latency</div>
              <div className="text-base font-bold font-mono text-[#17263d] mt-0.5">
                {agent.latencyMs}ms
              </div>
            </div>
            <div className="p-3 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
              <div className="text-[10px] font-mono uppercase text-[#718096]">Tasks Executed</div>
              <div className="text-base font-bold font-mono text-[#17263d] mt-0.5">
                {agent.completedTasks.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-[#718096] font-semibold mb-2">
              Assigned Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-mono text-[#17263d] bg-[#fbfaf7] rounded-[2px] border border-[#dce1e7]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-[#718096] font-semibold mb-2">
              Deterministic Invariants & Guardrails
            </h4>
            <div className="space-y-1.5">
              {agent.invariants.map((inv) => (
                <div
                  key={inv}
                  className="flex items-start gap-2 p-2.5 rounded-[2px] bg-[#f0faf6] border border-[#c7eadf] text-xs text-[#0d6b4f]"
                >
                  <ShieldCheck size={15} className="text-[#159a72] flex-shrink-0 mt-0.5" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-[#718096] font-semibold mb-2">
              Execution Velocity
            </h4>
            <div className="p-3 rounded-[2px] border border-[#dce1e7] bg-[#fbfaf7]">
              <AgentThroughputSparkline height={40} color="#17263d" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#faf9f5] border-t border-[#dce1e7] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="axiom-btn-secondary text-xs py-1 px-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
