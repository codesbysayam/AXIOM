import React, { useState } from 'react';
import { Check, Save, Settings } from 'lucide-react';
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
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          System & Operator Settings
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Configure autonomous bounds, human gate triggers, and audit ledger policies
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1">
            Financial Commitment Approval Threshold (USD)
          </label>
          <input
            type="number"
            value={financialThreshold}
            onChange={(e) => setFinancialThreshold(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs border border-slate-200 rounded bg-slate-50 font-mono text-slate-900"
          />
          <span className="text-[11px] text-slate-500 block mt-1">
            Inbound invoices or outbound payouts above this amount automatically halt for operator sign-off.
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={auditHashing}
              onChange={(e) => setAuditHashing(e.target.checked)}
              className="rounded border-slate-300 text-[#1b2e49] focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Cryptographic SHA-256 State Transition Signing
              </span>
              <span className="text-[11px] text-slate-500 block">
                Generates tamper-evident hash chains across all agent and operator actions.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              checked={requireDualSignoff}
              onChange={(e) => setRequireDualSignoff(e.target.checked)}
              className="rounded border-slate-300 text-[#1b2e49] focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Dual Operator Sign-off for Critical Code Merges
              </span>
              <span className="text-[11px] text-slate-500 block">
                Requires two distinct human operators to authorize production infrastructure changes.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <Save size={13} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
