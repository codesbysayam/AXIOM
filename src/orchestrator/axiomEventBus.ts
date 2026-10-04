import { create } from 'zustand';

export type AxiomEventType =
  | 'AGENT_STARTED'
  | 'AGENT_COMPLETED'
  | 'POLICY_EVALUATED'
  | 'POLICY_BLOCKED'
  | 'HUMAN_APPROVAL_REQUESTED'
  | 'HUMAN_APPROVED'
  | 'HUMAN_DECLINED'
  | 'EXECUTION_STARTED'
  | 'EXECUTION_FAILED'
  | 'EXECUTION_RECOVERED'
  | 'EXECUTION_COMPLETED'
  | 'INCIDENT_CREATED'
  | 'INCIDENT_RESOLVED'
  | 'AUDIT_RECORDED';

export interface AxiomEvent {
  id: string;
  type: AxiomEventType;
  timestamp: string;
  epochMs: number;
  sourceNodeId: string;
  targetNodeId?: string;
  workflowId?: string;
  executionId?: string;
  label: string;
  summary: string;
  category: 'workflow' | 'policy' | 'agent' | 'human' | 'incident' | 'audit';
  payload: {
    input?: any;
    output?: any;
    policyId?: string;
    threshold?: string | number;
    observedValue?: string | number;
    decision?: 'ALLOW' | 'WARN' | 'HUMAN_GATE' | 'BLOCK' | 'RECOVER';
    riskScore?: number;
    evidenceHash?: string;
    latencyMs?: number;
    severity?: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
    rollbackToken?: string;
  };
}

export interface AutonomyBreakdown {
  decisionIndependence: number; // weight: 0.25
  recoveryReliability: number; // weight: 0.20
  humanOversight: number; // weight: 0.15
  policyCompliance: number; // weight: 0.20
  executionReliability: number; // weight: 0.20
}

export interface SystemSnapshot {
  id: string;
  timestamp: string;
  label: string;
  activeExecutions: number;
  fleetHealth: number;
  pendingApprovals: number;
  activeIncidents: number;
  autonomyScore: number;
  agentStates: Record<string, 'healthy' | 'running' | 'degraded' | 'blocked' | 'idle'>;
  description: string;
}

