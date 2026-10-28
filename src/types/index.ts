export type DepartmentType =
  | 'Engineering'
  | 'Data & Analytics'
  | 'Security'
  | 'Finance'
  | 'Marketing'
  | 'Operations';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AgentTask {
  id: string;
  title: string;
  dept: DepartmentType;
  assignedTo: string; // Agent name/id
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  loadWeight: number; // e.g. 20 - 35% load
  completedAt?: string;
  description?: string;
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  dept: DepartmentType;
  desc: string;
  tasks: AgentTask[];
  custom?: boolean;
}

export interface Payment {
  id: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: 'PKR' | 'USD';
  method: string;
  status: 'verified' | 'pending' | 'flagged';
  verifiedBy?: string;
  date: string;
  notes?: string;
}

export interface BankDetails {
  Bank: string;
  'Account Title': string;
  IBAN: string;
  'Account #': string;
  Currency: string;
}

export interface ActivityFeedItem {
  id: string;
  emoji: string;
  text: string;
  time: string;
  type?: 'dispatch' | 'payment' | 'security' | 'system';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'dispatch_task';
    agentId: string;
    dept: DepartmentType;
    taskTitle: string;
    say: string;
  };
}

export type PageId =
  | 'overview'
  | 'chat'
  | 'agents'
  | 'tasks'
  | 'finance'
  | 'departments';
