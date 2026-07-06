/**
 * LoadingSpinner Component
 * A simple animated spinner shown during data loading.
 */

interface Props {
  /** Optional text message below the spinner */
  message?: string;
  /** Use the small variant (inline) */
  small?: boolean;
}

function LoadingSpinner({ message = 'Loading...', small = false }: Props) {
  if (small) {
    return <div className="spinner spinner-sm inline-block" />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="spinner mb-4" />
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
