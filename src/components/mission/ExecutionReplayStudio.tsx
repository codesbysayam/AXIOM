import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FastForward,
  FileCheck,
  Fingerprint,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Terminal,
  Zap,
} from 'lucide-react';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export interface ReplayMilestone {
  stepIndex: number;
  timestampOffset: string;
  durationMs: number;
  stageName: string;
  agentName: string;
  nodeId: string;
  operation: string;
  status: 'completed' | 'running' | 'waiting_approval' | 'failed';
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
  policyEvaluated?: {
    code: string;
    threshold: string;
    observed: string;
    decision: 'ALLOW' | 'HUMAN_GATE' | 'WARN';
    riskScore: number;
  };
  auditProof: {
    hash: string;
    idempotencyKey: string;
    signature: string;
  };
}

export const REPLAY_STEPS: ReplayMilestone[] = [
  {
    stepIndex: 0,
    timestampOffset: '00:00.000',
    durationMs: 24,
    stageName: 'INGEST',
    agentName: 'Event Ingest Gateway',
    nodeId: 'event-ingest',
    operation: 'RECEIVE_TRANSACTION_PAYLOAD',
    status: 'completed',
    inputPayload: {
      source: 'NetSuite ERP Webhook',
      type: 'VENDOR_DISBURSEMENT_REQ',
      payload: { poNumber: 'PO-88219', vendor: 'Northwind Global Corp', amount: 18420.0 },
    },
    outputPayload: {
      verified: true,
      envelopeId: 'ENV-93821-X',
      correlationId: 'CORR-4491-09',
    },
    auditProof: {
      hash: '0x1a8f92b4c810de02',
      idempotencyKey: 'IDP-ING-93821',
      signature: 'SIG_ED25519_INGEST_OK',
    },
  },
  {
    stepIndex: 1,
    timestampOffset: '00:00.120',
    durationMs: 68,
    stageName: 'CONTEXT',
    agentName: 'Context Memory Agent',
    nodeId: 'context-memory',
    operation: 'INDEX_TEMPORAL_GRAPH',
    status: 'completed',
    inputPayload: {
      vendorId: 'VEND-NORTHWIND-01',
      lookbackDays: 90,
    },
    outputPayload: {
      vendorHistoryScore: 98.4,
      priorDisbursementsCount: 14,
      totalVolumeYTD: 142800.0,
      activeDisputes: 0,
    },
    auditProof: {
      hash: '0x2b918f03c948ef11',
      idempotencyKey: 'IDP-CTX-93821',
      signature: 'SIG_AES256_STATE_INDEX',
    },
  },
  {
    stepIndex: 2,
    timestampOffset: '00:00.340',
    durationMs: 94,
    stageName: 'INTENT',
    agentName: 'Intent Analyst',
    nodeId: 'intent-analyst',
    operation: 'SEMANTIC_DISAMBIGUATION',
    status: 'completed',
    inputPayload: {
      rawDirective: 'Disburse scheduled vendor invoice payment against matched PO-88219',
    },
    outputPayload: {
      intentClass: 'FINANCIAL_DISBURSEMENT',
      confidence: 0.994,
      requiresDualSignOff: true,
    },
    auditProof: {
      hash: '0x3c0291e4f857ab22',
      idempotencyKey: 'IDP-INT-93821',
      signature: 'SIG_INTENT_CONF_994',
    },
  },
  {
    stepIndex: 3,
    timestampOffset: '00:00.620',
    durationMs: 38,
    stageName: 'POLICY',
    agentName: 'Policy Engine',
    nodeId: 'policy-engine',
    operation: 'EVALUATE_BOUNDARY_INVARIANTS',
    status: 'completed',
    inputPayload: {
      disbursementAmount: 18420.0,
      policySet: ['FIN-042', 'SEC-009'],
    },
    outputPayload: {
      policyResult: 'HUMAN_GATE_TRIGGERED',
      reasons: ['Amount ($18,420.00) exceeds autonomous boundary of $10,000.00'],
    },
    policyEvaluated: {
      code: 'FIN-042',
      threshold: '$10,000.00',
      observed: '$18,420.00',
      decision: 'HUMAN_GATE',
      riskScore: 0.81,
    },
    auditProof: {
      hash: '0x4d13a2f5a968bc33',
      idempotencyKey: 'IDP-POL-FIN042',
      signature: 'SIG_POLICY_HALT_GATE',
    },
  },
  {
    stepIndex: 4,
    timestampOffset: '00:01.200',
    durationMs: 580,
    stageName: 'HUMAN GATE',
    agentName: 'Human Authority Gate',
    nodeId: 'human-gate',
    operation: 'OPERATOR_DUAL_KEY_SIGN',
    status: 'completed',
    inputPayload: {
      approvalId: 'req-93821-dual',
      requestedBy: 'System Autonomous Orchestrator',
      amount: 18420.0,
    },
    outputPayload: {
      operator: 'Chief Risk Officer (CRO)',
      decision: 'APPROVED',
      auditNote: 'PO matched ERP packing slip 100%. Authorized.',
    },
    auditProof: {
      hash: '0x5e24b3a6ba79cd44',
      idempotencyKey: 'IDP-HUMAN-AUTH-93821',
      signature: 'SIG_ECDSA_OPERATOR_PASS',
    },
  },
  {
    stepIndex: 5,
    timestampOffset: '00:02.100',
    durationMs: 165,
    stageName: 'EXECUTE',
    agentName: 'Task Executor',
    nodeId: 'task-executor',
    operation: 'ATOMIC_API_INVOCATION',
    status: 'completed',
    inputPayload: {
      targetAPI: 'NetSuite REST Banking Gateway',
      method: 'POST /v1/payments/disburse',
      payload: { po: 'PO-88219', vendorId: 'VEND-NORTHWIND-01', amount: 18420.0 },
    },
    outputPayload: {
      bankTransactionId: 'TX-ACH-8849201',
      settlementEpoch: '2026-10-04T12:04:22Z',
      rollbackToken: 'RB-93821-RESTORE-VOUCHER',
    },
    auditProof: {
      hash: '0x6f35c4b7cb80de55',
      idempotencyKey: 'IDP-EXEC-TXACH8849201',
      signature: 'SIG_REST_BANK_CONFIRM',
    },
  },
  {
    stepIndex: 6,
    timestampOffset: '00:02.340',
    durationMs: 184,
    stageName: 'VERIFY',
    agentName: 'Quality Reviewer',
    nodeId: 'quality-reviewer',
    operation: 'POST_EXECUTION_GROUNDING_PASS',
    status: 'completed',
    inputPayload: {
      bankReceipt: 'TX-ACH-8849201',
      expectedState: 'SETTLED',
    },
    outputPayload: {
      groundingScore: 1.0,
      invariantsPreserved: true,
      delta: '0.00 variance',
    },
    auditProof: {
      hash: '0x7a46d5c8dc91ef66',
      idempotencyKey: 'IDP-QA-93821',
      signature: 'SIG_GROUNDING_100',
    },
  },
  {
    stepIndex: 7,
    timestampOffset: '00:02.420',
    durationMs: 16,
    stageName: 'AUDIT',
    agentName: 'Immutable Audit Ledger',
    nodeId: 'audit-ledger',
    operation: 'COMMIT_MERKLE_ROOT',
    status: 'completed',
    inputPayload: {
      blockHeight: 9182,
      runId: 'AX-93821',
    },
    outputPayload: {
      merkleRoot: '0x9928f01a33b2e7c4d9',
      immutableBlockCommitted: true,
    },
    auditProof: {
      hash: '0x8b57e6d9ed02fa77',
      idempotencyKey: 'IDP-MERKLE-ROOT-9182',
      signature: 'SIG_SHA256_SEALED',
    },
  },
];

