-- ============================================================
-- Task Manager Database Setup Script
-- Run this file in psql or pgAdmin to create all required tables
-- ============================================================

-- Create the database (run this separately if needed)
-- CREATE DATABASE taskmanager;

-- Connect to the database before running the rest
-- \c taskmanager

-- ============================================================
-- USERS TABLE
-- Stores user account information
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,           -- Auto-incrementing unique ID
  name        VARCHAR(100) NOT NULL,        -- User's display name
  email       VARCHAR(255) UNIQUE NOT NULL, -- Must be unique across all users
  password    VARCHAR(255) NOT NULL,        -- Hashed password (never store plain text!)
  created_at  TIMESTAMP DEFAULT NOW()       -- When the account was created
);

-- ============================================================
-- TASKS TABLE
-- Stores all tasks, linked to users via user_id
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- ON DELETE CASCADE: if a user is deleted, their tasks are deleted too
  title       VARCHAR(255) NOT NULL,
  description TEXT,                         -- Optional longer description
  status      VARCHAR(20) DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Completed')),
  -- CHECK constraint ensures only valid status values are stored
  due_date    DATE,                         -- Optional due date
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- Indexes speed up queries that filter by these columns
-- ============================================================

-- Speed up lookups of tasks by user_id (used in almost every task query)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Speed up lookups by status (used for filtering)
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Speed up user lookup by email (used during login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- SAMPLE DATA (optional — remove in production)
-- ============================================================

-- Insert a test user (password is "password123" hashed with bcrypt)
-- You can generate your own hash using bcrypt.hash('yourpassword', 10)
INSERT INTO users (name, email, password) VALUES
  ('Demo User', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks for the demo user
INSERT INTO tasks (user_id, title, description, status, due_date)
SELECT 
  u.id,
  task.title,
  task.description,
  task.status,
  task.due_date::DATE
FROM users u
CROSS JOIN (
  VALUES
    ('Set up project', 'Initialize the repo and install dependencies', 'Completed', '2024-01-10'),
    ('Design database schema', 'Create tables for users and tasks', 'Completed', '2024-01-12'),
    ('Build REST API', 'Implement all CRUD endpoints for tasks', 'In Progress', '2024-01-20'),
    ('Create React frontend', 'Build all pages and components', 'Todo', '2024-01-25'),
    ('Write tests', 'Add unit and integration tests', 'Todo', '2024-01-30')
) AS task(title, description, status, due_date)
WHERE u.email = 'demo@example.com'
ON CONFLICT DO NOTHING;

-- ============================================================
-- Verify the setup
-- ============================================================
SELECT 'Users table created' AS status;
SELECT 'Tasks table created' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS task_count FROM tasks;
