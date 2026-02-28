'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTasks, createTask, toggleTaskStatus } from '@/lib/tasks';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import type { Task, CreateTaskInput, TaskFilters, FilterStatus, FilterPriority, SortBy } from '@/types';

const defaultFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc',
  search: '',
};

const statusTabs: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, authLoading, router]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTasks(user.id, filters);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreateTask = async (data: CreateTaskInput) => {
    if (!user) return;
    await createTask(user.id, data);
    await fetchTasks();
  };

  const handleStatusToggle = async (task: Task) => {
    const updated = await toggleTaskStatus(task);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  if (authLoading) return null;
  if (!user) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = (user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'there';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-800 text-slate-100">
            {greeting()}, {firstName}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {stats.total === 0
              ? 'No tasks yet. Create your first one!'
              : `${stats.pending + stats.inProgress} active task${stats.pending + stats.inProgress !== 1 ? 's' : ''} · ${stats.completed} completed`}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-700 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'text-slate-300', bg: 'bg-slate-800/50', border: 'border-slate-700' },
          { label: 'Pending', value: stats.pending, color: 'text-slate-400', bg: 'bg-slate-800/30', border: 'border-slate-800' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border ${stat.border} rounded-xl p-4 transition-all`}
          >
            <p className="font-mono text-xs text-slate-600 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`font-display text-3xl font-800 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm font-mono"
          />
        </div>

        {/* Status tabs + filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status tabs */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 flex-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilters((f) => ({ ...f, status: tab.value }))}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono font-500 transition-all duration-200 ${
                  filters.status === tab.value
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value as FilterPriority }))}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs font-mono appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [SortBy, 'asc' | 'desc'];
              setFilters((f) => ({ ...f, sortBy, sortOrder }));
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs font-mono appearance-none cursor-pointer"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="due_date-asc">Due Date ↑</option>
            <option value="due_date-desc">Due Date ↓</option>
            <option value="priority-asc">Priority ↑</option>
            <option value="priority-desc">Priority ↓</option>
            <option value="title-asc">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Task grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 bg-slate-800 rounded" />
                <div className="h-5 w-20 bg-slate-800 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-slate-800 rounded mb-2" />
              <div className="h-4 w-full bg-slate-800/60 rounded mb-1" />
              <div className="h-4 w-2/3 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-display text-lg font-600 text-slate-400 mb-2">No tasks found</h3>
          <p className="text-slate-600 text-sm font-mono mb-6">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {filters.status === 'all' && filters.priority === 'all' && !filters.search && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-700 rounded-xl transition-all"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      )}

      {/* Task count footer */}
      {!loading && tasks.length > 0 && (
        <p className="text-center text-slate-700 font-mono text-xs">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal - create only */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}