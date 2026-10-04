import React from 'react';

export interface RecoveryLaneProps {
  active?: boolean;
  onTriggerRollback?: () => void;
}

export function RecoveryLane({
  active = false,
  onTriggerRollback,
}: RecoveryLaneProps) {
  return (
    <div
      className="recovery-lane"
      data-active={active ? 'true' : 'false'}
      role="region"
      aria-label="Recovery and Rollback Lane"
    >
      <div className="recovery-label">
        <span>RECOVERY LANE</span>
        <strong>Deterministic rollback path</strong>
      </div>

      <div className="recovery-route">
        <span className="recovery-source">VALIDATE / TEST / DEPLOY</span>

        <span className="recovery-line" />

        <span
          className="recovery-node"
          onClick={onTriggerRollback}
          title="Click to test automated rollback mechanism"
          style={{ cursor: onTriggerRollback ? 'pointer' : 'default' }}
        >
          ROLLBACK
        </span>

        <span className="recovery-line short" />

        <span className="safe-state">SAFE STATE</span>
      </div>
    </div>
  );
}
