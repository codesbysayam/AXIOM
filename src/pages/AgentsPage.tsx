import React, { useMemo, useState } from 'react';
import { Bot, CheckCircle2, Pause, Play, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
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
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pausedAgentIds, setPausedAgentIds] = useState<Record<string, boolean>>({});

  const handleToggleAgentPause = (agentId: string, agentName: string) => {
    setPausedAgentIds((prev) => {
      const isPaused = !prev[agentId];
      addToast(
        isPaused ? 'Agent Suspended' : 'Agent Operational',
        `${agentName} is now ${isPaused ? 'paused' : 'active'}.`,
        isPaused ? 'warning' : 'info',
      );
      return { ...prev, [agentId]: isPaused };
    });
  };

  const filtered = useMemo(() => {
    if (!searchFilter.trim()) return AGENT_WORKFORCE;
    const query = searchFilter.toLowerCase().trim();
    return AGENT_WORKFORCE.filter((agent) => {
      const isPaused = Boolean(pausedAgentIds[agent.id]);
      const statusString = isPaused ? 'paused' : agent.status.toLowerCase();
      const nameMatch = agent.name.toLowerCase().includes(query) || agent.id.toLowerCase().includes(query);
      const domainMatch = agent.domain.toLowerCase().includes(query);
      const statusMatch = statusString.includes(query);
      const invariantMatch = agent.invariants.some((inv) => inv.toLowerCase().includes(query));
      return nameMatch || domainMatch || statusMatch || invariantMatch;
    });
  }, [searchFilter, pausedAgentIds]);

  const isAllSelected = filtered.length > 0 && filtered.every((a) => selectedIds.includes(a.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkRun = () => {
    if (selectedIds.length === 0) return;
    addToast(
      'Diagnostic Heartbeats Dispatched',
      `Sent test heartbeat pulses to ${selectedIds.length} selected agents.`,
      'info',
    );
  };

  const handleBulkPause = () => {
    if (selectedIds.length === 0) return;
    setPausedAgentIds((prev) => {
      const next = { ...prev };
      const allCurrentlyPaused = selectedIds.every((id) => prev[id]);
      selectedIds.forEach((id) => {
        next[id] = !allCurrentlyPaused;
      });
      addToast(
        allCurrentlyPaused ? 'Agents Re-armed' : 'Agents Suspended',
        `${selectedIds.length} agents are now ${allCurrentlyPaused ? 'operational' : 'paused'}.`,
        allCurrentlyPaused ? 'info' : 'warning',
      );
      return next;
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

        <div className="flex items-center gap-2 text-xs font-mono text-[#08795F] bg-[#F0FAF6] px-3 py-1.5 rounded-[2px] border border-[#C3E6DB]">
          <span className="w-2 h-2 rounded-full bg-[#08795F]" />
          <span>8 of 8 Agents Active: 100% Operational</span>
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
          <span className="text-xl font-mono font-bold text-[#08795F] mt-0.5 block">99.3%</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Total Tasks Completed</span>
          <span className="text-xl font-mono font-bold text-[#182536] mt-0.5 block">186,070</span>
        </div>
      </div>

      {/* System Registry Table Panel with Top Filter Bar & Multi-Select */}
      <div className="axiom-panel overflow-hidden">
        {/* Top Filter and Bulk Actions Bar */}
        <div className="axiom-table-toolbar">
          <div className="axiom-table-filter">
            <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search & filter agents by name, domain, status..."
              aria-label="Filter agents table"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2 text-[#5E6975] hover:text-[#182536]"
                title="Clear filter"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {selectedIds.length > 0 ? (
            <div className="axiom-bulk-bar">
              <span>
                <b>{selectedIds.length}</b> selected
              </span>
              <button
                type="button"
                onClick={handleBulkRun}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <Play size={10} />
                <span>Run Diagnostics</span>
              </button>
              <button
                type="button"
                onClick={handleBulkPause}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9A6900] hover:bg-[#7a5300] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <Pause size={10} />
                <span>Pause Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-slate-300 hover:text-white underline text-[10px] ml-1"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="text-xs font-mono text-[#5E6975]">
              {filtered.length} matching agents
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="axiom-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all agents"
                    className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                  />
                </th>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-xs text-[#5E6975] font-mono">
                    No matching agents found for "{searchFilter}".
                  </td>
                </tr>
              ) : (
                filtered.map((agent) => {
                  const isPaused = Boolean(pausedAgentIds[agent.id]);
                  const isSelected = selectedIds.includes(agent.id);
                  const healthData = getAgentHealthTrend(agent);

                  return (
                    <tr
                      key={agent.id}
                      onClick={() => setActiveDrawerAgent(agent)}
                      className={`cursor-pointer ${isSelected ? 'is-selected' : ''}`}
                    >
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(agent.id)}
                          aria-label={`Select agent ${agent.name}`}
                          className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                        />
                      </td>
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
                      <td className="font-mono text-xs text-[#08795F] font-semibold">{agent.successRate}%</td>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <AgentDiagnosticsDrawer agent={activeDrawerAgent} onClose={() => setActiveDrawerAgent(null)} />
    </div>
  );
};
