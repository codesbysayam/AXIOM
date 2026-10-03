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
        className="bg-white border border-[#dce1e7] rounded-[2px] shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#17263d] text-white flex items-center justify-center text-xs font-mono font-bold shadow-2xs">
              OP
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#17263d]">Lead Operator Profile</h3>
              <p className="text-xs text-[#718096] font-mono">Role: Enterprise Safety Controller</p>
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

        <div className="p-5 space-y-3.5 text-xs text-[#40516a]">
          <div className="p-3 rounded-[2px] bg-[#fbfaf7] border border-[#dce1e7] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#718096]">Operator ID:</span>
              <span className="text-[#17263d] font-semibold">usr-lead-controller-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718096]">Clearance Tier:</span>
              <span className="text-[#0d6b4f] font-semibold">Tier 4 (Unrestricted Override)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718096]">Session Protocol:</span>
              <span className="text-[#17263d]">mTLS Cryptographic Handshake</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#17263d] mb-1">Human In The Loop Authority:</h4>
            <ul className="space-y-1 list-disc list-inside text-[#40516a] text-[11px] leading-relaxed">
              <li>Approve or veto financial disbursements exceeding 10,000 USD</li>
              <li>Authorize production code patches affecting core cryptographic parsers</li>
              <li>Trigger immediate emergency fleet containment for anomalous agents</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-[#faf9f5] border-t border-[#dce1e7] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="axiom-btn-secondary text-xs py-1 px-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
