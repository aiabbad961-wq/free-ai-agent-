import React from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Bot,
  Users,
  CheckSquare,
  CreditCard,
  Building2,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { page, setPage, theme, toggleTheme, agents, payments, resetToDefaults } = useApp();

  const totalActiveTasks = agents.reduce(
    (acc, ag) => acc + ag.tasks.filter((t) => t.status !== 'completed').length,
    0
  );

  const pendingPayments = payments.filter((p) => p.status === 'pending').length;

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'chat',
      label: 'Manager Chat',
      icon: <Bot className="w-4 h-4 shrink-0" />,
      badge: 'Sugarplum',
      badgeColor: 'text-blue-400 bg-blue-500/10',
    },
    {
      id: 'agents',
      label: 'Agents Roster',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: agents.length,
      badgeColor: 'text-neutral-400 bg-neutral-800/40',
    },
    {
      id: 'tasks',
      label: 'Task Dispatch',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      badge: totalActiveTasks > 0 ? totalActiveTasks : undefined,
      badgeColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      id: 'finance',
      label: 'Finance & Bank',
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
      badge: pendingPayments > 0 ? `${pendingPayments} pend` : undefined,
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: <Building2 className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--line)] bg-[var(--panel)] flex flex-col h-screen sticky top-0 select-none z-20 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
            H
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[var(--txt)] flex items-center gap-1.5">
              <span>Hive</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded text-blue-400 bg-blue-500/10 border border-blue-500/20">
                OS
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">Agency Operating System</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--panel2)] text-[var(--muted)] hover:text-[var(--txt)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Agency Navigation
        </div>

        {navItems.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-[var(--muted)] hover:text-[var(--txt)] hover:bg-[var(--panel2)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-current/20 ${item.badgeColor || 'text-[var(--muted)]'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Sugarplum Orchestrator Quick Status */}
        <div className="pt-4 mt-4 border-t border-[var(--line)]">
          <div className="p-3 rounded-xl bg-[var(--panel2)] border border-[var(--line)]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🧑💼</span>
              <span className="text-xs font-semibold text-[var(--txt)]">Sugarplum Manager</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              Auto-routing rule engine active. Ready to dispatch across 6 departments.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--muted)] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Router Ready</span>
              </span>
              <span>11 Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Reset */}
      <div className="p-3 border-t border-[var(--line)] bg-[var(--panel)] text-[11px] text-[var(--muted)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px]">v2.4-local</span>
        </div>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1 text-[11px] hover:text-rose-400 transition-colors"
          title="Reset agency to original defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </aside>
  );
};
