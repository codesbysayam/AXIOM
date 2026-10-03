import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from './StatusBadge';

export const RecentWorkflowsWidget: React.FC = () => {
  const { workflows, navigateTo, runWorkflow } = useOperationsStore();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          Recent Orchestrated Pipelines
        </h3>
        <button
          type="button"
          onClick={() => navigateTo('workflows')}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {workflows.slice(0, 4).map((wf) => {
          const hasWaiting = wf.steps.some((s) => s.status === 'waiting_approval');

          return (
            <div key={wf.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => navigateTo('workflow-detail', wf.id)}
                  className="text-xs font-medium text-slate-900 hover:text-blue-600 truncate block text-left"
                >
                  {wf.title}
                </button>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                  <span>{wf.category}</span>
                  <span>·</span>
                  <span>{wf.steps.length} steps</span>
                  <span>·</span>
                  <span>{wf.lastRunAt || 'Never run'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {hasWaiting ? (
                  <StatusBadge status="waiting_approval" size="sm" />
                ) : (
                  <StatusBadge status={wf.status} size="sm" />
                )}

                <button
                  type="button"
                  onClick={() => runWorkflow(wf.id)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded"
                  title="Trigger pipeline run"
                  aria-label="Run workflow"
                >
                  <Play size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
