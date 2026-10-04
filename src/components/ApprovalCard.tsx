import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck2,
  HelpCircle,
  Lock,
  Pause,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { ApprovalRequest } from '../types';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from './StatusBadge';

export interface ApprovalCardProps {
  request: ApprovalRequest;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request }) => {
  const { approveRequest, rejectRequest, navigateTo, addToast } = useOperationsStore();
  const [confirmingAuth, setConfirmingAuth] = useState(false);
  const [holding, setHolding] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [modifiedAmount, setModifiedAmount] = useState('24,000.00');

  const isResolved = request.status !== 'pending';

  const handleAuthorize = () => {
    approveRequest(request.id, showDiff ? `Approved with operator adjustment to $${modifiedAmount} USD` : undefined);
    setConfirmingAuth(false);
    addToast(
      'Execution Gate Released',
      `Gate ${request.id} authorized by Lead Operator. Resuming downstream pipeline.`,
      'success',
    );
  };

  const handleDecline = () => {
    rejectRequest(request.id, declineReason || 'Operator safety decline');
    setDeclining(false);
    addToast(
      'Action Declined',
      `Gate ${request.id} halted. Safe state preserved.`,
      'error',
    );
  };

  const handleHold = () => {
    setHolding(true);
    addToast(
      'Gate Held on Standby',
      `Gate ${request.id} held on standby for secondary review.`,
      'warning',
    );
  };

  return (
    <div className="axiom-panel border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] shadow-2xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 bg-[#FAF9F5] border-b border-[#D5D5CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold">
              GATE ID: {request.id}
            </span>
            <span className="text-[#D5D5CE]">|</span>
            <span className="text-[10px] font-mono text-[#5E6975]">
              REQUESTED: {request.requestedAt}
            </span>
            <span className="text-[#D5D5CE]">|</span>
            <span
              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                request.riskTier === 'critical'
                  ? 'bg-rose-50 text-[#B52D3D] border-rose-200'
                  : 'bg-[#FFF7DF] text-[#A66A00] border-[#E1BF70]'
              }`}
            >
              {request.riskTier} RISK
            </span>
            <span className="text-[10px] font-mono text-[#08795F] bg-[#F0FAF6] px-1.5 py-0.2 border border-[#C3E6DB] rounded-[2px]">
              Rollback: Armed
            </span>
          </div>

          <h3 className="text-base font-serif font-bold text-[#182536] mt-1">
            {request.stepName}
          </h3>

          <button
            type="button"
            onClick={() => navigateTo('workflow-detail', request.workflowId)}
            className="text-xs text-[#5E6975] hover:text-[#182536] underline mt-0.5 inline-flex items-center gap-1 font-mono"
          >
            <span>Target Pipeline: {request.workflowTitle}</span>
            <ArrowRight size={10} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          {!isResolved && (
            <button
              type="button"
              onClick={() => setShowDiff((d) => !d)}
              className={`text-[10px] font-mono px-2 py-1 rounded-[2px] border transition-colors inline-flex items-center gap-1 ${
                showDiff
                  ? 'bg-[#182536] text-[#FFFDF8] border-[#182536]'
                  : 'bg-[#FFFDF8] text-[#334256] border-[#D5D5CE] hover:bg-[#EFEFEB]'
              }`}
              title="Toggle proposed vs authorized comparison diff"
            >
              <Edit3 size={10} />
              <span>{showDiff ? 'Close Diff View' : 'Operator Diff View'}</span>
            </button>
          )}
        </div>
      </div>

      {/* THREE STRUCTURED VISUAL ZONES: 1. CONTEXT, 2. POLICY, 3. DECISION */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ZONE 1: OPERATIONAL CONTEXT */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block">
                01 / BUSINESS CONTEXT
              </span>
              <p className="text-xs text-[#182536] font-medium leading-relaxed mt-1">
                {request.summary}
              </p>
            </div>
            <div className="pt-2 border-t border-[#D5D5CE]/60 text-[10px] font-mono text-[#5E6975] space-y-0.5">
              <div>Agent: <b>Task Executor</b></div>
              <div>Workflow: <b>{request.workflowTitle}</b></div>
            </div>
          </div>

          {/* ZONE 2: GOVERNANCE POLICY */}
          <div className="p-3.5 bg-[#FFF7DF] border border-[#E1BF70] rounded-[2px] space-y-2 text-[#A66A00] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-semibold block">
                  02 / POLICY MANDATE
                </span>
                <ShieldAlert size={13} />
              </div>
              <p className="text-xs leading-relaxed font-mono font-bold mt-1 text-[#784D00]">
                {request.policyTriggered}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E1BF70]/60 text-[10px] font-mono space-y-0.5 text-[#A66A00]">
              <div>Invariant: Mandatory Human Review</div>
              <div>Enforcement: Fail-Closed Intercept</div>
            </div>
          </div>

          {/* ZONE 3: EVIDENCE CHAIN */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block">
                03 / VERIFIED EVIDENCE
              </span>
              <div className="space-y-1 mt-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#08795F] font-mono text-[11px]">
                  <CheckCircle2 size={11} /> <span>Vendor identity authenticated</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#08795F] font-mono text-[11px]">
                  <CheckCircle2 size={11} /> <span>PO match cross-verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#08795F] font-mono text-[11px]">
                  <CheckCircle2 size={11} /> <span>Duplicate disbursement check passed</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#A66A00] font-mono text-[11px]">
                  <ShieldAlert size={11} /> <span>Threshold exceeded ($10,000 cap)</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#D5D5CE]/60 text-[10px] font-mono text-[#08795F]">
              System Recommends: <b>AUTHORIZE</b>
            </div>
          </div>
        </div>

        {/* APPROVAL DIFF VIEW (PROPOSED ACTION vs OPERATOR MODIFICATION) */}
        {showDiff && !isResolved && (
          <div className="p-4 border border-[#182536] bg-[#FAF9F5] rounded-[2px] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
              <span className="text-xs font-mono font-bold text-[#182536] flex items-center gap-1.5">
                <Edit3 size={12} className="text-[#A66A00]" />
                OPERATOR ADJUSTMENT DIFF VIEW
              </span>
              <span className="text-[10px] font-mono text-[#5E6975]">
                Modified by: Lead Operator · 12:04:19
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-white border border-[#D5D5CE] rounded-[2px] space-y-1">
                <span className="text-[10px] uppercase text-[#5E6975] block">SYSTEM PROPOSAL:</span>
                <div className="text-sm font-bold text-[#B52D3D] line-through">
                  Release $28,450.00 USD
                </div>
                <p className="text-[10px] text-[#5E6975]">Direct execution from unadjusted invoice</p>
              </div>

              <div className="p-3 bg-[#F0FAF6] border border-[#C3E6DB] rounded-[2px] space-y-1">
                <span className="text-[10px] uppercase text-[#08795F] block font-semibold">
                  OPERATOR MODIFICATION:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#08795F]">$</span>
                  <input
                    type="text"
                    value={modifiedAmount}
                    onChange={(e) => setModifiedAmount(e.target.value)}
                    className="text-sm font-bold text-[#08795F] bg-white border border-[#C3E6DB] px-2 py-0.5 rounded-[2px] w-36 font-mono"
                    aria-label="Adjusted amount"
                  />
                  <span className="text-xs text-[#08795F] font-bold">USD</span>
                </div>
                <p className="text-[10px] text-[#5E6975]">Withholds pending disputed cloud storage surcharge</p>
              </div>
            </div>
          </div>
        )}

        {/* Proposed Action Strip */}
        <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold">
              Action Payload:
            </span>
            <span className="font-mono text-[11px] text-[#182536]">
              {showDiff ? `Disburse wire transfer of ${modifiedAmount} USD to verified vendor bank account (Vendor ID: VEND-9921)` : request.proposedAction}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#5E6975] flex-shrink-0">
            Target SLA: 15 min
          </span>
        </div>

        {/* DECISION ZONE */}
        {!isResolved ? (
          <div className="pt-3 border-t border-[#D5D5CE] space-y-3">
            {declining && (
              <div className="p-3 bg-[#FFF0F1] border border-rose-200 rounded-[2px] space-y-2 animate-in fade-in duration-150">
                <span className="text-xs font-mono font-bold text-[#B52D3D] block">
                  Rejection Reason (Recorded in Tamper-Evident Ledger):
                </span>
                <input
                  type="text"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Surcharge invoice unverified by procurement officer..."
                  className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-[2px] bg-white text-[#182536] focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeclining(false)}
                    className="px-2.5 py-1 text-xs text-[#5E6975] hover:text-[#182536]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="px-3 py-1 bg-[#B52D3D] text-white text-xs font-semibold rounded-[2px]"
                  >
                    Confirm Rejection & Halt Pipeline
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#5E6975] font-mono leading-relaxed">
                By authorizing, the operator releases the execution gate and commits the cryptographic signature.
              </span>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleHold}
                  className="axiom-btn-secondary py-1.5 px-3 text-xs"
                  title="Temporarily hold this request in queue"
                >
                  <Pause size={12} />
                  <span>{holding ? 'Held on Standby' : 'Hold Gate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeclining(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#B52D3D] hover:bg-[#FFF0F1] border border-[#F3C4C9] rounded-[2px] transition-colors"
                >
                  <X size={12} />
                  <span>Decline Action</span>
                </button>

                {confirmingAuth ? (
                  <div className="flex items-center gap-1.5 bg-[#FFF7DF] p-1 rounded-[2px] border border-[#E1BF70]">
                    <span className="text-[10px] font-mono font-bold text-[#A66A00] px-1">
                      Confirm release?
                    </span>
                    <button
                      type="button"
                      onClick={handleAuthorize}
                      className="px-2.5 py-1 bg-[#08795F] text-white text-xs font-bold rounded-[2px] hover:bg-[#065b48]"
                    >
                      Confirm Authorization
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingAuth(false)}
                      className="px-1.5 py-1 text-xs text-[#5E6975] hover:text-[#182536]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingAuth(true)}
                    className="axiom-btn-primary py-1.5 px-4 text-xs font-bold"
                  >
                    <CheckCircle2 size={13} className="text-[#48d597]" />
                    <span>Authorize Execution</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] flex items-center justify-between text-xs font-mono">
            <span className="text-[#08795F] font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              Resolved by {request.resolvedBy || 'Lead Operator'} ({request.resolvedAt || 'Just now'})
            </span>
            <span className="text-[#5E6975]">{request.resolutionNote}</span>
          </div>
        )}
      </div>
    </div>
  );
};
