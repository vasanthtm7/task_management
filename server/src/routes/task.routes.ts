import { Router } from 'express';
import { body } from 'express-validator';
import * as TaskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Task Routes
 * All routes require authentication (JWT token)
 * The authenticate middleware runs before every route handler
 */

// GET /api/tasks/stats — Dashboard statistics (must be before /:id)
router.get('/stats', authenticate, TaskController.getDashboardStats);

// GET /api/tasks — Get all tasks
router.get('/', authenticate, TaskController.getAllTasks);

// GET /api/tasks/:id — Get a single task
router.get('/:id', authenticate, TaskController.getTaskById);

// POST /api/tasks — Create a new task
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('status')
      .optional()
      .isIn(['Todo', 'In Progress', 'Completed'])
      .withMessage('Status must be: Todo, In Progress, or Completed'),
    body('due_date')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Due date must be a valid date'),
  ],
  TaskController.createTask
);

// PUT /api/tasks/:id — Update a task
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(['Todo', 'In Progress', 'Completed'])
      .withMessage('Status must be: Todo, In Progress, or Completed'),
    body('due_date')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Due date must be a valid date'),
  ],
  TaskController.updateTask
);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', authenticate, TaskController.deleteTask);

export default router;
