import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Task, TaskStatus } from '../types';
import * as taskService from '../services/task.service';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

/**
 * TaskListPage
 * Shows all tasks for the logged-in user with filtering by status.
 */

/** Filter options for tasks */
const FILTER_OPTIONS: Array<{ label: string; value: TaskStatus | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  /** Fetch all tasks from the API */
  const fetchTasks = async () => {
    try {
      const result = await taskService.getAllTasks();
      setTasks(result);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load tasks' });
    } finally {
      setLoading(false);
    }
  };

  /** Delete a task by ID */
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setMessage({ type: 'success', text: 'Task deleted successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete task' });
    }
  };

  /** Change a task's status */
  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    try {
      const updated = await taskService.updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setMessage({ type: 'success', text: `Task marked as "${newStatus}"` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update task status' });
    }
  };

  /** Apply the current filter */
  const filteredTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  if (loading) return <LoadingSpinner message="Loading tasks..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--text-primary)]">
          My Tasks
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage and track your individual workspace tasks.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Header with filter & add button */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`
                px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all
                ${filter === option.value
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Add task button */}
        <Link
          to="/tasks/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Link>
      </div>

      {/* ============================================================ */}
      {/* Task count */}
      {/* ============================================================ */}
      <p className="text-sm text-[var(--text-muted)]">
        Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>

      {/* ============================================================ */}
      {/* Task Grid */}
      {/* ============================================================ */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-color)] p-12 text-center rounded-[16px] shadow-sm">
          <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[var(--text-secondary)] mb-1 font-medium">No tasks found</p>
          <p className="text-sm text-[var(--text-muted)]">
            {filter !== 'All'
              ? `No "${filter}" tasks. Try a different filter.`
              : 'Create your first task to get started!'}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
