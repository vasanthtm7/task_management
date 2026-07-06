import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User } from './types';
import { getStoredUser, isLoggedIn, clearAuthData, saveAuthData } from './services/auth.service';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaskListPage from './pages/TaskListPage';
import AddTaskPage from './pages/AddTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import ProfilePage from './pages/ProfilePage';

/**
 * App Component
 * The root component that handles routing and auth state.
 */
function App() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getStoredUser());
    }
    setLoading(false);
  }, []);

  /** Called after successful login/register */
  const handleAuth = (token: string, user: User) => {
    saveAuthData(token, user);
    setUser(user);
  };

  /** Called when user clicks logout */
  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };

  /** Update user state (e.g., after profile update) */
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    saveAuthData(localStorage.getItem('token')!, updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (login/register) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage onAuth={handleAuth} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : <RegisterPage onAuth={handleAuth} />
            }
          />
        </Route>

        {/* Protected routes (require login) */}
        <Route
          element={
            user ? (
              <DashboardLayout user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<AddTaskPage />} />
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
          <Route path="/profile" element={<ProfilePage user={user!} onUserUpdate={handleUserUpdate} />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route
          path="*"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
