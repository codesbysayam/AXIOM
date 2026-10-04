import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConsoleView, useOperationsStore } from '../orchestrator/store';
import { AxiomMark } from './AxiomMark';
import { SidebarExecution } from './SidebarExecution';

export interface SidebarProps {
  onBackToIndex: () => void;
  activeExecution?: {
    name: string;
    current: number;
    total: number;
    stage: string;
  } | null;
}

interface NavItem {
  id: ConsoleView;
  label: string;
  badge?: number;
  badgeType?: 'amber' | 'rose';
}

interface NavSection {
  code: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onBackToIndex, activeExecution }) => {
  const { currentView, navigateTo, approvals, incidents, setMobileNavOpen } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;

  const SECTIONS: NavSection[] = [
    {
      code: '01',
      title: 'ARCHITECTURE',
      items: [
        { id: 'dashboard', label: 'Command Center' },
        { id: 'workflows', label: 'Orchestration' },
        { id: 'agents', label: 'Agent Workforce' },
        { id: 'skills', label: 'Domain Skills' },
      ],
    },
    {
      code: '02',
      title: 'CONTROL GATES',
      items: [
        {
          id: 'approvals',
          label: 'Human Approvals',
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeType: 'amber',
        },
        { id: 'cases', label: 'Operational Cases' },
        { id: 'activity', label: 'Live Trace' },
        {
          id: 'incidents',
          label: 'Security & Invariants',
          badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
          badgeType: 'rose',
        },
      ],
    },
    {
      code: '03',
      title: 'ASSURANCE',
      items: [
        { id: 'audit', label: 'Audit' },
        { id: 'governance', label: 'Governance' },
        { id: 'health', label: 'Fleet Health' },
        { id: 'analytics', label: 'Analytics' },
      ],
    },
    {
      code: '04',
      title: 'EVALUATION',
      items: [
        { id: 'demo-scenarios', label: 'Scenario Laboratory' },
        { id: 'judge-mode', label: 'Evaluation Harness' },
      ],
    },
    {
      code: '05',
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Operator Settings' },
      ],
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full select-none">
      <div className="overflow-y-auto pr-1">
        {/* Brand identity lockup */}
        <div className="px-2 pb-3 mb-3 border-b border-[#D5D5CE]">
          <div className="axiom-brand">
            <AxiomMark size={28} />
            <div>
              <strong>AXIOM</strong>
              <span>AUTONOMOUS OPERATIONS</span>
            </div>
          </div>
        </div>

        {/* Back to editorial index trigger */}
        <button
          type="button"
          onClick={onBackToIndex}
          className="w-full mb-3 px-3 py-1.5 text-xs text-[#334256] hover:text-[#182536] hover:bg-[#EBE7DC] rounded-[2px] border border-[#D5D5CE] flex items-center justify-between transition-colors bg-[#FFFDF8] shadow-2xs font-sans"
          title="Return to 01 AXIOM editorial index"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <ArrowLeft size={12} className="text-[#D72F40]" />
            <span className="font-mono text-[11px]">01 / Editorial Index</span>
          </span>
          <span className="text-[9px] font-mono text-[#5E6975] bg-[#EFEFEB] px-1 py-0.2 rounded-[2px]">
            ESC
          </span>
        </button>

        {/* Structured Navigation Sections */}
        <nav className="axiom-sidebar-nav" aria-label="System navigation">
          {SECTIONS.map((sec) => (
            <div key={sec.title} className="axiom-sidebar-section">
              <div className="axiom-sidebar-section-label">
                <span>{sec.code} {sec.title}</span>
              </div>
              <div>
                {sec.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigateTo(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`axiom-sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="truncate">{item.label}</span>

                      {item.badge !== undefined && (
                        <span className="badge">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Persistent Bottom Execution Widget */}
      <SidebarExecution execution={activeExecution} />
    </div>
  );
};
