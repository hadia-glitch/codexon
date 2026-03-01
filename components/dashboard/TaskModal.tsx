//author:HadiaNoor Purpose:Task creation modal component for Task Management App Date:29-2-26
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { createTaskInput, priority, status, task } from '@/types';

export interface TaskModalProps {
  open: boolean;
  taskToEdit?: task | null;
  onClose: () => void;
  onSubmit: (data: createTaskInput) => Promise<void>;
}

const priorityOptions: priority[] = ['low', 'medium', 'high'];
const statusOptions: status[] = ['pending', 'in_progress', 'completed'];

const defaultFormState: createTaskInput = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'pending',
  tags: [],
};

export default function TaskModal({ open, taskToEdit, onClose, onSubmit }: TaskModalProps) {
  const [formData, setFormData] = useState<createTaskInput>(defaultFormState);
  const [tagInputValue, setTagInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEditMode = Boolean(taskToEdit);

  // Populate form when editing
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description ?? '',
        dueDate: taskToEdit.dueDate ?? '',
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        tags: taskToEdit.tags,
      });
    } else {
      setFormData(defaultFormState);
    }
    setTagInputValue('');
    setErrorMsg('');
  }, [taskToEdit, open]);

  const resetForm = () => {
    setFormData(defaultFormState);
    setTagInputValue('');
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    const newTag = tagInputValue.trim().toLowerCase().replace(/\s+/g, '-');
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
    }
    setTagInputValue('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 rounded-t-2xl z-10">
          <div>
            <h2 className="font-display font-700 text-lg text-slate-100">
              {isEditMode ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-slate-500 text-xs font-mono mt-0.5">
              {isEditMode ? `Editing: ${taskToEdit?.title}` : 'Add a task to your workspace'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm resize-none"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as priority }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm appearance-none cursor-pointer"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as status }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm appearance-none cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInputValue}
                onChange={(e) => setTagInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag, press Enter"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm font-mono"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-md font-mono text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-600 hover:text-red-400 transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm font-mono">{errorMsg}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-display font-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}