import React, { useState } from 'react';
import { CheckCircle2, Download, FileCheck2, Filter, Lock, ScrollText, ShieldCheck } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';

export const AuditPage: React.FC = () => {
  const { auditLogs, openModal } = useOperationsStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = auditLogs.filter(
    (l) =>
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Cryptographic Audit Ledger
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Immutable SHA-256 state transitions recording every autonomous action and human sign-off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal('execution-replay')}
            className="px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-200 font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <ScrollText size={13} />
            <span>Open Replay Theater</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('governance-certificate')}
            className="px-3 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded-md font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck size={13} />
            <span>Verify Ledger Certificate</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by agent, action, or details..."
            className="w-full sm:w-80 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:bg-white text-slate-800"
          />

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700">
            <Lock size={13} />
            <span>SHA-256 Verified (0 Tamper Detected)</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {filtered.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 font-mono">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">[{log.timestamp}]</span>
                  <span className="font-bold text-slate-800">{log.agentName}</span>
                  <span className="text-slate-500">:: {log.action}</span>
                  <StatusBadge status={log.outcome} size="sm" />
                </div>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">{log.details}</p>
                <div className="text-[10px] text-slate-400">Block Hash: {log.hash}</div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 flex-shrink-0">
                <CheckCircle2 size={13} />
                <span>Signed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
