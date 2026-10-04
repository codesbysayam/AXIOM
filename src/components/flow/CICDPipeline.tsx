import React from 'react';
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  Code2,
  FileCode,
  ShieldAlert,
  Server,
  Layers,
  Activity,
} from 'lucide-react';

export interface CICDStage {
  id: string;
  name: string;
  status: 'passed' | 'running' | 'waiting-human' | 'pending' | 'failed';
  duration: string;
  metricLabel: string;
  metricValue: string;
  detail: string;
}

export interface CICDPipelineProps {
  pipelineTitle?: string;
  commitHash?: string;
  author?: string;
  className?: string;
  onStageClick?: (stage: CICDStage) => void;
}

export function CICDPipeline({
  pipelineTitle = 'core-orchestrator / production-release-pipeline',
  commitHash = 'commit: 7c89a01',
  author = 'Operator: Lead Release Engineer',
  className = '',
  onStageClick,
}: CICDPipelineProps) {
  const stages: CICDStage[] = [
    {
      id: 'source',
      name: 'Source Ingest',
      status: 'passed',
      duration: '420ms',
      metricLabel: 'Commit',
      metricValue: 'HEAD @ 7c89a01',
      detail: 'Git repository webhook received and signed',
    },
    {
      id: 'change-detection',
      name: 'Change Detection',
      status: 'passed',
      duration: '180ms',
      metricLabel: 'Files',
      metricValue: '14 changed',
      detail: 'AST delta computed across 3 microservices',
    },
    {
      id: 'static-analysis',
      name: 'Static Analysis',
      status: 'passed',
      duration: '840ms',
      metricLabel: 'Linter',
      metricValue: '0 errors',
      detail: 'Strict TypeScript type checking & ESLint security AST pass',
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      status: 'passed',
      duration: '1.2s',
      metricLabel: 'CVE Audit',
      metricValue: '0 Critical',
      detail: 'Dependency SBOM verification against NVD feed',
    },
    {
      id: 'build',
      name: 'Hermetic Build',
      status: 'passed',
      duration: '2.4s',
      metricLabel: 'Artifact',
      metricValue: 'sha256: 491a..',
      detail: 'Reproducible container build completed in sandbox',
    },
    {
      id: 'unit-test',
      name: 'Unit Test Suite',
      status: 'passed',
      duration: '1.8s',
      metricLabel: 'Coverage',
      metricValue: '96.4% (312 tests)',
      detail: '100% of unit assertions passed',
    },
    {
      id: 'integration-test',
      name: 'Integration Test',
      status: 'passed',
      duration: '3.1s',
      metricLabel: 'E2E APIs',
      metricValue: '48 passed',
      detail: 'Synthetic multi-agent API contracts verified',
    },
    {
      id: 'invariant-check',
      name: 'Invariant Check',
      status: 'passed',
      duration: '640ms',
      metricLabel: 'Boundary',
      metricValue: 'POL-SEC-02 Pass',
      detail: 'Mathematical verification of state invariants',
    },
    {
      id: 'human-gate',
      name: 'Human Release Gate',
      status: 'waiting-human',
      duration: 'Waiting',
      metricLabel: 'Approval',
      metricValue: 'GATE HELD',
      detail: 'CFO / Security Lead dual confirmation mandatory',
    },
    {
      id: 'deploy',
      name: 'Rolling Deploy',
      status: 'pending',
      duration: 'Est. 4.2s',
      metricLabel: 'Fleet',
      metricValue: '8 nodes',
      detail: 'Zero-downtime blue/green deployment strategy',
    },
    {
      id: 'post-deploy',
      name: 'Post-Deploy Monitor',
      status: 'pending',
      duration: 'Est. 60s',
      metricLabel: 'Telemetry',
      metricValue: 'Canary SLA',
      detail: 'Automated 60-second error rate anomaly monitor',
    },
    {
      id: 'audit',
      name: 'Audit Provenance',
      status: 'pending',
      duration: 'Est. 120ms',
      metricLabel: 'Merkle Root',
      metricValue: 'Append only',
      detail: 'Cryptographic commit to tamper-evident audit ledger',
    },
  ];

  return (
    <section className={`viz-panel p-6 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D1C7]/70">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch size={14} className="text-[#3569A8]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold">
              CI/CD AUTOMATION & VERIFICATION PIPELINE
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#17263A] mt-0.5">
            {pipelineTitle}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#68758A]">
          <span className="px-2 py-0.5 bg-[#FAF7EE] border border-[#D5D1C7] rounded-[3px]">
            {commitHash}
          </span>
          <span className="text-[#40516A]">{author}</span>
        </div>
      </div>

      {/* Grid of CI/CD Stages */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage, idx) => {
          const isPassed = stage.status === 'passed';
          const isWaiting = stage.status === 'waiting-human';
          const isRunning = stage.status === 'running';

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onStageClick?.(stage)}
              className={`p-3.5 text-left border rounded-[6px] transition-all flex flex-col justify-between min-h-[110px] relative ${
                isWaiting
                  ? 'bg-[#FFF2CC] border-[#B97800] ring-1 ring-[#B97800]/40'
                  : isPassed
                  ? 'bg-[#FFFDF8] border-[#00866B]/50 hover:border-[#00866B]'
                  : isRunning
                  ? 'bg-[#EAF1FA] border-[#3569A8] ring-1 ring-[#3569A8]/40 animate-pulse'
                  : 'bg-[#FAF9F5] border-[#D5D1C7] opacity-65'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#68758A] font-semibold">
                  0{idx + 1} // {stage.id.toUpperCase()}
                </span>
                {isPassed ? (
                  <span className="text-[#00866B] flex items-center gap-1 font-bold">
                    <CheckCircle2 size={11} /> PASS
                  </span>
                ) : isWaiting ? (
                  <span className="px-1.5 py-0.2 bg-[#B97800] text-white rounded-[2px] font-bold text-[8px] animate-pulse">
                    GATE HELD
                  </span>
                ) : isRunning ? (
                  <span className="text-[#3569A8] font-bold">RUNNING</span>
                ) : (
                  <span className="text-slate-400">QUEUED</span>
                )}
              </div>

              <div className="my-1.5">
                <div className="text-xs font-semibold text-[#17263A] font-sans">
                  {stage.name}
                </div>
                <div className="text-[10px] text-[#68758A] line-clamp-1 mt-0.5">
                  {stage.detail}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-[#D5D1C7]/40">
                <span className="text-[#40516A] font-medium">{stage.metricValue}</span>
                <span className="text-[#68758A]">{stage.duration}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-[#D5D1C7]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#68758A]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={13} className="text-[#B97800]" />
          <span>Stage 09: Release Gate halts automatically until dual human authorization is verified.</span>
        </div>
        <span className="font-mono text-[11px] text-[#00866B]">
          8 of 12 Stages Completed Successfully
        </span>
      </div>
    </section>
  );
}
