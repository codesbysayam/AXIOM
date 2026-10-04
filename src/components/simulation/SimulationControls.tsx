import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Repeat } from 'lucide-react';

export interface SimulationControlsProps {
  isRunning: boolean;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onReplay?: () => void;
  scenarioTitle?: string;
  policyId?: string;
  riskTier?: string;
  className?: string;
}

export function SimulationControls({
  isRunning,
  onRun,
  onPause,
  onStep,
  onReset,
  onReplay,
  scenarioTitle = 'Vendor Wire Transfer ($28,450 USD)',
  policyId = 'POL-FIN-01',
  riskTier = 'HIGH',
  className = '',
}: SimulationControlsProps) {
  return (
    <div className={`p-4 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      {/* Simulation Info */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#68758A] block font-semibold">
            ACTIVE SIMULATION SCENARIO
          </span>
          <div className="text-sm font-serif font-bold text-[#17263A] mt-0.5">
            {scenarioTitle}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7EE] border border-[#D5D1C7] rounded-[2px] text-[#17263A]">
            Policy: <strong>{policyId}</strong>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FFF2CC] border border-[#B97800] rounded-[2px] text-[#B97800] font-bold">
            Risk: {riskTier}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {isRunning ? (
          <button
            type="button"
            onClick={onPause}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B97800] hover:bg-[#9a6400] text-white rounded-[6px] text-xs font-semibold shadow-xs transition-colors"
          >
            <Pause size={13} />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onRun}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#142238] hover:bg-[#1f3556] text-white rounded-[6px] text-xs font-semibold shadow-xs transition-colors"
          >
            <Play size={13} />
            <span>RUN</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStep}
          disabled={isRunning}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FBFAF6] hover:bg-[#FAF7EE] border border-[#D5D1C7] text-[#17263A] rounded-[6px] text-xs font-medium transition-colors disabled:opacity-50"
          title="Advance single tick"
        >
          <SkipForward size={13} />
          <span>STEP</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FBFAF6] hover:bg-[#FAF7EE] border border-[#D5D1C7] text-[#17263A] rounded-[6px] text-xs font-medium transition-colors"
          title="Reset simulation state"
        >
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>

        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FBFAF6] hover:bg-[#FAF7EE] border border-[#D5D1C7] text-[#17263A] rounded-[6px] text-xs font-medium transition-colors"
            title="Replay execution theater"
          >
            <Repeat size={13} />
            <span>REPLAY</span>
          </button>
        )}
      </div>
    </div>
  );
}
