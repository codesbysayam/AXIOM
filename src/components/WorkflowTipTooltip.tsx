import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface WorkflowTipTooltipProps {
  content: string;
}

export const WorkflowTipTooltip: React.FC<WorkflowTipTooltipProps> = ({ content }) => {
  return (
    <span className="group relative inline-flex items-center cursor-help">
      <HelpCircle size={12} className="text-slate-400 hover:text-slate-600" />
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 w-48 p-2 text-[10px] text-slate-100 bg-slate-900 rounded shadow-md leading-tight pointer-events-none">
        {content}
      </span>
    </span>
  );
};
