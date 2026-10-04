import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  AlertTriangle,
  Clock,
  Flame,
  Info,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../../data/agentsAndSkills';
import { AgentInfo } from '../../types';

export type HeatmapMetricMode = 'activity' | 'errors' | 'latency';
export type HeatmapTimeRange = '24h' | '12h' | '6h';

export interface HeatmapCellData {
  agentId: string;
  agentName: string;
  agentDomain: string;
  hourIndex: number;
  hourLabel: string;
  timestamp: string;
  activityCount: number;
  errorCount: number;
  errorRate: number; // percentage (0 - 100)
  latencyMs: number;
  p95LatencyMs: number;
  invariantChecks: number;
  interventions: number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface AgentPerformanceHeatmapProps {
  onSelectAgent?: (agent: AgentInfo) => void;
  className?: string;
}

// Generate reproducible, realistic 24-hour time-series data for each agent
function generate24HourMatrix(agents: AgentInfo[]): HeatmapCellData[] {
  const cells: HeatmapCellData[] = [];
  const now = new Date();

  agents.forEach((agent, agentIdx) => {
    // Base characteristics per agent
    const baseLatency = agent.latencyMs;
    const baseLoad = Math.round(agent.completedTasks / 48); // hourly load estimate
    const isSecurityOrRisk = agent.id.includes('guardian') || agent.id.includes('sentinel') || agent.id.includes('executor');

    for (let hour = 0; hour < 24; hour++) {
      // Create diurnal workload wave (higher load during business hours 08:00 - 18:00)
      const hourOfDay = (now.getHours() - (23 - hour) + 24) % 24;
      const diurnalFactor = 0.4 + 0.6 * Math.sin(((hourOfDay - 6) / 18) * Math.PI > 0 ? ((hourOfDay - 6) / 18) * Math.PI : 0);
      
      // Pseudo-random deterministic noise based on agent and hour
      const seed = Math.sin(agentIdx * 17.3 + hour * 9.7);
      const noise = 0.85 + 0.3 * Math.abs(seed);
      
      const activityCount = Math.max(12, Math.round(baseLoad * diurnalFactor * noise));
      
      // Injected anomalies at realistic times (e.g. hour 14 high volume spike, hour 19 scheduled batch)
      let errorCount = 0;
      if (agent.id === 'agent-task-executor' && (hour === 14 || hour === 18)) {
        errorCount = Math.round(activityCount * 0.024);
      } else if (agent.id === 'agent-fraud-sentinel' && hour === 11) {
        errorCount = Math.round(activityCount * 0.018);
      } else if (agent.id === 'agent-intent-analyst' && hour === 9) {
        errorCount = Math.max(1, Math.round(activityCount * 0.012));
      } else if (Math.random() < 0.25) {
        errorCount = Math.round(activityCount * (0.002 + 0.005 * Math.abs(seed)));
      }

      const errorRate = activityCount > 0 ? (errorCount / activityCount) * 100 : 0;
      const latencyMs = Math.round(baseLatency * (0.9 + 0.25 * diurnalFactor + 0.15 * Math.abs(seed)));
      const p95LatencyMs = Math.round(latencyMs * 1.55);
      const invariantChecks = Math.round(activityCount * (isSecurityOrRisk ? 3.2 : 1.8));
      const interventions = errorCount > 0 ? Math.ceil(errorCount * 0.8) : 0;

      let status: 'nominal' | 'warning' | 'critical' = 'nominal';
      if (errorRate >= 2.0 || latencyMs > 320) status = 'critical';
      else if (errorRate >= 0.8 || latencyMs > 220) status = 'warning';

      const hourFormatted = `${String(hourOfDay).padStart(2, '0')}:00`;

      cells.push({
        agentId: agent.id,
        agentName: agent.name,
        agentDomain: agent.domain,
        hourIndex: hour,
        hourLabel: hourFormatted,
        timestamp: `${hourFormatted} UTC`,
        activityCount,
        errorCount,
        errorRate,
        latencyMs,
        p95LatencyMs,
        invariantChecks,
        interventions,
        status,
      });
    }
  });

  return cells;
}

export const AgentPerformanceHeatmap: React.FC<AgentPerformanceHeatmapProps> = ({
  onSelectAgent,
  className = '',
}) => {
  const [metricMode, setMetricMode] = useState<HeatmapMetricMode>('activity');
  const [timeRange, setTimeRange] = useState<HeatmapTimeRange>('24h');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCellData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Generate baseline dataset
  const fullData = useMemo(() => generate24HourMatrix(AGENT_WORKFORCE), []);

  // Filter based on selected time range (24h = all 24, 12h = last 12, 6h = last 6)
  const filteredData = useMemo(() => {
    let hourThreshold = 0;
    if (timeRange === '12h') hourThreshold = 12;
    if (timeRange === '6h') hourThreshold = 18;

    return fullData.filter((d) => {
      const matchRange = d.hourIndex >= hourThreshold;
      const matchQuery =
        !filterQuery.trim() ||
        d.agentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        d.agentDomain.toLowerCase().includes(filterQuery.toLowerCase());
      return matchRange && matchQuery;
    });
  }, [fullData, timeRange, filterQuery]);

  // Unique agents & hours for current filtered dataset
  const visibleAgents = useMemo(() => {
    const ids = Array.from(new Set(filteredData.map((d) => d.agentId)));
    return AGENT_WORKFORCE.filter((a) => ids.includes(a.id));
  }, [filteredData]);

  const visibleHours = useMemo(() => {
    const map = new Map<number, string>();
    filteredData.forEach((d) => map.set(d.hourIndex, d.hourLabel));
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([idx, label]) => ({ idx, label }));
  }, [filteredData]);

