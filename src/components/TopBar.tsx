import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Clock as ClockIcon, ShieldCheck, Copy } from 'lucide-react';

interface TopBarProps {
  onOpenDispatchModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenDispatchModal }) => {
  const { page, bank, showToast } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitles: Record<string, string> = {
    overview: 'Agency Overview & Telemetry',
    chat: 'Sugarplum Manager Console',
    agents: 'Agent Directory & Load Matrix',
    tasks: 'Task Dispatch & Kanban Queue',
    finance: 'Finance & Mezan Bank Ledger',
    departments: 'Department Architecture',
  };

  const copyIban = () => {
    navigator.clipboard.writeText(bank.IBAN);
    showToast('IBAN copied to clipboard!');
  };

  return (
    <header className="h-16 border-b border-[var(--line)] bg-[var(--panel)] px-6 flex items-center justify-between gap-8 shrink-0 select-none">
      {/* Zone 1: Breadcrumb Title */}
      <div className="flex items-center gap-2 text-sm text-[var(--txt)] font-semibold truncate shrink-0">
        <span className="text-[var(--muted)] font-normal">Hive OS</span>
        <span className="text-[var(--muted)]">/</span>
        <span className="truncate">{pageTitles[page] || 'Dashboard'}</span>
      </div>

      {/* Zone 2: Navigation / Status items (Single line, no wrap) */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-[var(--muted)]">
        {/* Banking quick copy badge */}
        <button
          onClick={copyIban}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--panel2)] border border-[var(--line)] hover:border-blue-500/40 hover:text-[var(--txt)] transition-colors group"
          title="Click to copy Mezan Bank IBAN"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mezan Bank (PKR)</span>
          <span className="font-mono text-[11px] text-[var(--txt)]">..7949</span>
          <Copy className="w-3 h-3 text-[var(--muted)] group-hover:text-blue-400" />
        </button>

        {/* Real-time Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--panel2)] border border-[var(--line)] font-mono text-[11px] tabular-nums text-[var(--txt)]">
          <ClockIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>{timeStr || '00:00:00'}</span>
        </div>
      </div>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenDispatchModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch Task</span>
        </button>
      </div>
    </header>
  );
};
