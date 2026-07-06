import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types';
import * as taskService from '../services/task.service';
import TaskForm from '../components/TaskForm';
import AlertMessage from '../components/AlertMessage';

/**
 * AddTaskPage
 * Lets users create a new task using the shared TaskForm.
 */

function AddTaskPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: { title: string; description?: string; status?: Task['status']; due_date?: string }) => {
    setLoading(true);
    setError('');
    try {
      await taskService.createTask(data);
      // Navigate to task list with success
      navigate('/tasks');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      <TaskForm
        title="Create New Task"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default AddTaskPage;
