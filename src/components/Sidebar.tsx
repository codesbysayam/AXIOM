import React from 'react';
import {
  ArrowLeft,
  Bot,
  Briefcase,
  CheckSquare,
  FileCheck2,
  Gavel,
  HeartPulse,
  LayoutDashboard,
  PlayCircle,
  ScrollText,
  Settings,
  Shield,
  Workflow,
  Wrench,
  Activity,
  AlertTriangle,
  BarChart2,
  Radio,
} from 'lucide-react';
import { ConsoleView, useOperationsStore } from '../orchestrator/store';

export interface SidebarProps {
  onBackToIndex: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ onBackToIndex }) => {
  const { currentView, navigateTo, approvals, incidents } = useOperationsStore();

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
    <aside className="w-[272px] border-r border-[#D5D5CE] bg-[#FAF9F5] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-3.5rem)] select-none">
      <div className="py-4 px-3">
        {/* Brand identity lockup */}
        <div className="px-3 pb-3 mb-3 border-b border-[#D5D5CE]">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-bold tracking-tight text-[#182536]">
              AXIOM
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#5E6975] bg-[#EFEFEB] px-1.5 py-0.5 rounded-[2px] border border-[#D5D5CE]">
              CONTROL RAIL
            </span>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E6975] mt-0.5">
            Autonomous Operations
          </div>
        </div>

        {/* Back to editorial index trigger */}
        <button
          type="button"
          onClick={onBackToIndex}
          className="w-full mb-4 px-3 py-1.5 text-xs text-[#334256] hover:text-[#182536] hover:bg-[#EFEFEB] rounded-[2px] border border-[#D5D5CE] flex items-center justify-between transition-colors bg-[#FFFDF8] shadow-2xs"
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
        <div className="space-y-3.5">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <div className="text-[9px] font-mono font-semibold tracking-wider text-[#5E6975] px-3 mb-1 uppercase flex items-center justify-between">
                <span>{sec.code} {sec.title}</span>
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-[2px] transition-colors text-left relative ${
                        isActive
                          ? 'bg-[#182536] text-[#FFFDF8] font-medium shadow-2xs'
                          : 'text-[#334256] hover:text-[#182536] hover:bg-[#EFEFEB]'
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D72F40]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{item.label}</span>

                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-[#FFFDF8] text-[#182536]'
                              : item.badgeType === 'rose'
                              ? 'bg-rose-50 text-[#D72F40] border border-rose-200'
                              : 'bg-[#FFF8E6] text-[#A87405] border border-[#F7E0B5]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer system status */}
      <div className="p-3 border-t border-[#D5D5CE] bg-[#F5F1E6]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#5E6975]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#138468] animate-pulse" aria-hidden="true" />
            <span className="text-[#182536] font-semibold">8 Nodes Armed</span>
          </span>
          <span className="text-[#5E6975] text-[10px]">Ping: 12ms</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#5E6975]">
          <span>Cluster 01</span>
          <span className="text-[#138468]">100% HEALTH</span>
        </div>
      </div>
    </aside>
  );
};
