import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  Focus,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export interface MissionNode {
  id: string;
  label: string;
  role: string;
  type: 'ingest' | 'intelligence' | 'governance' | 'execution' | 'human' | 'audit' | 'security';
  status: 'healthy' | 'running' | 'blocked' | 'degraded' | 'idle';
  latency: number;
  successRate: number;
  activeTasks: number;
  upstream: string[];
  downstream: string[];
  x: number;
  y: number;
  activePolicies: string[];
  recentEventText: string;
}

export const MISSION_NODES: MissionNode[] = [
  // Layer 1: Ingestion
  {
    id: 'event-ingest',
    label: 'Event Ingest',
    role: 'Payload Ingestion & Gateway',
    type: 'ingest',
    status: 'running',
    latency: 24,
    successRate: 99.98,
    activeTasks: 14,
    upstream: [],
    downstream: ['intent-analyst', 'context-memory'],
    x: 480,
    y: 50,
    activePolicies: ['ING-001', 'RATELIMIT-04'],
    recentEventText: 'HTTP 200 payload received: PO-88219 ($18,420)',
  },

  // Layer 2: Intelligence & Memory
  {
    id: 'intent-analyst',
    label: 'Intent Analyst',
    role: 'Language, Intent & Semantic Parsing',
    type: 'intelligence',
    status: 'healthy',
    latency: 94,
    successRate: 99.4,
    activeTasks: 4,
    upstream: ['event-ingest'],
    downstream: ['workflow-planner', 'policy-engine'],
    x: 320,
    y: 150,
    activePolicies: ['SEM-012', 'CONF-95'],
    recentEventText: 'Intent confidence 0.994: Vendor Invoice Disburse',
  },
  {
    id: 'context-memory',
    label: 'Context Memory',
    role: 'State, Entities & Temporal Graph',
    type: 'intelligence',
    status: 'healthy',
    latency: 68,
    successRate: 99.7,
    activeTasks: 6,
    upstream: ['event-ingest'],
    downstream: ['workflow-planner'],
    x: 640,
    y: 150,
    activePolicies: ['MEM-003', 'ENC-AES256'],
    recentEventText: 'Indexed 18 past transactions for Northwind Corp',
  },

  // Layer 3: Planning & Invariants
  {
    id: 'workflow-planner',
    label: 'Workflow Planner',
    role: 'DAG Synthesis & Dependency Resolution',
    type: 'intelligence',
    status: 'healthy',
    latency: 142,
    successRate: 99.2,
    activeTasks: 3,
    upstream: ['intent-analyst', 'context-memory'],
    downstream: ['policy-engine', 'invariant-engine'],
    x: 480,
    y: 240,
    activePolicies: ['DAG-NO-CYCLE', 'STEP-BOUND-10'],
    recentEventText: 'Synthesized 5-step transactional DAG for PO-88219',
  },

  // Layer 4: Governance & Policy Engine
  {
    id: 'policy-engine',
    label: 'Policy Engine',
    role: 'Rule Evaluation & Boundary Enforcement',
    type: 'governance',
    status: 'running',
    latency: 38,
    successRate: 99.8,
    activeTasks: 8,
    upstream: ['intent-analyst', 'workflow-planner'],
    downstream: ['invariant-engine', 'task-executor', 'human-gate'],
    x: 320,
    y: 340,
    activePolicies: ['FIN-042', 'SEC-009', 'GOV-SOX'],
    recentEventText: 'Evaluated FIN-042 ($10k max) -> HUMAN GATE ROUTE',
  },
  {
    id: 'invariant-engine',
    label: 'Invariant Engine',
    role: 'Mathematical Safety Proofs',
    type: 'governance',
    status: 'healthy',
    latency: 45,
    successRate: 100.0,
    activeTasks: 5,
    upstream: ['workflow-planner', 'policy-engine'],
    downstream: ['task-executor', 'fraud-sentinel'],
    x: 640,
    y: 340,
    activePolicies: ['INV-CONSERVATION', 'INV-IDEMPOTENCY'],
    recentEventText: 'Pre-condition mathematical proof validated',
  },

  // Layer 5: Security & Human Gate
  {
    id: 'fraud-sentinel',
    label: 'Fraud Sentinel',
    role: 'Anomaly Detection & Anomaly Quarantine',
    type: 'security',
    status: 'healthy',
    latency: 82,
    successRate: 99.9,
    activeTasks: 2,
    upstream: ['invariant-engine'],
    downstream: ['human-gate', 'release-guardian'],
    x: 780,
    y: 430,
    activePolicies: ['RISK-ANOMALY-08', 'GEO-SANCTION'],
    recentEventText: 'Anomaly score 0.18: within acceptable deviation',
  },
  {
    id: 'human-gate',
    label: 'Human Gate',
    role: 'Human-in-the-Loop Authority Boundary',
    type: 'human',
    status: 'blocked',
    latency: 1240,
    successRate: 100.0,
    activeTasks: 2,
    upstream: ['policy-engine', 'fraud-sentinel'],
    downstream: ['task-executor', 'release-guardian'],
    x: 480,
    y: 430,
    activePolicies: ['HUMAN-DUAL-KEY', 'AUTH-TIER-3'],
    recentEventText: 'Awaiting Operator Approval for $18,420 payout',
  },

  // Layer 6: Execution & Quality Verification
  {
    id: 'task-executor',
    label: 'Task Executor',
    role: 'Atomic API Invocation & ERP Operations',
    type: 'execution',
    status: 'running',
    latency: 165,
    successRate: 98.4,
    activeTasks: 5,
    upstream: ['policy-engine', 'invariant-engine', 'human-gate'],
    downstream: ['quality-reviewer', 'release-guardian'],
    x: 280,
    y: 530,
    activePolicies: ['EXEC-IDEMP-TOKEN', 'ROLLBACK-ENABLE'],
    recentEventText: 'Staging NetSuite ERP payment batch voucher',
  },
  {
    id: 'quality-reviewer',
    label: 'Quality Reviewer',
    role: 'Verification, Grounding & QA',
    type: 'intelligence',
    status: 'healthy',
    latency: 184,
    successRate: 99.8,
    activeTasks: 3,
    upstream: ['task-executor'],
    downstream: ['audit-ledger'],
    x: 480,
    y: 530,
    activePolicies: ['GROUNDING-99', 'STYLE-EDITORIAL'],
    recentEventText: 'Validated invoice match with purchase order hash',
  },
  {
    id: 'release-guardian',
    label: 'Release Guardian',
    role: 'Safety Checks & Rollback Safeguards',
    type: 'governance',
    status: 'healthy',
    latency: 88,
    successRate: 99.9,
    activeTasks: 2,
    upstream: ['human-gate', 'task-executor', 'fraud-sentinel'],
    downstream: ['audit-ledger'],
    x: 680,
    y: 530,
    activePolicies: ['REL-SAFE-HALT', 'SANITY-CHECK-PROD'],
    recentEventText: 'Release checklist: 6 of 6 safety checks passed',
  },

  // Layer 7: Immutable Audit Ledger
  {
    id: 'audit-ledger',
    label: 'Audit Ledger',
    role: 'Cryptographic SHA-256 Merkle Ledger',
    type: 'audit',
    status: 'running',
    latency: 16,
    successRate: 100.0,
    activeTasks: 18,
    upstream: ['quality-reviewer', 'release-guardian'],
    downstream: [],
    x: 480,
    y: 630,
    activePolicies: ['AUDIT-TAMPER-PROOF', 'MERKLE-ROOT-SIGN'],
    recentEventText: 'Block #9182 committed with SHA-256 state proof',
  },
];

