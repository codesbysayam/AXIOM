import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  HelpCircle,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export const WhatIfDecisionSimulator: React.FC = () => {
  // Scenario Parameters
  const [amount, setAmount] = useState<number>(7500);
  const [riskScore, setRiskScore] = useState<number>(0.24);
  const [policyThreshold, setPolicyThreshold] = useState<number>(10000);
  const [isVipVendor, setIsVipVendor] = useState<boolean>(true);
  const [forceHumanGate, setForceHumanGate] = useState<boolean>(false);

  // Real vs Simulated Decision logic
  const isAmountOverThreshold = amount > policyThreshold;
  const isHighRisk = riskScore > 0.65;

  const simulatedDecision =
    forceHumanGate || isAmountOverThreshold || isHighRisk
      ? {
          action: 'HUMAN_GATE',
          label: 'Human Authorization Gate Required',
          status: 'PENDING_APPROVAL',
          tone: 'warning',
          route: 'Intent → Policy Engine → Human Authority Gate → Task Executor',
          reason: isAmountOverThreshold
            ? `Amount ($${amount.toLocaleString()}) exceeds policy threshold of $${policyThreshold.toLocaleString()}`
            : isHighRisk
            ? `Anomaly risk score (${riskScore.toFixed(2)}) is elevated`
            : 'Manual policy lock active',
        }
      : {
          action: 'AUTO_EXECUTE',
          label: 'Instant Autonomous Execution Permitted',
          status: 'AUTO_APPROVED',
          tone: 'success',
          route: 'Intent → Policy Engine → Instant Task Executor → Audit Ledger',
          reason: `Zero policy friction: Amount ($${amount.toLocaleString()}) within safe threshold; low risk (${riskScore.toFixed(2)})`,
        };

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Scale size={15} className="text-[#3569A8]" />
          <div>
            <span className="eyebrow block">Counterfactual Reasoning</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              What-If Autonomous Decision Simulator
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setAmount(18420);
            setRiskScore(0.81);
            setPolicyThreshold(10000);
            setIsVipVendor(false);
            setForceHumanGate(false);
          }}
          className="text-xs font-mono text-[#3569A8] hover:underline flex items-center gap-1"
        >
          <RotateCcw size={11} />
          <span>Reset to Current Live State ($18.4k)</span>
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-[#FAF9F5] border border-[#E5E3DB] rounded-[4px]">
          {/* Amount Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#5E6975] uppercase">Transaction Amount:</span>
              <span className="font-bold text-[#182536]">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={40000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#182536] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#8898AA]">
              <span>$1k</span>
              <span>Threshold: ${policyThreshold.toLocaleString()}</span>
              <span>$40k</span>
            </div>
          </div>

          {/* Risk Score Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#5E6975] uppercase">Anomaly Risk Vector:</span>
              <span
                className={`font-bold ${
                  riskScore > 0.6 ? 'text-[#D72F40]' : 'text-[#08795F]'
                }`}
              >
                {riskScore.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={riskScore}
              onChange={(e) => setRiskScore(Number(e.target.value))}
              className="w-full accent-[#182536] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#8898AA]">
              <span>0.00 (Low)</span>
              <span>0.65 (Gate)</span>
              <span>1.00 (Critical)</span>
            </div>
          </div>

          {/* Policy Threshold & Toggles */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
              Policy Flags & Constraints
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-sans text-[#182536] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVipVendor}
                  onChange={(e) => setIsVipVendor(e.target.checked)}
                  className="rounded-[2px] text-[#182536] focus:ring-0 cursor-pointer"
                />
                <span>VIP Verified Vendor</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-sans text-[#182536] cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceHumanGate}
                  onChange={(e) => setForceHumanGate(e.target.checked)}
                  className="rounded-[2px] text-[#182536] focus:ring-0 cursor-pointer"
                />
                <span>Mandate Human Gate</span>
              </label>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison: Current Live vs Simulated Counterfactual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Live Decision */}
          <div className="p-4 rounded-[4px] border border-[#E5E3DB] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0EEE6] pb-2">
              <span className="eyebrow">Current Live Execution (#AX-93821)</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-[#FEF3D6] text-[#8A5900]">
                ● HUMAN GATE
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Invoice Amount:</span>
                <span className="font-semibold text-[#182536]">$18,420.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Risk Vector:</span>
                <span className="font-semibold text-[#D72F40]">0.81 (Elevated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Policy Outcome:</span>
                <span className="text-[#8A5900]">FIN-042 Boundary Tripped</span>
              </div>
            </div>

            <div className="p-2.5 rounded-[3px] bg-[#FAF9F5] border border-[#E5E3DB] text-[11px] font-sans text-[#52647B]">
              <b>Route:</b> Intent Analyst → Policy Engine → <b>Human Authority Gate</b> (Pending Sign-off)
            </div>
          </div>

          {/* Simulated Counterfactual Decision */}
          <div
            className={`p-4 rounded-[4px] border space-y-3 transition-all ${
              simulatedDecision.tone === 'success'
                ? 'border-[#C3E6DB] bg-[#F0FAF6]'
                : 'border-[#F9E2A8] bg-[#FFFDF0]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#E5E3DB] pb-2">
              <span className="eyebrow">Simulated Counterfactual Decision</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] ${
                  simulatedDecision.tone === 'success'
                    ? 'bg-[#E6F7F2] text-[#08795F]'
                    : 'bg-[#FEF3D6] text-[#8A5900]'
                }`}
              >
                {simulatedDecision.action === 'AUTO_EXECUTE' ? '✓ AUTO EXECUTE' : '● HUMAN GATE'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Simulated Amount:</span>
                <span className="font-semibold text-[#182536]">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Simulated Risk:</span>
                <span
                  className={`font-semibold ${
                    riskScore > 0.6 ? 'text-[#D72F40]' : 'text-[#08795F]'
                  }`}
                >
                  {riskScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Evaluated Reason:</span>
                <span className="text-[#182536] truncate max-w-xs">{simulatedDecision.reason}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-[3px] bg-white border border-[#D5D5CE] text-[11px] font-sans text-[#182536]">
              <b>Simulated Execution Route:</b> {simulatedDecision.route}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
