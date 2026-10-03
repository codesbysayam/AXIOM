import React, { useState } from 'react';
import { AlertCircle, Check, ShieldAlert, X } from 'lucide-react';
import { ApprovalRequest } from '../types';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from './StatusBadge';

export interface ApprovalCardProps {
  request: ApprovalRequest;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request }) => {
  const { approveRequest, rejectRequest, navigateTo } = useOperationsStore();
  const [note, setNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isResolved = request.status !== 'pending';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} size="sm" />
            <span className="text-xs font-mono text-slate-400">ID: {request.id}</span>
            <span className="text-xs font-mono text-slate-400">· {request.requestedAt}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mt-1.5">{request.stepName}</h3>
          <button
            type="button"
            onClick={() => navigateTo('workflow-detail', request.workflowId)}
            className="text-xs text-blue-600 hover:underline mt-0.5 inline-block"
          >
            Workflow: {request.workflowTitle}
          </button>
        </div>

        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
            request.riskTier === 'critical'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {request.riskTier} Risk
        </span>
      </div>

      <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
        <p className="font-medium text-slate-700">Summary:</p>
        <p className="mt-0.5">{request.summary}</p>

        <p className="font-medium text-slate-700 mt-2">Proposed Action:</p>
        <p className="mt-0.5 text-slate-800 font-mono text-[11px] bg-white p-1.5 rounded border border-slate-200">
          {request.proposedAction}
        </p>

        <div className="flex items-center gap-1.5 text-amber-800 mt-2 pt-2 border-t border-slate-200 text-[11px]">
          <ShieldAlert size={13} className="flex-shrink-0" />
          <span>{request.policyTriggered}</span>
        </div>
      </div>

      {!isResolved ? (
        <div className="mt-3.5 space-y-2">
          {showRejectInput && (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter rejection reason for audit trail..."
              className="w-full px-2.5 py-1.5 text-xs border border-rose-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 bg-rose-50/30"
            />
          )}

          <div className="flex items-center justify-end gap-2">
            {!showRejectInput ? (
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded border border-rose-200 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <X size={13} />
                <span>Reject</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  rejectRequest(request.id, note || 'Operator declined authorization');
                  setShowRejectInput(false);
                }}
                className="px-3 py-1.5 text-xs text-white bg-rose-600 hover:bg-rose-700 rounded font-medium inline-flex items-center gap-1 transition-colors"
              >
                Confirm Reject
              </button>
            )}

            <button
              type="button"
              onClick={() => approveRequest(request.id, note || 'Operator verified and authorized')}
              className="px-3.5 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check size={13} />
              <span>Authorize Execution</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Resolved by {request.resolvedBy}</span>
          <span>{request.resolvedAt}</span>
        </div>
      )}
    </div>
  );
};
