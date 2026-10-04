import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Play, Lock, Clock } from 'lucide-react';

export interface FlowStage {
  id: string;
  indexCode: string;
  title: string;
  subtitle: string;
  agent?: string;
  status: 'completed' | 'running' | 'pending' | 'blocked';
  latency?: string;
  policyId?: string;
  hash?: string;
}

export interface ExecutionFlowChartProps {
  onNodeClick?: (stage: FlowStage) => void;
  className?: string;
}

export function ExecutionFlowChart({
  onNodeClick,
  className = '',
}: ExecutionFlowChartProps) {
  const primaryStages: FlowStage[] = [
    {
      id: 'flow-context',
      indexCode: '01',
      title: 'Context Memory',
      subtitle: 'Retrieve tenant history & durable session state',
      agent: 'Context Memory Agent',
      status: 'completed',
      latency: '88ms',
      hash: 'sha256-a91cb48f..72f',
    },
    {
      id: 'flow-intent',
      indexCode: '02',
      title: 'Intent Analysis',
      subtitle: 'Parse parameters with 99.4% semantic confidence',
      agent: 'Intent Analyst',
      status: 'completed',
      latency: '34ms',
      hash: 'sha256-5f92bd88..611',
    },
    {
      id: 'flow-policy',
      indexCode: '03',
      title: 'Policy Boundary Check',
      subtitle: 'Evaluate POL-FIN-01 / POL-SEC-02 invariant fences',
      agent: 'Invariant Policy Boundary Engine',
      status: 'completed',
      latency: '410ms',
      policyId: 'POL-FIN-01',
      hash: 'sha256-7721ae99..a82',
    },
  ];

  const passStage: FlowStage = {
    id: 'flow-execute',
    indexCode: 'PASS',
    title: 'Direct Task Executor',
    subtitle: 'Atomic API invocation under invariant bounds',
    agent: 'Task Executor',
    status: 'completed',
    latency: '145ms',
    hash: 'sha256-94812a10..03c',
  };

  const humanStage: FlowStage = {
    id: 'flow-human',
    indexCode: 'REVIEW',
    title: 'Human Authority Gate',
    subtitle: 'High-risk disbursement halted for CFO authorization',
    agent: 'Release Guardian',
    status: 'running',
    policyId: 'POL-FIN-01',
    hash: 'sha256-e8b3a019..91c',
  };

  const auditStage: FlowStage = {
    id: 'flow-audit',
    indexCode: 'AUDIT',
    title: 'Immutable SHA-256 Ledger',
    subtitle: 'Cryptographic state transition committed to Merkle chain',
    agent: 'Immutable Audit Ledger',
    status: 'completed',
    latency: '24ms',
    hash: 'sha256-33918a01..829',
  };

  return (
    <section className={`flow-panel bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] p-6 ${className}`}>
      <div className="flow-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D1C7]/70">
        <div>
          <span className="eyebrow block">
            EXECUTION ARCHITECTURE
          </span>
          <h2 className="text-lg sm:text-xl font-sans font-semibold text-[#17263A] mt-1 leading-[1.25] tracking-[-0.01em]">
            Autonomous Continuous Control Loop
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="axiom-tag axiom-tag-success">
            <ShieldCheck size={12} />
            <span>INVARIANTS ACTIVE</span>
          </span>
        </div>
      </div>

      <div className="execution-flow flex flex-col items-center py-8">
        {/* Sequential Stages: Context -> Intent -> Policy */}
        {primaryStages.map((stage) => (
          <React.Fragment key={stage.id}>
            <button
              type="button"
              onClick={() => onNodeClick?.(stage)}
              className={`flow-node group ${
                stage.status === 'completed'
                  ? 'completed'
                  : stage.status === 'running'
                  ? 'running'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="node-id">
                  NODE {stage.indexCode}
                </span>
                <span className="axiom-tag axiom-tag-success">
                  <CheckCircle2 size={11} />
                  <span>COMPLETED</span>
                </span>
              </div>
              <h3 className="node-title">
                {stage.title}
              </h3>
              <p className="node-description">
                {stage.subtitle}
              </p>
              <div className="node-technical-footer">
                <span className="agent-label">{stage.agent}</span>
                <span className="technical-value">{stage.latency}</span>
              </div>
            </button>

            <div className="flow-connector" aria-hidden="true" />
          </React.Fragment>
        ))}

        {/* Policy Decision Branch: PASS vs REVIEW */}
        <div className="decision-branch grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-[760px] relative my-1">
          <div className="branch-line hidden sm:block" />

          {/* Left Branch: Routine Autonomous Execution */}
          <button
            type="button"
            onClick={() => onNodeClick?.(passStage)}
            className="flow-node execution completed group"
          >
            <div className="flex items-center justify-between">
              <span className="node-id text-[#007A61]">
                ROUTINE / PASS
              </span>
              <span className="axiom-tag axiom-tag-success">
                <CheckCircle2 size={11} />
                <span>RELEASED</span>
              </span>
            </div>
            <h3 className="node-title">
              {passStage.title}
            </h3>
            <p className="node-description">
              {passStage.subtitle}
            </p>
            <div className="node-technical-footer">
              <span className="agent-label">{passStage.agent}</span>
              <span className="technical-value">{passStage.latency}</span>
            </div>
          </button>

          {/* Right Branch: Human Gate Authority */}
          <button
            type="button"
            onClick={() => onNodeClick?.(humanStage)}
            className="flow-node human group bg-[#FFFDF8] border-2 border-[#E7C77E]"
          >
            <div className="flex items-center justify-between">
              <span className="node-id text-[#9A6500] flex items-center gap-1">
                <ShieldAlert size={12} />
                <span>REVIEW / GATE</span>
              </span>
              <span className="axiom-tag axiom-tag-warning">
                <span>GATE HELD</span>
              </span>
            </div>
            <h3 className="node-title">
              {humanStage.title}
            </h3>
            <p className="node-description">
              {humanStage.subtitle}
            </p>
            <div className="node-technical-footer">
              <span className="agent-label text-[#9A6500] font-semibold">{humanStage.agent}</span>
              <span className="technical-value text-[#9A6500]">Mandatory Sign-off</span>
            </div>
          </button>
        </div>

        <div className="flow-connector" aria-hidden="true" />

        {/* Final Row: Immutable Audit Ledger */}
        <button
          type="button"
          onClick={() => onNodeClick?.(auditStage)}
          className="flow-node audit completed group"
        >
          <div className="flex items-center justify-between">
            <span className="node-id text-[#007A61]">
              AUDIT COMMIT
            </span>
            <span className="axiom-tag axiom-tag-success">
              <CheckCircle2 size={11} />
              <span>SIGNED & SEALED</span>
            </span>
          </div>
          <h3 className="node-title">
            {auditStage.title}
          </h3>
          <p className="node-description">
            {auditStage.subtitle}
          </p>
          <div className="node-technical-footer">
            <span className="agent-label">Actor: Merkle Tree Engine</span>
            <span className="technical-value">{auditStage.latency}</span>
          </div>
        </button>
      </div>
    </section>
  );
}
