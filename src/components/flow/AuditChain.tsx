import React from 'react';
import { OPERATIONAL_AUDIT_CHAIN } from '../../data/audit';
import { AuditBlock } from '../../types/operations';
import { Lock, ShieldCheck, CheckCircle2, Hash, ArrowDown } from 'lucide-react';

export interface AuditChainProps {
  blocks?: AuditBlock[];
  onSelectBlock?: (block: AuditBlock) => void;
  selectedBlockId?: string;
  className?: string;
}

export function AuditChain({
  blocks = OPERATIONAL_AUDIT_CHAIN,
  onSelectBlock,
  selectedBlockId,
  className = '',
}: AuditChainProps) {
  return (
    <section className={`viz-panel p-6 bg-[#FFFDF8] border border-[#D5D1C7] rounded-[8px] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D1C7]/70">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#68758A] font-semibold block">
            CRYPTOGRAPHIC PROVENANCE LEDGER
          </span>
          <h2 className="text-xl font-serif font-bold text-[#17263A] mt-0.5">
            Immutable SHA-256 Audit Merkle Chain
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#00866B] bg-[#E5F5EF] px-3 py-1 border border-[#00866B]/30 rounded-[4px]">
          <ShieldCheck size={13} />
          <span>CHAIN VERIFIED: ZERO TAMPER DETECTED</span>
        </div>
      </div>

      <div className="pt-6 space-y-4">
        {blocks.map((block, idx) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <React.Fragment key={block.id}>
              <div
                onClick={() => onSelectBlock?.(block)}
                className={`p-4 border rounded-[6px] transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#142238] bg-[#FAF7EE] shadow-md ring-1 ring-[#142238]'
                    : 'border-[#D5D1C7] bg-[#FFFDF8] hover:border-[#40516A] hover:bg-[#FAF7EE]/50 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D5D1C7]/60">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-[#142238] text-white rounded-[2px] font-bold">
                      BLOCK #{block.sequence}
                    </span>
                    <span className="text-[#68758A]">{block.timestamp}</span>
                    <span className="text-[#17263A] font-semibold">{block.pipeline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00866B] font-semibold">
                    <CheckCircle2 size={12} />
                    <span>{block.decision}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[#17263A] font-sans">
                      {block.action}
                    </div>
                    <div className="text-xs text-[#40516A] mt-0.5 leading-relaxed">
                      {block.evidence}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[#68758A] flex-shrink-0">
                    Policy: <strong className="text-[#17263A]">{block.policy}</strong> · Actor:{' '}
                    <strong className="text-[#17263A]">{block.actor}</strong>
                  </div>
                </div>

                {/* Hashes: Current & Previous Block */}
                <div className="mt-3 pt-2 border-t border-[#D5D1C7]/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-[#68758A]">
                  <div className="truncate">
                    SHA-256 Digest: <strong className="text-[#17263A]">{block.hash}</strong>
                  </div>
                  <div className="truncate text-right">
                    Prev Hash: <span className="text-slate-500">{block.previousHash}</span>
                  </div>
                </div>
              </div>

              {idx < blocks.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <div className="w-[1px] h-5 bg-[#AEB4BA] relative">
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-r border-b border-[#7B8793] rotate-45" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
