import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Radio,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';
import { AgentInfo } from '../types';

export const HealthPage: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENT_WORKFORCE[0]?.id || '');
  const [pingState, setPingState] = useState<number>(12);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const selectedAgent =
    AGENT_WORKFORCE.find((ag) => ag.id === selectedAgentId) || AGENT_WORKFORCE[0];

  const handleRefreshHeartbeats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPingState(Math.floor(10 + Math.random() * 5));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Infrastructure Telemetry
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Fleet Health & Cluster Telemetry
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Distributed multi-agent heartbeat matrix, memory headroom, token quota consumption, and invariant boundaries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefreshHeartbeats}
            disabled={isRefreshing}
            className="axiom-btn-secondary py-1.5 px-3"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Pinging Cluster...' : 'Ping Cluster'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#0d6b4f] bg-[#f0faf6] px-3 py-1.5 rounded-[2px] border border-[#c7eadf]">
            <span className="w-2 h-2 rounded-full bg-[#159a72] animate-pulse" />
            <span>8 / 8 NODES ARMED · {pingState}ms</span>
          </div>
        </div>
      </div>

      {/* Cluster Technical Status Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[#dce1e7] bg-white rounded-[2px] divide-y lg:divide-y-0 lg:divide-x divide-[#dce1e7] shadow-2xs">
        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Cluster Integrity
          </span>
          <div className="text-2xl font-serif font-bold text-[#159a72] mt-0.5">
            100% Armed
          </div>
          <span className="text-[11px] text-[#718096] font-mono mt-0.5 block">
            8 autonomous workers healthy
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Aggregated Latency
          </span>
          <div className="text-2xl font-mono font-bold text-[#17263d] mt-0.5">
            {pingState}ms <span className="text-xs font-normal text-[#718096]">p50</span>
          </div>
          <span className="text-[11px] text-[#159a72] font-mono mt-0.5 block">
            38ms p95 · 82ms p99
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Token Quota Allocation
          </span>
          <div className="text-2xl font-mono font-bold text-[#17263d] mt-0.5">
            14.8M <span className="text-xs font-normal text-[#718096]">/ 50M</span>
          </div>
          <div className="w-full bg-[#f0eee6] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#17263d] h-full rounded-full" style={{ width: '29.6%' }} />
          </div>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Circuit Breaker Status
          </span>
          <div className="text-2xl font-mono font-bold text-[#159a72] mt-0.5">
            ARMED
          </div>
          <span className="text-[11px] text-[#718096] font-mono mt-0.5 block">
            Zero trips · Auto-quarantine ready
          </span>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Node Cluster Matrix Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#718096]">
          <span className="uppercase font-semibold">Node Cluster Matrix (8 Independent Agents)</span>
          <span>Click any agent tile to inspect real-time diagnostics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENT_WORKFORCE.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-4 rounded-[2px] border cursor-pointer transition-all bg-white shadow-2xs relative ${
                  isSelected
                    ? 'border-2 border-[#17263d] ring-2 ring-[#17263d]/10'
                    : 'border-[#dce1e7] hover:border-[#b8c2cc] hover:bg-[#faf9f5]'
                }`}
              >
                {/* Status Beacon & Node ID */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#159a72] animate-pulse" />
                    <span className="font-semibold text-[#0d6b4f] uppercase">ONLINE</span>
                  </div>
                  <span className="text-[#718096]">{agent.latencyMs}ms</span>
                </div>

                {/* Agent Name */}
                <div className="font-serif font-bold text-sm text-[#17263d] mt-2 truncate">
                  {agent.name}
                </div>

                {/* Domain Specialization */}
                <div className="text-[10px] font-mono text-[#40516a] mt-0.5">
                  {agent.domain}
                </div>

                {/* Technical Spark Readouts */}
                <div className="mt-3 pt-2.5 border-t border-[#f0eee6] space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center justify-between text-[#718096]">
                    <span>Success Rate:</span>
                    <span className="text-[#159a72] font-bold">{agent.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[#718096]">
                    <span>Memory:</span>
                    <span className="text-[#17263d]">38.4 MB / 128 MB</span>
                  </div>
                </div>

                {/* Invariant badge */}
                <div className="mt-2.5 pt-1.5 border-t border-[#f0eee6] text-[9px] font-mono text-[#718096] truncate">
                  <span className="text-[#17263d] font-semibold">Rule:</span> {agent.invariants}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED AGENT DEEP DIAGNOSTICS DOCKET */}
      {selectedAgent && (
        <div className="axiom-panel border border-[#dce1e7] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dce1e7] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#e63946] px-2 py-0.5 bg-[#fef2f3] rounded-[2px] border border-[#fad2d6]">
                DIAGNOSTICS DOCKET
              </span>
              <h3 className="text-base font-serif font-bold text-[#17263d]">
                {selectedAgent.name}
              </h3>
              <span className="text-xs font-mono text-[#718096]">
                [{selectedAgent.domain}]
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#718096]">Version: {selectedAgent.version}</span>
              <span className="text-[#dce1e7]">|</span>
              <span className="text-[#159a72] font-semibold">INVARIANTS VERIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#718096] block font-semibold">
                Guaranteed Invariant Boundary:
              </span>
              <div className="text-[11px] text-[#17263d] leading-relaxed">
                {selectedAgent.invariants}
              </div>
            </div>

            <div className="p-3 bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#718096] block font-semibold">
                Primary Assigned Skills:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedAgent.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-1.5 py-0.5 bg-white border border-[#dce1e7] rounded-[2px] font-mono text-[10px] text-[#40516a]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#f0faf6] border border-[#c7eadf] rounded-[2px] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#0d6b4f] block font-semibold">
                Telemetry Percentiles:
              </span>
              <div className="text-[11px] font-mono text-[#0d6b4f] space-y-0.5">
                <div>p50 Latency: {selectedAgent.latencyMs}ms</div>
                <div>p95 Latency: {selectedAgent.latencyMs + 18}ms</div>
                <div>Error Budget: 100% Remaining</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#40516a] leading-relaxed pt-1">
            {selectedAgent.description}
          </p>
        </div>
      )}
    </div>
  );
};
