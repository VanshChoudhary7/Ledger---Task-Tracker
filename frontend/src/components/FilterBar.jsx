export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        className="search-input"
        placeholder="Search titles…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        aria-label="Search tasks by title"
      />

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        aria-label="Filter by priority"
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}
