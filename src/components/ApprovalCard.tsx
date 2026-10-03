import React, { useState } from 'react';
import { AlertCircle, Check, ShieldAlert, UserCheck, X } from 'lucide-react';
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
    <div className="axiom-panel p-5 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5D5CE] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#5E6975]">
              GATE ID: {request.id}
            </span>
            <span className="text-[#D5D5CE]">|</span>
            <span className="text-[10px] font-mono text-[#5E6975]">
              REQUESTED: {request.requestedAt}
            </span>
            <span
              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[2px] ${
                request.riskTier === 'critical'
                  ? 'bg-rose-100 text-[#B23C4B]'
                  : 'bg-[#FFF8DF] text-[#9A6900] border border-[#F3DFAA]'
              }`}
            >
              {request.riskTier} RISK
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#182536] mt-1">{request.stepName}</h3>
          <button
            type="button"
            onClick={() => navigateTo('workflow-detail', request.workflowId)}
            className="text-xs text-[#182536] hover:text-[#D72F40] underline mt-0.5 block font-mono"
          >
            Pipeline: {request.workflowTitle}
          </button>
        </div>

        <StatusBadge status={request.status} />
      </div>

      {/* Structured Decision Framework: 3 Crisp Inspection Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* 1. What is happening */}
        <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            1. Operational Context
          </span>
          <p className="text-[#182536] text-xs leading-relaxed">{request.summary}</p>
        </div>

        {/* 2. Policy Mandate */}
        <div className="p-3 bg-[#FFF8DF] border border-[#F3DFAA] rounded-[2px] space-y-1 text-[#9A6900]">
          <span className="text-[10px] font-mono uppercase block font-semibold">
            2. Policy Triggered
          </span>
          <p className="text-xs leading-relaxed font-mono text-[11px]">{request.policyTriggered}</p>
        </div>

        {/* 3. Proposed Action */}
        <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            3. Proposed Action
          </span>
          <p className="font-mono text-[11px] text-[#182536] bg-white p-2 rounded-[2px] border border-[#D5D5CE]">
            {request.proposedAction}
          </p>
        </div>
      </div>

      {/* Operator Decision Gate */}
      {!isResolved ? (
        <div className="pt-2 border-t border-[#D5D5CE] space-y-2">
          {showRejectInput && (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter official rejection justification for cryptographic ledger..."
              className="w-full px-3 py-1.5 text-xs border border-[#F7C3C8] rounded-[2px] bg-[#FDF2F3] text-[#182536] focus:outline-none"
            />
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] text-[#5E6975] font-mono">
              Enforcement Invariant: Zero high-risk execution permitted without cryptographic signature.
            </span>

            <div className="flex items-center gap-2">
              {!showRejectInput ? (
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="axiom-btn-danger"
                >
                  <X size={13} />
                  <span>Decline Action</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    rejectRequest(request.id, note || 'Operator declined authorization');
                    setShowRejectInput(false);
                  }}
                  className="axiom-btn-danger bg-[#B23C4B] text-white hover:bg-[#922D3A]"
                >
                  Confirm Rejection
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  approveRequest(request.id, note || 'Operator verified and authorized')
                }
                className="axiom-btn-success"
              >
                <Check size={13} />
                <span>Authorize Execution</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-[#D5D5CE] flex items-center justify-between text-xs text-[#5E6975] font-mono">
          <span>Decision Finalized by {request.resolvedBy}</span>
          <span>Timestamp: {request.resolvedAt}</span>
        </div>
      )}
    </div>
  );
};
