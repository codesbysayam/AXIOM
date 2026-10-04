import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { EXECUTION_THROUGHPUT_DATA, ThroughputPoint } from '../../data/runs';

export interface ThroughputChartProps {
  data?: ThroughputPoint[];
  className?: string;
}

export function ThroughputChart({
  data = EXECUTION_THROUGHPUT_DATA,
  className = '',
}: ThroughputChartProps) {
  return (
    <section className={`viz-panel p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            EXECUTION THROUGHPUT & AUTONOMY RATIO
          </span>
          <h3 className="text-base font-serif font-bold text-[#17263A] mt-0.5">
            Fleet Operations Workload
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#68758A]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00866B]" /> Autonomous Dispatch
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#B97800]" /> Human Intervened
          </span>
        </div>
      </div>

      <div className="chart-container pt-4 w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradAuto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00866B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00866B" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradHuman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B97800" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#B97800" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DFD6" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#40516A', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
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
                const d = payload[0].payload as ThroughputPoint;
                return (
                  <div className="bg-[#142238] text-white p-3 rounded-[6px] shadow-lg text-xs font-mono border border-slate-700">
                    <strong className="block text-slate-300 font-sans mb-1">{d.time} UTC Window</strong>
                    <div className="space-y-1">
                      <div className="text-emerald-400">Autonomous: {d.autonomous} runs</div>
                      <div className="text-amber-400">Human Intervened: {d.humanIntervened} gates</div>
                      <div className="text-rose-400">Policy Blocked: {d.blocked}</div>
                      <div className="border-t border-slate-700 pt-1 mt-1 text-slate-200 font-bold">
                        Total Volume: {d.runs} ops
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="autonomous"
              stroke="#00866B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradAuto)"
            />
            <Area
              type="monotone"
              dataKey="humanIntervened"
              stroke="#B97800"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradHuman)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
