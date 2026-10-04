import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  DollarSign,
  Info,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { AgentThroughputSparkline } from '../components/AgentThroughputSparkline';
import { axiomDemoData } from '../data/axiomDemoData';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D5CE] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6975] block">
            Measured Assurance
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#182536] mt-1">
            Fleet Analytics & Execution Performance
          </h1>
          <p className="text-xs text-[#334256] mt-0.5">
            Empirically measured operational metrics, safety ratios, latency distributions, and cost avoidance
          </p>
        </div>

        {/* Required label: SIMULATED OPERATIONS DATA (Point 8, 9) */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF7DF] text-[#A66A00] border border-[#E1BF70] text-xs font-mono font-semibold rounded-[2px]">
            <Info size={13} />
            <span>SIMULATED OPERATIONS DATA</span>
          </span>
        </div>
      </div>

      {/* Dataset Context Bar (Point 9) */}
      <div className="p-3.5 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-[#5E6975]">EVALUATION PERIOD:</span>
          <strong className="text-[#182536]">Last 7 days</strong>
          <span className="text-[#D5D5CE]">|</span>
          <span className="text-[#5E6975]">SAMPLE SIZE:</span>
          <strong className="text-[#182536]">{axiomDemoData.executions.currentPeriodRuns.toLocaleString()} runs</strong>
          <span className="text-[#D5D5CE]">|</span>
          <span className="text-[#5E6975]">HISTORICAL BENCHMARK:</span>
          <strong className="text-[#182536]">{axiomDemoData.executions.historicalBenchmark.toLocaleString()} runs</strong>
        </div>

        <div className="text-[11px] text-[#08795F]">
          Fleet Availability: <b>{axiomDemoData.fleet.availability}%</b>
        </div>
      </div>

      {/* Primary KPI Ribbon (Point 8: Autonomous completion rate, Human intervention rate, Median latency, Cost avoidance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[2px] divide-y sm:divide-y-0 sm:divide-x divide-[#D5D5CE] shadow-2xs">
        {/* Metric 1: Autonomous Completion Rate */}
        <div className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            Autonomous Completion Rate
          </span>
          <div className="text-2xl font-bold font-mono text-[#08795F]">
            {axiomDemoData.executions.autonomousRate}%
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5E6975] pt-1">
            <span className="flex items-center gap-0.5 text-[#08795F]">
              <ArrowUpRight size={12} /> +1.4% vs last week
            </span>
            <span>n = {axiomDemoData.executions.currentPeriodRuns}</span>
          </div>
        </div>

        {/* Metric 2: Human Intervention Rate */}
        <div className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            Human Intervention Ratio
          </span>
          <div className="text-2xl font-bold font-mono text-[#A66A00]">
            {axiomDemoData.executions.interventionRate}%
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5E6975] pt-1">
            <span className="flex items-center gap-0.5 text-[#08795F]">
              <ArrowDownRight size={12} /> -0.8% threshold trips
            </span>
            <span>n = 124 gates</span>
          </div>
        </div>

        {/* Metric 3: Median Resolution Latency */}
        <div className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            Median DAG Resolution
          </span>
          <div className="text-2xl font-bold font-mono text-[#182536]">
            {axiomDemoData.latency.p50} ms
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5E6975] pt-1">
            <span className="flex items-center gap-0.5 text-[#08795F]">
              <ArrowDownRight size={12} /> -18ms faster
            </span>
            <span>p50 distribution</span>
          </div>
        </div>

        {/* Metric 4: Cost Avoidance */}
        <div className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5E6975] block font-semibold">
            Intercepted Cost Avoidance
          </span>
          <div className="text-2xl font-bold font-mono text-[#08795F]">
            ${axiomDemoData.executions.costAvoidanceUsd.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5E6975] pt-1">
            <span className="text-[#08795F]">Anomalous invoices caught</span>
            <span>Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid: Policy Block Rate, Rollback Rate, Approval SLA, Recovery Time */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-1 shadow-2xs">
          <span className="text-[9px] uppercase text-[#5E6975] block">Policy Block Rate</span>
          <strong className="text-lg font-bold text-[#182536]">{axiomDemoData.governance.blockRate}%</strong>
          <span className="text-[10px] text-[#5E6975] block">27 intercept halts</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-1 shadow-2xs">
          <span className="text-[9px] uppercase text-[#5E6975] block">Rollback Rate</span>
          <strong className="text-lg font-bold text-[#08795F]">{axiomDemoData.pipelines.rollbackRate}%</strong>
          <span className="text-[10px] text-[#08795F] block">Zero data loss</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-1 shadow-2xs">
          <span className="text-[9px] uppercase text-[#5E6975] block">Mean Approval SLA</span>
          <strong className="text-lg font-bold text-[#182536]">{axiomDemoData.approvals.slaMinutes} min</strong>
          <span className="text-[10px] text-[#5E6975] block">Target: &lt; 15 min</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] space-y-1 shadow-2xs">
          <span className="text-[9px] uppercase text-[#5E6975] block">Pipeline Success</span>
          <strong className="text-lg font-bold text-[#08795F]">{axiomDemoData.pipelines.successRate}%</strong>
          <span className="text-[10px] text-[#08795F] block">All topologies</span>
        </div>
      </div>

      {/* Charts & Latency Percentiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Execution Velocity Trend */}
        <div className="axiom-panel p-5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#182536]">
              Execution Throughput Trend (7-Day Trace)
            </h3>
            <span className="text-[10px] font-mono text-[#5E6975]">Daily Resolution Count</span>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-[2px] border border-[#D5D5CE]">
            <AgentThroughputSparkline height={80} color="#182536" />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-[#5E6975] pt-1">
            <span>Day 01: 1,420 runs</span>
            <span>Day 04: 1,840 runs</span>
            <span>Day 07: 2,140 runs</span>
          </div>
        </div>

        {/* Latency Percentiles */}
        <div className="axiom-panel p-5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#182536]">
              Latency Percentiles (Millisecond Distribution)
            </h3>
            <span className="text-[10px] font-mono text-[#5E6975]">Empirical P-values</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px]">
              <div>
                <span className="text-[#182536] font-bold block">p50 Median Latency</span>
                <span className="text-[10px] text-[#5E6975]">Routine autonomous execution path</span>
              </div>
              <span className="text-sm font-bold text-[#08795F]">{axiomDemoData.latency.p50} ms</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px]">
              <div>
                <span className="text-[#182536] font-bold block">p95 Tail Latency</span>
                <span className="text-[10px] text-[#5E6975]">Includes multi-agent context vector lookup</span>
              </div>
              <span className="text-sm font-bold text-[#182536]">{axiomDemoData.latency.p95} ms</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[2px]">
              <div>
                <span className="text-[#182536] font-bold block">p99 Outlier Latency</span>
                <span className="text-[10px] text-[#5E6975]">Worst-case sandbox execution with network jitter</span>
              </div>
              <span className="text-sm font-bold text-[#A66A00]">{axiomDemoData.latency.p99} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
