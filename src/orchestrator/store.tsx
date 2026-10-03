import React, { createContext, useContext, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (view: ConsoleView, workflowId?: string) => {
    setCurrentView(view);
    if (workflowId) {
      setSelectedWorkflowId(workflowId);
    }
  };

  const openModal = (name: string, payload?: any) => {
    setActiveModal(name);
    setModalPayload(payload);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  const approveRequest = (id: string, note?: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    setApprovals((prev) =>
      prev.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'approved',
              resolvedAt: 'Just now',
              resolvedBy: 'Lead Operator',
              resolutionNote: note || 'Approved by operator',
            }
          : appr,
      ),
    );

    // Update related workflow step
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === target.workflowId) {
          const updatedSteps = wf.steps.map((st) => {
            if (st.id === target.stepId) {
              return { ...st, status: 'completed' as const, outputDescription: 'Approved by human operator' };
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
    setAuditLogs((prev) => [newLog, ...prev]);

    addToast('Approval Granted', `Authorized step "${target.stepName}" safely.`, 'success');
  };

  const rejectRequest = (id: string, note?: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    setApprovals((prev) =>
      prev.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'rejected',
              resolvedAt: 'Just now',
              resolvedBy: 'Lead Operator',
              resolutionNote: note || 'Rejected per policy check',
            }
          : appr,
      ),
    );

    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === target.workflowId) {
          const updatedSteps = wf.steps.map((st) => {
            if (st.id === target.stepId) {
              return { ...st, status: 'failed' as const, outputDescription: 'Halted: Operator declined authorization' };
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
    setAuditLogs((prev) => [newLog, ...prev]);

    addToast('Execution Halted', `Request ${id} declined. Policy boundary preserved.`, 'warning');
  };

  const runWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === id) {
          const resetSteps = wf.steps.map((st, idx) => ({
            ...st,
            status: idx === 0 ? ('running' as const) : ('pending' as const),
          }));
          return {
            ...wf,
            totalRuns: wf.totalRuns + 1,
            lastRunAt: 'Just now',
            steps: resetSteps,
          };
        }
        return wf;
      }),
    );

    addToast('Workflow Triggered', `Pipeline execution started for ${id}.`, 'info');

    // Simulate progressive execution
    setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((wf) => {
          if (wf.id === id) {
            const advancedSteps = wf.steps.map((st, idx) => {
              if (idx === 0) return { ...st, status: 'completed' as const, executedAt: 'Just now' };
              if (idx === 1) return { ...st, status: 'running' as const };
              return st;
            });
            return { ...wf, steps: advancedSteps };
          }
          return wf;
        }),
      );
    }, 1200);
  };

  const createWorkflow = (newWf: WorkflowDefinition) => {
    setWorkflows((prev) => [newWf, ...prev]);
    addToast('Workflow Created', `Pipeline "${newWf.title}" registered successfully.`, 'success');
  };

  const resolveCase = (id: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' as const } : c)),
    );
    addToast('Case Resolved', `Incident case ${id} marked as resolved.`, 'success');
  };

  const resolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'resolved' as const } : inc)),
    );
    addToast('Incident Contained', `Incident ${id} marked as resolved with mitigation logged.`, 'success');
  };

  return (
    <OperationsStoreContext.Provider
      value={{
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
      }}
    >
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