export const INITIAL_SNAPSHOTS: SystemSnapshot[] = [
  {
    id: 'snap-0800',
    timestamp: '08:00:00',
    label: 'Morning Shift Baseline',
    activeExecutions: 2,
    fleetHealth: 100,
    pendingApprovals: 0,
    activeIncidents: 0,
    autonomyScore: 94.2,
    agentStates: {
      'event-ingest': 'healthy',
      'intent-analyst': 'healthy',
      'context-memory': 'healthy',
      'workflow-planner': 'healthy',
      'policy-engine': 'healthy',
      'invariant-engine': 'healthy',
      'task-executor': 'idle',
      'quality-reviewer': 'idle',
      'release-guardian': 'healthy',
      'fraud-sentinel': 'healthy',
      'human-gate': 'healthy',
      'audit-ledger': 'healthy',
    },
    description: 'Scheduled batch sync completed without policy friction. Invariants verified.',
  },
  {
    id: 'snap-1130',
    timestamp: '11:30:00',
    label: 'High Volume Traffic Surge',
    activeExecutions: 8,
    fleetHealth: 99.4,
    pendingApprovals: 2,
    activeIncidents: 0,
    autonomyScore: 92.8,
    agentStates: {
      'event-ingest': 'running',
      'intent-analyst': 'running',
      'context-memory': 'running',
      'workflow-planner': 'running',
      'policy-engine': 'running',
      'invariant-engine': 'healthy',
      'task-executor': 'running',
      'quality-reviewer': 'running',
      'release-guardian': 'healthy',
      'fraud-sentinel': 'running',
      'human-gate': 'healthy',
      'audit-ledger': 'running',
    },
    description: 'Procurement and invoice batch ingestion. 2 transactions diverted to human approval gate.',
  },
  {
    id: 'snap-1415',
    timestamp: '14:15:00',
    label: 'SEV-2 Anomaly Spike Quarantined',
    activeExecutions: 5,
    fleetHealth: 96.2,
    pendingApprovals: 3,
    activeIncidents: 1,
    autonomyScore: 89.4,
    agentStates: {
      'event-ingest': 'running',
      'intent-analyst': 'running',
      'context-memory': 'healthy',
      'workflow-planner': 'healthy',
      'policy-engine': 'degraded',
      'invariant-engine': 'healthy',
      'task-executor': 'blocked',
      'quality-reviewer': 'healthy',
      'release-guardian': 'healthy',
      'fraud-sentinel': 'running',
      'human-gate': 'healthy',
      'audit-ledger': 'healthy',
    },
    description: 'Fraud Sentinel quarantined an anomalous wire payload ($18,420). Policy Engine latency spiked.',
  },
  {
    id: 'snap-1745',
    timestamp: '17:45:00',
    label: 'Incident Recovery & Verification',
    activeExecutions: 4,
    fleetHealth: 99.1,
    pendingApprovals: 1,
    activeIncidents: 0,
    autonomyScore: 91.5,
    agentStates: {
      'event-ingest': 'healthy',
      'intent-analyst': 'healthy',
      'context-memory': 'healthy',
      'workflow-planner': 'healthy',
      'policy-engine': 'healthy',
      'invariant-engine': 'healthy',
      'task-executor': 'healthy',
      'quality-reviewer': 'healthy',
      'release-guardian': 'healthy',
      'fraud-sentinel': 'healthy',
      'human-gate': 'healthy',
      'audit-ledger': 'healthy',
    },
    description: 'Fallback policy engine verified and state reconciled. All invariants preserved.',
  },
  {
    id: 'snap-live',
    timestamp: 'LIVE (Now)',
    label: 'Real-Time Operational Fabric',
    activeExecutions: 6,
    fleetHealth: 99.7,
    pendingApprovals: 2,
    activeIncidents: 1,
    autonomyScore: 91.7,
    agentStates: {
      'event-ingest': 'running',
      'intent-analyst': 'healthy',
      'context-memory': 'healthy',
      'workflow-planner': 'healthy',
      'policy-engine': 'running',
      'invariant-engine': 'healthy',
      'task-executor': 'running',
      'quality-reviewer': 'healthy',
      'release-guardian': 'healthy',
      'fraud-sentinel': 'healthy',
      'human-gate': 'healthy',
      'audit-ledger': 'running',
    },
    description: 'Live continuous orchestration. Deterministic invariant verification active.',
  },
];

