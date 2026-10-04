import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, UserCheck } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="eyebrow block">
            Human Agency & Authority
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Human Decision Gateways
          </h1>
          <p className="text-sm font-sans text-[#52647B] mt-1 max-w-3xl">
            Operational review checkpoint: No high-risk autonomous action executes without explicit operator sign-off.
          </p>
        </div>

        <div className="flex items-center gap-1.5 border border-[#dce1e7] bg-white p-1 rounded-xs">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'pending'
                ? 'bg-[#17263d] text-white'
                : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'resolved'
                ? 'bg-[#17263d] text-white'
                : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            Resolved Decisions
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'all'
                ? 'bg-[#17263d] text-white'
                : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            All Gates ({approvals.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="axiom-panel p-12 text-center">
            <ShieldCheck size={28} className="mx-auto text-[#159a72] mb-2" />
            <h3 className="text-sm font-semibold text-[#17263d]">Decision Queue Clear</h3>
            <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
              All multi-agent pipelines are operating strictly within autonomous safety thresholds.
            </p>
          </div>
        ) : (
          filtered.map((req) => <ApprovalCard key={req.id} request={req} />)
        )}
      </div>
    </div>
  );
};
