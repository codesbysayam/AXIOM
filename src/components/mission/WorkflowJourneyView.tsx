import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck,
  Fingerprint,
  Shield,
  ShieldCheck,
  UserCheck,
  Workflow,
  Zap,
} from 'lucide-react';

export interface JourneyStage {
  id: string;
  code: string;
  name: string;
  agent: string;
  status: 'completed' | 'running' | 'waiting' | 'pending';
  durationMs: number;
  inputDescription: string;
  outputDescription: string;
  invariantChecked: string;
  evidenceHash: string;
}

export const DEFAULT_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'stage-1',
    code: 'EVENT',
    name: 'Event Ingestion & Schema Gate',
    agent: 'Event Ingest Gateway',
    status: 'completed',
    durationMs: 24,
    inputDescription: 'Inbound HTTPS ERP Webhook with PO-88219 voucher payload',
    outputDescription: 'Cryptographically signed ingestion envelope ENV-93821',
    invariantChecked: 'Rate limit <= 1,000 req/min; Valid TLS 1.3 dual cert',
    evidenceHash: '0x1a8f92b4c810de02',
  },
  {
    id: 'stage-2',
    code: 'UNDERSTAND',
    name: 'Context Memory & Intent Classification',
    agent: 'Intent Analyst & Context Memory',
    status: 'completed',
    durationMs: 162,
    inputDescription: 'Historical 90-day ledger indexing for Northwind Global Corp',
    outputDescription: 'Disbursement classified with 99.4% confidence score',
    invariantChecked: 'Zero memory leak across tenant session boundaries',
    evidenceHash: '0x2b918f03c948ef11',
  },
  {
    id: 'stage-3',
    code: 'VALIDATE',
    name: 'Mathematical Invariant Pre-Condition Check',
    agent: 'Invariant Engine',
    status: 'completed',
    durationMs: 45,
    inputDescription: 'Formal pre-condition equations for asset balance conservation',
    outputDescription: 'Proof certified: Delta sum equals zero across all ledger accounts',
    invariantChecked: 'Conservation of funds: Total Debit == Total Credit',
    evidenceHash: '0x3c0291e4f857ab22',
  },
  {
    id: 'stage-4',
    code: 'GOVERN',
    name: 'Policy Engine Boundary Enforcement',
    agent: 'Policy Engine',
    status: 'completed',
    durationMs: 38,
    inputDescription: 'Disbursement amount ($18,420) vs Policy FIN-042 threshold ($10k)',
    outputDescription: 'Rule triggered: Divert execution to Human Authority Gate',
    invariantChecked: 'Hard limit: Outlay > $10,000 must halt for human review',
    evidenceHash: '0x4d13a2f5a968bc33',
  },
  {
    id: 'stage-5',
    code: 'HUMAN CONTROL',
    name: 'Dual-Key Operator Authorization',
    agent: 'Human Authority Gate',
    status: 'completed',
    durationMs: 1240,
    inputDescription: 'Operator sign-off modal with matched PO and packing voucher',
    outputDescription: 'Signature committed by Chief Risk Officer (CRO)',
    invariantChecked: 'Human dual-key authorization mandatory for Tier-3 actions',
    evidenceHash: '0x5e24b3a6ba79cd44',
  },
  {
    id: 'stage-6',
    code: 'EXECUTE',
    name: 'Atomic API Execution & State Update',
    agent: 'Task Executor',
    status: 'completed',
    durationMs: 165,
    inputDescription: 'REST Banking API dispatch with idempotency token IDP-93821',
    outputDescription: 'ACH transaction TX-ACH-8849201 settled in NetSuite ERP',
    invariantChecked: 'Idempotency token mandatory on external write requests',
    evidenceHash: '0x6f35c4b7cb80de55',
  },
  {
    id: 'stage-7',
    code: 'VERIFY',
    name: 'Post-Execution Grounding & Audit Merkle Root',
    agent: 'Quality Reviewer & Audit Ledger',
    status: 'completed',
    durationMs: 32,
    inputDescription: 'ERP settlement confirmation & state proof receipt',
    outputDescription: 'Block #9182 committed to SHA-256 tamper-evident ledger',
    invariantChecked: 'Immutable audit entry signed with cryptographic checksum',
    evidenceHash: '0x8b57e6d9ed02fa77',
  },
];

export const WorkflowJourneyView: React.FC<{ stages?: JourneyStage[] }> = ({
  stages = DEFAULT_JOURNEY_STAGES,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[3].id);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Workflow size={15} className="text-[#08795F]" />
          <div>
            <span className="eyebrow block">Operational Lifecycle Journey</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Mission Pipeline Journey — Vendor Procurement #AX-93821
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#08795F] font-semibold">
          ● 7 of 7 Stages Verified
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Horizontal Journey Pipeline Track */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-[#E5E3DB]">
          {stages.map((st, idx) => {
            const isSelected = st.id === selectedStageId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStageId(st.id)}
                className={`flex-1 min-w-[110px] p-2.5 text-left rounded-[4px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#182536] text-white border-[#182536] shadow-xs'
                    : 'bg-[#FAF9F5] text-[#182536] border-[#D5D5CE] hover:bg-[#F0EEE6]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[9px] font-mono font-bold ${
                      isSelected ? 'text-[#C3E6DB]' : 'text-[#5E6975]'
                    }`}
                  >
                    0{idx + 1}. {st.code}
                  </span>
                  <CheckCircle2
                    size={11}
                    className={isSelected ? 'text-[#08795F]' : 'text-[#08795F]'}
                  />
                </div>
                <div className="text-xs font-sans font-semibold truncate leading-tight">
                  {st.name.split('&')[0]}
                </div>
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    isSelected ? 'text-slate-300' : 'text-[#8898AA]'
                  }`}
                >
                  {st.durationMs}ms
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep Inspector */}
        <div className="p-4 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E3DB] pb-2.5">
            <div>
              <span className="eyebrow">Stage Execution Analysis</span>
              <h4 className="text-base font-serif font-semibold text-[#182536]">
                {selectedStage.name}
              </h4>
            </div>
            <div className="text-xs font-mono text-[#5E6975]">
              Assigned Agent: <span className="font-semibold text-[#182536]">{selectedStage.agent}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-white border border-[#E5E3DB] rounded-[3px] space-y-1">
              <span className="text-[10px] uppercase text-[#5E6975] block">Input Parameter Envelope</span>
              <p className="text-[#182536] leading-relaxed">{selectedStage.inputDescription}</p>
            </div>

            <div className="p-3 bg-white border border-[#E5E3DB] rounded-[3px] space-y-1">
              <span className="text-[10px] uppercase text-[#08795F] block">Deterministic Output Result</span>
              <p className="text-[#182536] leading-relaxed">{selectedStage.outputDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-[#5E6975]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#08795F]" />
              <span>
                <b>Invariant Enforced:</b> {selectedStage.invariantChecked}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Fingerprint size={13} className="text-[#3569A8]" />
              <span>Merkle Proof: {selectedStage.evidenceHash}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
