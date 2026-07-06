import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Task } from '../types';
import * as taskService from '../services/task.service';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

/**
 * EditTaskPage
 * Loads a task by ID and lets the user edit it.
 */

function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch the task on mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const result = await taskService.getTaskById(Number(id));
        setTask(result);
      } catch {
        setError('Task not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (data: { title: string; description?: string | null; status?: Task['status']; due_date?: string | null }) => {
    setSaving(true);
    setError('');
    try {
      await taskService.updateTask(Number(id), data);
      navigate('/tasks');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update task';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading task..." />;

  if (!task && !loading) {
    return (
      <div className="bg-white border border-[var(--border-color)] p-12 text-center rounded-[16px] shadow-sm animate-fade-in">
        <p className="text-[var(--text-secondary)]">Task not found</p>
      </div>
    );
  }

  return (
    <div>
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      <TaskForm
        title="Edit Task"
        initialData={task}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}

export default EditTaskPage;
