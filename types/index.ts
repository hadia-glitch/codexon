//author:HadiaNoor Purpose:Types for Task Management App Date:28-2-26
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: Priority;
  status: Status;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
  priority: Priority;
  status: Status;
  tags: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

export type FilterStatus = 'all' | Status;
export type FilterPriority = 'all' | Priority;
export type SortBy = 'created_at' | 'due_date' | 'priority' | 'title';

export interface TaskFilters {
  status: FilterStatus;
  priority: FilterPriority;
  sortBy: SortBy;
  sortOrder: 'asc' | 'desc';
  search: string;
}