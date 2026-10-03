import React from 'react';
import { BarChart3, Clock, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { AgentThroughputSparkline } from '../components/AgentThroughputSparkline';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#dce1e7] pb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#718096] block">
          Operational Metrics
        </span>
        <h1 className="text-2xl font-serif font-bold text-[#17263d] mt-1">
          Fleet Analytics & Operational Efficiency
        </h1>
        <p className="text-xs text-[#40516a] mt-0.5">
          Quantified metrics on human intervention ratios, task latency, and execution reliability
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[#dce1e7] bg-white rounded-[2px] divide-y lg:divide-y-0 lg:divide-x divide-[#dce1e7] shadow-2xs">
        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Autonomous Ratio
          </span>
          <div className="text-2xl font-bold font-mono text-[#159a72] mt-0.5">94.2%</div>
          <span className="text-[11px] text-[#718096] font-mono mt-1 block">
            5.8% routed through human gates
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Median Resolution
          </span>
          <div className="text-2xl font-bold font-mono text-[#17263d] mt-0.5">340ms</div>
          <span className="text-[11px] text-[#159a72] font-mono mt-1 block">
            -42ms vs previous baseline
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Operator Approval SLA
          </span>
          <div className="text-2xl font-bold font-mono text-[#17263d] mt-0.5">3.4 min</div>
          <span className="text-[11px] text-[#718096] font-mono mt-1 block">
            Target SLA: under 15 min
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase text-[#718096] block">
            Cost Avoidance
          </span>
          <div className="text-2xl font-bold font-mono text-[#159a72] mt-0.5">$42,850</div>
          <span className="text-[11px] text-[#718096] font-mono mt-1 block">
            Anomalous overbilling intercepted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="axiom-panel p-5 bg-white shadow-2xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#718096] font-mono mb-2">
            Execution Velocity Trend (7 Days)
          </h3>
          <div className="p-3 bg-[#fbfaf7] rounded-[2px] border border-[#dce1e7]">
            <AgentThroughputSparkline height={64} color="#17263d" />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#718096] mt-2">
            <span>Day 01: 1,420 runs</span>
            <span>Day 07: 2,140 runs</span>
          </div>
        </div>

        <div className="axiom-panel p-5 bg-white shadow-2xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#718096] font-mono mb-2">
            Latency Percentiles (ms)
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px]">
              <span className="text-[#40516a]">p50 Median</span>
              <span className="font-bold text-[#17263d]">142 ms</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px]">
              <span className="text-[#40516a]">p95 Tail Latency</span>
              <span className="font-bold text-[#17263d]">420 ms</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#fbfaf7] border border-[#dce1e7] rounded-[2px]">
              <span className="text-[#40516a]">p99 Outlier Latency</span>
              <span className="font-bold text-[#d99000]">890 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
