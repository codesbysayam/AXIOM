import React from 'react';
import { Activity, Clock, Pause, Play, ShieldCheck, SkipForward, Users, Workflow } from 'lucide-react';
import { useOperationsStore } from '../orchestrator/store';
import { axiomDemoData } from '../data/axiomDemoData';

export function SystemPulseRail() {
  const {
    workflows,
    approvals,
    auditLogs,
    openInspector,
    navigateTo,
    simulationClock,
    toggleClock,
    advanceClockTick,
  } = useOperationsStore();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const latestLog = auditLogs[0] || {
    timestamp: simulationClock.epochTime,
    details: 'Audit proof committed with SHA-256 integrity signature',
  };

  return (
    <section className="system-pulse-rail" aria-label="System telemetry pulse">
      <div className="pulse-status">
        <span
          className={`pulse-live-dot ${simulationClock.isRunning ? 'bg-[#08795F]' : 'bg-[#9A6900]'}`}
          aria-hidden="true"
        />
        <strong>{simulationClock.isRunning ? 'SYSTEM NOMINAL' : 'CLOCK PAUSED'}</strong>
      </div>

      {/* Centralized Simulation Clock Indicator */}
      <div
        className="pulse-metric flex items-center gap-1.5 border-0 text-left font-mono"
        title="Centralized Simulation Clock (Coordinating DAG state transitions & telemetry)"
      >
        <Clock size={12} className="text-[#5E6975]" />
        <span className="text-[11px] font-bold text-[#182536]">
          TICK #{simulationClock.tick}
        </span>
        <button
          type="button"
          onClick={toggleClock}
          className="p-1 hover:bg-[#FAF9F5] rounded text-[#5E6975] hover:text-[#182536] transition-colors"
          title={simulationClock.isRunning ? 'Pause simulation clock' : 'Resume simulation clock'}
          aria-label={simulationClock.isRunning ? 'Pause simulation clock' : 'Resume simulation clock'}
        >
          {simulationClock.isRunning ? <Pause size={10} /> : <Play size={10} />}
        </button>
        <button
          type="button"
          onClick={advanceClockTick}
          className="p-1 hover:bg-[#FAF9F5] rounded text-[#5E6975] hover:text-[#182536] transition-colors"
          title="Step clock forward by 1 tick"
          aria-label="Step clock forward by 1 tick"
        >
          <SkipForward size={10} />
        </button>
      </div>

      {/* Interactive 08/08 AGENTS button (Point 3) */}
      <button
        type="button"
        onClick={() => openInspector('agents')}
        className="pulse-metric hover:bg-[#FAF9F5] transition-colors cursor-pointer border-0 text-left"
        title="Inspect Agent Fleet (8/8 nodes active)"
        aria-label="Inspect Agent Fleet"
      >
        <Users size={13} className="text-[#5E6975]" />
        <span>0{axiomDemoData.agents.healthy}/0{axiomDemoData.agents.total}</span>
        <small className="underline decoration-dotted">AGENTS</small>
      </button>

      {/* Interactive 04 PIPELINES button (Point 3) */}
      <button
        type="button"
        onClick={() => openInspector('pipelines')}
        className="pulse-metric hover:bg-[#FAF9F5] transition-colors cursor-pointer border-0 text-left"
        title="Inspect Active Orchestration Pipelines"
        aria-label="Inspect Active Pipelines"
      >
        <Workflow size={13} className="text-[#5E6975]" />
        <span>0{workflows.length}</span>
        <small className="underline decoration-dotted">PIPELINES</small>
      </button>

      {/* Interactive HUMAN GATES button (Point 3) */}
      <button
        type="button"
        onClick={() => navigateTo('approvals')}
        className={`pulse-metric hover:bg-[#FFF7DF] transition-colors cursor-pointer border-0 text-left ${
          pendingApprovalsCount > 0 ? 'pulse-warning' : ''
        }`}
        title="Review Human Authority Decision Gates"
        aria-label="Review Human Authority Decision Gates"
      >
        <ShieldCheck
          size={13}
          className={pendingApprovalsCount > 0 ? 'text-[#A66A00]' : 'text-[#08795F]'}
        />
        <span>0{pendingApprovalsCount}</span>
        <small className="underline decoration-dotted">HUMAN GATES</small>
      </button>

      <div className="pulse-event">
        <span>{latestLog.timestamp}</span>
        <strong>{latestLog.details}</strong>
      </div>

      <div className="pulse-live">
        <span>LIVE</span>
        <Activity size={13} />
      </div>
    </section>
  );
}
