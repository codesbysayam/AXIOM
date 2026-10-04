import React, { useState } from 'react';
import { Plus, Trash2, Workflow, X } from 'lucide-react';
import { AGENT_WORKFORCE, CUSTOM_SKILLS } from '../data/agentsAndSkills';
import { WorkflowDefinition, WorkflowStep } from '../types';
import { useOperationsStore } from '../orchestrator/store';

export interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ isOpen, onClose }) => {
  const { createWorkflow } = useOperationsStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Operations & Support');
  const [description, setDescription] = useState('');
  const [riskTier, setRiskTier] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step-1',
      name: 'Initial Request Parse',
      assignedAgent: 'Intent Analyst',
      requiredSkill: 'Requirement Analysis',
      status: 'pending',
      inputDescription: 'Incoming payload',
      outputDescription: 'Parsed intent parameters',
      requiresApproval: false,
    },
  ]);

  if (!isOpen) return null;

  const addStep = () => {
    const nextIdx = steps.length + 1;
    setSteps([
      ...steps,
      {
        id: `step-${nextIdx}`,
        name: `Step ${nextIdx} Execution`,
        assignedAgent: 'Task Executor',
        requiredSkill: 'Policy Verification',
        status: 'pending',
        inputDescription: 'Previous step output',
        outputDescription: 'Verified result',
        requiresApproval: false,
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newWf: WorkflowDefinition = {
      id: `wf-${Date.now().toString(36)}`,
      title,
      category,
      description: description || 'Custom multi-agent orchestrated pipeline.',
      riskTier,
      status: 'active',
      totalRuns: 0,
      steps,
    };

    createWorkflow(newWf);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#dce1e7] rounded-xs shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#dce1e7] flex items-start justify-between bg-[#faf9f5]">
          <div>
            <h3 className="text-base font-sans font-semibold text-[#17263d]">
              Create AXIOM Workflow
            </h3>
            <p className="text-xs text-[#5E6975] font-sans mt-0.5">
              Compose multi-agent pipeline with verifiable policy gates
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5E6975] hover:text-[#17263d] p-1 rounded-xs"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Workflow Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Enterprise Invoice Discrepancy Escalation"
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              >
                <option value="Finance & Payments">Finance & Payments</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Developer & Systems">Developer & Systems</option>
                <option value="Governance & Risk">Governance & Risk</option>
                <option value="Operations & Support">Operations & Support</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Risk Classification
              </label>
              <select
                value={riskTier}
                onChange={(e) => setRiskTier(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              >
                <option value="low">Low Risk (Autonomous allowed)</option>
                <option value="medium">Medium Risk (Audited)</option>
                <option value="high">High Risk (Human gate recommended)</option>
                <option value="critical">Critical Risk (Strict sign-off)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the purpose, invariants, and expected outcomes..."
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Pipeline Steps ({steps.length})
              </label>
              <button
                type="button"
                onClick={addStep}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={st.id} className="p-3 border border-slate-200 rounded bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider">
                      Step 0{idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        aria-label="Remove step"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={st.name}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx].name = e.target.value;
                      setSteps(next);
                    }}
                    placeholder="Step name"
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-sans text-slate-500 font-medium uppercase tracking-wider block mb-0.5">
                        Assigned Agent
                      </span>
                      <select
                        value={st.assignedAgent}
                        onChange={(e) => {
                          const next = [...steps];
                          next[idx].assignedAgent = e.target.value;
                          setSteps(next);
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                      >
                        {AGENT_WORKFORCE.map((ag) => (
                          <option key={ag.id} value={ag.name}>
                            {ag.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans text-slate-500 font-medium uppercase tracking-wider block mb-0.5">
                        Required Skill
                      </span>
                      <select
                        value={st.requiredSkill}
                        onChange={(e) => {
                          const next = [...steps];
                          next[idx].requiredSkill = e.target.value;
                          setSteps(next);
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                      >
                        {CUSTOM_SKILLS.map((sk) => (
                          <option key={sk.id} value={sk.name}>
                            {sk.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      checked={st.requiresApproval}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx].requiresApproval = e.target.checked;
                        setSteps(next);
                      }}
                      className="rounded border-slate-300 text-[#1b2e49] focus:ring-0"
                    />
                    <span className="text-xs text-slate-700">
                      Require explicit human operator approval before next step
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs text-white bg-[#1b2e49] hover:bg-slate-800 rounded font-medium shadow-xs"
            >
              Save Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
