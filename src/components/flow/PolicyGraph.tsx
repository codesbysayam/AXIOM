import React, { useState } from 'react';
import { OPERATIONAL_POLICIES } from '../../data/policies';
import { PolicyDefinition } from '../../types/operations';
import { ShieldCheck, ShieldAlert, AlertOctagon, CheckCircle2, Lock, ArrowDown } from 'lucide-react';

export interface PolicyGraphProps {
  policies?: PolicyDefinition[];
  onSelectPolicy?: (policy: PolicyDefinition) => void;
  className?: string;
}

export function PolicyGraph({
  policies = OPERATIONAL_POLICIES,
  onSelectPolicy,
  className = '',
}: PolicyGraphProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('POL-FIN-01');
  const activePolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  return (
    <section className={`viz-panel p-6 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D5CE]/70">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
            SECURITY & POLICY INVARIANT TOPOLOGY
          </span>
          <h2 className="text-lg sm:text-xl font-sans font-semibold text-[#17263A] mt-0.5">
            Boundary Enforcement & Escalation Rules
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {policies.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPolicyId(p.id);
                onSelectPolicy?.(p);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded-[3px] transition-colors ${
                selectedPolicyId === p.id
                  ? 'bg-[#142238] text-white font-bold'
                  : 'bg-[#FBFAF6] border border-[#D5D5CE] text-[#40516A] hover:bg-[#FAF7EE]'
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Policy Hierarchy Flow */}
      <div className="pt-6 pb-2 flex flex-col items-center">
        {/* Tier 1: Input Event Vector */}
        <div className="w-full max-w-[480px] p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[6px] text-center shadow-xs">
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
            STAGE 01 // INPUT VECTOR
          </span>
          <div className="text-sm font-semibold text-[#17263A] mt-0.5 font-sans">
            Inbound Execution Payload
          </div>
          <div className="text-xs font-sans text-[#40516A] mt-1">
            Parameters, identity tokens, and transaction payload vectors
          </div>
        </div>

        {/* Down connector */}
        <div className="w-[1px] h-6 bg-[#AEB4BA] my-1 relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-r border-b border-[#7B8793] rotate-45" />
        </div>

        {/* Tier 2: Risk Evaluation Engine */}
        <div className="w-full max-w-[480px] p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[6px] text-center shadow-xs">
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
            STAGE 02 // RISK EVALUATION
          </span>
          <div className="text-sm font-semibold text-[#17263A] mt-0.5 font-sans">
            Statistical & Scope Risk Assessment
          </div>
          <div className="text-xs font-sans text-[#00866B] mt-1 font-medium">
            Dynamic risk tier calculation against threshold bounds
          </div>
        </div>

        {/* Down connector */}
        <div className="w-[1px] h-6 bg-[#AEB4BA] my-1 relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-r border-b border-[#7B8793] rotate-45" />
        </div>

        {/* Tier 3: Active Selected Policy Engine */}
        <div className="w-full max-w-[560px] p-4 bg-[#FAF7EE] border-2 border-[#142238] rounded-[6px] text-left shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 bg-[#142238] text-white rounded-[2px] font-mono font-bold">
              {activePolicy.id}
            </span>
            <span className="text-[#00866B] font-sans font-semibold">
              <span className="font-mono">{activePolicy.passRate}%</span> Pass Rate ({activePolicy.evaluations24h} evals)
            </span>
          </div>
          <div className="text-base font-sans font-semibold text-[#17263A] mt-2">
            {activePolicy.name}
          </div>
          <div className="text-xs font-sans text-[#40516A] mt-1.5 bg-white p-2.5 rounded-[3px] border border-[#D5D5CE]">
            <strong className="text-[#17263A]">Enforced Threshold:</strong> <span className="font-mono">{activePolicy.threshold}</span>
          </div>
        </div>

        {/* Branch: ALLOW vs ESCALATE vs BLOCK */}
        <div className="w-full max-w-[680px] grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#D5D5CE]/70">
          {/* Allow */}
          <div className="p-3 bg-[#E5F5EF] border border-[#00866B]/40 rounded-[6px] text-center">
            <div className="flex items-center justify-center gap-1 text-[#00866B] font-sans text-xs font-semibold">
              <CheckCircle2 size={13} />
              ALLOW (PASS)
            </div>
            <div className="text-xs font-sans text-[#40516A] mt-1 leading-relaxed">
              Dispatches directly to autonomous Task Executor with idempotency tokens.
            </div>
          </div>

          {/* Escalate -> Human Gate */}
          <div className="p-3 bg-[#FFF2CC] border-2 border-[#B97800] rounded-[6px] text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#B97800] font-sans text-xs font-semibold">
              <ShieldAlert size={13} />
              ESCALATE → HUMAN
            </div>
            <div className="text-xs font-sans text-[#40516A] mt-1 leading-relaxed">
              Halts execution at Release Guardian gate pending explicit operator sign-off.
            </div>
          </div>

          {/* Block */}
          <div className="p-3 bg-[#FCE8EA] border border-[#C93645]/40 rounded-[6px] text-center">
            <div className="flex items-center justify-center gap-1 text-[#C93645] font-sans text-xs font-semibold">
              <AlertOctagon size={13} />
              BLOCK / QUARANTINE
            </div>
            <div className="text-xs font-sans text-[#40516A] mt-1 leading-relaxed">
              Execution rejected instantly. Reverts state and alerts Fraud Sentinel.
            </div>
          </div>
        </div>
      </div>

      {/* Invariant assertions checklist */}
      <div className="mt-4 pt-4 border-t border-[#D5D5CE]/70 bg-[#FBFAF6] p-3.5 rounded-[6px]">
        <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] block font-semibold mb-2">
          Mathematical Invariant Proofs Enforced for {activePolicy.id}:
        </span>
        <ul className="space-y-1.5 text-xs text-[#17263A] font-sans">
          {activePolicy.invariants.map((inv, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00866B] mt-1.5 flex-shrink-0" />
              <span>{inv}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
