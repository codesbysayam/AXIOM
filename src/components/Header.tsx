import React from 'react';
import {
  ArrowLeft,
  Bell,
  Command,
  FileCheck2,
  Layers,
  Search,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';

export interface HeaderProps {
  onBackToIndex: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToIndex }) => {
  const {
    searchTerm,
    setSearchTerm,
    openModal,
    approvals,
    incidents,
  } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur px-5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
          title="Return to the 01 Agentic AI editorial index"
        >
          <ArrowLeft size={13} />
          <span>Editorial Index</span>
        </button>

        <div className="h-4 w-px bg-slate-200" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#1b2e49]">
            AGENTIC AI
          </span>
          <span className="text-slate-400 text-xs">/</span>
          <span className="text-xs text-slate-600 font-medium">
            Autonomous Operations Console
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-64 md:w-80">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workflows, agents, audit..."
            className="w-full pl-8 pr-16 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-slate-800 placeholder-slate-400"
          />
          <button
            type="button"
            onClick={() => openModal('command-palette')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200/60 rounded"
            title="Open command palette"
          >
            <Command size={10} />
            <span>K</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => openModal('architecture')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="System Architecture Diagram"
          aria-label="View architecture"
        >
          <Layers size={16} />
        </button>

        <button
          type="button"
          onClick={() => openModal('policy-simulator')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="Policy Rule Simulator"
          aria-label="Open policy simulator"
        >
          <SlidersHorizontal size={16} />
        </button>

        <button
          type="button"
          onClick={() => openModal('governance-certificate')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="Governance Invariant Certificate"
          aria-label="View governance certificate"
        >
          <FileCheck2 size={16} />
        </button>

        {(pendingApprovalsCount > 0 || activeIncidentsCount > 0) && (
          <div className="relative">
            <button
              type="button"
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors relative"
              title={`${pendingApprovalsCount} pending approvals, ${activeIncidentsCount} active incidents`}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => openModal('operator-profile')}
          className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
          aria-label="Operator profile"
        >
          <div className="w-5 h-5 rounded-full bg-[#1b2e49] text-white flex items-center justify-center text-[10px] font-mono">
            OP
          </div>
          <span className="font-medium hidden sm:inline">Lead Operator</span>
        </button>
      </div>
    </header>
  );
};
