/**
 * TypeScript type definitions shared across the frontend
 * These match the data shapes returned by the backend API
 */

// ----------------------------------------------------------
// Auth Types
// ----------------------------------------------------------

/** A logged-in user's basic info */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

/** The response from login or register */
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ----------------------------------------------------------
// Task Types
// ----------------------------------------------------------

/** The possible status values for a task */
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

/** A task object returned from the API */
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

/** Data for creating a new task */
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}

/** Data for updating a task (all fields optional) */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string | null;
}

// ----------------------------------------------------------
// Dashboard Types
// ----------------------------------------------------------

/** Statistics shown on the dashboard */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
}

export interface DashboardData {
  stats: TaskStats;
  recentTasks: Task[];
}

// ----------------------------------------------------------
// API Response Types
// ----------------------------------------------------------

/** Generic API error shape */
export interface ApiError {
  message: string;
}
