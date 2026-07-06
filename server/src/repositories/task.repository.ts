import pool from '../config/database';

/**
 * Task type definition
 * Matches the columns in the 'tasks' table in our database
 */
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'Todo' | 'In Progress' | 'Completed';
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Data needed to create a new task
 */
export interface CreateTaskData {
  user_id: number;
  title: string;
  description?: string;
  status?: 'Todo' | 'In Progress' | 'Completed';
  due_date?: string;
}

/**
 * Data that can be updated on a task
 */
export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: 'Todo' | 'In Progress' | 'Completed';
  due_date?: string | null;
}

/**
 * Task Repository
 * All SQL queries related to tasks live here.
 */

/**
 * Get all tasks belonging to a specific user
 */
export const findTasksByUserId = async (userId: number): Promise<Task[]> => {
  const result = await pool.query<Task>(
    `SELECT * FROM tasks 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Get a single task by its ID
 * We also check user_id to make sure users can't access each other's tasks
 */
export const findTaskById = async (
  taskId: number,
  userId: number
): Promise<Task | null> => {
  const result = await pool.query<Task>(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );
  return result.rows[0] || null;
};

/**
 * Create a new task in the database
 */
export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const result = await pool.query<Task>(
    `INSERT INTO tasks (user_id, title, description, status, due_date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [
      data.user_id,
      data.title,
      data.description || null,
      data.status || 'Todo',
      data.due_date || null,
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing task
 * Only updates the fields that are provided
 */
export const updateTask = async (
  taskId: number,
  userId: number,
  data: UpdateTaskData
): Promise<Task | null> => {
  // Build a dynamic SQL query based on what fields are being updated
  const fields: string[] = [];
  const values: (string | null | undefined)[] = [];
  let paramCount = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(data.description);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramCount++}`);
    values.push(data.status);
  }
  if (data.due_date !== undefined) {
    fields.push(`due_date = $${paramCount++}`);
    values.push(data.due_date);
  }

  // Always update the updated_at timestamp
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    // Only updated_at, nothing else to update
    return null;
  }

  // Add the WHERE clause parameters
  values.push(String(taskId));
  values.push(String(userId));

  const query = `
    UPDATE tasks 
    SET ${fields.join(', ')} 
    WHERE id = $${paramCount++} AND user_id = $${paramCount} 
    RETURNING *
  `;

  const result = await pool.query<Task>(query, values);
  return result.rows[0] || null;
};

/**
 * Delete a task by its ID
 * Returns true if a row was deleted, false if the task wasn't found
 */
export const deleteTask = async (
  taskId: number,
  userId: number
): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

/**
 * Get task counts for the dashboard
 * Returns total, completed, and pending task counts for a user
 */
export const getTaskStats = async (
  userId: number
): Promise<{ total: number; completed: number; pending: number; in_progress: number }> => {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
       COUNT(*) FILTER (WHERE status = 'Todo') AS pending,
       COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress
     FROM tasks
     WHERE user_id = $1`,
    [userId]
  );
  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    completed: parseInt(row.completed, 10),
    pending: parseInt(row.pending, 10),
    in_progress: parseInt(row.in_progress, 10),
  };
};
