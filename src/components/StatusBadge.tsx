import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let tagClass = 'axiom-tag axiom-tag-neutral';
  let dotColor = 'bg-[#718096]';
  let label = status;

  if (
    normalized === 'active' ||
    normalized === 'completed' ||
    normalized === 'resolved' ||
    normalized === 'success'
  ) {
    tagClass = 'axiom-tag axiom-tag-success';
    dotColor = 'bg-[#159a72]';
    label = normalized === 'active' ? 'Active' : normalized === 'completed' ? 'Completed' : 'Resolved';
  } else if (
    normalized === 'waiting_approval' ||
    normalized === 'human_review' ||
    normalized === 'warning' ||
    normalized === 'pending'
  ) {
    tagClass = 'axiom-tag axiom-tag-warning';
    dotColor = 'bg-[#d99000]';
    label = normalized === 'waiting_approval' ? 'Human Gate' : normalized === 'human_review' ? 'In Review' : 'Pending';
  } else if (
    normalized === 'failed' ||
    normalized === 'policy_block' ||
    normalized === 'rejected' ||
    normalized === 'critical' ||
    normalized === 'urgent'
  ) {
    tagClass = 'axiom-tag axiom-tag-danger';
    dotColor = 'bg-[#c83e4d]';
    label = normalized === 'policy_block' ? 'Policy Block' : normalized === 'rejected' ? 'Declined' : 'High Risk';
  } else if (normalized === 'running' || normalized === 'triaging') {
    tagClass = 'axiom-tag axiom-tag-neutral';
    dotColor = 'bg-[#17263d] animate-pulse';
    label = normalized === 'running' ? 'Executing' : 'Triaging';
  }

  const paddingClass = size === 'sm' ? 'py-0.5 px-1.5 text-[10px]' : 'py-0.5 px-2 text-[11px]';

  return (
    <span className={`${tagClass} ${paddingClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
