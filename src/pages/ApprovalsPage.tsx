import React, { useState } from 'react';
import { CheckSquare, Filter, ShieldCheck } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { ApprovalCard } from '../components/ApprovalCard';

export const ApprovalsPage: React.FC = () => {
  const { approvals } = useOperationsStore();
  const [filter, setFilter] = useState<'pending' | 'resolved' | 'all'>('pending');

  const filtered = approvals.filter((appr) => {
    if (filter === 'pending') return appr.status === 'pending';
    if (filter === 'resolved') return appr.status !== 'pending';
    return true;
  });

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Human Approval Gateways
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Operational review checkpoint: No high-risk action executes without human sign-off
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Action ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filter === 'resolved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({approvals.length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-lg">
            <ShieldCheck size={28} className="mx-auto text-emerald-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No Pending Approvals</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All multi-agent pipelines are operating within autonomous safety thresholds.
            </p>
          </div>
        ) : (
          filtered.map((req) => <ApprovalCard key={req.id} request={req} />)
        )}
      </div>
    </div>
  );
};
