// /*Author:HadiaNoor Purpose:dashboard Date:29-2-26*/
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from '@/lib/tasks';
import TaskCard from './taskCard';
import TaskModal from './taskModal';
import type { task, createTaskInput, taskFilters, filterStatus, filterPriority, sortBy } from '@/types';

const defaultFilters: taskFilters = {
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
};

const statusTabOptions: { value: filterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function DashboardClient() {
  const { user, loading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [taskList, setTaskList] = useState<task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<taskFilters>(defaultFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<task | null>(null);
  const [searchInputValue, setSearchInputValue] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isAuthLoading, router]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(user.id, activeFilters);
      setTaskList(fetchedTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, activeFilters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setActiveFilters((prev) => ({ ...prev, search: searchInputValue }));
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchInputValue]);

  const handleCreateTask = async (taskData: createTaskInput) => {
    if (!user) return;
    await createTask(user.id, taskData);
    await fetchTasks();
  };

  const handleEditTask = async (taskData: createTaskInput) => {
    if (!taskToEdit) return;
    await updateTask({ id: taskToEdit.id, ...taskData });
    await fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTaskList((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleStatusToggle = async (task: task) => {
    const updatedTask = await toggleTaskStatus(task);
    setTaskList((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const openEditModal = (task: task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const taskStats = {
    total: taskList.length,
    pending: taskList.filter((t) => t.status === 'pending').length,
    inProgress: taskList.filter((t) => t.status === 'in_progress').length,
    completed: taskList.filter((t) => t.status === 'completed').length,
  };

  if (isAuthLoading) return null;
  if (!user) return null;

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userFirstName = (user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'there';
  const activeTaskCount = taskStats.pending + taskStats.inProgress;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-800 text-slate-100">
            {getGreeting()}, {userFirstName}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {taskStats.total === 0
              ? 'No tasks yet. Create your first one!'
              : `${activeTaskCount} active task${activeTaskCount !== 1 ? 's' : ''} · ${taskStats.completed} completed`}
          </p>
        </div>
        <button
          onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
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
          { label: 'Total Tasks', value: taskStats.total, color: 'text-slate-300', bg: 'bg-slate-800/50', border: 'border-slate-700' },
          { label: 'Pending', value: taskStats.pending, color: 'text-slate-400', bg: 'bg-slate-800/30', border: 'border-slate-800' },
          { label: 'In Progress', value: taskStats.inProgress, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
          { label: 'Completed', value: taskStats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
        ].map((statItem) => (
          <div
            key={statItem.label}
            className={`${statItem.bg} border ${statItem.border} rounded-xl p-4 transition-all`}
          >
            <p className="font-mono text-xs text-slate-600 uppercase tracking-wider mb-2">{statItem.label}</p>
            <p className={`font-display text-3xl font-800 ${statItem.color}`}>{statItem.value}</p>
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
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm font-mono"
          />
        </div>

        {/* Status tabs + filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 flex-1">
            {statusTabOptions.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilters((prev) => ({ ...prev, status: tab.value }))}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono font-500 transition-all duration-200 ${
                  activeFilters.status === tab.value
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={activeFilters.priority}
            onChange={(e) => setActiveFilters((prev) => ({ ...prev, priority: e.target.value as filterPriority }))}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs font-mono appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={`${activeFilters.sortBy}-${activeFilters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [sortBy, 'asc' | 'desc'];
              setActiveFilters((prev) => ({ ...prev, sortBy, sortOrder }));
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs font-mono appearance-none cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date ↑</option>
            <option value="dueDate-desc">Due Date ↓</option>
            <option value="priority-asc">Priority ↑</option>
            <option value="priority-desc">Priority ↓</option>
            <option value="title-asc">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Task grid */}
      {isLoading ? (
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
      ) : taskList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-display text-lg font-600 text-slate-400 mb-2">No tasks found</h3>
          <p className="text-slate-600 text-sm font-mono mb-6">
            {searchInputValue || activeFilters.status !== 'all' || activeFilters.priority !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {activeFilters.status === 'all' && activeFilters.priority === 'all' && !searchInputValue && (
            <button
              onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-700 rounded-xl transition-all"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusToggle={handleStatusToggle}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task count footer */}
      {!isLoading && taskList.length > 0 && (
        <p className="text-center text-slate-700 font-mono text-xs">
          Showing {taskList.length} task{taskList.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modal */}
      <TaskModal
        open={isModalOpen}
        taskToEdit={taskToEdit}
        onClose={closeModal}
        onSubmit={taskToEdit ? handleEditTask : handleCreateTask}
      />
    </div>
  );
}