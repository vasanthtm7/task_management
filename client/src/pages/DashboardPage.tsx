import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardData } from '../types';
import * as taskService from '../services/task.service';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

/**
 * DashboardPage
 * Shows task statistics and recent tasks at a glance.
 */

function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const result = await taskService.getDashboardData();
      setData(result);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  /** Stat card data */
  const statCards = data
    ? [
        {
          label: 'Total Tasks',
          value: data.stats.total,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          color: 'var(--color-primary)',
          bg: 'var(--color-primary-bg)',
        },
        {
          label: 'In Progress',
          value: data.stats.in_progress,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          color: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
        {
          label: 'Completed',
          value: data.stats.completed,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
        {
          label: 'Pending',
          value: data.stats.pending,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'var(--color-info)',
          bg: 'var(--color-info-bg)',
        },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      {/* ============================================================ */}
      {/* Stats Cards Grid */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="glass-card p-5 hover:border-[var(--border-color-hover)] transition-all duration-200"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Progress Bar */}
      {/* ============================================================ */}
      {data && data.stats.total > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Overall Progress</h3>
            <span className="text-sm font-medium text-[var(--color-primary-light)]">
              {Math.round((data.stats.completed / data.stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transition-all duration-700 ease-out"
              style={{ width: `${(data.stats.completed / data.stats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Recent Tasks */}
      {/* ============================================================ */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Tasks</h3>
          <Link
            to="/tasks"
            className="text-xs font-medium text-[var(--color-primary-light)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {data && data.recentTasks.length > 0 ? (
          <div className="space-y-3">
            {data.recentTasks.map((task) => {
              const statusColors: Record<string, string> = {
                'Todo': 'bg-[var(--color-info)]',
                'In Progress': 'bg-[var(--color-warning)]',
                'Completed': 'bg-[var(--color-success)]',
              };
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[task.status]}`} />
                  <span className={`text-sm flex-1 truncate ${task.status === 'Completed' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-muted)] mb-3">No tasks yet</p>
            <Link
              to="/tasks/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
