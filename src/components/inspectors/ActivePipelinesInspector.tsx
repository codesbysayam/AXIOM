import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  X,
} from 'lucide-react';
import { useOperationsStore } from '../../orchestrator/store';
import { WorkflowDefinition } from '../../types';

export interface ActivePipelinesInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPipelineId?: string;
  onSelectPipeline?: (id: string) => void;
}

export const ActivePipelinesInspector: React.FC<ActivePipelinesInspectorProps> = ({
  isOpen,
  onClose,
  selectedPipelineId,
  onSelectPipeline,
}) => {
  const { workflows, runWorkflow, navigateTo, addToast } = useOperationsStore();
  const [activeId, setActiveId] = useState<string>(
    selectedPipelineId || workflows[0]?.id || 'wf-vendor-procurement',
  );

  useEffect(() => {
    if (selectedPipelineId) setActiveId(selectedPipelineId);
  }, [selectedPipelineId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentWf: WorkflowDefinition =
    workflows.find((w) => w.id === activeId) || workflows[0];

  const completedSteps = currentWf.steps.filter((s) => s.status === 'completed').length;
  const runningSteps = currentWf.steps.filter((s) => s.status === 'running').length;
  const waitingGates = currentWf.steps.filter((s) => s.status === 'waiting_approval').length;

  const handleTriggerRun = () => {
    runWorkflow(currentWf.id);
    addToast('Pipeline Triggered', `Triggered execution for "${currentWf.title}"`, 'info');
  };

  const handleOpenCanvas = () => {
    onClose();
    navigateTo('workflows', currentWf.id);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[#182536]/40 z-50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#FFFDF8] border-l border-[#D5D5CE] z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Active Pipelines Inspector"
      >
        {/* Header */}
        <header className="p-4 border-b border-[#D5D5CE] bg-[#FAF9F5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#182536] text-[#FFFDF8] flex items-center justify-center font-serif font-bold text-sm">
              <Workflow size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] font-semibold">
                  PIPELINE TOPOLOGY
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#F0FAF6] text-[#08795F] border border-[#C3E6DB]">
                  0{workflows.length} PIPELINES ACTIVE
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#182536]">
                Active Orchestration Registry
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5E6975] hover:text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] transition-colors"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </header>

        {/* Content: Left List + Right Details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Pipeline List */}
          <div className="w-56 border-r border-[#D5D5CE] bg-[#FAF9F5] overflow-y-auto divide-y divide-[#D5D5CE]/60 flex-shrink-0">
            {workflows.map((wf) => {
              const isSelected = wf.id === currentWf.id;
              const hasWaiting = wf.steps.some((s) => s.status === 'waiting_approval');

              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => {
                    setActiveId(wf.id);
                    onSelectPipeline?.(wf.id);
                  }}
                  className={`w-full text-left p-3 transition-colors ${
                    isSelected
                      ? 'bg-[#FFFDF8] border-l-2 border-l-[#182536]'
                      : 'hover:bg-[#EFEFEB] text-[#334256]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#5E6975]">{wf.category}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasWaiting ? 'bg-[#A66A00] animate-pulse' : 'bg-[#08795F]'
                      }`}
                    />
                  </div>
                  <div className="text-xs font-semibold text-[#182536] mt-0.5 leading-snug line-clamp-2">
                    {wf.title}
                  </div>
                  <div className="text-[10px] text-[#5E6975] font-mono mt-1 flex items-center justify-between">
                    <span>{wf.riskTier.toUpperCase()} RISK</span>
                    <span>{wf.steps.length} Nodes</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Telemetry for Selected Pipeline */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FFFDF8]">
            {/* Pipeline Overview */}
            <div className="p-4 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975]">
                    Pipeline ID: {currentWf.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#182536]">
                    {currentWf.title}
                  </h3>
                  <p className="text-xs text-[#334256] mt-1 leading-relaxed">
                    {currentWf.description}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] border ${
                    currentWf.riskTier === 'critical'
                      ? 'bg-rose-50 text-[#B52D3D] border-rose-200'
                      : currentWf.riskTier === 'high'
                      ? 'bg-[#FFF7DF] text-[#A66A00] border-[#E1BF70]'
                      : 'bg-slate-50 text-[#334256] border-slate-200'
                  }`}
                >
                  {currentWf.riskTier} RISK
                </span>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#D5D5CE]/60 text-center">
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Completed</span>
                  <strong className="text-sm font-mono text-[#08795F]">{completedSteps}</strong>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Running</span>
                  <strong className="text-sm font-mono text-[#182536]">{runningSteps}</strong>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Human Gates</span>
                  <strong className={`text-sm font-mono ${waitingGates > 0 ? 'text-[#A66A00]' : 'text-[#5E6975]'}`}>
                    {waitingGates}
                  </strong>
                </div>
                <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px]">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">Rollback</span>
                  <strong className="text-sm font-mono text-[#08795F]">Armed</strong>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerRun}
                  className="axiom-btn-primary flex-1 py-1.5"
                >
                  <Play size={12} />
                  <span>Execute Pipeline</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenCanvas}
                  className="axiom-btn-secondary flex-1 py-1.5"
                >
                  <Workflow size={12} />
                  <span>Open Topology View</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Stage Execution Graph */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] font-semibold block">
                Execution Stage Nodes
              </span>
              <div className="space-y-2">
                {currentWf.steps.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isRun = step.status === 'running';
                  const isWait = step.status === 'waiting_approval';

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-[2px] border transition-all ${
                        isWait
                          ? 'border-[#E1BF70] bg-[#FFF7DF]'
                          : isRun
                          ? 'border-[#182536] bg-[#FFFDF8] ring-1 ring-[#182536]'
                          : isDone
                          ? 'border-[#D5D5CE] bg-[#FAF9F5]'
                          : 'border-[#D5D5CE]/60 bg-[#FAF9F5]/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#5E6975]">STAGE 0{idx + 1} / {step.id}</span>
                        <span
                          className={`font-semibold uppercase px-1.5 py-0.2 rounded-[2px] ${
                            isWait
                              ? 'bg-amber-100 text-[#A66A00]'
                              : isDone
                              ? 'bg-[#F0FAF6] text-[#08795F]'
                              : isRun
                              ? 'bg-[#182536] text-white'
                              : 'text-[#5E6975]'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#182536] mt-1">{step.name}</div>
                      <div className="text-[11px] text-[#334256] mt-0.5 flex items-center justify-between">
                        <span>Agent: <b>{step.assignedAgent}</b></span>
                        <span className="font-mono text-[10px] text-[#5E6975]">
                          {step.executionDurationMs ? `${step.executionDurationMs}ms` : 'Instant'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E6975] mt-1 italic">
                        {step.outputDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invariant & Policy Verification */}
            <div className="p-3.5 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
                Governance Boundary Invariant
              </span>
              <p className="text-[#182536] font-mono text-[11px] leading-relaxed">
                Deterministic DAG execution with rollback compensation. Zero external state mutations without human authority at risk thresholds.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-3 bg-[#FAF9F5] border-t border-[#D5D5CE] flex items-center justify-between text-xs font-mono text-[#5E6975]">
          <span>Rollback Protection: Armed (Idempotent)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#182536] text-[#FFFDF8] rounded-[2px] text-xs font-medium hover:bg-[#334256] transition-colors"
          >
            Close Inspector
          </button>
        </footer>
      </aside>
    </>
  );
};
