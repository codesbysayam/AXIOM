import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GOVERNANCE_POLICIES,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CASES,
  INITIAL_INCIDENTS,
  INITIAL_WORKFLOWS,
} from '../data/advancedOpsData';
import {
  ApprovalRequest,
  AuditLogEntry,
  CaseItem,
  GovernancePolicy,
  IncidentItem,
  WorkflowDefinition,
} from '../types';

export type ConsoleView =
  | 'dashboard'
  | 'workflows'
  | 'workflow-detail'
  | 'cases'
  | 'approvals'
  | 'agents'
  | 'skills'
  | 'activity'
  | 'audit'
  | 'analytics'
  | 'governance'
  | 'incidents'
  | 'health'
  | 'demo-scenarios'
  | 'judge-mode'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type InspectorType = 'agents' | 'pipelines' | 'evidence' | null;

export interface InspectorState {
  type: InspectorType;
  payload?: any;
}

export interface SimulationClock {
  tick: number;
  isRunning: boolean;
  intervalMs: number;
  epochTime: string;
  cycleCount: number;
}

interface OperationsStoreContextType {
  currentView: ConsoleView;
  selectedWorkflowId: string | null;
  workflows: WorkflowDefinition[];
  approvals: ApprovalRequest[];
  auditLogs: AuditLogEntry[];
  cases: CaseItem[];
  incidents: IncidentItem[];
  policies: GovernancePolicy[];
  toasts: ToastMessage[];
  activeModal: string | null;
  modalPayload: any;
  inspector: InspectorState | null;
  simulationClock: SimulationClock;
  setClockRunning: (running: boolean) => void;
  setClockSpeed: (intervalMs: number) => void;
  advanceClockTick: () => void;
  toggleClock: () => void;
  openInspector: (type: InspectorType, payload?: any) => void;
  closeInspector: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  navigateTo: (view: ConsoleView, workflowId?: string) => void;
  approveRequest: (id: string, note?: string) => void;
  rejectRequest: (id: string, note?: string) => void;
  runWorkflow: (id: string) => void;
  createWorkflow: (newWf: WorkflowDefinition) => void;
  resolveCase: (id: string) => void;
  resolveIncident: (id: string) => void;
  openModal: (name: string, payload?: any) => void;
  closeModal: () => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const OperationsStoreContext = createContext<OperationsStoreContextType | null>(null);

export const OperationsStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ConsoleView>('dashboard');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>('wf-vendor-procurement');
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(INITIAL_WORKFLOWS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [policies, setPolicies] = useState<GovernancePolicy[]>(GOVERNANCE_POLICIES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);
  const [inspector, setInspector] = useState<InspectorState | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [simulationClock, setSimulationClock] = useState<SimulationClock>({
    tick: 1,
    isRunning: true,
    intervalMs: 1600,
    epochTime: new Date().toLocaleTimeString('en-GB', { hour12: false }) + '.000',
    cycleCount: 0,
  });

  const setClockRunning = useCallback((running: boolean) => {
    setSimulationClock((prev) => ({ ...prev, isRunning: running }));
  }, []);

  const toggleClock = useCallback(() => {
    setSimulationClock((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const setClockSpeed = useCallback((intervalMs: number) => {
    setSimulationClock((prev) => ({ ...prev, intervalMs }));
  }, []);

  const advanceClockTick = useCallback(() => {
    const now = new Date();
    const formattedEpoch = `${now.toLocaleTimeString('en-GB', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`;

    setSimulationClock((prev) => ({
      ...prev,
      tick: prev.tick + 1,
      epochTime: formattedEpoch,
      cycleCount: prev.cycleCount + 1,
    }));

    // 1. Advance running workflows in synchronized step lockstep
    setWorkflows((prevWorkflows) => {
      let changed = false;
      const updated = prevWorkflows.map((wf) => {
        const runningStepIndex = wf.steps.findIndex((s) => s.status === 'running');
        if (runningStepIndex === -1) return wf;

        changed = true;
        const currentRunningStep = wf.steps[runningStepIndex];
        const nextStep = wf.steps[runningStepIndex + 1];

        const newSteps = wf.steps.map((st, idx) => {
          if (idx === runningStepIndex) {
            return {
              ...st,
              status: 'completed' as const,
              executedAt: formattedEpoch,
              outputDescription:
                st.outputDescription || 'Deterministic verification pass: all invariants preserved.',
            };
          }
          if (idx === runningStepIndex + 1) {
            if (st.requiresApproval) {
              return {
                ...st,
                status: 'waiting_approval' as const,
              };
            }
            return {
              ...st,
              status: 'running' as const,
            };
          }
          return st;
        });

        // If next step requires approval, ensure an approval request exists
        if (nextStep && nextStep.requiresApproval) {
          setApprovals((prevApprovals) => {
            if (
              prevApprovals.some(
                (a) => a.workflowId === wf.id && a.stepId === nextStep.id && a.status === 'pending',
              )
            ) {
              return prevApprovals;
            }
            const newApproval: ApprovalRequest = {
              id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              workflowId: wf.id,
              workflowTitle: wf.title,
              stepId: nextStep.id,
              stepName: nextStep.name,
              agentName: nextStep.assignedAgent,
              riskTier: wf.riskTier,
              requestedAt: formattedEpoch,
              status: 'pending',
              summary: `Synchronized execution gated at step: ${nextStep.name}. Operator authorization required for external state mutation.`,
              proposedAction: `Authorize live execution of ${nextStep.name} for ${wf.title}.`,
              policyTriggered: 'POL-OPS-03 (Human Authority Boundary)',
            };
            return [newApproval, ...prevApprovals];
          });
        }

        const hasWaiting = newSteps.some((s) => s.status === 'waiting_approval');
        const allCompleted = newSteps.every((s) => s.status === 'completed');

        // Record a synchronized immutable audit log entry for the transition
        const newAuditEntry: AuditLogEntry = {
          id: `audit-sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: formattedEpoch,
          workflowId: wf.id,
          agentName: currentRunningStep.assignedAgent,
          action: `${currentRunningStep.name.toUpperCase().replace(/\s+/g, '_')}_COMMIT`,
          outcome: 'success',
          details: `Synchronized tick: Completed step "${currentRunningStep.name}" for ${wf.title}. Invariants validated.`,
          hash: `sha256-${Math.random().toString(16).substring(2, 10)}..${Math.random().toString(16).substring(2, 6)}`,
        };
        setAuditLogs((prevLogs) => [newAuditEntry, ...prevLogs.slice(0, 49)]);

        return {
          ...wf,
          steps: newSteps,
          lastRunAt: formattedEpoch,
          status: hasWaiting || allCompleted ? ('active' as const) : ('running' as const),
        };
      });

      return changed ? updated : prevWorkflows;
    });
  }, []);

  useEffect(() => {
    if (!simulationClock.isRunning) return;
    const interval = setInterval(() => {
      advanceClockTick();
    }, simulationClock.intervalMs);

    return () => clearInterval(interval);
  }, [simulationClock.isRunning, simulationClock.intervalMs, advanceClockTick]);

  const openInspector = useCallback((type: InspectorType, payload?: any) => {
    setInspector({ type, payload });
  }, []);

  const closeInspector = useCallback(() => {
    setInspector(null);
  }, []);

  const addToast = useCallback(
    (
      title: string,
      message: string,
      type: 'success' | 'info' | 'warning' | 'error' = 'info',
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 4500);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigateTo = useCallback((view: ConsoleView, workflowId?: string) => {
    setCurrentView(view);
    if (workflowId) {
      setSelectedWorkflowId(workflowId);
    }
  }, []);

  const openModal = useCallback((name: string, payload?: any) => {
    setActiveModal(name);
    setModalPayload(payload);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  const approveRequest = useCallback(
    (id: string, note?: string) => {
      setApprovals((prev) => {
        const target = prev.find((a) => a.id === id);
        if (!target) return prev;

        const updated = prev.map((appr) =>
          appr.id === id
            ? {
                ...appr,
                status: 'approved' as const,
                resolvedAt: 'Just now',
                resolvedBy: 'Lead Operator',
                resolutionNote: note || 'Approved by operator',
              }
            : appr,
        );

        // Update related workflow step
        setWorkflows((wfs) =>
          wfs.map((wf) => {
            if (wf.id === target.workflowId) {
              const updatedSteps = wf.steps.map((st) => {
                if (st.id === target.stepId) {
                  return {
                    ...st,
                    status: 'completed' as const,
                    outputDescription: 'Approved by human operator',
                  };
                }
                if (st.status === 'pending') {
                  return { ...st, status: 'running' as const };
                }
                return st;
              });
              return { ...wf, steps: updatedSteps };
            }
            return wf;
          }),
        );

        // Record audit log
        const newLog: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: 'Just now',
          workflowId: target.workflowId,
          agentName: 'Human Operator',
          action: 'HUMAN_APPROVAL_GRANT',
          outcome: 'human_override',
          details: `Operator authorized request ${id} for workflow: ${target.workflowTitle}. Note: ${note || 'Verified'}`,
          hash: `${Math.random().toString(16).substring(2, 10)}..${Math.random().toString(16).substring(2, 6)}`,
        };
        setAuditLogs((logs) => [newLog, ...logs]);

        return updated;
      });

      addToast('Approval Granted', `Authorized human gate safely.`, 'success');
    },
    [addToast],
  );

  const rejectRequest = useCallback(
    (id: string, note?: string) => {
      setApprovals((prev) => {
        const target = prev.find((a) => a.id === id);
        if (!target) return prev;

        const updated = prev.map((appr) =>
          appr.id === id
            ? {
                ...appr,
                status: 'rejected' as const,
                resolvedAt: 'Just now',
                resolvedBy: 'Lead Operator',
                resolutionNote: note || 'Rejected per policy check',
              }
            : appr,
        );

        setWorkflows((wfs) =>
          wfs.map((wf) => {
            if (wf.id === target.workflowId) {
              const updatedSteps = wf.steps.map((st) => {
                if (st.id === target.stepId) {
                  return {
                    ...st,
                    status: 'failed' as const,
                    outputDescription: 'Halted: Operator declined authorization',
                  };
                }
                return st;
              });
              return { ...wf, steps: updatedSteps };
            }
            return wf;
          }),
        );

        const newLog: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: 'Just now',
          workflowId: target.workflowId,
          agentName: 'Human Operator',
          action: 'HUMAN_APPROVAL_REJECT',
          outcome: 'policy_block',
          details: `Operator rejected request ${id} for workflow: ${target.workflowTitle}. Reason: ${note || 'Safety rejection'}`,
          hash: `${Math.random().toString(16).substring(2, 10)}..${Math.random().toString(16).substring(2, 6)}`,
        };
        setAuditLogs((logs) => [newLog, ...logs]);

        return updated;
      });

      addToast('Execution Halted', `Request ${id} declined. Policy boundary preserved.`, 'warning');
    },
    [addToast],
  );

  const runWorkflow = useCallback(
    (id: string) => {
      const now = new Date();
      const formattedEpoch = `${now.toLocaleTimeString('en-GB', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`;

      setWorkflows((prev) =>
        prev.map((wf) => {
          if (wf.id === id) {
            const resetSteps = wf.steps.map((st, idx) => ({
              ...st,
              status: idx === 0 ? ('running' as const) : ('pending' as const),
              executedAt: idx === 0 ? formattedEpoch : undefined,
            }));
            return {
              ...wf,
              status: 'running' as const,
              totalRuns: wf.totalRuns + 1,
              lastRunAt: formattedEpoch,
              steps: resetSteps,
            };
          }
          return wf;
        }),
      );

      // Ensure simulationClock is running to coordinate step transitions
      setSimulationClock((prev) => ({ ...prev, isRunning: true }));

      addToast(
        'Workflow Triggered',
        `Pipeline execution started for ${id} synchronized with centralized clock.`,
        'info',
      );
    },
    [addToast],
  );

  const createWorkflow = useCallback(
    (newWf: WorkflowDefinition) => {
      setWorkflows((prev) => [newWf, ...prev]);
      addToast('Workflow Created', `Pipeline "${newWf.title}" registered successfully.`, 'success');
    },
    [addToast],
  );

  const resolveCase = useCallback(
    (id: string) => {
      setCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'resolved' as const } : c)),
      );
      addToast('Case Resolved', `Incident case ${id} marked as resolved.`, 'success');
    },
    [addToast],
  );

  const resolveIncident = useCallback(
    (id: string) => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: 'resolved' as const } : inc)),
      );
      addToast('Incident Contained', `Incident ${id} marked as resolved with mitigation logged.`, 'success');
    },
    [addToast],
  );

  const value = useMemo(
    () => ({
      currentView,
      selectedWorkflowId,
      workflows,
      approvals,
      auditLogs,
      cases,
      incidents,
      policies,
      toasts,
      activeModal,
      modalPayload,
      inspector,
      simulationClock,
      setClockRunning,
      setClockSpeed,
      advanceClockTick,
      toggleClock,
      openInspector,
      closeInspector,
      mobileNavOpen,
      setMobileNavOpen,
      searchTerm,
      setSearchTerm,
      navigateTo,
      approveRequest,
      rejectRequest,
      runWorkflow,
      createWorkflow,
      resolveCase,
      resolveIncident,
      openModal,
      closeModal,
      addToast,
      removeToast,
    }),
    [
      currentView,
      selectedWorkflowId,
      workflows,
      approvals,
      auditLogs,
      cases,
      incidents,
      policies,
      toasts,
      activeModal,
      modalPayload,
      inspector,
      simulationClock,
      setClockRunning,
      setClockSpeed,
      advanceClockTick,
      toggleClock,
      openInspector,
      closeInspector,
      mobileNavOpen,
      setMobileNavOpen,
      searchTerm,
      navigateTo,
      approveRequest,
      rejectRequest,
      runWorkflow,
      createWorkflow,
      resolveCase,
      resolveIncident,
      openModal,
      closeModal,
      addToast,
      removeToast,
    ],
  );

  return (
    <OperationsStoreContext.Provider value={value}>
      {children}
    </OperationsStoreContext.Provider>
  );
};

export const useOperationsStore = () => {
  const context = useContext(OperationsStoreContext);
  if (!context) {
    throw new Error('useOperationsStore must be used within an OperationsStoreProvider');
  }
  return context;
};
