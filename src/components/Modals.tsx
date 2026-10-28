import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Agent, DepartmentType, TaskPriority } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import { X, Check } from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--txt)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--txt)] hover:bg-[var(--panel2)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// 1. Dispatch Task Modal
export const DispatchTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  preselectedAgentId?: string;
}> = ({ isOpen, onClose, preselectedAgentId }) => {
  const { agents, dispatchTask } = useApp();
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(preselectedAgentId || (agents[0]?.id || 'WebBuilder'));
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const currentAgent = agents.find((a) => a.id === assignedTo) || agents[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentAgent) return;

    dispatchTask({
      title: title.trim(),
      assignedTo: currentAgent.id,
      dept: currentAgent.dept,
      priority,
      loadWeight: priority === 'urgent' ? 40 : priority === 'high' ? 30 : 20,
      description: description.trim() || undefined,
    });

    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <ModalWrapper title="Dispatch New Agency Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[var(--muted)] font-medium mb-1">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build client landing page with mobile responsiveness"
            className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Assign To Agent *</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.emoji} {ag.name} ({ag.dept})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              <option value="low">Low (Routine)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="high">High (Priority)</option>
              <option value="urgent">Urgent (Immediate)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[var(--muted)] font-medium mb-1">Description & Deliverables</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details, requirements, target repo or client notes..."
            className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)] text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Dispatch</span>
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 2. Add / Edit Agent Modal
export const AgentFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialAgent?: Agent | null;
}> = ({ isOpen, onClose, initialAgent }) => {
  const { addAgent, updateAgent } = useApp();
  const [name, setName] = useState(initialAgent?.name || '');
  const [emoji, setEmoji] = useState(initialAgent?.emoji || '🤖');
  const [role, setRole] = useState(initialAgent?.role || '');
  const [dept, setDept] = useState<DepartmentType>(initialAgent?.dept || 'Engineering');
  const [desc, setDesc] = useState(initialAgent?.desc || '');

  if (!isOpen) return null;

  const emojiOptions = ['🤖', '🌐', '📱', '📊', '🔍', '🛡️', '💰', '📣', '✍️', '🗂️', '🎯', '🕵️', '⚙️', '🎨', '🚀'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    if (initialAgent) {
      updateAgent(initialAgent.id, {
        name: name.trim(),
        emoji,
        role: role.trim(),
        dept,
        desc: desc.trim(),
      });
    } else {
      addAgent({
        name: name.trim(),
        emoji,
        role: role.trim(),
        dept,
        desc: desc.trim(),
      });
    }

    onClose();
  };

  return (
    <ModalWrapper title={initialAgent ? `Edit Agent: ${initialAgent.name}` : 'Add New Autonomous Agent'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <label className="block text-[var(--muted)] font-medium mb-1">Avatar</label>
            <select
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-2 py-2 text-[var(--txt)] text-sm text-center focus:outline-hidden"
            >
              {emojiOptions.map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-[var(--muted)] font-medium mb-1">Agent Codename *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CodeForge, MetricPulse"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. AI Prompt Engineer"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Department *</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as DepartmentType)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[var(--muted)] font-medium mb-1">Responsibilities & Mandate</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Agent ke maqasid aur deliverables (e.g. Code audits, customer queries)..."
            className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)] text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            {initialAgent ? 'Save Changes' : 'Create Agent'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 3. Add Payment Modal
export const AddPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { addPayment } = useApp();
  const [clientName, setClientName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [method, setMethod] = useState('Mezan Bank Direct');
  const [status, setStatus] = useState<'pending' | 'verified'>('pending');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!clientName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addPayment({
      clientName: clientName.trim(),
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-4)}`,
      amount: parsedAmount,
      currency,
      method,
      status,
      verifiedBy: status === 'verified' ? 'Vault' : undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
    setClientName('');
    setAmount('');
    setNotes('');
  };

  return (
    <ModalWrapper title="Record New Inflow Payment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Client / Entity *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Apex Tech, Karachi"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs font-mono focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Amount *</label>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150000"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs font-mono tabular-nums focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'PKR' | 'USD')}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              <option value="PKR">PKR (Pakistani Rupee)</option>
              <option value="USD">USD (US Dollar)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Settlement Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              <option value="Mezan Bank Direct">Mezan Bank Direct (PKR)</option>
              <option value="International Wire / SWIFT">International Wire / SWIFT</option>
              <option value="Upwork Escrow">Upwork Escrow</option>
              <option value="Payoneer / Wise">Payoneer / Wise</option>
              <option value="Cash / Cheque">Cash / Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-[var(--muted)] font-medium mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'verified')}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
            >
              <option value="pending">Pending (Awaiting Vault verification)</option>
              <option value="verified">Verified (Pre-cleared by Vault)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[var(--muted)] font-medium mb-1">Verification Slip Reference / Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Deposit slip #, reference or transaction ID..."
            className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--txt)] text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)] text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
          >
            Record Payment
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
