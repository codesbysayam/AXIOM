import React from 'react';
import {
  ArrowLeft,
  Bell,
  Command,
  Maximize2,
  Menu,
  Minimize2,
  Search,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { AxiomMark } from './AxiomMark';
import { ControlSurface } from './ControlSurface';

export interface HeaderProps {
  onBackToIndex: () => void;
  missionControl?: boolean;
  onToggleMissionControl?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBackToIndex,
  missionControl = false,
  onToggleMissionControl,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    openModal,
    approvals,
    incidents,
    setMobileNavOpen,
  } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;

  return (
    <header className="h-[68px] border-b border-[#D5D5CE] bg-[#FFFDF8] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Context */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Navigation Toggle Button (Point 14) */}
        <button
          type="button"
          onClick={() => setMobileNavOpen((o) => !o)}
          className="lg:hidden p-1.5 text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] border border-[#D5D5CE]"
          aria-label="Toggle navigation drawer"
          title="Toggle Navigation Menu"
        >
          <Menu size={16} />
        </button>

        <button
          type="button"
          onClick={onBackToIndex}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#334256] hover:text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] border border-[#D5D5CE] transition-colors"
          title="Return to the 01 AXIOM editorial index"
        >
          <ArrowLeft size={12} className="text-[#D72F40]" />
          <span className="font-mono text-[11px]">01 / Editorial Index</span>
        </button>

        <div className="hidden sm:block h-5 w-px bg-[#D5D5CE]" aria-hidden="true" />

        <div className="axiom-brand flex items-center gap-2.5">
          <AxiomMark size={26} />
          <div>
            <span className="font-serif font-bold text-base tracking-tight text-[#182536] leading-none block">
              AXIOM
            </span>
            <span className="text-[8px] text-[#5E6975] font-mono uppercase tracking-wider block mt-0.5">
              Autonomous Operations
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5E6975]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workflows, agents, audit..."
            className="w-full pl-8 pr-12 py-1 text-xs bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] focus:outline-none focus:border-[#182536] text-[#182536] placeholder-[#5E6975]"
          />
          <button
            type="button"
            onClick={() => openModal('command-palette')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-[#5E6975] bg-[#EFEFEB] rounded-[2px] border border-[#D5D5CE]"
            title="Open command palette (Ctrl+K)"
          >
            <Command size={9} />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Unified Control Surface + Mission Control + Operator */}
      <div className="flex items-center gap-3">
        {/* Unified Control Surface */}
        <div className="hidden sm:block">
          <ControlSurface />
        </div>

        {/* Mission Control Mode Button */}
        {onToggleMissionControl && (
          <button
            type="button"
            onClick={onToggleMissionControl}
            className={`px-2.5 py-1 text-xs font-mono inline-flex items-center gap-1.5 rounded-[2px] border transition-colors ${
              missionControl
                ? 'bg-[#182536] text-[#FFFDF8] border-[#182536]'
                : 'bg-[#FFFDF8] text-[#334256] border-[#D5D5CE] hover:bg-[#FFF8DF] hover:border-[#B9B39E]'
            }`}
            title="Toggle wide Mission Control visualization layout"
            aria-pressed={missionControl}
          >
            {missionControl ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span className="hidden xl:inline">{missionControl ? 'Exit Mission Control' : 'Mission Control'}</span>
          </button>
        )}

        {/* Notifications badge */}
        {(pendingApprovalsCount > 0 || activeIncidentsCount > 0) && (
          <button
            type="button"
            onClick={() => openModal('command-palette')}
            className="p-1.5 text-[#9A6900] hover:bg-[#FFF8DF] border border-[#E1BF70] bg-[#FFF8DF] rounded-[2px] transition-colors relative"
            title={`${pendingApprovalsCount} pending approvals, ${activeIncidentsCount} active incidents`}
            aria-label="Pending actions"
          >
            <Bell size={14} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D72F40]" />
          </button>
        )}

        {/* Operator Profile */}
        <button
          type="button"
          onClick={() => openModal('operator-profile')}
          className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] border border-[#D5D5CE] transition-colors bg-[#FFFDF8]"
          aria-label="Operator profile"
        >
          <div className="w-5 h-5 rounded-[2px] bg-[#182536] text-white flex items-center justify-center text-[9px] font-mono font-bold">
            OP
          </div>
          <span className="font-medium hidden sm:inline text-xs">Lead Operator</span>
        </button>
      </div>
    </header>
  );
};
