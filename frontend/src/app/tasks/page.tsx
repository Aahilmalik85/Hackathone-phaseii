'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Task, TaskCreate, TaskUpdate } from '@/lib/types';
import { taskApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login'); // Redirect to login
    }
  }, [user, authLoading, router]);

  // Fetch tasks safely
  useEffect(() => {
    async function fetchTasks() {
      if (!user) return; // ✅ guard against null

      setLoading(true);
      setError(null);

      try {
        const fetchedTasks = await taskApi.list(user.id);
        setTasks(fetchedTasks);
      } catch (err: any) {
        console.error('Failed to fetch tasks:', err);
        setError(err.message || 'Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [user]);

  // Task operations
  const handleTaskCreated = async (taskData: TaskCreate) => {
    if (!user) return;

    setCreating(true);
    setError(null);

    try {
      const newTask = await taskApi.create(user.id, taskData);
      if (newTask) setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
      toast.success('Task created successfully!', { description: taskData.title });
    } catch (err: any) {
      console.error('Failed to create task:', err);
      setError(err.message || 'Failed to create task.');
      toast.error('Failed to create task', { description: err.message || '' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (taskId: number, data: TaskUpdate) => {
    if (!user) return;

    try {
      const updatedTask = await taskApi.update(user.id, taskId, data);
      if (updatedTask) setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (err: any) {
      console.error('Failed to update task:', err);
      toast.error('Failed to update task', { description: err.message || '' });
      throw err;
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!user) return;

    try {
      await taskApi.delete(user.id, taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task', { description: err.message || '' });
      throw err;
    }
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    if (!user) return;

    try {
      const updatedTask = await taskApi.toggleComplete(user.id, taskId, isCompleted);
      if (updatedTask) setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast.success(isCompleted ? 'Task completed!' : 'Task marked as incomplete');
    } catch (err: any) {
      console.error('Failed to toggle completion:', err);
      toast.error('Failed to update task', { description: err.message || '' });
      throw err;
    }
  };

  // Bulk operations
  const handleToggleSelection = (taskId: number) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.size === tasks.length) setSelectedTaskIds(new Set());
    else setSelectedTaskIds(new Set(tasks.map(task => task.id)));
  };

  const handleBulkDelete = async () => {
    if (!user || selectedTaskIds.size === 0) return;

    if (!confirm(`Delete ${selectedTaskIds.size} selected task(s)?`)) return;

    setBulkActionLoading(true);
    const count = selectedTaskIds.size;

    try {
      await Promise.all(Array.from(selectedTaskIds).map(taskId => taskApi.delete(user.id, taskId)));
      setTasks(prev => prev.filter(task => !selectedTaskIds.has(task.id)));
      setSelectedTaskIds(new Set());
      toast.success(`${count} ${count === 1 ? 'task' : 'tasks'} deleted successfully!`);
    } catch (err: any) {
      console.error('Failed to delete tasks:', err);
      toast.error('Failed to delete some tasks', { description: err.message || '' });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkComplete = async (isCompleted: boolean) => {
    if (!user || selectedTaskIds.size === 0) return;

    setBulkActionLoading(true);
    const count = selectedTaskIds.size;

    try {
      const updatedTasks = await Promise.all(
        Array.from(selectedTaskIds).map(taskId => taskApi.toggleComplete(user.id, taskId, isCompleted))
      );

      setTasks(prev =>
        prev.map(task => updatedTasks.find(t => t?.id === task.id) || task)
      );
      setSelectedTaskIds(new Set());

      toast.success(
        isCompleted
          ? `${count} ${count === 1 ? 'task' : 'tasks'} marked as complete!`
          : `${count} ${count === 1 ? 'task' : 'tasks'} marked as incomplete!`
      );
    } catch (err: any) {
      console.error('Failed to update tasks:', err);
      toast.error('Failed to update some tasks', { description: err.message || '' });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'n', callback: () => setShowForm(true), description: 'Create new task' },
    { key: 'Escape', callback: () => { setShowForm(false); setShowShortcutsModal(false); }, description: 'Close/Cancel' },
    { key: '?', shiftKey: true, callback: () => setShowShortcutsModal(true), description: 'Show keyboard shortcuts' },
  ], !!user);

  if (authLoading || !user) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="px-4 py-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">My Tasks</h2>
            <p className="text-sm text-text-secondary mt-2">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              {selectedTaskIds.size > 0 && ` • ${selectedTaskIds.size} selected`}
            </p>
          </div>
          <div className="flex gap-3">
            {tasks.length > 0 && (
              <Button variant="secondary" size="md" onClick={handleSelectAll}>
                {selectedTaskIds.size === tasks.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Task'}
            </Button>
          </div>
        </div>

        {showForm && <TaskForm onTaskCreated={handleTaskCreated} onCancel={() => setShowForm(false)} />}
        <TaskList
          tasks={tasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          selectedTaskIds={selectedTaskIds}
          onToggleSelection={handleToggleSelection}
          selectionMode={selectedTaskIds.size > 0 || tasks.length > 0}
          onReorder={handleReorder}
        />
        <BulkActionsToolbar
          selectedCount={selectedTaskIds.size}
          totalCount={tasks.length}
          onSelectAll={handleSelectAll}
          onMarkComplete={() => handleBulkComplete(true)}
          onMarkIncomplete={() => handleBulkComplete(false)}
          onDelete={handleBulkDelete}
          loading={bulkActionLoading}
        />
        <KeyboardShortcutsModal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
      </div>
    </DashboardLayout>
  );
}
