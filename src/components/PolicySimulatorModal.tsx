import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, SlidersHorizontal, X } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export interface PolicySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicySimulatorModal: React.FC<PolicySimulatorModalProps> = ({ isOpen, onClose }) => {
  const { policies } = useOperationsStore();
  const [amount, setAmount] = useState('15000');
  const [actionType, setActionType] = useState('wire_transfer');

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const isHighValue = numAmount > 10000;
  const isProdDb = actionType === 'db_modification';

  let evaluationResult = {
    verdict: 'AUTONOMOUS_APPROVED',
    message: 'Action complies with all invariants and may proceed autonomously.',
    color: 'emerald',
    policy: 'None (Autonomous tier)',
  };

  if (isProdDb) {
    evaluationResult = {
      verdict: 'STRICT_BLOCK',
      message: 'POL-02: Direct production database mutations are strictly prohibited for autonomous agents.',
      color: 'rose',
      policy: 'POL-02: Production Access Escalation Boundary',
    };
  } else if (isHighValue) {
    evaluationResult = {
      verdict: 'MANDATORY_HUMAN_APPROVAL',
      message: 'POL-01: Transactions exceeding 10,000 USD mandate human CFO approval signature.',
      color: 'amber',
      policy: 'POL-01: Financial Commitment Ceiling',
    };
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-[2px] shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#17263d]" />
            <div>
              <h3 className="text-base font-serif font-bold text-[#17263d]">
                Governance Policy Simulator
              </h3>
              <p className="text-xs text-[#718096] font-mono">
                Simulate invariant evaluations before execution
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#718096] hover:text-[#17263d] p-1 rounded-[2px]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#17263d] block mb-1">
                Action Payload Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#dce1e7] rounded-[2px] bg-white text-[#17263d] focus:outline-none focus:border-[#17263d]"
              >
                <option value="wire_transfer">Financial Wire Transfer</option>
                <option value="customer_credit">Customer Credit Refund</option>
                <option value="code_patch">Code Vulnerability Patch</option>
                <option value="db_modification">Direct Database Mutation</option>
              </select>
            </div>

            {actionType === 'wire_transfer' || actionType === 'customer_credit' ? (
              <div>
                <label className="text-xs font-semibold text-[#17263d] block mb-1">
                  Transaction Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#dce1e7] rounded-[2px] bg-[#fbfaf7] font-mono text-[#17263d] focus:outline-none focus:border-[#17263d]"
                />
                <span className="text-[10px] text-[#718096] font-mono mt-0.5 block">
                  Threshold limit is 10,000.00 USD
                </span>
              </div>
            ) : null}
          </div>

          <div
            className={`p-4 rounded-[2px] border text-xs ${
              evaluationResult.color === 'emerald'
                ? 'bg-[#f0faf6] border-[#c7eadf] text-[#0d6b4f]'
                : evaluationResult.color === 'amber'
                ? 'bg-[#fef8ea] border-[#f3d99d] text-[#945f00]'
                : 'bg-[#fdf2f3] border-[#f7c3c8] text-[#a42331]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wider">
              {evaluationResult.color === 'emerald' ? (
                <CheckCircle2 size={15} />
              ) : evaluationResult.color === 'amber' ? (
                <ShieldAlert size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}
              <span>Verdict: {evaluationResult.verdict}</span>
            </div>

            <p className="mt-2 text-xs leading-relaxed">{evaluationResult.message}</p>

            <div className="mt-2 pt-2 border-t border-current/20 text-[10px] font-mono opacity-80">
              Evaluated Policy: {evaluationResult.policy}
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#faf9f5] border-t border-[#dce1e7] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="axiom-btn-secondary text-xs py-1 px-3"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
