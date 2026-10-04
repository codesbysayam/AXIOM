import React from 'react';

export type PipelineStepStatus = 'completed' | 'running' | 'pending' | 'failed' | 'blocked';

export interface PipelineEdgeProps {
  status: PipelineStepStatus;
}

export function PipelineEdge({ status }: PipelineEdgeProps) {
  return (
    <div className="pipeline-edge" data-status={status} aria-hidden="true">
      <div className="pipeline-edge-track" />
      {status === 'running' && <div className="pipeline-edge-beam" />}
      <span className="pipeline-edge-arrow" />
    </div>
  );
}
