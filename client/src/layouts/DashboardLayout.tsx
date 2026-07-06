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
    icon: '🏠',
  },
  {
    to: '/tasks',
    label: 'My Tasks',
    icon: '✔',
  },
  {
    to: '/tasks/new',
    label: 'Add Task',
    icon: '➕',
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: '👤',
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
          fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar header / brand */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)] gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-primary)] to-[#7c3aed] flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-none">
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
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-150
                ${
                  isActive
                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-md bg-[var(--color-primary)]" />
                  )}
                  {/* Standardized 32x32 icon container */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-lg">
                    {item.icon}
                  </div>
                  {/* Label */}
                  <span className="leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer - user info + logout */}
        <div className="p-6 border-t border-[var(--border-color)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#a78bfa] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate leading-none">
                {user.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate mt-1.5 leading-none">
                {user.email}
              </p>
            </div>
          </div>
          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all flex-shrink-0"
            title="Logout"
            aria-label="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* Main content area */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 flex items-center px-8 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm sticky top-0 z-30">
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

          {/* Page title (hidden on desktop to avoid duplication) */}
          <h2 className="text-xl font-bold text-[var(--text-primary)] lg:hidden">
            {getPageTitle()}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
