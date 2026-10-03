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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Real-Time Telemetry
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Live Fleet Activity Stream
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Streaming trace logs of agent step dispatches, policy evaluations, and state mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono text-[#0d6b4f] bg-[#f0faf6] px-2.5 py-1 rounded-[2px] border border-[#c7eadf]">
            <span className="w-2 h-2 rounded-full bg-[#159a72] animate-pulse" />
            Live Feed Connected
          </span>
        </div>
      </div>

      <div className="axiom-panel bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-1.5 pb-3 border-b border-[#f0eee6] overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1 text-xs font-medium rounded-[2px] transition-colors ${
              filterAction === 'all'
                ? 'bg-[#17263d] text-white shadow-2xs'
                : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            All Actions ({auditLogs.length})
          </button>
          {actions.map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1 text-xs font-medium rounded-[2px] whitespace-nowrap transition-colors ${
                filterAction === act
                  ? 'bg-[#17263d] text-white shadow-2xs'
                  : 'text-[#40516a] hover:bg-[#f6f5f0]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#f0eee6] mt-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={entry.outcome} size="sm" />
                  <span className="text-xs font-mono font-bold text-[#17263d]">
                    {entry.agentName}
                  </span>
                  <span className="text-[11px] font-mono text-[#718096]">· {entry.action}</span>
                </div>
                <p className="text-xs text-[#40516a] leading-relaxed font-sans">{entry.details}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono text-[#718096] block">{entry.timestamp}</span>
                <span className="text-[10px] font-mono text-[#a0aec0] block mt-0.5">
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
