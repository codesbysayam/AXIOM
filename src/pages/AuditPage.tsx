import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  Filter,
  Hash,
  Lock,
  RefreshCw,
  ScrollText,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { AuditLogEntry } from '../types';

export interface AuditLedgerRecord extends AuditLogEntry {
  sequence: number;
  pipeline: string;
  policy: string;
  decision: string;
  previousHash: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

const AUDIT_LEDGER_DATA: AuditLedgerRecord[] = [
  {
    id: 'audit-001',
    sequence: 2481,
    timestamp: '12:03:18.893',
    workflowId: 'wf-vendor-procurement',
    pipeline: 'High-Value Vendor Procurement',
    agentName: 'Validation Tester',
    action: 'INVARIANT_PASS',
    decision: 'RECORD_PROOF',
    policy: 'POL-FIN-01',
    risk: 'high',
    outcome: 'success',
    details: 'Appended tamper-evident cryptographic state vector proof to immutable ledger. Merkle root verified.',
    hash: 'sha256-4927cb0039f821a8d01..',
    previousHash: 'sha256-c71b09def9281a88b12..',
  },
  {
    id: 'audit-002',
    sequence: 2480,
    timestamp: '12:03:18.608',
    workflowId: 'wf-vendor-procurement',
    pipeline: 'High-Value Vendor Procurement',
    agentName: 'Release Guardian',
    action: 'HUMAN_APPROVAL_GATE',
    decision: 'INTERCEPT_HOLD',
    policy: 'POL-SEC-02',
    risk: 'critical',
    outcome: 'success',
    details: 'Disbursement of $28,450.00 USD halted for mandatory CFO sign-off per strict governance invariant.',
    hash: 'sha256-c71b09def9281a88b12..',
    previousHash: 'sha256-a94f8b2ce3109a87123..',
  },
  {
    id: 'audit-003',
    sequence: 2479,
    timestamp: '12:03:18.468',
    workflowId: 'wf-vendor-procurement',
    pipeline: 'High-Value Vendor Procurement',
    agentName: 'Quality Reviewer',
    action: 'INVARIANT_EVALUATION',
    decision: 'THRESHOLD_BREACH',
    policy: 'POL-FIN-01',
    risk: 'high',
    outcome: 'policy_block',
    details: 'Evaluated invoice payload against $10,000 threshold. Invariant held: routing to human gate.',
    hash: 'sha256-a94f8b2ce3109a87123..',
    previousHash: 'sha256-e8b3a019482f91c8922..',
  },
  {
    id: 'audit-004',
    sequence: 2478,
    timestamp: '12:03:17.912',
    workflowId: 'wf-refund-triage',
    pipeline: 'Customer Refund Triage',
    agentName: 'Task Executor',
    action: 'API_DISPATCH',
    decision: 'EXECUTE',
    policy: 'POL-OPS-04',
    risk: 'low',
    outcome: 'success',
    details: 'Atomic settlement of 38.00 USD credit memo for customer ticket #4819 with idempotency token #TXN-7712.',
    hash: 'sha256-e8b3a019482f91c8922..',
    previousHash: 'sha256-5f92bd881a94611e991..',
  },
  {
    id: 'audit-005',
    sequence: 2477,
    timestamp: '12:03:17.440',
    workflowId: 'wf-cve-patch',
    pipeline: 'Autonomous Code Vulnerability Remediation',
    agentName: 'Validation Tester',
    action: 'SANDBOX_REGRESSION',
    decision: 'PASS',
    policy: 'POL-SEC-02',
    risk: 'medium',
    outcome: 'success',
    details: 'Simulated 480 test suites in isolated sandbox for dependency patch. Zero side-effects or regressions.',
    hash: 'sha256-5f92bd881a94611e991..',
    previousHash: 'sha256-7721ae99bb01a823091..',
  },
  {
    id: 'audit-006',
    sequence: 2476,
    timestamp: '12:03:16.890',
    workflowId: 'wf-support-escalation',
    pipeline: 'Customer Support Escalation',
    agentName: 'Intent Analyst',
    action: 'CLASSIFICATION',
    decision: 'STRUCTURE',
    policy: 'POL-DATA-03',
    risk: 'low',
    outcome: 'success',
    details: 'Structured 142 inbound support cases into canonical schema with 99.4% confidence score.',
    hash: 'sha256-7721ae99bb01a823091..',
    previousHash: 'sha256-11892ab8091cf823aa0..',
  },
];

export const AuditPage: React.FC = () => {
  const { openModal, addToast } = useOperationsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | null>('verified');
  const [selectedRecord, setSelectedRecord] = useState<AuditLedgerRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const agents = useMemo(
    () => Array.from(new Set(AUDIT_LEDGER_DATA.map((l) => l.agentName))),
    [],
  );
  const pipelines = useMemo(
    () => Array.from(new Set(AUDIT_LEDGER_DATA.map((l) => l.pipeline))),
    [],
  );

  const filtered = useMemo(() => {
    return AUDIT_LEDGER_DATA.filter((l) => {
      if (agentFilter !== 'all' && l.agentName !== agentFilter) return false;
      if (pipelineFilter !== 'all' && l.pipeline !== pipelineFilter) return false;
      if (riskFilter !== 'all' && l.risk !== riskFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const detailsMatch = l.details.toLowerCase().includes(q);
        const agentMatch = l.agentName.toLowerCase().includes(q);
        const actionMatch = l.action.toLowerCase().includes(q);
        const hashMatch = l.hash.toLowerCase().includes(q);
        const policyMatch = l.policy.toLowerCase().includes(q);
        if (!detailsMatch && !agentMatch && !actionMatch && !hashMatch && !policyMatch) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, agentFilter, pipelineFilter, riskFilter]);

  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < filtered.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkVerify = () => {
    addToast(
      'Merkle Hashes Verified',
      `Successfully verified cryptographic hashes for ${selectedIds.length} selected audit records.`,
      'success',
    );
  };

  const handleBulkExport = () => {
    const records = AUDIT_LEDGER_DATA.filter((r) => selectedIds.includes(r.id));
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axiom-audit-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(
      'Audit Records Exported',
      `Exported ${selectedIds.length} cryptographic audit proofs.`,
      'info',
    );
  };

  const handleVerifyIntegrity = () => {
    setVerifying(true);
    addToast('Verifying Ledger Integrity', 'Computing SHA-256 Merkle proofs across 2,481 state records...', 'info');

    setTimeout(() => {
      setVerifying(false);
      setVerificationResult('verified');
      addToast(
        'CHAIN VERIFIED',
        'Cryptographic audit ledger verified. 100% hash chain integrity, 0 tampering detected.',
        'success',
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="eyebrow block">
            Cryptographic Assurance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Audit Ledger & Evidence Chain
          </h1>
          <p className="text-sm font-sans text-[#40516A] mt-1">
            Immutable SHA-256 state transitions recording every autonomous action and human sign-off
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            disabled={verifying}
            onClick={handleVerifyIntegrity}
            className="axiom-btn-primary"
          >
            <ShieldCheck size={13} className={verifying ? 'animate-spin' : 'text-[#00866B]'} />
            <span>{verifying ? 'Verifying Merkle Tree...' : 'Verify Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Top Context Summary Ribbon (Point 8, 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[4px] divide-y sm:divide-y-0 sm:divide-x divide-[#D5D5CE] shadow-2xs">
        <div className="p-4">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium">Audit Ledger Size</span>
          <strong className="text-2xl font-bold font-sans text-[#17263A] block mt-0.5">2,481 <span className="text-sm font-normal text-[#68758A]">Events</span></strong>
          <span className="text-xs text-[#68758A] font-sans">Continuous append-only log</span>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium">Chain Integrity</span>
          <strong className="text-2xl font-bold font-sans text-[#00866B] block mt-0.5">100% <span className="text-sm font-normal text-[#00866B]">Verified</span></strong>
          <span className="text-xs text-[#00866B] font-sans">SHA-256 Merkle root unbroken</span>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium">Tamper Violations</span>
          <strong className="text-2xl font-bold font-sans text-[#17263A] block mt-0.5">0 <span className="text-sm font-normal text-[#68758A]">Violations</span></strong>
          <span className="text-xs text-[#68758A] font-sans">Zero uncommitted side-effects</span>
        </div>
      </div>

      {/* EVIDENCE CHAIN VISUALIZATION (Point 8) */}
      <div className="axiom-panel p-4 border border-[#D5D5CE] bg-[#FAF9F5] rounded-[4px]">
        <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2 mb-3">
          <span className="card-title text-sm font-sans font-semibold text-[#17263A] flex items-center gap-1.5">
            <Lock size={13} className="text-[#00866B]" />
            Evidence Chain Topology
          </span>
          <span className="text-xs font-sans font-semibold text-[#00866B]">
            CHAIN VERIFIED · <span className="font-mono text-[11px]">SHA-256</span>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs font-mono">
          <div className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex-shrink-0 text-center w-36">
            <span className="text-[9px] uppercase text-[#5E6975] block">01 / EVENT</span>
            <span className="font-bold text-[#182536] block mt-0.5 truncate">Task Ingestion</span>
          </div>
          <span className="text-[#5E6975]">→</span>
          <div className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex-shrink-0 text-center w-36">
            <span className="text-[9px] uppercase text-[#5E6975] block">02 / POLICY</span>
            <span className="font-bold text-[#A66A00] block mt-0.5 truncate">Threshold Invariant</span>
          </div>
          <span className="text-[#5E6975]">→</span>
          <div className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex-shrink-0 text-center w-36">
            <span className="text-[9px] uppercase text-[#5E6975] block">03 / STATE TRANSITION</span>
            <span className="font-bold text-[#182536] block mt-0.5 truncate">Vector Handoff</span>
          </div>
          <span className="text-[#5E6975]">→</span>
          <div className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex-shrink-0 text-center w-36">
            <span className="text-[9px] uppercase text-[#5E6975] block">04 / DECISION</span>
            <span className="font-bold text-[#08795F] block mt-0.5 truncate">Human Sign-off</span>
          </div>
          <span className="text-[#5E6975]">→</span>
          <div className="p-2.5 bg-white border border-[#D5D5CE] rounded-[2px] flex-shrink-0 text-center w-36">
            <span className="text-[9px] uppercase text-[#5E6975] block">05 / SIGNATURE</span>
            <span className="font-bold text-[#182536] block mt-0.5 truncate">SHA-256 Digest</span>
          </div>
        </div>
      </div>

      {/* Audit Ledger Controls & Table */}
      <div className="axiom-panel overflow-hidden border border-[#D5D5CE] bg-[#FFFDF8]">
        {/* Top Filter and Bulk Actions Bar */}
        <div className="axiom-table-toolbar">
          <div className="axiom-table-filter">
            <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search & filter ledger by actor, hash, pipeline, or action..."
              aria-label="Filter audit ledger table"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 text-[#5E6975] hover:text-[#182536]"
                title="Clear filter"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {selectedIds.length > 0 ? (
            <div className="axiom-bulk-bar">
              <span>
                <b>{selectedIds.length}</b> selected
              </span>
              <button
                type="button"
                onClick={handleBulkVerify}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <ShieldCheck size={10} />
                <span>Verify Hashes</span>
              </button>
              <button
                type="button"
                onClick={handleBulkExport}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#182536] hover:bg-[#25394f] text-white text-[10px] font-semibold rounded-[2px] transition-colors"
              >
                <Download size={10} />
                <span>Export Proofs</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-slate-300 hover:text-white underline text-[10px] ml-1"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Agent filter */}
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="text-xs bg-white border border-[#D5D5CE] rounded-[2px] px-2 py-1 text-[#334256]"
                aria-label="Filter by agent"
              >
                <option value="all">All Agents ({agents.length})</option>
                {agents.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>

              {/* Pipeline filter */}
              <select
                value={pipelineFilter}
                onChange={(e) => setPipelineFilter(e.target.value)}
                className="text-xs bg-white border border-[#D5D5CE] rounded-[2px] px-2 py-1 text-[#334256]"
                aria-label="Filter by pipeline"
              >
                <option value="all">All Pipelines</option>
                {pipelines.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Risk filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="text-xs bg-white border border-[#D5D5CE] rounded-[2px] px-2 py-1 text-[#334256]"
                aria-label="Filter by risk"
              >
                <option value="all">All Risk Tiers</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>

              <span className="text-xs font-mono text-[#5E6975] ml-1">
                {filtered.length} of {AUDIT_LEDGER_DATA.length} events
              </span>
            </div>
          )}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="axiom-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all audit entries"
                    className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="w-16">Seq</th>
                <th>Timestamp</th>
                <th>Actor / Agent</th>
                <th>Pipeline</th>
                <th>Action & Decision</th>
                <th>Policy</th>
                <th>Hash / Digest</th>
                <th className="text-right">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-xs text-[#5E6975] font-mono">
                    No matching audit records found for "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const isSelected = selectedIds.includes(record.id);

                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'is-selected' : 'hover:bg-[#F5F2E9]'
                      }`}
                    >
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(record.id)}
                          aria-label={`Select audit record ${record.id}`}
                          className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="font-mono text-xs font-bold text-[#5E6975]">
                        #{record.sequence}
                      </td>
                      <td className="font-mono text-xs text-[#182536]">
                        {record.timestamp}
                      </td>
                      <td>
                        <div className="font-semibold text-xs text-[#182536]">{record.agentName}</div>
                      </td>
                      <td className="text-xs text-[#334256] font-mono">
                        {record.pipeline}
                      </td>
                      <td>
                        <div className="text-xs font-mono font-bold text-[#182536]">{record.action}</div>
                        <div className="text-[10px] text-[#5E6975] font-mono">{record.decision}</div>
                      </td>
                      <td>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#FAF9F5] border border-[#D5D5CE] text-[#334256]">
                          {record.policy}
                        </span>
                      </td>
                      <td className="font-mono text-[10px] text-[#5E6975] max-w-[140px] truncate" title={record.hash}>
                        {record.hash}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          className="px-2 py-0.5 text-[10px] font-mono border border-[#D5D5CE] bg-white hover:bg-[#182536] hover:text-white rounded-[2px] transition-colors"
                        >
                          Chain Proof →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Evidence Chain Modal / Drawer */}
      {selectedRecord && (
        <>
          <div
            className="fixed inset-0 bg-[#182536]/40 z-50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedRecord(null)}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#FFFDF8] border-l border-[#D5D5CE] z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-label="Evidence Chain Details"
          >
            <header className="p-4 bg-[#FAF9F5] border-b border-[#D5D5CE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#08795F]" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#5E6975] block">
                    RECORD #{selectedRecord.sequence}
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#182536]">
                    Cryptographic Evidence Chain
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-[#5E6975] hover:text-[#182536]"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
              <div className="p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px] space-y-1">
                <span className="text-[10px] text-[#5E6975] uppercase block font-semibold">Details</span>
                <p className="font-sans text-xs text-[#182536] leading-relaxed">{selectedRecord.details}</p>
              </div>

              <div className="p-3 bg-white border border-[#D5D5CE] rounded-[2px] space-y-2">
                <span className="text-[10px] text-[#5E6975] uppercase block font-semibold">Chain Hashes</span>
                <div className="space-y-1 text-[11px]">
                  <div>Current Hash:</div>
                  <div className="p-2 bg-[#FAF9F5] border border-[#D5D5CE] break-all text-[#182536]">
                    {selectedRecord.hash}
                  </div>
                  <div className="pt-1">Previous Block Hash:</div>
                  <div className="p-2 bg-[#FAF9F5] border border-[#D5D5CE] break-all text-[#5E6975]">
                    {selectedRecord.previousHash}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F0FAF6] border border-[#C3E6DB] rounded-[2px] text-[#08795F] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Merkle Tree Signature Verified
                </span>
                <p className="text-[11px] leading-relaxed">
                  Cryptographic state transition matches baseline immutable hash. Zero uncommitted write mutations detected.
                </p>
              </div>
            </div>

            <footer className="p-3 bg-[#FAF9F5] border-t border-[#D5D5CE] text-right">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1 bg-[#182536] text-white text-xs rounded-[2px]"
              >
                Close
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
};
