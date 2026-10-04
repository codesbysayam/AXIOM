import React from 'react';

export interface HumanAuthorityBoundaryProps {
  isGated?: boolean;
  onApprove?: () => void;
  onHold?: () => void;
  onReject?: () => void;
}

export function HumanAuthorityBoundary({
  isGated = true,
  onApprove,
  onHold,
  onReject,
}: HumanAuthorityBoundaryProps) {
  return (
    <div className={`authority-boundary ${isGated ? 'is-active' : ''}`} role="region" aria-label="Human Authority Boundary">
      <div className="authority-boundary-title">
        <span>06</span>
        <div>
          <strong>HUMAN AUTHORITY</strong>
          <small>Material execution boundary</small>
        </div>
      </div>

      <div className="authority-rule">
        <span>OPERATOR SIGN-OFF REQUIRED</span>
      </div>

      <div className="authority-actions">
        <button
          type="button"
          className="authority-hold"
          onClick={onHold}
          title="Hold pipeline execution at current state"
        >
          Hold
        </button>

        <button
          type="button"
          className="authority-reject"
          onClick={onReject}
          title="Decline execution and trigger automated rollback"
        >
          Reject
        </button>

        <button
          type="button"
          className="authority-approve"
          onClick={onApprove}
          title="Authorize execution through operator signature"
        >
          Approve Release
        </button>
      </div>
    </div>
  );
}
