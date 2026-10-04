import React, { useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export type GraphNodeType =
  | 'input'
  | 'agent'
  | 'policy'
  | 'execution'
  | 'human-gate'
  | 'audit';

export type GraphNodeStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'blocked'
  | 'failed';

export interface GraphNode {
  id: string;
  stepCode: string;
  label: string;
  type: GraphNodeType;
  status: GraphNodeStatus;
  agent?: string;
  domain?: string;
  metadata?: string;
  rule?: string;
  latency?: string;
  badgeText?: string;
  substatus?: string;
  detailPayload?: {
    input?: string;
    output?: string;
    checks?: string[];
    duration?: number;
    skill?: string;
  };
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  type?: 'normal' | 'approval' | 'recovery';
}

export interface SimulationExecutionMapProps {
  currentPhaseIndex: number;
  isRunning: boolean;
  scenarioTitle: string;
  hasHumanGate?: boolean;
  isRolledBack?: boolean;
  onNodeClick?: (
    nodeId: string,
    nodeName: string,
    extra?: {
      agent?: string;
      skill?: string;
      status?: string;
      input?: string;
      output?: string;
      checks?: string[];
      duration?: number;
      timestamp?: string;
    },
  ) => void;
}

interface NodeCardProps {
  node: GraphNode;
  onClick?: () => void;
  className?: string;
}

const NodeCardComponent: React.FC<NodeCardProps> = ({
  node,
  onClick,
  className = '',
}) => {
  const isHumanGate = node.type === 'human-gate';
  const isCompleted = node.status === 'completed';
  const isRunning = node.status === 'running';
  const isBlocked = node.status === 'blocked';
  const isPending = node.status === 'pending';
  const isHeld = isHumanGate && isRunning;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`graph-node-btn ${
        isHumanGate ? 'is-human-gate' : ''
      } ${isHeld ? 'is-held' : ''} ${
        isCompleted
          ? 'is-completed'
          : isRunning
          ? 'is-running'
          : isBlocked
          ? 'is-blocked'
          : isPending
          ? 'is-pending'
          : ''
      } ${className}`}
      aria-label={`Inspect ${node.label} (${node.status})`}
    >
      {/* Top Meta Header */}
      <div className="node-top-meta">
        <span className="flex items-center gap-1.5 font-semibold">
          {isHumanGate ? (
            <span className="text-[#9A6900] flex items-center gap-1 font-bold">
              <ShieldAlert size={11} /> {node.stepCode}
            </span>
          ) : (
            <span>{node.stepCode}</span>
          )}
        </span>

        {/* Status Indicator */}
        <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[#08795F] font-bold">
              <CheckCircle2 size={11} />
              <span>{node.badgeText || 'COMPLETED'}</span>
            </span>
          ) : isRunning ? (
            isHumanGate ? (
              <span className="px-1.5 py-0.5 bg-[#9A6900] text-white rounded-[2px] font-bold text-[8px] animate-pulse">
                {node.badgeText || 'GATE HELD'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#182536] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#182536] animate-ping" />
                <span>{node.badgeText || 'RUNNING'}</span>
              </span>
            )
          ) : isBlocked ? (
            <span className="inline-flex items-center gap-1 text-[#B52D3D] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B52D3D]" />
              <span>{node.badgeText || 'PAUSED'}</span>
            </span>
          ) : (
            <span className="text-[#5E6975]">
              {node.badgeText || 'PENDING'}
            </span>
          )}
        </div>
      </div>

      {/* Node Title & Description */}
      <div>
        <div className="node-title">{node.label}</div>
        <div className="node-desc">{node.domain || node.metadata}</div>
      </div>

      {/* Bottom Metadata Footer */}
      <div className="node-bottom-meta">
        <span className="truncate max-w-[240px]">
          {node.agent ? `Agent: ${node.agent}` : node.rule ? `Rule: ${node.rule}` : node.metadata}
        </span>
        <span className="font-mono text-[10px] font-medium flex-shrink-0">
          {node.substatus || node.latency || (isCompleted ? 'verified' : 'staged')}
        </span>
      </div>
    </button>
  );
};

export const PipelineNode = React.memo(NodeCardComponent);

