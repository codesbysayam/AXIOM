import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Lock,
  Play,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../data/demoScenario';
import { useOperationsStore } from '../orchestrator/store';
import { SimulationExecutionMap } from '../components/simulation/SimulationExecutionMap';
import { EvidenceDrawer, InspectorNode } from '../components/EvidenceDrawer';

export const DemoScenariosPage: React.FC = () => {
  const { addToast, navigateTo, simulationClock } = useOperationsStore();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEMO_SCENARIOS[0]?.id || '');
  const [runningId, setRunningId] = useState<string | null>(null);
  const [executionPhaseIndex, setExecutionPhaseIndex] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([
    `[TICK #${simulationClock.tick} · ${simulationClock.epochTime}] STANDBY: Awaiting trial dispatch. Invariants verified.`,
  ]);
  const [inspectedNode, setInspectedNode] = useState<InspectorNode | null>(null);

  const activeScenario =
    DEMO_SCENARIOS.find((sc) => sc.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  const handleLaunchScenario = (sc: DemoScenario) => {
    setRunningId(sc.id);
    setExecutionPhaseIndex(0);
    setSimLogs([
      `[TICK #${simulationClock.tick} · ${simulationClock.epochTime}] SIMULATION_INIT: Dispatching trial "${sc.title}"`,
      `[TICK #${simulationClock.tick} · ${simulationClock.epochTime}] PAYLOAD_INGEST: ${sc.initialInput}`,
    ]);
    addToast('Simulation Initialized', `Starting trial: "${sc.title}" synchronized with central clock.`, 'info');

    setTimeout(() => {
      setExecutionPhaseIndex(1);
      setSimLogs((prev) => [
        ...prev,
        `[TICK #${simulationClock.tick + 1}] CONTEXT_AGENT: Retrieved historical context and vectors`,
        `[TICK #${simulationClock.tick + 1}] INTENT_ANALYST: Structured parameters parsed with 99.4% confidence`,
      ]);
    }, 500);

    setTimeout(() => {
      setExecutionPhaseIndex(2);
      setSimLogs((prev) => [
        ...prev,
        `[TICK #${simulationClock.tick + 2}] INVARIANT_CHECK: Testing against POL-FIN-01 / POL-SEC-02 boundary rules`,
        `[TICK #${simulationClock.tick + 2}] THRESHOLD_BREACH: Policy boundary triggered. Fail-closed sandbox activated.`,
      ]);
    }, 1100);

    setTimeout(() => {
      setExecutionPhaseIndex(3);
      setSimLogs((prev) => [
        ...prev,
        `[TICK #${simulationClock.tick + 3}] HUMAN_GATE_ROUTER: Created high-priority authorization request for Lead Operator`,
        `[TICK #${simulationClock.tick + 3}] AUDIT_LEDGER: Serialized state transition with SHA-256 Merkle root`,
      ]);
    }, 1700);

    setTimeout(() => {
      setRunningId(null);
      setExecutionPhaseIndex(4);
      setSimLogs((prev) => [
        ...prev,
        `[TICK #${simulationClock.tick + 4}] SIMULATION_COMPLETE: Outcome verified -> ${sc.expectedOutcome}`,
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
    }, 2400);
  };

  const handleNodeClick = (
    nodeId: string,
    nodeName: string,
    extra?: {
      agent?: string;
      skill?: string;
      status?: string;
      input?: string;
      output?: string;
      checks?: string[];
      duration?: number;
      timestamp?: string;
    },
  ) => {
    setInspectedNode({
      id: nodeId,
      title: nodeName,
      agent: extra?.agent || 'Active Workflow Agent',
      skill: extra?.skill || 'Deterministic Execution Invariant',
      status: extra?.status || (executionPhaseIndex >= 2 ? 'completed' : 'running'),
      input: extra?.input || activeScenario.initialInput,
      output: extra?.output || activeScenario.expectedOutcome,
      checks: extra?.checks || [
        'Deterministic DAG traversal invariant',
        'State proof committed to SHA-256 ledger',
        'Zero unmonitored external mutations',
      ],
      timestamp: extra?.timestamp || '12:03:18.240',
      duration: extra?.duration || 88,
    });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Lab Showcase Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D1C7] pb-4">
        <div>
          <span className="eyebrow block">
            Verification Laboratory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Scenario Simulation Chamber
          </h1>
          <p className="text-sm font-sans text-[#52647B] mt-1">
            Execute stress tests and multi-agent edge cases with live invariant boundary proving.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigateTo('judge-mode')}
            className="axiom-btn-secondary"
          >
            <span>Judge Evaluation Harness</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Main Chamber Card */}
      <div className="axiom-panel overflow-hidden border border-[#D5D1C7] bg-[#FFFDF8] rounded-[6px]">
        {/* Active Trial Header Strip */}
        <div className="p-4 bg-[#FAF9F5] border-b border-[#D5D1C7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-sans text-[10px] font-bold text-[#C93645] px-2 py-0.5 bg-rose-50 rounded-[3px] border border-rose-200 uppercase tracking-wide">
              ACTIVE TRIAL
            </span>
            <span className="font-sans text-base font-semibold text-[#17263A]">
              {activeScenario.title}
            </span>
            <span className="text-xs font-sans text-[#52647B]">
              ({activeScenario.category})
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span
              className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-[3px] border ${
                activeScenario.difficulty === 'Stress Test'
                  ? 'bg-rose-50 text-[#C93645] border-rose-200'
                  : activeScenario.difficulty === 'Advanced'
                  ? 'bg-[#FFF3D6] text-[#9A6500] border-[#E7C77E]'
                  : 'bg-[#E8F5F0] text-[#007A61] border-[#A8DCCE]'
              }`}
            >
              {activeScenario.difficulty}
            </span>

            <button
              type="button"
              disabled={runningId === activeScenario.id}
              onClick={() => handleLaunchScenario(activeScenario)}
              className="axiom-btn-primary py-1.5 px-4 text-xs h-[34px]"
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
        <div className="p-6 space-y-6 bg-[#FAF9F5]/40">
          {/* Mission Briefing */}
          <div>
            <span className="eyebrow block mb-1">
              Trial Objective & Operational Invariant
            </span>
            <p className="text-sm font-sans text-[#17263A] leading-relaxed">
              {activeScenario.summary}
            </p>
          </div>

          {/* PRIMARY VISUALIZATION: Graphical Execution Map (Point 6) */}
          <div className="space-y-2">
            <span className="eyebrow block">
              Execution Trace Topology (Interactive Nodes)
            </span>
            <SimulationExecutionMap
              currentPhaseIndex={executionPhaseIndex}
              isRunning={runningId === activeScenario.id}
              scenarioTitle={activeScenario.title}
              hasHumanGate={activeScenario.id !== 'demo-refund-triage'}
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* Side-by-Side: Payload Input vs Expected Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white border border-[#D5D5CE] rounded-[4px] space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-sans uppercase text-[#68758A] block font-semibold tracking-[0.08em] flex items-center gap-1.5">
                <Cpu size={12} className="text-[#17263A]" />
                Simulated Event Payload:
              </span>
              <div className="font-mono text-[11px] text-[#17263A] bg-[#FAF9F5] p-2.5 rounded-[3px] border border-[#D5D5CE]/60 leading-relaxed">
                {activeScenario.initialInput}
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#D5D5CE] rounded-[4px] space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-sans uppercase text-[#00866B] block font-semibold tracking-[0.08em] flex items-center gap-1.5">
                <Shield size={12} className="text-[#00866B]" />
                Guaranteed Invariant Outcome:
              </span>
              <div className="font-mono text-[11px] text-[#00866B] bg-[#E5F5EF] p-2.5 rounded-[3px] border border-[#A8DCCE] leading-relaxed">
                {activeScenario.expectedOutcome}
              </div>
            </div>
          </div>

          {/* SECONDARY: Compact Event Timeline (Point 6) */}
          <div className="p-3.5 bg-white border border-[#D5D5CE] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-xs font-sans text-[#68758A] border-b border-[#D5D5CE] pb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-[#17263A] tracking-[0.04em] uppercase text-[10px]">
                <Clock size={12} className="text-[#00866B]" />
                <span>Compact State Transition Timeline</span>
              </span>
              <span className="text-[11px] font-mono text-[#00866B]">SHA-256 MERKLE ROOT: VERIFIED</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] divide-y divide-[#D5D5CE]/40">
              {simLogs.map((log, i) => (
                <div key={i} className="pt-1 text-[#334256] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BENCHMARK LIBRARY ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-[#68758A] border-b border-[#D5D5CE] pb-2">
          <span className="uppercase font-semibold tracking-[0.06em]">Simulation Benchmark Library (4 Scenarios)</span>
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
                  setExecutionPhaseIndex(0);
                  setSimLogs([`[00:00.000] LOADED: Trial "${sc.title}" ready for execution.`]);
                }}
                className={`p-4 rounded-[4px] border cursor-pointer transition-all shadow-2xs ${
                  isSelected
                    ? 'border-[#17263A] bg-white ring-1 ring-[#17263A]'
                    : 'border-[#D5D5CE] bg-white hover:border-[#17263A]/40 hover:bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#C93645] px-1.5 py-0.5 bg-[#FCE8EA] rounded-[3px] border border-[#F3C4C9]">
                      LAB 0{idx + 1}
                    </span>
                    <h4 className="text-sm font-sans font-semibold text-[#17263A]">
                      {sc.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-sans font-semibold uppercase px-1.5 py-0.5 rounded-[3px] ${
                      sc.difficulty === 'Stress Test'
                        ? 'bg-[#FCE8EA] text-[#C93645]'
                        : sc.difficulty === 'Advanced'
                        ? 'bg-[#FFF2CC] text-[#B97800]'
                        : 'bg-[#E5F5EF] text-[#00866B]'
                    }`}
                  >
                    {sc.difficulty}
                  </span>
                </div>

                <p className="text-xs font-sans text-[#40516A] mt-2 line-clamp-2 leading-relaxed">
                  {sc.summary}
                </p>

                <div className="mt-3 pt-2 border-t border-[#D5D5CE]/60 flex items-center justify-between text-xs font-sans text-[#68758A]">
                  <span><span className="font-mono font-medium text-[#17263A]">{sc.stepsCount}</span> Nodes in DAG</span>
                  <span className="text-[#17263A] font-semibold flex items-center gap-1">
                    {isSelected ? 'Loaded in Chamber' : 'Load Simulation →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Evidence Inspector */}
      <EvidenceDrawer
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
      />
    </div>
  );
};
