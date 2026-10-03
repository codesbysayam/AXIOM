import React from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CheckSquare,
  Clock,
  Layers,
  Lock,
  Play,
  PlayCircle,
  Radio,
  Shield,
  ShieldCheck,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { ApprovalCard } from '../components/ApprovalCard';
import { StatusBadge } from '../components/StatusBadge';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';

export const DashboardPage: React.FC = () => {
  const { workflows, approvals, cases, incidents, auditLogs, navigateTo, runWorkflow } =
    useOperationsStore();

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const activeIncidents = incidents.filter((i) => i.status === 'active');

  const STAGES = [
    { num: '01', name: 'Plan', agent: 'Workflow Planner', role: 'DAG Decomposition', status: 'verified' },
    { num: '02', name: 'Validate', agent: 'Validation Tester', role: 'Invariant Sandbox', status: 'verified' },
    { num: '03', name: 'Execute', agent: 'Task Executor', role: 'Atomic Dispatch', status: 'verified' },
    { num: '04', name: 'Audit', agent: 'Quality Reviewer', role: 'Provenance Proof', status: 'verified' },
    { num: '05', name: 'Authorize', agent: 'Release Guardian', role: 'Human Gate', status: pendingApprovals.length > 0 ? 'gated' : 'clear' },
  ];

  return (
    <div className="space-y-6">
      {/* Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            AXIOM Command Center
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Operations Command Center
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Autonomous intelligence, under human control. Continuous policy enforcement and operator oversight.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigateTo('demo-scenarios')}
            className="axiom-btn-secondary"
          >
            <PlayCircle size={13} className="text-[#182536]" />
            <span>Scenario Lab</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('approvals')}
            className="axiom-btn-primary"
          >
            <CheckSquare size={13} />
            <span>Human Approvals ({pendingApprovals.length})</span>
          </button>
        </div>
      </div>

      {/* Operational Summary Strip: Connected hairline docket */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y md:divide-y-0 md:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] tracking-wider block">
            Active Pipelines
          </span>
          <div className="text-3xl font-serif font-bold text-[#182536] mt-1">
            {workflows.length}
          </div>
          <span className="text-[11px] text-[#334256] mt-1 block font-mono">
            1,926 historical runs
          </span>
        </div>

        <div className="p-4 bg-[#FFF8E6]/60">
          <span className="text-[10px] font-mono uppercase text-[#A87405] tracking-wider block">
            Human Gates Pending
          </span>
          <div className="text-3xl font-serif font-bold text-[#A87405] mt-1">
            {pendingApprovals.length}
          </div>
          <span className="text-[11px] text-[#A87405] mt-1 block font-mono">
            Operator authorization required
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] tracking-wider block">
            Cluster Telemetry
          </span>
          <div className="text-3xl font-serif font-bold text-[#138468] mt-1">
            8 / 8
          </div>
          <span className="text-[11px] text-[#138468] mt-1 block font-mono">
            100% heartbeat baseline · 12ms
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] tracking-wider block">
            Invariant Violations
          </span>
          <div className="text-3xl font-serif font-bold text-[#182536] mt-1">
            0
          </div>
          <span className="text-[11px] text-[#5E6975] mt-1 block font-mono">
            {activeIncidents.length} quarantined incident
          </span>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Live Multi-Agent Decision & Execution Fabric */}
      <div className="axiom-panel border border-[#D5D5CE] bg-[#FFFDF8] overflow-hidden shadow-2xs">
        <div className="axiom-panel-header bg-[#FAF9F5] border-b border-[#D5D5CE] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5E6975] tracking-wider block">
              Execution Architecture
            </span>
            <h2 className="text-sm font-serif font-bold text-[#182536]">
              Continuous Multi-Agent Control Loop
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#138468] bg-[#F0FAF6] border border-[#C3E6DB] px-2 py-0.5 rounded-[2px] font-semibold">
              INVARIANTS ACTIVE
            </span>
            <span className="text-[10px] font-mono text-[#5E6975] hidden sm:inline">
              PROTOCOL: DETERMINISTIC DAG
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#FAF9F5]/40">
          {/* Architectural Stage Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {STAGES.map((st) => (
              <div
                key={st.name}
                className={`p-3.5 rounded-[2px] border transition-all flex flex-col justify-between shadow-2xs ${
                  st.status === 'gated'
                    ? 'border-[#A87405] bg-[#FFF8E6]'
                    : 'border-[#D5D5CE] bg-[#FFFDF8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#5E6975]">
                    <span>STAGE {st.num}</span>
                    {st.status === 'gated' ? (
                      <span className="w-2 h-2 rounded-full bg-[#A87405] animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#138468]" />
                    )}
                  </div>
                  <div className="text-sm font-serif font-bold text-[#182536] mt-1">
                    {st.name}
                  </div>
                  <div className="text-[11px] text-[#334256] mt-0.5">{st.role}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#D5D5CE]/50 text-[10px] font-mono text-[#5E6975]">
                  Agent: <span className="text-[#182536] font-semibold">{st.agent}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D5D5CE] flex flex-wrap items-center justify-between text-xs text-[#5E6975] font-mono">
            <span>Guaranteed Boundary: Zero external mutations execute without validated invariants</span>
            <button
              type="button"
              onClick={() => navigateTo('workflows')}
              className="text-[#182536] hover:text-[#D72F40] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore All Workflow Topologies</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Asymmetric Split: Human Decision Desk vs Cryptographic Audit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): Human Approvals Queue */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
                Decision Queue
              </span>
              <h3 className="text-sm font-serif font-bold text-[#182536]">
                Pending Operator Authorization ({pendingApprovals.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('approvals')}
              className="text-xs text-[#182536] hover:text-[#D72F40] font-mono font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Full Decision Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="axiom-panel p-8 text-center text-xs text-[#5E6975] bg-[#FFFDF8]">
              All agent pipelines are operating within autonomous bounds. No human approvals pending.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((req) => (
                <ApprovalCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Cryptographic Audit Ledger */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
                Immutable Ledger
              </span>
              <h3 className="text-sm font-serif font-bold text-[#182536]">
                State Transition Ledger
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('audit')}
              className="text-xs text-[#182536] hover:text-[#D72F40] font-mono font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Audit Ledger</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="axiom-panel divide-y divide-[#D5D5CE] bg-[#FFFDF8] shadow-2xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#5E6975]">
                  <span>{log.timestamp}</span>
                  <span className="text-[#334256] bg-[#FAF9F5] px-1 rounded-[2px] border border-[#D5D5CE]">
                    {log.hash}
                  </span>
                </div>
                <div className="font-semibold text-[#182536] mt-1 flex items-center gap-1.5">
                  <span>{log.agentName}</span>
                  <span className="text-[#5E6975] text-[10px] font-mono">[{log.action}]</span>
                </div>
                <p className="text-[#334256] text-[11px] mt-0.5 leading-relaxed font-sans">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
