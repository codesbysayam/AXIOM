import React from 'react';
import {
  ArrowLeft,
  Bell,
  Command,
  Layers,
  Search,
  SlidersHorizontal,
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
    <header className="h-14 border-b border-[#dce1e7] bg-[#ffffff] px-5 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#40516a] hover:text-[#17263d] hover:bg-[#f6f5f0] rounded-[2px] border border-[#dce1e7] transition-colors"
          title="Return to the 01 AXIOM editorial index"
        >
          <ArrowLeft size={12} className="text-[#e63946]" />
          <span className="font-mono text-[11px]">01 / Editorial Index</span>
        </button>

        <div className="h-4 w-px bg-[#dce1e7]" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-base tracking-tight text-[#17263d]">
            AXIOM
          </span>
          <span className="text-[#a0aec0] text-xs">/</span>
          <span className="text-xs text-[#718096] font-mono tracking-tight">
            Autonomous Operations
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a0aec0]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workflows, agents, invariants, audit..."
            className="w-full pl-8 pr-14 py-1 text-xs bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px] focus:outline-none focus:border-[#17263d] focus:bg-white text-[#17263d] placeholder-[#a0aec0]"
          />
          <button
            type="button"
            onClick={() => openModal('command-palette')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-[#718096] bg-[#eae7df] rounded-[2px] border border-[#dce1e7]"
            title="Open command palette"
          >
            <Command size={9} />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Grouped cleanly */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-[#dce1e7] rounded-[2px] overflow-hidden bg-[#fbfaf7]">
          <button
            type="button"
            onClick={() => openModal('architecture')}
            className="px-2.5 py-1 text-xs text-[#40516a] hover:text-[#17263d] hover:bg-white border-r border-[#dce1e7] transition-colors inline-flex items-center gap-1.5"
            title="System Architecture Topology"
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Topology</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('policy-simulator')}
            className="px-2.5 py-1 text-xs text-[#40516a] hover:text-[#17263d] hover:bg-white transition-colors inline-flex items-center gap-1.5"
            title="Policy Invariant Simulator"
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Simulator</span>
          </button>
        </div>

        {/* Notifications badge */}
        {(pendingApprovalsCount > 0 || activeIncidentsCount > 0) && (
          <div className="relative">
            <button
              type="button"
              onClick={() => openModal('command-palette')}
              className="p-1.5 text-[#d99000] hover:bg-[#fef8ea] border border-[#f3d99d] rounded-[2px] transition-colors"
              title={`${pendingApprovalsCount} pending approvals, ${activeIncidentsCount} active incidents`}
              aria-label="Pending actions"
            >
              <Bell size={14} />
            </button>
          </div>
        )}

        {/* Operator Profile */}
        <button
          type="button"
          onClick={() => openModal('operator-profile')}
          className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs text-[#17263d] hover:bg-[#f6f5f0] rounded-[2px] border border-[#dce1e7] transition-colors ml-1 bg-white"
          aria-label="Operator profile"
        >
          <div className="w-4 h-4 rounded-[2px] bg-[#17263d] text-white flex items-center justify-center text-[9px] font-mono font-bold">
            OP
          </div>
          <span className="font-medium hidden sm:inline text-xs">Lead Operator</span>
        </button>
      </div>
    </header>
  );
};
