import React, { useState } from 'react';
import { AgenticIndexPage } from './pages/AgenticIndexPage';
import { OperationsStoreProvider, useOperationsStore } from './orchestrator/store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { CommandPalette } from './components/CommandPalette';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PolicySimulatorModal } from './components/PolicySimulatorModal';
import { GovernanceCertificateModal } from './components/GovernanceCertificateModal';
import { CreateWorkflowModal } from './components/CreateWorkflowModal';
import { ExecutionReplayTheaterModal } from './components/ExecutionReplayTheaterModal';
import { OperatorProfileModal } from './components/OperatorProfileModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { WorkflowDetailPage } from './pages/WorkflowDetailPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { CasesPage } from './pages/CasesPage';
import { AgentsPage } from './pages/AgentsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ActivityPage } from './pages/ActivityPage';
import { AuditPage } from './pages/AuditPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GovernancePage } from './pages/GovernancePage';
import { IncidentsPage } from './pages/IncidentsPage';
import { HealthPage } from './pages/HealthPage';
import { DemoScenariosPage } from './pages/DemoScenariosPage';
import { JudgeModePage } from './pages/JudgeModePage';
import { SettingsPage } from './pages/SettingsPage';

function ConsoleApp({ onBackToIndex }: { onBackToIndex: () => void }) {
  const { currentView, activeModal, closeModal } = useOperationsStore();

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'workflow-detail':
        return <WorkflowDetailPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'cases':
        return <CasesPage />;
      case 'agents':
        return <AgentsPage />;
      case 'skills':
        return <SkillsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'audit':
        return <AuditPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'governance':
        return <GovernancePage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'health':
        return <HealthPage />;
      case 'demo-scenarios':
        return <DemoScenariosPage />;
      case 'judge-mode':
        return <JudgeModePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f0] text-[#17263d] flex flex-col font-sans">
      <Header onBackToIndex={onBackToIndex} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onBackToIndex={onBackToIndex} />
        <main className="flex-1 p-5 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      <ToastContainer />
      <CommandPalette
        isOpen={activeModal === 'command-palette'}
        onClose={closeModal}
        onBackToIndex={onBackToIndex}
      />
      <ArchitectureModal
        isOpen={activeModal === 'architecture'}
        onClose={closeModal}
      />
      <PolicySimulatorModal
        isOpen={activeModal === 'policy-simulator'}
        onClose={closeModal}
      />
      <GovernanceCertificateModal
        isOpen={activeModal === 'governance-certificate'}
        onClose={closeModal}
      />
      <CreateWorkflowModal
        isOpen={activeModal === 'create-workflow'}
        onClose={closeModal}
      />
      <ExecutionReplayTheaterModal
        isOpen={activeModal === 'execution-replay'}
        onClose={closeModal}
      />
      <OperatorProfileModal
        isOpen={activeModal === 'operator-profile'}
        onClose={closeModal}
      />
    </div>
  );
}

function MainRoot() {
  const [showIndex, setShowIndex] = useState(true);
  const { workflows } = useOperationsStore();

  if (showIndex) {
    return (
      <AgenticIndexPage
        workflows={workflows}
        onOpenConsole={() => setShowIndex(false)}
      />
    );
  }

  return <ConsoleApp onBackToIndex={() => setShowIndex(true)} />;
}

export default function App() {
  return (
    <OperationsStoreProvider>
      <MainRoot />
    </OperationsStoreProvider>
  );
}
