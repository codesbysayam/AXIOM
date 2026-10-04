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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D5D1C7] pb-4">
        <div>
          <span className="eyebrow block">
            Measured Assurance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Fleet Analytics & Execution Performance
          </h1>
          <p className="text-sm font-sans text-[#52647B] mt-1">
            Empirically measured operational metrics, safety ratios, latency distributions, and cost avoidance.
          </p>
        </div>

        {/* Required label: SIMULATED OPERATIONS DATA (Point 8, 9) */}
        <div className="flex items-center gap-2">
          <span className="axiom-tag axiom-tag-warning">
            <Info size={13} />
            <span>SIMULATED OPERATIONS DATA</span>
          </span>
        </div>
      </div>

      {/* Dataset Context Bar (Point 9) */}
      <div className="p-3.5 border border-[#D5D1C7] bg-[#FFFDF8] rounded-[6px] flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#52647B] shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-[#68758A] font-medium">EVALUATION PERIOD:</span>
          <strong className="text-[#17263A]">Last 7 days</strong>
          <span className="text-[#D5D1C7]">|</span>
          <span className="text-[#68758A] font-medium">SAMPLE SIZE:</span>
          <strong className="text-[#17263A]">{axiomDemoData.executions.currentPeriodRuns.toLocaleString()} runs</strong>
          <span className="text-[#D5D1C7]">|</span>
          <span className="text-[#68758A] font-medium">HISTORICAL BENCHMARK:</span>
          <strong className="text-[#17263A]">{axiomDemoData.executions.historicalBenchmark.toLocaleString()} runs</strong>
        </div>

        <div className="text-xs text-[#00866B] font-medium">
          Fleet Availability: <b className="font-semibold">{axiomDemoData.fleet.availability}%</b>
        </div>
      </div>

      {/* Primary KPI Ribbon (Point 8: Autonomous completion rate, Human intervention rate, Median latency, Cost avoidance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#D5D5CE] bg-[#FFFDF8] rounded-[4px] divide-y sm:divide-y-0 sm:divide-x divide-[#D5D5CE] shadow-2xs">
        {/* Metric 1: Autonomous Completion Rate */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium tracking-[0.04em]">
            Autonomous Completion Rate
          </span>
          <div className="text-2xl font-bold font-sans text-[#00866B]">
            {axiomDemoData.executions.autonomousRate}%
          </div>
          <div className="flex items-center justify-between text-xs font-sans text-[#68758A] pt-1">
            <span className="flex items-center gap-0.5 text-[#00866B] font-medium">
              <ArrowUpRight size={12} /> +1.4% vs last week
            </span>
            <span>n = <span className="font-mono">{axiomDemoData.executions.currentPeriodRuns}</span></span>
          </div>
        </div>

        {/* Metric 2: Human Intervention Rate */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium tracking-[0.04em]">
            Human Intervention Ratio
          </span>
          <div className="text-2xl font-bold font-sans text-[#B97800]">
            {axiomDemoData.executions.interventionRate}%
          </div>
          <div className="flex items-center justify-between text-xs font-sans text-[#68758A] pt-1">
            <span className="flex items-center gap-0.5 text-[#00866B] font-medium">
              <ArrowDownRight size={12} /> -0.8% threshold trips
            </span>
            <span>n = <span className="font-mono">124</span> gates</span>
          </div>
        </div>

        {/* Metric 3: Median Resolution Latency */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium tracking-[0.04em]">
            Median DAG Resolution
          </span>
          <div className="text-2xl font-bold font-sans text-[#17263A]">
            {axiomDemoData.latency.p50} <span className="text-sm font-normal text-[#68758A] font-mono">ms</span>
          </div>
          <div className="flex items-center justify-between text-xs font-sans text-[#68758A] pt-1">
            <span className="flex items-center gap-0.5 text-[#00866B] font-medium">
              <ArrowDownRight size={12} /> -18ms faster
            </span>
            <span>p50 distribution</span>
          </div>
        </div>

        {/* Metric 4: Cost Avoidance */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-sans uppercase text-[#68758A] block font-medium tracking-[0.04em]">
            Intercepted Cost Avoidance
          </span>
          <div className="text-2xl font-bold font-sans text-[#00866B]">
            ${axiomDemoData.executions.costAvoidanceUsd.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs font-sans text-[#68758A] pt-1">
            <span className="text-[#00866B] font-medium">Anomalous invoices caught</span>
            <span>Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid: Policy Block Rate, Rollback Rate, Approval SLA, Recovery Time */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Policy Block Rate</span>
          <strong className="text-lg font-bold text-[#17263A] font-sans">{axiomDemoData.governance.blockRate}%</strong>
          <span className="text-xs text-[#68758A] block">27 intercept halts</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Rollback Rate</span>
          <strong className="text-lg font-bold text-[#00866B] font-sans">{axiomDemoData.pipelines.rollbackRate}%</strong>
          <span className="text-xs text-[#00866B] block">Zero data loss</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Mean Approval SLA</span>
          <strong className="text-lg font-bold text-[#17263A] font-sans">{axiomDemoData.approvals.slaMinutes} min</strong>
          <span className="text-xs text-[#68758A] block">Target: &lt; 15 min</span>
        </div>

        <div className="p-3.5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase text-[#68758A] block font-medium">Pipeline Success</span>
          <strong className="text-lg font-bold text-[#00866B] font-sans">{axiomDemoData.pipelines.successRate}%</strong>
          <span className="text-xs text-[#00866B] block">All topologies</span>
        </div>
      </div>

      {/* Charts & Latency Percentiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Execution Velocity Trend */}
        <div className="axiom-panel p-5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <h3 className="card-title text-sm font-sans font-semibold text-[#17263A]">
              Execution Throughput Trend (7-Day Trace)
            </h3>
            <span className="text-xs font-sans text-[#68758A]">Daily Resolution Count</span>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-[4px] border border-[#D5D5CE]">
            <AgentThroughputSparkline height={80} color="#17263A" />
          </div>

          <div className="flex justify-between text-xs font-sans text-[#68758A] pt-1">
            <span>Day 01: <span className="font-mono">1,420</span> runs</span>
            <span>Day 04: <span className="font-mono">1,840</span> runs</span>
            <span>Day 07: <span className="font-mono">2,140</span> runs</span>
          </div>
        </div>

        {/* Latency Percentiles */}
        <div className="axiom-panel p-5 bg-[#FFFDF8] border border-[#D5D5CE] rounded-[4px] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5D5CE] pb-2">
            <h3 className="card-title text-sm font-sans font-semibold text-[#17263A]">
              Latency Percentiles (Millisecond Distribution)
            </h3>
            <span className="text-xs font-sans text-[#68758A]">Empirical P-values</span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[4px]">
              <div>
                <span className="text-[#17263A] font-semibold block font-sans">p50 Median Latency</span>
                <span className="text-xs text-[#68758A] font-sans">Routine autonomous execution path</span>
              </div>
              <span className="text-sm font-mono font-semibold text-[#00866B]">{axiomDemoData.latency.p50} ms</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[4px]">
              <div>
                <span className="text-[#17263A] font-semibold block font-sans">p95 Tail Latency</span>
                <span className="text-xs text-[#68758A] font-sans">Includes multi-agent context vector lookup</span>
              </div>
              <span className="text-sm font-mono font-semibold text-[#17263A]">{axiomDemoData.latency.p95} ms</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-[#D5D5CE] rounded-[4px]">
              <div>
                <span className="text-[#17263A] font-semibold block font-sans">p99 Outlier Latency</span>
                <span className="text-xs text-[#68758A] font-sans">Worst-case sandbox execution with network jitter</span>
              </div>
              <span className="text-sm font-mono font-semibold text-[#B97800]">{axiomDemoData.latency.p99} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
