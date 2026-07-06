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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          color: '#6366f1',
          bg: '#eef2ff',
        },
        {
          label: 'In Progress',
          value: data.stats.in_progress,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          color: '#f59e0b',
          bg: '#fef3c7',
        },
        {
          label: 'Completed',
          value: data.stats.completed,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: '#10b981',
          bg: '#ecfdf5',
        },
        {
          label: 'Pending',
          value: data.stats.pending,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: '#3b82f6',
          bg: '#eff6ff',
        },
      ]
    : [];

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusBadgeStyles: Record<string, { bg: string; label: string; dot: string }> = {
    'Todo': { bg: 'bg-amber-50 text-amber-800 border-amber-200/50', label: 'Pending', dot: 'bg-amber-500' },
    'In Progress': { bg: 'bg-blue-50 text-blue-800 border-blue-200/50', label: 'In Progress', dot: 'bg-blue-500' },
    'Completed': { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/50', label: 'Completed', dot: 'bg-emerald-500' },
  };

  const upcomingDeadlines = data
    ? data.recentTasks
        .filter(t => t.status !== 'Completed' && t.due_date)
        .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

      <div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back! Here is a summary of your workspace productivity.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Stats Cards Grid */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white border border-[var(--border-color)] p-6 rounded-[16px] h-[120px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-secondary)]">{stat.label}</p>
              <p className="text-[34px] font-black leading-none text-[var(--text-primary)] mt-2">{stat.value}</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Progress Bar */}
      {/* ============================================================ */}
      {data && data.stats.total > 0 && (
        <div className="bg-white border border-[var(--border-color)] p-6 rounded-[16px] h-[180px] flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-[22px] font-bold text-[var(--text-primary)]">Overall Progress</h3>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Completed {data.stats.completed} of {data.stats.total} tasks
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transition-all duration-700 ease-out"
                style={{ width: `${(data.stats.completed / data.stats.total) * 100}%` }}
              />
            </div>
            <span className="text-[18px] font-bold text-[var(--color-primary)] w-12 text-right">
              {Math.round((data.stats.completed / data.stats.total) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Grid Layout for Recent Tasks & Upcoming Deadlines */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[22px] font-bold text-[var(--text-primary)]">Recent Tasks</h3>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline flex items-center gap-1 transition-colors"
            >
              View all tasks
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {data && data.recentTasks.length > 0 ? (
            <div className="space-y-4">
              {data.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-[var(--border-color)] p-6 rounded-[12px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeStyles[task.status].bg} border-current/25 flex-shrink-0`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadgeStyles[task.status].dot}`} />
                        {statusBadgeStyles[task.status].label}
                      </span>
                      <h4 className={`text-[18px] font-bold truncate ${task.status === 'Completed' ? 'line-through text-[var(--text-muted)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed truncate max-w-[500px]">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-shrink-0 self-end sm:self-auto">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{formatDate(task.due_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-[var(--border-color)] rounded-[var(--radius-lg)] bg-[var(--bg-primary)]/20">
              <svg className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-3">No tasks yet</p>
              <Link
                to="/tasks/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-500/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first task
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines Widget (1/3 width) */}
        <div className="space-y-6">
          <h3 className="text-[22px] font-bold text-[var(--text-primary)]">Upcoming Deadlines</h3>
          
          <div className="bg-white border border-[var(--border-color)] p-6 rounded-[16px] shadow-sm space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task) => (
                <div key={task.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                    <span className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Due {formatDate(task.due_date)}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusBadgeStyles[task.status].bg} border-current/15`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadgeStyles[task.status].dot}`} />
                    {statusBadgeStyles[task.status].label}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[var(--text-muted)] text-sm">
                <svg className="w-8 h-8 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No upcoming deadlines!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
