//author:HadiaNoor Purpose:Task management functions for Task Management App Date:28-2-26

  import {supabase} from './supabase';
import type { task, createTaskInput, updateTaskInput, taskFilters } from '@/types';

// Maps camelCase Task fields from DB snake_case rows
function mapTask(row: Record<string, unknown>): task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: row.description as string | undefined,
    dueDate: row.due_date as string | undefined,
    priority: row.priority as task['priority'],
    status: row.status as task['status'],
    tags: (row.tags as string[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Maps camelCase SortBy to DB column name
function toDbColumn(sortBy: taskFilters['sortBy']): string {
  const columnMap: Record<string, string> = {
    createdAt: 'created_at',
    dueDate: 'due_date',
    priority: 'priority',
    title: 'title',
  };
  return columnMap[sortBy] ?? 'created_at';
}

export async function getTasks(userId: string, filters: taskFilters): Promise<task[]> {
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
    const sorted = (data as Record<string, unknown>[]).map(mapTask).sort((a, b) => {
      const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return filters.sortOrder === 'asc' ? diff : -diff;
    });
    return sorted;
  }

  const ascending = filters.sortOrder === 'asc';
  const dbColumn = toDbColumn(filters.sortBy);

  if (filters.sortBy === 'dueDate') {
    query = query.order(dbColumn, { ascending, nullsFirst: false });
  } else {
    query = query.order(dbColumn, { ascending });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Record<string, unknown>[]).map(mapTask);
}

export async function createTask(
  userId: string,
  input: createTaskInput
): Promise<task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      due_date: input.dueDate,
      priority: input.priority,
      status: input.status,
      tags: input.tags,
    })
    .select()
    .single();

  if (error) throw error;
  return mapTask(data as Record<string, unknown>);
}

export async function updateTask(input: updateTaskInput): Promise<task> {
  const { id, ...rest } = input;
  const dbPayload: Record<string, unknown> = {};
  if (rest.title !== undefined) dbPayload.title = rest.title;
  if (rest.description !== undefined) dbPayload.description = rest.description;
  if (rest.dueDate !== undefined) dbPayload.due_date = rest.dueDate;
  if (rest.priority !== undefined) dbPayload.priority = rest.priority;
  if (rest.status !== undefined) dbPayload.status = rest.status;
  if (rest.tags !== undefined) dbPayload.tags = rest.tags;

  const { data, error } = await supabase
    .from('tasks')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapTask(data as Record<string, unknown>);
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

export async function toggleTaskStatus(task: task): Promise<task> {
  const nextStatus: Record<string, task['status']> = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending',
  };
  return updateTask({ id: task.id, status: nextStatus[task.status] });
}