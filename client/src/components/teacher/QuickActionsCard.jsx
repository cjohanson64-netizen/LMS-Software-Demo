export function QuickActionsCard({
  onCreateCourse,
  onViewSubmissions,
  onOpenGradebook,
}) {
  return (
    <section className="t-card">
      <h2 className="t-h2">Quick Actions</h2>
      <div className="t-stack">
        <button className="t-btn" onClick={onCreateCourse}>
          + Create Course
        </button>
        <button className="t-btn" onClick={onViewSubmissions}>
          View Submissions
        </button>
        <button className="t-btn" onClick={onOpenGradebook}>
          Open Gradebook
        </button>
      </div>
    </section>
  );
}
