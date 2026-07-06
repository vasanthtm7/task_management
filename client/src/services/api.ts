import axios from 'axios';

/**
 * Axios instance pre-configured for our backend API
 *
 * All API calls should use this instance instead of plain axios
 * so they automatically get:
 * - The correct base URL
 * - The JWT token in the Authorization header
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Runs before every request is sent.
 * Reads the JWT token from localStorage and adds it to the header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Runs after every response is received.
 * If the server returns 401 (Unauthorized), clear the stored
 * credentials and redirect the user to the login page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
