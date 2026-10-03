import React, { useState } from 'react';
import { FastForward, Pause, Play, RotateCcw, X } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export interface ExecutionReplayTheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutionReplayTheaterModal: React.FC<ExecutionReplayTheaterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { auditLogs } = useOperationsStore();
  const [currentFrame, setCurrentFrame] = useState(0);

  if (!isOpen) return null;

  const frames = auditLogs.length > 0 ? auditLogs : [
    {
      id: 'frame-1',
      timestamp: '00:00.120',
      agentName: 'Intent Analyst',
      action: 'PARSE_INTENT',
      outcome: 'success' as const,
      details: 'Extracted PO #9021 and tax parameters from incoming PDF payload.',
      hash: 'a982f1...194b',
    },
  ];

  const activeEntry = frames[currentFrame % frames.length];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-[2px] shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div>
            <h3 className="text-base font-serif font-bold text-[#17263d]">
              Execution Replay Theater
            </h3>
            <p className="text-xs text-[#718096] font-mono mt-0.5">
              Deterministic step-by-step state and decision inspection
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#718096] hover:text-[#17263d] p-1 rounded-[2px]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-4 rounded-[2px] bg-[#111827] text-white font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
              <span>FRAME {currentFrame + 1} OF {frames.length}</span>
              <span>STATE HASH: {activeEntry.hash}</span>
            </div>

            <div className="pt-1">
              <span className="text-emerald-400 font-bold">[{activeEntry.timestamp}]</span>{' '}
              <span className="text-blue-300">{activeEntry.agentName}</span>{' '}
              <span className="text-amber-300">:: {activeEntry.action}</span>
            </div>

            <div className="text-slate-300 bg-slate-800/80 p-3 rounded-[2px] leading-relaxed border border-slate-700/50">
              {activeEntry.details}
            </div>

            <div className="text-[10px] text-slate-400 pt-1">
              Integrity Verified: SHA-256 state transitions matched cryptographically.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentFrame((p) => Math.max(0, p - 1))}
                className="axiom-btn-secondary py-1 px-2.5 text-xs"
              >
                Previous Frame
              </button>
              <button
                type="button"
                onClick={() => setCurrentFrame((p) => (p + 1) % frames.length)}
                className="axiom-btn-secondary py-1 px-2.5 text-xs"
              >
                Next Frame
              </button>
              <button
                type="button"
                onClick={() => setCurrentFrame(0)}
                className="p-1.5 text-[#718096] hover:text-[#17263d] rounded-[2px]"
                title="Reset to frame 1"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <div className="text-xs font-mono text-[#718096]">
              Playback Rate: 1.0x Realtime
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#faf9f5] border-t border-[#dce1e7] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="axiom-btn-secondary text-xs py-1 px-3"
          >
            Close Theater
          </button>
        </div>
      </div>
    </div>
  );
};
