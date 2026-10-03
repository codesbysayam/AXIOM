import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CheckSquare,
  Clock,
  PlayCircle,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { ApprovalCard } from '../components/ApprovalCard';
import { RecentWorkflowsWidget } from '../components/RecentWorkflowsWidget';
import { DecisionFabricVisualizer } from '../components/DecisionFabricVisualizer';
import { GuidedDemoTourBanner } from '../components/GuidedDemoTourBanner';
import { AgentThroughputSparkline } from '../components/AgentThroughputSparkline';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';

export const DashboardPage: React.FC = () => {
  const { workflows, approvals, cases, incidents, navigateTo } = useOperationsStore();

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const activeIncidents = incidents.filter((i) => i.status === 'active');
  const openCases = cases.filter((c) => c.status !== 'resolved');

  return (
    <div className="space-y-5">
      <GuidedDemoTourBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Operations & Fleet Overview
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Real-time multi-agent orchestration under verified human oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('demo-scenarios')}
            className="px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-200 font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <PlayCircle size={13} />
            <span>Run Test Scenarios</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('approvals')}
            className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded-md font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <CheckSquare size={13} />
            <span>Review Pending Approvals ({pendingApprovals.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Fleet</span>
            <Bot size={15} />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {AGENT_WORKFORCE.length}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% operational heartbeats</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Human Gates</span>
            <CheckSquare size={15} />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {pendingApprovals.length}
          </div>
          <div className="text-[11px] text-amber-700 flex items-center gap-1 mt-1 font-mono">
            <Clock size={12} />
            <span>Awaiting operator decision</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Workflows Active</span>
            <Workflow size={15} />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {workflows.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            <span>1,926 total executions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Containment Status</span>
            <ShieldCheck size={15} />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            100%
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-mono">
            <span>Zero invariant violations</span>
          </div>
        </div>
      </div>

      <DecisionFabricVisualizer />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Pending Human Approval Queue ({pendingApprovals.length})
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('approvals')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
            >
              <span>Manage Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
              No pending human approval requests. All agent workflows are within autonomous bounds.
            </div>
          ) : (
            pendingApprovals.map((req) => <ApprovalCard key={req.id} request={req} />)
          )}
        </div>

        <div className="space-y-4">
          <RecentWorkflowsWidget />

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                System Throughput Velocity
              </h3>
              <span className="text-[10px] font-mono text-slate-400">324 ops/min</span>
            </div>
            <AgentThroughputSparkline height={42} color="#1b2e49" />
          </div>
        </div>
      </div>
    </div>
  );
};
