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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            System Topology
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Agent Workforce Registry
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Specialized autonomous agents operating with deterministic domain invariants
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#159a72] bg-[#f0faf6] px-3 py-1.5 rounded-xs border border-[#c7eadf]">
          <span className="w-2 h-2 rounded-full bg-[#159a72]" />
          <span>8 of 8 Agents Active · 100% Operational</span>
        </div>
      </div>

      {/* System Topology Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#dce1e7] bg-white rounded-xs divide-y md:divide-y-0 md:divide-x divide-[#dce1e7]">
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">Total Agents</span>
          <span className="text-xl font-serif font-bold text-[#17263d] mt-0.5 block">8 Specialized</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">Median Fleet Latency</span>
          <span className="text-xl font-mono font-bold text-[#17263d] mt-0.5 block">145 ms</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">Fleet Success Rate</span>
          <span className="text-xl font-mono font-bold text-[#159a72] mt-0.5 block">99.3%</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">Total Tasks Completed</span>
          <span className="text-xl font-mono font-bold text-[#17263d] mt-0.5 block">186,070</span>
        </div>
      </div>

      {/* System Registry Table */}
      <div className="axiom-panel overflow-x-auto">
        <table className="axiom-table">
          <thead>
            <tr>
              <th>Agent Identity</th>
              <th>Semantic Domain</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Success Rate</th>
              <th>Tasks Executed</th>
              <th>Deterministic Invariant</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {AGENT_WORKFORCE.map((agent) => (
              <tr
                key={agent.id}
                onClick={() => setActiveDrawerAgent(agent)}
                className="cursor-pointer"
              >
                <td>
                  <div className="font-semibold text-[#17263d] flex items-center gap-2">
                    <span>{agent.name}</span>
                    <span className="text-[10px] font-mono text-[#a0aec0]">v{agent.version}</span>
                  </div>
                  <div className="text-[11px] text-[#718096] font-mono">{agent.id}</div>
                </td>
                <td className="text-[#40516a] font-mono text-xs">{agent.domain}</td>
                <td>
                  <StatusBadge status={agent.status} size="sm" />
                </td>
                <td className="font-mono text-xs text-[#17263d]">{agent.latencyMs}ms</td>
                <td className="font-mono text-xs text-[#159a72] font-semibold">{agent.successRate}%</td>
                <td className="font-mono text-xs text-[#718096]">
                  {agent.completedTasks.toLocaleString()}
                </td>
                <td>
                  <span className="text-[11px] text-[#40516a] truncate max-w-xs block font-mono">
                    {agent.invariants[0]}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDrawerAgent(agent);
                      }}
                      className="axiom-btn-secondary py-1 px-2.5 text-xs"
                    >
                      Diagnostics
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgent(agent);
                      }}
                      className="axiom-btn-primary py-1 px-2.5 text-xs"
                    >
                      Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <AgentDiagnosticsDrawer agent={activeDrawerAgent} onClose={() => setActiveDrawerAgent(null)} />
    </div>
  );
};
