import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Lock,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';
import { TableHealthSparkline } from '../components/TableHealthSparkline';
import { TableQuickActionsMenu } from '../components/TableQuickActionsMenu';
import { PipelineEdge, PipelineStepStatus } from '../components/PipelineEdge';
import { HumanAuthorityBoundary } from '../components/HumanAuthorityBoundary';
import { RecoveryLane } from '../components/RecoveryLane';
import { EvidenceDrawer, InspectorNode } from '../components/EvidenceDrawer';
import { ExecutionReceipt } from '../components/ExecutionReceipt';
import { WorkflowDefinition } from '../types';

export interface CICDStage {
  id: string;
  name: string;
  role: string;
  agent: string;
  skill: string;
  inputDescription: string;
  outputDescription: string;
  isHumanGate?: boolean;
  canFail?: boolean;
}

const CICD_STAGES: CICDStage[] = [
  {
    id: '00',
    name: 'TRIGGER',
    role: 'Webhook / Commit Event',
    agent: 'Context Memory Agent',
    skill: 'Context Retrieval',
    inputDescription: 'git.push payload / API Webhook dispatch #3810',
    outputDescription: 'Signed commit SHA-256 with verifiable provenance',
  },
  {
    id: '01',
    name: 'PLAN',
    role: 'DAG decomposition',
    agent: 'Workflow Planner',
    skill: 'Hard Boundary Enforcement',
    inputDescription: 'Target release scope and change manifest',
    outputDescription: 'Deterministic DAG topological resolution tree',
  },
  {
    id: '02',
    name: 'VALIDATE',
    role: 'Static analysis & Policy',
    agent: 'Validation Tester',
    skill: 'Policy Verification',
    inputDescription: 'Abstract syntax tree and invariant constraint rules',
    outputDescription: 'Zero circular dependencies; 100% policy pass',
    canFail: true,
  },
  {
    id: '03',
    name: 'BUILD',
    role: 'Reproducible build',
    agent: 'Task Executor',
    skill: 'Atomic API Invocation',
    inputDescription: 'Clean source tree and dependency lockfile',
    outputDescription: 'Hermetic release bundle artifact://release-v2.6',
  },
  {
    id: '04',
    name: 'TEST',
    role: 'Regression suite (480)',
    agent: 'Quality Reviewer',
    skill: 'Semantic Consistency',
    inputDescription: 'Simulated network partitions and fault injection',
    outputDescription: 'All 480 automated regression suites passed in sandbox',
    canFail: true,
  },
  {
    id: '05',
    name: 'SECURITY',
    role: 'CVE & Invariant scan',
    agent: 'Fraud & Anomaly Sentinel',
    skill: 'Anomaly Detection',
    inputDescription: 'Cryptographic parser attack vectors and CVE feed',
    outputDescription: 'Zero vulnerabilities; invariant bounds certified',
    canFail: true,
  },
  {
    id: '06',
    name: 'HUMAN GATE',
    role: 'Explicit operator approval',
    agent: 'Release Guardian',
    skill: 'Human Gate Routing',
    inputDescription: 'High-risk deployment sign-off request with audit token',
    outputDescription: 'Operator authorization granted or execution halted',
    isHumanGate: true,
  },
  {
    id: '07',
    name: 'DEPLOY',
    role: 'Atomic deployment',
    agent: 'Task Executor',
    skill: 'Atomic API Invocation',
    inputDescription: 'Signed human authorization certificate',
    outputDescription: 'Zero-downtime deployment; idempotency verified',
    canFail: true,
  },
  {
    id: '08',
    name: 'OBSERVE',
    role: 'Health verification',
    agent: 'Context Memory Agent',
    skill: 'Audit Trail Serialization',
    inputDescription: 'Post-deploy synthetic traffic and latency probes',
    outputDescription: 'Cluster health 100%; p50 latency 12ms nominal',
  },
  {
    id: '09',
    name: 'AUDIT',
    role: 'Immutable provenance',
    agent: 'Release Guardian',
    skill: 'Policy Verification',
    inputDescription: 'Complete multi-agent execution telemetry logs',
    outputDescription: 'Tamper-evident SHA-256 block committed to ledger',
  },
];

