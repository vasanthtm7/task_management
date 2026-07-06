import pool from '../config/database';

/**
 * User type definition
 * Matches the columns in the 'users' table in our database
 */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

/**
 * User Repository
 * The Repository layer handles all direct database queries for users.
 * Controllers and Services should NOT write SQL — that's the repository's job.
 */

/**
 * Find a user by their email address
 * Used during login to check if the user exists
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  // Return the first row, or null if no user was found
  return result.rows[0] || null;
};

/**
 * Find a user by their ID
 * Used to get the current logged-in user's profile
 */
export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create a new user in the database
 * Returns the newly created user (without the password)
 */
export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string
): Promise<User> => {
  const result = await pool.query<User>(
    `INSERT INTO users (name, email, password) 
     VALUES ($1, $2, $3) 
     RETURNING id, name, email, created_at`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

/**
 * Update a user's name
 */
export const updateUser = async (
  id: number,
  name: string
): Promise<User | null> => {
  const result = await pool.query<User>(
    `UPDATE users SET name = $1 WHERE id = $2 
     RETURNING id, name, email, created_at`,
    [name, id]
  );
  return result.rows[0] || null;
};
