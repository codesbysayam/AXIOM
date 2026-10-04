import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Cpu,
  Layers,
  Maximize2,
  Minimize2,
  Radio,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { LiveMissionMap } from './LiveMissionMap';
import { ExecutionReplayStudio } from './ExecutionReplayStudio';
import { AutonomousDecisionStream } from './AutonomousDecisionStream';
import { LiveIncidentOverlay } from './LiveIncidentOverlay';
import { EventStreamRadar } from './EventStreamRadar';
import { AutonomyScoreCard } from './AutonomyScoreCard';
import { WhatIfDecisionSimulator } from './WhatIfDecisionSimulator';
import { DependencyImpactSimulator } from './DependencyImpactSimulator';
import { AgentDigitalTwinModal } from './AgentDigitalTwinModal';
import { RiskHeatmap } from './RiskHeatmap';
import { WorkflowJourneyView } from './WorkflowJourneyView';
import { StateDiffView } from './StateDiffView';
import { AgentCollaborationCanvas } from './AgentCollaborationCanvas';
import { SystemTimeTravel } from './SystemTimeTravel';
import { useOperationsStore } from '../../orchestrator/store';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export interface MissionControlModalProps {
  onClose: () => void;
}

export const MissionControlModal: React.FC<MissionControlModalProps> = ({ onClose }) => {
  const { approvals, approveRequest, rejectRequest, navigateTo } = useOperationsStore();
  const { activeIncidentSeverity, autonomyBreakdown } = useAxiomEventBus();

  const [activeTab, setActiveTab] = useState<
    | 'map'
    | 'replay'
    | 'whatif'
    | 'blast'
    | 'journey'
    | 'canvas'
    | 'risk'
    | 'diff'
    | 'timetravel'
  >('map');

  const [inspectAgentId, setInspectAgentId] = useState<string | null>(null);

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-control-title"
      className="fixed inset-0 z-50 bg-[#F7F5EE] overflow-y-auto flex flex-col"
    >
      {/* High-Density Top Control Strip */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-[#D5D5CE] bg-[#182536] text-white sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#08795F] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#C3E6DB]">
              AXIOM MISSION CONTROL
            </span>
          </div>
          <span className="text-slate-500 font-mono">/</span>
          <span className="text-xs font-mono text-slate-300">LIVE OPERATIONAL FABRIC</span>
        </div>

        {/* Live Top Metrics */}
        <div className="hidden md:flex items-center gap-5 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Fleet Health</span>
            <span className="font-bold text-[#08795F] text-sm">99.7%</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Autonomy Index</span>
            <span className="font-bold text-white text-sm">91.7 / 100</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Active Missions</span>
            <span className="font-bold text-[#3569A8] text-sm">07</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Human Gates</span>
            <span className="font-bold text-[#B97800] text-sm">
              0{pendingApprovals.length} PENDING
            </span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Active Incidents</span>
            <span
              className={`font-bold text-sm ${
                activeIncidentSeverity ? 'text-[#D72F40]' : 'text-[#08795F]'
              }`}
            >
              {activeIncidentSeverity ? '01 ACTIVE' : '00 NOMINAL'}
            </span>
          </div>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-[3px] text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Minimize2 size={13} />
          <span>Exit Mission Control</span>
        </button>
      </header>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-[#D5D5CE] bg-[#FFFDF8] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'map'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🌐 Live Mission Map
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('replay')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'replay'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🎬 Execution Replay Studio
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatif')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'whatif'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🧪 What-If Decision Simulator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('blast')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'blast'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🕸️ Dependency Blast Radius
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('journey')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'journey'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🗺️ Workflow Journey
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('canvas')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'canvas'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🧩 Agent Collaboration
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('risk')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'risk'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🔥 Risk Heatmap
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('diff')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'diff'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          🪄 State Diff
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timetravel')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors ${
            activeTab === 'timetravel'
              ? 'bg-[#182536] text-white'
              : 'text-[#40516A] hover:bg-[#F0EEE6]'
          }`}
        >
          ⏳ Time Travel
        </button>
      </div>

      {/* Main Mission Control Body */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Incident Alert Strip */}
        <LiveIncidentOverlay />

        {/* Tab View Container */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <LiveMissionMap onInspectAgent={(agentId) => setInspectAgentId(agentId)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <AutonomousDecisionStream maxItems={6} />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <EventStreamRadar />
                <AutonomyScoreCard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'replay' && (
          <div className="space-y-6">
            <ExecutionReplayStudio />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <StateDiffView />
              </div>
              <div className="lg:col-span-6">
                <WorkflowJourneyView />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'whatif' && (
          <div className="space-y-6">
            <WhatIfDecisionSimulator />
            <AutonomyScoreCard />
          </div>
        )}

        {activeTab === 'blast' && (
          <div className="space-y-6">
            <DependencyImpactSimulator />
            <LiveMissionMap onInspectAgent={(agentId) => setInspectAgentId(agentId)} />
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-6">
            <WorkflowJourneyView />
            <StateDiffView />
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="space-y-6">
            <AgentCollaborationCanvas />
            <LiveMissionMap onInspectAgent={(agentId) => setInspectAgentId(agentId)} />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <RiskHeatmap />
            <AutonomyScoreCard />
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="space-y-6">
            <StateDiffView />
            <ExecutionReplayStudio />
          </div>
        )}

        {activeTab === 'timetravel' && (
          <div className="space-y-6">
            <SystemTimeTravel />
            <LiveMissionMap onInspectAgent={(agentId) => setInspectAgentId(agentId)} />
          </div>
        )}
      </main>

      {/* Digital Twin Modal if requested */}
      {inspectAgentId && (
        <AgentDigitalTwinModal
          agentId={inspectAgentId}
          onClose={() => setInspectAgentId(null)}
          onSimulateOutage={(id) => {
            setActiveTab('blast');
            setInspectAgentId(null);
          }}
        />
      )}
    </div>
  );
};
