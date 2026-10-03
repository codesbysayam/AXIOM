import React, { useState } from 'react';
import { Bot, CheckCircle2, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';
import { AgentInfo } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { AgentDetailModal } from '../components/AgentDetailModal';
import { AgentDiagnosticsDrawer } from '../components/AgentDiagnosticsDrawer';

export const AgentsPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [activeDrawerAgent, setActiveDrawerAgent] = useState<AgentInfo | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Agent Workforce Registry
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Specialized autonomous agents operating with explicit domain invariants
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{AGENT_WORKFORCE.length} Agents Registered · 100% Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENT_WORKFORCE.map((agent) => (
          <div
            key={agent.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={agent.status} size="sm" />
                  <span className="text-[11px] font-mono text-slate-400">v{agent.version}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {agent.domain}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-2">{agent.name}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Success</span>
                  <span className="font-semibold text-emerald-600 font-mono">{agent.successRate}%</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Latency</span>
                  <span className="font-semibold text-slate-800 font-mono">{agent.latencyMs}ms</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Tasks</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {agent.completedTasks > 1000 ? `${(agent.completedTasks / 1000).toFixed(1)}k` : agent.completedTasks}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Key Invariant:
                </span>
                <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2 rounded border border-emerald-200/60 line-clamp-1">
                  {agent.invariants[0]}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveDrawerAgent(agent)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Quick Diagnostics
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgent(agent)}
                className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium shadow-xs"
              >
                Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <AgentDiagnosticsDrawer agent={activeDrawerAgent} onClose={() => setActiveDrawerAgent(null)} />
    </div>
  );
};
