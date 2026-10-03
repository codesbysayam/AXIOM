import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Eye, Filter } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';
import { CaseInspectorModal } from '../components/CaseInspectorModal';
import { CaseItem } from '../types';

export const CasesPage: React.FC = () => {
  const { cases } = useOperationsStore();
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filtered = cases.filter((c) => {
    if (filter === 'open') return c.status !== 'resolved';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Operational Cases & Triage
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Exception investigations, compliance disputes, and incident casework
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              filter === 'open' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Active Open
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              filter === 'resolved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-[11px] font-mono text-slate-400">ID: {item.id}</span>
                <span className="text-[11px] font-mono text-slate-400">· {item.createdAt}</span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                    item.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : item.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.priority} Priority
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.summary}</p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Assigned: {item.assignedAgent} · Category: {item.category}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCase(item)}
              className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium inline-flex items-center gap-1.5 flex-shrink-0 self-start sm:self-auto shadow-xs"
            >
              <Eye size={13} />
              <span>Inspect Case</span>
            </button>
          </div>
        ))}
      </div>

      <CaseInspectorModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
};
