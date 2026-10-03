import React from 'react';
import { CheckCircle2, UserCheck, X } from 'lucide-react';
import { CaseItem } from '../types';
import { useOperationsStore } from '../orchestrator/store';
import { StatusBadge } from './StatusBadge';

export interface CaseInspectorModalProps {
  caseItem: CaseItem | null;
  onClose: () => void;
}

export const CaseInspectorModal: React.FC<CaseInspectorModalProps> = ({ caseItem, onClose }) => {
  const { resolveCase } = useOperationsStore();

  if (!caseItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={caseItem.status} size="sm" />
              <span className="text-xs font-mono text-slate-400">Case ID: {caseItem.id}</span>
              <span className="text-xs font-mono text-slate-400">· {caseItem.createdAt}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mt-1.5">{caseItem.title}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Category: {caseItem.category}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
              Case Summary & Triage Data
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/60">
              {caseItem.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
              Agent-Recommended Remedy
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed bg-emerald-50/50 p-3 rounded border border-emerald-200">
              {caseItem.recommendedResolution || 'Awaiting agent recommendation...'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>Assigned Agent: {caseItem.assignedAgent}</span>
            <span className="uppercase text-amber-700 font-semibold">Priority: {caseItem.priority}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
          >
            Dismiss
          </button>

          {caseItem.status !== 'resolved' && (
            <button
              type="button"
              onClick={() => {
                resolveCase(caseItem.id);
                onClose();
              }}
              className="px-3.5 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 size={13} />
              <span>Mark Resolved</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
