import React, { useState } from 'react';
import { OPERATIONAL_AGENTS } from '../../data/agents';
import { Agent } from '../../types/operations';

export interface AgentHeatmapProps {
  agents?: Agent[];
  onSelectAgent?: (agent: Agent) => void;
  className?: string;
}

export function AgentHeatmap({
  agents = OPERATIONAL_AGENTS,
  onSelectAgent,
  className = '',
}: AgentHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    agent: string;
    window: string;
    rate: number;
    runs: number;
  } | null>(null);

  const timeWindows = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Deterministic seeded performance matrix for the 8 agents across 8 time windows
  const heatmapMatrix: Record<string, number[]> = {
    'agent-context': [100, 100, 99.8, 100, 99.7, 100, 100, 99.9],
    'agent-intent': [99.5, 99.4, 99.6, 99.2, 99.4, 99.5, 99.1, 99.4],
    'agent-planner': [99.2, 99.0, 99.4, 98.8, 99.1, 99.3, 99.0, 99.2],
    'agent-executor': [99.0, 98.5, 98.9, 98.2, 97.8, 98.7, 98.4, 98.8],
    'agent-reviewer': [100, 99.8, 99.6, 99.7, 99.5, 99.6, 99.8, 99.6],
    'agent-validator': [99.6, 99.4, 99.5, 99.1, 99.5, 99.8, 99.2, 99.5],
    'agent-guardian': [100, 100, 100, 100, 100, 100, 100, 100],
    'agent-sentinel': [100, 99.9, 100, 99.8, 99.9, 100, 99.9, 99.9],
  };

  const getCellColor = (rate: number) => {
    if (rate >= 99.5) return 'bg-[#00866B] text-white';
    if (rate >= 98.5) return 'bg-[#00866B]/80 text-white';
    if (rate >= 97.5) return 'bg-[#B97800] text-white';
    return 'bg-[#C93645] text-white';
  };

  return (
    <section className={`viz-panel p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            FLEET RELIABILITY MATRIX
          </span>
          <h3 className="text-base font-serif font-bold text-[#17263A] mt-0.5">
            Agent Performance Heatmap (Last 8 Hours)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#68758A]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00866B]" /> &gt;= 99.5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B97800]" /> 97.5 - 99.4%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C93645]" /> &lt; 97.5%
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pt-4">
        <table className="w-full border-collapse text-left font-mono text-xs">
          <thead>
            <tr>
              <th className="py-2 px-3 text-[10px] font-semibold uppercase text-[#68758A] border-b border-[#D5D1C7]">
                Agent Node ({agents.length})
              </th>
              {timeWindows.map((tw) => (
                <th
                  key={tw}
                  className="py-2 px-2 text-[10px] font-semibold text-center text-[#68758A] border-b border-[#D5D1C7]"
                >
                  {tw}
                </th>
              ))}
              <th className="py-2 px-3 text-[10px] font-semibold text-right text-[#68758A] border-b border-[#D5D1C7]">
                24h Mean
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5D1C7]/40">
            {agents.map((agent) => {
              const rates = heatmapMatrix[agent.id] || [99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5];
              return (
                <tr
                  key={agent.id}
                  onClick={() => onSelectAgent?.(agent)}
                  className="hover:bg-[#FAF7EE] transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-xs text-[#17263A] font-sans flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00866B]" />
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-[#68758A]">{agent.domain}</div>
                  </td>
                  {rates.map((rate, i) => (
                    <td key={i} className="p-1 text-center">
                      <div
                        onMouseEnter={() =>
                          setHoveredCell({
                            agent: agent.name,
                            window: timeWindows[i],
                            rate,
                            runs: Math.round(agent.tasksCompleted / 24),
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`py-1.5 px-1 rounded-[3px] text-[10px] font-bold transition-transform hover:scale-105 ${getCellColor(
                          rate,
                        )}`}
                      >
                        {rate.toFixed(1)}%
                      </div>
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right font-bold text-[#00866B]">
                    {agent.successRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hoveredCell && (
        <div className="mt-3 p-2 bg-[#142238] text-white rounded-[4px] text-xs font-mono flex items-center justify-between">
          <span>
            <strong>{hoveredCell.agent}</strong> @ {hoveredCell.window} UTC
          </span>
          <span className="text-emerald-400">
            Success Rate: <strong>{hoveredCell.rate}%</strong> ({hoveredCell.runs} tasks sampled)
          </span>
        </div>
      )}
    </section>
  );
}
