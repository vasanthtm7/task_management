import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../types';
import * as authService from '../services/auth.service';
import AlertMessage from '../components/AlertMessage';

/**
 * LoginPage
 * Allows users to sign in with their email and password.
 */

interface Props {
  onAuth: (token: string, user: User) => void;
}

function LoginPage({ onAuth }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      onAuth(result.token, result.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
        Welcome back
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Sign in to your account to continue
      </p>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            autoComplete="current-password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {loading && <div className="spinner spinner-sm border-white/30 border-t-white" />}
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Register link */}
      <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-[var(--color-primary-light)] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
