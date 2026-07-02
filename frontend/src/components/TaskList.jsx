import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, loading, error, onUpdate, onDelete, hasFilters }) {
  if (loading) {
    return (
      <div className="state-panel">
        <p>Loading the ledger…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-panel--error">
        <p>Couldn't load tasks: {error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-panel">
        <p>{hasFilters ? 'No tasks match these filters.' : 'The ledger is empty. Add your first task above.'}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
