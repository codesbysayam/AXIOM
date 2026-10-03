import React from 'react';
import { CheckCircle2, Clock, Play, ShieldAlert, XCircle } from 'lucide-react';
import { WorkflowStep } from '../types';
import { StatusBadge } from './StatusBadge';

export interface WorkflowPipelineProps {
  steps: WorkflowStep[];
  onStepClick?: (step: WorkflowStep) => void;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ steps, onStepClick }) => {
  return (
    <div className="relative">
      <div className="space-y-3">
        {steps.map((step, index) => {
          let StepIcon = Clock;
          let iconColor = 'text-slate-400 bg-slate-100';

          if (step.status === 'completed') {
            StepIcon = CheckCircle2;
            iconColor = 'text-emerald-600 bg-emerald-50';
          } else if (step.status === 'running') {
            StepIcon = Play;
            iconColor = 'text-blue-600 bg-blue-50 animate-pulse';
          } else if (step.status === 'waiting_approval') {
            StepIcon = ShieldAlert;
            iconColor = 'text-amber-600 bg-amber-50';
          } else if (step.status === 'failed') {
            StepIcon = XCircle;
            iconColor = 'text-rose-600 bg-rose-50';
          }

          return (
            <div
              key={step.id}
              onClick={() => onStepClick?.(step)}
              className={`p-3.5 rounded-lg border transition-all ${
                step.status === 'waiting_approval'
                  ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-md ${iconColor} mt-0.5`}>
                    <StepIcon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">Step 0{index + 1}</span>
                      <h4 className="text-xs font-semibold text-slate-900">{step.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-mono text-slate-700 font-medium">
                        Agent: {step.assignedAgent}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">Skill: {step.requiredSkill}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={step.status} size="sm" />
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Input:</span>
                  <span className="text-slate-700">{step.inputDescription}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Output:</span>
                  <span className="text-slate-700">
                    {step.outputDescription || 'Pending execution output...'}
                  </span>
                </div>
              </div>

              {step.executionDurationMs !== undefined && (
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Execution duration: {step.executionDurationMs}ms</span>
                  <span>Completed: {step.executedAt}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
