import React from 'react';
import { ShieldCheck, UserCheck, X } from 'lucide-react';

export interface OperatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OperatorProfileModal: React.FC<OperatorProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b2e49] text-white flex items-center justify-center text-xs font-mono font-bold">
              OP
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Lead Operator Profile</h3>
              <p className="text-xs text-slate-500 font-mono">Role: Enterprise AI Safety Controller</p>
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

        <div className="p-5 space-y-3.5 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Operator ID:</span>
              <span className="text-slate-800 font-semibold">usr-lead-controller-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Clearance Tier:</span>
              <span className="text-emerald-700 font-semibold">Tier 4 (Unrestricted Override)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Session Protocol:</span>
              <span className="text-slate-800">mTLS Authenticated</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Human In The Loop Authority:</h4>
            <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px] leading-relaxed">
              <li>Approve or veto financial disbursements exceeding 10,000 USD</li>
              <li>Authorize production code patches affecting core cryptographic parsers</li>
              <li>Trigger immediate emergency fleet containment for anomalous agents</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
