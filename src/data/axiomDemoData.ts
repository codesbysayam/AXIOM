/**
 * AXIOM CANONICAL DEMO & TELEMETRY DATA MODEL
 * Single Source of Truth for Autonomous Operations
 * All screens consume this dataset to prevent conflicting statistics.
 */

export interface AxiomMetrics {
  agents: {
    total: number;
    healthy: number;
    degraded: number;
    medianLatencyMs: number;
    fleetSuccessRate: number;
    tasksCompleted: number;
  };
  pipelines: {
    total: number;
    active: number;
    gated: number;
    successRate: number;
    rollbackRate: number;
  };
  approvals: {
    pending: number;
    resolvedToday: number;
    slaMinutes: number;
  };
  executions: {
    historicalBenchmark: number;
    currentPeriodRuns: number;
    autonomousRate: number;
    interventionRate: number;
    costAvoidanceUsd: number;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  governance: {
    activePolicies: number;
    evaluationsToday: number;
    blockRate: number;
    violationsCount: number;
    strictInterceptPercent: number;
  };
  fleet: {
    availability: number;
    heartbeatIntervalMs: number;
  };
}

export const axiomDemoData: AxiomMetrics = {
  agents: {
    total: 8,
    healthy: 8,
    degraded: 0,
    medianLatencyMs: 142,
    fleetSuccessRate: 99.3,
    tasksCompleted: 186070,
  },
  pipelines: {
    total: 4,
    active: 4,
    gated: 1,
    successRate: 98.7,
    rollbackRate: 0.4,
  },
  approvals: {
    pending: 3,
    resolvedToday: 18,
    slaMinutes: 3.4,
  },
  executions: {
    historicalBenchmark: 1926,
    currentPeriodRuns: 2140,
    autonomousRate: 94.2,
    interventionRate: 5.8,
    costAvoidanceUsd: 42850,
  },
  latency: {
    p50: 142,
    p95: 420,
    p99: 890,
  },
  governance: {
    activePolicies: 4,
    evaluationsToday: 1284,
    blockRate: 2.1,
    violationsCount: 0,
    strictInterceptPercent: 100,
  },
  fleet: {
    availability: 99.98,
    heartbeatIntervalMs: 12,
  },
};
