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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-xl p-5 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={agent.status} size="sm" />
              <span className="text-xs font-mono text-slate-400">ID: {agent.id}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{agent.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Domain: {agent.domain}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-slate-600 leading-relaxed">{agent.description}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Success</span>
            <span className="text-sm font-semibold font-mono text-emerald-600">
              {agent.successRate}%
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Latency</span>
            <span className="text-sm font-semibold font-mono text-slate-800">
              {agent.latencyMs}ms
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Completed</span>
            <span className="text-sm font-semibold font-mono text-slate-800">
              {agent.completedTasks.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-2">
            Execution Throughput Trend (24h)
          </span>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <AgentThroughputSparkline height={48} color="#1b2e49" />
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-2">
            Active Capabilities and Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {agent.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-[11px] font-mono text-slate-700 bg-slate-100 rounded border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-2">
            Deterministic Invariants
          </span>
          <div className="space-y-1.5">
            {agent.invariants.map((inv) => (
              <div
                key={inv}
                className="flex items-start gap-2 text-xs text-slate-600 bg-emerald-50/40 p-2 rounded border border-emerald-200/60"
              >
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{inv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Agent Core: v{agent.version}</span>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-sans transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
