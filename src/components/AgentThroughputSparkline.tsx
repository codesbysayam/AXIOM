import React from 'react';

export interface AgentThroughputSparklineProps {
  data?: number[];
  color?: string;
  height?: number;
}

export const AgentThroughputSparkline: React.FC<AgentThroughputSparklineProps> = ({
  data = [12, 18, 15, 24, 28, 22, 35, 30, 42, 38, 45, 52, 48, 60],
  color = '#2563eb',
  height = 36,
}) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};
