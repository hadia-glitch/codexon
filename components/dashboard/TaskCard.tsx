//author:HadiaNoor Purpose:Task card component for Task Management App Date:28-2-26
'use client';

import React, { useState, type FC } from 'react';
import type { Task } from '@/types';

export interface TaskCardProps {
  task: Task;
  onStatusToggle: (task: Task) => Promise<void>;
}

const priorityConfig = {
  high: {
    label: 'HIGH',
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
  medium: {
    label: 'MED',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  low: {
    label: 'LOW',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
};

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: '○',
    classes: 'bg-slate-700/50 text-slate-400 border-slate-600',
  },
  in_progress: {
    label: 'In Progress',
    icon: '◑',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  completed: {
    label: 'Completed',
    icon: '●',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
};

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const TaskCard: FC<TaskCardProps> = ({ task, onStatusToggle }) => {
  const [toggling, setToggling] = useState(false);

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const overdue = isOverdue(task.due_date) && task.status !== 'completed';

  const handleToggle = async () => {
    setToggling(true);
    await onStatusToggle(task);
    setToggling(false);
  };

  return (
    <div
      className={`bg-slate-900 border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/50 ${
        task.status === 'completed'
          ? 'border-slate-800 opacity-70'
          : overdue
          ? 'border-red-500/40 shadow-red-500/5 shadow-md'
          : 'border-slate-800'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-xs font-500 ${priority.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-xs ${status.classes}`}
        >
          <span>{status.icon}</span>
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`font-display font-600 text-base leading-snug mb-1 ${
            task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded font-mono text-xs border border-slate-700"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 text-slate-600 font-mono text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        {task.due_date ? (
          <div
            className={`flex items-center gap-1.5 font-mono text-xs ${
              overdue ? 'text-red-400' : 'text-slate-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {overdue && <span className="text-red-400">Overdue · </span>}
            {formatDate(task.due_date)}
          </div>
        ) : (
          <span className="text-slate-700 font-mono text-xs">No due date</span>
        )}

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            task.status === 'completed'
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
          } disabled:opacity-50`}
        >
          {toggling ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {task.status === 'pending' && '→ Start'}
              {task.status === 'in_progress' && '✓ Complete'}
              {task.status === 'completed' && '↩ Reopen'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;