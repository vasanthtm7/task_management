import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { User } from '../types';

/**
 * DashboardLayout
 * The main layout with a sidebar navigation and top navbar.
 * Used for all authenticated pages.
 */

interface Props {
  user: User;
  onLogout: () => void;
}

/** Navigation items for the sidebar */
const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'My Tasks',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/tasks/new',
    label: 'Add Task',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

function DashboardLayout({ user, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  /** Get the page title based on the current route */
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/tasks/new') return 'Add Task';
    if (path.match(/\/tasks\/\d+\/edit/)) return 'Edit Task';
    if (path === '/tasks') return 'My Tasks';
    if (path === '/profile') return 'Profile';
    return 'Navi';
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* ============================================================ */}
      {/* Mobile sidebar overlay */}
      {/* ============================================================ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================================ */}
      {/* Sidebar */}
      {/* ============================================================ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar header / brand */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-extrabold gradient-text tracking-tight">
            Navi
          </h1>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary-light)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer - user info + logout */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#a78bfa] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {user.email}
              </p>
            </div>
            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all"
              title="Logout"
              aria-label="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* Main content area */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 flex items-center px-4 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 mr-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {getPageTitle()}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
