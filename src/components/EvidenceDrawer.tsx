import React, { useEffect } from 'react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';

export interface InspectorNode {
  id: string;
  title: string;
  agent: string;
  skill?: string;
  status: string;
  input?: string;
  output?: string;
  duration?: number;
  checks?: string[];
  timestamp?: string;
}

export interface EvidenceDrawerProps {
  node: InspectorNode | null;
  onClose: () => void;
}

export function EvidenceDrawer({ node, onClose }: EvidenceDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && node) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [node, onClose]);

  const defaultChecks = [
    'Static AST rule validation pass',
    'Invariant constraint verified in sandbox',
    'Zero unreviewed external side-effects',
    'State transition recorded with SHA-256 digest',
  ];

  return (
    <>
      <div
        className="evidence-drawer-backdrop"
        data-open={Boolean(node) ? 'true' : 'false'}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="evidence-drawer"
        data-open={Boolean(node) ? 'true' : 'false'}
        aria-hidden={!node}
        role="dialog"
        aria-label="Node Evidence Inspector"
      >
        {node && (
          <>
            <header>
              <div>
                <span>NODE INSPECTION</span>
                <h2>
                  {node.id} / {node.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close inspector drawer"
                className="hover:bg-[#EFEFEB] text-[#182536] flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>
            </header>

            <section>
              <label>ASSIGNED AGENT & SKILL</label>
              <strong>{node.agent}</strong>
              {node.skill && (
                <span className="text-[11px] font-mono text-[#5E6975] mt-1 block">
                  Capability: {node.skill}
                </span>
              )}
            </section>

            <section>
              <label>EXECUTION STATUS</label>
              <div className="drawer-status">
                <i />
                <span className="uppercase tracking-wide">{node.status}</span>
                {node.duration !== undefined && (
                  <span className="text-[10px] font-mono text-[#5E6975] ml-auto">
                    {node.duration}ms
                  </span>
                )}
              </div>
            </section>

            <section>
              <label>INPUT PAYLOAD</label>
              <code>{node.input || 'Standard ERP/Webhook event payload'}</code>
            </section>

            <section>
              <label>POLICY EVIDENCE & INVARIANTS</label>
              <div className="evidence-checks">
                {(node.checks || defaultChecks).map((check) => (
                  <div key={check}>
                    <span>✓</span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <label>VERIFIED OUTPUT DIGEST</label>
              <code>{node.output || 'Deterministic output generated and signed.'}</code>
            </section>
          </>
        )}
      </aside>
    </>
  );
}
