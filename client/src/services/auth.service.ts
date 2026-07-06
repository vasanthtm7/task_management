import api from './api';
import type { AuthResponse, User } from '../types';

/**
 * Auth Service (Frontend)
 * Handles all API calls related to authentication.
 * Also manages storing/reading auth data from localStorage.
 */

/** Register a new user */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

/** Login with email and password */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

/** Get the logged-in user's profile */
export const getProfile = async (): Promise<User> => {
  const response = await api.get<{ user: User }>('/auth/profile');
  return response.data.user;
};

/** Update the user's name */
export const updateProfile = async (name: string): Promise<User> => {
  const response = await api.put<{ user: User; message: string }>(
    '/auth/profile',
    { name }
  );
  return response.data.user;
};

/** Save auth data (token + user) to localStorage */
export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/** Read the stored user from localStorage */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

/** Clear all auth data (logout) */
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/** Check if a user is currently logged in */
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};
