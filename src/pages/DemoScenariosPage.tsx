import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Play,
  PlayCircle,
  RefreshCw,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../data/demoScenario';
import { useOperationsStore } from '../orchestrator/store';

export const DemoScenariosPage: React.FC = () => {
  const { addToast, navigateTo } = useOperationsStore();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEMO_SCENARIOS[0]?.id || '');
  const [runningId, setRunningId] = useState<string | null>(null);
  const [executionPhaseIndex, setExecutionPhaseIndex] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const activeScenario =
    DEMO_SCENARIOS.find((sc) => sc.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  const PHASES = [
    'Ingesting structured event payload...',
    'Resolving context memory & state vectors...',
    'Evaluating invariant policies & boundary thresholds...',
    'Tripping human authorization gate...',
    'Writing immutable SHA-256 ledger proof...',
  ];

  const handleLaunchScenario = (sc: DemoScenario) => {
    setRunningId(sc.id);
    setExecutionPhaseIndex(0);
    setSimLogs([
      `[00:00.012] SIMULATION_INIT: Dispatching trial "${sc.title}"`,
      `[00:00.045] PAYLOAD_INGEST: ${sc.initialInput}`,
    ]);
    addToast('Simulation Initialized', `Starting trial: "${sc.title}"`, 'info');

    setTimeout(() => {
      setExecutionPhaseIndex(1);
      setSimLogs((prev) => [
        ...prev,
        `[00:00.280] CONTEXT_AGENT: Retrieved 14 historical transactions for account`,
        `[00:00.310] INTENT_ANALYST: Structured parameters parsed with 99.4% confidence`,
      ]);
    }, 450);

    setTimeout(() => {
      setExecutionPhaseIndex(2);
      setSimLogs((prev) => [
        ...prev,
        `[00:00.620] INVARIANT_CHECK: Testing against POL-FIN-01 (Mandatory authorization > $10,000)`,
        `[00:00.740] THRESHOLD_BREACH: Policy boundary triggered. Autonomous execution halted.`,
      ]);
    }, 900);

    setTimeout(() => {
      setExecutionPhaseIndex(3);
      setSimLogs((prev) => [
        ...prev,
        `[00:01.050] HUMAN_GATE_ROUTER: Created high-priority authorization request for Lead Operator`,
        `[00:01.120] AUDIT_LEDGER: Serialized state transition with SHA-256 checksum`,
      ]);
    }, 1350);

    setTimeout(() => {
      setRunningId(null);
      setExecutionPhaseIndex(4);
      setSimLogs((prev) => [
        ...prev,
        `[00:01.400] SIMULATION_COMPLETE: Outcome verified -> ${sc.expectedOutcome}`,
      ]);

      if (sc.id === 'demo-wire-transfer') {
        addToast('Human Gate Tripped', 'Wire transfer halted at Step 3 for CFO authorization.', 'warning');
      } else if (sc.id === 'demo-refund-triage') {
        addToast('Autonomous Resolution', 'Resolved in 440ms with zero human intervention required.', 'success');
      } else if (sc.id === 'demo-cve-patch') {
        addToast('Merge Gate Held', '480 sandbox suites passed. Merge held for Security Lead sign-off.', 'warning');
      } else {
        addToast('Security Invariant Preserved', 'Prompt injection quarantined immediately.', 'error');
      }
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Lab Showcase Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Verification Laboratory
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Scenario Simulation Chamber
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Controlled operational stress tests demonstrating multi-agent coordination, policy boundary enforcement, and mandatory operator gates
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className="bg-[#f0faf6] text-[#0d6b4f] border border-[#c7eadf] px-2.5 py-1 rounded-[2px] font-semibold">
            4 SANDBOX TRIALS ARMED
          </span>
        </div>
      </div>

      {/* FEATURED MISSION SHOWCASE CONSOLE */}
      <div className="axiom-panel border border-[#dce1e7] bg-white overflow-hidden shadow-2xs">
        <div className="axiom-panel-header bg-[#faf9f5] border-b border-[#dce1e7] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#e63946] px-2 py-0.5 bg-[#fef2f3] rounded-[2px] border border-[#fad2d6]">
              ACTIVE TRIAL
            </span>
            <span className="font-serif text-base font-bold text-[#17263d]">
              {activeScenario.title}
            </span>
            <span className="text-[11px] font-mono text-[#718096]">
              ({activeScenario.category})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] border ${
                activeScenario.difficulty === 'Stress Test'
                  ? 'bg-rose-50 text-[#c83e4d] border-rose-200'
                  : activeScenario.difficulty === 'Advanced'
                  ? 'bg-amber-50 text-[#945f00] border-amber-200'
                  : 'bg-emerald-50 text-[#0d6b4f] border-emerald-200'
              }`}
            >
              {activeScenario.difficulty}
            </span>

            <button
              type="button"
              disabled={runningId === activeScenario.id}
              onClick={() => handleLaunchScenario(activeScenario)}
              className="axiom-btn-primary py-1.5 px-4"
            >
              <Play
                size={12}
                className={runningId === activeScenario.id ? 'animate-spin' : ''}
              />
              <span>
                {runningId === activeScenario.id ? 'Running Simulation...' : 'Execute Simulation'}
              </span>
            </button>
          </div>
        </div>

        {/* Chamber Interior */}
        <div className="p-6 space-y-6 bg-[#fbfaf7]">
          {/* Mission Briefing */}
          <div>
            <span className="text-[10px] font-mono uppercase text-[#718096] block mb-1">
              Trial Objective & Operational Invariant
            </span>
            <p className="text-xs text-[#17263d] leading-relaxed font-medium">
              {activeScenario.summary}
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#718096] block">
              Multi-Agent Orchestration Stepper
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {PHASES.map((phase, idx) => {
                const isCurrent = executionPhaseIndex === idx;
                const isDone = executionPhaseIndex > idx;

                return (
                  <div
                    key={phase}
                    className={`p-2.5 rounded-[2px] border text-xs transition-all ${
                      isDone
                        ? 'border-[#c7eadf] bg-[#f0faf6] text-[#0d6b4f]'
                        : isCurrent
                        ? 'border-[#17263d] bg-white ring-2 ring-[#17263d]/10 text-[#17263d] font-semibold'
                        : 'border-[#dce1e7] bg-white text-[#718096]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span>PHASE 0{idx + 1}</span>
                      {isDone ? (
                        <CheckCircle2 size={10} className="text-[#159a72]" />
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d99000] animate-ping" />
                      ) : null}
                    </div>
                    <div className="text-[10px] leading-snug truncate" title={phase}>
                      {phase}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side: Payload Input vs Expected Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white border border-[#dce1e7] rounded-[2px] space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-[#718096] block font-semibold flex items-center gap-1.5">
                <Cpu size={12} className="text-[#17263d]" />
                Simulated Event Payload:
              </span>
              <div className="font-mono text-[11px] text-[#17263d] bg-[#fbfaf7] p-2.5 rounded-[2px] border border-[#f0eee6] leading-relaxed">
                {activeScenario.initialInput}
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#dce1e7] rounded-[2px] space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-[#159a72] block font-semibold flex items-center gap-1.5">
                <Shield size={12} className="text-[#159a72]" />
                Guaranteed Invariant Outcome:
              </span>
              <div className="font-mono text-[11px] text-[#0d6b4f] bg-[#f0faf6] p-2.5 rounded-[2px] border border-[#c7eadf] leading-relaxed">
                {activeScenario.expectedOutcome}
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Terminal */}
          {simLogs.length > 0 && (
            <div className="p-3 bg-[#111827] text-white rounded-[2px] font-mono text-[11px] space-y-1 overflow-x-auto max-h-48 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800 mb-2">
                <span className="flex items-center gap-1">
                  <Terminal size={11} className="text-emerald-400" />
                  <span>SIMULATION TELEMETRY STREAM</span>
                </span>
                <span>STATE_DIGEST: VERIFIED</span>
              </div>
              {simLogs.map((log, i) => (
                <div key={i} className="text-slate-300 leading-relaxed font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BENCHMARK LIBRARY ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#718096] border-b border-[#dce1e7] pb-2">
          <span className="uppercase font-semibold">Simulation Benchmark Library (4 Scenarios)</span>
          <span>Click any card to load into the simulation chamber</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_SCENARIOS.map((sc, idx) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setExecutionPhaseIndex(-1);
                  setSimLogs([]);
                }}
                className={`p-4 rounded-[2px] border cursor-pointer transition-all shadow-2xs ${
                  isSelected
                    ? 'border-[#17263d] bg-white ring-1 ring-[#17263d]'
                    : 'border-[#dce1e7] bg-white hover:border-[#b8c2cc] hover:bg-[#faf9f5]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#e63946] px-1.5 py-0.2 bg-red-50 rounded-[2px] border border-red-100">
                      LAB 0{idx + 1}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-[#17263d]">
                      {sc.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-[2px] ${
                      sc.difficulty === 'Stress Test'
                        ? 'bg-rose-50 text-[#c83e4d]'
                        : sc.difficulty === 'Advanced'
                        ? 'bg-amber-50 text-[#945f00]'
                        : 'bg-emerald-50 text-[#0d6b4f]'
                    }`}
                  >
                    {sc.difficulty}
                  </span>
                </div>

                <p className="text-[11px] text-[#40516a] mt-2 line-clamp-2 leading-relaxed">
                  {sc.summary}
                </p>

                <div className="mt-3 pt-2 border-t border-[#f0eee6] flex items-center justify-between text-[10px] font-mono text-[#718096]">
                  <span>{sc.stepsCount} Nodes in DAG</span>
                  <span className="text-[#17263d] font-semibold flex items-center gap-1">
                    {isSelected ? 'Loaded in Chamber' : 'Load Simulation →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
