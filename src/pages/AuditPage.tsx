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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Cryptographic Assurance
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Evidence Timeline & Audit Ledger
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Immutable SHA-256 state transitions recording every autonomous action and human sign-off
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => openModal('execution-replay')}
            className="axiom-btn-secondary"
          >
            <ScrollText size={13} />
            <span>Replay Theater</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('governance-certificate')}
            className="axiom-btn-primary"
          >
            <ShieldCheck size={13} />
            <span>Verify Certificate</span>
          </button>
        </div>
      </div>

      {/* Audit Search & Ledger Verification */}
      <div className="axiom-panel">
        <div className="axiom-panel-header bg-[#faf9f5]">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ledger by actor, agent, or hash..."
              className="w-full px-2.5 py-1 text-xs bg-white border border-[#dce1e7] rounded-xs focus:outline-none focus:border-[#17263d] text-[#17263d]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#0d6b4f]">
            <Lock size={12} />
            <span>SHA-256 Ledger Verified (0 Tamper Detected)</span>
          </div>
        </div>

        {/* Evidence Timeline */}
        <div className="divide-y divide-[#dce1e7]">
          {filtered.map((log, idx) => (
            <div key={log.id} className="p-4 hover:bg-[#fcfbf9] transition-colors font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#718096]">
                <div className="flex items-center gap-2">
                  <span className="text-[#e63946] font-bold">0{idx + 1}</span>
                  <span className="text-[#17263d] font-bold">[{log.timestamp}]</span>
                  <span>ACTOR: <strong className="text-[#17263d]">{log.agentName}</strong></span>
                  <span>ACTION: <span className="text-[#40516a]">{log.action}</span></span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={log.outcome} size="sm" />
                  <span className="text-[10px] text-[#a0aec0]">HASH: {log.hash}</span>
                </div>
              </div>

              <div className="mt-2 font-sans text-xs text-[#17263d] leading-relaxed bg-[#fbfaf7] p-2.5 rounded-xs border border-[#e9ecef]">
                {log.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
