import React, { useState } from 'react';
import { AlertTriangle, Shield, ShieldAlert, Workflow } from 'lucide-react';

export interface RiskItem {
  id: string;
  name: string;
  type: 'workflow' | 'incident' | 'agent';
  impact: 'LOW' | 'MED' | 'HIGH' | 'CRIT';
  probability: 'LOW' | 'MED' | 'HIGH' | 'CRIT';
  details: string;
  financialExposure: string;
}

export const RISK_ITEMS: RiskItem[] = [
  {
    id: 'risk-1',
    name: 'Vendor Disbursement > $10k Outlay',
    type: 'workflow',
    impact: 'HIGH',
    probability: 'HIGH',
    details: 'PO-88219 exceeds single-signature boundary. Human gate enforced.',
    financialExposure: '$18,420.00',
  },
  {
    id: 'risk-2',
    name: 'Policy Engine Concurrency Latency Spike',
    type: 'incident',
    impact: 'MED',
    probability: 'MED',
    details: 'P99 signature check response exceeded 450ms. Standby pool auto-warmed.',
    financialExposure: 'Zero loss (SLO warning)',
  },
  {
    id: 'risk-3',
    name: 'ERP Master Key Credential Rotation',
    type: 'agent',
    impact: 'CRIT',
    probability: 'LOW',
    details: 'Automated 90-day credential renewal scheduled for Task Executor.',
    financialExposure: 'System access barrier',
  },
  {
    id: 'risk-4',
    name: 'Inventory SKU Negative Balance Anomaly',
    type: 'workflow',
    impact: 'LOW',
    probability: 'MED',
    details: 'Rollback token RB-9921 armed to prevent phantom over-allocation.',
    financialExposure: '$1,200.00',
  },
  {
    id: 'risk-5',
    name: 'Customer Dispute Automated Credit Memo',
    type: 'workflow',
    impact: 'LOW',
    probability: 'LOW',
    details: 'Micro-refund ($45.00) classified with 99.4% semantic grounding.',
    financialExposure: '$45.00',
  },
  {
    id: 'risk-6',
    name: 'Production Deploy Security Invariant Check',
    type: 'workflow',
    impact: 'CRIT',
    probability: 'HIGH',
    details: 'Release Guardian holding staging release pending dual cryptographic seal.',
    financialExposure: 'Core service reliability',
  },
];

export const RiskHeatmap: React.FC<{ onSelectItem?: (item: RiskItem) => void }> = ({
  onSelectItem,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(RISK_ITEMS[0]);

  const levels: Array<'LOW' | 'MED' | 'HIGH' | 'CRIT'> = ['LOW', 'MED', 'HIGH', 'CRIT'];

  const getCellColor = (prob: string, imp: string) => {
    if (prob === 'CRIT' || imp === 'CRIT' || (prob === 'HIGH' && imp === 'HIGH')) {
      return 'bg-[#FFF5F5] hover:bg-[#FCE6E2] border-[#F5C2B8]';
    }
    if (prob === 'HIGH' || imp === 'HIGH' || (prob === 'MED' && imp === 'MED')) {
      return 'bg-[#FFFDF0] hover:bg-[#FEF3D6] border-[#F9E2A8]';
    }
    return 'bg-[#FAF9F5] hover:bg-[#F0FAF6] border-[#E5E3DB]';
  };

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert size={15} className="text-[#8A5900]" />
          <div>
            <span className="eyebrow block">Operational Threat Matrix</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Probability × Impact Risk Heatmap
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-[#5E6975]">
          Active Vectors: <span className="font-semibold text-[#182536]">{RISK_ITEMS.length}</span>
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Heatmap Matrix Table */}
        <div className="lg:col-span-8 overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Top Y-Axis Label */}
            <div className="text-[10px] font-mono font-bold uppercase text-[#5E6975] text-center mb-1">
              IMPACT SEVERITY →
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center">
              {/* Corner */}
              <div className="text-[9px] font-mono text-[#8898AA] flex items-center justify-center">
                PROBABILITY ↓
              </div>
              {levels.map((lvl) => (
                <div key={lvl} className="text-[10px] font-mono font-bold text-[#182536] py-1 bg-[#F0EEE6] rounded-[2px]">
                  {lvl}
                </div>
              ))}

              {/* Rows */}
              {levels.slice().reverse().map((prob) => (
                <React.Fragment key={prob}>
                  <div className="text-[10px] font-mono font-bold text-[#182536] py-2 bg-[#F0EEE6] rounded-[2px] flex items-center justify-center">
                    {prob}
                  </div>
                  {levels.map((imp) => {
                    const cellItems = RISK_ITEMS.filter(
                      (r) => r.probability === prob && r.impact === imp,
                    );
                    return (
                      <div
                        key={`${prob}-${imp}`}
                        className={`h-16 p-1 border rounded-[3px] transition-all flex flex-wrap items-center justify-center gap-1 cursor-pointer ${getCellColor(
                          prob,
                          imp,
                        )}`}
                      >
                        {cellItems.map((item) => {
                          const isSelected = selectedRisk?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedRisk(item);
                                if (onSelectItem) onSelectItem(item);
                              }}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-transform ${
                                item.impact === 'CRIT'
                                  ? 'bg-[#D72F40] text-white'
                                  : item.impact === 'HIGH'
                                  ? 'bg-[#8A5900] text-white'
                                  : 'bg-[#182536] text-white'
                              } ${isSelected ? 'ring-2 ring-[#182536] scale-125' : 'hover:scale-110'}`}
                              title={`${item.name} (${item.financialExposure})`}
                            >
                              ●
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Risk Inspector */}
        <div className="lg:col-span-4 border border-[#E5E3DB] rounded-[4px] p-3.5 bg-[#FAF9F5] space-y-3 flex flex-col justify-between">
          {selectedRisk ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Risk Vector Inspection</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-white border border-[#D5D5CE] text-[#182536]">
                  {selectedRisk.probability} × {selectedRisk.impact}
                </span>
              </div>

              <h4 className="text-sm font-serif font-semibold text-[#182536]">
                {selectedRisk.name}
              </h4>

              <p className="text-xs font-sans text-[#52647B] leading-relaxed">
                {selectedRisk.details}
              </p>

              <div className="p-2 bg-white rounded-[3px] border border-[#E5E3DB] text-xs font-mono">
                <span className="text-[#5E6975] text-[10px] block">Material Exposure:</span>
                <span className="font-semibold text-[#182536]">
                  {selectedRisk.financialExposure}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#5E6975] font-sans">
              Click a dot in the risk matrix to inspect telemetry and mitigation.
            </div>
          )}

          <div className="text-[10px] font-mono text-[#08795F] pt-2 border-t border-[#E5E3DB]">
            ✓ Mitigated by deterministic policy invariant bounds
          </div>
        </div>
      </div>
    </div>
  );
};
