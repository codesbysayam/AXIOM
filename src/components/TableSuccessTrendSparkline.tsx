import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface TableSuccessTrendSparklineProps {
  currentRate: number;
  trendData: number[];
  days?: string[];
  label?: string;
}

export const TableSuccessTrendSparkline: React.FC<TableSuccessTrendSparklineProps> = ({
  currentRate,
  trendData,
  days = ['7d ago', '6d ago', '5d ago', '4d ago', '3d ago', 'Yesterday', 'Today'],
  label,
}) => {
  const chartData = trendData.map((val, idx) => ({
    day: days[idx] || `Day ${idx + 1}`,
    value: val,
  }));

  const firstValue = trendData[0] ?? currentRate;
  const lastValue = trendData[trendData.length - 1] ?? currentRate;
  const delta = Number((lastValue - firstValue).toFixed(1));
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  const strokeColor = lastValue >= 99 ? '#08795F' : lastValue >= 98 ? '#138468' : '#A87405';

  return (
    <div className="flex items-center gap-2 group" title={label || `7-Day Success Trend: ${lastValue}% (${delta >= 0 ? '+' : ''}${delta}% past 7 days)`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-semibold" style={{ color: strokeColor }}>
            {lastValue.toFixed(1)}%
          </span>
          <span className="flex items-center text-[9px] font-mono text-[#5E6975]">
            {isPositive && <TrendingUp size={9} className="text-[#08795F] inline mr-0.5" />}
            {isNegative && <TrendingDown size={9} className="text-[#D72F40] inline mr-0.5" />}
            {!isPositive && !isNegative && <Minus size={9} className="text-[#5E6975] inline mr-0.5" />}
            <span className={isPositive ? 'text-[#08795F]' : isNegative ? 'text-[#D72F40]' : 'text-[#5E6975]'}>
              {delta > 0 ? `+${delta}%` : `${delta}%`}
            </span>
          </span>
        </div>
      </div>

      {/* 7-Day Sparkline */}
      <div className="w-18 h-5 bg-[#FAF9F5] rounded-[2px] border border-[#D5D5CE]/80 p-0.5 overflow-hidden flex items-center justify-center">
        <LineChart
          width={68}
          height={18}
          data={chartData}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <Tooltip
            cursor={{ stroke: '#889096', strokeWidth: 1, strokeDasharray: '2 2' }}
            isAnimationActive={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload;
                return (
                  <div className="bg-[#182536] text-[#FFFDF8] text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] shadow-xs pointer-events-none whitespace-nowrap z-50">
                    <span className="text-[#A5B4C7]">{dataPoint.day}:</span> {payload[0].value}%
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
    </div>
  );
};
