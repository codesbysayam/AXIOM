import React, { useState } from 'react';
import { Activity, Clock, RefreshCw } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const ActivityPage: React.FC = () => {
  const { auditLogs } = useOperationsStore();
  const [filterAction, setFilterAction] = useState<string>('all');

  const actions = Array.from(new Set(auditLogs.map((l) => l.action)));

  const filtered = auditLogs.filter((l) => {
    if (filterAction !== 'all' && l.action !== filterAction) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Live Fleet Activity Feed
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Streaming telemetry of agent step dispatches, policy evaluations, and state mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed Connected
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterAction('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded ${
              filterAction === 'all'
                ? 'bg-[#1b2e49] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Actions ({auditLogs.length})
          </button>
          {actions.map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setFilterAction(act)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
                filterAction === act
                  ? 'bg-[#1b2e49] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={entry.outcome} size="sm" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {entry.agentName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">· {entry.action}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{entry.details}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono text-slate-400 block">{entry.timestamp}</span>
                <span className="text-[10px] font-mono text-slate-300 block mt-0.5">
                  Hash: {entry.hash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
