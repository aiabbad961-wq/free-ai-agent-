import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Agent,
  AgentTask,
  Payment,
  BankDetails,
  ActivityFeedItem,
  ChatMessage,
  PageId,
  DepartmentType,
  TaskPriority,
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_PAYMENTS,
  INITIAL_BANK,
  INITIAL_FEED,
} from '../data/initialData';

const STORAGE_KEY = 'hive-os-v2';

interface AppState {
  theme: 'dark' | 'light';
  page: PageId;
  agents: Agent[];
  payments: Payment[];
  feed: ActivityFeedItem[];
  bank: BankDetails;
  chatHistory: ChatMessage[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  page: PageId;
  setPage: (p: PageId) => void;
  agents: Agent[];
  payments: Payment[];
  feed: ActivityFeedItem[];
  bank: BankDetails;
  chatHistory: ChatMessage[];
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Task actions
  dispatchTask: (params: {
    title: string;
    assignedTo: string;
    dept: DepartmentType;
    priority?: TaskPriority;
    loadWeight?: number;
    description?: string;
  }) => AgentTask;
  completeTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: AgentTask['status']) => void;

  // Agent actions
  addAgent: (agent: Omit<Agent, 'id' | 'tasks'>) => Agent;
  updateAgent: (id: string, updates: Partial<Omit<Agent, 'id' | 'tasks'>>) => void;
  deleteAgent: (id: string) => void;

  // Payment actions
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => Payment;
  verifyPayment: (id: string, officer?: string) => void;
  flagPayment: (id: string) => void;

  // Chat actions
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'> & { suggestedAction?: ChatMessage['suggestedAction'] }) => void;
  clearChat: () => void;

