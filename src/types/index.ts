export type AgentStatus = 'active' | 'idle' | 'busy' | 'standby' | 'paused';

export interface AgentInfo {
  id: string;
  name: string;
  domain: string;
  status: AgentStatus;
  description: string;
  version: string;
  successRate: number;
  completedTasks: number;
  skills: string[];
  latencyMs: number;
  invariants: string[];
}

export interface SkillInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  assignedAgents: string[];
  deterministic: boolean;
  requiresHumanReview: boolean;
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  assignedAgent: string;
  requiredSkill: string;
  status: StepStatus;
  inputDescription: string;
  outputDescription?: string;
  executedAt?: string;
  executionDurationMs?: number;
  requiresApproval?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'draft' | 'running' | 'paused';
  totalRuns: number;
  lastRunAt?: string;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  workflowTitle: string;
  stepId: string;
  stepName: string;
  agentName: string;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
  requestedAt: string;
  summary: string;
  proposedAction: string;
  policyTriggered: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  workflowId?: string;
  agentName: string;
  action: string;
  outcome: 'success' | 'warning' | 'policy_block' | 'human_override';
  details: string;
  hash: string;
}

export interface CaseItem {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'triaging' | 'human_review' | 'resolved';
  assignedAgent: string;
  createdAt: string;
  summary: string;
  recommendedResolution?: string;
}

export interface IncidentItem {
  id: string;
  title: string;
  severity: 'minor' | 'major' | 'critical';
  agentInvolved: string;
  workflowId?: string;
  status: 'active' | 'contained' | 'resolved';
  detectedAt: string;
  rootCause: string;
  remedyAction: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  scope: string;
  enforcement: 'strict_block' | 'require_human' | 'audit_log';
  description: string;
  active: boolean;
  violationCount: number;
}
