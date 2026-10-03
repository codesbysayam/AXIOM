import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, UserCheck } from 'lucide-react';

export const DecisionFabricVisualizer: React.FC = () => {
  const NODES = [
    { label: 'Event Ingestion', desc: 'Webhook / Payload', type: 'source' },
    { label: 'Intent Analysis', desc: 'Classification', type: 'agent' },
    { label: 'Policy Verification', desc: 'Boundary Rules', type: 'policy' },
    { label: 'Human Approval Gate', desc: 'Threshold Review', type: 'gate' },
    { label: 'Atomic Execution', desc: 'Dispatched API', type: 'execution' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          Decision Fabric Pipeline
        </h3>
        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Invariants Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
        {NODES.map((node, idx) => (
          <React.Fragment key={node.label}>
            <div className="p-2.5 rounded border bg-slate-50/70 border-slate-200 text-center relative group hover:bg-white hover:border-slate-300 transition-colors">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                Layer 0{idx + 1}
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">{node.label}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{node.desc}</div>

              {node.type === 'gate' && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                  <UserCheck size={10} />
                  <span>Human Gate</span>
                </div>
              )}
            </div>

            {idx < NODES.length - 1 && (
              <div className="hidden sm:flex justify-center text-slate-300">
                <ArrowRight size={14} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
