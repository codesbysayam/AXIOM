import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  MessageSquare,
  Network,
  Zap,
} from 'lucide-react';

export interface AgentMessagePacket {
  id: string;
  fromAgent: string;
  toAgent: string;
  messageType: string;
  timestamp: string;
  latencyMs: number;
  payloadSummary: string;
  protocolStatus: 'DELIVERED_ACK' | 'VERIFIED_SIGNATURE' | 'IN_TRANSIT';
  riskScore?: number;
}

export const COLLABORATION_PACKETS: AgentMessagePacket[] = [
  {
    id: 'pkt-1',
    fromAgent: 'Intent Analyst',
    toAgent: 'Workflow Planner',
    messageType: 'PARSED_INTENT_ENVELOPE',
    timestamp: '12:04:18.040',
    latencyMs: 14,
    payloadSummary: 'Intent: VENDOR_DISBURSEMENT; Target: PO-88219; Confidence: 0.994',
    protocolStatus: 'VERIFIED_SIGNATURE',
  },
  {
    id: 'pkt-2',
    fromAgent: 'Workflow Planner',
    toAgent: 'Context Memory',
    messageType: 'QUERY_TEMPORAL_GRAPH',
    timestamp: '12:04:18.064',
    latencyMs: 18,
    payloadSummary: 'Request 90-day entity profile for VEND-NORTHWIND-01',
    protocolStatus: 'DELIVERED_ACK',
  },
  {
    id: 'pkt-3',
    fromAgent: 'Workflow Planner',
    toAgent: 'Policy Engine',
    messageType: 'EVALUATE_POLICY_BOUNDS',
    timestamp: '12:04:18.110',
    latencyMs: 31,
    payloadSummary: 'Request policy evaluation for $18,420 capital disbursement',
    protocolStatus: 'VERIFIED_SIGNATURE',
    riskScore: 0.81,
  },
  {
    id: 'pkt-4',
    fromAgent: 'Policy Engine',
    toAgent: 'Release Guardian',
    messageType: 'HUMAN_GATE_TRIGGER',
    timestamp: '12:04:18.150',
    latencyMs: 12,
    payloadSummary: 'FIN-042 threshold breached; Route execution to Human Dual-Key Gate',
    protocolStatus: 'DELIVERED_ACK',
  },
  {
    id: 'pkt-5',
    fromAgent: 'Release Guardian',
    toAgent: 'Task Executor',
    messageType: 'AUTHORIZED_DISPATCH_TOKEN',
    timestamp: '12:04:20.200',
    latencyMs: 16,
    payloadSummary: 'Operator dual-signature validated. Idempotency Token: IDP-93821',
    protocolStatus: 'VERIFIED_SIGNATURE',
  },
  {
    id: 'pkt-6',
    fromAgent: 'Task Executor',
    toAgent: 'Quality Reviewer',
    messageType: 'EXECUTION_RECEIPT_VERIFY',
    timestamp: '12:04:20.380',
    latencyMs: 22,
    payloadSummary: 'NetSuite REST Bank TX-ACH-8849201 settled. Request grounding proof.',
    protocolStatus: 'DELIVERED_ACK',
  },
];

export const AgentCollaborationCanvas: React.FC = () => {
  const [selectedPacketId, setSelectedPacketId] = useState<string>(COLLABORATION_PACKETS[2].id);

  const selectedPacket =
    COLLABORATION_PACKETS.find((p) => p.id === selectedPacketId) || COLLABORATION_PACKETS[0];

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Network size={15} className="text-[#3569A8]" />
          <div>
            <span className="eyebrow block">Inter-Agent Messaging Protocol</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Agent Collaboration Canvas & Message Exchange Bus
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#08795F] font-semibold">
          ● 6 Message Packets Exchanged
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Packet Exchange List */}
        <div className="lg:col-span-7 space-y-2 max-h-[380px] overflow-y-auto">
          {COLLABORATION_PACKETS.map((pkt, idx) => {
            const isSelected = pkt.id === selectedPacketId;
            return (
              <button
                key={pkt.id}
                type="button"
                onClick={() => setSelectedPacketId(pkt.id)}
                className={`w-full p-3 text-left rounded-[4px] border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-[#182536] text-white border-[#182536] shadow-2xs'
                    : 'bg-white text-[#182536] border-[#D5D5CE] hover:bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span>{pkt.fromAgent}</span>
                    <ArrowRight size={11} className={isSelected ? 'text-[#C3E6DB]' : 'text-[#5E6975]'} />
                    <span>{pkt.toAgent}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-slate-300' : 'text-[#5E6975]'
                    }`}
                  >
                    {pkt.timestamp}
                  </span>
                </div>

                <div
                  className={`text-[11px] font-mono truncate ${
                    isSelected ? 'text-slate-200' : 'text-[#52647B]'
                  }`}
                >
                  {pkt.messageType}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Packet Deep Inspector */}
        <div className="lg:col-span-5 border border-[#E5E3DB] rounded-[4px] p-4 bg-[#FAF9F5] space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E3DB] pb-2">
              <span className="eyebrow">Packet Inspector</span>
              <span className="text-[10px] font-mono text-[#08795F] bg-[#E6F7F2] px-1.5 py-0.5 rounded-[2px] font-semibold">
                {selectedPacket.protocolStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Sender Agent:</span>
                <span className="font-semibold text-[#182536]">{selectedPacket.fromAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Recipient Agent:</span>
                <span className="font-semibold text-[#182536]">{selectedPacket.toAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6975]">Transmission Latency:</span>
                <span className="text-[#08795F] font-semibold">{selectedPacket.latencyMs}ms</span>
              </div>
            </div>

            <div className="p-2.5 rounded-[3px] bg-white border border-[#E5E3DB] text-xs font-mono">
              <span className="text-[9px] uppercase text-[#5E6975] block mb-1">
                Payload Parameters
              </span>
              <p className="text-[#182536] leading-relaxed break-words">
                {selectedPacket.payloadSummary}
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#3569A8] pt-2 border-t border-[#E5E3DB]">
            Protocol: AXIOM Direct-Channel IPC (mTLS signed)
          </div>
        </div>
      </div>
    </div>
  );
};
