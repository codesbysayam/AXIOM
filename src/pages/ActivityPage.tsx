import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { EventInspector, TraceEventItem } from '../components/inspectors/EventInspector';
import { AutonomousDecisionStream } from '../components/mission/AutonomousDecisionStream';
import { EventStreamRadar } from '../components/mission/EventStreamRadar';
import { AgentCollaborationCanvas } from '../components/mission/AgentCollaborationCanvas';
import { axiomDemoData } from '../data/axiomDemoData';

const INITIAL_TRACE_EVENTS: TraceEventItem[] = [
  {
    id: 'evt-01',
    timestamp: '12:03:18.240',
    agentName: 'Workflow Planner',
    pipeline: 'Customer Refund Triage',
    eventType: 'Dispatch',
    action: 'PIPELINE_DISPATCH',
    stateTransition: { from: 'QUEUED', to: 'RUNNING' },
    durationMs: 42,
    risk: 'low',
    policyId: 'POL-OPS-03',
    details: 'Dispatched DAG decomposition for customer ticket #4819. Invariants allocated.',
    hash: 'sha256-a91cb48f..72f',
    previousHash: 'sha256-94812a10..03c',
  },
  {
    id: 'evt-02',
    timestamp: '12:03:18.190',
    agentName: 'Release Guardian',
    pipeline: 'Vendor Procurement and PO Match',
    eventType: 'Approval',
    action: 'POLICY_INTERCEPT',
    stateTransition: { from: 'RUNNING', to: 'WAITING_HUMAN' },
    durationMs: 88,
    risk: 'high',
    policyId: 'POL-FIN-01',
    details: 'Suspended wire transfer #TX-9902 ($28,450.00 USD) pending human CFO authorization.',
    hash: 'sha256-e8b3a019..91c',
    previousHash: 'sha256-a91cb48f..72f',
  },
  {
    id: 'evt-03',
    timestamp: '12:03:17.912',
    agentName: 'Task Executor',
    pipeline: 'Customer Refund Triage',
    eventType: 'Execution',
    action: 'ATOMIC_DISPATCH',
    stateTransition: { from: 'ARMED', to: 'COMMITTED' },
    durationMs: 145,
    risk: 'low',
    policyId: 'POL-OPS-04',
    details: 'Dispatched credit memo adjustment of 38.00 USD with idempotency token #TXN-7712.',
    hash: 'sha256-c491aa77..381',
    previousHash: 'sha256-e8b3a019..91c',
  },
  {
    id: 'evt-04',
    timestamp: '12:03:17.440',
    agentName: 'Validation Tester',
    pipeline: 'Autonomous Code Vulnerability Remediation',
    eventType: 'Invariant',
    action: 'INVARIANT_SANDBOX',
    stateTransition: { from: 'TESTING', to: 'PASS' },
    durationMs: 480,
    risk: 'medium',
    policyId: 'POL-SEC-02',
    details: 'Executed 480 regression test cases in ephemeral sandbox for PR #1402. All invariants preserved.',
    hash: 'sha256-5f92bd88..611',
    previousHash: 'sha256-c491aa77..381',
  },
  {
    id: 'evt-05',
    timestamp: '12:03:16.890',
    agentName: 'Intent Analyst',
    pipeline: 'Customer Support Escalation',
    eventType: 'Policy',
    action: 'INTENT_CLASSIFICATION',
    stateTransition: { from: 'UNPARSED', to: 'STRUCTURED' },
    durationMs: 34,
    risk: 'low',
    policyId: 'POL-DATA-03',
    details: 'Classified 142 inbound support requests. Semantic confidence median: 0.982.',
    hash: 'sha256-7721ae99..a82',
    previousHash: 'sha256-5f92bd88..611',
  },
  {
    id: 'evt-06',
    timestamp: '12:03:16.120',
    agentName: 'Fraud & Anomaly Sentinel',
    pipeline: 'Identity Authentication Gate',
    eventType: 'Security',
    action: 'ANOMALY_SCAN',
    stateTransition: { from: 'INSPECTING', to: 'QUARANTINED' },
    durationMs: 62,
    risk: 'critical',
    policyId: 'POL-SEC-04',
    details: 'Detected rapid login sequence from unfamiliar subnet for user usr-884. Flagged for review.',
    hash: 'sha256-a129ef38..550',
    previousHash: 'sha256-7721ae99..a82',
  },
  {
    id: 'evt-07',
    timestamp: '12:03:15.650',
    agentName: 'Context Memory Agent',
    pipeline: 'High-Value Vendor Procurement',
    eventType: 'Audit',
    action: 'AUDIT_COMMIT',
    stateTransition: { from: 'BUFFER', to: 'LEDGER_SEALED' },
    durationMs: 28,
    risk: 'low',
    policyId: 'POL-AUD-01',
    details: 'Appended tamper-evident cryptographic state vector proof to immutable ledger.',
    hash: 'sha256-b093cc18..091',
    previousHash: 'sha256-a129ef38..550',
  },
  {
    id: 'evt-08',
    timestamp: '12:03:14.990',
    agentName: 'Quality Reviewer',
    pipeline: 'Quarterly Financial Ledger Reconciliation',
    eventType: 'Policy',
    action: 'POLICY_VERIFY',
    stateTransition: { from: 'PROPOSED', to: 'VALIDATED' },
    durationMs: 110,
    risk: 'medium',
    policyId: 'POL-FIN-03',
    details: 'Reconciled 1,926 general ledger entries against escrow reserve statements. Zero variance.',
    hash: 'sha256-d4421b8a..204',
    previousHash: 'sha256-b093cc18..091',
  },
];

