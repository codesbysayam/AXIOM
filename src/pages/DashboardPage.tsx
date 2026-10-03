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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            AXIOM Command Center
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Operations Command Center
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Autonomous intelligence, under human control. Continuous policy enforcement and operator oversight.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigateTo('demo-scenarios')}
            className="axiom-btn-secondary"
          >
            <PlayCircle size={13} className="text-[#17263d]" />
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#dce1e7] bg-white rounded-[2px] divide-y md:divide-y-0 md:divide-x divide-[#dce1e7] shadow-2xs">
        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] tracking-wider block">
            Active Pipelines
          </span>
          <div className="text-3xl font-serif font-bold text-[#17263d] mt-1">
            {workflows.length}
          </div>
          <span className="text-[11px] text-[#40516a] mt-1 block font-mono">
            1,926 historical runs
          </span>
        </div>

        <div className="p-4 bg-[#fdfbf6]">
          <span className="text-[10px] font-mono uppercase text-[#945f00] tracking-wider block">
            Human Gates Pending
          </span>
          <div className="text-3xl font-serif font-bold text-[#d99000] mt-1">
            {pendingApprovals.length}
          </div>
          <span className="text-[11px] text-[#945f00] mt-1 block font-mono">
            Operator authorization required
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] tracking-wider block">
            Cluster Telemetry
          </span>
          <div className="text-3xl font-serif font-bold text-[#159a72] mt-1">
            8 / 8
          </div>
          <span className="text-[11px] text-[#159a72] mt-1 block font-mono">
            100% heartbeat baseline · 12ms
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] tracking-wider block">
            Invariant Violations
          </span>
          <div className="text-3xl font-serif font-bold text-[#17263d] mt-1">
            0
          </div>
          <span className="text-[11px] text-[#718096] mt-1 block font-mono">
            {activeIncidents.length} quarantined incident
          </span>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Live Multi-Agent Decision & Execution Fabric */}
      <div className="axiom-panel border border-[#dce1e7] bg-white overflow-hidden shadow-2xs">
        <div className="axiom-panel-header bg-[#faf9f5] border-b border-[#dce1e7] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#718096] tracking-wider block">
              Execution Architecture
            </span>
            <h2 className="text-sm font-serif font-bold text-[#17263d]">
              Continuous Multi-Agent Control Loop
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#0d6b4f] bg-[#f0faf6] border border-[#c7eadf] px-2 py-0.5 rounded-[2px] font-semibold">
              INVARIANTS ACTIVE
            </span>
            <span className="text-[10px] font-mono text-[#718096] hidden sm:inline">
              PROTOCOL: DETERMINISTIC DAG
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#fbfaf7]">
          {/* Architectural Stage Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {STAGES.map((st, idx) => (
              <div
                key={st.name}
                className={`p-3.5 rounded-[2px] border transition-all flex flex-col justify-between shadow-2xs ${
                  st.status === 'gated'
                    ? 'border-[#d99000] bg-[#fefdf8]'
                    : 'border-[#dce1e7] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#718096]">
                    <span>STAGE {st.num}</span>
                    {st.status === 'gated' ? (
                      <span className="w-2 h-2 rounded-full bg-[#d99000] animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#159a72]" />
                    )}
                  </div>
                  <div className="text-sm font-serif font-bold text-[#17263d] mt-1">
                    {st.name}
                  </div>
                  <div className="text-[11px] text-[#40516a] mt-0.5">{st.role}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#f0eee6] text-[10px] font-mono text-[#718096]">
                  Agent: <span className="text-[#17263d] font-semibold">{st.agent}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#dce1e7] flex flex-wrap items-center justify-between text-xs text-[#718096] font-mono">
            <span>Guaranteed Boundary: Zero external mutations execute without validated invariants</span>
            <button
              type="button"
              onClick={() => navigateTo('workflows')}
              className="text-[#17263d] hover:text-[#e63946] font-medium inline-flex items-center gap-1 transition-colors"
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
          <div className="flex items-center justify-between border-b border-[#dce1e7] pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#718096] block">
                Decision Queue
              </span>
              <h3 className="text-sm font-serif font-bold text-[#17263d]">
                Pending Operator Authorization ({pendingApprovals.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('approvals')}
              className="text-xs text-[#17263d] hover:text-[#e63946] font-mono font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Full Decision Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="axiom-panel p-8 text-center text-xs text-[#718096] bg-white">
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
          <div className="flex items-center justify-between border-b border-[#dce1e7] pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#718096] block">
                Immutable Ledger
              </span>
              <h3 className="text-sm font-serif font-bold text-[#17263d]">
                State Transition Ledger
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('audit')}
              className="text-xs text-[#17263d] hover:text-[#e63946] font-mono font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Audit Ledger</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="axiom-panel divide-y divide-[#dce1e7] bg-white shadow-2xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#718096]">
                  <span>{log.timestamp}</span>
                  <span className="text-[#a0aec0] bg-[#fbfaf7] px-1 rounded-[2px] border border-[#f0eee6]">
                    {log.hash}
                  </span>
                </div>
                <div className="font-semibold text-[#17263d] mt-1 flex items-center gap-1.5">
                  <span>{log.agentName}</span>
                  <span className="text-[#718096] text-[10px] font-mono">[{log.action}]</span>
                </div>
                <p className="text-[#40516a] text-[11px] mt-0.5 leading-relaxed font-sans">
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
