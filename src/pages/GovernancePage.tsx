import React from 'react';
import { Award, CheckCircle2, FileCheck2, Shield, SlidersHorizontal } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const GovernancePage: React.FC = () => {
  const { policies, openModal } = useOperationsStore();

  const ZONES = [
    { label: 'Agent Dispatch', desc: 'Task Initiated by Autonomous Actor' },
    { label: 'Policy Verification', desc: 'Rules & Thresholds Tested' },
    { label: 'Invariant Validation', desc: 'Sandboxed Invariants Checked' },
    { label: 'Human Gate', desc: 'Operator Sign-off Enforced' },
    { label: 'Safe Execution', desc: 'Idempotent Dispatched Output' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Responsible Autonomy
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Governance & Policy Architecture
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Operational boundary rules, regulatory constraints, and human authorization mandates
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => openModal('policy-simulator')}
            className="axiom-btn-secondary"
          >
            <SlidersHorizontal size={13} />
            <span>Simulate Rules</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('governance-certificate')}
            className="axiom-btn-primary"
          >
            <Award size={13} />
            <span>Attestation Certificate</span>
          </button>
        </div>
      </div>

      {/* VISUAL CENTERPIECE: Bounded Autonomy Topology Flow */}
      <div className="axiom-panel">
        <div className="axiom-panel-header bg-[#FAF9F5]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#5E6975]">
            Bounded Autonomy Topology: Zone Enforcements
          </span>
          <span className="text-[11px] font-mono text-[#138468] bg-[#F0FAF6] border border-[#C3E6DB] px-2 py-0.5 rounded-[2px]">
            100% Invariants Active
          </span>
        </div>

        <div className="p-5 bg-[#FFFDF8]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {ZONES.map((zone, idx) => (
              <React.Fragment key={zone.label}>
                <div className="p-3 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] flex-shrink-0 w-44 text-center">
                  <span className="text-[9px] font-mono uppercase text-[#5E6975] block">
                    ZONE 0{idx + 1}
                  </span>
                  <div className="text-xs font-bold text-[#182536] mt-0.5">{zone.label}</div>
                  <div className="text-[10px] text-[#334256] mt-1 leading-snug">{zone.desc}</div>
                </div>

                {idx < ZONES.length - 1 && (
                  <div className="text-[#5E6975] flex-shrink-0 font-mono text-xs px-1">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D5D5CE] flex items-center justify-between text-xs text-[#5E6975] font-mono">
            <span>Enforcement Strategy: Fail-closed deterministic sandbox</span>
            <span className="text-[#138468]">Zero bypasses allowed under SOC-2 policy</span>
          </div>
        </div>
      </div>

      {/* Policy Enforcement Matrix */}
      <div className="axiom-panel overflow-x-auto">
        <div className="axiom-panel-header bg-[#FAF9F5]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#5E6975]">
            Active Governance Policies & Enforcement Gates
          </span>
          <span className="text-[11px] font-mono text-[#5E6975]">
            Enforcement Mode: Strict Intercept
          </span>
        </div>

        <table className="axiom-table">
          <thead>
            <tr>
              <th>Policy Specification</th>
              <th>Operational Scope</th>
              <th>Enforcement Mode</th>
              <th>Invariant Description</th>
              <th className="text-right">Quarantined Intercepts</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((pol) => (
              <tr key={pol.id}>
                <td>
                  <div className="font-semibold text-[#182536]">{pol.name}</div>
                  <div className="text-[10px] font-mono text-[#5E6975]">{pol.id}</div>
                </td>
                <td className="font-mono text-xs text-[#334256]">{pol.scope}</td>
                <td>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] ${
                      pol.enforcement === 'strict_block'
                        ? 'bg-rose-50 text-[#D72F40] border border-rose-200'
                        : 'bg-[#FFF8E6] text-[#A87405] border border-[#F7E0B5]'
                    }`}
                  >
                    {pol.enforcement === 'strict_block' ? 'Strict Hard Block' : 'Mandatory Human Gate'}
                  </span>
                </td>
                <td>
                  <p className="text-xs text-[#334256] max-w-md leading-relaxed">{pol.description}</p>
                </td>
                <td className="text-right font-mono text-xs font-bold text-[#182536]">
                  {pol.violationCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
