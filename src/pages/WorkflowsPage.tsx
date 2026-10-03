import React, { useState } from 'react';
import { ArrowRight, Play, Plus, Search, ShieldAlert, Workflow } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const WorkflowsPage: React.FC = () => {
  const { workflows, navigateTo, runWorkflow, openModal } = useOperationsStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(workflows.map((w) => w.category)));

  const filtered = workflows.filter((w) => {
    if (filterCategory !== 'all' && w.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Orchestrated Workflows
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Multi-agent directed acyclic task pipelines with human gate checkpoints
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal('create-workflow')}
          className="px-3.5 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded-md font-medium inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} />
          <span>New Workflow Pipeline</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-[#1b2e49] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories ({workflows.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-[#1b2e49] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((wf) => {
          const hasWaiting = wf.steps.some((s) => s.status === 'waiting_approval');

          return (
            <div
              key={wf.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {hasWaiting ? (
                      <StatusBadge status="waiting_approval" size="sm" />
                    ) : (
                      <StatusBadge status={wf.status} size="sm" />
                    )}
                    <span className="text-[11px] font-mono text-slate-400">ID: {wf.id}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                      wf.riskTier === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : wf.riskTier === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {wf.riskTier} Risk
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mt-2">{wf.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Steps</span>
                    <span className="font-semibold text-slate-800">{wf.steps.length}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Runs</span>
                    <span className="font-semibold text-slate-800">{wf.totalRuns}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Last Run</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate block">
                      {wf.lastRunAt || 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => runWorkflow(wf.id)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded border border-slate-200 font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Play size={12} />
                  <span>Execute Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('workflow-detail', wf.id)}
                  className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Pipeline</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
