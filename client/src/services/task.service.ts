import api from './api';
import type { Task, CreateTaskInput, UpdateTaskInput, DashboardData } from '../types';

/**
 * Task Service (Frontend)
 * Handles all API calls related to tasks.
 */

/** Get all tasks for the logged-in user */
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get<{ tasks: Task[] }>('/tasks');
  return response.data.tasks;
};

/** Get dashboard statistics and recent tasks */
export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>('/tasks/stats');
  return response.data;
};

/** Get a single task by ID */
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get<{ task: Task }>(`/tasks/${id}`);
  return response.data.task;
};

/** Create a new task */
export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const response = await api.post<{ task: Task; message: string }>('/tasks', data);
  return response.data.task;
};

/** Update an existing task */
export const updateTask = async (
  id: number,
  data: UpdateTaskInput
): Promise<Task> => {
  const response = await api.put<{ task: Task; message: string }>(
    `/tasks/${id}`,
    data
  );
  return response.data.task;
};

/** Delete a task */
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
