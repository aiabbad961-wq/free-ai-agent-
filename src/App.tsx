import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/Toast';
import { DispatchTaskModal, AgentFormModal, AddPaymentModal } from './components/Modals';
import { OverviewPage } from './pages/OverviewPage';
import { ManagerChatPage } from './pages/ManagerChatPage';
import { AgentsPage } from './pages/AgentsPage';
import { TasksBoardPage } from './pages/TasksBoardPage';
import { FinancePage } from './pages/FinancePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { Agent } from './types';

const MainLayout: React.FC = () => {
  const { page } = useApp();

  // Modal states
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [preselectedAgentId, setPreselectedAgentId] = useState<string | undefined>(undefined);

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleOpenDispatch = (agentId?: string) => {
    setPreselectedAgentId(agentId);
    setIsDispatchModalOpen(true);
  };

  const handleOpenAddAgent = () => {
    setEditingAgent(null);
    setIsAgentModalOpen(true);
  };

  const handleOpenEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsAgentModalOpen(true);
  };

  const handleOpenAddPayment = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--txt)] antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar onOpenDispatchModal={() => handleOpenDispatch()} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {page === 'overview' && (
            <OverviewPage
              onOpenDispatch={() => handleOpenDispatch()}
              onOpenAddPayment={handleOpenAddPayment}
            />
          )}

          {page === 'chat' && <ManagerChatPage />}

          {page === 'agents' && (
            <AgentsPage
              onOpenAddAgent={handleOpenAddAgent}
              onOpenEditAgent={handleOpenEditAgent}
              onOpenDispatchForAgent={(agId) => handleOpenDispatch(agId)}
            />
          )}

          {page === 'tasks' && (
            <TasksBoardPage onOpenDispatchModal={() => handleOpenDispatch()} />
          )}

          {page === 'finance' && (
            <FinancePage onOpenAddPayment={handleOpenAddPayment} />
          )}

          {page === 'departments' && (
            <DepartmentsPage onOpenDispatch={() => handleOpenDispatch()} />
          )}
        </main>
      </div>

      {/* Modals */}
      <DispatchTaskModal
        isOpen={isDispatchModalOpen}
        onClose={() => {
          setIsDispatchModalOpen(false);
          setPreselectedAgentId(undefined);
        }}
        preselectedAgentId={preselectedAgentId}
      />

      <AgentFormModal
        isOpen={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false);
          setEditingAgent(null);
        }}
        initialAgent={editingAgent}
      />

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
