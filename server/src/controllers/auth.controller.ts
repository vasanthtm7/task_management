import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as AuthService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Auth Controller
 * The Controller layer handles HTTP requests and responses.
 * It validates input, calls the Service, and sends back a response.
 */

/**
 * POST /api/auth/register
 * Create a new user account
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array()[0].msg });
      return;
    }

    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);

    res.status(201).json({
      message: 'Account created successfully!',
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ message });
  }
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array()[0].msg });
      return;
    }

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.status(200).json({
      message: 'Login successful!',
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ message });
  }
};

/**
 * GET /api/auth/profile
 * Get the current user's profile (protected route)
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await AuthService.getProfile(userId);
    res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(404).json({ message });
  }
};

/**
 * PUT /api/auth/profile
 * Update the current user's name (protected route)
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array()[0].msg });
      return;
    }

    const userId = req.user!.id;
    const { name } = req.body;
    const user = await AuthService.updateProfile(userId, name);
    res.status(200).json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    res.status(400).json({ message });
  }
};
