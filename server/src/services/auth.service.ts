import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../repositories/user.repository';

/**
 * Auth Service
 * The Service layer contains the business logic.
 * It sits between the Controller (HTTP handling) and Repository (database).
 */

/**
 * Register a new user
 * 1. Check if the email is already taken
 * 2. Hash the password for security
 * 3. Save the user to the database
 * 4. Return a JWT token
 */
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  // Step 1: Check if email already exists
  const existingUser = await UserRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email is already registered. Please login.');
  }

  // Step 2: Hash the password
  // The "10" is the salt rounds — higher = more secure but slower
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 3: Create the user in the database
  const user = await UserRepository.createUser(name, email, hashedPassword);

  // Step 4: Generate a JWT token
  const token = generateToken(user.id, user.email);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

/**
 * Login an existing user
 * 1. Find the user by email
 * 2. Compare the provided password with the stored hash
 * 3. Return a JWT token if credentials are valid
 */
export const login = async (email: string, password: string) => {
  // Step 1: Find the user
  const user = await UserRepository.findUserByEmail(email);
  if (!user) {
    // Use a generic error message for security (don't reveal if email exists)
    throw new Error('Invalid email or password.');
  }

  // Step 2: Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Step 3: Generate a JWT token
  const token = generateToken(user.id, user.email);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

/**
 * Get the profile of the currently logged-in user
 */
export const getProfile = async (userId: number) => {
  const user = await UserRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found.');
  }
  return { id: user.id, name: user.name, email: user.email, created_at: user.created_at };
};

/**
 * Update the user's name
 */
export const updateProfile = async (userId: number, name: string) => {
  const user = await UserRepository.updateUser(userId, name);
  if (!user) {
    throw new Error('User not found.');
  }
  return { id: user.id, name: user.name, email: user.email };
};

/**
 * Helper function to generate a JWT token
 * The token contains the user's id and email as the payload
 */
const generateToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, email }, secret, { expiresIn } as jwt.SignOptions);
};
