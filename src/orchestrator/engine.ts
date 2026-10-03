import { AgentInfo, GovernancePolicy, WorkflowDefinition, WorkflowStep } from '../types';

export interface ExecutionResult {
  stepId: string;
  success: boolean;
  requiresHumanApproval: boolean;
  policyTriggered?: string;
  outputDescription: string;
  durationMs: number;
}

export function evaluateStepInvariants(
  step: WorkflowStep,
  agent: AgentInfo | undefined,
  policies: GovernancePolicy[],
): { allowed: boolean; requiresApproval: boolean; policyName?: string } {
  if (step.requiresApproval) {
    return {
      allowed: true,
      requiresApproval: true,
      policyName: 'POL-01: Financial Commitment Ceiling or POL-04 Sensitive Gate',
    };
  }

  // Check matching policies
  for (const pol of policies) {
    if (!pol.active) continue;

    if (pol.enforcement === 'require_human' && step.name.toLowerCase().includes('approval')) {
      return { allowed: true, requiresApproval: true, policyName: pol.name };
    }
  }

  return { allowed: true, requiresApproval: false };
}

export function simulateStepExecution(
  step: WorkflowStep,
  agent: AgentInfo | undefined,
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const duration = Math.floor(Math.random() * 400) + 200;

    setTimeout(() => {
      resolve({
        stepId: step.id,
        success: true,
        requiresHumanApproval: Boolean(step.requiresApproval),
        outputDescription: step.outputDescription || 'Executed successfully under agent supervision.',
        durationMs: duration,
      });
    }, 300);
  });
}

export function calculateFleetHealth(agents: AgentInfo[]): {
  healthScore: number;
  activeCount: number;
  avgLatency: number;
  totalCompleted: number;
} {
  const activeCount = agents.filter((a) => a.status === 'active').length;
  const avgLatency = Math.round(
    agents.reduce((acc, a) => acc + a.latencyMs, 0) / (agents.length || 1),
  );
  const totalCompleted = agents.reduce((acc, a) => acc + a.completedTasks, 0);
  const avgSuccess =
    agents.reduce((acc, a) => acc + a.successRate, 0) / (agents.length || 1);

  return {
    healthScore: Math.round(avgSuccess),
    activeCount,
    avgLatency,
    totalCompleted,
  };
}
