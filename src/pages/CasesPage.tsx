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
          <span className="eyebrow block">
            Incident Casework
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263a] mt-1 tracking-tight">
            Operational Investigation Workspace
          </h1>
          <p className="text-sm font-sans text-[#40516a] mt-1">
            Exception investigations, compliance disputes, and incident casework
          </p>
        </div>

        <div className="flex items-center gap-1.5 border border-[#dce1e7] bg-white p-1 rounded-[4px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-sans font-medium rounded-[4px] transition-colors ${
              filter === 'all' ? 'bg-[#17263a] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            All Dockets ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`px-3 py-1 text-xs font-sans font-medium rounded-[4px] transition-colors ${
              filter === 'open' ? 'bg-[#17263a] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            Active In Review
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-sans font-medium rounded-[4px] transition-colors ${
              filter === 'resolved' ? 'bg-[#17263a] text-white' : 'text-[#40516a] hover:bg-[#f6f5f0]'
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
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.06em] text-[#68758A]">
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
                    isSelected ? 'bg-[#f6f5f0] border-l-2 border-l-[#17263a]' : 'hover:bg-[#fbfaf7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-sans">
                    <span className="text-[#68758A]">Case <span className="font-mono text-[#17263A] font-semibold">{item.id}</span></span>
                    <span
                      className={`font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded-[3px] ${
                        item.priority === 'urgent'
                          ? 'bg-[#FCE8EA] text-[#C93645]'
                          : item.priority === 'high'
                          ? 'bg-[#FFF2CC] text-[#B97800]'
                          : 'bg-slate-100 text-[#40516A]'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-sans font-semibold text-[#17263a] mt-1.5 line-clamp-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between gap-2 mt-2 text-xs text-[#68758A] font-sans">
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
                  <div className="flex items-center gap-2 text-xs font-sans text-[#68758A]">
                    <span>Docket: <span className="font-mono font-medium text-[#17263A]">{activeCase.id}</span></span>
                    <span>·</span>
                    <span>Filed: <span className="font-mono">{activeCase.createdAt}</span></span>
                    <span>·</span>
                    <span>Category: {activeCase.category}</span>
                  </div>
                  <h3 className="text-base font-sans font-semibold text-[#17263a] mt-1.5">
                    {activeCase.title}
                  </h3>
                </div>

                <StatusBadge status={activeCase.status} />
              </div>

              {/* Investigation Context */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-sans uppercase text-[#68758A] font-semibold tracking-[0.08em] block">
                  Raw Incident Triage Payload:
                </span>
                <p className="text-xs font-sans text-[#17263a] bg-[#fbfaf7] p-3 rounded-[4px] border border-[#dce1e7] leading-relaxed">
                  {activeCase.summary}
                </p>
              </div>

              {/* Agent Recommendation */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-sans uppercase text-[#00866B] font-semibold tracking-[0.08em] block">
                  Agent Proposed Resolution:
                </span>
                <div className="text-xs font-sans text-[#00866B] bg-[#E5F5EF] p-3 rounded-[4px] border border-[#A8DCCE] leading-relaxed">
                  {activeCase.recommendedResolution || 'Awaiting agent recommendation...'}
                </div>
              </div>

              {/* Assigned Agent & Governance Authority */}
              <div className="p-3 border border-[#dce1e7] bg-[#fbfaf7] rounded-[4px] flex items-center justify-between text-xs font-sans text-[#40516A]">
                <span>Assigned Agent: <strong className="text-[#17263a] font-semibold">{activeCase.assignedAgent}</strong></span>
                <span className="uppercase text-[#B97800] font-semibold">Severity: {activeCase.priority}</span>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#dce1e7] flex items-center justify-between">
                <span className="text-xs font-sans text-[#68758A]">
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
                  <span className="text-xs font-sans text-[#00866B] font-semibold">
                    Case Resolved & Closed
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-xs font-sans text-[#68758A]">
              Select a case docket from the left to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
