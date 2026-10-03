import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  HeartPulse,
  LayoutGrid,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Table as TableIcon,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';
import { AgentInfo } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TableHealthSparkline } from '../components/TableHealthSparkline';
import { TableQuickActionsMenu } from '../components/TableQuickActionsMenu';
import { useOperationsStore } from '../orchestrator/store';

export const HealthPage: React.FC = () => {
  const { navigateTo, addToast } = useOperationsStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENT_WORKFORCE[0]?.id || '');
  const [pingState, setPingState] = useState<number>(12);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pausedAgentIds, setPausedAgentIds] = useState<Record<string, boolean>>({});

  const selectedAgent =
    AGENT_WORKFORCE.find((ag) => ag.id === selectedAgentId) || AGENT_WORKFORCE[0];

  const handleRefreshHeartbeats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPingState(Math.floor(10 + Math.random() * 5));
      setIsRefreshing(false);
      addToast('Fleet Heartbeats Refreshed', 'All 8 autonomous agent cluster nodes reported healthy telemetry.', 'info');
    }, 600);
  };

  const handleToggleAgentPause = (agentId: string, agentName: string) => {
    setPausedAgentIds((prev) => {
      const isPaused = !prev[agentId];
      addToast(
        isPaused ? 'Agent Suspended' : 'Agent Re-armed',
        `${agentName} is now ${isPaused ? 'paused' : 'operational'}.`,
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
      return nameMatch || domainMatch || statusMatch;
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
      'Cluster Diagnostic Dispatched',
      `Sent test heartbeat pulses to ${selectedIds.length} selected agent nodes.`,
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
        allCurrentlyPaused ? 'Nodes Re-armed' : 'Nodes Suspended',
        `${selectedIds.length} nodes are now ${allCurrentlyPaused ? 'operational' : 'paused'}.`,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Infrastructure Telemetry
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Fleet Health & Cluster Telemetry
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Distributed multi-agent heartbeat matrix, memory headroom, token quota consumption, and invariant boundaries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center border border-[#D5D5CE] rounded-[2px] bg-[#FFFDF8] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-mono flex items-center gap-1.5 rounded-[2px] transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#182536] text-[#FFFDF8]'
                  : 'text-[#5E6975] hover:text-[#182536]'
              }`}
            >
              <TableIcon size={12} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1 text-xs font-mono flex items-center gap-1.5 rounded-[2px] transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-[#182536] text-[#FFFDF8]'
                  : 'text-[#5E6975] hover:text-[#182536]'
              }`}
            >
              <LayoutGrid size={12} />
              <span>Matrix</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefreshHeartbeats}
            disabled={isRefreshing}
            className="axiom-btn-secondary py-1.5 px-3"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Pinging Cluster...' : 'Ping Cluster'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#08795F] bg-[#F0FAF6] px-3 py-1.5 rounded-[2px] border border-[#C3E6DB]">
            <span className="w-2 h-2 rounded-full bg-[#08795F] animate-pulse" />
            <span>8 / 8 NODES ARMED: {pingState}ms</span>
          </div>
        </div>
      </div>

      {/* Cluster Technical Status Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y lg:divide-y-0 lg:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
            Cluster Integrity
          </span>
          <div className="text-2xl font-serif font-bold text-[#08795F] mt-0.5">
            100% Armed
          </div>
          <span className="text-[11px] text-[#5E6975] font-mono mt-0.5 block">
            8 autonomous workers healthy
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
            Aggregated Latency
          </span>
          <div className="text-2xl font-mono font-bold text-[#182536] mt-0.5">
            {pingState}ms <span className="text-xs font-normal text-[#5E6975]">p50</span>
          </div>
          <span className="text-[11px] text-[#08795F] font-mono mt-0.5 block">
            38ms p95 · 82ms p99
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
            Token Quota Allocation
          </span>
          <div className="text-2xl font-mono font-bold text-[#182536] mt-0.5">
            14.8M <span className="text-xs font-normal text-[#5E6975]">/ 50M</span>
          </div>
          <div className="w-full bg-[#EFEFEB] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#182536] h-full rounded-full" style={{ width: '29.6%' }} />
          </div>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
            Circuit Breaker Status
          </span>
          <div className="text-2xl font-mono font-bold text-[#08795F] mt-0.5">
            ARMED
          </div>
          <span className="text-[11px] text-[#5E6975] font-mono mt-0.5 block">
            Zero trips · Auto-quarantine ready
          </span>
        </div>
      </div>

      {/* CLUSTER TELEMETRY: Table or Matrix View */}
      {viewMode === 'table' ? (
        <div className="space-y-2">
          <div className="axiom-panel overflow-hidden">
            {/* Top Filter and Bulk Actions Bar */}
            <div className="axiom-table-toolbar">
              <div className="axiom-table-filter">
                <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search & filter telemetry nodes by name or domain..."
                  aria-label="Filter telemetry nodes table"
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
                    <span>Ping Selected</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkPause}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9A6900] hover:bg-[#7a5300] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
                  >
                    <Pause size={10} />
                    <span>Suspend Selected</span>
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
                  {filtered.length} active agent nodes
                </div>
              )}
            </div>

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
                        aria-label="Select all nodes"
                        className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th>Agent Node</th>
                    <th>Semantic Domain</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Latency</th>
                    <th>Success Rate</th>
                    <th>Tasks Executed</th>
                    <th>Invariant Boundary</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-xs text-[#5E6975] font-mono">
                        No telemetry nodes found matching "{searchFilter}".
                      </td>
                    </tr>
                  ) : (
                    filtered.map((agent) => {
                      const isPaused = Boolean(pausedAgentIds[agent.id]);
                      const isSelected = selectedIds.includes(agent.id);
                      const isDrawerActive = agent.id === selectedAgentId;
                      const healthData = getAgentHealthTrend(agent);

                      return (
                        <tr
                          key={agent.id}
                          onClick={() => setSelectedAgentId(agent.id)}
                          className={`cursor-pointer ${isSelected ? 'is-selected' : isDrawerActive ? 'bg-[#FFF8E6]/60' : ''}`}
                        >
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(agent.id)}
                              aria-label={`Select node ${agent.name}`}
                              className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td>
                            <div className="font-semibold text-[#182536] flex items-center gap-1.5">
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
                                onClick={() => setSelectedAgentId(agent.id)}
                                className="axiom-btn-secondary py-1 px-2.5 text-xs"
                              >
                                Inspect
                              </button>

                              {/* Quick Actions Context Menu */}
                              <TableQuickActionsMenu
                                id={agent.id}
                                name={agent.name}
                                isPaused={isPaused}
                                onRerun={() => {
                                  addToast('Heartbeat Ping Dispatched', `Verified active pulse on ${agent.name}.`, 'info');
                                }}
                                onPause={() => handleToggleAgentPause(agent.id, agent.name)}
                                onViewLogs={() => navigateTo('activity')}
                                onInspect={() => setSelectedAgentId(agent.id)}
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
        </div>
      ) : (
        /* Matrix Grid View */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#5E6975]">
            <span className="uppercase font-semibold">Node Cluster Matrix (8 Independent Agents)</span>
            <span>Click any agent tile to inspect real-time diagnostics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_WORKFORCE.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              const isPaused = Boolean(pausedAgentIds[agent.id]);
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all bg-[#FFFDF8] shadow-2xs relative ${
                    isSelected
                      ? 'border-2 border-[#182536] ring-2 ring-[#182536]/10'
                      : 'border-[#D5D5CE] hover:border-[#334256] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPaused ? 'bg-[#9A6900]' : 'bg-[#08795F] animate-pulse'
                        }`}
                      />
                      <span
                        className={`font-semibold uppercase ${
                          isPaused ? 'text-[#9A6900]' : 'text-[#08795F]'
                        }`}
                      >
                        {isPaused ? 'PAUSED' : 'ONLINE'}
                      </span>
                    </div>
                    <span className="text-[#5E6975]">{agent.latencyMs}ms</span>
                  </div>

                  <div className="font-serif font-bold text-sm text-[#182536] mt-2 truncate">
                    {agent.name}
                  </div>

                  <div className="text-[10px] font-mono text-[#334256] mt-0.5">
                    {agent.domain}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D5D5CE]/60 space-y-1.5 text-[10px] font-mono">
                    <div className="flex items-center justify-between text-[#5E6975]">
                      <span>Success Rate:</span>
                      <span className="text-[#08795F] font-bold">{agent.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[#5E6975]">
                      <span>Memory:</span>
                      <span className="text-[#182536]">38.4 MB / 128 MB</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-[#D5D5CE]/60 text-[9px] font-mono text-[#5E6975] truncate">
                    <span className="text-[#182536] font-semibold">Rule:</span> {agent.invariants[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED AGENT DEEP DIAGNOSTICS DOCKET */}
      {selectedAgent && (
        <div className="axiom-panel border border-[#D5D5CE] bg-[#FFFDF8] p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5D5CE] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#D72F40] px-2 py-0.5 bg-rose-50 rounded-[2px] border border-rose-200">
                DIAGNOSTICS DOCKET
              </span>
              <h3 className="text-base font-serif font-bold text-[#182536]">
                {selectedAgent.name}
              </h3>
              <span className="text-xs font-mono text-[#5E6975]">
                [{selectedAgent.domain}]
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#5E6975]">Version: {selectedAgent.version}</span>
              <span className="text-[#D5D5CE]">|</span>
              <span className="text-[#08795F] font-semibold">INVARIANTS VERIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
                Guaranteed Invariant Boundary:
              </span>
              <div className="text-[11px] text-[#182536] leading-relaxed">
                {selectedAgent.invariants.join(', ')}
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
                Primary Assigned Skills:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedAgent.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-1.5 py-0.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] font-mono text-[10px] text-[#334256]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#F0FAF6] border border-[#C3E6DB] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#08795F] block font-semibold">
                Telemetry Percentiles:
              </span>
              <div className="text-[11px] font-mono text-[#08795F] space-y-0.5">
                <div>p50 Latency: {selectedAgent.latencyMs}ms</div>
                <div>p95 Latency: {selectedAgent.latencyMs + 18}ms</div>
                <div>Error Budget: 100% Remaining</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#334256] leading-relaxed pt-1">
            {selectedAgent.description}
          </p>
        </div>
      )}
    </div>
  );
};
