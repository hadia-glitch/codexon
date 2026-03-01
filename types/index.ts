//author:HadiaNoor Purpose:Types for Task Management App Date:28-2-26
export interface profile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type priority = 'low' | 'medium' | 'high';
export type status = 'pending' | 'in_progress' | 'completed';

export interface task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: priority;
  status: status;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface createTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: priority;
  status: status;
  tags: string[];
}

export interface updateTaskInput extends Partial<createTaskInput> {
  id: string;
}

export type filterStatus = 'all' | status;
export type filterPriority = 'all' | priority;
export type sortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface taskFilters {
  status: filterStatus;
  priority: filterPriority;
  sortBy: sortBy;
  sortOrder: 'asc' | 'desc';
  search: string;
}