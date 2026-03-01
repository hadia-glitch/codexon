//author:HadiaNoor Purpose:Task management functions for Task Management App Date:28-2-26
import {supabase} from './supabase';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@/types';

export async function getTasks(userId: string, filters: TaskFilters): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  if (filters.search.trim()) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

  if (filters.sortBy === 'priority') {
    const { data, error } = await query;
    if (error) throw error;
    const sorted = (data as Task[]).sort((a, b) => {
      const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return filters.sortOrder === 'asc' ? diff : -diff;
    });
    return sorted;
  }

  const ascending = filters.sortOrder === 'asc';
  if (filters.sortBy === 'due_date') {
    query = query.order('due_date', { ascending, nullsFirst: false });
  } else {
    query = query.order(filters.sortBy, { ascending });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Task[];
}

export async function createTask(
  userId: string,
  input: CreateTaskInput
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { id, ...rest } = input;
  const { data, error } = await supabase
    .from('tasks')
    .update(rest)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

export async function toggleTaskStatus(
  task: Task
): Promise<Task> {
  const nextStatus: Record<string, string> = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending',
  };
  return updateTask({ id: task.id, status: nextStatus[task.status] as Task['status'] });
}