export const SimulationExecutionMap: React.FC<SimulationExecutionMapProps> = ({
  currentPhaseIndex,
  isRunning,
  scenarioTitle,
  hasHumanGate = true,
  isRolledBack = false,
  onNodeClick,
}) => {
  // Deterministic Graph State Model based on current phase and flags
  const graphNodes = useMemo<{
    input: GraphNode;
    context: GraphNode;
    intent: GraphNode;
    policy: GraphNode;
    execution: GraphNode;
    humanGate: GraphNode;
    audit: GraphNode;
  }>(() => {
    // 0: Ingest & Context
    // 1: Intent
    // 2: Policy
    // 3: Decision Branch (Execution / Human Gate)
    // 4: Audit & Provenance Commit

    // Row 1: INPUT
    const input: GraphNode = {
      id: 'input',
      stepCode: 'NODE 01 / INPUT',
      label: 'Event Payload Ingestion',
      type: 'input',
      status: currentPhaseIndex >= 0 ? 'completed' : 'pending',
      agent: 'Ingest Router',
      domain: 'Gateway & Normalization',
      latency: '12ms',
      badgeText: currentPhaseIndex >= 0 ? 'COMPLETED' : 'PENDING',
      substatus: 'schema-valid',
      detailPayload: {
        input: 'Inbound raw event payload',
        output: 'Normalized canonical event vector',
        checks: ['JSON schema strict validation', 'Envelope integrity check', 'Idempotency key verified'],
        duration: 12,
        skill: 'Gateway & Normalization',
      },
    };

    // Row 2: CONTEXT
    const context: GraphNode = {
      id: 'context',
      stepCode: 'NODE 02 / CONTEXT',
      label: 'Context Memory Agent',
      type: 'agent',
      status:
        currentPhaseIndex >= 1
          ? 'completed'
          : currentPhaseIndex === 0 && isRunning
          ? 'running'
          : 'pending',
      agent: 'Context Memory Agent',
      domain: 'Memory & State',
      latency: '88ms',
      badgeText:
        currentPhaseIndex >= 1
          ? 'COMPLETED'
          : currentPhaseIndex === 0 && isRunning
          ? 'RUNNING'
          : 'PENDING',
      substatus: currentPhaseIndex >= 1 ? 'cache-hit' : 'retrieving',
      detailPayload: {
        input: 'Session identifier and customer reference context',
        output: 'Durable session history, ledger balances, and active permission scope',
        checks: ['Zero memory leak across session boundary', 'TLS 1.3 encrypted vector store pass'],
        duration: 88,
        skill: 'Requirement Analysis',
      },
    };

    // Row 3: INTENT
    const intent: GraphNode = {
      id: 'intent',
      stepCode: 'NODE 03 / INTENT',
      label: 'Intent Analyst',
      type: 'agent',
      status:
        currentPhaseIndex >= 2
          ? 'completed'
          : currentPhaseIndex === 1 && isRunning
          ? 'running'
          : 'pending',
      agent: 'Intent Analyst',
      domain: 'Language & Intent',
      latency: '34ms',
      badgeText:
        currentPhaseIndex >= 2
          ? 'COMPLETED'
          : currentPhaseIndex === 1 && isRunning
          ? 'RUNNING'
          : 'PENDING',
      substatus: '99.4% conf',
      detailPayload: {
        input: 'Structured intent parameter extraction',
        output: 'Classified operational action vector with confidence 0.994',
        checks: ['Explicit confidence scoring pass', 'Prompt injection sanity guard'],
        duration: 34,
        skill: 'Intent Classification',
      },
    };

    // Row 4: POLICY
    const policy: GraphNode = {
      id: 'policy',
      stepCode: 'NODE 04 / INVARIANT CHECK',
      label: 'Invariant Policy Boundary Engine',
      type: 'policy',
      status:
        currentPhaseIndex >= 3
          ? 'completed'
          : currentPhaseIndex === 2 && isRunning
          ? 'running'
          : 'pending',
      domain: 'Policy Boundary Engine',
      rule: 'POL-FIN-01 / POL-SEC-02',
      badgeText:
        currentPhaseIndex >= 3
          ? 'COMPLETED'
          : currentPhaseIndex === 2 && isRunning
          ? 'EVALUATING'
          : 'PENDING',
      substatus: currentPhaseIndex >= 3 ? 'fail-closed passed' : 'evaluating bounds',
      detailPayload: {
        input: 'Classification parameters & transaction threshold values',
        output: 'Boundary validation pass; routed to human gate per policy threshold',
        checks: ['Hard invariant boundary check', 'Sandboxed AST policy validation pass'],
        duration: 480,
        skill: 'Hard Boundary Enforcement',
      },
    };

    // Row 5: BRANCH - LEFT (AUTONOMOUS EXECUTION)
    let executionStatus: GraphNodeStatus = 'pending';
    let executionBadge = 'PENDING';
    let executionSubstatus = 'Standing by';

    if (currentPhaseIndex >= 4) {
      if (isRolledBack) {
        executionStatus = 'failed';
        executionBadge = 'BLOCKED';
        executionSubstatus = 'Rollback initiated';
      } else {
        executionStatus = 'completed';
        executionBadge = 'RELEASED';
        executionSubstatus = 'Atomic dispatch committed';
      }
    } else if (currentPhaseIndex === 3) {
      if (hasHumanGate) {
        executionStatus = 'blocked';
        executionBadge = 'PAUSED';
        executionSubstatus = 'Awaiting human authorization';
      } else {
        executionStatus = 'running';
        executionBadge = 'DISPATCHING';
        executionSubstatus = 'Routine execution pass';
      }
    }

    const execution: GraphNode = {
      id: 'execute',
      stepCode: 'AUTONOMOUS PATH',
      label: 'Direct Task Executor',
      type: 'execution',
      status: executionStatus,
      agent: 'Task Executor',
      domain: 'Autonomous Execution & Dispatch',
      badgeText: executionBadge,
      substatus: executionSubstatus,
      detailPayload: {
        input: 'Validated operation payload with idempotency token #TXN-7712',
        output: executionStatus === 'completed' ? 'Atomic API invocation committed' : 'Execution held at boundary',
        checks: ['Idempotency token mandatory', 'Automatic rollback handler armed'],
        duration: 145,
        skill: 'Atomic API Invocation',
      },
    };

    // Row 5: BRANCH - RIGHT (HUMAN AUTHORITY GATE)
    let humanStatus: GraphNodeStatus = 'pending';
    let humanBadge = 'ARMED';
    let humanSubstatus = 'Operator Sign-off: Mandatory';

    if (currentPhaseIndex >= 4) {
      if (isRolledBack) {
        humanStatus = 'blocked';
        humanBadge = 'DECLINED';
        humanSubstatus = 'Execution rejected by operator';
      } else {
        humanStatus = 'completed';
        humanBadge = 'AUTHORIZED';
        humanSubstatus = 'Operator sign-off verified';
      }
    } else if (currentPhaseIndex === 3) {
      if (hasHumanGate) {
        humanStatus = 'running';
        humanBadge = 'GATE HELD';
        humanSubstatus = 'Operator sign-off required';
      } else {
        humanStatus = 'completed';
        humanBadge = 'PASSED';
        humanSubstatus = 'Autonomous threshold pass';
      }
    }

    const humanGate: GraphNode = {
      id: 'human',
      stepCode: 'HUMAN AUTHORITY',
      label: 'Release Guardian Gate',
      type: 'human-gate',
      status: humanStatus,
      agent: 'Release Guardian',
      domain: 'Human Authority & Decision Routing',
      badgeText: humanBadge,
      substatus: humanSubstatus,
      detailPayload: {
        input: 'High-risk transaction approval packet for Lead Operator',
        output: humanStatus === 'completed' ? 'Human authorization token granted' : 'Pending operator decision',
        checks: ['All high-risk actions halt pending operator review', 'Tamper-evident checksum signed'],
        duration: 88,
        skill: 'Human Gate Routing',
      },
    };

    // Row 6: AUDIT COMMIT
    const auditStatus: GraphNodeStatus =
      currentPhaseIndex >= 4 && !isRunning ? 'completed' : 'pending';

    const audit: GraphNode = {
      id: 'audit',
      stepCode: 'NODE 05 / AUDIT COMMIT',
      label: 'Immutable SHA-256 Ledger Provenance',
      type: 'audit',
      status: auditStatus,
      domain: 'Immutable Cryptographic Ledger',
      latency: 'sha256-verified',
      badgeText: auditStatus === 'completed' ? 'VERIFIED' : 'PENDING',
      substatus: auditStatus === 'completed' ? 'Merkle proof signed' : 'Append lock staged',
      detailPayload: {
        input: 'Signed state transition payload with previous block digest',
        output: 'SHA-256 Merkle leaf committed: sha256-e8b3a019482f..',
        checks: ['Cryptographic hash chain verified', 'Zero mutable state bypass'],
        duration: 24,
        skill: 'Audit Trail Serialization',
      },
    };

    return {
      input,
      context,
      intent,
      policy,
      execution,
      humanGate,
      audit,
    };
  }, [currentPhaseIndex, isRunning, hasHumanGate, isRolledBack]);

  const handleNodeClick = (node: GraphNode) => {
    onNodeClick?.(node.id, node.label, {
      agent: node.agent || 'Orchestration Engine',
      skill: node.detailPayload?.skill || node.domain,
      status: node.status,
      input: node.detailPayload?.input,
      output: node.detailPayload?.output,
      checks: node.detailPayload?.checks,
      duration: node.detailPayload?.duration,
      timestamp: '12:03:18.240',
    });
  };

  return (
    <div className="execution-topology border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] overflow-hidden shadow-2xs">
      {/* Topology Header */}
      <div className="p-3.5 bg-[#FAF9F5] border-b border-[#D5D5CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#08795F]" />
          <span className="text-xs font-serif font-bold text-[#182536]">
            AXIOM EXECUTION TOPOLOGY
          </span>
          <span className="text-[10px] font-mono text-[#5E6975]">
            (Deterministic DAG & Human Authority Boundary)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#08795F]" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#182536]" /> Running
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9A6900]" /> Human Gate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B52D3D]" /> Paused / Blocked
          </span>
        </div>
      </div>

      {/* Main Orchestration Canvas */}
      <div
        className="p-8 overflow-x-auto min-w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #d7d5cc 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="execution-topology-inner">
          <div className="graph-layout">
            {/* ROW 01: INPUT */}
            <PipelineNode
              node={graphNodes.input}
              onClick={() => handleNodeClick(graphNodes.input)}
            />

            {/* VERTICAL CONNECTOR */}
            <div className="graph-edge-vertical" aria-hidden="true" />

            {/* ROW 02: CONTEXT MEMORY AGENT */}
            <PipelineNode
              node={graphNodes.context}
              onClick={() => handleNodeClick(graphNodes.context)}
            />

            {/* VERTICAL CONNECTOR */}
            <div className="graph-edge-vertical" aria-hidden="true" />

            {/* ROW 03: INTENT ANALYST */}
            <PipelineNode
              node={graphNodes.intent}
              onClick={() => handleNodeClick(graphNodes.intent)}
            />

            {/* VERTICAL CONNECTOR */}
            <div className="graph-edge-vertical" aria-hidden="true" />

            {/* ROW 04: INVARIANT POLICY BOUNDARY */}
            <PipelineNode
              node={graphNodes.policy}
              onClick={() => handleNodeClick(graphNodes.policy)}
            />

            {/* BRANCH CONNECTOR (ROW 04 to ROW 05) */}
            <div className="graph-branch" aria-hidden="true">
              <span className="branch-trunk" />
              <span className="branch-horizontal" />
              <span className="branch-left" />
              <span className="branch-tag branch-tag-pass">PASS</span>
              <span className="branch-right" />
              <span className="branch-tag branch-tag-review">REVIEW</span>
            </div>

            {/* ROW 05: BRANCH STAGE (AUTONOMOUS TASK vs HUMAN GATE AUTHORITY) */}
            <div className="branch-stage">
              {/* Left Branch: Autonomous Execution */}
              <PipelineNode
                node={graphNodes.execution}
                onClick={() => handleNodeClick(graphNodes.execution)}
              />

              {/* Right Branch: Human Gate Authority */}
              <PipelineNode
                node={graphNodes.humanGate}
                onClick={() => handleNodeClick(graphNodes.humanGate)}
              />
            </div>

            {/* REJOIN CONNECTOR (ROW 05 to ROW 06) */}
            <div className="graph-branch-rejoin" aria-hidden="true">
              <span className="rejoin-left" />
              <span className="rejoin-right" />
              <span className="rejoin-horizontal" />
              <span className="rejoin-trunk" />
            </div>

            {/* ROW 06: AUDIT COMMIT */}
            <PipelineNode
              node={graphNodes.audit}
              onClick={() => handleNodeClick(graphNodes.audit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
