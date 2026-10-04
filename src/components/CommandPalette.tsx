import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Briefcase,
  CheckSquare,
  FileCheck2,
  Gavel,
  HeartPulse,
  LayoutDashboard,
  Layers,
  PlayCircle,
  ScrollText,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Workflow,
  X,
} from 'lucide-react';
import { ConsoleView, useOperationsStore } from '../orchestrator/store';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToIndex: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onBackToIndex }) => {
  const { navigateTo, openModal } = useOperationsStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else openModal('command-palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, openModal]);

  if (!isOpen) return null;

  const ACTIONS: Array<{
    id: string;
    label: string;
    category: string;
    icon: React.ElementType;
    run: () => void;
  }> = [
    {
      id: 'back-index',
      label: 'Return to 01 / AXIOM Editorial Index',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => {
        onClose();
        onBackToIndex();
      },
    },
    {
      id: 'nav-dashboard',
      label: 'Navigate to Dashboard',
      category: 'Views',
      icon: LayoutDashboard,
      run: () => {
        navigateTo('dashboard');
        onClose();
      },
    },
    {
      id: 'nav-workflows',
      label: 'Navigate to Workflows',
      category: 'Views',
      icon: Workflow,
      run: () => {
        navigateTo('workflows');
        onClose();
      },
    },
    {
      id: 'nav-approvals',
      label: 'Navigate to Human Approvals',
      category: 'Views',
      icon: CheckSquare,
      run: () => {
        navigateTo('approvals');
        onClose();
      },
    },
    {
      id: 'nav-agents',
      label: 'Navigate to Agent Workforce',
      category: 'Views',
      icon: Bot,
      run: () => {
        navigateTo('agents');
        onClose();
      },
    },
    {
      id: 'nav-cases',
      label: 'Navigate to Cases & Triage',
      category: 'Views',
      icon: Briefcase,
      run: () => {
        navigateTo('cases');
        onClose();
      },
    },
    {
      id: 'nav-audit',
      label: 'Navigate to Audit Trail',
      category: 'Views',
      icon: ScrollText,
      run: () => {
        navigateTo('audit');
        onClose();
      },
    },
    {
      id: 'nav-demo',
      label: 'Launch Demo Scenarios',
      category: 'Actions',
      icon: PlayCircle,
      run: () => {
        navigateTo('demo-scenarios');
        onClose();
      },
    },
    {
      id: 'action-architecture',
      label: 'Open System Architecture Visualizer',
      category: 'Diagnostics',
      icon: Layers,
      run: () => {
        onClose();
        openModal('architecture');
      },
    },
    {
      id: 'action-policy-sim',
      label: 'Open Policy Rule Simulator',
      category: 'Diagnostics',
      icon: SlidersHorizontal,
      run: () => {
        onClose();
        openModal('policy-simulator');
      },
    },
    {
      id: 'action-governance-cert',
      label: 'View Governance Certificate',
      category: 'Governance',
      icon: FileCheck2,
      run: () => {
        onClose();
        openModal('governance-certificate');
      },
    },
    {
      id: 'action-create-wf',
      label: 'Create New Workflow Pipeline',
      category: 'Actions',
      icon: Workflow,
      run: () => {
        onClose();
        openModal('create-workflow');
      },
    },
  ];

  const filtered = ACTIONS.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-slate-100 flex items-center gap-2">
          <Search size={16} className="text-slate-400 ml-1" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            className="w-full text-xs py-1.5 px-2 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label="Close command palette"
          >
            <X size={15} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.run}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-slate-100 text-slate-600 group-hover:bg-[#1b2e49] group-hover:text-white transition-colors">
                      <Icon size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-900 font-sans">{item.label}</div>
                      <div className="text-[10px] font-sans text-slate-400 font-medium">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-slate-300 group-hover:text-slate-600" />
                </button>
              );
            })
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
          <span>Navigate with mouse or arrow keys</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
