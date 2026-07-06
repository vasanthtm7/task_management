import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * PostgreSQL connection pool
 * A pool manages multiple database connections efficiently
 * instead of creating a new connection for every query
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'taskmanager',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Maximum number of connections in the pool
  max: 10,
  // Close idle connections after 30 seconds
  idleTimeoutMillis: 30000,
  // Timeout when connecting
  connectionTimeoutMillis: 2000,
});

// Test the database connection when app starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release(); // Release the client back to the pool
  }
});

export default pool;
