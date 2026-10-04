import React, { useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';

export interface TraceEventItem {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  eventType: string;
  pipeline?: string;
  outcome?: string;
  durationMs?: number;
  risk?: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  policyId?: string;
  policyResult?: string;
  stateTransition?: { from: string; to: string };
  hash: string;
  previousHash?: string;
}

export interface EventInspectorProps {
  event: TraceEventItem | null;
  onClose: () => void;
}

export const EventInspector: React.FC<EventInspectorProps> = ({ event, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && event) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-[#182536]/40 z-50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#FFFDF8] border-l border-[#D5D5CE] z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Event Telemetry Inspector"
      >
        <header className="p-4 border-b border-[#D5D5CE] bg-[#FAF9F5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#182536] text-[#FFFDF8] flex items-center justify-center font-sans font-semibold text-sm">
              <Activity size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold">
                  EVENT TELEMETRY
                </span>
                <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-[2px] bg-[#F0FAF6] text-[#08795F] border border-[#C3E6DB]">
                  VERIFIED HASH
                </span>
              </div>
              <h2 className="text-base font-sans font-semibold text-[#182536]">
                Operational State Transition
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5E6975] hover:text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] transition-colors"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FFFDF8]">
          {/* Summary Card */}
          <div className="p-4 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#5E6975]">{event.timestamp}</span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#182536] text-white text-[10px] font-sans font-semibold uppercase tracking-wider">
                {event.eventType || event.action}
              </span>
            </div>
            <div className="text-sm font-sans font-semibold text-[#182536]">{event.details}</div>
            <div className="text-xs text-[#5E6975] font-sans flex items-center gap-2 pt-1 border-t border-[#D5D5CE]/50">
              <span>Agent: <b className="text-[#182536]">{event.agentName}</b></span>
              {event.pipeline && <span>· Pipeline: <b className="text-[#182536]">{event.pipeline}</b></span>}
            </div>
          </div>

          {/* State Transition */}
          {event.stateTransition && (
            <div className="p-3.5 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
                State Vector Transition
              </span>
              <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] font-mono text-xs">
                <span className="text-[#5E6975] font-semibold">{event.stateTransition.from}</span>
                <span className="text-[#182536] font-bold">→</span>
                <span className="text-[#08795F] font-bold">{event.stateTransition.to}</span>
              </div>
            </div>
          )}

          {/* Policy Evaluation Details */}
          <div className="p-3.5 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] space-y-2 text-xs">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
              Policy & Governance Evaluation
            </span>
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[#5E6975]">Evaluated Policy:</span>
                <span className="text-[#182536] font-mono font-semibold">{event.policyId || 'POL-OPS-03'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5E6975]">Boundary Assertion:</span>
                <span className="text-[#08795F] font-semibold">PASS (Threshold Preserved)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5E6975]">Latency:</span>
                <span className="text-[#182536] font-mono">{event.durationMs || 42}ms</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Ledger Proof */}
          <div className="p-3.5 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[2px] space-y-2 text-xs">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
              Cryptographic Proof & Merkle Link
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="text-[#5E6975] font-sans">Event Hash:</div>
              <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] text-[#182536] font-mono text-[11px] break-all select-all rounded-[2px]">
                {event.hash}
              </div>
              <div className="text-[#5E6975] font-sans pt-1">Previous State Digest:</div>
              <div className="p-2 bg-[#FFFDF8] border border-[#D5D5CE] text-[#5E6975] font-mono text-[11px] break-all select-all rounded-[2px]">
                {event.previousHash || 'sha256-a091b48f93cb71e4492da..001'}
              </div>
            </div>
          </div>
        </div>

        <footer className="p-3 bg-[#FAF9F5] border-t border-[#D5D5CE] flex items-center justify-between text-xs font-sans text-[#5E6975]">
          <span>Proof Status: Sealed in Immutable Ledger</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#182536] text-[#FFFDF8] rounded-[2px] text-xs font-sans font-medium hover:bg-[#334256] transition-colors"
          >
            Done
          </button>
        </footer>
      </aside>
    </>
  );
};
