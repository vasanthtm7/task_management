import { Link } from 'react-router-dom';
import type { Task } from '../types';

/**
 * TaskCard Component
 * Displays a single task as a card with status, title, due date, and actions.
 */

interface Props {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

/** Get the color styling for each task status */
function getStatusStyle(status: Task['status']) {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-[var(--color-success-bg)]',
        text: 'text-[var(--color-success)]',
        border: 'border-[var(--color-success)]/30',
        dot: 'bg-[var(--color-success)]',
      };
    case 'In Progress':
      return {
        bg: 'bg-[var(--color-warning-bg)]',
        text: 'text-[var(--color-warning)]',
        border: 'border-[var(--color-warning)]/30',
        dot: 'bg-[var(--color-warning)]',
      };
    default:
      return {
        bg: 'bg-[var(--color-info-bg)]',
        text: 'text-[var(--color-info)]',
        border: 'border-[var(--color-info)]/30',
        dot: 'bg-[var(--color-info)]',
      };
  }
}

/** Format a date string into a readable format */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Check if a task is overdue */
function isOverdue(dateStr: string | null, status: string): boolean {
  if (!dateStr || status === 'Completed') return false;
  return new Date(dateStr) < new Date();
}

function TaskCard({ task, onDelete, onStatusChange }: Props) {
  const statusStyle = getStatusStyle(task.status);
  const overdue = isOverdue(task.due_date, task.status);

  /** Cycle to the next status */
  const nextStatus = (): Task['status'] => {
    if (task.status === 'Todo') return 'In Progress';
    if (task.status === 'In Progress') return 'Completed';
    return 'Todo';
  };

  return (
    <div className="glass-card p-5 hover:border-[var(--border-color-hover)] hover:shadow-md transition-all duration-200 animate-fade-in group">
      {/* Top row: status badge + actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Status badge */}
        <button
          onClick={() => onStatusChange(task.id, nextStatus())}
          className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
            ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}
            hover:opacity-80 transition-opacity cursor-pointer
          `}
          title={`Click to change to "${nextStatus()}"`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {task.status}
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-primary-light)] hover:bg-[var(--color-primary-bg)] transition-all"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-base font-semibold mb-1.5 ${task.status === 'Completed' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
        {task.title}
      </h3>

      {/* Description (truncated) */}
      {task.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due date */}
      <div className="flex items-center gap-1.5 text-xs">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={overdue ? 'text-[var(--color-danger)] font-medium' : 'text-[var(--text-muted)]'}>
          {formatDate(task.due_date)}
          {overdue && ' (Overdue)'}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
