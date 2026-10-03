import React from 'react';
import { Award, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export interface GovernanceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GovernanceCertificateModal: React.FC<GovernanceCertificateModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-xs shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#fdfbf6] text-[#945f00] border border-[#f3d99d]">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#17263d]">
                Governance Compliance Certificate
              </h3>
              <p className="text-xs text-[#718096] font-mono mt-0.5">
                AXIOM Operational Invariant Attestation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#718096] hover:text-[#17263d] p-1 rounded-xs"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Formal Attestation
            </span>
            <div className="text-lg font-bold font-serif text-slate-900 mt-1">
              Verifiable Human Oversight Architecture
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Issued for Enterprise Workspace: PROD-ORCH-CLUSTER-01
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200/70">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Invariant 01: Mandatory Human Approval Gates
                </span>
                <span>
                  All actions classified as High or Critical Risk strictly halted pending explicit cryptographic operator authorization.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200/70">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Invariant 02: Immutable Audit Provenance
                </span>
                <span>
                  Every tool call, input prompt, policy test, and state mutation serialized with SHA-256 integrity signatures.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200/70">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Invariant 03: Deterministic Fail-Safe Rollback
                </span>
                <span>
                  Sandboxed execution environments isolate untested code or mutations prior to production commitment.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Certificate Digest: a819c-092bf-381a</span>
            <span>Status: VALIDATED</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
