import React from 'react';
import { Award, CheckCircle2, FileCheck2, Shield, SlidersHorizontal } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export const GovernancePage: React.FC = () => {
  const { policies, openModal } = useOperationsStore();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Governance & Policy Engine
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Operational boundary rules, regulatory constraints, and human authorization mandates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal('policy-simulator')}
            className="px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-200 font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <SlidersHorizontal size={13} />
            <span>Simulate Policy Rules</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('governance-certificate')}
            className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded-md font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <Award size={13} />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {pol.scope}
                </span>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    pol.enforcement === 'strict_block'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {pol.enforcement === 'strict_block' ? 'Strict Hard Block' : 'Mandatory Human Gate'}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-2">{pol.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pol.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-emerald-700 font-medium">Policy Active & Enforced</span>
              <span>Violations Quarantined: {pol.violationCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
