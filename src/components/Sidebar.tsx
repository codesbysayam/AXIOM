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
  const { currentView, navigateTo, approvals, incidents, openModal } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;

  const SECTIONS: NavSection[] = [
    {
      code: '01',
      title: 'ARCHITECTURE',
      items: [
        { id: 'dashboard', label: 'Command Center' },
        { id: 'workflows', label: 'Orchestration DAGs' },
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
        { id: 'activity', label: 'Live Trace Stream' },
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
        { id: 'audit', label: 'Cryptographic Ledger' },
        { id: 'governance', label: 'Policy Rules' },
        { id: 'health', label: 'Fleet Telemetry' },
        { id: 'analytics', label: 'Throughput Analytics' },
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
    <aside className="w-64 border-r border-[#dce1e7] bg-[#fbfaf7] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-3.5rem)] select-none">
      <div className="py-4 px-3">
        {/* Brand identity lockup */}
        <div className="px-3 pb-3 mb-3 border-b border-[#dce1e7]">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-bold tracking-tight text-[#17263d]">
              AXIOM
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#718096] bg-[#eae7df] px-1.5 py-0.5 rounded-[2px] border border-[#dce1e7]">
              OPERATIONS
            </span>
          </div>
          <div className="text-[10px] font-mono tracking-wider text-[#718096] mt-0.5">
            Autonomous intelligence, under human control.
          </div>
        </div>

        {/* Back to editorial index trigger */}
        <button
          type="button"
          onClick={onBackToIndex}
          className="w-full mb-4 px-3 py-1.5 text-xs text-[#40516a] hover:text-[#17263d] hover:bg-[#f0eee6] rounded-[2px] border border-[#dce1e7] flex items-center justify-between transition-colors bg-white shadow-2xs"
          title="Return to the editorial technology index"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <ArrowLeft size={12} className="text-[#e63946]" />
            <span className="font-mono text-[11px]">01 / Editorial Index</span>
          </span>
          <span className="text-[9px] font-mono text-[#718096] bg-[#f0eee6] px-1 py-0.2 rounded-[2px]">
            ESC
          </span>
        </button>

        {/* Structured Navigation Sections */}
        <div className="space-y-4">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <div className="text-[9px] font-mono font-semibold tracking-wider text-[#8c9ba5] px-3 mb-1 uppercase flex items-center justify-between">
                <span>{sec.title}</span>
                <span className="text-[9px] text-[#b8c2cc]">{sec.code}</span>
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
                          ? 'bg-[#17263d] text-white font-medium shadow-2xs'
                          : 'text-[#40516a] hover:text-[#17263d] hover:bg-[#eae7df]'
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e63946]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{item.label}</span>

                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-white text-[#17263d]'
                              : item.badgeType === 'rose'
                              ? 'bg-rose-100 text-[#c83e4d] border border-rose-200'
                              : 'bg-amber-100 text-[#945f00] border border-amber-200'
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
      <div className="p-3 border-t border-[#dce1e7] bg-[#f5f3ec]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#718096]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#159a72] animate-pulse" aria-hidden="true" />
            <span className="text-[#17263d] font-semibold">8 Nodes Armed</span>
          </span>
          <span className="text-[#718096] text-[10px]">Ping: 12ms</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#8c9ba5]">
          <span>Invariant Suite: PASSED</span>
          <span>SHA-256</span>
        </div>
      </div>
    </aside>
  );
};
