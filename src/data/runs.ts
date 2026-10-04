export interface PipelineOutcomeData {
  name: string;
  pipelineId: string;
  completed: number;
  blocked: number;
  failed: number;
  total: number;
  successRate: number;
}

export const PIPELINE_OUTCOMES_DATA: PipelineOutcomeData[] = [
  {
    name: 'Vendor PO',
    pipelineId: 'wf-vendor-procurement',
    completed: 312,
    blocked: 8,
    failed: 3,
    total: 323,
    successRate: 98.4,
  },
  {
    name: 'Refund Triage',
    pipelineId: 'wf-refund-triage',
    completed: 1260,
    blocked: 14,
    failed: 6,
    total: 1280,
    successRate: 99.5,
  },
  {
    name: 'Security CVE',
    pipelineId: 'wf-cve-remediation',
    completed: 84,
    blocked: 5,
    failed: 1,
    total: 90,
    successRate: 97.8,
  },
  {
    name: 'Compliance',
    pipelineId: 'wf-compliance-audit',
    completed: 209,
    blocked: 3,
    failed: 2,
    total: 214,
    successRate: 98.9,
  },
];

export interface ThroughputPoint {
  time: string;
  runs: number;
  autonomous: number;
  humanIntervened: number;
  blocked: number;
}

export const EXECUTION_THROUGHPUT_DATA: ThroughputPoint[] = [
  { time: '08:00', runs: 84, autonomous: 80, humanIntervened: 3, blocked: 1 },
  { time: '09:00', runs: 112, autonomous: 106, humanIntervened: 4, blocked: 2 },
  { time: '10:00', runs: 168, autonomous: 159, humanIntervened: 7, blocked: 2 },
  { time: '11:00', runs: 195, autonomous: 184, humanIntervened: 9, blocked: 2 },
  { time: '12:00', runs: 242, autonomous: 231, humanIntervened: 9, blocked: 2 },
  { time: '13:00', runs: 180, autonomous: 172, humanIntervened: 6, blocked: 2 },
  { time: '14:00', runs: 210, autonomous: 198, humanIntervened: 10, blocked: 2 },
  { time: '15:00', runs: 90, autonomous: 85, humanIntervened: 4, blocked: 1 },
];

export interface RiskBucket {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const RISK_DISTRIBUTION_DATA: RiskBucket[] = [
  { name: 'Low', value: 920, color: '#00866B', percentage: 71.8 },
  { name: 'Medium', value: 286, color: '#3569A8', percentage: 22.3 },
  { name: 'High', value: 61, color: '#B97800', percentage: 4.8 },
  { name: 'Critical', value: 14, color: '#C93645', percentage: 1.1 },
];

export interface LatencyPercentilePoint {
  time: string;
  p50: number;
  p75: number;
  p95: number;
  p99: number;
  baseline: number;
}

export const LATENCY_PERCENTILES_DATA: LatencyPercentilePoint[] = [
  { time: '11:30', p50: 120, p75: 180, p95: 340, p99: 580, baseline: 250 },
  { time: '11:45', p50: 135, p75: 195, p95: 355, p99: 610, baseline: 250 },
  { time: '12:00', p50: 110, p75: 165, p95: 320, p99: 540, baseline: 250 },
  { time: '12:15', p50: 140, p75: 210, p95: 380, p99: 680, baseline: 250 },
  { time: '12:30', p50: 125, p75: 190, p95: 340, p99: 590, baseline: 250 },
  { time: '12:45', p50: 115, p75: 170, p95: 330, p99: 560, baseline: 250 },
  { time: '13:00', p50: 130, p75: 185, p95: 345, p99: 605, baseline: 250 },
];
