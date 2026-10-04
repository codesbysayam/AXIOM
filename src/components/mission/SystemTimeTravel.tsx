import React from 'react';
import { Clock, History, RotateCcw, ShieldCheck, Undo } from 'lucide-react';
import { useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export const SystemTimeTravel: React.FC = () => {
  const { snapshots, selectedSnapshotId, setSnapshot } = useAxiomEventBus();

  const currentSnapshot =
    snapshots.find((s) => s.id === selectedSnapshotId) || snapshots[snapshots.length - 1];

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <History size={15} className="text-[#3569A8]" />
          <div>
            <span className="eyebrow block">Deterministic State Reconstruction</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              System Time Travel & Immutable Snapshot Scrubber
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#5E6975]">
          Selected: <span className="font-semibold text-[#182536]">{currentSnapshot.timestamp}</span>
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Timeline Snapshots Selector Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-[#E5E3DB]">
          {snapshots.map((snap) => {
            const isSelected = snap.id === selectedSnapshotId;
            return (
              <button
                key={snap.id}
                type="button"
                onClick={() => setSnapshot(snap.id)}
                className={`flex-1 min-w-[140px] p-2.5 text-left rounded-[4px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#182536] text-white border-[#182536] shadow-2xs'
                    : 'bg-[#FAF9F5] text-[#182536] border-[#D5D5CE] hover:bg-[#F0EEE6]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isSelected ? 'text-[#C3E6DB]' : 'text-[#3569A8]'
                    }`}
                  >
                    {snap.timestamp}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#08795F]" />}
                </div>
                <div className="text-xs font-sans font-semibold truncate">
                  {snap.label}
                </div>
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    isSelected ? 'text-slate-300' : 'text-[#8898AA]'
                  }`}
                >
                  Health: {snap.fleetHealth}% · Autonomy: {snap.autonomyScore}
                </div>
              </button>
            );
          })}
        </div>

        {/* Snapshot System State Reconstruction Box */}
        <div className="p-4 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DB] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E3DB] pb-2">
            <div>
              <span className="eyebrow">Reconstructed Operational Snapshot</span>
              <h4 className="text-base font-serif font-semibold text-[#182536]">
                {currentSnapshot.label} ({currentSnapshot.timestamp})
              </h4>
            </div>
            <span className="text-xs font-mono text-[#08795F] font-semibold">
              ● Deterministic State Signature Verified
            </span>
          </div>

          <p className="text-xs font-sans text-[#52647B] leading-relaxed">
            {currentSnapshot.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-mono">
            <div className="p-2 bg-white rounded-[3px] border border-[#E5E3DB]">
              <span className="text-[#5E6975] text-[10px] uppercase block">Fleet Health</span>
              <span className="font-bold text-[#08795F] text-sm mt-0.5 block">
                {currentSnapshot.fleetHealth}%
              </span>
            </div>
            <div className="p-2 bg-white rounded-[3px] border border-[#E5E3DB]">
              <span className="text-[#5E6975] text-[10px] uppercase block">Active Executions</span>
              <span className="font-bold text-[#182536] text-sm mt-0.5 block">
                0{currentSnapshot.activeExecutions} runs
              </span>
            </div>
            <div className="p-2 bg-white rounded-[3px] border border-[#E5E3DB]">
              <span className="text-[#5E6975] text-[10px] uppercase block">Pending Human Gates</span>
              <span className="font-bold text-[#8A5900] text-sm mt-0.5 block">
                0{currentSnapshot.pendingApprovals} requests
              </span>
            </div>
            <div className="p-2 bg-white rounded-[3px] border border-[#E5E3DB]">
              <span className="text-[#5E6975] text-[10px] uppercase block">Active Incidents</span>
              <span
                className={`font-bold text-sm mt-0.5 block ${
                  currentSnapshot.activeIncidents > 0 ? 'text-[#D72F40]' : 'text-[#08795F]'
                }`}
              >
                0{currentSnapshot.activeIncidents} active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
