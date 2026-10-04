import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  Workflow,
  Zap,
} from 'lucide-react';
import { MISSION_NODES } from './LiveMissionMap';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export interface DependencyImpactSimulatorProps {
  onHighlightBlastRadius?: (nodeIds: string[]) => void;
}

export const DependencyImpactSimulator: React.FC<DependencyImpactSimulatorProps> = ({
  onHighlightBlastRadius,
}) => {
  const { triggerIncidentOverlay, resolveIncidentOverlay } = useAxiomEventBus();
  const [selectedTargetId, setSelectedTargetId] = useState<string>('policy-engine');
  const [isSimulatingFailure, setIsSimulatingFailure] = useState<boolean>(false);

  // Compute transitive affected downstream nodes
  const blastRadius = useMemo(() => {
    const impacted = new Set<string>();
    function visit(id: string) {
      const node = MISSION_NODES.find((n) => n.id === id);
      if (!node) return;
      for (const targetId of node.downstream) {
        if (!impacted.has(targetId)) {
          impacted.add(targetId);
          visit(targetId);
        }
      }
    }
    visit(selectedTargetId);
    return Array.from(impacted);
  }, [selectedTargetId]);

  const targetNode = useMemo(
    () => MISSION_NODES.find((n) => n.id === selectedTargetId) || MISSION_NODES[4],
    [selectedTargetId],
  );

  const affectedWorkflows = useMemo(() => {
    if (selectedTargetId === 'policy-engine') {
      return [
        { id: 'wf-vendor-procurement', name: 'Vendor Procurement & Outlay Approval', risk: 'HIGH' },
        { id: 'wf-inventory-rebalance', name: 'Atomic ERP Inventory Rebalance', risk: 'MEDIUM' },
        { id: 'wf-security-remediation', name: 'Automated Vulnerability Patching', risk: 'CRITICAL' },
        { id: 'wf-customer-refund', name: 'Customer Charge Dispute & Refund', risk: 'MEDIUM' },
      ];
    }
    if (selectedTargetId === 'task-executor') {
      return [
        { id: 'wf-vendor-procurement', name: 'Vendor Procurement & Outlay Approval', risk: 'CRITICAL' },
        { id: 'wf-inventory-rebalance', name: 'Atomic ERP Inventory Rebalance', risk: 'HIGH' },
      ];
    }
    return [
      { id: 'wf-vendor-procurement', name: 'Vendor Procurement & Outlay Approval', risk: 'HIGH' },
    ];
  }, [selectedTargetId]);

  const handleSimulateFailure = () => {
    setIsSimulatingFailure(true);
    triggerIncidentOverlay('SEV-2', [selectedTargetId, ...blastRadius]);
    if (onHighlightBlastRadius) {
      onHighlightBlastRadius([selectedTargetId, ...blastRadius]);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulatingFailure(false);
    resolveIncidentOverlay();
  };

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <AlertOctagon size={15} className="text-[#D72F40]" />
          <div>
            <span className="eyebrow block">Cascade Failure Analysis</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Dependency Impact & Blast Radius Simulator
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSimulatingFailure ? (
            <button
              type="button"
              onClick={handleResetSimulation}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#182536] hover:bg-[#25354b] text-white text-xs font-semibold rounded-[3px] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Restore Operational Baseline</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSimulateFailure}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D72F40] hover:bg-[#b52030] text-white text-xs font-semibold rounded-[3px] transition-colors shadow-2xs"
            >
              <AlertTriangle size={12} />
              <span>Simulate Outage Injection</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Component Selector */}
        <div>
          <label className="text-xs font-mono font-semibold uppercase text-[#5E6975] block mb-1.5">
            Select Target Component / Agent to Fail:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MISSION_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setSelectedTargetId(node.id);
                  setIsSimulatingFailure(false);
                }}
                className={`p-2 text-left rounded-[3px] border transition-all text-xs font-sans ${
                  selectedTargetId === node.id
                    ? 'bg-[#182536] text-white border-[#182536] font-semibold'
                    : 'bg-white text-[#182536] border-[#D5D5CE] hover:bg-[#FAF9F5]'
                }`}
              >
                <div className="truncate">{node.label}</div>
                <div
                  className={`text-[9px] font-mono mt-0.5 ${
                    selectedTargetId === node.id ? 'text-slate-300' : 'text-[#5E6975]'
                  }`}
                >
                  {node.role.split('&')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blast Radius Impact Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Direct Target</span>
            <span className="text-xs font-sans font-bold text-[#182536] block mt-0.5">
              {targetNode.label}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Cascade Agents Impacted</span>
            <span className="text-base font-mono font-bold text-[#D72F40] block mt-0.5">
              {blastRadius.length} nodes
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Affected Pipelines</span>
            <span className="text-base font-mono font-bold text-[#8A5900] block mt-0.5">
              {affectedWorkflows.length} DAGs
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5E6975] block">Autonomous Recovery</span>
            <span className="text-xs font-sans font-semibold text-[#08795F] block mt-0.5">
              Standby Fallback Ready
            </span>
          </div>
        </div>

        {/* Visual Blast Radius Graph & Downstream Chains */}
        <div className="border border-[#E5E3DB] rounded-[4px] p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Transitive Downstream Blast Radius</span>
            <span className="text-[10px] font-mono text-[#D72F40] font-semibold">
              {isSimulatingFailure ? '● OUTAGE INJECTED' : 'READY TO SIMULATE'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Origin */}
            <div className="px-3 py-1.5 rounded-[3px] bg-[#FDF0ED] border border-[#F5C2B8] text-[#D72F40] font-bold">
              ⚡ ORIGIN: {targetNode.label}
            </div>

            <ArrowRight size={14} className="text-[#8898AA]" />

            {/* Downstream nodes */}
            {blastRadius.length === 0 ? (
              <span className="text-[#08795F] text-xs font-sans">
                No downstream dependencies. Zero cascade propagation.
              </span>
            ) : (
              blastRadius.map((downId) => {
                const node = MISSION_NODES.find((n) => n.id === downId);
                return (
                  <div
                    key={downId}
                    className={`px-2.5 py-1 rounded-[3px] border font-sans text-xs flex items-center gap-1 ${
                      isSimulatingFailure
                        ? 'bg-[#FEF3D6] text-[#8A5900] border-[#F9E2A8] animate-pulse'
                        : 'bg-[#FAF9F5] text-[#182536] border-[#D5D5CE]'
                    }`}
                  >
                    <span>⚠ {node?.label || downId}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Affected Pipelines Table */}
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-[#5E6975] tracking-wider block mb-1.5">
            Impacting Mission Pipelines
          </span>
          <div className="divide-y divide-[#E5E3DB] border border-[#E5E3DB] rounded-[4px] bg-white">
            {affectedWorkflows.map((wf) => (
              <div key={wf.id} className="p-2.5 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <Workflow size={13} className="text-[#3569A8]" />
                  <span className="font-semibold text-[#182536]">{wf.name}</span>
                  <span className="text-[10px] font-mono text-[#5E6975]">[{wf.id}]</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] ${
                    wf.risk === 'CRITICAL'
                      ? 'bg-[#FDF0ED] text-[#D72F40]'
                      : 'bg-[#FEF3D6] text-[#8A5900]'
                  }`}
                >
                  {wf.risk} RISK
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
