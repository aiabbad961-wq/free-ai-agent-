import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Agent, DepartmentType } from '../types';
import { calculateAgentLoad } from '../utils/router';
import { DEPARTMENTS } from '../data/initialData';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AgentsPageProps {
  onOpenAddAgent: () => void;
  onOpenEditAgent: (agent: Agent) => void;
  onOpenDispatchForAgent: (agentId: string) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  onOpenAddAgent,
  onOpenEditAgent,
  onOpenDispatchForAgent,
}) => {
  const { agents, completeTask, deleteAgent } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  const filteredAgents = agents.filter((ag) => {
    const matchesDept = selectedDept === 'All' || ag.dept === selectedDept;
    const matchesSearch =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedAgentId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter tabs & Search & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Department Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDept('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedDept === 'All'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)]'
            }`}
          >
            All Departments ({agents.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = agents.filter((a) => a.dept === dept.name).length;
            const isSelected = selectedDept === dept.name;
            return (
              <button
                key={dept.name}
                onClick={() => setSelectedDept(dept.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)]'
                }`}
              >
                {dept.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Add */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents or roles..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-xs text-[var(--txt)] placeholder:text-[var(--muted)] focus:outline-hidden focus:border-blue-500 w-48 sm:w-56"
            />
          </div>

          <button
            onClick={onOpenAddAgent}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Agent</span>
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const activeTasks = agent.tasks.filter((t) => t.status !== 'completed');
          const completedTasks = agent.tasks.filter((t) => t.status === 'completed');
          const loadInfo = calculateAgentLoad(activeTasks.length);
          const isExpanded = expandedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              className="rounded-xl bg-[var(--panel)] border border-[var(--line)] p-4 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-xs"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--panel2)] border border-[var(--line)] flex items-center justify-center text-xl shrink-0">
                      {agent.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[var(--txt)] flex items-center gap-2">
                        <span>{agent.name}</span>
                        {agent.custom && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-[var(--muted)]">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-blue-400 font-medium">{agent.role}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border border-current/20 font-semibold ${loadInfo.pillClass}`}
                  >
                    {loadInfo.label} ({loadInfo.percentage}%)
                  </span>
                </div>

                {/* Department tag & Mandate description */}
                <div className="mb-3">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)] mb-1">
                    {agent.dept}
                  </div>
                  <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>

                {/* Workload Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[var(--muted)]">Agent Capacity</span>
                    <span className="text-[var(--txt)] tabular-nums">{loadInfo.percentage}% Loaded</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${loadInfo.percentage}%`,
                        backgroundColor:
                          loadInfo.percentage > 70
                            ? '#ef4444'
                            : loadInfo.percentage > 0
                            ? '#f59e0b'
                            : '#2ecc71',
                      }}
                    />
                  </div>
                </div>

                {/* Tasks Preview / Expandable */}
                {activeTasks.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--muted)]">
                      <span>In-Flight Tasks ({activeTasks.length})</span>
                      <button
                        onClick={() => toggleExpand(agent.id)}
                        className="text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-2 pt-1 border-t border-[var(--line)]">
                        {activeTasks.map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg bg-[var(--panel2)] border border-[var(--line)] text-xs flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-[var(--txt)] text-[11px] line-clamp-1">{t.title}</div>
                              <div className="text-[9px] font-mono text-[var(--muted)] mt-0.5">
                                Priority: {t.priority.toUpperCase()} · +{t.loadWeight}% Load
                              </div>
                            </div>
                            <button
                              onClick={() => completeTask(t.id)}
                              className="shrink-0 p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              title="Mark Complete"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-[var(--txt)] bg-[var(--panel2)] px-2.5 py-1.5 rounded-lg border border-[var(--line)] truncate flex items-center justify-between">
                        <span className="truncate">{activeTasks[0].title}</span>
                        <button
                          onClick={() => completeTask(activeTasks[0].id)}
                          className="text-emerald-400 hover:text-emerald-300 p-0.5 shrink-0"
                          title="Complete task"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2 mt-auto">
                <button
                  onClick={() => onOpenDispatchForAgent(agent.id)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--panel2)] hover:bg-blue-600 hover:text-white border border-[var(--line)] text-[var(--txt)] text-xs font-semibold transition-colors flex-1 text-center"
                >
                  Assign Task
                </button>

                <button
                  onClick={() => onOpenEditAgent(agent)}
                  className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)] hover:bg-[var(--panel2)] transition-colors"
                  title="Edit agent profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {agent.custom && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete agent ${agent.name}?`)) {
                        deleteAgent(agent.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove custom agent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
