import React from 'react';
import { Activity, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { AgentInfo } from '../types';
import { StatusBadge } from './StatusBadge';
import { AgentThroughputSparkline } from './AgentThroughputSparkline';

export interface AgentDiagnosticsDrawerProps {
  agent: AgentInfo | null;
  onClose: () => void;
}

export const AgentDiagnosticsDrawer: React.FC<AgentDiagnosticsDrawerProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-[#dce1e7] shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-start justify-between pb-3 border-b border-[#f0eee6]">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={agent.status} size="sm" />
              <span className="text-xs font-mono text-[#718096]">ID: {agent.id}</span>
            </div>
            <h3 className="text-base font-serif font-bold text-[#17263d] mt-1">{agent.name}</h3>
            <p className="text-xs text-[#718096] font-mono mt-0.5">Domain: {agent.domain}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#718096] hover:text-[#17263d] rounded-[2px]"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-[#40516a] leading-relaxed">{agent.description}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
            <span className="text-[10px] uppercase font-mono text-[#718096] block">Success</span>
            <span className="text-sm font-semibold font-mono text-[#159a72]">
              {agent.successRate}%
            </span>
          </div>
          <div className="p-2.5 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
            <span className="text-[10px] uppercase font-mono text-[#718096] block">Latency</span>
            <span className="text-sm font-semibold font-mono text-[#17263d]">
              {agent.latencyMs}ms
            </span>
          </div>
          <div className="p-2.5 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7]">
            <span className="text-[10px] uppercase font-mono text-[#718096] block">Completed</span>
            <span className="text-sm font-semibold font-mono text-[#17263d]">
              {agent.completedTasks.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#718096] font-mono block mb-2">
            Execution Throughput Trend (24h)
          </span>
          <div className="p-3 bg-[#fbfaf7] rounded-[2px] border border-[#dce1e7]">
            <AgentThroughputSparkline height={48} color="#17263d" />
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#718096] font-mono block mb-2">
            Active Capabilities and Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {agent.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-[11px] font-mono text-[#17263d] bg-[#fbfaf7] rounded-[2px] border border-[#dce1e7]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#718096] font-mono block mb-2">
            Deterministic Invariants
          </span>
          <div className="space-y-1.5">
            {agent.invariants.map((inv) => (
              <div
                key={inv}
                className="flex items-start gap-2 text-xs text-[#0d6b4f] bg-[#f0faf6] p-2 rounded-[2px] border border-[#c7eadf]"
              >
                <ShieldCheck size={14} className="text-[#159a72] flex-shrink-0 mt-0.5" />
                <span>{inv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-[#f0eee6] flex items-center justify-between text-xs text-[#718096] font-mono">
        <span>Agent Core: v{agent.version}</span>
        <button
          type="button"
          onClick={onClose}
          className="axiom-btn-secondary py-1 px-3 text-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