export const WorkflowsPage: React.FC = () => {
  const { workflows, navigateTo, runWorkflow, openModal, addToast, approveRequest } = useOperationsStore();

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pausedWorkflowIds, setPausedWorkflowIds] = useState<Record<string, boolean>>({});

  // CI/CD Live Execution State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'waiting_gate' | 'completed' | 'rolled_back'>('idle');
  const [inspectorNode, setInspectorNode] = useState<InspectorNode | null>(null);
  const [receiptData, setReceiptData] = useState<{
    workflowId: string;
    title?: string;
    duration: number;
    nodes: number;
    policyChecks: number;
    humanGates: number;
    rollbacks: number;
    proof: string;
  } | null>(null);

  const selectedWf =
    workflows.find((w) => w.id === activeWorkflowId) || workflows[0];

  const categories = useMemo(() => Array.from(new Set(workflows.map((w) => w.category))), [workflows]);

  // Execute Pipeline step by step
  const handleLaunchPipeline = () => {
    if (executionState === 'running') return;

    setExecutionState('running');
    setCurrentStepIndex(0);
    setReceiptData(null);
    addToast('Pipeline Triggered', `Initiating AXIOM CI/CD for "${selectedWf.title}".`, 'info');

    // Step 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 (Human Gate)
    const runSequence = (step: number) => {
      if (step === 6) {
        // Trip Human Gate!
        setCurrentStepIndex(6);
        setExecutionState('waiting_gate');
        addToast(
          'Human Authority Gate Reached',
          'Autonomous execution halted at Step 06. Lead Operator approval required.',
          'warning',
        );
        return;
      }

      setCurrentStepIndex(step);
      setTimeout(() => {
        runSequence(step + 1);
      }, 700);
    };

    runSequence(0);
  };

  const handleApproveRelease = () => {
    if (executionState !== 'waiting_gate') return;

    setExecutionState('running');
    addToast('Release Authorized', 'Operator signed authorization token. Resuming deployment.', 'success');

    // Continue 7 Deploy -> 8 Observe -> 9 Audit
    setTimeout(() => {
      setCurrentStepIndex(7);
      setTimeout(() => {
        setCurrentStepIndex(8);
        setTimeout(() => {
          setCurrentStepIndex(9);
          setExecutionState('completed');
          addToast('Pipeline Committed', 'Full CI/CD loop finalized with verified provenance.', 'success');
          setReceiptData({
            workflowId: selectedWf.id,
            title: selectedWf.title,
            duration: 4280,
            nodes: 10,
            policyChecks: 14,
            humanGates: 1,
            rollbacks: 0,
            proof: `sha256-${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          });
        }, 800);
      }, 700);
    }, 700);
  };

  const handleRejectRelease = () => {
    setExecutionState('rolled_back');
    setCurrentStepIndex(-1);
    addToast(
      'Execution Rolled Back',
      'Operator declined release. Diverted to Recovery Lane: Safe state restored.',
      'error',
    );
  };

  const handleHoldRelease = () => {
    addToast(
      'Pipeline Held',
      'Execution frozen at Step 06 Human Gate. No external mutation dispatched.',
      'info',
    );
  };

  const handleTogglePause = (wfId: string) => {
    setPausedWorkflowIds((prev) => {
      const isPaused = !prev[wfId];
      addToast(
        isPaused ? 'Pipeline Paused' : 'Pipeline Resumed',
        `Workflow ${wfId} is now ${isPaused ? 'paused' : 'active'}.`,
        isPaused ? 'warning' : 'info',
      );
      return { ...prev, [wfId]: isPaused };
    });
  };

  // Determine stage visual status
  const getStageStatus = (index: number): PipelineStepStatus => {
    if (executionState === 'rolled_back') {
      return index === 6 ? 'failed' : 'pending';
    }
    if (executionState === 'completed') {
      return 'completed';
    }
    if (index < currentStepIndex) {
      return 'completed';
    }
    if (index === currentStepIndex) {
      return executionState === 'waiting_gate' ? 'blocked' : 'running';
    }
    return 'pending';
  };

  // Table filtering and multi-select
  const filtered = useMemo(() => {
    return workflows.filter((w) => {
      if (filterCategory !== 'all' && w.category !== filterCategory) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase().trim();
        const isPaused = Boolean(pausedWorkflowIds[w.id]);
        const statusString = isPaused ? 'paused' : w.status.toLowerCase();
        const nameMatch = w.title.toLowerCase().includes(query) || w.id.toLowerCase().includes(query);
        const statusMatch = statusString.includes(query) || w.riskTier.toLowerCase().includes(query);
        const categoryMatch = w.category.toLowerCase().includes(query);
        if (!nameMatch && !statusMatch && !categoryMatch) return false;
      }
      return true;
    });
  }, [workflows, filterCategory, searchFilter, pausedWorkflowIds]);

  const isAllSelected = filtered.length > 0 && filtered.every((w) => selectedIds.includes(w.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((w) => w.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkRun = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => runWorkflow(id));
    addToast(
      'Bulk Run Dispatched',
      `Triggered execution for ${selectedIds.length} selected pipelines.`,
      'info',
    );
  };

  const handleBulkPause = () => {
    if (selectedIds.length === 0) return;
    setPausedWorkflowIds((prev) => {
      const next = { ...prev };
      const allCurrentlyPaused = selectedIds.every((id) => prev[id]);
      selectedIds.forEach((id) => {
        next[id] = !allCurrentlyPaused;
      });
      addToast(
        allCurrentlyPaused ? 'Pipelines Resumed' : 'Pipelines Paused',
        `${selectedIds.length} pipelines are now ${allCurrentlyPaused ? 'active' : 'paused'}.`,
        allCurrentlyPaused ? 'info' : 'warning',
      );
      return next;
    });
  };

  const getWorkflowHealthTrend = (wf: WorkflowDefinition) => {
    if (wf.riskTier === 'critical') return [92, 94, 88, 91, 95, 93];
    if (wf.riskTier === 'high') return [96, 98, 97, 99, 98, 99];
    return [99, 100, 99, 100, 100, 100];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Orchestration Fabric
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            AXIOM CI/CD Control Pipeline
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Deterministic software delivery with policy enforcement, automated verification, human release authority, and rollback
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {executionState === 'waiting_gate' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#9A6900] bg-[#FFF8DF] border border-[#E1BF70] px-3 py-1 rounded-[2px] font-semibold animate-pulse">
                AWAITING OPERATOR SIGN-OFF
              </span>
              <button
                type="button"
                onClick={handleApproveRelease}
                className="axiom-btn-primary"
              >
                <CheckCircle2 size={13} className="text-[#08795F]" />
                <span>Authorize Release</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={executionState === 'running'}
              onClick={handleLaunchPipeline}
              className="axiom-btn-primary"
            >
              <Play size={12} className={executionState === 'running' ? 'animate-spin' : ''} />
              <span>{executionState === 'running' ? `Executing Step 0${currentStepIndex}...` : 'Execute CI/CD Pipeline'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openModal('create-workflow')}
            className="axiom-btn-secondary"
          >
            <Plus size={13} />
            <span>New Pipeline</span>
          </button>
        </div>
      </div>

      {/* CENTERPIECE: AXIOM CI/CD CONTROL PIPELINE VISUALIZATION */}
      <div className="axiom-panel overflow-hidden border border-[#D5D5CE] bg-[#FFFDF8]">
        {/* Pipeline Control Header */}
        <div className="axiom-panel-header bg-[#FAF9F5] border-b border-[#D5D5CE]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#5E6975] font-semibold">
              PIPELINE TARGET:
            </span>
            <select
              value={activeWorkflowId}
              onChange={(e) => setActiveWorkflowId(e.target.value)}
              className="font-serif text-sm font-bold text-[#182536] bg-transparent border-0 focus:outline-none cursor-pointer hover:underline"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({w.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#5E6975]">
              State:{' '}
              <strong className={executionState === 'waiting_gate' ? 'text-[#9A6900]' : executionState === 'completed' ? 'text-[#08795F]' : 'text-[#182536]'}>
                {executionState.toUpperCase()}
              </strong>
            </span>
            <span className="text-[#D5D5CE]">|</span>
            <span className="text-[#5E6975]">
              Nodes: <strong>10 Sequential / Parallel</strong>
            </span>
          </div>
        </div>

        {/* Primary CI/CD Path Canvas with Execution Beams */}
        <div className="p-6 bg-[#FFFDF8] relative">
          <div className="flex items-center justify-between text-xs font-mono text-[#5E6975] mb-4">
            <span>PRIMARY EXECUTION PATH: DETERMINISTIC ARTIFACT & INVARIANT FLOW</span>
            <span className="text-[10px] bg-white px-2 py-0.5 border border-[#D5D5CE] rounded-[2px]">
              Click any node to open the Evidence Drawer
            </span>
          </div>

          {/* Sequential Pipeline with Execution Beam Connectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 pt-1">
            {CICD_STAGES.map((stage, idx) => {
              const status = getStageStatus(idx);
              const isCurrent = currentStepIndex === idx && executionState === 'running';
              const isWaitingGate = stage.isHumanGate && executionState === 'waiting_gate';
              const isCompleted = status === 'completed';

              return (
                <React.Fragment key={stage.id}>
                  {/* Pipeline Node */}
                  <div
                    onClick={() =>
                      setInspectorNode({
                        id: stage.id,
                        title: stage.name,
                        agent: stage.agent,
                        skill: stage.skill,
                        status: isCompleted ? 'Completed' : isCurrent ? 'Executing' : isWaitingGate ? 'Awaiting Human Gate' : 'Pending',
                        input: stage.inputDescription,
                        output: stage.outputDescription,
                        duration: isCompleted ? 140 : undefined,
                      })
                    }
                    className={`flex-shrink-0 w-40 p-3 rounded-[2px] transition-all cursor-pointer relative shadow-2xs ${
                      isWaitingGate
                        ? 'border-2 border-[#9A6900] bg-[#FFF8DF] ring-2 ring-[#9A6900]/10'
                        : isCurrent
                        ? 'border-2 border-[#182536] bg-[#FFFDF8] ring-2 ring-[#182536]/15'
                        : isCompleted
                        ? 'border border-[#C3E6DB] bg-[#F0FAF6]'
                        : 'border border-[#D5D5CE] bg-[#FFFDF8] hover:border-[#334256]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="text-[#5E6975] uppercase">{stage.id} {stage.name}</span>
                      {stage.isHumanGate ? (
                        <span className="w-2 h-2 rounded-full bg-[#9A6900] animate-pulse" />
                      ) : isCompleted ? (
                        <CheckCircle2 size={10} className="text-[#08795F]" />
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D72F40] animate-ping" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D5D5CE]" />
                      )}
                    </div>

                    <div className="font-serif font-bold text-xs text-[#182536] mt-1.5 truncate">
                      {stage.role}
                    </div>

                    <div className="text-[10px] font-mono text-[#334256] mt-1 truncate">
                      {stage.agent}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#D5D5CE]/50 flex items-center justify-between text-[8px] font-mono text-[#5E6975]">
                      <span>{isCompleted ? '✓ VERIFIED' : isCurrent ? 'EXECUTING' : isWaitingGate ? 'GATE HELD' : 'PENDING'}</span>
                      <span>{stage.isHumanGate ? 'OPERATOR' : 'AUTO'}</span>
                    </div>
                  </div>

                  {/* Execution Beam Connector */}
                  {idx < CICD_STAGES.length - 1 && (
                    <PipelineEdge
                      status={
                        idx < currentStepIndex
                          ? 'completed'
                          : idx === currentStepIndex && executionState === 'running'
                          ? 'running'
                          : 'pending'
                      }
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* HUMAN AUTHORITY BOUNDARY STRIP */}
          <HumanAuthorityBoundary
            isGated={executionState === 'waiting_gate'}
            onApprove={handleApproveRelease}
            onReject={handleRejectRelease}
            onHold={handleHoldRelease}
          />

          {/* RECOVERY & ROLLBACK LANE */}
          <RecoveryLane
            active={executionState === 'rolled_back'}
            onTriggerRollback={handleRejectRelease}
          />
        </div>
      </div>

      {/* Registry Category Filter Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-[2px] text-xs font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-[#182536] text-[#FFFDF8] shadow-2xs'
                : 'bg-[#FFFDF8] border border-[#D5D5CE] text-[#334256] hover:bg-[#EFEFEB]'
            }`}
          >
            All Pipelines ({workflows.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-[2px] text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-[#182536] text-[#FFFDF8] shadow-2xs'
                  : 'bg-[#FFFDF8] border border-[#D5D5CE] text-[#334256] hover:bg-[#EFEFEB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#5E6975]">
          Showing {filtered.length} of {workflows.length} DAG Pipelines
        </span>
      </div>

      {/* Registry Table Panel with Top Filter Bar & Multi-Select */}
      <div className="axiom-panel overflow-hidden">
        {/* Top Filter and Bulk Actions Bar */}
        <div className="axiom-table-toolbar">
          <div className="axiom-table-filter">
            <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search & filter pipelines by name, status, or domain..."
              aria-label="Filter workflows table"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2 text-[#5E6975] hover:text-[#182536]"
                title="Clear filter"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {selectedIds.length > 0 ? (
            <div className="axiom-bulk-bar">
              <span>
                <b>{selectedIds.length}</b> selected
              </span>
              <button
                type="button"
                onClick={handleBulkRun}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <Play size={10} />
                <span>Run Selected</span>
              </button>
              <button
                type="button"
                onClick={handleBulkPause}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9A6900] hover:bg-[#7a5300] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <Pause size={10} />
                <span>Pause Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-slate-300 hover:text-white underline text-[10px] ml-1"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="text-xs font-mono text-[#5E6975]">
              {filtered.length} matching pipelines
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="axiom-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all pipelines"
                    className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th>Workflow Pipeline</th>
                <th>Domain</th>
                <th>Risk Tier</th>
                <th>Status</th>
                <th>Health</th>
                <th>Agent Chain</th>
                <th>Nodes</th>
                <th>Historical Runs</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-xs text-[#5E6975] font-mono">
                    No matching workflow pipelines found for "{searchFilter}".
                  </td>
                </tr>
              ) : (
                filtered.map((wf) => {
                  const hasWaiting = wf.steps.some((s) => s.status === 'waiting_approval');
                  const isSelected = selectedIds.includes(wf.id);
                  const isCanvasActive = wf.id === activeWorkflowId;
                  const isPaused = Boolean(pausedWorkflowIds[wf.id]);
                  const healthData = getWorkflowHealthTrend(wf);

                  return (
                    <tr
                      key={wf.id}
                      onClick={() => setActiveWorkflowId(wf.id)}
                      className={`cursor-pointer ${isSelected ? 'is-selected' : isCanvasActive ? 'bg-[#FFF8E6]/60' : ''}`}
                    >
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(wf.id)}
                          aria-label={`Select pipeline ${wf.title}`}
                          className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td>
                        <div className="font-serif font-bold text-sm text-[#182536]">{wf.title}</div>
                        <div className="text-[10px] font-mono text-[#5E6975]">{wf.id}</div>
                      </td>
                      <td className="text-[#334256] text-xs font-mono">{wf.category}</td>
                      <td>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                            wf.riskTier === 'critical'
                              ? 'bg-rose-50 text-[#D72F40] border-rose-200'
                              : wf.riskTier === 'high'
                              ? 'bg-[#FFF8DF] text-[#9A6900] border-[#F3DFAA]'
                              : 'bg-slate-50 text-[#334256] border-slate-200'
                          }`}
                        >
                          {wf.riskTier}
                        </span>
                      </td>
                      <td>
                        <StatusBadge
                          status={isPaused ? 'paused' : hasWaiting ? 'waiting_approval' : wf.status}
                          size="sm"
                        />
                      </td>
                      {/* Health Column with Recharts mini sparkline */}
                      <td>
                        <TableHealthSparkline
                          data={healthData}
                          label={`${wf.title} Health Trend`}
                        />
                      </td>
                      <td>
                        <div className="text-[11px] text-[#334256] truncate max-w-xs font-mono">
                          {Array.from(new Set(wf.steps.map((s) => s.assignedAgent))).join(', ')}
                        </div>
                      </td>
                      <td className="font-mono text-xs text-[#182536] font-semibold">{wf.steps.length}</td>
                      <td className="font-mono text-xs text-[#5E6975]">{wf.totalRuns.toLocaleString()}</td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLaunchPipeline()}
                            className="axiom-btn-secondary py-1 px-2.5 text-xs"
                            title="Execute CI/CD Pipeline"
                          >
                            <Play size={11} />
                            <span>Run</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => navigateTo('workflow-detail', wf.id)}
                            className="axiom-btn-primary py-1 px-2.5 text-xs"
                          >
                            <span>Inspect</span>
                            <ArrowRight size={11} />
                          </button>

                          {/* Quick Actions Context Menu */}
                          <TableQuickActionsMenu
                            id={wf.id}
                            name={wf.title}
                            isPaused={isPaused}
                            onRerun={() => handleLaunchPipeline()}
                            onPause={() => handleTogglePause(wf.id)}
                            onViewLogs={() => navigateTo('activity')}
                            onInspect={() => navigateTo('workflow-detail', wf.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Node Evidence Inspection Drawer */}
      <EvidenceDrawer
        node={inspectorNode}
        onClose={() => setInspectorNode(null)}
      />

      {/* Execution Provenance Receipt Modal */}
      <ExecutionReceipt
        execution={receiptData}
        onInspect={() => {
          setReceiptData(null);
          navigateTo('audit');
        }}
        onClose={() => setReceiptData(null)}
      />
    </div>
  );
};
