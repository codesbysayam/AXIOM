import React from 'react';
import { ArrowLeft, Play, ShieldAlert, Workflow } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { WorkflowPipeline } from '../components/WorkflowPipeline';
import { StatusBadge } from '../components/StatusBadge';

export const WorkflowDetailPage: React.FC = () => {
  const { workflows, selectedWorkflowId, navigateTo, runWorkflow } = useOperationsStore();

  const workflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  if (!workflow) {
    return (
      <div className="p-10 text-center text-xs text-slate-500">
        Workflow not found.
        <button
          type="button"
          onClick={() => navigateTo('workflows')}
          className="text-blue-600 underline ml-2"
        >
          Return to workflows
        </button>
      </div>
    );
  }

  const hasWaiting = workflow.steps.some((s) => s.status === 'waiting_approval');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigateTo('workflows')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md border border-slate-200 transition-colors"
          aria-label="Back to workflows"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Pipeline ID: {workflow.id}</span>
            <span className="text-xs font-mono text-slate-400">· Category: {workflow.category}</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 font-serif mt-0.5">{workflow.title}</h1>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={hasWaiting ? 'waiting_approval' : workflow.status} size="sm" />
              <span className="text-xs font-mono text-slate-500">
                Risk Tier: <span className="font-semibold uppercase">{workflow.riskTier}</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{workflow.description}</p>
          </div>

          <button
            type="button"
            onClick={() => runWorkflow(workflow.id)}
            className="px-4 py-2 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium inline-flex items-center gap-1.5 shadow-xs self-start sm:self-auto flex-shrink-0"
          >
            <Play size={13} />
            <span>Execute Pipeline</span>
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
            Execution Steps & Decision Flow ({workflow.steps.length})
          </h3>
          <WorkflowPipeline steps={workflow.steps} />
        </div>
      </div>
    </div>
  );
};
