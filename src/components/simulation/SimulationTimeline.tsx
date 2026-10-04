import React from 'react';
import { Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  name: string;
  agent: string;
  status: 'completed' | 'active' | 'pending';
  detail: string;
  hash?: string;
}

export interface SimulationTimelineProps {
  activeStageIndex?: number;
  onSelectEvent?: (event: TimelineEvent) => void;
  className?: string;
}

export function SimulationTimeline({
  activeStageIndex = 4,
  onSelectEvent,
  className = '',
}: SimulationTimelineProps) {
  const events: TimelineEvent[] = [
    {
      id: 'evt-ingest',
      timeLabel: '00ms',
      name: 'PAYLOAD_INGEST',
      agent: 'Ingest Router',
      status: activeStageIndex >= 0 ? 'completed' : 'pending',
      detail: 'Inbound JSON schema validation pass',
      hash: 'sha256-a1..',
    },
    {
      id: 'evt-context',
      timeLabel: '120ms',
      name: 'CONTEXT_RETRIEVAL',
      agent: 'Context Memory',
      status: activeStageIndex >= 1 ? 'completed' : activeStageIndex === 0 ? 'active' : 'pending',
      detail: 'Retrieved 14 session history vectors in 88ms',
      hash: 'sha256-b2..',
    },
    {
      id: 'evt-intent',
      timeLabel: '240ms',
      name: 'INTENT_CLASSIFICATION',
      agent: 'Intent Analyst',
      status: activeStageIndex >= 2 ? 'completed' : activeStageIndex === 1 ? 'active' : 'pending',
      detail: 'Parsed disbursement parameters with 99.4% confidence',
      hash: 'sha256-c3..',
    },
    {
      id: 'evt-policy',
      timeLabel: '420ms',
      name: 'POLICY_EVALUATION',
      agent: 'Policy Boundary Engine',
      status: activeStageIndex >= 3 ? 'completed' : activeStageIndex === 2 ? 'active' : 'pending',
      detail: 'POL-FIN-01 boundary exceeded; fail-closed trigger',
      hash: 'sha256-d4..',
    },
    {
      id: 'evt-gate',
      timeLabel: '620ms',
      name: 'HUMAN_GATE',
      agent: 'Release Guardian',
      status: activeStageIndex >= 4 ? 'completed' : activeStageIndex === 3 ? 'active' : 'pending',
      detail: 'Execution halted; awaiting CFO operator authorization',
      hash: 'sha256-e5..',
    },
    {
      id: 'evt-exec',
      timeLabel: '880ms',
      name: 'EXECUTION',
      agent: 'Task Executor',
      status: activeStageIndex >= 5 ? 'completed' : activeStageIndex === 4 ? 'active' : 'pending',
      detail: 'Atomic wire disbursement dispatched with idempotency token',
      hash: 'sha256-f6..',
    },
    {
      id: 'evt-audit',
      timeLabel: '1050ms',
      name: 'AUDIT_COMMIT',
      agent: 'Immutable Ledger',
      status: activeStageIndex >= 6 ? 'completed' : activeStageIndex === 5 ? 'active' : 'pending',
      detail: 'Signed Merkle proof committed to ledger',
      hash: 'sha256-72f..',
    },
  ];

  return (
    <div className={`p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#D5D1C7]/70 text-xs font-mono text-[#68758A]">
        <span className="flex items-center gap-1.5 text-[#17263A] font-bold">
          <Clock size={13} className="text-[#00866B]" />
          <span>MICROSECOND STATE EXECUTION TIMELINE</span>
        </span>
        <span>SHA-256 MERKLE ROOT: VERIFIED</span>
      </div>

      <div className="pt-4 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between relative py-2">
          {/* Connecting Line */}
          <div className="absolute top-5 left-4 right-4 h-[2px] bg-[#D5D1C7] -z-0" />

          {events.map((evt, idx) => {
            const isCompleted = evt.status === 'completed';
            const isActive = evt.status === 'active';
            const isHuman = evt.name === 'HUMAN_GATE';

            return (
              <button
                key={evt.id}
                type="button"
                onClick={() => onSelectEvent?.(evt)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Node Marker */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isHuman && (isActive || isCompleted)
                      ? 'bg-[#FFF2CC] border-[#B97800] text-[#B97800]'
                      : isCompleted
                      ? 'bg-[#00866B] border-[#00866B] text-white'
                      : isActive
                      ? 'bg-[#142238] border-[#142238] text-white ring-2 ring-[#3569A8]/40 animate-pulse'
                      : 'bg-[#FFFDF8] border-[#D5D1C7] text-[#68758A]'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                {/* Time Stamp */}
                <span className="text-[10px] font-mono text-[#68758A] mt-1 font-semibold">
                  {evt.timeLabel}
                </span>

                {/* Event Name */}
                <span className="text-[10px] font-mono font-bold text-[#17263A] mt-0.5 whitespace-nowrap">
                  {evt.name}
                </span>

                {/* Agent */}
                <span className="text-[9px] text-[#40516A] whitespace-nowrap">
                  {evt.agent}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
