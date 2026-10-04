import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { LATENCY_PERCENTILES_DATA, LatencyPercentilePoint } from '../../data/runs';

export interface LatencyChartProps {
  data?: LatencyPercentilePoint[];
  className?: string;
}

export function LatencyChart({
  data = LATENCY_PERCENTILES_DATA,
  className = '',
}: LatencyChartProps) {
  return (
    <section className={`viz-panel p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            LATENCY DISTRIBUTION PERCENTILES
          </span>
          <h3 className="text-base font-serif font-bold text-[#17263A] mt-0.5">
            P50 / P75 / P95 / P99 Agent Latency
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#68758A]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#00866B]" /> P50
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#3569A8]" /> P75
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#B97800]" /> P95
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#C93645]" /> P99
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-0.5 border-t border-dashed border-slate-400" /> Baseline SLA
          </span>
        </div>
      </div>

      <div className="chart-container pt-4 w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DFD6" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#40516A', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={{ stroke: '#D5D1C7' }}
              tickLine={false}
            />
            <YAxis
              unit="ms"
              tick={{ fill: '#68758A', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={{ stroke: '#D5D1C7' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as LatencyPercentilePoint;
                return (
                  <div className="bg-[#142238] text-white p-3 rounded-[6px] shadow-lg text-xs font-mono border border-slate-700">
                    <strong className="block text-slate-300 font-sans mb-1">{d.time} Window</strong>
                    <div className="space-y-1">
                      <div className="text-emerald-400">P50 Median: {d.p50}ms</div>
                      <div className="text-sky-400">P75: {d.p75}ms</div>
                      <div className="text-amber-400">P95 Tail: {d.p95}ms</div>
                      <div className="text-rose-400">P99 Maximum: {d.p99}ms</div>
                      <div className="text-slate-400 border-t border-slate-700 pt-1 mt-1">
                        SLA Baseline: {d.baseline}ms
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine y={250} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: 'SLA Baseline 250ms', fill: '#6B7280', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="p50" stroke="#00866B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="p75" stroke="#3569A8" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="p95" stroke="#B97800" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="p99" stroke="#C93645" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