export const ExecutionReplayStudio: React.FC = () => {
  const {
    isReplaying,
    startReplay,
    pauseReplay,
    restartReplay,
    stepReplayForward,
    stepReplayBackward,
    replayIndex,
    setReplayIndex,
    replaySpeed,
    setReplaySpeed,
    setActiveNode,
  } = useAxiomEventBus();

  const currentStep = REPLAY_STEPS[replayIndex] || REPLAY_STEPS[0];

  // Sync active node in topology map
  useEffect(() => {
    setActiveNode(currentStep.nodeId);
  }, [replayIndex, currentStep.nodeId, setActiveNode]);

  // Handle automatic timer playback
  useEffect(() => {
    if (!isReplaying) return;
    const interval = setInterval(() => {
      if (replayIndex < REPLAY_STEPS.length - 1) {
        setReplayIndex(replayIndex + 1);
      } else {
        pauseReplay();
      }
    }, 1800 / replaySpeed);

    return () => clearInterval(interval);
  }, [isReplaying, replayIndex, replaySpeed, setReplayIndex, pauseReplay]);

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3569A8] animate-pulse" />
          <div>
            <span className="eyebrow block">Deterministic Flight Recorder</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Execution Replay Studio — Run #AX-93821
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#5E6975]">Time:</span>
          <span className="px-2 py-0.5 bg-white border border-[#D5D5CE] rounded-[2px] font-semibold text-[#182536]">
            {currentStep.timestampOffset}
          </span>
          <span className="text-[#5E6975] ml-2">Latency:</span>
          <span className="font-semibold text-[#08795F]">{currentStep.durationMs}ms</span>
        </div>
      </div>

      {/* Visual Flight Timeline Pipeline Track */}
      <div className="p-4 border-b border-[#E5E3DB] bg-[#FAF9F5]">
        <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto py-3">
          {/* Background Connecting Rail */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#D5D5CE] -translate-y-1/2 z-0" />
          {/* Active Progress Rail */}
          <div
            className="absolute top-1/2 left-4 h-0.5 bg-[#08795F] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${(replayIndex / (REPLAY_STEPS.length - 1)) * 95}%`,
            }}
          />

          {/* Timeline Nodes */}
          {REPLAY_STEPS.map((step, idx) => {
            const isPassed = idx < replayIndex;
            const isCurrent = idx === replayIndex;
            return (
              <button
                key={step.stepIndex}
                type="button"
                onClick={() => setReplayIndex(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-[#182536] text-white border-[#182536] ring-4 ring-[#182536]/10 scale-110 shadow-sm'
                      : isPassed
                      ? 'bg-[#08795F] text-white border-[#08795F]'
                      : 'bg-white text-[#5E6975] border-[#D5D5CE] group-hover:border-[#182536]'
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-mono mt-2 tracking-tight ${
                    isCurrent ? 'font-bold text-[#182536]' : 'text-[#5E6975]'
                  }`}
                >
                  {step.stageName}
                </span>
                <span className="text-[8px] font-mono text-[#8898AA]">
                  {step.timestampOffset.split('.')[1]}ms
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrub Controls & Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={restartReplay}
            className="p-1.5 bg-white border border-[#D5D5CE] hover:bg-[#F0EEE6] rounded-[3px] text-[#40516A]"
            title="Restart Replay"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={stepReplayBackward}
            disabled={replayIndex === 0}
            className="p-1.5 bg-white border border-[#D5D5CE] hover:bg-[#F0EEE6] disabled:opacity-40 rounded-[3px] text-[#40516A]"
            title="Step Backward"
          >
            <ArrowLeft size={13} />
          </button>
          <button
            type="button"
            onClick={isReplaying ? pauseReplay : startReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#182536] hover:bg-[#25354b] text-white text-xs font-semibold rounded-[3px] transition-colors"
          >
            {isReplaying ? (
              <>
                <Pause size={12} /> <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={12} /> <span>Play Flight Replay</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={stepReplayForward}
            disabled={replayIndex === REPLAY_STEPS.length - 1}
            className="p-1.5 bg-white border border-[#D5D5CE] hover:bg-[#F0EEE6] disabled:opacity-40 rounded-[3px] text-[#40516A]"
            title="Step Forward"
          >
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Speed Controls (0.5x, 1x, 2x, 4x) */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-[#5E6975] mr-1">Speed:</span>
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setReplaySpeed(spd)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] border transition-colors ${
                replaySpeed === spd
                  ? 'bg-[#182536] text-white border-[#182536]'
                  : 'bg-white text-[#40516A] border-[#D5D5CE] hover:bg-[#F0EEE6]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Flight Record Inspector (Input, Output, Policy, Proof) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E5E3DB] bg-[#FFFDF8]">
        {/* Col 1: Operational Directive & Inputs */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Input Payload & Directive</span>
            <span className="text-[10px] font-mono text-[#5E6975]">{currentStep.agentName}</span>
          </div>
          <div className="rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB] p-3 text-xs font-mono">
            <div className="text-[#3569A8] font-semibold mb-1">
              OP: {currentStep.operation}
            </div>
            <pre className="text-[11px] text-[#182536] overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(currentStep.inputPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Col 2: Policy & Invariant Evaluation */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Policy Evaluation</span>
            {currentStep.policyEvaluated ? (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[2px] bg-[#FEF3D6] text-[#8A5900]">
                {currentStep.policyEvaluated.decision}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#08795F]">INVARIANTS PASS</span>
            )}
          </div>
          <div className="rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB] p-3 text-xs font-mono space-y-2">
            {currentStep.policyEvaluated ? (
              <>
                <div className="flex justify-between">
                  <span className="text-[#5E6975]">Policy Code:</span>
                  <span className="font-semibold text-[#182536]">{currentStep.policyEvaluated.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E6975]">Threshold:</span>
                  <span className="text-[#182536]">{currentStep.policyEvaluated.threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E6975]">Observed:</span>
                  <span className="font-semibold text-[#8A5900]">{currentStep.policyEvaluated.observed}</span>
                </div>
                <div className="flex justify-between border-t border-[#E5E3DB] pt-1 mt-1">
                  <span className="text-[#5E6975]">Risk Vector:</span>
                  <span className="font-semibold text-[#D72F40]">
                    {currentStep.policyEvaluated.riskScore.toFixed(2)} / 1.00
                  </span>
                </div>
              </>
            ) : (
              <div className="py-2 text-[#08795F]">
                ✓ Zero invariant deviation. All pre-conditions mathematically certified.
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Output State & Cryptographic Audit Proof */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Output & State Proof</span>
            <span className="text-[10px] font-mono text-[#08795F] font-semibold">VERIFIED</span>
          </div>
          <div className="rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB] p-3 text-xs font-mono space-y-2">
            <div>
              <span className="text-[#5E6975] block text-[10px]">State Hash:</span>
              <span className="font-semibold text-[#182536]">{currentStep.auditProof.hash}</span>
            </div>
            <div>
              <span className="text-[#5E6975] block text-[10px]">Idempotency Key:</span>
              <span className="text-[#182536]">{currentStep.auditProof.idempotencyKey}</span>
            </div>
            <div>
              <span className="text-[#5E6975] block text-[10px]">Cryptographic Seal:</span>
              <span className="text-[#08795F] truncate block">{currentStep.auditProof.signature}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
