import React from 'react';
import { Activity, Boxes, Play, ScrollText } from 'lucide-react';
import { ConsoleView, useOperationsStore } from '../orchestrator/store';

interface ControlItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  targetView?: ConsoleView;
}

export function ControlSurface() {
  const { currentView, navigateTo, openModal } = useOperationsStore();

  const controls: ControlItem[] = [
    {
      id: 'topology',
      label: 'Topology',
      description: 'Inspect execution architecture and multi-agent DAG.',
      icon: Boxes,
      action: () => openModal('architecture'),
    },
    {
      id: 'trace',
      label: 'Trace',
      description: 'Observe live state transitions and execution logs.',
      icon: Activity,
      targetView: 'activity',
      action: () => navigateTo('activity'),
    },
    {
      id: 'simulate',
      label: 'Simulate',
      description: 'Run deterministic scenario dry-run without mutation.',
      icon: Play,
      targetView: 'demo-scenarios',
      action: () => navigateTo('demo-scenarios'),
    },
    {
      id: 'audit',
      label: 'Audit',
      description: 'Inspect immutable evidence and SHA-256 state ledger.',
      icon: ScrollText,
      targetView: 'audit',
      action: () => navigateTo('audit'),
    },
  ];

  return (
    <div className="control-surface" role="toolbar" aria-label="System Control Surface">
      {controls.map((control) => {
        const Icon = control.icon;
        const isActive = control.targetView && currentView === control.targetView;

        return (
          <button
            key={control.id}
            type="button"
            data-active={isActive ? 'true' : 'false'}
            title={control.description}
            onClick={control.action}
            aria-label={`${control.label}: ${control.description}`}
          >
            <Icon size={14} />
            <span>{control.label}</span>
          </button>
        );
      })}
    </div>
  );
}
