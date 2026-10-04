import React, { useState } from 'react';
import { OPERATIONAL_AGENTS } from '../../data/agents';
import { Agent } from '../../types/operations';
import { ShieldCheck, Activity, Users, ArrowRight } from 'lucide-react';

export interface AgentNetworkProps {
  agents?: Agent[];
  isRunning?: boolean;
  onSelectAgent?: (agent: Agent) => void;
  selectedAgentId?: string | null;
  className?: string;
}

export function AgentNetwork({
  agents = OPERATIONAL_AGENTS,
  isRunning = true,
  onSelectAgent,
  selectedAgentId,
  className = '',
}: AgentNetworkProps) {
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);

  // Deterministic SVG coordinates for the 8 nodes in execution hierarchy
  // ViewBox: 800 x 620
  const layoutNodes: Record<
    string,
    { x: number; y: number; label: string; role: string }
  > = {
    'agent-context': { x: 400, y: 50, label: 'Context Memory', role: 'Memory & State' },
    'agent-intent': { x: 400, y: 140, label: 'Intent Analyst', role: 'Language & Intent' },
    'agent-planner': { x: 400, y: 230, label: 'Workflow Planner', role: 'Orchestration DAG' },
    'agent-executor': { x: 230, y: 330, label: 'Task Executor', role: 'Atomic Mutations' },
    'agent-validator': { x: 570, y: 330, label: 'Validation Tester', role: 'Sandboxed Testing' },
    'agent-reviewer': { x: 400, y: 430, label: 'Quality Reviewer', role: 'Grounding & QA' },
    'agent-guardian': { x: 400, y: 520, label: 'Release Guardian', role: 'Human Authority' },
    'agent-sentinel': { x: 670, y: 180, label: 'Anomaly Sentinel', role: 'Security & Drift' },
  };

  // Directed edges connecting nodes
  const edges: Array<{
    from: string;
    to: string;
    type: 'active' | 'human' | 'security' | 'normal';
  }> = [
    { from: 'agent-context', to: 'agent-intent', type: 'active' },
    { from: 'agent-intent', to: 'agent-planner', type: 'active' },
    { from: 'agent-planner', to: 'agent-executor', type: 'normal' },
    { from: 'agent-planner', to: 'agent-validator', type: 'normal' },
    { from: 'agent-executor', to: 'agent-reviewer', type: 'normal' },
    { from: 'agent-validator', to: 'agent-reviewer', type: 'normal' },
    { from: 'agent-reviewer', to: 'agent-guardian', type: 'human' },
    { from: 'agent-sentinel', to: 'agent-guardian', type: 'security' },
    { from: 'agent-context', to: 'agent-sentinel', type: 'security' },
  ];

  const getEdgeStroke = (type: string) => {
    switch (type) {
      case 'active':
        return '#3569A8';
      case 'human':
        return '#B97800';
      case 'security':
        return '#B97800';
      default:
        return '#00866B';
    }
  };

  return (
    <section className={`viz-panel p-6 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            INTERACTIVE AGENT TOPOLOGY MAP
          </span>
          <h2 className="text-xl font-serif font-bold text-[#17263A] mt-0.5">
            Fleet Dependency & Dataflow Network
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#68758A] flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#3569A8]" /> Active Flow
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#B97800]" /> Human Gate Dependency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#00866B]" /> Invariant Pass
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[540px] flex items-center justify-center my-2 select-none overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-h-[540px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3569A8" />
            </marker>
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00866B" />
            </marker>
            <marker
              id="arrow-human"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#B97800" />
            </marker>
          </defs>

          {/* Background Grid Pattern */}
          <pattern
            id="network-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#D5D1C7" opacity="0.6" />
          </pattern>
          <rect width="800" height="600" fill="url(#network-grid)" />

          {/* Edges */}
          {edges.map((edge, idx) => {
            const p1 = layoutNodes[edge.from];
            const p2 = layoutNodes[edge.to];
            if (!p1 || !p2) return null;

            const strokeColor = getEdgeStroke(edge.type);
            const markerId =
              edge.type === 'active'
                ? 'url(#arrow-active)'
                : edge.type === 'human'
                ? 'url(#arrow-human)'
                : 'url(#arrow-normal)';

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={edge.type === 'active' ? 2 : 1.5}
                  strokeDasharray={edge.type === 'security' ? '4 4' : undefined}
                  markerEnd={markerId}
                  opacity={0.85}
                />

                {/* Moving Particle along active flow lines */}
                {isRunning && (edge.type === 'active' || edge.type === 'normal') && (
                  <circle r="3" fill={strokeColor} opacity={0.9}>
                    <animateMotion
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                      dur={`${1.8 + idx * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {agents.map((agent) => {
            const pos = layoutNodes[agent.id];
            if (!pos) return null;

            const isSelected = selectedAgentId === agent.id;
            const isHovered = hoveredAgent?.id === agent.id;
            const isGuardian = agent.id === 'agent-guardian';
            const radius = 34;

            return (
              <g
                key={agent.id}
                onClick={() => onSelectAgent?.(agent)}
                onMouseEnter={() => setHoveredAgent(agent)}
                onMouseLeave={() => setHoveredAgent(null)}
                className="cursor-pointer transition-transform duration-150"
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Selection halo */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 8}
                    fill="none"
                    stroke={isGuardian ? '#B97800' : '#142238'}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* Node Body */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={isGuardian ? '#FFF2CC' : '#FFFDF8'}
                  stroke={isGuardian ? '#B97800' : isSelected ? '#142238' : '#00866B'}
                  strokeWidth={isGuardian ? 2.5 : isSelected ? 2.5 : 1.8}
                  filter="drop-shadow(0px 2px 4px rgba(23, 38, 58, 0.08))"
                />

                {/* Status Dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y - 12}
                  r={4}
                  fill={
                    agent.status === 'healthy'
                      ? '#00866B'
                      : agent.status === 'running'
                      ? '#3569A8'
                      : '#B97800'
                  }
                />

                {/* Node Text */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#17263A"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {pos.label.split(' ')[0]}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 17}
                  textAnchor="middle"
                  fill="#68758A"
                  fontSize="9"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {agent.latencyMs}ms
                </text>

                {/* Subtitle pill beneath node */}
                <rect
                  x={pos.x - 55}
                  y={pos.y + radius + 6}
                  width="110"
                  height="18"
                  rx="3"
                  fill="#FBFAF6"
                  stroke="#D5D1C7"
                  strokeWidth="0.8"
                />
                <text
                  x={pos.x}
                  y={pos.y + radius + 18}
                  textAnchor="middle"
                  fill="#40516A"
                  fontSize="9"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {pos.role}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Detail Overlay Card */}
        {hoveredAgent && (
          <div className="absolute bottom-3 left-4 p-3 bg-[#142238] text-white rounded-[6px] shadow-xl text-xs font-mono max-w-sm border border-slate-700 pointer-events-none z-10">
            <div className="flex items-center justify-between text-amber-300 font-sans font-bold text-sm mb-1">
              <span>{hoveredAgent.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {hoveredAgent.successRate}% Success
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans mb-2">
              {hoveredAgent.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-700 pt-2 text-slate-300">
              <div>Domain: <strong>{hoveredAgent.domain}</strong></div>
              <div>Heartbeat: <strong>{hoveredAgent.heartbeatMs}ms</strong></div>
              <div>Tasks Done: <strong>{hoveredAgent.tasksCompleted}</strong></div>
              <div>Active Task: <strong className="text-amber-300 truncate block">{hoveredAgent.currentTask || 'Idle'}</strong></div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#D5D1C7]/70 flex items-center justify-between text-xs text-[#68758A]">
        <span>Click any node to inspect agent state, invariants, and recent telemetry</span>
        <span className="font-mono">8 of 8 Fleet Agents Synchronized</span>
      </div>
    </section>
  );
}
