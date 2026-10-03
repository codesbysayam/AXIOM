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
import { WorkflowDefinition, WorkflowStep } from '../types';

export const WorkflowsPage: React.FC = () => {
  const { workflows, navigateTo, runWorkflow, openModal, approveRequest } = useOperationsStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simActiveStep, setSimActiveStep] = useState<number>(-1);

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

  const selectedStepData = selectedWf?.steps.find((s) => s.id === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Orchestration Fabric
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Multi-Agent Orchestration DAGs
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Deterministic directed acyclic graphs with policy-enforced human gates and atomic state rollback
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSimulateExecution(selectedWf.id)}
            disabled={isSimulating}
            className="axiom-btn-secondary"
          >
            <Play size={12} className={isSimulating ? 'animate-spin text-[#d99000]' : 'text-[#17263d]'} />
            <span>{isSimulating ? `Executing Step ${simActiveStep + 1}...` : 'Simulate Run'}</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('create-workflow')}
            className="axiom-btn-primary"
          >
            <Plus size={13} />
            <span>New Workflow Pipeline</span>
          </button>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Impressive Multi-Agent DAG Topology Canvas */}
      <div className="axiom-panel overflow-hidden border border-[#dce1e7] bg-[#ffffff]">
        {/* Topology Canvas Toolbar */}
        <div className="axiom-panel-header bg-[#faf9f5] border-b border-[#dce1e7]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-[#718096]">
              <Workflow size={13} className="text-[#17263d]" />
              <span className="font-semibold text-[#17263d]">Active Pipeline:</span>
            </div>
            <select
              value={activeWorkflowId}
              onChange={(e) => {
                setActiveWorkflowId(e.target.value);
                setSelectedNodeId(null);
              }}
              className="font-serif text-sm font-bold text-[#17263d] bg-transparent border-0 focus:outline-none cursor-pointer hover:underline"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({w.steps.length} nodes)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-[#718096]">
              Risk:{' '}
              <span
                className={`uppercase font-bold ${
                  selectedWf.riskTier === 'critical'
                    ? 'text-[#c83e4d]'
                    : selectedWf.riskTier === 'high'
                    ? 'text-[#d99000]'
                    : 'text-[#159a72]'
                }`}
              >
                {selectedWf.riskTier}
              </span>
            </span>
            <span className="text-[#dce1e7]">|</span>
            <span className="text-[#718096]">
              Runs: <span className="font-bold text-[#17263d]">{selectedWf.totalRuns}</span>
            </span>
          </div>
        </div>

        {/* DAG Architecture Grid Canvas */}
        <div className="p-6 bg-[#fbfaf7] relative border-b border-[#dce1e7]">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#718096]">
              <span>DAG TOPOLOGY MAP · PARALLEL RESOLUTION WITH DETERMINISTIC CONVERGENCE</span>
              <span className="text-[10px] bg-white px-2 py-0.5 border border-[#dce1e7] rounded-[2px]">
                Click any node to inspect payload & agent invariant
              </span>
            </div>

            {/* Visual Node Sequence */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1">
              {/* Trigger Node */}
              <div className="flex-shrink-0 w-36 p-3 bg-white border border-[#dce1e7] rounded-[2px] shadow-2xs">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#718096] uppercase">
                  <span>Input</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#159a72]" />
                </div>
                <div className="text-xs font-serif font-bold text-[#17263d] mt-1">Event Ingest</div>
                <div className="text-[10px] text-[#718096] font-mono mt-0.5 truncate">
                  Webhook / API
                </div>
                <div className="mt-2 pt-1 border-t border-[#f0eee6] text-[9px] font-mono text-[#159a72]">
                  Valid Schema
                </div>
              </div>

              {/* Connecting Vector */}
              <div className="text-[#a0aec0] flex-shrink-0 font-mono text-sm">→</div>

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
                          ? 'border-2 border-[#17263d] bg-white ring-2 ring-[#17263d]/10'
                          : isWaiting
                          ? 'border-2 border-[#d99000] bg-[#fefdf8]'
                          : isCurrentlySimulating
                          ? 'border-2 border-[#159a72] bg-white animate-pulse'
                          : 'border border-[#dce1e7] bg-white hover:border-[#b8c2cc]'
                      }`}
                    >
                      {/* Node Top Meta */}
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#718096] uppercase font-semibold">NODE 0{idx + 1}</span>
                        {step.requiresApproval ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#945f00] bg-[#fef8ea] px-1.5 py-0.2 rounded-[2px] border border-[#f3d99d]">
                            <Lock size={9} />
                            HUMAN GATE
                          </span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              isCompleted
                                ? 'text-[#159a72]'
                                : isCurrentlySimulating
                                ? 'text-[#d99000]'
                                : 'text-[#718096]'
                            }`}
                          >
                            {isCompleted ? 'VERIFIED' : isCurrentlySimulating ? 'RUNNING' : 'PENDING'}
                          </span>
                        )}
                      </div>

                      {/* Node Title */}
                      <div className="text-xs font-serif font-bold text-[#17263d] mt-1.5 truncate" title={step.name}>
                        {step.name}
                      </div>

                      {/* Assigned Agent */}
                      <div className="text-[10px] font-mono text-[#40516a] mt-0.5 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17263d]" />
                        <span>{step.assignedAgent}</span>
                      </div>

                      {/* Required Skill */}
                      <div className="mt-2.5 pt-2 border-t border-[#f0eee6] flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#718096] truncate max-w-[120px]">{step.requiredSkill}</span>
                        <span className="text-[#a0aec0]">140ms</span>
                      </div>
                    </div>

                    {/* Connecting Vector */}
                    {idx < selectedWf.steps.length - 1 && (
                      <div className="text-[#a0aec0] flex-shrink-0 font-mono text-sm">→</div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Connecting Vector */}
              <div className="text-[#a0aec0] flex-shrink-0 font-mono text-sm">→</div>

              {/* Final Commit Node */}
              <div className="flex-shrink-0 w-36 p-3 bg-[#f0faf6] border border-[#c7eadf] rounded-[2px] shadow-2xs">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#0d6b4f] uppercase">
                  <span>Commit</span>
                  <CheckCircle2 size={11} className="text-[#159a72]" />
                </div>
                <div className="text-xs font-serif font-bold text-[#0d6b4f] mt-1">Audit Ledger</div>
                <div className="text-[10px] text-[#0d6b4f] font-mono mt-0.5 truncate">
                  SHA-256 Signed
                </div>
                <div className="mt-2 pt-1 border-t border-[#c7eadf] text-[9px] font-mono text-[#0d6b4f]">
                  Immutable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Deep Inspector Tray */}
        {selectedStepData && (
          <div className="p-4 bg-white border-t border-[#dce1e7] flex flex-col md:flex-row items-start justify-between gap-4 text-xs animate-in fade-in duration-150">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-[#e63946] px-1.5 py-0.2 bg-red-50 rounded-[2px] border border-red-100">
                  Node Inspector
                </span>
                <span className="font-serif font-bold text-sm text-[#17263d]">
                  {selectedStepData.name}
                </span>
                <span className="font-mono text-[10px] text-[#718096]">
                  ({selectedStepData.assignedAgent})
                </span>
              </div>
              <div className="text-[11px] text-[#40516a] leading-relaxed">
                <span className="font-mono font-semibold text-[#17263d]">Input Payload: </span>
                {selectedStepData.inputDescription}
              </div>
              <div className="text-[11px] text-[#40516a] leading-relaxed">
                <span className="font-mono font-semibold text-[#17263d]">Expected Output: </span>
                {selectedStepData.outputDescription}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
              {selectedStepData.requiresApproval && (
                <div className="p-2 bg-[#fef8ea] border border-[#f3d99d] rounded-[2px] text-[11px] text-[#945f00] font-mono">
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
                ? 'bg-[#17263d] text-white shadow-2xs'
                : 'bg-white border border-[#dce1e7] text-[#40516a] hover:bg-[#f6f5f0]'
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
                  ? 'bg-[#17263d] text-white shadow-2xs'
                  : 'bg-white border border-[#dce1e7] text-[#40516a] hover:bg-[#f6f5f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#718096]">
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

              return (
                <tr
                  key={wf.id}
                  onClick={() => {
                    setActiveWorkflowId(wf.id);
                    setSelectedNodeId(null);
                  }}
                  className={`cursor-pointer ${isSelected ? 'bg-[#faf8f3]' : ''}`}
                >
                  <td>
                    <div className="font-serif font-bold text-sm text-[#17263d]">{wf.title}</div>
                    <div className="text-[10px] font-mono text-[#718096]">{wf.id}</div>
                  </td>
                  <td className="text-[#40516a] text-xs font-mono">{wf.category}</td>
                  <td>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                        wf.riskTier === 'critical'
                          ? 'bg-rose-50 text-[#c83e4d] border-rose-200'
                          : wf.riskTier === 'high'
                          ? 'bg-amber-50 text-[#945f00] border-amber-200'
                          : 'bg-slate-50 text-[#40516a] border-slate-200'
                      }`}
                    >
                      {wf.riskTier}
                    </span>
                  </td>
                  <td>
                    <StatusBadge
                      status={hasWaiting ? 'waiting_approval' : wf.status}
                      size="sm"
                    />
                  </td>
                  <td>
                    <div className="text-[11px] text-[#40516a] truncate max-w-xs font-mono">
                      {Array.from(new Set(wf.steps.map((s) => s.assignedAgent))).join(', ')}
                    </div>
                  </td>
                  <td className="font-mono text-xs text-[#17263d] font-semibold">{wf.steps.length}</td>
                  <td className="font-mono text-xs text-[#718096]">{wf.totalRuns.toLocaleString()}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateExecution(wf.id);
                        }}
                        className="axiom-btn-secondary py-1 px-2.5 text-xs"
                        title="Trigger immediate execution"
                      >
                        <Play size={11} />
                        <span>Run</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('workflow-detail', wf.id);
                        }}
                        className="axiom-btn-primary py-1 px-2.5 text-xs"
                      >
                        <span>Inspect</span>
                        <ArrowRight size={11} />
                      </button>
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