export const INITIAL_AXIOM_EVENTS: AxiomEvent[] = [
  {
    id: 'evt-101',
    type: 'POLICY_EVALUATED',
    timestamp: '12:04:18.240',
    epochMs: Date.now() - 12000,
    sourceNodeId: 'policy-engine',
    targetNodeId: 'human-gate',
    workflowId: 'wf-vendor-procurement',
    executionId: 'AX-93821',
    label: 'Policy Evaluation: FIN-042',
    summary: 'Vendor Payment #204 evaluated against Capital Outlay Boundary ($10,000 threshold).',
    category: 'policy',
    payload: {
      policyId: 'FIN-042',
      input: { vendor: 'Northwind Global Corp', invoiceAmount: 18420, poNumber: 'PO-88219' },
      threshold: '$10,000.00',
      observedValue: '$18,420.00',
      decision: 'HUMAN_GATE',
      riskScore: 0.81,
      evidenceHash: '0x8f2c3a918e99b0c2e3',
      latencyMs: 38,
    },
  },
  {
    id: 'evt-102',
    type: 'AGENT_STARTED',
    timestamp: '12:04:19.012',
    epochMs: Date.now() - 11000,
    sourceNodeId: 'intent-analyst',
    targetNodeId: 'workflow-planner',
    workflowId: 'wf-customer-refund',
    executionId: 'AX-93822',
    label: 'Intent Disambiguation',
    summary: 'Intent Analyst verified refund intent with 99.4% confidence score.',
    category: 'agent',
    payload: {
      input: 'Customer charge dispute and request for immediate credit memo',
      output: 'DISPUTE_REFUND_PROCEED',
      riskScore: 0.12,
      latencyMs: 94,
    },
  },
  {
    id: 'evt-103',
    type: 'HUMAN_APPROVAL_REQUESTED',
    timestamp: '12:04:20.150',
    epochMs: Date.now() - 9500,
    sourceNodeId: 'release-guardian',
    targetNodeId: 'human-gate',
    workflowId: 'wf-vendor-procurement',
    executionId: 'AX-93821',
    label: 'Dual-Key Authorization Gate',
    summary: 'Executive sign-off required for out-of-band disbursement exceeding $10k.',
    category: 'human',
    payload: {
      decision: 'HUMAN_GATE',
      riskScore: 0.81,
      evidenceHash: '0x7e81a3d902bf44c12',
    },
  },
  {
    id: 'evt-104',
    type: 'AGENT_COMPLETED',
    timestamp: '12:04:21.430',
    epochMs: Date.now() - 8000,
    sourceNodeId: 'task-executor',
    targetNodeId: 'audit-ledger',
    workflowId: 'wf-inventory-rebalance',
    executionId: 'AX-93819',
    label: 'Atomic ERP Inventory Rebalance',
    summary: 'Task Executor committed 1,200 SKU transfers with idempotency token IDP-9921.',
    category: 'agent',
    payload: {
      decision: 'ALLOW',
      riskScore: 0.04,
      latencyMs: 142,
      rollbackToken: 'RB-9921-A',
    },
  },
  {
    id: 'evt-105',
    type: 'INCIDENT_CREATED',
    timestamp: '12:04:22.800',
    epochMs: Date.now() - 6500,
    sourceNodeId: 'fraud-sentinel',
    targetNodeId: 'policy-engine',
    workflowId: 'wf-vendor-procurement',
    executionId: 'AX-93821',
    label: 'SEV-2 Anomaly Detected',
    summary: 'Policy Engine latency spike observed (>450ms) during high-concurrency signature check.',
    category: 'incident',
    payload: {
      severity: 'SEV-2',
      latencyMs: 462,
      decision: 'WARN',
    },
  },
  {
    id: 'evt-106',
    type: 'AUDIT_RECORDED',
    timestamp: '12:04:23.990',
    epochMs: Date.now() - 5000,
    sourceNodeId: 'audit-ledger',
    workflowId: 'wf-inventory-rebalance',
    executionId: 'AX-93819',
    label: 'Merkle Block Root Committed',
    summary: 'Cryptographic receipt sealed with SHA-256 state proof 0x4f92...a891.',
    category: 'audit',
    payload: {
      evidenceHash: '0x4f92bc31a891d09e',
      latencyMs: 12,
    },
  },
];

export function calculateAutonomyScore(breakdown: AutonomyBreakdown): number {
  const score =
    breakdown.decisionIndependence * 0.25 +
    breakdown.recoveryReliability * 0.20 +
    breakdown.humanOversight * 0.15 +
    breakdown.policyCompliance * 0.20 +
    breakdown.executionReliability * 0.20;
  return Number(score.toFixed(1));
}

interface AxiomEventBusStore {
  events: AxiomEvent[];
  activeExecutionId: string;
  activeNodeId: string | null;
  activeEdgeId: string | null;
  focusNodeId: string | null;
  isFocusModeActive: boolean;
  selectedSnapshotId: string;
  snapshots: SystemSnapshot[];
  autonomyBreakdown: AutonomyBreakdown;
  selectedEventForInspector: AxiomEvent | null;
  
  // Replay State
  isReplaying: boolean;
  replaySpeed: number;
  replayIndex: number;
  replayMax: number;
  
  // Incident Overlay State
  activeIncidentSeverity: 'SEV-1' | 'SEV-2' | 'SEV-3' | null;
  incidentDegradedNodes: string[];

  // Actions
  addEvent: (event: Omit<AxiomEvent, 'id' | 'timestamp' | 'epochMs'>) => void;
  setActiveNode: (nodeId: string | null) => void;
  setActiveEdge: (edgeId: string | null) => void;
  setFocusNode: (nodeId: string | null) => void;
  toggleFocusMode: () => void;
  setSnapshot: (snapshotId: string) => void;
  inspectEvent: (event: AxiomEvent | null) => void;
  updateAutonomyBreakdown: (partial: Partial<AutonomyBreakdown>) => void;
  
