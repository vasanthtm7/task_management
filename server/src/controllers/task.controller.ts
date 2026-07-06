import { Response } from 'express';
import { validationResult } from 'express-validator';
import * as TaskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Task Controller
 * Handles all HTTP requests related to tasks.
 * All routes here are protected (require login).
 */

/**
 * GET /api/tasks
 * Get all tasks for the logged-in user
 */
export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tasks = await TaskService.getAllTasks(userId);
    res.status(200).json({ tasks });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    res.status(500).json({ message });
  }
};

/**
 * GET /api/tasks/stats
 * Get dashboard statistics for the logged-in user
 */
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = await TaskService.getDashboardStats(userId);
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    res.status(500).json({ message });
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by ID
 */
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const task = await TaskService.getTaskById(taskId, userId);
    res.status(200).json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch task';
    res.status(404).json({ message });
  }
};

/**
 * POST /api/tasks
 * Create a new task
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array()[0].msg });
      return;
    }

    const userId = req.user!.id;
    const { title, description, status, due_date } = req.body;

    const task = await TaskService.createTask({
      user_id: userId,
      title,
      description,
      status,
      due_date,
    });

    res.status(201).json({ message: 'Task created successfully!', task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    res.status(400).json({ message });
  }
};

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array()[0].msg });
      return;
    }

    const taskId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const { title, description, status, due_date } = req.body;
    const task = await TaskService.updateTask(taskId, userId, {
      title,
      description,
      status,
      due_date,
    });

    res.status(200).json({ message: 'Task updated successfully!', task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    res.status(400).json({ message });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const result = await TaskService.deleteTask(taskId, userId);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    res.status(404).json({ message });
  }
};
