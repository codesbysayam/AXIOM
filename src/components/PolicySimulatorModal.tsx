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
  const [scope, setScope] = useState('production_db');

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
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-slate-600" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Governance Policy Simulator
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Simulate invariant evaluations before execution
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Action Payload Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
              >
                <option value="wire_transfer">Financial Wire Transfer</option>
                <option value="customer_credit">Customer Credit Refund</option>
                <option value="code_patch">Code Vulnerability Patch</option>
                <option value="db_modification">Direct Database Mutation</option>
              </select>
            </div>

            {actionType === 'wire_transfer' || actionType === 'customer_credit' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Transaction Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  Threshold limit is 10,000.00 USD
                </span>
              </div>
            ) : null}
          </div>

          <div
            className={`p-4 rounded-lg border text-xs ${
              evaluationResult.color === 'emerald'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : evaluationResult.color === 'amber'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
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

            <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] font-mono opacity-80">
              Evaluated Policy: {evaluationResult.policy}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
