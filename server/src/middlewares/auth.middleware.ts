import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Extends Express Request to include the authenticated user's info
 * This lets us access req.user in any protected route handler
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * JWT Authentication Middleware
 * This middleware runs before protected route handlers.
 * It checks for a valid JWT in the Authorization header.
 * If valid, it attaches the user info to the request object.
 * If invalid or missing, it returns a 401 Unauthorized error.
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided. Please login.' });
      return;
    }

    // Extract the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as { id: number; email: string };

    // Attach user info to the request so route handlers can use it
    req.user = { id: decoded.id, email: decoded.email };

    // Move on to the next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};