const EVENT_FILTERS = [
  'All',
  'Dispatch',
  'Policy',
  'Invariant',
  'Execution',
  'Approval',
  'Security',
  'Audit',
] as const;

export const ActivityPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingEvent, setInspectingEvent] = useState<TraceEventItem | null>(null);

  const filteredEvents = useMemo(() => {
    return INITIAL_TRACE_EVENTS.filter((evt) => {
      if (selectedFilter !== 'All' && evt.eventType !== selectedFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const agentMatch = evt.agentName.toLowerCase().includes(q);
        const actionMatch = evt.action.toLowerCase().includes(q);
        const detailsMatch = evt.details.toLowerCase().includes(q);
        const pipelineMatch = evt.pipeline?.toLowerCase().includes(q);
        if (!agentMatch && !actionMatch && !detailsMatch && !pipelineMatch) return false;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
            Real-Time Observability
          </span>
          <h1 className="text-2xl font-serif font-medium text-[#182536] mt-1">
            Live Fleet Activity Stream
          </h1>
          <p className="text-xs font-sans text-[#334256] mt-0.5">
            Streaming trace logs of agent step dispatches, policy evaluations, and state vector mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-[#08795F] bg-[#F0FAF6] px-3 py-1.5 rounded-[2px] border border-[#C3E6DB]">
            <span className="w-2 h-2 rounded-full bg-[#08795F] animate-pulse" />
            Live Feed Connected
          </span>
        </div>
      </div>

      {/* Observability Telemetry Ribbon Header (Point 7) */}
      <div className="border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] block font-semibold">
            TELEMETRY STREAM HEADER
          </span>
          <div className="text-sm font-sans font-semibold text-[#182536] mt-0.5">
            LIVE FLEET TRACE & DECISION LOGS
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#08795F]" />
            <span className="font-mono font-bold text-[#182536]">{axiomDemoData.agents.total}</span>
            <span className="text-[#5E6975]">agents</span>
          </div>
          <span className="text-[#D5D5CE]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[#182536]">{axiomDemoData.pipelines.total}</span>
            <span className="text-[#5E6975]">pipelines</span>
          </div>
          <span className="text-[#D5D5CE]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[#182536]">{INITIAL_TRACE_EVENTS.length}</span>
            <span className="text-[#5E6975]">events</span>
          </div>
          <span className="text-[#D5D5CE]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[#08795F]">{axiomDemoData.fleet.heartbeatIntervalMs}ms</span>
            <span className="text-[#5E6975]">heartbeat</span>
          </div>
        </div>
      </div>

      {/* Real-time Decision Stream & Event Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AutonomousDecisionStream maxItems={6} />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <EventStreamRadar />
        </div>
      </div>

      {/* Inter-Agent Collaboration Canvas */}
      <AgentCollaborationCanvas />

      {/* Filter and Search Bar */}
      <div className="axiom-panel overflow-hidden border border-[#D5D5CE] bg-[#FFFDF8]">
        <div className="p-3 bg-[#FAF9F5] border-b border-[#D5D5CE] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 font-sans">
            {EVENT_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors whitespace-nowrap ${
                  selectedFilter === f
                    ? 'bg-[#182536] text-[#FFFDF8] shadow-2xs font-semibold'
                    : 'bg-[#FFFDF8] border border-[#D5D5CE] text-[#334256] hover:bg-[#EFEFEB]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5E6975]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions or agents..."
              className="w-full pl-8 pr-3 py-1 text-xs font-sans bg-white border border-[#D5D5CE] rounded-[2px] text-[#182536] focus:outline-none focus:border-[#182536]"
            />
          </div>
        </div>

        {/* State Transition Event Rows (Point 7) */}
        <div className="divide-y divide-[#D5D5CE]">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs font-sans text-[#5E6975]">
              No events found matching current filter.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setInspectingEvent(evt)}
                className="trace-event cursor-pointer hover:bg-[#F5F2E9] transition-colors"
              >
                {/* Time */}
                <div className="trace-time">{evt.timestamp}</div>

                {/* Agent with dot */}
                <div className="trace-agent">
                  <span
                    className={`trace-dot ${
                      evt.risk === 'critical'
                        ? 'bg-[#B52D3D]'
                        : evt.risk === 'high'
                        ? 'bg-[#A66A00]'
                        : 'bg-[#08795F]'
                    }`}
                  />
                  <span className="truncate">{evt.agentName}</span>
                </div>

                {/* Operation */}
                <div className="trace-operation">
                  <span className="font-bold text-[#182536]">{evt.action}</span>
                  {evt.pipeline && (
                    <span className="block text-[9px] text-[#5E6975] truncate">
                      {evt.pipeline}
                    </span>
                  )}
                </div>

                {/* State Transition */}
                <div className="trace-transition">
                  <span>{evt.stateTransition?.from || 'INIT'}</span>
                  <b>→</b>
                  <strong
                    className={
                      evt.stateTransition?.to.includes('HOLD') ||
                      evt.stateTransition?.to.includes('HUMAN') ||
                      evt.stateTransition?.to.includes('QUARANTINED')
                        ? 'text-[#A66A00]'
                        : 'text-[#08795F]'
                    }
                  >
                    {evt.stateTransition?.to || 'DONE'}
                  </strong>
                </div>

                {/* Duration */}
                <div className="trace-duration">{evt.durationMs}ms</div>

                {/* Action */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingEvent(evt);
                    }}
                    className="trace-inspect px-2.5 py-1"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detailed Event Inspector Drawer */}
      <EventInspector
        event={inspectingEvent}
        onClose={() => setInspectingEvent(null)}
      />
    </div>
  );
};
