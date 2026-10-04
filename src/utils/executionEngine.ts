export type ExecutionStatus =
  | 'idle'
  | 'running'
  | 'waiting-human'
  | 'completed'
  | 'failed'
  | 'rolled-back';

export type NodeStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'rolled-back';

export interface ExecutionNode {
  id: string;
  title: string;
  agent: string;
  status: NodeStatus;
  durationMs: number;
  input: string;
  output: string;
  policy?: string;
  timestamp?: string;
  evidenceHash?: string;
}

export interface ExecutionState {
  workflowId: string;
  status: ExecutionStatus;
  currentNode: number;
  startedAt: number | null;
  nodes: ExecutionNode[];
}

export const INITIAL_EXECUTION_NODES: ExecutionNode[] = [
  {
    id: 'node-01',
    title: 'Event Payload Ingestion',
    agent: 'Intent Analyst',
    status: 'pending',
    durationMs: 42,
    input: 'Vendor Invoice #INV-2026-881 ($28,450.00 USD)',
    output: 'Structured parameters parsed with 99.4% confidence',
    policy: 'POL-DATA-03 (Payload schema verified)',
    timestamp: '12:03:18.240',
    evidenceHash: 'sha256-e91c4a..72f',
  },
  {
    id: 'node-02',
    title: 'Context & State Resolution',
    agent: 'Context Memory Agent',
    status: 'pending',
    durationMs: 88,
    input: 'Supplier ID: Apex Datacenter Systems (Vendor #9921)',
    output: 'Retrieved 14 historical transactions. Account status: Active',
    policy: 'POL-OPS-03 (State consistency invariant preserved)',
    timestamp: '12:03:18.328',
    evidenceHash: 'sha256-b841fc..31a',
  },
  {
    id: 'node-03',
    title: 'Invariant Boundary Evaluation',
    agent: 'Quality Reviewer',
    status: 'pending',
    durationMs: 140,
    input: 'Evaluating $28,450 disbursement against authority threshold',
    output: 'Threshold breach: Exceeds $10,000 threshold. Invariant held.',
    policy: 'POL-FIN-01 (Mandatory Operator sign-off required)',
    timestamp: '12:03:18.468',
    evidenceHash: 'sha256-f28ca9..88c',
  },
  {
    id: 'node-04',
    title: 'Human Release Gate',
    agent: 'Release Guardian',
    status: 'pending',
    durationMs: 0,
    input: 'Approval Request #APPR-901 awaiting Lead Operator signature',
    output: 'Execution paused. Operator authorization required to proceed.',
    policy: 'POL-SEC-02 (Inviolable Human Oversight boundary)',
    timestamp: '12:03:18.608',
    evidenceHash: 'sha256-a94f8b..e31',
  },
  {
    id: 'node-05',
    title: 'Atomic Transaction Dispatch',
    agent: 'Task Executor',
    status: 'pending',
    durationMs: 220,
    input: 'Disburse wire transfer to verified escrow account',
    output: 'Payment processed with transaction token #TX-99028',
    policy: 'POL-OPS-04 (Idempotency token mandatory)',
    timestamp: '12:03:18.828',
    evidenceHash: 'sha256-c71b09..f92',
  },
  {
    id: 'node-06',
    title: 'Immutable Audit Ledger Commit',
    agent: 'Validation Tester',
    status: 'pending',
    durationMs: 65,
    input: 'Cryptographic proof serialization of all state transitions',
    output: 'SHA-256 Merkle root appended to audit ledger',
    policy: 'POL-AUD-01 (Tamper-evident state proof verified)',
    timestamp: '12:03:18.893',
    evidenceHash: 'sha256-4927cb..003',
  },
];

export function createInitialExecutionState(workflowId = 'wf-vendor-procurement'): ExecutionState {
  return {
    workflowId,
    status: 'idle',
    currentNode: 0,
    startedAt: null,
    nodes: INITIAL_EXECUTION_NODES.map((node) => ({ ...node, status: 'pending' })),
  };
}

export function advanceExecution(state: ExecutionState): ExecutionState {
  if (state.status !== 'running') {
    return state;
  }

  const nodes = [...state.nodes];
  const current = nodes[state.currentNode];

  if (!current) {
    return {
      ...state,
      status: 'completed',
    };
  }

  if (current.status === 'pending') {
    nodes[state.currentNode] = {
      ...current,
      status: 'running',
    };

    return {
      ...state,
      nodes,
    };
  }

  if (current.status === 'running') {
    // If this node is a human gate, pause execution and wait for human authorization
    if (
      current.title.toLowerCase().includes('human') ||
      current.title.toLowerCase().includes('gate') ||
      current.agent.toLowerCase().includes('guardian')
    ) {
      nodes[state.currentNode] = {
        ...current,
        status: 'blocked',
      };
      return {
        ...state,
        nodes,
        status: 'waiting-human',
      };
    }

    nodes[state.currentNode] = {
      ...current,
      status: 'completed',
    };

    const nextIndex = state.currentNode + 1;

    if (nextIndex >= nodes.length) {
      return {
        ...state,
        nodes,
        status: 'completed',
      };
    }

    nodes[nextIndex] = {
      ...nodes[nextIndex],
      status: 'running',
    };

    return {
      ...state,
      nodes,
      currentNode: nextIndex,
    };
  }

  return state;
}

export function resumeExecutionFromGate(state: ExecutionState): ExecutionState {
  const nodes = [...state.nodes];
  const current = nodes[state.currentNode];

  if (current) {
    nodes[state.currentNode] = {
      ...current,
      status: 'completed',
      output: 'Authorized by Lead Operator. Gate released.',
    };
  }

  const nextIndex = state.currentNode + 1;
  if (nextIndex >= nodes.length) {
    return {
      ...state,
      nodes,
      status: 'completed',
    };
  }

  nodes[nextIndex] = {
    ...nodes[nextIndex],
    status: 'running',
  };

  return {
    ...state,
    nodes,
    currentNode: nextIndex,
    status: 'running',
  };
}

export function rollbackExecution(state: ExecutionState, reason = 'Operator declined authorization'): ExecutionState {
  const nodes = state.nodes.map((node, idx) => {
    if (idx === state.currentNode) {
      return {
        ...node,
        status: 'failed' as NodeStatus,
        output: `Halted: ${reason}. Invariant preserved.`,
      };
    }
    if (node.status === 'completed' || node.status === 'running') {
      return {
        ...node,
        status: 'rolled-back' as NodeStatus,
        output: 'State reverted via idempotent compensation transaction.',
      };
    }
    return node;
  });

  return {
    ...state,
    nodes,
    status: 'rolled-back',
  };
}
