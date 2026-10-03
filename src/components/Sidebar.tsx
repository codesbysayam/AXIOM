import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bot,
  Briefcase,
  CheckSquare,
  Gavel,
  HeartPulse,
  LayoutDashboard,
  PlayCircle,
  ScrollText,
  Settings,
  Shield,
  Wrench,
  Workflow,
} from 'lucide-react';
import { ConsoleView, useOperationsStore } from '../orchestrator/store';

export interface SidebarProps {
  onBackToIndex: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onBackToIndex }) => {
  const { currentView, navigateTo, approvals, incidents } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;

  const NAV_ITEMS: Array<{
    id: ConsoleView;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: 'amber' | 'rose';
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'cases', label: 'Cases & Triage', icon: Briefcase },
    {
      id: 'approvals',
      label: 'Human Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeVariant: 'amber',
    },
    { id: 'agents', label: 'Agent Workforce', icon: Bot },
    { id: 'skills', label: 'Custom Skills', icon: Wrench },
    { id: 'activity', label: 'Live Activity', icon: Activity },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'governance', label: 'Governance Policies', icon: Shield },
    {
      id: 'incidents',
      label: 'Incidents & Containment',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeVariant: 'rose',
    },
    { id: 'health', label: 'Fleet Health', icon: HeartPulse },
    { id: 'demo-scenarios', label: 'Demo Scenarios', icon: PlayCircle },
    { id: 'judge-mode', label: 'Judge & Benchmarks', icon: Gavel },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-[#faf9f5] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="p-3">
        <button
          type="button"
          onClick={onBackToIndex}
          className="w-full mb-3 px-3 py-2 text-xs font-mono tracking-tight text-[#1b2e49] bg-white hover:bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between shadow-xs transition-colors"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <ArrowLeft size={13} />
            01 / Agentic AI
          </span>
          <span className="text-[10px] text-slate-400 uppercase">Index</span>
        </button>

        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
          Console Navigation
        </div>

        <nav className="space-y-0.5 mt-1" aria-label="Console navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition-colors text-left ${
                  isActive
                    ? 'bg-[#1b2e49] text-white font-medium shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={15}
                    className={isActive ? 'text-white' : 'text-slate-500'}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white text-[#1b2e49]'
                        : item.badgeVariant === 'rose'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-200 bg-white/60">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            8 Agents Online
          </span>
          <span>v4.2.0</span>
        </div>
      </div>
    </aside>
  );
};
