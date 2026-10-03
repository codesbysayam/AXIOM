import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Eye, ShieldAlert, UserCheck } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from '../components/StatusBadge';
import { CaseItem } from '../types';

export const CasesPage: React.FC = () => {
  const { cases, resolveCase } = useOperationsStore();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filtered = cases.filter((c) => {
    if (filter === 'open') return c.status !== 'resolved';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
            Incident Casework
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
            Operational Investigation Workspace
          </h1>
          <p className="text-xs text-[#40516a] mt-0.5">
            Exception investigations, compliance disputes, and incident casework
          </p>
        </div>

        <div className="flex items-center gap-1.5 border border-[#dce1e7] bg-white p-1 rounded-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'all' ? 'bg-[#17263d] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            All Dockets ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'open' ? 'bg-[#17263d] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            Active In Review
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filter === 'resolved' ? 'bg-[#17263d] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Investigation Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Investigation Cases Roster (5 cols) */}
        <div className="lg:col-span-5 axiom-panel overflow-hidden">
          <div className="axiom-panel-header bg-[#faf9f5]">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#718096]">
              Case Dockets ({filtered.length})
            </span>
          </div>

          <div className="divide-y divide-[#dce1e7] max-h-[620px] overflow-y-auto">
            {filtered.map((item) => {
              const isSelected = item.id === activeCase?.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#f6f5f0] border-l-2 border-l-[#17263d]' : 'hover:bg-[#fbfaf7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="text-[#718096]">CASE ID: {item.id}</span>
                    <span
                      className={`font-bold uppercase px-1.5 py-0.2 rounded-xs ${
                        item.priority === 'urgent'
                          ? 'bg-rose-100 text-[#c83e4d]'
                          : item.priority === 'high'
                          ? 'bg-amber-100 text-[#945f00]'
                          : 'bg-slate-100 text-[#40516a]'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#17263d] mt-1 line-clamp-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between gap-2 mt-2 text-[11px] text-[#718096] font-mono">
                    <span>{item.category}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Investigation Pane (7 cols) */}
        <div className="lg:col-span-7 axiom-panel">
          {activeCase ? (
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#dce1e7] pb-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#718096]">
                    <span>DOCKET: {activeCase.id}</span>
                    <span>·</span>
                    <span>FILED: {activeCase.createdAt}</span>
                    <span>·</span>
                    <span>CATEGORY: {activeCase.category}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#17263d] mt-1">
                    {activeCase.title}
                  </h3>
                </div>

                <StatusBadge status={activeCase.status} />
              </div>

              {/* Investigation Context */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#718096] font-semibold block">
                  Raw Incident Triage Payload:
                </span>
                <p className="text-xs text-[#17263d] bg-[#fbfaf7] p-3 rounded-xs border border-[#dce1e7] leading-relaxed">
                  {activeCase.summary}
                </p>
              </div>

              {/* Agent Recommendation */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#0d6b4f] font-semibold block">
                  Agent Proposed Resolution:
                </span>
                <div className="text-xs text-[#0d6b4f] bg-[#f0faf6] p-3 rounded-xs border border-[#c7eadf] leading-relaxed">
                  {activeCase.recommendedResolution || 'Awaiting agent recommendation...'}
                </div>
              </div>

              {/* Assigned Agent & Governance Authority */}
              <div className="p-3 border border-[#dce1e7] bg-[#fbfaf7] rounded-xs flex items-center justify-between text-xs font-mono text-[#40516a]">
                <span>Assigned Agent: <strong className="text-[#17263d]">{activeCase.assignedAgent}</strong></span>
                <span className="uppercase text-[#945f00] font-bold">Severity: {activeCase.priority}</span>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#dce1e7] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#718096]">
                  Investigation State: Certified by Lead Operator
                </span>

                {activeCase.status !== 'resolved' ? (
                  <button
                    type="button"
                    onClick={() => resolveCase(activeCase.id)}
                    className="axiom-btn-success"
                  >
                    <CheckCircle2 size={13} />
                    <span>Authorize Resolution</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-[#159a72] font-semibold">
                    Case Resolved & Closed
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-[#718096]">
              Select a case docket from the left to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