  // Feed & Reset
  addFeedItem: (emoji: string, text: string, type?: ActivityFeedItem['type']) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [page, setPage] = useState<PageId>('overview');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [feed, setFeed] = useState<ActivityFeedItem[]>(INITIAL_FEED);
  const [bank, setBank] = useState<BankDetails>(INITIAL_BANK);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-seed-1',
      sender: 'bot',
      text: 'Assalam-o-Alaikum! Main Sugarplum hoon — Hive Agency Orchestrator. Main apke tasks sahi agents aur departments ko intelligently dispatch karta hoon, load balance karta hoon aur payments track karta hoon.\n\nKisi bhi project ka task batao (e.g. Website development, Marketing campaign, Security audit, Lead generation ya Payment verification) — main foran agent assign kar doonga!',
      timestamp: '10:00 AM',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppState = JSON.parse(stored);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.page) setPage(parsed.page);
        if (parsed.agents && parsed.agents.length > 0) setAgents(parsed.agents);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.feed) setFeed(parsed.feed);
        if (parsed.bank) setBank(parsed.bank);
        if (parsed.chatHistory && parsed.chatHistory.length > 0) setChatHistory(parsed.chatHistory);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
  }, []);

  // Sync to document theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      const payload: AppState = {
        theme,
        page,
        agents,
        payments,
        feed,
        bank,
        chatHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [theme, page, agents, payments, feed, bank, chatHistory]);

  const showToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addFeedItem = (emoji: string, text: string, type: ActivityFeedItem['type'] = 'system') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newItem: ActivityFeedItem = {
      id: 'feed-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      emoji,
      text,
      time: timeStr,
      type,
    };
    setFeed((prev) => [newItem, ...prev.slice(0, 49)]);
  };

  const dispatchTask = ({
    title,
    assignedTo,
    dept,
    priority = 'medium',
    loadWeight = 25,
    description,
  }: {
    title: string;
    assignedTo: string;
    dept: DepartmentType;
    priority?: TaskPriority;
    loadWeight?: number;
    description?: string;
  }): AgentTask => {
    const now = new Date();
    const timeStr = now.toISOString().slice(0, 16).replace('T', ' ');
    const newTask: AgentTask = {
      id: 'tsk-' + Date.now(),
      title,
      dept,
      assignedTo,
      priority,
      status: 'in_progress',
      createdAt: timeStr,
      loadWeight,
      description,
    };

    setAgents((prevAgents) =>
      prevAgents.map((ag) => {
        if (ag.id === assignedTo || ag.name.toLowerCase() === assignedTo.toLowerCase()) {
          return {
            ...ag,
            tasks: [newTask, ...ag.tasks],
          };
        }
        return ag;
      })
    );

    addFeedItem('⚡', `New task dispatched to ${assignedTo}: "${title}"`, 'dispatch');
    showToast(`Task successfully dispatched to ${assignedTo}!`);

    return newTask;
  };

  const completeTask = (taskId: string) => {
    let completedTitle = '';
    let agentName = '';

    setAgents((prevAgents) =>
      prevAgents.map((ag) => {
        const found = ag.tasks.find((t) => t.id === taskId);
        if (found) {
          completedTitle = found.title;
          agentName = ag.name;
          return {
            ...ag,
            tasks: ag.tasks.map((t) =>
              t.id === taskId
                ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
                : t
            ),
          };
        }
        return ag;
      })
    );

    if (completedTitle) {
      addFeedItem('✅', `${agentName} ne task mukammal kiya: "${completedTitle}"`, 'system');
      showToast(`Task marked completed for ${agentName}`);
    }
  };

  const updateTaskStatus = (taskId: string, status: AgentTask['status']) => {
    setAgents((prevAgents) =>
      prevAgents.map((ag) => {
        const hasTask = ag.tasks.some((t) => t.id === taskId);
        if (!hasTask) return ag;
        return {
          ...ag,
          tasks: ag.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        };
      })
    );
  };

  const addAgent = (agentData: Omit<Agent, 'id' | 'tasks'>): Agent => {
    const cleanId = agentData.name.replace(/[^a-zA-Z0-9]/g, '') || 'Agent_' + Date.now();
    const newAgent: Agent = {
      ...agentData,
      id: cleanId,
      tasks: [],
      custom: true,
    };

    setAgents((prev) => [...prev, newAgent]);
    addFeedItem(agentData.emoji, `Naya agent join hua: ${agentData.name} (${agentData.role})`, 'system');
    showToast(`Agent ${agentData.name} added successfully!`);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<Omit<Agent, 'id' | 'tasks'>>) => {
    setAgents((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, ...updates } : ag))
    );
    showToast(`Agent details updated`);
  };

  const deleteAgent = (id: string) => {
    const target = agents.find((a) => a.id === id);
    if (!target) return;
    setAgents((prev) => prev.filter((a) => a.id !== id));
    addFeedItem('🗑️', `Agent ${target.name} department se remove kiya gaya`, 'system');
    showToast(`Agent ${target.name} removed`);
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'date'>): Payment => {
    const today = new Date().toISOString().slice(0, 10);
    const newPayment: Payment = {
      ...paymentData,
      id: 'pay-' + Date.now(),
      date: today,
    };

    setPayments((prev) => [newPayment, ...prev]);
    addFeedItem('💰', `Payment record hua: ${paymentData.clientName} (${paymentData.currency} ${paymentData.amount.toLocaleString()})`, 'payment');
    showToast(`Payment of ${paymentData.currency} ${paymentData.amount.toLocaleString()} recorded!`);
    return newPayment;
  };

  const verifyPayment = (id: string, officer = 'Vault') => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'verified' as const,
            verifiedBy: officer,
          };
        }
        return p;
      })
    );
    addFeedItem('🕵️', `${officer} ne payment record verify kiya — anti-fraud cleared`, 'payment');
    showToast(`Payment successfully verified by ${officer}!`);
  };

  const flagPayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'flagged' as const } : p))
    );
    addFeedItem('⚠️', `Payment record ko investigation ke liye flag kiya gaya`, 'payment');
    showToast('Payment record flagged for investigation', 'warning');
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'> & { suggestedAction?: ChatMessage['suggestedAction'] }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullMsg: ChatMessage = {
      ...msg,
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      timestamp: timeStr,
    };
    setChatHistory((prev) => [...prev, fullMsg]);
  };

  const clearChat = () => {
    setChatHistory([
      {
        id: 'msg-cleared',
        sender: 'bot',
        text: 'Chat history reset ho gayi hai. Sugarplum tayar hai — apna agla task ya question likhein!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showToast('Chat history cleared');
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all data back to original defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      setAgents(INITIAL_AGENTS);
      setPayments(INITIAL_PAYMENTS);
      setFeed(INITIAL_FEED);
      setBank(INITIAL_BANK);
      setTheme('dark');
      setPage('overview');
      setChatHistory([
        {
          id: 'msg-seed-1',
          sender: 'bot',
          text: 'Assalam-o-Alaikum! Main Sugarplum hoon — Hive Agency Orchestrator. Agency reset mukammal ho chuka hai. All systems active!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      showToast('All system data reset to defaults');
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        page,
        setPage,
        agents,
        payments,
        feed,
        bank,
        chatHistory,
        toasts,
        showToast,
        dismissToast,
        dispatchTask,
        completeTask,
        updateTaskStatus,
        addAgent,
        updateAgent,
        deleteAgent,
        addPayment,
        verifyPayment,
        flagPayment,
        addChatMessage,
        clearChat,
        addFeedItem,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
