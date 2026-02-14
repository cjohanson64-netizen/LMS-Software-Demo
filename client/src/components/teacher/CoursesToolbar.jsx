export function CoursesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  return (
    <div className="t-row t-toolbar">
      <input
        className="t-input"
        placeholder="Search courses…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="t-select"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}
