//author:HadiaNoor Purpose:Task card component for Task Management App Date:29-2-26
'use client';

import { useState } from 'react';
import type { task } from '@/types';

export interface TaskCardProps {
  task: task;
  onStatusToggle: (task: task) => Promise<void>;
  onEdit: (task: task) => void;
  onDelete: (taskId: string) => Promise<void>;
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

function checkIsOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDueDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TaskCard({ task, onStatusToggle, onEdit, onDelete }: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityStyle = priorityConfig[task.priority];
  const statusStyle = statusConfig[task.status];
  const isOverdue = checkIsOverdue(task.dueDate) && task.status !== 'completed';

  const handleToggle = async () => {
    setIsToggling(true);
    await onStatusToggle(task);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setIsDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div
      className={`group bg-slate-900 border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/50 ${
        task.status === 'completed'
          ? 'border-slate-800 opacity-70'
          : isOverdue
          ? 'border-red-500/40 shadow-red-500/5 shadow-md'
          : 'border-slate-800'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-xs font-500 ${priorityStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {priorityStyle.label}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-xs ${statusStyle.classes}`}
          >
            <span>{statusStyle.icon}</span>
            {statusStyle.label}
          </span>
        </div>

        {/* Edit / Delete actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            title="Delete task"
          >
            {isDeleting ? (
              <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
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
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1.5 font-mono text-xs ${
              isOverdue ? 'text-red-400' : 'text-slate-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isOverdue && <span className="text-red-400">Overdue · </span>}
            {formatDueDate(task.dueDate)}
          </div>
        ) : (
          <span className="text-slate-700 font-mono text-xs">No due date</span>
        )}

        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            task.status === 'completed'
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
          } disabled:opacity-50`}
        >
          {isToggling ? (
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
}