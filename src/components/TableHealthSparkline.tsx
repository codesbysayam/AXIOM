import React from 'react';
import { LineChart, Line, Tooltip } from 'recharts';

export interface TableHealthSparklineProps {
  data: number[];
  color?: string;
  label?: string;
}

export const TableHealthSparkline: React.FC<TableHealthSparklineProps> = ({
  data,
  color,
  label,
}) => {
  const chartData = data.map((val, idx) => ({ i: idx, value: val }));
  const latestValue = data[data.length - 1] ?? 100;
  const isHealthy = latestValue >= 95;
  const strokeColor = color || (isHealthy ? '#138468' : latestValue >= 80 ? '#A87405' : '#D72F40');

  return (
    <div
      className="flex items-center gap-2 group"
      title={label || `Health Score: ${latestValue}%`}
    >
      <div className="w-16 h-5 bg-[#FAF9F5] rounded-[2px] border border-[#D5D5CE]/80 p-0.5 overflow-hidden flex items-center justify-center">
        <LineChart
          width={60}
          height={18}
          data={chartData}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#182536] text-[#FFFDF8] text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] shadow-xs pointer-events-none">
                    {payload[0].value}%
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color: strokeColor }}>
        {latestValue}%
      </span>
    </div>
  );
};
