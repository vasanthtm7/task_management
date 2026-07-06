import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import our routes
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// Import error handling middleware
import { errorHandler, notFound } from './middlewares/error.middleware';

// Create the Express application
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 * These run on every incoming request before our route handlers
 */

// Enable CORS so the frontend can communicate with this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON request bodies (e.g., req.body will be a JS object)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

/**
 * Route Registration
 * All auth routes are prefixed with /api/auth
 * All task routes are prefixed with /api/tasks
 */
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint to verify the server is running
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

/**
 * Error Handling Middleware
 * These must be registered AFTER all routes
 */
app.use(notFound);         // Handle 404s
app.use(errorHandler);     // Handle all other errors

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
