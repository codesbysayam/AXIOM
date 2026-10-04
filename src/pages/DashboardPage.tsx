import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckSquare,
  CircleDot,
  Clock,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  Users,
  Lock,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { MASTER_METRICS } from '../data/metrics';
import { MetricCard } from '../components/charts/MetricCard';
import { ExecutionFlowChart, FlowStage } from '../components/flow/ExecutionFlowChart';
import { SuccessBarChart } from '../components/charts/SuccessBarChart';
import { RiskDonut } from '../components/charts/RiskDonut';
import { ThroughputChart } from '../components/charts/ThroughputChart';
import { ApprovalCard } from '../components/ApprovalCard';
import { EvidenceDrawer, InspectorNode } from '../components/EvidenceDrawer';

export const DashboardPage: React.FC = () => {
  const {
    workflows,
    approvals,
    incidents,
    auditLogs,
    navigateTo,
    openInspector,
  } = useOperationsStore();

  const [inspectedFlowStage, setInspectedFlowStage] = useState<InspectorNode | null>(null);

  const pendingApprovals = useMemo(
    () => approvals.filter((a) => a.status === 'pending'),
    [approvals],
  );

  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.status === 'active'),
    [incidents],
  );

  const recentLogs = useMemo(
    () => auditLogs.slice(0, 5),
    [auditLogs],
  );

  const handleFlowStageClick = (stage: FlowStage) => {
    setInspectedFlowStage({
      id: stage.id,
      title: stage.title,
      agent: stage.agent || 'Orchestration Engine',
      skill: 'Deterministic Control Flow',
      status: stage.status,
      input: 'Autonomous operation vector & parameter envelope',
      output: stage.subtitle,
      checks: [
        'Deterministic DAG traversal invariant',
        'State proof committed to SHA-256 ledger',
        'Dual-signature verification pass',
      ],
      timestamp: '12:03:18.240',
      duration: parseInt(stage.latency || '88', 10) || 88,
    });
  };

  return (
    <main className="space-y-8">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#D5D1C7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00866B]" />
            <span className="text-xs font-sans font-semibold tracking-[0.08em] uppercase text-[#52647B]">
              AXIOM <span className="text-[#8898AA] font-mono">/</span> COMMAND CENTER & CONTROL PLANE
            </span>
          </div>
          <h1 className="text-[34px] sm:text-[42px] lg:text-[48px] font-serif font-medium text-[#17263A] mt-2.5 leading-[1.05] tracking-[-0.035em] max-w-[900px]">
            Autonomous intelligence, under human control.
          </h1>
          <p className="text-base font-sans font-normal text-[#52647B] mt-3 leading-[1.6] max-w-[780px]">
            Every material action remains observable, verifiable, and strictly bounded by mathematical policy invariants.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0 pt-1">
          <button
            type="button"
            className="axiom-btn-secondary"
            onClick={() => navigateTo('demo-scenarios')}
          >
            <PlayCircle size={15} className="text-[#3569A8]" />
            <span>Scenario Lab</span>
          </button>

          <button
            type="button"
            className="axiom-btn-primary"
            onClick={() => navigateTo('approvals')}
          >
            <CheckSquare size={15} />
            <span>Human Gates</span>
            <span className="px-1.5 py-0.2 bg-[#B97800] text-white rounded-[3px] text-[10px] font-bold">
              {pendingApprovals.length}
            </span>
          </button>
        </div>
      </header>

      {/* Top 6 Summary Metrics Strip (Sections 11 & 12) */}
      <section className="axiom-metric-strip">
        <MetricCard
          label="Active Pipelines"
          value={`0${workflows.length}`}
          detail="All DAGs nominal"
          tone="info"
          onClick={() => openInspector('pipelines')}
        />
        <MetricCard
          label="Human Gates"
          value={`0${pendingApprovals.length}`}
          detail="Decisions awaiting sign-off"
          tone={pendingApprovals.length > 0 ? 'warning' : 'success'}
          onClick={() => navigateTo('approvals')}
        />
        <MetricCard
          label="Agents Online"
          value="08/08"
          detail="100% fleet heartbeat"
          tone="success"
          onClick={() => openInspector('agents')}
        />
        <MetricCard
          label="Invariant Violations"
          value={`0${activeIncidents.length}`}
          detail="Zero boundary drift"
          tone={activeIncidents.length > 0 ? 'danger' : 'success'}
          onClick={() => navigateTo('governance')}
        />
        <MetricCard
          label="Success Rate"
          value={`${MASTER_METRICS.successRate}%`}
          detail="1,281 runs sampled"
          tone="success"
          onClick={() => navigateTo('analytics')}
        />
        <MetricCard
          label="Median Latency"
          value={`${MASTER_METRICS.medianLatencyMs}ms`}
          detail="P95: 480ms SLA"
          tone="neutral"
          onClick={() => navigateTo('analytics')}
        />
      </section>

      {/* Primary Flowchart: Autonomous Control Loop */}
      <ExecutionFlowChart onNodeClick={handleFlowStageClick} />

      {/* Secondary Visualizations: Workload Throughput + Outcomes + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuccessBarChart onBarClick={() => navigateTo('workflows')} />
        <RiskDonut onSliceClick={() => navigateTo('analytics')} />
      </div>

      <ThroughputChart />

      {/* Two-Column Decision Desk & Audit Ledger */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Human Authority Queue */}
        <div className="p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5D1C7]/70">
            <div>
              <span className="eyebrow text-[#B97800] block">
                HUMAN AUTHORITY GATEWAY
              </span>
              <h3 className="card-title text-base text-[#17263A] mt-1 font-semibold">
                Pending Decisions ({pendingApprovals.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('approvals')}
              className="text-xs font-sans font-semibold text-[#142238] hover:text-[#B97800] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3 pt-4 flex-1">
            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF9F5] border border-[#D5D1C7]/60 rounded-[6px]">
                <ShieldCheck size={28} className="mx-auto text-[#00866B] mb-2" />
                <h4 className="text-sm font-semibold text-[#17263A]">Authority Queue Clear</h4>
                <p className="text-xs text-[#68758A] mt-1 max-w-xs mx-auto">
                  All active pipelines are operating strictly within autonomous delegation bounds.
                </p>
              </div>
            ) : (
              pendingApprovals.slice(0, 2).map((req) => (
                <ApprovalCard key={req.id} request={req} />
              ))
            )}
          </div>
        </div>

        {/* Right: Cryptographic Provenance Ledger */}
        <div className="p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5D1C7]/70">
            <div>
              <span className="eyebrow text-[#00866B] block">
                IMMUTABLE AUDIT LOG
              </span>
              <h3 className="card-title text-base text-[#17263A] mt-1 font-semibold">
                Recent Provenance Proofs
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('audit')}
              className="text-xs font-sans font-semibold text-[#142238] hover:text-[#00866B] flex items-center gap-1 transition-colors"
            >
              <span>Ledger Chain</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-[#D5D1C7]/50 pt-1 flex-1">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => navigateTo('audit')}
                className="py-2.5 hover:bg-[#FAF7EE] px-2 rounded-[4px] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#17263A] font-sans font-semibold">{log.agentName}</span>
                  <span className="text-[#68758A] font-mono text-[11px]">{log.timestamp}</span>
                </div>
                <div className="text-xs text-[#40516A] font-normal mt-0.5 line-clamp-1 font-sans">
                  {log.details}
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="text-[#00866B] font-sans font-semibold text-[10px] uppercase tracking-wide">{log.action}</span>
                  <span className="font-mono text-[10px] text-[#68758A] truncate max-w-[140px]">{log.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Node Inspector Drawer */}
      <EvidenceDrawer
        node={inspectedFlowStage}
        onClose={() => setInspectedFlowStage(null)}
      />
    </main>
  );
};
