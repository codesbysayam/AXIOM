import React, { useState } from 'react';
import { AgenticIndexPage } from './pages/AgenticIndexPage';
import { OperationsStoreProvider, useOperationsStore } from './orchestrator/store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SystemPulseRail } from './components/SystemPulseRail';
import { ToastContainer } from './components/ToastContainer';
import { CommandPalette } from './components/CommandPalette';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PolicySimulatorModal } from './components/PolicySimulatorModal';
import { GovernanceCertificateModal } from './components/GovernanceCertificateModal';
import { CreateWorkflowModal } from './components/CreateWorkflowModal';
import { ExecutionReplayTheaterModal } from './components/ExecutionReplayTheaterModal';
import { OperatorProfileModal } from './components/OperatorProfileModal';
import { MissionControlModal } from './components/mission/MissionControlModal';
import { AgentFleetInspector } from './components/inspectors/AgentFleetInspector';
import { ActivePipelinesInspector } from './components/inspectors/ActivePipelinesInspector';

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
  const {
    currentView,
    activeModal,
    closeModal,
    inspector,
    closeInspector,
    mobileNavOpen,
    setMobileNavOpen,
  } = useOperationsStore();
  const [missionControl, setMissionControl] = useState(false);

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
    <div className="axiom-app-shell" data-mission-control={missionControl ? 'true' : 'false'}>
      <header className="axiom-app-header">
        <Header
          onBackToIndex={onBackToIndex}
          missionControl={missionControl}
          onToggleMissionControl={() => setMissionControl((curr) => !curr)}
        />
        <SystemPulseRail />
      </header>

      {/* Mobile Drawer Backdrop (Point 14) */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-[#182536]/40 z-40 lg:hidden backdrop-blur-[1px]"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className="axiom-sidebar" data-open={mobileNavOpen ? 'true' : 'false'}>
        <div className="axiom-sidebar-inner">
          <Sidebar onBackToIndex={onBackToIndex} />
        </div>
      </aside>

      <main className="axiom-main">
        <div className="workspace px-6 sm:px-10 lg:px-12 py-8 sm:py-10 max-w-[1480px] mx-auto w-full">
          {renderActiveView()}
        </div>
      </main>

      <ToastContainer />

      {/* Global Context Inspectors (Point 3) */}
      <AgentFleetInspector
        isOpen={inspector?.type === 'agents'}
        onClose={closeInspector}
        selectedAgentId={inspector?.payload}
      />
      <ActivePipelinesInspector
        isOpen={inspector?.type === 'pipelines'}
        onClose={closeInspector}
        selectedPipelineId={inspector?.payload}
      />

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

      {/* Fullscreen Mission Control Mode (Feature 6 & 15) */}
      {missionControl && (
        <MissionControlModal onClose={() => setMissionControl(false)} />
      )}
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
