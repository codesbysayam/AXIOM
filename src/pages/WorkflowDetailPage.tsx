import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Play,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Workflow,
  XCircle,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const WorkflowDetailPage: React.FC = () => {
  const { workflows, selectedWorkflowId, navigateTo, runWorkflow, simulationClock } = useOperationsStore();

  const workflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  if (!workflow) {
    return (
      <div className="p-10 text-center text-xs text-[#718096]">
        Workflow not found.
        <button
          type="button"
          onClick={() => navigateTo('workflows')}
          className="text-[#17263d] underline ml-2"
        >
          Return to workflows
        </button>
      </div>
    );
  }

  const hasWaiting = workflow.steps.some((s) => s.status === 'waiting_approval');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#dce1e7] pb-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigateTo('workflows')}
            className="p-1.5 text-[#40516a] hover:text-[#17263d] hover:bg-white rounded-xs border border-[#dce1e7] transition-colors mt-1"
            aria-label="Back to workflows registry"
          >
            <ArrowLeft size={13} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow">
                Pipeline <span className="font-mono text-[#17263A]">{workflow.id}</span>
              </span>
              <span className="text-xs text-[#dce1e7]">·</span>
              <span className="text-xs font-sans text-[#68758A]">
                Category: {workflow.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
              {workflow.title}
            </h1>
            <p className="text-sm font-sans text-[#40516A] mt-1 max-w-3xl leading-relaxed">
              {workflow.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          {workflow.status === 'running' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF1FA] border border-[#3569A8]/40 rounded-[4px] text-xs font-sans text-[#3569A8]">
              <Clock size={12} className="animate-spin text-[#3569A8]" />
              <span>SYNCED TICK <span className="font-mono font-medium">#{simulationClock.tick}</span></span>
            </div>
          )}
          <StatusBadge status={hasWaiting ? 'waiting_approval' : workflow.status} />
          <button
            type="button"
            onClick={() => runWorkflow(workflow.id)}
            className="axiom-btn-primary"
          >
            <Play size={12} />
            <span>Execute Pipeline</span>
          </button>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 border border-[#dce1e7] rounded-[4px] font-sans text-xs">
        <div>
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Risk Classification</span>
          <span className="font-semibold text-[#17263A] uppercase">{workflow.riskTier} Risk</span>
        </div>
        <div>
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Total Executions</span>
          <span className="font-semibold font-mono text-[#17263A]">{workflow.totalRuns}</span>
        </div>
        <div>
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Last State Update</span>
          <span className="text-[#40516A] font-mono">{workflow.lastRunAt || 'Never'}</span>
        </div>
        <div>
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Security Guardrail</span>
          <span className="text-[#00866B] font-semibold">Active Invariant Pass</span>
        </div>
      </div>

      {/* EXECUTION TIMELINE THEATER */}
      <div className="axiom-panel">
        <div className="axiom-panel-header bg-[#faf9f5]">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.06em] text-[#68758A]">
            Execution Timeline & Decision Trace ({workflow.steps.length} Steps)
          </span>
          <span className="text-xs font-sans text-[#68758A]">
            Trace ID: <span className="font-mono text-[#17263A]">{workflow.id}-trace-active</span>
          </span>
        </div>

        <div className="p-6">
          <div className="relative border-l-2 border-[#dce1e7] ml-4 space-y-6">
            {workflow.steps.map((step, idx) => {
              const isWaiting = step.status === 'waiting_approval';
              const isDone = step.status === 'completed';
              const isRunning = step.status === 'running';

              return (
                <div key={step.id} className="relative pl-6">
                  {/* Timeline Node Marker */}
                  <div
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${
                      isWaiting
                        ? 'border-[#d99000] text-[#d99000]'
                        : isDone
                        ? 'border-[#159a72] text-[#159a72]'
                        : isRunning
                        ? 'border-[#17263d] text-[#17263d] animate-ping'
                        : 'border-[#dce1e7] text-[#a0aec0]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  {/* Step Item */}
                  <div className="bg-[#fbfaf7] border border-[#dce1e7] rounded-xs p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e9ecef] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#e63946]">
                          0{idx + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-[#17263d]">
                          {step.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={step.status} size="sm" />
                        {step.executionDurationMs !== undefined && (
                          <span className="text-[10px] font-mono text-[#718096]">
                            {step.executionDurationMs}ms
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#52647B] font-sans">
                      <span>Agent: <strong className="text-[#17263A] font-semibold">{step.assignedAgent}</strong></span>
                      <span>·</span>
                      <span>Required Skill: <strong className="text-[#17263A] font-semibold">{step.requiredSkill}</strong></span>
                      {step.executedAt && (
                        <>
                          <span>·</span>
                          <span>Timestamp: <span className="font-mono">{step.executedAt}</span></span>
                        </>
                      )}
                    </div>

                    {/* Input / Output Trace Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 font-sans">
                      <div className="bg-white p-2.5 rounded-[4px] border border-[#e9ecef]">
                        <span className="text-[10px] font-sans uppercase font-semibold text-[#68758A] tracking-[0.06em] block mb-0.5">
                          Input Payload:
                        </span>
                        <div className="text-xs text-[#17263A] font-sans leading-relaxed">
                          {step.inputDescription}
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-[4px] border border-[#e9ecef]">
                        <span className="text-[10px] font-sans uppercase font-semibold text-[#68758A] tracking-[0.06em] block mb-0.5">
                          Decision Output / Verification:
                        </span>
                        <div className="text-xs text-[#17263A] font-sans leading-relaxed">
                          {step.outputDescription || 'Awaiting execution dispatch...'}
                        </div>
                      </div>
                    </div>

                    {isWaiting && (
                      <div className="p-2.5 bg-[#fef8ea] border border-[#f3d99d] rounded-xs flex items-center justify-between gap-3 text-xs text-[#945f00]">
                        <div className="flex items-center gap-2">
                          <UserCheck size={14} className="flex-shrink-0" />
                          <span>
                            Execution paused at policy checkpoint. Human operator approval is required to proceed.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateTo('approvals')}
                          className="axiom-btn-primary py-1 px-3 text-xs whitespace-nowrap"
                        >
                          Review in Approvals
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
