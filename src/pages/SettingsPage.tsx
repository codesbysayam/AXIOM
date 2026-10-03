import React, { useState } from 'react';
import { Check, Save, Settings, Shield } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const SettingsPage: React.FC = () => {
  const { addToast } = useOperationsStore();
  const [financialThreshold, setFinancialThreshold] = useState('10000');
  const [auditHashing, setAuditHashing] = useState(true);
  const [requireDualSignoff, setRequireDualSignoff] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Operator configuration updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#dce1e7] pb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
          Control Plane Configuration
        </span>
        <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
          System & Operator Settings
        </h1>
        <p className="text-xs text-[#40516a] mt-0.5">
          Configure autonomous bounds, human gate triggers, and audit ledger policies
        </p>
      </div>

      <form onSubmit={handleSave} className="axiom-panel p-5 shadow-2xs space-y-4 bg-white">
        <div>
          <label className="text-xs font-semibold text-[#17263d] block mb-1">
            Financial Commitment Approval Threshold (USD)
          </label>
          <input
            type="number"
            value={financialThreshold}
            onChange={(e) => setFinancialThreshold(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs border border-[#dce1e7] rounded-[2px] bg-[#fbfaf7] font-mono text-[#17263d] focus:outline-none focus:border-[#17263d]"
          />
          <span className="text-[11px] text-[#718096] block mt-1 font-mono">
            Inbound invoices or outbound payouts above this amount automatically halt for operator sign-off.
          </span>
        </div>

        <div className="pt-3 border-t border-[#f0eee6] space-y-2">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={auditHashing}
              onChange={(e) => setAuditHashing(e.target.checked)}
              className="rounded-[2px] border-[#dce1e7] text-[#17263d] focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-[#17263d] block">
                Cryptographic SHA-256 State Transition Signing
              </span>
              <span className="text-[11px] text-[#718096] block">
                Generates tamper-evident hash chains across all agent and operator actions.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              checked={requireDualSignoff}
              onChange={(e) => setRequireDualSignoff(e.target.checked)}
              className="rounded-[2px] border-[#dce1e7] text-[#17263d] focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-[#17263d] block">
                Dual Operator Sign-off for Critical Code Merges
              </span>
              <span className="text-[11px] text-[#718096] block">
                Requires two distinct human operators to authorize production infrastructure changes.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-[#f0eee6] flex justify-end">
          <button
            type="submit"
            className="axiom-btn-primary"
          >
            <Save size={13} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
