import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Play,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';
import { TableHealthSparkline } from '../components/TableHealthSparkline';
import { TableQuickActionsMenu } from '../components/TableQuickActionsMenu';
import { WorkflowDefinition, WorkflowStep } from '../types';

export const WorkflowsPage: React.FC = () => {
  const { workflows, navigateTo, runWorkflow, openModal, addToast } = useOperationsStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simActiveStep, setSimActiveStep] = useState<number>(-1);
  const [pausedWorkflowIds, setPausedWorkflowIds] = useState<Record<string, boolean>>({});

  const categories = Array.from(new Set(workflows.map((w) => w.category)));

  const filtered = workflows.filter((w) => {
    if (filterCategory !== 'all' && w.category !== filterCategory) return false;
    return true;
  });

  const selectedWf =
    workflows.find((w) => w.id === activeWorkflowId) || workflows[0];

  const handleSimulateExecution = (wfId: string) => {
    setIsSimulating(true);
    setSimActiveStep(0);
    runWorkflow(wfId);

    const stepCount = selectedWf.steps.length;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= stepCount) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimActiveStep(-1);
      } else {
        setSimActiveStep(current);
      }
    }, 850);
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

  const selectedStepData = selectedWf?.steps.find((s) => s.id === selectedNodeId);

  // Generate deterministic sparkline data for workflows
  const getWorkflowHealthTrend = (wf: WorkflowDefinition) => {
    if (wf.riskTier === 'critical') return [92, 94, 88, 91, 95, 93];
    if (wf.riskTier === 'high') return [96, 98, 97, 99, 98, 99];
    return [99, 100, 99, 100, 100, 100];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Orchestration Fabric
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Multi-Agent Orchestration DAGs
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Deterministic directed acyclic graphs with policy-enforced human gates and atomic state rollback
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => openModal('workflow-canvas')}
            className="axiom-btn-secondary"
            title="Open visual canvas builder"
          >
            <Workflow size={13} className="text-[#A87405]" />
            <span>Visual Canvas Builder</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateExecution(selectedWf.id)}
            disabled={isSimulating}
            className="axiom-btn-secondary"
          >
            <Play size={12} className={isSimulating ? 'animate-spin text-[#A87405]' : 'text-[#182536]'} />
            <span>{isSimulating ? `Executing Step ${simActiveStep + 1}...` : 'Simulate Run'}</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('create-workflow')}
            className="axiom-btn-primary"
          >
            <Plus size={13} />
            <span>New Pipeline</span>
          </button>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Impressive Multi-Agent DAG Topology Canvas */}
      <div className="axiom-panel overflow-hidden border border-[#D5D5CE] bg-[#FFFDF8]">
        {/* Topology Canvas Toolbar */}
        <div className="axiom-panel-header bg-[#FAF9F5] border-b border-[#D5D5CE]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-[#5E6975]">
              <Workflow size={13} className="text-[#182536]" />
              <span className="font-semibold text-[#182536]">Active Pipeline:</span>
            </div>
            <select
              value={activeWorkflowId}
              onChange={(e) => {
                setActiveWorkflowId(e.target.value);
                setSelectedNodeId(null);
              }}
              className="font-serif text-sm font-bold text-[#182536] bg-transparent border-0 focus:outline-none cursor-pointer hover:underline"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({w.steps.length} nodes)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-[#5E6975]">
              Risk:{' '}
              <span
                className={`uppercase font-bold ${
                  selectedWf.riskTier === 'critical'
                    ? 'text-[#D72F40]'
                    : selectedWf.riskTier === 'high'
                    ? 'text-[#A87405]'
                    : 'text-[#138468]'
                }`}
              >
                {selectedWf.riskTier}
              </span>
            </span>
            <span className="text-[#D5D5CE]">|</span>
            <span className="text-[#5E6975]">
              Runs: <span className="font-bold text-[#182536]">{selectedWf.totalRuns}</span>
            </span>
          </div>
        </div>

        {/* DAG Architecture Grid Canvas */}
        <div className="p-6 bg-[#FAF9F5] relative border-b border-[#D5D5CE]">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #D5D5CE 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#5E6975]">
              <span>DAG TOPOLOGY MAP · PARALLEL RESOLUTION WITH DETERMINISTIC CONVERGENCE</span>
              <span className="text-[10px] bg-[#FFFDF8] px-2 py-0.5 border border-[#D5D5CE] rounded-[2px]">
                Click any node to inspect payload & agent invariant
              </span>
            </div>

            {/* Visual Node Sequence */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1">
              {/* Trigger Node */}
              <div className="flex-shrink-0 w-36 p-3 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] shadow-2xs">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#5E6975] uppercase">
                  <span>Input</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#138468]" />
                </div>
                <div className="text-xs font-serif font-bold text-[#182536] mt-1">Event Ingest</div>
                <div className="text-[10px] text-[#5E6975] font-mono mt-0.5 truncate">
                  Webhook / API
                </div>
                <div className="mt-2 pt-1 border-t border-[#EFEFEB] text-[9px] font-mono text-[#138468]">
                  Valid Schema
                </div>
              </div>

              {/* Connecting Vector */}
              <div className="text-[#5E6975] flex-shrink-0 font-mono text-sm">→</div>

              {/* Sequential Agent Nodes */}
              {selectedWf.steps.map((step, idx) => {
                const isSelected = selectedNodeId === step.id;
                const isCurrentlySimulating = isSimulating && simActiveStep === idx;
                const isCompleted = step.status === 'completed' || (isSimulating && simActiveStep > idx);
                const isWaiting = step.status === 'waiting_approval' || (step.requiresApproval && isCurrentlySimulating);

                return (
                  <React.Fragment key={step.id}>
                    <div
                      onClick={() => setSelectedNodeId(step.id)}
                      className={`flex-shrink-0 w-52 p-3.5 rounded-[2px] transition-all cursor-pointer relative shadow-2xs ${
                        isSelected
                          ? 'border-2 border-[#182536] bg-[#FFFDF8] ring-2 ring-[#182536]/15'
                          : isWaiting
                          ? 'border-2 border-[#A87405] bg-[#FFF8E6]'
                          : isCurrentlySimulating
                          ? 'border-2 border-[#138468] bg-[#FFFDF8] animate-pulse'
                          : 'border border-[#D5D5CE] bg-[#FFFDF8] hover:border-[#B4B4A8]'
                      }`}
                    >
                      {/* Node Top Meta */}
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#5E6975] uppercase font-semibold">NODE 0{idx + 1}</span>
                        {step.requiresApproval ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#A87405] bg-[#FFF8E6] px-1.5 py-0.2 rounded-[2px] border border-[#F7E0B5]">
                            <Lock size={9} />
                            HUMAN GATE
                          </span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              isCompleted
                                ? 'text-[#138468]'
                                : isCurrentlySimulating
                                ? 'text-[#A87405]'
                                : 'text-[#5E6975]'
                            }`}
                          >
                            {isCompleted ? 'VERIFIED' : isCurrentlySimulating ? 'RUNNING' : 'PENDING'}
                          </span>
                        )}
                      </div>

                      {/* Node Title */}
                      <div className="text-xs font-serif font-bold text-[#182536] mt-1.5 truncate" title={step.name}>
                        {step.name}
                      </div>

                      {/* Assigned Agent */}
                      <div className="text-[10px] font-mono text-[#334256] mt-0.5 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#182536]" />
                        <span>{step.assignedAgent}</span>
                      </div>

                      {/* Required Skill */}
                      <div className="mt-2.5 pt-2 border-t border-[#EFEFEB] flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#5E6975] truncate max-w-[120px]">{step.requiredSkill}</span>
                        <span className="text-[#5E6975]">140ms</span>
                      </div>
                    </div>

                    {/* Connecting Vector */}
                    {idx < selectedWf.steps.length - 1 && (
                      <div className="text-[#5E6975] flex-shrink-0 font-mono text-sm">→</div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Connecting Vector */}
              <div className="text-[#5E6975] flex-shrink-0 font-mono text-sm">→</div>

              {/* Final Commit Node */}
              <div className="flex-shrink-0 w-36 p-3 bg-[#F0FAF6] border border-[#C3E6DB] rounded-[2px] shadow-2xs">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#0D6B4F] uppercase">
                  <span>Commit</span>
                  <CheckCircle2 size={11} className="text-[#138468]" />
                </div>
                <div className="text-xs font-serif font-bold text-[#0D6B4F] mt-1">Audit Ledger</div>
                <div className="text-[10px] text-[#0D6B4F] font-mono mt-0.5 truncate">
                  SHA-256 Signed
                </div>
                <div className="mt-2 pt-1 border-t border-[#C3E6DB] text-[9px] font-mono text-[#0D6B4F]">
                  Immutable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Deep Inspector Tray */}
        {selectedStepData && (
          <div className="p-4 bg-[#FFFDF8] border-t border-[#D5D5CE] flex flex-col md:flex-row items-start justify-between gap-4 text-xs animate-in fade-in duration-150">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-[#D72F40] px-1.5 py-0.2 bg-red-50 rounded-[2px] border border-red-100">
                  Node Inspector
                </span>
                <span className="font-serif font-bold text-sm text-[#182536]">
                  {selectedStepData.name}
                </span>
                <span className="font-mono text-[10px] text-[#5E6975]">
                  ({selectedStepData.assignedAgent})
                </span>
              </div>
              <div className="text-[11px] text-[#334256] leading-relaxed">
                <span className="font-mono font-semibold text-[#182536]">Input Payload: </span>
                {selectedStepData.inputDescription}
              </div>
              <div className="text-[11px] text-[#334256] leading-relaxed">
                <span className="font-mono font-semibold text-[#182536]">Expected Output: </span>
                {selectedStepData.outputDescription}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
              {selectedStepData.requiresApproval && (
                <div className="p-2 bg-[#FFF8E6] border border-[#F7E0B5] rounded-[2px] text-[11px] text-[#A87405] font-mono">
                  Mandatory human authorization gate enforced at this step
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="axiom-btn-secondary text-[11px] py-1 px-2.5"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Category Row */}
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

      {/* Registry Table */}
      <div className="axiom-panel overflow-x-auto">
        <table className="axiom-table">
          <thead>
            <tr>
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
            {filtered.map((wf) => {
              const hasWaiting = wf.steps.some((s) => s.status === 'waiting_approval');
              const isSelected = wf.id === activeWorkflowId;
              const isPaused = Boolean(pausedWorkflowIds[wf.id]);
              const healthData = getWorkflowHealthTrend(wf);

              return (
                <tr
                  key={wf.id}
                  onClick={() => {
                    setActiveWorkflowId(wf.id);
                    setSelectedNodeId(null);
                  }}
                  className={`cursor-pointer ${isSelected ? 'bg-[#FFF8E6]/60' : ''}`}
                >
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
                          ? 'bg-[#FFF8E6] text-[#A87405] border-[#F7E0B5]'
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
                        onClick={() => handleSimulateExecution(wf.id)}
                        className="axiom-btn-secondary py-1 px-2.5 text-xs"
                        title="Trigger immediate execution"
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
                        onRerun={() => handleSimulateExecution(wf.id)}
                        onPause={() => handleTogglePause(wf.id)}
                        onViewLogs={() => navigateTo('activity')}
                        onInspect={() => navigateTo('workflow-detail', wf.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
