import React, { useState } from 'react';
import {
  CheckCircle2,
  Layers,
  Lock,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { AGENT_WORKFORCE, CUSTOM_SKILLS } from '../data/agentsAndSkills';
import { WorkflowDefinition, WorkflowStep } from '../types';
import { useOperationsStore } from '../orchestrator/store';

export interface WorkflowCanvasBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CanvasNode {
  id: string;
  name: string;
  agentName: string;
  skillName: string;
  requiresApproval: boolean;
  x: number;
  y: number;
}

export const WorkflowCanvasBuilder: React.FC<WorkflowCanvasBuilderProps> = ({
  isOpen,
  onClose,
}) => {
  const { createWorkflow, addToast } = useOperationsStore();
  const [pipelineTitle, setPipelineTitle] = useState('Enterprise Multi-Agent Pipeline');
  const [pipelineCategory, setPipelineCategory] = useState('Operations & Support');
  const [riskTier, setRiskTier] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [activeNodeId, setActiveNodeId] = useState<string | null>('node-1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(-1);

  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: 'node-1',
      name: 'Semantic Request Parsing',
      agentName: 'Intent Analyst',
      skillName: 'Requirement Analysis',
      requiresApproval: false,
      x: 40,
      y: 120,
    },
    {
      id: 'node-2',
      name: 'Policy & Invariant Bounds Check',
      agentName: 'Validation Tester',
      skillName: 'Policy Verification',
      requiresApproval: false,
      x: 290,
      y: 120,
    },
    {
      id: 'node-3',
      name: 'Mandatory Human Authorization Gate',
      agentName: 'Release Guardian',
      skillName: 'Hard Boundary Enforcement',
      requiresApproval: true,
      x: 540,
      y: 120,
    },
    {
      id: 'node-4',
      name: 'Atomic External Transaction Dispatch',
      agentName: 'Task Executor',
      skillName: 'Access Grant Control',
      requiresApproval: false,
      x: 790,
      y: 120,
    },
  ]);

  if (!isOpen) return null;

  const handleAddNode = () => {
    const nextIdx = nodes.length + 1;
    const newNode: CanvasNode = {
      id: `node-${Date.now().toString(36)}`,
      name: `Step ${nextIdx} Autonomous Action`,
      agentName: 'Quality Reviewer',
      skillName: 'Semantic Consistency',
      requiresApproval: false,
      x: 40 + (nodes.length % 4) * 240,
      y: 120 + Math.floor(nodes.length / 4) * 140,
    };
    setNodes((prev) => [...prev, newNode]);
    setActiveNodeId(newNode.id);
  };

  const handleRemoveNode = (id: string) => {
    if (nodes.length <= 1) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (activeNodeId === id) setActiveNodeId(null);
  };

  const handleSimulateCanvas = () => {
    setIsSimulating(true);
    setSimStepIndex(0);
    addToast('Simulation Started', 'Traversing visual canvas graph nodes...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= nodes.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimStepIndex(-1);
        addToast('Canvas Flow Validated', 'All nodes executed under formal invariants.', 'success');
      } else {
        setSimStepIndex(current);
      }
    }, 700);
  };

  const handleSaveToRegistry = () => {
    if (!pipelineTitle.trim()) return;

    const steps: WorkflowStep[] = nodes.map((n, idx) => ({
      id: `step-${idx + 1}`,
      name: n.name,
      assignedAgent: n.agentName,
      requiredSkill: n.skillName,
      status: 'pending',
      inputDescription: idx === 0 ? 'Initial payload' : `Output from node ${idx}`,
      outputDescription: `Verified output from ${n.agentName}`,
      requiresApproval: n.requiresApproval,
    }));

    const newWf: WorkflowDefinition = {
      id: `wf-custom-${Date.now().toString(36)}`,
      title: pipelineTitle,
      category: pipelineCategory,
      description: `Custom visual canvas pipeline with ${nodes.length} orchestrated nodes.`,
      riskTier,
      status: 'active',
      totalRuns: 0,
      steps,
    };

    createWorkflow(newWf);
    onClose();
  };

  const activeNode = nodes.find((n) => n.id === activeNodeId);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF8] border border-[#D5D5CE] rounded-[2px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Canvas Toolbar Header */}
        <div className="p-4 border-b border-[#D5D5CE] bg-[#FAF9F5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#FFF8E6] text-[#A87405] rounded-[2px] border border-[#A87405]/30">
              <Workflow size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pipelineTitle}
                  onChange={(e) => setPipelineTitle(e.target.value)}
                  className="font-serif font-bold text-base text-[#182536] bg-transparent border-b border-transparent hover:border-[#D5D5CE] focus:border-[#182536] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#5E6975] font-mono mt-0.5">
                Interactive Visual Orchestration Canvas · {nodes.length} Nodes Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNode}
              className="axiom-btn-secondary py-1 px-2.5 text-xs"
            >
              <Plus size={12} />
              <span>Add Node</span>
            </button>

            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateCanvas}
              className="axiom-btn-secondary py-1 px-2.5 text-xs"
            >
              <Play size={12} className={isSimulating ? 'animate-spin text-[#A87405]' : ''} />
              <span>{isSimulating ? `Testing Step ${simStepIndex + 1}...` : 'Simulate Graph'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToRegistry}
              className="axiom-btn-primary py-1 px-3 text-xs"
            >
              <CheckCircle2 size={12} />
              <span>Register Pipeline</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#5E6975] hover:text-[#182536] rounded-[2px] ml-2"
              aria-label="Close canvas"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Canvas Body & Inspector Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Visual Node Graph Area */}
          <div className="flex-1 bg-[#F5F1E6] p-6 overflow-auto relative">
            {/* Dot grid background */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #5E6975 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 flex items-center gap-4 flex-wrap pb-8 pt-4">
              {nodes.map((node, idx) => {
                const isSelected = activeNodeId === node.id;
                const isExecuting = isSimulating && simStepIndex === idx;
                const isPassed = isSimulating && simStepIndex > idx;

                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setActiveNodeId(node.id)}
                      className={`w-56 p-4 rounded-[2px] bg-[#FFFDF8] border transition-all cursor-pointer shadow-2xs relative ${
                        isSelected
                          ? 'border-2 border-[#182536] ring-2 ring-[#182536]/15'
                          : node.requiresApproval
                          ? 'border-2 border-[#A87405] bg-[#FFF8E6]'
                          : isExecuting
                          ? 'border-2 border-[#138468] animate-pulse'
                          : 'border-[#D5D5CE] hover:border-[#B4B4A8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#5E6975] mb-1">
                        <span>STAGE 0{idx + 1}</span>
                        {node.requiresApproval ? (
                          <span className="font-bold text-[#A87405] flex items-center gap-0.5">
                            <Lock size={9} />
                            HUMAN GATE
                          </span>
                        ) : (
                          <span className={isPassed ? 'text-[#138468] font-bold' : ''}>
                            {isPassed ? 'PASSED' : isExecuting ? 'RUNNING' : 'DETERMINISTIC'}
                          </span>
                        )}
                      </div>

                      <div className="font-serif font-bold text-xs text-[#182536] truncate">
                        {node.name}
                      </div>

                      <div className="text-[10px] font-mono text-[#334256] mt-1 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#182536]" />
                        <span>{node.agentName}</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#EFEFEB] flex items-center justify-between text-[9px] font-mono text-[#5E6975]">
                        <span className="truncate max-w-[120px]">{node.skillName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNode(node.id);
                          }}
                          className="text-[#5E6975] hover:text-[#D72F40] p-0.5"
                          title="Delete Node"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>

                    {idx < nodes.length - 1 && (
                      <div className="text-[#5E6975] font-mono text-sm">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Sidebar Panel */}
          {activeNode && (
            <div className="w-72 bg-[#FFFDF8] border-l border-[#D5D5CE] p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="border-b border-[#EFEFEB] pb-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#5E6975] block">
                    Node Inspector
                  </span>
                  <div className="font-serif font-bold text-sm text-[#182536] mt-0.5">
                    {activeNode.name}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#5E6975] block mb-1">
                    Node Label:
                  </label>
                  <input
                    type="text"
                    value={activeNode.name}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === activeNode.id ? { ...n, name: e.target.value } : n,
                      );
                      setNodes(updated);
                    }}
                    className="w-full px-2 py-1 text-xs border border-[#D5D5CE] rounded-[2px] bg-[#FAF9F5] text-[#182536]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#5E6975] block mb-1">
                    Assigned Agent:
                  </label>
                  <select
                    value={activeNode.agentName}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === activeNode.id ? { ...n, agentName: e.target.value } : n,
                      );
                      setNodes(updated);
                    }}
                    className="w-full px-2 py-1 text-xs border border-[#D5D5CE] rounded-[2px] bg-white text-[#182536]"
                  >
                    {AGENT_WORKFORCE.map((ag) => (
                      <option key={ag.id} value={ag.name}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#5E6975] block mb-1">
                    Contract Skill:
                  </label>
                  <select
                    value={activeNode.skillName}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === activeNode.id ? { ...n, skillName: e.target.value } : n,
                      );
                      setNodes(updated);
                    }}
                    className="w-full px-2 py-1 text-xs border border-[#D5D5CE] rounded-[2px] bg-white text-[#182536]"
                  >
                    {CUSTOM_SKILLS.map((sk) => (
                      <option key={sk.id} value={sk.name}>
                        {sk.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-[#EFEFEB]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.requiresApproval}
                      onChange={(e) => {
                        const updated = nodes.map((n) =>
                          n.id === activeNode.id ? { ...n, requiresApproval: e.target.checked } : n,
                        );
                        setNodes(updated);
                      }}
                      className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0"
                    />
                    <span className="text-xs text-[#182536] font-medium">
                      Enforce Mandatory Human Gate
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-[#5E6975] block mt-1">
                    Execution automatically suspends pending operator authorization signature.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFEFEB] text-[10px] font-mono text-[#5E6975]">
                Node ID: {activeNode.id}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
