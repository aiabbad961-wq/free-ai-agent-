import React from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/initialData';
import { calculateAgentLoad } from '../utils/router';
import { Building2, Users, CheckSquare, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

interface DepartmentsPageProps {
  onOpenDispatch: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onOpenDispatch }) => {
  const { agents, setPage } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--txt)]">Agency Departmental Hierarchy</h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            6 specialized divisions executing end-to-end client projects autonomously.
          </p>
        </div>

        <button
          onClick={onOpenDispatch}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          Dispatch to Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEPARTMENTS.map((dept) => {
          const deptAgents = agents.filter((a) => a.dept === dept.name);
          const deptTasks = deptAgents.flatMap((a) => a.tasks.filter((t) => t.status !== 'completed'));
          const avgLoad =
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
              className="rounded-xl bg-[var(--panel)] border border-[var(--line)] p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-[var(--txt)]">{dept.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold">
                    Lead: {dept.lead}
                  </span>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                  {dept.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-[var(--panel2)] border border-[var(--line)] text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--muted)] block">Agent Headcount</span>
                    <span className="font-mono font-bold tabular-nums text-[var(--txt)]">
                      {deptAgents.length} Agents
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted)] block">In-Flight Work</span>
                    <span className="font-mono font-bold tabular-nums text-[var(--txt)]">
                      {deptTasks.length} Tasks
                    </span>
                  </div>
                </div>

                {/* Workload */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[var(--muted)]">Division Workload</span>
                    <span className="tabular-nums font-semibold text-[var(--txt)]">{avgLoad}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${avgLoad}%`,
                        backgroundColor: avgLoad > 70 ? '#ef4444' : avgLoad > 0 ? '#f59e0b' : '#2ecc71',
                      }}
                    />
                  </div>
                </div>

                {/* Assigned Agents roster */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] block">
                    Active Squad Members:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {deptAgents.map((ag) => (
                      <span
                        key={ag.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--panel2)] border border-[var(--line)] text-[11px] text-[var(--txt)]"
                      >
                        <span>{ag.emoji}</span>
                        <span>{ag.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--line)] mt-5 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPage('agents')}
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Inspect Agents</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
