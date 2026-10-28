import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, TaskPriority, AgentTask } from '../types';
import { Plus, Check, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TasksBoardPageProps {
  onOpenDispatchModal: () => void;
}

export const TasksBoardPage: React.FC<TasksBoardPageProps> = ({ onOpenDispatchModal }) => {
  const { agents, updateTaskStatus, completeTask } = useApp();
  const [filterAgent, setFilterAgent] = useState<string>('all');

  // Collect all tasks from all agents
  const allTasks: (AgentTask & { agentEmoji: string })[] = agents.flatMap((ag) =>
    ag.tasks.map((t) => ({ ...t, agentEmoji: ag.emoji }))
  );

  const filteredTasks = allTasks.filter(
    (t) => filterAgent === 'all' || t.assignedTo.toLowerCase() === filterAgent.toLowerCase()
  );

  const columns: { id: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'todo', label: 'Queued (To Do)', icon: <Clock className="w-3.5 h-3.5" />, color: 'border-neutral-500/30' },
    { id: 'in_progress', label: 'In Execution', icon: <ArrowRight className="w-3.5 h-3.5" />, color: 'border-blue-500/30' },
    { id: 'review', label: 'In Review', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'border-amber-500/30' },
    { id: 'completed', label: 'Delivered', icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'border-emerald-500/30' },
  ];

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'medium':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'low':
        return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--muted)] font-medium">Filter by Agent:</label>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-[var(--panel)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs text-[var(--txt)] focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">All Agents ({allTasks.length} tasks)</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.emoji} {ag.name} ({ag.tasks.length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onOpenDispatchModal}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch New Task</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-xl bg-[var(--panel)] border border-[var(--line)] p-4 flex flex-col min-h-[500px] shadow-xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--txt)]">
                  <span>{col.icon}</span>
                  <span>{col.label}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--panel2)] border border-[var(--line)] text-[var(--muted)]">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-[var(--muted)] border border-dashed border-[var(--line)] rounded-lg">
                    No tasks in {col.label}
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-[var(--panel2)] border border-[var(--line)] hover:border-blue-500/40 transition-all text-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-[var(--txt)] line-clamp-2 leading-snug">
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-[var(--txt)] font-mono">
                          <span>{task.agentEmoji}</span>
                          <span className="font-semibold">{task.assignedTo}</span>
                          <span className="text-[var(--muted)]">· +{task.loadWeight}%</span>
                        </div>

                        {/* Status Mover */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => completeTask(task.id)}
                              className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors flex items-center gap-1"
                              title="Mark Delivered"
                            >
                              <Check className="w-3 h-3" />
                              <span>Done</span>
                            </button>
                          )}
                          {col.id === 'todo' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              Start
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
