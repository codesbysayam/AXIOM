import React from 'react';
import { PlayCircle, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const GuidedDemoTourBanner: React.FC = () => {
  const { navigateTo, openModal } = useOperationsStore();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#1b2e49] text-white p-3.5 rounded-lg mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-white/10 text-white mt-0.5">
          <Sparkles size={16} />
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-wide">
            Interactive Agentic AI Demonstration Available
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Experience simulated high-risk invoice gating, autonomous patch remediation, and invariant breach containment in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          type="button"
          onClick={() => navigateTo('demo-scenarios')}
          className="px-3 py-1.5 text-xs font-medium text-[#1b2e49] bg-white hover:bg-slate-100 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <PlayCircle size={13} />
          <span>Launch Demo Scenarios</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
