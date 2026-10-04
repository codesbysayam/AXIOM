import React from 'react';

export interface ActiveExecutionInfo {
  name: string;
  current: number;
  total: number;
  stage: string;
}

export function SidebarExecution({
  execution,
}: {
  execution?: ActiveExecutionInfo | null;
}) {
  if (!execution) {
    return (
      <div className="sidebar-runtime">
        <span className="runtime-dot" aria-hidden="true" />
        <span>SYSTEM NOMINAL · 12ms</span>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((execution.current / execution.total) * 100));

  return (
    <div className="sidebar-execution" role="status" aria-label="Active workflow execution">
      <span>ACTIVE EXECUTION</span>

      <strong className="truncate block" title={execution.name}>
        {execution.name}
      </strong>

      <div className="sidebar-execution-meta">
        <span>
          {String(execution.current).padStart(2, '0')}
          {' / '}
          {String(execution.total).padStart(2, '0')}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="sidebar-progress">
        <i style={{ width: `${progress}%` }} />
      </div>

      <small className="truncate block mt-1">{execution.stage}</small>
    </div>
  );
}
