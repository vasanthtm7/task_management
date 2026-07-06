import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware
 * This catches any errors thrown by route handlers and sends a clean response.
 * In Express, error handlers have 4 parameters (err, req, res, next).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err.message);

  // Send a generic 500 error response
  res.status(500).json({
    message: 'Internal server error',
    // Only show error details in development mode
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};

/**
 * 404 Not Found Handler
 * This catches any requests to routes that don't exist
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};
