import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Play, PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../data/demoScenario';
import { useOperationsStore } from '../orchestrator/store';

export const DemoScenariosPage: React.FC = () => {
  const { addToast, navigateTo } = useOperationsStore();
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleLaunchScenario = (sc: DemoScenario) => {
    setRunningId(sc.id);
    addToast('Simulation Launched', `Running interactive test scenario: "${sc.title}"`, 'info');

    setTimeout(() => {
      setRunningId(null);
      if (sc.id === 'demo-wire-transfer') {
        navigateTo('approvals');
        addToast('Human Gate Hit', 'Scenario triggered Step 3 approval check per POL-01.', 'warning');
      } else if (sc.id === 'demo-refund-triage') {
        navigateTo('workflows', 'wf-customer-refund-triage');
        addToast('Autonomous Resolution', 'Resolved in 440ms with 0 human intervention.', 'success');
      } else if (sc.id === 'demo-cve-patch') {
        navigateTo('approvals');
        addToast('Merge Gate Held', 'Test harness passed 480 suites; PR held for security lead.', 'warning');
      } else {
        navigateTo('incidents');
        addToast('Security Invariant Preserved', 'Adversarial payload intercepted and contained.', 'error');
      }
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Interactive Demo Scenarios
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Execute realistic end-to-end multi-agent simulations and observe human-in-the-loop gating
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {sc.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    sc.difficulty === 'Stress Test'
                      ? 'bg-rose-100 text-rose-800'
                      : sc.difficulty === 'Advanced'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {sc.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-2">{sc.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sc.summary}</p>

              <div className="mt-3 p-2.5 rounded bg-slate-50 border border-slate-200/60 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                  Initial Payload:
                </span>
                <span className="font-mono text-[11px] text-slate-800">{sc.initialInput}</span>
              </div>

              <div className="mt-2.5 p-2.5 rounded bg-emerald-50/50 border border-emerald-200/60 text-xs">
                <span className="text-[10px] font-mono uppercase text-emerald-800 block mb-0.5">
                  Expected System Behavior:
                </span>
                <span className="text-slate-700">{sc.expectedOutcome}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{sc.stepsCount} Steps</span>
              <button
                type="button"
                disabled={runningId === sc.id}
                onClick={() => handleLaunchScenario(sc)}
                className="px-4 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 disabled:opacity-50 rounded font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Play size={12} className={runningId === sc.id ? 'animate-spin' : ''} />
                <span>{runningId === sc.id ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
