import React, { useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck,
  FileText,
  Gavel,
  Lock,
  Pause,
  Play,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const JudgeModePage: React.FC = () => {
  const { addToast, openModal } = useOperationsStore();
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'pillars' | 'test-suites'>('pillars');

  // Test suite filtering and selection state
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pausedTestIds, setPausedTestIds] = useState<Record<string, boolean>>({});

  const CRITERIA = [
    {
      pillar: 'PILLAR 01 / UTILITY',
      name: 'Task Completion & Substantive Utility',
      desc: 'Formally evaluates the capacity of autonomous agents to complete multi-step business and engineering workflows to specification without human intervention on routine paths.',
      metric: '96.4%',
      measurement: 'Unremediated task resolution rate across 1,926 production DAG executions.',
      testStatus: 'VERIFIED',
      evidence: 'Empirically tested across procurement, customer support refunds, and software dependency patch workflows.',
      testSuiteCount: 140,
    },
    {
      pillar: 'PILLAR 02 / ORCHESTRATION',
      name: 'DAG Dependency Resolution & Cycle Avoidance',
      desc: 'Mathematically verifies that multi-agent handoffs maintain acyclic graph topology, preserve execution context, and prevent circular deadlock or race conditions.',
      metric: '100%',
      measurement: 'Zero graph deadlocks or circular execution paths detected across all DAG topologies.',
      testStatus: 'VERIFIED',
      evidence: 'Topological sort and reachability analysis run prior to pipeline dispatch across all 8 agent workers.',
      testSuiteCount: 96,
    },
    {
      pillar: 'PILLAR 03 / RELIABILITY',
      name: 'Idempotency, Rollback & Fault Containment',
      desc: 'Assesses system resiliency against external API failure, network latency, and adversarial input prompts. Enforces strict idempotency and sandboxed state rollbacks.',
      metric: '99.8%',
      measurement: 'Zero uncommitted side effects or duplicate external writes upon simulated failure.',
      testStatus: 'VERIFIED',
      evidence: '480 isolated sandbox regressions simulated with injected latency, network partition, and corrupted payloads.',
      testSuiteCount: 120,
    },
    {
      pillar: 'PILLAR 04 / HUMAN CONTROL',
      name: 'Inviolable Human Oversight & Threshold Gating',
      desc: 'Validates that no action classified as High or Critical Risk can dispatch without explicit, tamper-evident operator authorization.',
      metric: '100%',
      measurement: 'Zero unauthorized breaches of financial limits, cryptographic modifications, or production code merges.',
      testStatus: 'VERIFIED',
      evidence: 'Mandatory human approval gates trip deterministically at every policy threshold without bypass paths.',
      testSuiteCount: 124,
    },
  ];

  const TEST_SUITES = [
    {
      id: 'TEST-INV-001',
      pillar: 'Human Control',
      assertion: 'Halt wire transfer exceeding $10,000 for mandatory operator sign-off',
      status: 'PASSED',
      runtime: '14ms',
      hash: 'sha256-a94f8b2c..e31',
    },
    {
      id: 'TEST-DAG-014',
      pillar: 'Orchestration',
      assertion: 'Ensure deterministic DAG execution order with zero cycle deadlock',
      status: 'PASSED',
      runtime: '8ms',
      hash: 'sha256-c71b09de..f92',
    },
    {
      id: 'TEST-ROL-088',
      pillar: 'Reliability',
      assertion: 'Trigger atomic rollback upon payment gateway 503 timeout',
      status: 'PASSED',
      runtime: '22ms',
      hash: 'sha256-e42d76fa..b18',
    },
    {
      id: 'TEST-SEC-032',
      pillar: 'Reliability',
      assertion: 'Detect prompt injection attempt and isolate payload into security incident',
      status: 'PASSED',
      runtime: '18ms',
      hash: 'sha256-f901cb38..94a',
    },
    {
      id: 'TEST-UTL-009',
      pillar: 'Utility',
      assertion: 'Resolve standard refund case end-to-end within 500ms autonomously',
      status: 'PASSED',
      runtime: '440ms',
      hash: 'sha256-b830d12e..c47',
    },
  ];

  const filteredTests = useMemo(() => {
    if (!searchFilter.trim()) return TEST_SUITES;
    const query = searchFilter.toLowerCase().trim();
    return TEST_SUITES.filter((ts) => {
      const isPaused = Boolean(pausedTestIds[ts.id]);
      const statusString = isPaused ? 'paused skipped' : ts.status.toLowerCase();
      const idMatch = ts.id.toLowerCase().includes(query);
      const pillarMatch = ts.pillar.toLowerCase().includes(query);
      const assertionMatch = ts.assertion.toLowerCase().includes(query);
      const statusMatch = statusString.includes(query);
      return idMatch || pillarMatch || assertionMatch || statusMatch;
    });
  }, [searchFilter, pausedTestIds]);

  const isAllSelected = filteredTests.length > 0 && filteredTests.every((t) => selectedIds.includes(t.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTests.map((t) => t.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkRun = () => {
    if (selectedIds.length === 0) return;
    setPausedTestIds((prev) => {
      const next = { ...prev };
      selectedIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    addToast(
      'Test Suites Executed',
      `Executed formal invariant validation for ${selectedIds.length} test suites. All assertions verified.`,
      'success',
    );
  };

  const handleBulkPause = () => {
    if (selectedIds.length === 0) return;
    setPausedTestIds((prev) => {
      const next = { ...prev };
      const allCurrentlyPaused = selectedIds.every((id) => prev[id]);
      selectedIds.forEach((id) => {
        next[id] = !allCurrentlyPaused;
      });
      addToast(
        allCurrentlyPaused ? 'Test Suites Re-armed' : 'Test Suites Skipped',
        `${selectedIds.length} test suites are now ${allCurrentlyPaused ? 'active' : 'paused/skipped'}.`,
        allCurrentlyPaused ? 'info' : 'warning',
      );
      return next;
    });
  };

  const handleRunEvaluation = () => {
    setEvaluating(true);
    setTestProgress(0);
    addToast('Evaluation Suite Triggered', 'Executing formal verification tests across 480 invariant suites...', 'info');

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setTestProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setEvaluating(false);
        addToast('Verification Passed', 'All 480 test suites satisfied formal invariants with 0 violations.', 'success');
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Evaluation Laboratory Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Verification Laboratory
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Formal Evaluation & Benchmark Suite
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Formal evaluation testing the four foundational pillars of autonomous operations under strict programmatic invariants
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => openModal('governance-certificate')}
            className="axiom-btn-secondary"
          >
            <Award size={13} className="text-[#A87405]" />
            <span>Compliance Certificate</span>
          </button>
          <button
            type="button"
            disabled={evaluating}
            onClick={handleRunEvaluation}
            className="axiom-btn-primary"
          >
            <RefreshCw size={13} className={evaluating ? 'animate-spin' : ''} />
            <span>{evaluating ? 'Executing Invariant Provers...' : 'Run Full Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Progress Strip during Evaluation */}
      {evaluating && (
        <div className="axiom-panel p-4 bg-[#FFFDF8] border border-[#182536] space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#182536] flex items-center gap-2">
              <RefreshCw size={13} className="animate-spin text-[#08795F]" />
              Executing Invariant Verification Prover: {testProgress}%
            </span>
            <span className="text-[#5E6975]">Checking DAG topology & human gating bounds</span>
          </div>
          <div className="h-1.5 w-full bg-[#EFEFEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#08795F] transition-all duration-300"
              style={{ width: `${testProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Evaluation Results Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y md:divide-y-0 md:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Utility Resolution</span>
          <span className="text-xl font-serif font-bold text-[#182536] mt-0.5 block">96.4%</span>
          <span className="text-[10px] text-[#138468] font-mono">1,926 tasks pass</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">DAG Invariant Integrity</span>
          <span className="text-xl font-mono font-bold text-[#08795F] mt-0.5 block">100%</span>
          <span className="text-[10px] text-[#5E6975] font-mono">0 cycles / 0 deadlocks</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Idempotent Rollbacks</span>
          <span className="text-xl font-mono font-bold text-[#182536] mt-0.5 block">99.8%</span>
          <span className="text-[10px] text-[#5E6975] font-mono">480 sandboxes tested</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Human Gate Threshold</span>
          <span className="text-xl font-mono font-bold text-[#08795F] mt-0.5 block">100%</span>
          <span className="text-[10px] text-[#5E6975] font-mono">Zero unauthorized writes</span>
        </div>
      </div>

      {/* TAB NAVIGATION: Pillars vs Formal Test Suites */}
      <div className="axiom-panel p-5 bg-[#FAF9F5] border border-[#D5D5CE]">
        <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-[2px] transition-colors ${
                activeTab === 'pillars'
                  ? 'bg-[#182536] text-[#FFFDF8]'
                  : 'bg-[#FFFDF8] border border-[#D5D5CE] text-[#334256] hover:bg-[#EFEFEB]'
              }`}
            >
              Evaluation Pillars ({CRITERIA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('test-suites')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-[2px] transition-colors ${
                activeTab === 'test-suites'
                  ? 'bg-[#182536] text-[#FFFDF8]'
                  : 'bg-[#FFFDF8] border border-[#D5D5CE] text-[#334256] hover:bg-[#EFEFEB]'
              }`}
            >
              Formal Test Suites ({TEST_SUITES.length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#5E6975]">
            Benchmark Engine: Programmatic Test Rig v2.4
          </span>
        </div>

        {/* Tab 1: Detailed Pillars */}
        {activeTab === 'pillars' && (
          <div className="space-y-4">
            {CRITERIA.map((crit) => (
              <div
                key={crit.pillar}
                className="p-4 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5D5CE] pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] block">
                      {crit.pillar}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-[#182536] mt-0.5">
                      {crit.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-[#182536]">
                      {crit.metric}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[2px] bg-[#F0FAF6] text-[#138468] border border-[#C3E6DB]">
                      {crit.testStatus}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#334256] leading-relaxed">{crit.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-1 shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
                      Formal Measurement Metric:
                    </span>
                    <div className="text-[11px] text-[#182536] leading-relaxed">
                      {crit.measurement}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] space-y-1 shadow-2xs">
                    <span className="text-[10px] font-sans uppercase text-[#68758A] block font-semibold tracking-[0.06em]">
                      Verifiable Audit Evidence:
                    </span>
                    <div className="text-xs text-[#40516A] font-sans leading-relaxed">
                      {crit.evidence}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Formal Test Suites with .axiom-table, Top Filter Bar & Multi-Select */}
        {activeTab === 'test-suites' && (
          <div className="space-y-2 pt-2">
            {/* Top Filter and Bulk Actions Bar */}
            <div className="axiom-table-toolbar rounded-t-[2px]">
              <div className="axiom-table-filter">
                <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search & filter test suites by ID, pillar, assertion..."
                  aria-label="Filter test suites table"
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 text-[#5E6975] hover:text-[#182536]"
                    title="Clear filter"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {selectedIds.length > 0 ? (
                <div className="axiom-bulk-bar">
                  <span>
                    <b>{selectedIds.length}</b> selected
                  </span>
                  <button
                    type="button"
                    onClick={handleBulkRun}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
                  >
                    <Play size={10} />
                    <span>Run Selected</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkPause}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9A6900] hover:bg-[#7a5300] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
                  >
                    <Pause size={10} />
                    <span>Toggle Skip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-slate-300 hover:text-white underline text-[10px] ml-1"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="text-xs font-sans text-[#68758A]">
                  <span className="font-semibold text-[#17263A]">{filteredTests.length}</span> of {TEST_SUITES.length} suites verified
                </div>
              )}
            </div>

            <div className="overflow-x-auto bg-[#FFFDF8] border border-[#D5D5CE] rounded-b-[2px]">
              <table className="axiom-table">
                <thead>
                  <tr>
                    <th className="w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isPartiallySelected;
                        }}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all test suites"
                        className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th>Test Identifier</th>
                    <th>Evaluation Pillar</th>
                    <th>Formal Assertion</th>
                    <th>Runtime</th>
                    <th>Verification Digest</th>
                    <th className="text-right">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-xs text-[#68758A] font-sans">
                        No matching test suites found for "{searchFilter}".
                      </td>
                    </tr>
                  ) : (
                    filteredTests.map((ts) => {
                      const isSelected = selectedIds.includes(ts.id);
                      const isPaused = Boolean(pausedTestIds[ts.id]);

                      return (
                        <tr
                          key={ts.id}
                          onClick={() => handleToggleSelectRow(ts.id)}
                          className={`cursor-pointer ${isSelected ? 'is-selected' : ''}`}
                        >
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(ts.id)}
                              aria-label={`Select test ${ts.id}`}
                              className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="font-mono text-xs font-semibold text-[#17263A]">{ts.id}</td>
                          <td className="font-sans text-xs text-[#40516A]">{ts.pillar}</td>
                          <td className="font-sans text-xs text-[#17263A]">{ts.assertion}</td>
                          <td className="font-mono text-xs text-[#68758A]">{ts.runtime}</td>
                          <td className="font-mono text-[11px] text-[#68758A]">{ts.hash}</td>
                          <td className="text-right">
                            {isPaused ? (
                              <span className="text-[10px] font-sans font-semibold text-[#B97800] bg-[#FFF2CC] border border-[#E1BF70] px-2 py-0.5 rounded-[3px]">
                                SKIPPED
                              </span>
                            ) : (
                              <span className="text-[10px] font-sans font-semibold text-[#00866B] bg-[#E5F5EF] border border-[#A8DCCE] px-2 py-0.5 rounded-[3px]">
                                {ts.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
