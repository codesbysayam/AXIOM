import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  FileCheck2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Zap,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { GovernancePolicy } from '../types';
import { axiomDemoData } from '../data/axiomDemoData';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';

const DETAILED_POLICIES = [
  {
    id: 'POL-FIN-01',
    name: 'Financial Disbursement Authorization Threshold',
    description: 'Mandates explicit human operator authorization for any single disbursement or wire transfer exceeding $10,000 USD.',
    scope: 'Financial Transactions & API Gateways',
    threshold: '> $10,000.00 USD',
    enforcementMode: 'human_gate',
    lastEvaluated: '12:03:18',
    violationsCount: 0,
    status: 'ACTIVE_ENFORCING',
    rules: [
      'Disbursements <= $10,000 proceed via automated 3-way match',
      'Disbursements > $10,000 trigger mandatory Lead Operator sign-off',
      'Disbursements > $50,000 require dual-operator authorization',
    ],
  },
  {
    id: 'POL-SEC-02',
    name: 'Production Code & Infrastructure Mutation Guard',
    description: 'Blocks direct autonomous code merges or container deployments into production environments without validated sandbox passage.',
    scope: 'CI/CD Pipelines, GitHub Repositories, Kubernetes',
    threshold: 'Production Environment Targets',
    enforcementMode: 'strict_block',
    lastEvaluated: '12:03:17',
    violationsCount: 0,
    status: 'ACTIVE_ENFORCING',
    rules: [
      'Ephemeral test sandbox must pass 100% of regression suites',
      'Static AST security scanner must find zero HIGH/CRITICAL vulnerabilities',
      'Human Security Lead approval gate mandatory before git push to main',
    ],
  },
  {
    id: 'POL-DATA-03',
    name: 'Context Memory Isolation & Data Retention Policy',
    description: 'Enforces ephemeral memory destruction upon session termination. Prohibits cross-tenant data retention and vectors in public stores.',
    scope: 'Memory & Context Vector Store',
    threshold: 'Session Boundary Termination',
    enforcementMode: 'strict_block',
    lastEvaluated: '12:03:16',
    violationsCount: 0,
    status: 'ACTIVE_ENFORCING',
    rules: [
      'Zero PII or raw secrets cached in working context vectors',
      'Zero cross-session data leakage across tenants',
      'Memory states cryptographically signed with SHA-256 Merkle proofs',
    ],
  },
  {
    id: 'POL-OPS-04',
    name: 'External Write Idempotency & Automatic Rollback',
    description: 'Requires deterministic idempotency keys for all external mutating API calls. Automates compensatory rollback upon transient network timeout.',
    scope: 'Third-Party API Dispatches & Webhooks',
    threshold: 'External Mutating Webhook Requests',
    enforcementMode: 'strict_block',
    lastEvaluated: '12:03:15',
    violationsCount: 0,
    status: 'ACTIVE_ENFORCING',
    rules: [
      'Every external POST/PUT must include idempotency token',
      'Timeout > 5000ms triggers atomic reverse compensation transaction',
      'State rollback must be verified and appended to audit ledger',
    ],
  },
];

