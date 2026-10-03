import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'text-slate-600 bg-slate-100 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label = status;

  if (normalized === 'active' || normalized === 'completed' || normalized === 'resolved' || normalized === 'success') {
    colorClasses = 'text-emerald-700 bg-emerald-50/80 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = normalized === 'active' ? 'Active' : normalized === 'completed' ? 'Completed' : 'Resolved';
  } else if (normalized === 'waiting_approval' || normalized === 'human_review' || normalized === 'warning' || normalized === 'pending') {
    colorClasses = 'text-amber-800 bg-amber-50/80 border-amber-200';
    dotColor = 'bg-amber-500';
    label = normalized === 'waiting_approval' ? 'Requires Approval' : normalized === 'human_review' ? 'In Review' : 'Pending';
  } else if (normalized === 'failed' || normalized === 'policy_block' || normalized === 'rejected' || normalized === 'critical' || normalized === 'urgent') {
    colorClasses = 'text-rose-700 bg-rose-50/80 border-rose-200';
    dotColor = 'bg-rose-500';
    label = normalized === 'policy_block' ? 'Policy Block' : normalized === 'rejected' ? 'Rejected' : 'High Risk';
  } else if (normalized === 'running' || normalized === 'triaging') {
    colorClasses = 'text-blue-700 bg-blue-50/80 border-blue-200';
    dotColor = 'bg-blue-500 animate-pulse';
    label = normalized === 'running' ? 'Executing' : 'Triaging';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono border rounded ${sizeClasses} ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
