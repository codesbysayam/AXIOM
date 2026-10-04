import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export interface ExecutionReceiptProps {
  execution: {
    workflowId: string;
    title?: string;
    duration: number;
    nodes: number;
    policyChecks: number;
    humanGates: number;
    rollbacks: number;
    proof: string;
  } | null;
  onInspect: () => void;
  onClose: () => void;
}

export function ExecutionReceipt({ execution, onInspect, onClose }: ExecutionReceiptProps) {
  if (!execution) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Execution Provenance Receipt"
    >
      <div
        className="execution-receipt"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <span className="receipt-check">✓</span>
          <div>
            <small>EXECUTION COMMITTED</small>
            <h3>{execution.title || execution.workflowId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt"
            className="ml-auto text-[#5E6975] hover:text-[#182536] p-1"
          >
            <X size={15} />
          </button>
        </header>

        <dl>
          <div>
            <dt>Execution Duration</dt>
            <dd>{execution.duration} ms</dd>
          </div>

          <div>
            <dt>DAG Nodes Executed</dt>
            <dd>{execution.nodes} / {execution.nodes}</dd>
          </div>

          <div>
            <dt>Policy Checks Verified</dt>
            <dd>{execution.policyChecks}</dd>
          </div>

          <div>
            <dt>Human Oversight Gates</dt>
            <dd>{execution.humanGates}</dd>
          </div>

          <div>
            <dt>Automated Rollbacks</dt>
            <dd>{execution.rollbacks}</dd>
          </div>
        </dl>

        <div className="receipt-proof">
          <span>PROVENANCE HASH</span>
          <code>{execution.proof}</code>
        </div>

        <footer>
          <button type="button" onClick={onClose} className="receipt-secondary">
            Close
          </button>

          <button
            type="button"
            className="receipt-primary"
            onClick={onInspect}
          >
            <span>Inspect Evidence in Ledger</span>
            <ArrowRight size={13} />
          </button>
        </footer>
      </div>
    </div>
  );
}
