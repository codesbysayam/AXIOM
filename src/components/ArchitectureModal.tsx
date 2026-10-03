import React from 'react';
import { ArrowDown, CheckCircle2, Shield, UserCheck, X } from 'lucide-react';

export interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const LAYERS = [
    {
      num: '01',
      title: 'Editorial Entry & Ingestion Interface',
      desc: 'Editorial category showcase mapping organizational intents to agent capabilities.',
    },
    {
      num: '02',
      title: 'Semantic Parsing & Working Memory',
      desc: 'Intent Analyst and Context Memory Agent structure input payloads and retrieve state.',
    },
    {
      num: '03',
      title: 'Multi-Agent Collaboration Fabric',
      desc: 'Workflow Planner delegates sub-tasks across Task Executor and Validation Tester.',
    },
    {
      num: '04',
      title: 'Deterministic Policy & Invariant Engine',
      desc: 'Release Guardian tests execution limits, financial thresholds, and security bounds.',
    },
    {
      num: '05',
      title: 'Human-in-the-Loop Operator Gate',
      desc: 'Mandatory suspension for high-risk actions pending explicit operator sign-off.',
    },
    {
      num: '06',
      title: 'Atomic Dispatch & Rollback Engine',
      desc: 'Safe external execution with idempotency tokens and automated recovery defaults.',
    },
    {
      num: '07',
      title: 'Immutable Cryptographic Audit Trail',
      desc: 'SHA-256 serialized logs preserving complete provenance of all machine decisions.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-xs shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div>
            <h3 className="text-base font-serif font-bold text-[#17263d]">
              AXIOM System Architecture
            </h3>
            <p className="text-xs text-[#718096] font-mono mt-0.5">
              Autonomous intelligence, under human control.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#718096] hover:text-[#17263d] p-1 rounded-xs"
            aria-label="Close architecture modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-2">
          {LAYERS.map((layer, idx) => (
            <div key={layer.num}>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-colors flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#ef2636] px-2 py-0.5 bg-red-50 rounded border border-red-100">
                  {layer.num}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900">{layer.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{layer.desc}</div>
                </div>
              </div>

              {idx < LAYERS.length - 1 && (
                <div className="flex justify-center my-1 text-slate-300">
                  <ArrowDown size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Invariants guaranteed: Zero unreviewed high-risk executions</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
