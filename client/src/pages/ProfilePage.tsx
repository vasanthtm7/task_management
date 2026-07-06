import { useState } from 'react';
import type { User } from '../types';
import * as authService from '../services/auth.service';
import AlertMessage from '../components/AlertMessage';

/**
 * ProfilePage
 * Shows the current user's info and allows them to update their name.
 */

interface Props {
  user: User;
  onUserUpdate: (user: User) => void;
}

function ProfilePage({ user, onUserUpdate }: Props) {
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setLoading(true);
    try {
      const updated = await authService.updateProfile(name);
      onUserUpdate(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update profile';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--text-primary)]">
          Profile Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Profile Card */}
      {/* ============================================================ */}
      <div className="bg-white border border-[var(--border-color)] p-8 rounded-[16px] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#a78bfa] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{user.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-primary)]">
            <p className="text-[var(--text-muted)] mb-1">Email</p>
            <p className="text-[var(--text-primary)] font-medium">{user.email}</p>
          </div>
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-primary)]">
            <p className="text-[var(--text-muted)] mb-1">Member since</p>
            <p className="text-[var(--text-primary)] font-medium">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Update Name Form */}
      {/* ============================================================ */}
      <div className="bg-white border border-[var(--border-color)] p-8 rounded-[16px] shadow-sm">
        <h3 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Update Name</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Display name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading && <div className="spinner spinner-sm border-white/30 border-t-white" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