export const GovernancePage: React.FC = () => {
  const { openModal, addToast } = useOperationsStore();
  const [selectedPolicy, setSelectedPolicy] = useState<(typeof DETAILED_POLICIES)[0] | null>(null);

  // Policy Evaluation Simulator state (Point 8)
  const [simAgent, setSimAgent] = useState('agent-task-executor');
  const [simOperation, setSimOperation] = useState('wire_transfer');
  const [simAmount, setSimAmount] = useState('28450');
  const [simContext, setSimContext] = useState('Vendor Apex Datacenter Systems renewal');
  const [simResult, setSimResult] = useState<{
    verdict: 'ALLOW' | 'REVIEW' | 'BLOCK';
    policyId: string;
    explanation: string;
  } | null>(null);

  const handleRunSimulator = () => {
    const amountNum = parseFloat(simAmount) || 0;
    if (simOperation === 'wire_transfer') {
      if (amountNum > 10000) {
        setSimResult({
          verdict: 'REVIEW',
          policyId: 'POL-FIN-01',
          explanation: `Disbursement amount ($${amountNum.toLocaleString()}) exceeds the $10,000 threshold. Invariant held: Routes to Human Decision Gate for Lead Operator sign-off.`,
        });
      } else {
        setSimResult({
          verdict: 'ALLOW',
          policyId: 'POL-FIN-01',
          explanation: `Disbursement amount ($${amountNum.toLocaleString()}) is below the $10,000 threshold. Autonomous execution permitted.`,
        });
      }
    } else if (simOperation === 'code_merge') {
      setSimResult({
        verdict: 'REVIEW',
        policyId: 'POL-SEC-02',
        explanation: 'Target environment is PRODUCTION. Mandatory Security Lead release gate tripped. Zero autonomous direct merges permitted.',
      });
    } else if (simOperation === 'data_export') {
      setSimResult({
        verdict: 'BLOCK',
        policyId: 'POL-DATA-03',
        explanation: 'Data export payload contains unhashed context memory identifiers. Fail-closed hard block enforced. Zero external leaks.',
      });
    } else {
      setSimResult({
        verdict: 'ALLOW',
        policyId: 'POL-OPS-04',
        explanation: 'API invocation includes valid idempotency token and verified rollback route. Invariant satisfied.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Responsible Autonomy
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Policy Control Center
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Operational boundary rules, regulatory constraints, and human authorization mandates
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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

      {/* Top Context Summary Ribbon (Point 8, 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y sm:divide-y-0 sm:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Active Policies</span>
          <strong className="text-xl font-mono text-[#182536] block mt-0.5">
            0{axiomDemoData.governance.activePolicies}
          </strong>
          <span className="text-[10px] text-[#5E6975] font-mono">100% Invariants Active</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Evaluations Today</span>
          <strong className="text-xl font-mono text-[#182536] block mt-0.5">
            {axiomDemoData.governance.evaluationsToday.toLocaleString()}
          </strong>
          <span className="text-[10px] text-[#08795F] font-mono">Real-time boundary prover</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Block Rate</span>
          <strong className="text-xl font-mono text-[#A66A00] block mt-0.5">
            {axiomDemoData.governance.blockRate}%
          </strong>
          <span className="text-[10px] text-[#5E6975] font-mono">Intercepted at risk threshold</span>
        </div>
        <div className="p-3.5">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Strict Intercept</span>
          <strong className="text-xl font-mono text-[#08795F] block mt-0.5">
            100%
          </strong>
          <span className="text-[10px] text-[#08795F] font-mono">Zero unauthorized bypasses</span>
        </div>
      </div>

      {/* POLICY CARDS GRID (Point 8: POL-FIN-01, POL-SEC-02, POL-DATA-03, POL-OPS-04) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#5E6975] border-b border-[#D5D5CE] pb-1.5">
          <span className="uppercase font-semibold">Active Operational Governance Policies (4)</span>
          <span>Click any card to open Rule Inspector</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DETAILED_POLICIES.map((policy) => (
            <div
              key={policy.id}
              onClick={() => setSelectedPolicy(policy)}
              className="p-4 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] cursor-pointer hover:border-[#182536] hover:bg-[#FAF9F5] transition-all space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#A66A00] uppercase block">
                    {policy.id}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-[#182536] mt-0.5">
                    {policy.name}
                  </h3>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                    policy.enforcementMode === 'strict_block'
                      ? 'bg-rose-50 text-[#B52D3D] border-rose-200'
                      : 'bg-[#FFF7DF] text-[#A66A00] border-[#E1BF70]'
                  }`}
                >
                  {policy.enforcementMode === 'strict_block' ? 'Strict Hard Block' : 'Mandatory Human Gate'}
                </span>
              </div>

              <p className="text-xs text-[#334256] leading-relaxed line-clamp-2">
                {policy.description}
              </p>

              <div className="p-2.5 bg-[#FAF9F5] border border-[#D5D5CE]/60 rounded-[2px] text-xs font-mono space-y-1">
                <div className="flex justify-between text-[#5E6975]">
                  <span>Scope:</span>
                  <span className="text-[#182536] font-semibold truncate max-w-[220px]">{policy.scope}</span>
                </div>
                <div className="flex justify-between text-[#5E6975]">
                  <span>Threshold:</span>
                  <span className="text-[#08795F] font-bold">{policy.threshold}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D5D5CE]/60 flex items-center justify-between text-[10px] font-mono text-[#5E6975]">
                <span>Evaluated: {policy.lastEvaluated}</span>
                <span className="text-[#182536] font-semibold flex items-center gap-1">
                  Inspect Rules →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POLICY EVALUATION SIMULATOR (Point 8) */}
      <div className="axiom-panel border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-[#08795F]" />
            <div>
              <h3 className="text-sm font-serif font-bold text-[#182536]">
                Interactive Policy Evaluation Simulator
              </h3>
              <p className="text-xs text-[#5E6975] mt-0.5">
                Simulate arbitrary agent dispatches to test boundary enforcement: ALLOW / REVIEW / BLOCK
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#08795F] bg-[#F0FAF6] px-2 py-0.5 border border-[#C3E6DB] rounded-[2px]">
            Engine: Live Invariant Prover
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block mb-1">
              Select Agent:
            </label>
            <select
              value={simAgent}
              onChange={(e) => setSimAgent(e.target.value)}
              className="w-full p-2 bg-white border border-[#D5D5CE] rounded-[2px] text-[#182536]"
            >
              {AGENT_WORKFORCE.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block mb-1">
              Operation Type:
            </label>
            <select
              value={simOperation}
              onChange={(e) => setSimOperation(e.target.value)}
              className="w-full p-2 bg-white border border-[#D5D5CE] rounded-[2px] text-[#182536]"
            >
              <option value="wire_transfer">Financial Wire Transfer</option>
              <option value="code_merge">Production Code Merge</option>
              <option value="data_export">Vector Context Export</option>
              <option value="api_dispatch">External API Write</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block mb-1">
              Disbursement / Risk Amount:
            </label>
            <input
              type="text"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              placeholder="e.g. 28450"
              className="w-full p-2 bg-white border border-[#D5D5CE] rounded-[2px] text-[#182536] font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block mb-1">
              Business Context:
            </label>
            <input
              type="text"
              value={simContext}
              onChange={(e) => setSimContext(e.target.value)}
              placeholder="e.g. Vendor Apex Datacenter Systems renewal"
              className="w-full p-2 bg-white border border-[#D5D5CE] rounded-[2px] text-[#182536]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-[#5E6975]">
            Tests fail-closed invariant sandboxing against active policies.
          </span>
          <button
            type="button"
            onClick={handleRunSimulator}
            className="axiom-btn-primary py-1.5 px-4 text-xs font-semibold"
          >
            <Play size={12} />
            <span>Simulate Evaluation</span>
          </button>
        </div>

        {/* Simulator Result */}
        {simResult && (
          <div
            className={`p-4 rounded-[2px] border text-xs font-mono space-y-1.5 animate-in fade-in duration-150 ${
              simResult.verdict === 'ALLOW'
                ? 'bg-[#F0FAF6] border-[#C3E6DB] text-[#08795F]'
                : simResult.verdict === 'REVIEW'
                ? 'bg-[#FFF7DF] border-[#E1BF70] text-[#A66A00]'
                : 'bg-[#FFF0F1] border-rose-200 text-[#B52D3D]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                {simResult.verdict === 'ALLOW' ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <ShieldAlert size={14} />
                )}
                SIMULATOR OUTCOME: {simResult.verdict}
              </span>
              <span>Matched Policy: {simResult.policyId}</span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-[#182536] mt-1">
              {simResult.explanation}
            </p>
          </div>
        )}
      </div>

      {/* RULE INSPECTOR DRAWER */}
      {selectedPolicy && (
        <>
          <div
            className="fixed inset-0 bg-[#182536]/40 z-50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedPolicy(null)}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#FFFDF8] border-l border-[#D5D5CE] z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-label="Rule Inspector"
          >
            <header className="p-4 bg-[#FAF9F5] border-b border-[#D5D5CE] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A66A00] font-bold block">
                  {selectedPolicy.id} RULE SPECIFICATION
                </span>
                <h3 className="text-base font-serif font-bold text-[#182536]">
                  {selectedPolicy.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="p-1 text-[#5E6975] hover:text-[#182536]"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3.5 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
                <span className="text-[10px] font-mono text-[#5E6975] uppercase block font-semibold">Description</span>
                <p className="text-xs text-[#182536] leading-relaxed font-sans">{selectedPolicy.description}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#5E6975] font-semibold block">
                  Formal Execution Rules & Invariants
                </span>
                <div className="space-y-1.5">
                  {selectedPolicy.rules.map((r, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-[#08795F] flex-shrink-0 mt-0.5" />
                      <span className="font-mono text-[11px] text-[#182536] leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1 font-mono text-xs">
                <span className="text-[10px] text-[#5E6975] block uppercase font-semibold">Operational Telemetry</span>
                <div>Enforcement: <b>{selectedPolicy.enforcementMode.toUpperCase()}</b></div>
                <div>Status: <span className="text-[#08795F] font-bold">100% INVARIANTS ACTIVE</span></div>
                <div>Violations Detected: <b>0</b></div>
              </div>
            </div>

            <footer className="p-3 bg-[#FAF9F5] border-t border-[#D5D5CE] text-right">
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="px-3 py-1 bg-[#182536] text-white text-xs rounded-[2px]"
              >
                Close Rule Inspector
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
};
