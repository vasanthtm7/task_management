import { useState, useEffect } from 'react';

/**
 * AlertMessage Component
 * Shows success or error messages with auto-dismiss.
 */

interface Props {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

function AlertMessage({ type, message, onClose }: Props) {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] mb-4 animate-slide-right
        ${isSuccess
          ? 'bg-[var(--color-success-bg)] border border-[var(--color-success)]/30 text-[var(--color-success)]'
          : 'bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/30 text-[var(--color-danger)]'
        }
      `}
      role="alert"
    >
      {/* Icon */}
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isSuccess ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>

      {/* Message */}
      <p className="text-sm flex-1">{message}</p>

      {/* Close button */}
      <button
        onClick={() => { setVisible(false); onClose?.(); }}
        className="p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default AlertMessage;
