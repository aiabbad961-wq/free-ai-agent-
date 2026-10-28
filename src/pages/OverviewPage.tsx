import React from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/initialData';
import { calculateAgentLoad } from '../utils/router';
import {
  Users,
  CheckSquare,
  Activity,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface OverviewPageProps {
  onOpenDispatch: () => void;
  onOpenAddPayment: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onOpenDispatch, onOpenAddPayment }) => {
  const { agents, payments, feed, bank, setPage, showToast } = useApp();

  const totalActiveTasks = agents.reduce(
    (acc, ag) => acc + ag.tasks.filter((t) => t.status !== 'completed').length,
    0
  );

  const totalLoad =
    agents.length > 0
      ? Math.round(
          agents.reduce((acc, ag) => {
            const activeTasks = ag.tasks.filter((t) => t.status !== 'completed').length;
            return acc + calculateAgentLoad(activeTasks).percentage;
          }, 0) / agents.length
        )
      : 0;

  const verifiedPkr = payments
    .filter((p) => p.status === 'verified' && p.currency === 'PKR')
    .reduce((sum, p) => sum + p.amount, 0);

  const verifiedUsd = payments
    .filter((p) => p.status === 'verified' && p.currency === 'USD')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const copyText = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    showToast(`${label} copied!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">Active Agents</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">{agents.length}</div>
          <div className="text-[11px] text-[var(--muted)] mt-1">Distributed in 6 departments</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">In-Flight Tasks</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">{totalActiveTasks}</div>
          <div className="text-[11px] text-[var(--muted)] mt-1">Across all agent pipelines</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">Agency Workload</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">{totalLoad}%</div>
          <div className="text-[11px] text-[var(--muted)] mt-1">Optimal bandwidth capacity</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">Verified Inflow</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-[var(--txt)] truncate">
            Rs {verifiedPkr.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center justify-between">
            <span>+ ${verifiedUsd.toLocaleString()} USD</span>
            {pendingCount > 0 && <span className="text-amber-400">{pendingCount} pend</span>}
          </div>
        </div>
      </div>

      {/* Sugarplum Orchestrator Spotlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl shrink-0">
            🧑💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--txt)]">Sugarplum Orchestrator Engine</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Rule Router Active
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed max-w-2xl">
              Type or speak tasks in natural language (Urdu or English). Sugarplum automatically classifies the request, assigns the designated agent, recalculates workload percentages, and updates the agency registry. No API keys needed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setPage('chat')}
            className="px-3.5 py-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-xs font-semibold text-[var(--txt)] hover:bg-[var(--panel2)] transition-colors flex items-center gap-1.5"
          >
            <span>Open Chat Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenDispatch}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Quick Dispatch
          </button>
        </div>
      </div>

      {/* Two Column Layout: Department Load + Banking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Workload (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--txt)] flex items-center gap-2">
              <span>Department Allocations & Capacities</span>
              <span className="text-xs text-[var(--muted)] font-normal">· Real-time</span>
            </h2>
            <button
              onClick={() => setPage('departments')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEPARTMENTS.map((dept) => {
              const deptAgents = agents.filter((a) => a.dept === dept.name);
              const deptTasks = deptAgents.flatMap((a) => a.tasks.filter((t) => t.status !== 'completed'));
              const avgDeptLoad =
                deptAgents.length > 0
                  ? Math.round(
                      deptAgents.reduce((sum, a) => {
                        const count = a.tasks.filter((t) => t.status !== 'completed').length;
                        return sum + calculateAgentLoad(count).percentage;
                      }, 0) / deptAgents.length
                    )
                  : 0;

              return (
                <div
                  key={dept.name}
                  className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] hover:border-blue-500/30 transition-all cursor-pointer group"
                  onClick={() => setPage('agents')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-[var(--txt)] group-hover:text-blue-400 transition-colors">
                      {dept.name}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-[var(--muted)]">
                      {deptAgents.length} Agents · {deptTasks.length} In-Flight
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--muted)] line-clamp-1 mb-3">
                    {dept.description}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-[var(--muted)]">Load Factor</span>
                      <span className="tabular-nums font-semibold text-[var(--txt)]">{avgDeptLoad}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${avgDeptLoad}%`,
                          backgroundColor:
                            avgDeptLoad > 70 ? '#ef4444' : avgDeptLoad > 0 ? '#f59e0b' : '#2ecc71',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Banking Credentials Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--txt)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Agency Settlement Account</span>
            </h2>
            <button
              onClick={onOpenAddPayment}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>+ Record Payment</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)]">
                  Primary Treasury
                </span>
                <div className="font-semibold text-xs text-[var(--txt)]">{bank.Bank}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Verified
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] text-[11px]">Account Title</span>
                <span className="font-semibold text-[var(--txt)] font-mono">{bank['Account Title']}</span>
              </div>

              <div className="flex justify-between items-center group">
                <span className="text-[var(--muted)] text-[11px]">IBAN (Pakistan)</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[var(--txt)] tabular-nums">{bank.IBAN}</span>
                  <button
                    onClick={() => copyText(bank.IBAN, 'IBAN')}
                    className="p-1 rounded hover:bg-[var(--panel2)] text-[var(--muted)] hover:text-blue-400 transition-colors"
                    title="Copy IBAN"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] text-[11px]">Account Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[var(--txt)] tabular-nums">{bank['Account #']}</span>
                  <button
                    onClick={() => copyText(bank['Account #'], 'Account Number')}
                    className="p-1 rounded hover:bg-[var(--panel2)] text-[var(--muted)] hover:text-blue-400 transition-colors"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] text-[11px]">Default Settlement</span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">{bank.Currency}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <span>🕵️ Audited by Vault</span>
              </span>
              <button
                onClick={() => setPage('finance')}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Ledger</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--line)]">
              <span className="font-semibold text-xs text-[var(--txt)]">Live Activity Feed</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">Recent Events</span>
            </div>

            <div className="space-y-3">
              {feed.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <span className="text-sm shrink-0 leading-none mt-0.5">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--txt)] leading-relaxed">{item.text}</p>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