  // Replay Controls
  startReplay: () => void;
  pauseReplay: () => void;
  stepReplayForward: () => void;
  stepReplayBackward: () => void;
  setReplayIndex: (index: number) => void;
  setReplaySpeed: (speed: number) => void;
  restartReplay: () => void;

  // Incident Controls
  triggerIncidentOverlay: (severity: 'SEV-1' | 'SEV-2' | 'SEV-3', affectedNodes: string[]) => void;
  resolveIncidentOverlay: () => void;
}

export const useAxiomEventBus = create<AxiomEventBusStore>((set, get) => ({
  events: INITIAL_AXIOM_EVENTS,
  activeExecutionId: 'AX-93821',
  activeNodeId: 'policy-engine',
  activeEdgeId: 'edge-policy-human',
  focusNodeId: null,
  isFocusModeActive: false,
  selectedSnapshotId: 'snap-live',
  snapshots: INITIAL_SNAPSHOTS,
  autonomyBreakdown: {
    decisionIndependence: 94,
    recoveryReliability: 89,
    humanOversight: 96,
    policyCompliance: 98,
    executionReliability: 91,
  },
  selectedEventForInspector: INITIAL_AXIOM_EVENTS[0],

  isReplaying: false,
  replaySpeed: 1,
  replayIndex: 3,
  replayMax: 7,

  activeIncidentSeverity: 'SEV-2',
  incidentDegradedNodes: ['policy-engine', 'task-executor'],

  addEvent: (evt) => {
    const now = new Date();
    const formatted = `${now.toLocaleTimeString('en-GB', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const newEvt: AxiomEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: formatted,
      epochMs: Date.now(),
      ...evt,
    };
    set((state) => ({
      events: [newEvt, ...state.events.slice(0, 49)],
      activeNodeId: evt.sourceNodeId,
      activeEdgeId: evt.targetNodeId ? `edge-${evt.sourceNodeId}-${evt.targetNodeId}` : state.activeEdgeId,
    }));
  },

  setActiveNode: (nodeId) => set({ activeNodeId: nodeId }),
  setActiveEdge: (edgeId) => set({ activeEdgeId: edgeId }),
  
  setFocusNode: (nodeId) => {
    set((state) => ({
      focusNodeId: nodeId,
      isFocusModeActive: Boolean(nodeId),
    }));
  },

  toggleFocusMode: () => {
    set((state) => ({
      isFocusModeActive: !state.isFocusModeActive,
      focusNodeId: !state.isFocusModeActive ? state.activeNodeId || 'policy-engine' : null,
    }));
  },

  setSnapshot: (snapshotId) => {
    const snap = get().snapshots.find((s) => s.id === snapshotId);
    if (!snap) return;
    set({
      selectedSnapshotId: snapshotId,
      activeNodeId: Object.keys(snap.agentStates)[0] || null,
    });
  },

  inspectEvent: (event) => set({ selectedEventForInspector: event }),

  updateAutonomyBreakdown: (partial) => {
    set((state) => ({
      autonomyBreakdown: { ...state.autonomyBreakdown, ...partial },
    }));
  },

  startReplay: () => set({ isReplaying: true }),
  pauseReplay: () => set({ isReplaying: false }),
  stepReplayForward: () => {
    set((state) => {
      const nextIndex = Math.min(state.replayMax, state.replayIndex + 1);
      return { replayIndex: nextIndex };
    });
  },
  stepReplayBackward: () => {
    set((state) => {
      const prevIndex = Math.max(0, state.replayIndex - 1);
      return { replayIndex: prevIndex };
    });
  },
  setReplayIndex: (index) => set({ replayIndex: index }),
  setReplaySpeed: (speed) => set({ replaySpeed: speed }),
  restartReplay: () => set({ replayIndex: 0, isReplaying: true }),

  triggerIncidentOverlay: (severity, affectedNodes) => {
    set({
      activeIncidentSeverity: severity,
      incidentDegradedNodes: affectedNodes,
    });
  },

  resolveIncidentOverlay: () => {
    set({
      activeIncidentSeverity: null,
      incidentDegradedNodes: [],
    });
  },
}));
