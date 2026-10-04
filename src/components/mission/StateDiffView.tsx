import React from 'react';
import { ArrowRight, CheckCircle2, Copy, Diff, Fingerprint, ShieldCheck } from 'lucide-react';

export interface StateDiffRow {
  field: string;
  before: string;
  after: string;
  isChanged: boolean;
  type?: 'status' | 'risk' | 'hash' | 'policy' | 'normal';
}

export const DEFAULT_DIFF_ROWS: StateDiffRow[] = [
  {
    field: 'Execution Status',
    before: 'PENDING_HUMAN_APPROVAL',
    after: 'SETTLED_COMPLETED',
    isChanged: true,
    type: 'status',
  },
  {
    field: 'Evaluated Risk Score',
    before: '0.81 (Elevated Outlay)',
    after: '0.04 (Mitigated & Certified)',
    isChanged: true,
    type: 'risk',
  },
  {
    field: 'Human Authority Gate',
    before: 'MANDATORY_REQUIRED',
    after: 'SIGNED (CRO_DUAL_KEY)',
    isChanged: true,
    type: 'status',
  },
  {
    field: 'Policy Envelope',
    before: 'FIN-042 (Held at Boundary)',
    after: 'FIN-042 PASS (Sign-off Committed)',
    isChanged: true,
    type: 'policy',
  },
  {
    field: 'Assigned Agent',
    before: 'Release Guardian',
    after: 'Task Executor → Audit Ledger',
    isChanged: true,
    type: 'normal',
  },
  {
    field: 'ERP Transaction ID',
    before: 'UNCOMMITTED (Draft Voucher)',
    after: 'TX-ACH-8849201',
    isChanged: true,
    type: 'normal',
  },
  {
    field: 'State Cryptographic Proof',
    before: '0x1a8f92b4c810de02',
    after: '0x8b57e6d9ed02fa77',
    isChanged: true,
    type: 'hash',
  },
  {
    field: 'Rollback Recovery Token',
    before: 'ARMED_IDLE',
    after: 'RB-93821-RESTORE-VOUCHER',
    isChanged: true,
    type: 'hash',
  },
];

export const StateDiffView: React.FC<{ rows?: StateDiffRow[] }> = ({
  rows = DEFAULT_DIFF_ROWS,
}) => {
  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Diff size={15} className="text-[#3569A8]" />
          <div>
            <span className="eyebrow block">State Transformation Audit</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Before / After Execution State Diff
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#08795F] font-semibold">
          Run #AX-93821 · SHA-256 Verified
        </span>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="axiom-table">
          <thead>
            <tr>
              <th className="w-1/4">System Dimension</th>
              <th className="w-3/8 text-[#5E6975]">Pre-Execution Baseline (Before)</th>
              <th className="w-3/8 text-[#08795F]">Post-Execution State (After)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#FAF9F5]">
                <td className="font-semibold text-[#182536] font-sans text-xs">
                  {row.field}
                </td>
                <td>
                  <div className="p-1.5 rounded-[2px] bg-[#FAF9F5] border border-[#E5E3DB] font-mono text-xs text-[#5E6975] flex items-center gap-1.5">
                    <span className="text-[10px] text-[#8898AA]">[-]</span>
                    <span className="truncate">{row.before}</span>
                  </div>
                </td>
                <td>
                  <div className="p-1.5 rounded-[2px] bg-[#F0FAF6] border border-[#C3E6DB] font-mono text-xs text-[#08795F] font-semibold flex items-center gap-1.5">
                    <span className="text-[10px] text-[#08795F]">[+]</span>
                    <span className="truncate">{row.after}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
