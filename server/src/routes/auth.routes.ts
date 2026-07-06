import { Router } from 'express';
import { body } from 'express-validator';
import * as AuthController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Auth Routes
 * Public routes: /api/auth/register, /api/auth/login
 * Protected routes: /api/auth/profile (requires JWT)
 */

// POST /api/auth/register
// Validates: name (required), email (valid format), password (min 6 chars)
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  AuthController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  AuthController.login
);

// GET /api/auth/profile (protected)
router.get('/profile', authenticate, AuthController.getProfile);

// PUT /api/auth/profile (protected)
router.put(
  '/profile',
  authenticate,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  AuthController.updateProfile
);

export default router;
