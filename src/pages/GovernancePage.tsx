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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Responsible Autonomy
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Governance & Policy Architecture
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
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
        <div className="axiom-panel-header bg-[#faf9f5]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#718096]">
            Bounded Autonomy Topology: Zone Enforcements
          </span>
          <span className="text-[11px] font-mono text-[#0d6b4f] bg-[#f0faf6] border border-[#c7eadf] px-2 py-0.5 rounded-xs">
            100% Invariants Active
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {ZONES.map((zone, idx) => (
              <React.Fragment key={zone.label}>
                <div className="p-3 border border-[#dce1e7] bg-[#fbfaf7] rounded-xs flex-shrink-0 w-44 text-center">
                  <span className="text-[9px] font-mono uppercase text-[#718096] block">
                    ZONE 0{idx + 1}
                  </span>
                  <div className="text-xs font-bold text-[#17263d] mt-0.5">{zone.label}</div>
                  <div className="text-[10px] text-[#40516a] mt-1 leading-snug">{zone.desc}</div>
                </div>

                {idx < ZONES.length - 1 && (
                  <span className="text-[#a0aec0] font-mono text-xs flex-shrink-0">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Enforcement Matrix */}
      <div className="axiom-panel overflow-x-auto">
        <div className="axiom-panel-header bg-[#faf9f5]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#718096]">
            Active Governance Policies & Enforcement Gates
          </span>
          <span className="text-[11px] font-mono text-[#718096]">
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
                  <div className="font-semibold text-[#17263d]">{pol.name}</div>
                  <div className="text-[10px] font-mono text-[#718096]">{pol.id}</div>
                </td>
                <td className="font-mono text-xs text-[#40516a]">{pol.scope}</td>
                <td>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs ${
                      pol.enforcement === 'strict_block'
                        ? 'bg-rose-100 text-[#c83e4d]'
                        : 'bg-amber-100 text-[#945f00]'
                    }`}
                  >
                    {pol.enforcement === 'strict_block' ? 'Strict Hard Block' : 'Mandatory Human Gate'}
                  </span>
                </td>
                <td>
                  <p className="text-xs text-[#40516a] max-w-md leading-relaxed">{pol.description}</p>
                </td>
                <td className="text-right font-mono text-xs font-bold text-[#17263d]">
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
