import React, { useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  CheckSquare,
  CircleDot,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { ApprovalCard } from '../components/ApprovalCard';

const STAGES = [
  {
    id: '01',
    name: 'Plan',
    role: 'DAG decomposition',
    agent: 'Workflow Planner',
  },
  {
    id: '02',
    name: 'Validate',
    role: 'Invariant sandbox',
    agent: 'Validation Tester',
  },
  {
    id: '03',
    name: 'Execute',
    role: 'Atomic dispatch',
    agent: 'Task Executor',
  },
  {
    id: '04',
    name: 'Audit',
    role: 'Provenance proof',
    agent: 'Quality Reviewer',
  },
  {
    id: '05',
    name: 'Authorize',
    role: 'Human gate',
    agent: 'Release Guardian',
  },
];

export const DashboardPage: React.FC = () => {
  const {
    workflows,
    approvals,
    incidents,
    auditLogs,
    navigateTo,
  } = useOperationsStore();

  const pendingApprovals = useMemo(
    () => approvals.filter((a) => a.status === 'pending'),
    [approvals],
  );

  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.status === 'active'),
    [incidents],
  );

  const recentLogs = useMemo(
    () => auditLogs.slice(0, 6),
    [auditLogs],
  );

  return (
    <main className="axiom-command-center">
      <header className="axiom-command-hero">
        <div>
          <div className="axiom-kicker">
            <span className="axiom-kicker-mark" />
            AXIOM / COMMAND CENTER
          </div>

          <h1>Operations, in motion.</h1>

          <p>
            Autonomous systems execute inside explicit boundaries.
            Every material action remains observable, reversible,
            and subject to human authority.
          </p>
        </div>

        <div className="axiom-command-actions">
          <button
            type="button"
            className="axiom-control axiom-control-light"
            onClick={() => navigateTo('demo-scenarios')}
          >
            <PlayCircle size={14} />
            <span>Scenario Lab</span>
          </button>

          <button
            type="button"
            className="axiom-control axiom-control-dark"
            onClick={() => navigateTo('approvals')}
          >
            <CheckSquare size={14} />
            <span>Approvals</span>
            <b>{pendingApprovals.length}</b>
          </button>
        </div>
      </header>

      <section
        className="axiom-metric-ribbon"
        aria-label="System summary"
      >
        <div className="axiom-metric">
          <span>PIPELINES</span>
          <strong>{workflows.length}</strong>
          <small>active orchestration paths</small>
        </div>

        <div className="axiom-metric axiom-metric-alert">
          <span>HUMAN GATES</span>
          <strong>{pendingApprovals.length}</strong>
          <small>decisions awaiting operator authority</small>
        </div>

        <div className="axiom-metric">
          <span>FLEET</span>
          <strong className="is-green">
            08<span>/08</span>
          </strong>
          <small>nodes reporting heartbeat</small>
        </div>

        <div className="axiom-metric">
          <span>INVARIANTS</span>
          <strong>{activeIncidents.length}</strong>
          <small>
            {activeIncidents.length
              ? 'active exceptions'
              : 'no active violations'}
          </small>
        </div>
      </section>

      <section className="axiom-control-room">
        <div className="axiom-control-room-head">
          <div>
            <span className="axiom-kicker">
              LIVE ORCHESTRATION
            </span>

            <h2>Continuous control loop</h2>
          </div>

          <div className="axiom-live-state">
            <CircleDot size={12} />
            <span>SYSTEM NOMINAL</span>
          </div>
        </div>

        <div className="axiom-flow-track">
          {STAGES.map((stage, index) => {
            const gated =
              index === STAGES.length - 1 &&
              pendingApprovals.length > 0;

            return (
              <React.Fragment key={stage.id}>
                <article
                  className={`axiom-flow-node ${
                    gated ? 'is-gated' : ''
                  }`}
                >
                  <div className="axiom-flow-node-top">
                    <span>{stage.id}</span>
                    <i />
                  </div>

                  <h3>{stage.name}</h3>

                  <p>{stage.role}</p>

                  <div className="axiom-flow-agent">
                    {stage.agent}
                  </div>
                </article>

                {index < STAGES.length - 1 && (
                  <div className="axiom-flow-link">
                    <span />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="axiom-boundary">
          <ShieldCheck size={15} />

          <span>
            <b>BOUNDARY</b>{' '}
            External mutations require validated
            invariants before dispatch.
          </span>

          <button type="button" onClick={() => navigateTo('workflows')}>
            <span>Inspect topology</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      <section className="axiom-command-grid">
        <div className="axiom-desk">
          <div className="axiom-section-head">
            <div>
              <span className="axiom-kicker">
                DECISION DESK
              </span>

              <h2>Human authority queue</h2>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('approvals')}
            >
              <span>Open queue</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {pendingApprovals.length ? (
            <div className="axiom-approval-stack">
              {pendingApprovals
                .slice(0, 2)
                .map((request) => (
                  <ApprovalCard
                    key={request.id}
                    request={request}
                  />
                ))}
            </div>
          ) : (
            <div className="axiom-empty">
              <LockKeyhole size={18} />

              <div>
                <b>No intervention required</b>

                <span>
                  All autonomous actions are currently
                  inside policy bounds.
                </span>
              </div>
            </div>
          )}
        </div>

        <aside className="axiom-ledger">
          <div className="axiom-section-head">
            <div>
              <span className="axiom-kicker">
                IMMUTABLE LEDGER
              </span>

              <h2>Latest state changes</h2>
            </div>

            <button type="button" onClick={() => navigateTo('audit')}>
              <span>Audit</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="axiom-ledger-list">
            {recentLogs.map((log) => (
              <div
                className="axiom-ledger-row"
                key={log.id}
              >
                <div className="axiom-ledger-time">
                  {log.timestamp}
                </div>

                <div className="axiom-ledger-dot" />

                <div className="axiom-ledger-copy">
                  <b>{log.agentName}</b>

                  <span>{log.action}</span>

                  <p>{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="axiom-bottom-strip">
        <div>
          <Workflow size={16} />

          <span>ORCHESTRATION</span>

          <b>Deterministic DAG execution</b>
        </div>

        <div>
          <Activity size={16} />

          <span>OBSERVABILITY</span>

          <b>Every transition leaves evidence</b>
        </div>

        <div>
          <ShieldCheck size={16} />

          <span>HUMAN CONTROL</span>

          <b>Explicit approval at risk boundaries</b>
        </div>
      </section>
    </main>
  );
};
