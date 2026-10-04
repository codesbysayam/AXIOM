import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PIPELINE_OUTCOMES_DATA, PipelineOutcomeData } from '../../data/runs';

export interface SuccessBarChartProps {
  data?: PipelineOutcomeData[];
  onBarClick?: (item: PipelineOutcomeData) => void;
  className?: string;
}

export function SuccessBarChart({
  data = PIPELINE_OUTCOMES_DATA,
  onBarClick,
  className = '',
}: SuccessBarChartProps) {
  return (
    <section className={`viz-panel p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            EXECUTION OUTCOMES
          </span>
          <h3 className="text-base font-serif font-bold text-[#17263A] mt-0.5">
            Pipeline Reliability & Policy Blocks
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#68758A]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00866B]" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B97800]" /> Blocked / Held
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C93645]" /> Failed
          </span>
        </div>
      </div>

      <div className="chart-container pt-4 w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DFD6" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#40516A', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              axisLine={{ stroke: '#D5D1C7' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#68758A', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={{ stroke: '#D5D1C7' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as PipelineOutcomeData;
                return (
                  <div className="bg-[#142238] text-white p-3 rounded-[6px] shadow-lg text-xs font-mono border border-slate-700">
                    <strong className="block text-amber-300 font-sans mb-1 text-sm">{d.name}</strong>
                    <div className="space-y-1">
                      <div className="text-emerald-400">Completed: {d.completed}</div>
                      <div className="text-amber-400">Blocked: {d.blocked}</div>
                      <div className="text-rose-400">Failed: {d.failed}</div>
                      <div className="text-slate-300 border-t border-slate-700 pt-1 mt-1">
                        Success Rate: {d.successRate}% ({d.total} runs)
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="completed"
              fill="#00866B"
              radius={[3, 3, 0, 0]}
              onClick={(entry) => onBarClick?.(entry as any)}
              className="cursor-pointer hover:opacity-85 transition-opacity"
            />
            <Bar
              dataKey="blocked"
              fill="#B97800"
              radius={[3, 3, 0, 0]}
              onClick={(entry) => onBarClick?.(entry as any)}
              className="cursor-pointer hover:opacity-85 transition-opacity"
            />
            <Bar
              dataKey="failed"
              fill="#C93645"
              radius={[3, 3, 0, 0]}
              onClick={(entry) => onBarClick?.(entry as any)}
              className="cursor-pointer hover:opacity-85 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
