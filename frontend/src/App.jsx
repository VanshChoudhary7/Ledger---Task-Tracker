import { useCallback, useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';
import * as api from './api/tasks.js';

const DEFAULT_FILTERS = { search: '', status: 'all', priority: 'all' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, kind = 'ok') => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadTasks = useCallback(async (activeFilters) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchTasks(activeFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetch whenever filters change
  useEffect(() => {
    const handle = setTimeout(() => {
      loadTasks(filters);
    }, 250);
    return () => clearTimeout(handle);
  }, [filters, loadTasks]);

  const handleCreate = async (values) => {
    try {
      const created = await api.createTask(values);
      setTasks((prev) => [created, ...prev]);
      setFormOpen(false);
      showToast('Task added.');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      const updated = await api.updateTask(id, values);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      showToast('Task updated.');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await api.deleteTask(id);
      showToast('Task deleted.');
    } catch (err) {
      setTasks(prevTasks);
      showToast(err.message, 'error');
    }
  };

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    return { done, total: tasks.length };
  }, [tasks]);

  const hasFilters =
    filters.search.trim() !== '' || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark">✎</span>
          <div>
            <h1>Ledger</h1>
            <p className="tagline">A running record of what needs doing.</p>
          </div>
        </div>
        <div className="stats-block">
          <span className="stats-count">{stats.done} / {stats.total}</span>
          <span className="stats-label">marked done</span>
        </div>
      </header>

      <main className="page-main">
        <section className="control-bar">
          <FilterBar filters={filters} onChange={setFilters} />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setFormOpen((v) => !v)}
          >
            {formOpen ? 'Close' : '+ New entry'}
          </button>
        </section>

        {formOpen && (
          <section className="new-task-panel">
            <TaskForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} submitLabel="Add task" />
          </section>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          hasFilters={hasFilters}
        />
      </main>

      {toast && (
        <div className={`toast toast--${toast.kind}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
