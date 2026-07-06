import { Outlet } from 'react-router-dom';

/**
 * AuthLayout
 * A centered layout for login and register pages.
 * Features a gradient background and a glass-card container.
 */
function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background decorative gradient blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
      />

      {/* Auth card container */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold gradient-text tracking-tight">
            Navi
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            Task management made simple
          </p>
        </div>

        {/* Page content (Login or Register form) */}
        <div className="glass-card p-8 shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