export interface LiveMissionMapProps {
  onSelectNode?: (node: MissionNode) => void;
  onInspectAgent?: (agentId: string) => void;
}

export const LiveMissionMap: React.FC<LiveMissionMapProps> = ({
  onSelectNode,
  onInspectAgent,
}) => {
  const {
    activeNodeId,
    setActiveNode,
    focusNodeId,
    setFocusNode,
    isFocusModeActive,
    toggleFocusMode,
    activeIncidentSeverity,
    incidentDegradedNodes,
  } = useAxiomEventBus();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('policy-engine');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInspector, setShowInspector] = useState<boolean>(true);

  const selectedNode = useMemo(
    () => MISSION_NODES.find((n) => n.id === selectedNodeId) || MISSION_NODES[4],
    [selectedNodeId],
  );

  // Compute upstream and downstream connection set for highlighting
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return new Set<string>([
      selectedNode.id,
      ...selectedNode.upstream,
      ...selectedNode.downstream,
    ]);
  }, [selectedNode]);

  // Edges definition
  const edges = useMemo(() => {
    const list: Array<{
      id: string;
      from: MissionNode;
      to: MissionNode;
      isHighlighted: boolean;
      isActiveTraffic: boolean;
    }> = [];

    MISSION_NODES.forEach((source) => {
      source.downstream.forEach((targetId) => {
        const target = MISSION_NODES.find((n) => n.id === targetId);
        if (target) {
          const isHighlighted =
            (source.id === selectedNodeId && target.id === selectedNodeId) ||
            source.id === selectedNodeId ||
            target.id === selectedNodeId;
          const isActiveTraffic =
            (source.id === activeNodeId && target.id === 'human-gate') ||
            (source.id === 'event-ingest' && target.id === 'intent-analyst') ||
            (source.id === 'intent-analyst' && target.id === 'policy-engine') ||
            (source.id === 'task-executor' && target.id === 'audit-ledger');

          list.push({
            id: `edge-${source.id}-${target.id}`,
            from: source,
            to: target,
            isHighlighted,
            isActiveTraffic,
          });
        }
      });
    });

    return list;
  }, [selectedNodeId, activeNodeId]);

  const handleNodeClick = (node: MissionNode) => {
    setSelectedNodeId(node.id);
    setActiveNode(node.id);
    if (isFocusModeActive) {
      setFocusNode(node.id);
    }
    if (onSelectNode) {
      onSelectNode(node);
    }
  };

  const getNodeColor = (node: MissionNode) => {
    if (incidentDegradedNodes.includes(node.id)) {
      return {
        stroke: '#D72F40',
        fill: '#FFF5F5',
        badgeBg: '#FDF0ED',
        badgeText: '#D72F40',
      };
    }
    switch (node.status) {
      case 'running':
        return {
          stroke: '#08795F',
          fill: '#F0FAF6',
          badgeBg: '#E6F7F2',
          badgeText: '#08795F',
        };
      case 'blocked':
        return {
          stroke: '#B97800',
          fill: '#FFFBF0',
          badgeBg: '#FEF3D6',
          badgeText: '#8A5900',
        };
      case 'degraded':
        return {
          stroke: '#D72F40',
          fill: '#FFF5F5',
          badgeBg: '#FDF0ED',
          badgeText: '#D72F40',
        };
      case 'healthy':
      default:
        return {
          stroke: '#182536',
          fill: '#FFFFFF',
          badgeBg: '#F0F2F5',
          badgeText: '#40516A',
        };
    }
  };

  return (
    <div className="axiom-panel overflow-hidden relative flex flex-col bg-[#FFFDF8]">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#08795F] animate-pulse" />
          <div>
            <span className="eyebrow block">Interactive Topology</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Live System Mission Map & Execution Fabric
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Focus Mode Toggle */}
          <button
            type="button"
            onClick={toggleFocusMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-[3px] border transition-colors ${
              isFocusModeActive
                ? 'bg-[#182536] text-white border-[#182536]'
                : 'bg-white text-[#40516A] border-[#D5D5CE] hover:bg-[#F0EEE6]'
            }`}
            title="Focus on selected node and direct dependencies (Shortcut: F)"
          >
            <Focus size={13} />
            <span>Focus Mode {isFocusModeActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center border border-[#D5D5CE] rounded-[3px] bg-white overflow-hidden divide-x divide-[#D5D5CE]">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 hover:bg-[#F0EEE6] text-[#40516A]"
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-2 text-[10px] font-mono text-[#5E6975] flex items-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:bg-[#F0EEE6] text-[#40516A]"
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-[#F0EEE6] text-[#40516A]"
              title="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowInspector((prev) => !prev)}
            className="p-1.5 border border-[#D5D5CE] rounded-[3px] bg-white hover:bg-[#F0EEE6] text-[#40516A]"
            title={showInspector ? 'Hide Inspector' : 'Show Inspector'}
          >
            {showInspector ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Canvas + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[540px]">
        {/* SVG Topology Viewport */}
        <div className={`relative overflow-auto p-4 bg-[#FAF9F5] ${showInspector ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Subtle Grid Canvas Background */}
          <div
            className="w-full flex justify-center items-center"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
          >
            <svg
              viewBox="0 0 960 700"
              className="w-full max-w-[960px] h-[680px] select-none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.04))' }}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#8898AA" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#08795F" />
                </marker>
                <marker
                  id="arrow-highlight"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#182536" />
                </marker>

                {/* Subtle Linear Gradients */}
                <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#08795F" />
                  <stop offset="100%" stopColor="#3569A8" />
                </linearGradient>
              </defs>

              {/* Connecting Edges */}
              <g className="edges-layer">
                {edges.map((edge) => {
                  const isConnectedToSelected =
                    edge.from.id === selectedNodeId || edge.to.id === selectedNodeId;
                  const isDimmed = isFocusModeActive && !isConnectedToSelected;

                  const dx = edge.to.x - edge.from.x;
                  const dy = edge.to.y - edge.from.y;
                  // Calculate control curve
                  const pathData = `M ${edge.from.x} ${edge.from.y + 24} C ${edge.from.x} ${edge.from.y + 60}, ${edge.to.x} ${edge.to.y - 60}, ${edge.to.x} ${edge.to.y - 24}`;

                  return (
                    <g
                      key={edge.id}
                      style={{
                        opacity: isDimmed ? 0.15 : 1,
                        transition: 'opacity 0.25s ease',
                      }}
                    >
                      <path
                        d={pathData}
                        fill="none"
                        stroke={
                          edge.isActiveTraffic
                            ? 'url(#activeEdgeGradient)'
                            : isConnectedToSelected
                            ? '#182536'
                            : '#D5D5CE'
                        }
                        strokeWidth={edge.isActiveTraffic ? 2.5 : isConnectedToSelected ? 2 : 1.2}
                        strokeDasharray={edge.isActiveTraffic ? '6 4' : undefined}
                        markerEnd={
                          edge.isActiveTraffic
                            ? 'url(#arrow-active)'
                            : isConnectedToSelected
                            ? 'url(#arrow-highlight)'
                            : 'url(#arrow)'
                        }
                        className={edge.isActiveTraffic ? 'animate-[dash_1.5s_linear_infinite]' : ''}
                      />

                      {/* Moving pulse dot on active edges */}
                      {edge.isActiveTraffic && (
                        <circle r="4" fill="#08795F">
                          <animateMotion path={pathData} dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Node Elements */}
              <g className="nodes-layer">
                {MISSION_NODES.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const isUpstream = selectedNode?.upstream.includes(node.id);
                  const isDownstream = selectedNode?.downstream.includes(node.id);
                  const isConnected = isSelected || isUpstream || isDownstream;
                  const isDimmed = isFocusModeActive && !isConnected;
                  const colors = getNodeColor(node);
                  const isDegraded = incidentDegradedNodes.includes(node.id);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => handleNodeClick(node)}
                      className="cursor-pointer group"
                      style={{
                        opacity: isDimmed ? 0.18 : 1,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Selection Glow / Pulse */}
                      {isSelected && (
                        <rect
                          x="-88"
                          y="-26"
                          width="176"
                          height="52"
                          rx="5"
                          fill="none"
                          stroke="#182536"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Upstream / Downstream indicators */}
                      {isUpstream && !isSelected && (
                        <rect
                          x="-84"
                          y="-24"
                          width="168"
                          height="48"
                          rx="4"
                          fill="none"
                          stroke="#3569A8"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}
                      {isDownstream && !isSelected && (
                        <rect
                          x="-84"
                          y="-24"
                          width="168"
                          height="48"
                          rx="4"
                          fill="none"
                          stroke="#08795F"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Main Node Card */}
                      <rect
                        x="-80"
                        y="-22"
                        width="160"
                        height="44"
                        rx="3"
                        fill={colors.fill}
                        stroke={isSelected ? '#182536' : colors.stroke}
                        strokeWidth={isSelected ? '2' : '1.2'}
                        className="transition-colors group-hover:stroke-[#182536]"
                      />

                      {/* Status Indicator Dot */}
                      <circle
                        cx="-66"
                        cy="0"
                        r="4"
                        fill={
                          isDegraded
                            ? '#D72F40'
                            : node.status === 'running'
                            ? '#08795F'
                            : node.status === 'blocked'
                            ? '#B97800'
                            : '#5E6975'
                        }
                      />

                      {/* Node Label */}
                      <text
                        x="-54"
                        y="-2"
                        className="text-[11px] font-sans font-semibold fill-[#182536]"
                        dominantBaseline="central"
                      >
                        {node.label}
                      </text>

                      {/* Sub-label / Latency */}
                      <text
                        x="-54"
                        y="12"
                        className="text-[9px] font-mono fill-[#5E6975]"
                        dominantBaseline="central"
                      >
                        {node.latency}ms · {node.successRate}%
                      </text>

                      {/* Incident Badge if Degraded */}
                      {isDegraded && (
                        <g transform="translate(62, -18)">
                          <circle r="7" fill="#D72F40" />
                          <text
                            x="0"
                            y="1"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[8px] font-mono fill-white font-bold"
                          >
                            !
                          </text>
                        </g>
                      )}

                      {/* Upstream/Downstream pill badges */}
                      {isUpstream && (
                        <text
                          x="70"
                          y="18"
                          textAnchor="end"
                          className="text-[8px] font-mono font-bold fill-[#3569A8]"
                        >
                          UP
                        </text>
                      )}
                      {isDownstream && (
                        <text
                          x="70"
                          y="18"
                          textAnchor="end"
                          className="text-[8px] font-mono font-bold fill-[#08795F]"
                        >
                          DOWN
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Quick Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E5E3DB] text-[11px] font-sans text-[#5E6975]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#08795F]" /> Running
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#182536]" /> Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B97800]" /> Blocked / Gate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D72F40]" /> Degraded (SEV)
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#5E6975]">
              Click node to inspect · Press F for focus
            </div>
          </div>
        </div>

        {/* Right Side Inspector Panel */}
        {showInspector && selectedNode && (
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#D5D5CE] p-4 bg-[#FFFDF8] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#E5E3DB] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="eyebrow">{selectedNode.type} Node</span>
                    <span
                      className={`text-[10px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded-[2px] ${
                        incidentDegradedNodes.includes(selectedNode.id)
                          ? 'bg-[#FDF0ED] text-[#D72F40]'
                          : selectedNode.status === 'running'
                          ? 'bg-[#E6F7F2] text-[#08795F]'
                          : selectedNode.status === 'blocked'
                          ? 'bg-[#FEF3D6] text-[#8A5900]'
                          : 'bg-[#F0F2F5] text-[#40516A]'
                      }`}
                    >
                      {incidentDegradedNodes.includes(selectedNode.id)
                        ? 'DEGRADED'
                        : selectedNode.status}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-semibold text-[#182536] mt-0.5">
                    {selectedNode.label}
                  </h4>
                  <p className="text-xs text-[#5E6975] font-sans mt-0.5">
                    {selectedNode.role}
                  </p>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 border border-[#E5E3DB] rounded-[4px] p-2.5 bg-[#FAF9F5]">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Latency</span>
                  <span className="text-xs font-mono font-semibold text-[#182536] block mt-0.5">
                    {selectedNode.latency}ms
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Success Rate</span>
                  <span className="text-xs font-mono font-semibold text-[#08795F] block mt-0.5">
                    {selectedNode.successRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Active Runs</span>
                  <span className="text-xs font-mono font-semibold text-[#182536] block mt-0.5">
                    0{selectedNode.activeTasks}
                  </span>
                </div>
              </div>

              {/* Active Policies */}
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-[#5E6975] tracking-wider block mb-1.5">
                  Enforced Policies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.activePolicies.map((pol) => (
                    <span
                      key={pol}
                      className="px-2 py-0.5 text-[11px] font-mono bg-white border border-[#D5D5CE] text-[#182536] rounded-[2px]"
                    >
                      {pol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dependencies List */}
              <div className="space-y-2 text-xs font-sans">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#5E6975] block mb-1">
                    Upstream Dependencies ({selectedNode.upstream.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.upstream.length === 0 ? (
                      <span className="text-xs text-[#8898AA] italic">Root Gateway (None)</span>
                    ) : (
                      selectedNode.upstream.map((upId) => {
                        const n = MISSION_NODES.find((item) => item.id === upId);
                        return (
                          <button
                            key={upId}
                            type="button"
                            onClick={() => handleNodeClick(n!)}
                            className="px-2 py-0.5 text-[10px] font-sans bg-[#F0F4FA] text-[#3569A8] rounded-[2px] border border-[#C5D5EB] hover:bg-[#E3EDFA]"
                          >
                            ↑ {n?.label || upId}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#5E6975] block mb-1">
                    Downstream Targets ({selectedNode.downstream.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.downstream.length === 0 ? (
                      <span className="text-xs text-[#8898AA] italic">Terminal Node (Commit Root)</span>
                    ) : (
                      selectedNode.downstream.map((downId) => {
                        const n = MISSION_NODES.find((item) => item.id === downId);
                        return (
                          <button
                            key={downId}
                            type="button"
                            onClick={() => handleNodeClick(n!)}
                            className="px-2 py-0.5 text-[10px] font-sans bg-[#F0FAF6] text-[#08795F] rounded-[2px] border border-[#C3E6DB] hover:bg-[#DDF4EC]"
                          >
                            ↓ {n?.label || downId}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Event Box */}
              <div className="p-2.5 rounded-[4px] bg-[#F7F5EE] border border-[#E5E3DB]">
                <span className="text-[9px] font-mono uppercase text-[#5E6975] block">
                  Last State Transition
                </span>
                <p className="text-xs font-mono text-[#182536] mt-1 leading-snug">
                  {selectedNode.recentEventText}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E5E3DB] flex items-center gap-2">
              {onInspectAgent && (
                <button
                  type="button"
                  onClick={() => onInspectAgent(selectedNode.id)}
                  className="axiom-btn-secondary w-full py-1.5 text-xs text-center justify-center"
                >
                  <Cpu size={12} />
                  <span>Open Digital Twin</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