  // Aggregate summary stats
  const totalActivity = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.activityCount, 0),
    [filteredData]
  );
  const totalErrors = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.errorCount, 0),
    [filteredData]
  );
  const avgErrorRate = useMemo(
    () => (totalActivity > 0 ? (totalErrors / totalActivity) * 100 : 0),
    [totalActivity, totalErrors]
  );
  const avgLatency = useMemo(() => {
    if (filteredData.length === 0) return 0;
    return Math.round(
      filteredData.reduce((sum, d) => sum + d.latencyMs, 0) / filteredData.length
    );
  }, [filteredData]);
  const totalInvariants = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.invariantChecks, 0),
    [filteredData]
  );

  // Render D3 Visualization
  useEffect(() => {
    if (!svgRef.current || visibleAgents.length === 0 || visibleHours.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 32, right: 24, bottom: 44, left: 190 };
    const containerWidth = containerRef.current?.clientWidth || 980;
    const width = Math.max(760, containerWidth) - margin.left - margin.right;
    const rowHeight = 36;
    const height = visibleAgents.length * rowHeight;

    svg
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleBand<string>()
      .domain(visibleHours.map((h) => String(h.idx)))
      .range([0, width])
      .padding(0.06);

    const yScale = d3
      .scaleBand<string>()
      .domain(visibleAgents.map((a) => a.id))
      .range([0, height])
      .padding(0.08);

    // Color Scales based on Active Mode
    const maxActivity = d3.max(filteredData, (d) => d.activityCount) || 500;
    const maxLatency = d3.max(filteredData, (d) => d.latencyMs) || 300;

    // Activity Density Color Scale (Clean Navy / Slate Gradient)
    const activityColorScale = d3
      .scaleSequential()
      .domain([0, maxActivity])
      .interpolator(d3.interpolateRgbBasis(['#F5F1E6', '#DDE7F3', '#6894C2', '#3569A8', '#142238']));

    // Error Rate Color Scale (Emerald -> Amber -> Deep Rose/Red)
    const errorColorScale = (rate: number) => {
      if (rate === 0) return '#E5F5EF'; // Crisp emerald background for zero errors
      if (rate < 0.6) return '#C7EADF';
      if (rate < 1.2) return '#FFF2CC'; // Amber threshold
      if (rate < 2.0) return '#FCE8EA'; // Rose alert
      return '#C93645'; // Critical Red
    };

    // Latency Color Scale
    const latencyColorScale = d3
      .scaleSequential()
      .domain([40, maxLatency])
      .interpolator(d3.interpolateRgbBasis(['#E5F5EF', '#FAF7EE', '#FFF2CC', '#E1BF70', '#C93645']));

    // Draw Background Grid Track lines
    g.append('g')
      .attr('class', 'grid-tracks')
      .selectAll('line')
      .data(visibleAgents)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => (yScale(d.id) || 0) + yScale.bandwidth() / 2)
      .attr('y2', (d) => (yScale(d.id) || 0) + yScale.bandwidth() / 2)
      .attr('stroke', '#EFEFEB')
      .attr('stroke-width', 1);

    // Render Heatmap Rect Cells
    const cellGroups = g
      .selectAll<SVGGElement, HeatmapCellData>('.heatmap-cell')
      .data(filteredData, (d: HeatmapCellData) => `${d.agentId}-${d.hourIndex}`)
      .enter()
      .append('g')
      .attr('class', 'heatmap-cell')
      .attr('transform', (d) => `translate(${xScale(String(d.hourIndex)) || 0}, ${yScale(d.agentId) || 0})`)
      .style('cursor', 'pointer');

    cellGroups
      .append('rect')
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', (d) => {
        if (metricMode === 'activity') return activityColorScale(d.activityCount);
        if (metricMode === 'errors') return errorColorScale(d.errorRate);
        return latencyColorScale(d.latencyMs);
      })
      .attr('stroke', '#D5D1C7')
      .attr('stroke-width', 0.6)
      .attr('stroke-opacity', 0.8)
      .style('transition', 'all 0.15s ease')
      .on('mouseenter', function (event: MouseEvent, d) {
        d3.select(this)
          .attr('stroke', '#17263A')
          .attr('stroke-width', 1.8)
          .attr('stroke-opacity', 1)
          .attr('transform', 'scale(1.04)')
          .attr('transform-origin', 'center');

        setHoveredCell(d);
        const target = event.currentTarget as SVGGraphicsElement | null;
        if (target && typeof target.getBoundingClientRect === 'function') {
          const rect = target.getBoundingClientRect();
          setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
          });
        }
      })
      .on('mouseleave', function () {
        d3.select(this)
          .attr('stroke', '#D5D1C7')
          .attr('stroke-width', 0.6)
          .attr('stroke-opacity', 0.8)
          .attr('transform', 'scale(1)');

        setHoveredCell(null);
        setTooltipPos(null);
      })
      .on('click', (_event, d) => {
        const found = AGENT_WORKFORCE.find((a) => a.id === d.agentId);
        if (found && onSelectAgent) onSelectAgent(found);
      });

    // Cell In-Cell Text Indicator for significant values
    cellGroups.each(function (d) {
      const cellGroup = d3.select(this);
      const isWide = xScale.bandwidth() > 30;

      if (metricMode === 'errors' && d.errorRate > 0) {
        cellGroup
          .append('text')
          .attr('x', xScale.bandwidth() / 2)
          .attr('y', yScale.bandwidth() / 2 + 3.5)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('font-size', isWide ? '9.5px' : '8px')
          .attr('font-weight', '600')
          .attr('fill', d.errorRate >= 2.0 ? '#FFFFFF' : '#17263A')
          .text(`${d.errorRate.toFixed(1)}%`);
      } else if (metricMode === 'activity' && d.activityCount > maxActivity * 0.75 && isWide) {
        cellGroup
          .append('circle')
          .attr('cx', xScale.bandwidth() - 5)
          .attr('cy', 5)
          .attr('r', 2)
          .attr('fill', '#FFFFFF')
          .attr('opacity', 0.85);
      }
    });

    // Top & Bottom Time Axes
    const xAxisTop = g
      .append('g')
      .attr('class', 'x-axis-top')
      .call(
        d3
          .axisTop(xScale)
          .tickFormat((idxStr) => {
            const match = visibleHours.find((h) => String(h.idx) === idxStr);
            return match ? match.label : '';
          })
          .tickSize(0)
      );

    xAxisTop.select('.domain').remove();
    xAxisTop
      .selectAll('text')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('fill', '#68758A')
      .attr('dy', '-6px');

    // Y Axis Agent Labels (Left Side)
    const yAxis = g
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((id) => {
            const match = visibleAgents.find((a) => a.id === id);
            return match ? match.name : id;
          })
          .tickSize(0)
      );

    yAxis.select('.domain').remove();
    yAxis
      .selectAll('.tick')
      .style('cursor', 'pointer')
      .on('click', (_event, agentId) => {
        const found = AGENT_WORKFORCE.find((a) => a.id === agentId);
        if (found && onSelectAgent) onSelectAgent(found);
      });

    yAxis
      .selectAll('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11.5px')
      .attr('font-weight', '600')
      .attr('fill', '#17263A')
      .attr('dx', '-10px');

  }, [filteredData, visibleAgents, visibleHours, metricMode, onSelectAgent]);

  return (
    <section
      ref={containerRef}
      className={`p-6 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] space-y-5 shadow-xs relative ${className}`}
    >
      {/* Header & Controls Rail */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D5D1C7]/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow block">FLEET OBSERVABILITY MATRIX</span>
            <span className="text-[10px] font-mono text-[#00866B] bg-[#E5F5EF] px-1.5 py-0.5 rounded-[2px] font-semibold border border-[#A8DCCE]">
              D3 KERNEL ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-serif font-medium text-[#17263A] mt-1 tracking-tight">
            Agent Performance & Activity Density Heatmap
          </h2>
          <p className="text-xs font-sans text-[#5E6975] mt-0.5">
            24-hour temporal telemetry matrix mapping task dispatch density, latency distributions, and programmatic invariant error boundaries.
          </p>
        </div>

        {/* Action Controls: Mode Switcher + Timeframe Toggle + Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Segmented Controls */}
          <div className="inline-flex rounded-[4px] p-0.5 bg-[#FAF7EE] border border-[#D5D1C7]">
            <button
              type="button"
              onClick={() => setMetricMode('activity')}
              className={`px-3 py-1 text-xs font-sans font-medium rounded-[3px] transition-colors flex items-center gap-1.5 ${
                metricMode === 'activity'
                  ? 'bg-[#142238] text-white font-semibold shadow-2xs'
                  : 'text-[#40516A] hover:text-[#17263A]'
              }`}
            >
              <Flame size={12} className={metricMode === 'activity' ? 'text-amber-300' : 'text-[#68758A]'} />
              <span>Activity Density</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('errors')}
              className={`px-3 py-1 text-xs font-sans font-medium rounded-[3px] transition-colors flex items-center gap-1.5 ${
                metricMode === 'errors'
                  ? 'bg-[#142238] text-white font-semibold shadow-2xs'
                  : 'text-[#40516A] hover:text-[#17263A]'
              }`}
            >
              <AlertTriangle size={12} className={metricMode === 'errors' ? 'text-rose-300' : 'text-[#68758A]'} />
              <span>Error & Invariant Rate</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('latency')}
              className={`px-3 py-1 text-xs font-sans font-medium rounded-[3px] transition-colors flex items-center gap-1.5 ${
                metricMode === 'latency'
                  ? 'bg-[#142238] text-white font-semibold shadow-2xs'
                  : 'text-[#40516A] hover:text-[#17263A]'
              }`}
            >
              <Zap size={12} className={metricMode === 'latency' ? 'text-blue-300' : 'text-[#68758A]'} />
              <span>Latency (P50/P95)</span>
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="inline-flex rounded-[4px] p-0.5 bg-[#FAF7EE] border border-[#D5D1C7]">
            {(['24h', '12h', '6h'] as HeatmapTimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[3px] transition-colors ${
                  timeRange === range
                    ? 'bg-[#FFFDF8] text-[#17263A] font-bold border border-[#D5D1C7]/60 shadow-2xs'
                    : 'text-[#5E6975] hover:text-[#17263A]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Filter Agent Input */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#68758A]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter agent..."
              className="pl-7 pr-7 py-1 text-xs font-sans bg-[#FAF7EE] border border-[#D5D1C7] rounded-[4px] text-[#17263A] focus:outline-none focus:border-[#142238] w-32 focus:w-44 transition-all"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#68758A] hover:text-[#17263A]"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Summary Header Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7EE] p-3.5 rounded-[6px] border border-[#D5D1C7]">
        <div className="space-y-0.5">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68758A] block">
            {timeRange} Workload Volume
          </span>
          <div className="text-base font-mono font-bold text-[#17263A]">
            {totalActivity.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[#5E6975]">dispatches</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68758A] block">
            Fleet Error Rate
          </span>
          <div className={`text-base font-mono font-bold ${avgErrorRate > 0.5 ? 'text-[#B97800]' : 'text-[#00866B]'}`}>
            {avgErrorRate.toFixed(2)}%{' '}
            <span className="text-[11px] font-normal text-[#5E6975]">({totalErrors} intercepted)</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68758A] block">
            Average Latency
          </span>
          <div className="text-base font-mono font-bold text-[#17263A]">
            {avgLatency}ms{' '}
            <span className="text-[11px] font-normal text-[#5E6975]">p50 nominal</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68758A] block">
            Invariant Evaluations
          </span>
          <div className="text-base font-mono font-bold text-[#00866B]">
            {totalInvariants.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[#5E6975]">zero drift</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="overflow-x-auto pb-1 pt-1 select-none">
        <svg ref={svgRef} className="w-full block" style={{ minWidth: '720px' }} />
      </div>

      {/* D3 Dynamic Legend & Explanatory Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D5D1C7]/70 text-xs font-sans text-[#5E6975]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#17263A] text-[11px]">Color Scale:</span>
          {metricMode === 'activity' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono">0 runs</span>
              <div className="w-28 h-2.5 rounded-full bg-gradient-to-r from-[#F5F1E6] via-[#6894C2] to-[#142238] border border-[#D5D1C7]" />
              <span className="text-[11px] font-mono">Peak (~800 runs)</span>
            </div>
          )}
          {metricMode === 'errors' && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#E5F5EF] border border-[#A8DCCE]" /> 0% (Nominal)
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FFF2CC] border border-[#E1BF70]" /> 0.8% - 1.5%
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C93645]" /> &gt; 2.0% (Intervention)
              </span>
            </div>
          )}
          {metricMode === 'latency' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono">&lt; 80ms</span>
              <div className="w-28 h-2.5 rounded-full bg-gradient-to-r from-[#E5F5EF] via-[#FFF2CC] to-[#C93645] border border-[#D5D1C7]" />
              <span className="text-[11px] font-mono">&gt; 280ms</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#68758A]">
          <Info size={12} />
          <span>Click any cell or agent row to inspect diagnostic trace and invariants.</span>
        </div>
      </div>

      {/* Floating Detailed Popover Tooltip */}
      {hoveredCell && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 w-72 bg-[#142238] text-white p-3.5 rounded-[6px] shadow-xl border border-[#3569A8]/40 animate-in fade-in zoom-in-95 duration-100"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div>
              <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                {hoveredCell.agentDomain}
              </div>
              <div className="text-xs font-sans font-bold text-white mt-0.5">
                {hoveredCell.agentName}
              </div>
            </div>
            <span className="font-mono text-[11px] text-amber-300 bg-slate-800/90 px-1.5 py-0.5 rounded-[2px]">
              {hoveredCell.timestamp}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-sans">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Requests Processed:</span>
              <span className="font-mono font-semibold text-white">{hoveredCell.activityCount} runs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Error & Anomaly Rate:</span>
              <span
                className={`font-mono font-bold ${
                  hoveredCell.errorRate > 1.5
                    ? 'text-rose-400'
                    : hoveredCell.errorRate > 0
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }`}
              >
                {hoveredCell.errorRate.toFixed(2)}% ({hoveredCell.errorCount} failures)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Latency (P50 / P95):</span>
              <span className="font-mono font-semibold text-white">
                {hoveredCell.latencyMs}ms / {hoveredCell.p95LatencyMs}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Invariant Checks:</span>
              <span className="font-mono text-emerald-400 font-semibold">{hoveredCell.invariantChecks} verified</span>
            </div>
            {hoveredCell.interventions > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-amber-300">
                <span>Human Gate Escalations:</span>
                <span className="font-mono font-bold">{hoveredCell.interventions}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
