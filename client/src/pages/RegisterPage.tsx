import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../types';
import * as authService from '../services/auth.service';
import AlertMessage from '../components/AlertMessage';

/**
 * RegisterPage
 * Allows new users to create an account.
 */

interface Props {
  onAuth: (token: string, user: User) => void;
}

function RegisterPage({ onAuth }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(name, email, password);
      onAuth(result.token, result.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
        Create your account
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Start managing your tasks today
      </p>

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Email address
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="register-confirm" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Confirm password
          </label>
          <input
            id="register-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            autoComplete="new-password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {loading && <div className="spinner spinner-sm border-white/30 border-t-white" />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Login link */}
      <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--color-primary-light)] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
