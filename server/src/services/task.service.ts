import * as TaskRepository from '../repositories/task.repository';
import { CreateTaskData, UpdateTaskData } from '../repositories/task.repository';

/**
 * Task Service
 * Contains all business logic for task operations.
 * Calls the Task Repository for database access.
 */

/**
 * Get all tasks for the logged-in user
 */
export const getAllTasks = async (userId: number) => {
  return TaskRepository.findTasksByUserId(userId);
};

/**
 * Get a single task (and verify it belongs to the user)
 */
export const getTaskById = async (taskId: number, userId: number) => {
  const task = await TaskRepository.findTaskById(taskId, userId);
  if (!task) {
    throw new Error('Task not found.');
  }
  return task;
};

/**
 * Create a new task
 */
export const createTask = async (data: CreateTaskData) => {
  return TaskRepository.createTask(data);
};

/**
 * Update a task (only if it belongs to the user)
 */
export const updateTask = async (
  taskId: number,
  userId: number,
  data: UpdateTaskData
) => {
  // First, check the task exists and belongs to this user
  const existingTask = await TaskRepository.findTaskById(taskId, userId);
  if (!existingTask) {
    throw new Error('Task not found.');
  }

  const updatedTask = await TaskRepository.updateTask(taskId, userId, data);
  if (!updatedTask) {
    throw new Error('Failed to update task.');
  }
  return updatedTask;
};

/**
 * Delete a task (only if it belongs to the user)
 */
export const deleteTask = async (taskId: number, userId: number) => {
  const deleted = await TaskRepository.deleteTask(taskId, userId);
  if (!deleted) {
    throw new Error('Task not found.');
  }
  return { message: 'Task deleted successfully.' };
};

/**
 * Get dashboard statistics for the logged-in user
 */
export const getDashboardStats = async (userId: number) => {
  const stats = await TaskRepository.getTaskStats(userId);
  const recentTasks = await TaskRepository.findTasksByUserId(userId);
  return {
    stats,
    // Return only the 5 most recent tasks for the dashboard
    recentTasks: recentTasks.slice(0, 5),
  };
};
