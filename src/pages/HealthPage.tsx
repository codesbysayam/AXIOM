import React from 'react';
import { Activity, CheckCircle2, HeartPulse, Server, ShieldCheck, Zap } from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/agentsAndSkills';

export const HealthPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Fleet Health & Infrastructure Monitor
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Real-time heartbeat checks, memory consumption, token quota utilization, and latency telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Fleet Status</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">100% HEALTHY</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            8 of 8 agents reporting healthy heartbeat
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Uptime (30d)</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">99.98%</div>
          <span className="text-[11px] text-emerald-600 font-mono mt-1 block">
            0 unexpected pod crashes
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Token Pool</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">14.8M / 50M</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            29.6% monthly budget used
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono mb-3">
          Agent Node Heartbeat Roster
        </h3>
        <div className="divide-y divide-slate-100">
          {AGENT_WORKFORCE.map((ag) => (
            <div key={ag.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-900">{ag.name}</span>
                <span className="text-[11px] font-mono text-slate-400">· {ag.domain}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                <span>Latency: {ag.latencyMs}ms</span>
                <span>Success: {ag.successRate}%</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HEALTHY
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
