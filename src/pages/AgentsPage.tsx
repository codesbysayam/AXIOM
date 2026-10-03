import React, { useState } from 'react';
import { Bot, CheckCircle2, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';
import { AgentInfo } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TableHealthSparkline } from '../components/TableHealthSparkline';
import { TableQuickActionsMenu } from '../components/TableQuickActionsMenu';
import { AgentDetailModal } from '../components/AgentDetailModal';
import { AgentDiagnosticsDrawer } from '../components/AgentDiagnosticsDrawer';
import { useOperationsStore } from '../orchestrator/store';

export const AgentsPage: React.FC = () => {
  const { navigateTo, addToast } = useOperationsStore();
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [activeDrawerAgent, setActiveDrawerAgent] = useState<AgentInfo | null>(null);
  const [pausedAgentIds, setPausedAgentIds] = useState<Record<string, boolean>>({});

  const handleToggleAgentPause = (agentId: string, agentName: string) => {
    setPausedAgentIds((prev) => {
      const isPaused = !prev[agentId];
      addToast(
        isPaused ? 'Agent Paused' : 'Agent Resumed',
        `${agentName} is now ${isPaused ? 'paused' : 'active'}.`,
        isPaused ? 'warning' : 'info',
      );
      return { ...prev, [agentId]: isPaused };
    });
  };

  const getAgentHealthTrend = (agent: AgentInfo) => {
    if (agent.latencyMs > 200) return [94, 96, 95, 93, 94, 95];
    if (agent.latencyMs > 100) return [98, 97, 98, 99, 98, 99];
    return [99, 100, 100, 100, 99, 100];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            System Topology
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Agent Workforce Registry
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Specialized autonomous agents operating with deterministic domain invariants
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#0D6B4F] bg-[#F0FAF6] px-3 py-1.5 rounded-[2px] border border-[#C3E6DB]">
          <span className="w-2 h-2 rounded-full bg-[#138468]" />
          <span>8 of 8 Agents Active · 100% Operational</span>
        </div>
      </div>

      {/* System Topology Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y md:divide-y-0 md:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Total Agents</span>
          <span className="text-xl font-serif font-bold text-[#182536] mt-0.5 block">8 Specialized</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Median Fleet Latency</span>
          <span className="text-xl font-mono font-bold text-[#182536] mt-0.5 block">145 ms</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Fleet Success Rate</span>
          <span className="text-xl font-mono font-bold text-[#138468] mt-0.5 block">99.3%</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Total Tasks Completed</span>
          <span className="text-xl font-mono font-bold text-[#182536] mt-0.5 block">186,070</span>
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
              <th>Health</th>
              <th>Latency</th>
              <th>Success Rate</th>
              <th>Tasks Executed</th>
              <th>Deterministic Invariant</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {AGENT_WORKFORCE.map((agent) => {
              const isPaused = Boolean(pausedAgentIds[agent.id]);
              const healthData = getAgentHealthTrend(agent);

              return (
                <tr
                  key={agent.id}
                  onClick={() => setActiveDrawerAgent(agent)}
                  className="cursor-pointer"
                >
                  <td>
                    <div className="font-semibold text-[#182536] flex items-center gap-2">
                      <span>{agent.name}</span>
                      <span className="text-[10px] font-mono text-[#5E6975]">v{agent.version}</span>
                    </div>
                    <div className="text-[11px] text-[#5E6975] font-mono">{agent.id}</div>
                  </td>
                  <td className="text-[#334256] font-mono text-xs">{agent.domain}</td>
                  <td>
                    <StatusBadge status={isPaused ? 'paused' : agent.status} size="sm" />
                  </td>
                  {/* Health Column with Recharts mini sparkline */}
                  <td>
                    <TableHealthSparkline
                      data={healthData}
                      label={`${agent.name} Health Trend`}
                    />
                  </td>
                  <td className="font-mono text-xs text-[#182536]">{agent.latencyMs}ms</td>
                  <td className="font-mono text-xs text-[#138468] font-semibold">{agent.successRate}%</td>
                  <td className="font-mono text-xs text-[#5E6975]">
                    {agent.completedTasks.toLocaleString()}
                  </td>
                  <td>
                    <span className="text-[11px] text-[#334256] truncate max-w-xs block font-mono">
                      {agent.invariants[0]}
                    </span>
                  </td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveDrawerAgent(agent)}
                        className="axiom-btn-secondary py-1 px-2.5 text-xs"
                      >
                        Diagnostics
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAgent(agent)}
                        className="axiom-btn-primary py-1 px-2.5 text-xs"
                      >
                        Profile
                      </button>

                      {/* Quick Actions Context Menu */}
                      <TableQuickActionsMenu
                        id={agent.id}
                        name={agent.name}
                        isPaused={isPaused}
                        onRerun={() => {
                          addToast('Agent Diagnostic Pinged', `Sent test heartbeat pulse to ${agent.name}.`, 'info');
                        }}
                        onPause={() => handleToggleAgentPause(agent.id, agent.name)}
                        onViewLogs={() => navigateTo('activity')}
                        onInspect={() => setSelectedAgent(agent)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <AgentDiagnosticsDrawer agent={activeDrawerAgent} onClose={() => setActiveDrawerAgent(null)} />
    </div>
  );
};
