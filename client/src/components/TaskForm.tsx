import { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../types';

/**
 * TaskForm Component
 * A shared form used for both creating and editing tasks.
 */

interface Props {
  /** Existing task data when editing (null for create) */
  initialData?: Task | null;
  /** Called when the form is submitted */
  onSubmit: (data: { title: string; description?: string | null; status?: TaskStatus; due_date?: string | null }) => Promise<void>;
  /** Loading state for the submit button */
  loading: boolean;
  /** The form title */
  title: string;
}

/** Available task statuses */
const STATUS_OPTIONS: TaskStatus[] = ['Todo', 'In Progress', 'Completed'];

function TaskForm({ initialData, onSubmit, loading, title }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo' as TaskStatus,
    due_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
      });
    }
  }, [initialData]);

  /** Basic client-side validation */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status,
      due_date: formData.due_date || null,
    });
  };

  /** Update a single form field */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {initialData ? 'Update details for this task.' : 'Create a new item in your workspace.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[var(--border-color)] p-8 rounded-[16px] space-y-6 shadow-sm">
        {/* Title field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Title <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className={`
              w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all
              ${errors.title ? 'border-[var(--color-danger)]' : 'border-[var(--border-color)] focus:border-[var(--color-primary)]'}
            `}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.title}</p>
          )}
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details (optional)"
            rows={4}
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all resize-none"
          />
        </div>

        {/* Status and Due Date (side by side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading && <div className="spinner spinner-sm border-white/30 border-t-white" />}
            {initialData ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
