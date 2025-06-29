'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ClientOnly from './components/ClientOnly';
import './globals.css';

// Since backend and frontend run on the same port, we use relative URLs
const API_BASE_URL = '/api';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Memoized API calls for better performance
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please check if the server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new task
  const addTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          completed: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }

      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
    } finally {
      setSubmitting(false);
    }
  }, [newTaskTitle]);

  // Toggle task completion
  const toggleTask = useCallback(async (taskId) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  }, []);

  // Memoized task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ClientOnly fallback={
      <div className="container">
        <div className="todo-app">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading application...</p>
          </div>
        </div>
      </div>
    }>
      <div className="container">
        <div className="todo-app">
          <div className="todo-header">
            <h1>✨ Todo App</h1>
            <p>Manage your tasks with ease</p>
            <div className="built-by">
              <span>Built by Vivek</span>
            </div>
            {taskStats.total > 0 && (
              <div className="task-stats">
                <span>Total: {taskStats.total}</span>
                <span>Completed: {taskStats.completed}</span>
                <span>Pending: {taskStats.pending}</span>
              </div>
            )}
          </div>

          {/* Add Task Form */}
          <form onSubmit={addTask} className="add-task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter a new task..."
              disabled={submitting}
              maxLength={100}
            />
            <button type="submit" disabled={submitting || !newTaskTitle.trim()}>
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* Tasks List */}
          <div className="tasks-list">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks yet!</h3>
                <p>Add your first task above to get started.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <div
                      className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => toggleTask(task.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleTask(task.id);
                        }
                      }}
                    />
                    <span className="task-title">{task.title}</span>
                  </div>
                  <div className="task-actions">
                    <button
                      className="task-button toggle-button"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      className="task-button delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 