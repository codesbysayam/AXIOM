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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dce1e7] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#718096]">
              GATE ID: {request.id}
            </span>
            <span className="text-[#dce1e7]">|</span>
            <span className="text-[10px] font-mono text-[#718096]">
              REQUESTED: {request.requestedAt}
            </span>
            <span
              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs ${
                request.riskTier === 'critical'
                  ? 'bg-rose-100 text-[#c83e4d]'
                  : 'bg-amber-100 text-[#945f00]'
              }`}
            >
              {request.riskTier} RISK
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#17263d] mt-1">{request.stepName}</h3>
          <button
            type="button"
            onClick={() => navigateTo('workflow-detail', request.workflowId)}
            className="text-xs text-[#17263d] hover:text-[#e63946] underline mt-0.5 block font-mono"
          >
            Pipeline: {request.workflowTitle}
          </button>
        </div>

        <StatusBadge status={request.status} />
      </div>

      {/* Structured Decision Framework: 3 Crisp Inspection Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* 1. What is happening */}
        <div className="p-3 bg-[#fbfaf7] border border-[#dce1e7] rounded-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#718096] block font-semibold">
            1. Operational Context
          </span>
          <p className="text-[#17263d] text-xs leading-relaxed">{request.summary}</p>
        </div>

        {/* 2. Policy Mandate */}
        <div className="p-3 bg-[#fef8ea] border border-[#f3d99d] rounded-xs space-y-1 text-[#945f00]">
          <span className="text-[10px] font-mono uppercase block font-semibold">
            2. Policy Triggered
          </span>
          <p className="text-xs leading-relaxed font-mono text-[11px]">{request.policyTriggered}</p>
        </div>

        {/* 3. Proposed Action */}
        <div className="p-3 bg-[#fbfaf7] border border-[#dce1e7] rounded-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#718096] block font-semibold">
            3. Proposed Action
          </span>
          <p className="font-mono text-[11px] text-[#17263d] bg-white p-2 rounded-xs border border-[#e2e8f0]">
            {request.proposedAction}
          </p>
        </div>
      </div>

      {/* Operator Decision Gate */}
      {!isResolved ? (
        <div className="pt-2 border-t border-[#dce1e7] space-y-2">
          {showRejectInput && (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter official rejection justification for cryptographic ledger..."
              className="w-full px-3 py-1.5 text-xs border border-[#f7c3c8] rounded-xs bg-[#fdf2f3] text-[#17263d] focus:outline-none"
            />
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] text-[#718096] font-mono">
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
                  className="axiom-btn-danger bg-[#c83e4d] text-white hover:bg-[#a42331]"
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
        <div className="pt-2 border-t border-[#dce1e7] flex items-center justify-between text-xs text-[#718096] font-mono">
          <span>Decision Finalized by {request.resolvedBy}</span>
          <span>Timestamp: {request.resolvedAt}</span>
        </div>
      )}
    </div>
  );
};
