import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { RISK_DISTRIBUTION_DATA, RiskBucket } from '../../data/runs';

export interface RiskDonutProps {
  data?: RiskBucket[];
  totalRuns?: number;
  className?: string;
  onSliceClick?: (bucket: RiskBucket) => void;
}

export function RiskDonut({
  data = RISK_DISTRIBUTION_DATA,
  totalRuns = 1281,
  className = '',
  onSliceClick,
}: RiskDonutProps) {
  return (
    <section className={`viz-panel p-5 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] flex flex-col justify-between ${className}`}>
      <div className="pb-3 border-b border-[#D5D1C7]/70">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
          RISK DISTRIBUTION
        </span>
        <h3 className="text-base font-serif font-bold text-[#17263A] mt-0.5">
          Execution Risk Profile
        </h3>
      </div>

      <div className="relative w-full h-[260px] flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={74}
              outerRadius={106}
              paddingAngle={3}
              stroke="#FFFDF8"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                  onClick={() => onSliceClick?.(entry)}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as RiskBucket;
                return (
                  <div className="bg-[#142238] text-white p-2.5 rounded-[6px] shadow-lg text-xs font-mono border border-slate-700">
                    <strong className="block text-amber-300 font-sans">{d.name} Risk Tier</strong>
                    <div>{d.value} runs ({d.percentage}%)</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <strong className="text-2xl font-mono font-bold text-[#17263A] tracking-tight">
            {totalRuns.toLocaleString()}
          </strong>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A]">
            TOTAL RUNS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D5D1C7]/70 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col">
            <span className="flex items-center gap-1.5 text-[#68758A] text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-mono font-semibold text-[#17263A] text-xs mt-0.5">
              {item.value} <span className="text-[10px] text-[#68758A]">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
