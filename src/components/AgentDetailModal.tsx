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
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={agent.status} size="sm" />
              <span className="text-xs font-mono text-slate-400">Version: {agent.version}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{agent.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Domain: {agent.domain}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
              Agent Functional Role
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/60">
              {agent.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-mono uppercase text-slate-400">Success Rate</div>
              <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">
                {agent.successRate}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-mono uppercase text-slate-400">Median Latency</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {agent.latencyMs}ms
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[10px] font-mono uppercase text-slate-400">Tasks Executed</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {agent.completedTasks.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Assigned Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-mono text-slate-700 bg-slate-100 rounded border border-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Deterministic Invariants & Guardrails
            </h4>
            <div className="space-y-1.5">
              {agent.invariants.map((inv) => (
                <div
                  key={inv}
                  className="flex items-start gap-2 p-2.5 rounded bg-emerald-50/50 border border-emerald-200 text-xs text-slate-700"
                >
                  <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
              Execution Velocity
            </h4>
            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <AgentThroughputSparkline height={40} color="#1b2e49" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
