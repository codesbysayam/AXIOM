import React from 'react';
import { Award, CheckCircle2, Cpu, Info, ShieldCheck, Sliders, TrendingUp } from 'lucide-react';
import {
  calculateAutonomyScore,
  useAxiomEventBus,
} from '../../orchestrator/axiomEventBus';

export const AutonomyScoreCard: React.FC = () => {
  const { autonomyBreakdown, updateAutonomyBreakdown } = useAxiomEventBus();

  const totalScore = calculateAutonomyScore(autonomyBreakdown);

  const factors = [
    {
      key: 'decisionIndependence' as const,
      label: 'Decision Independence',
      weight: '25%',
      value: autonomyBreakdown.decisionIndependence,
      desc: 'Proportion of operational choices resolved without human escalation',
    },
    {
      key: 'recoveryReliability' as const,
      label: 'Recovery Reliability',
      weight: '20%',
      value: autonomyBreakdown.recoveryReliability,
      desc: 'Autonomous rollback & standby failover without invariant loss',
    },
    {
      key: 'humanOversight' as const,
      label: 'Human Oversight Fidelity',
      weight: '15%',
      value: autonomyBreakdown.humanOversight,
      desc: 'Enforcement rate of dual-key checkpoints for high-risk boundaries',
    },
    {
      key: 'policyCompliance' as const,
      label: 'Policy Boundary Compliance',
      weight: '20%',
      value: autonomyBreakdown.policyCompliance,
      desc: 'Deterministic conformance to SOX, financial, and security rules',
    },
    {
      key: 'executionReliability' as const,
      label: 'Execution Reliability',
      weight: '20%',
      value: autonomyBreakdown.executionReliability,
      desc: 'Idempotent API success rate and transactional ledger integrity',
    },
  ];

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Award size={16} className="text-[#08795F]" />
          <div>
            <span className="eyebrow block">Composite Governance Metric</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              AXIOM Autonomy Index (AAI)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#08795F] font-semibold bg-[#E6F7F2] px-2.5 py-1 rounded-[3px] border border-[#C3E6DB]">
          <ShieldCheck size={13} />
          <span>Tier-1 Deterministic Autonomy</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Composite Score Circle / Hero */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px] text-center">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
            Composite Index Score
          </span>
          <div className="text-4xl sm:text-5xl font-serif font-bold text-[#182536] mt-1">
            {totalScore}
            <span className="text-sm font-sans font-normal text-[#5E6975]"> / 100</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-mono text-[#08795F]">
            <TrendingUp size={13} />
            <span>+1.4 pts past 7 days</span>
          </div>
          <p className="text-[11px] font-sans text-[#52647B] mt-2">
            Deterministic weighted synthesis across 5 operational pillars.
          </p>
        </div>

        {/* 5 Factors Breakdown with interactive sliders */}
        <div className="md:col-span-8 space-y-3">
          {factors.map((f) => (
            <div key={f.key} className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#182536] font-sans">{f.label}</span>
                  <span className="text-[10px] text-[#5E6975]">({f.weight})</span>
                </div>
                <span className="font-bold text-[#182536]">{f.value}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-[#E5E3DB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#08795F] rounded-full transition-all duration-300"
                  style={{ width: `${f.value}%` }}
                />
              </div>

              <p className="text-[10px] font-sans text-[#68758A] leading-tight">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
