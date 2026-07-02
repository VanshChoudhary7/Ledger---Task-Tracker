import { useState } from 'react';
import TaskForm from './TaskForm.jsx';

const PRIORITY_LABEL = { low: 'Low', medium: 'Med', high: 'High' };
const STATUS_LABEL = { todo: 'To do', 'in-progress': 'In progress', done: 'Done' };

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const isDone = task.status === 'done';

  const toggleDone = async () => {
    setBusy(true);
    try {
      await onUpdate(task._id, { status: isDone ? 'todo' : 'done' });
    } finally {
      setBusy(false);
    }
  };

  const handleEditSubmit = async (values) => {
    await onUpdate(task._id, values);
    setEditing(false);
  };

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    onDelete(task._id);
  };

  if (editing) {
    return (
      <li className="task-row task-row--editing">
        <TaskForm
          initialTask={task}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditing(false)}
          submitLabel="Save changes"
        />
      </li>
    );
  }

  const due = formatDate(task.dueDate);
  const overdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <li className={`task-row priority-${task.priority} ${isDone ? 'is-done' : ''}`}>
      <button
        type="button"
        className={`stamp-check ${isDone ? 'stamped' : ''}`}
        onClick={toggleDone}
        disabled={busy}
        aria-pressed={isDone}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        {isDone && <span className="stamp-mark">✓</span>}
      </button>

      <div className="task-main">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <span className={`chip chip-priority-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
          <span className={`chip chip-status-${task.status}`}>{STATUS_LABEL[task.status]}</span>
        </div>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          {due && <span className={`due ${overdue ? 'overdue' : ''}`}>Due {due}{overdue ? ' · overdue' : ''}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-icon" onClick={() => setEditing(true)} aria-label="Edit task">
          Edit
        </button>
        <button
          type="button"
          className={`btn btn-icon btn-danger ${confirmingDelete ? 'confirming' : ''}`}
          onClick={handleDeleteClick}
          aria-label="Delete task"
        >
          {confirmingDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </li>
  );
}
