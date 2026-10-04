export type AgentStatus =
  | 'healthy'
  | 'running'
  | 'degraded'
  | 'offline'
  | 'active'
  | 'idle';

export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'waiting-human'
  | 'waiting_approval';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Agent {
  id: string;
  name: string;
  domain: string;
  status: AgentStatus;
  latencyMs: number;
  successRate: number;
  tasksCompleted: number;
  tasksFailed: number;
  currentTask?: string;
  currentPipeline?: string;
  heartbeatMs: number;
  tokenUsage: number;
  invariants?: string[];
  skills?: string[];
  version?: string;
  description?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  domain: string;
  risk: RiskLevel;
  status: ExecutionStatus;
  steps: number;
  totalRuns: number;
  successRate: number;
  medianLatencyMs: number;
  humanGateRequired: boolean;
  description?: string;
  lastRunAt?: string;
}

export interface ExecutionEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName?: string;
  pipelineId: string;
  pipelineName?: string;
  type:
    | 'policy'
    | 'execution'
    | 'classification'
    | 'security'
    | 'human'
    | 'audit';
  status: ExecutionStatus;
  durationMs: number;
  policyId?: string;
  message: string;
  evidenceHash?: string;
  confidence?: number;
}

export interface Approval {
  id: string;
  pipelineId: string;
  pipelineTitle?: string;
  requestedAt: string;
  risk: RiskLevel;
  policyId: string;
  title: string;
  reason: string;
  proposedAction: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  requestedBy: string;
  agentName?: string;
  amount?: string;
  target?: string;
  impact?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface OperationsMetrics {
  activePipelines: number;
  humanGatesPending: number;
  agentsOnline: number;
  totalAgents: number;
  invariantViolations: number;
  successRate: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  autonomousCompletionRate: number;
  humanInterventionRate: number;
  policyBlockRate: number;
  rollbackRate: number;
  totalRuns: number;
  costAvoided: string;
}

export interface PolicyDefinition {
  id: string;
  name: string;
  category: 'financial' | 'security' | 'compliance' | 'operational';
  status: 'active' | 'enforced' | 'paused';
  threshold: string;
  actionOnBreach: 'block' | 'escalate_human' | 'quarantine';
  evaluations24h: number;
  passRate: number;
  lastTriggered?: string;
  invariants: string[];
}

export interface AuditBlock {
  id: string;
  sequence: number;
  timestamp: string;
  actor: string;
  action: string;
  pipeline: string;
  policy: string;
  decision: string;
  hash: string;
  previousHash: string;
  evidence: string;
}
