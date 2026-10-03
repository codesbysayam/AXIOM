import React from 'react';
import { BarChart3, Clock, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { AgentThroughputSparkline } from '../components/AgentThroughputSparkline';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Fleet Analytics & Operational Efficiency
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Quantified metrics on human intervention ratios, task latency, and execution reliability
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Autonomous Ratio
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">94.2%</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            5.8% routed through human gates
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Median Resolution Time
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">340ms</div>
          <span className="text-[11px] text-emerald-600 font-mono mt-1 block">
            -42ms vs previous month
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Operator Approval SLA
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">3.4 min</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Target SLA is under 15 min
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Cost Avoidance
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">42,850 USD</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Anomalous overbilling intercepted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-2">
            Execution Velocity Trend (7 Days)
          </h3>
          <div className="p-3 bg-slate-50 rounded border border-slate-200/80">
            <AgentThroughputSparkline height={64} color="#1b2e49" />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Oct 01: 1,420 runs</span>
            <span>Oct 07: 2,140 runs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-2">
            Latency Percentiles (ms)
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span className="text-slate-600">p50 Median</span>
              <span className="font-bold text-slate-900">142 ms</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span className="text-slate-600">p95 Tail Latency</span>
              <span className="font-bold text-slate-900">420 ms</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span className="text-slate-600">p99 Outlier Latency</span>
              <span className="font-bold text-amber-700">890 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
