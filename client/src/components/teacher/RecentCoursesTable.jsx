export function RecentCoursesTable({ courses, onViewAll, onOpenCourse }) {
  return (
    <section className="t-card">
      <div className="t-row t-row-tight">
        <h2 className="t-h2">Recent Courses</h2>
        <button className="t-link" onClick={onViewAll}>
          View All Courses →
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="t-empty">
          <p className="t-muted">No courses yet.</p>
          <p className="t-muted">Create your first course to get started.</p>
        </div>
      ) : (
        <div className="t-tableWrap">
          <table className="t-table">
            <thead>
              <tr>
                <th>Course</th>
                <th className="t-colRight">Students</th>
                <th className="t-colRight">Updated</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr
                  key={c.id}
                  className="t-rowClickable"
                  onClick={() => onOpenCourse?.(c.id)}
                >
                  <td>{c.title}</td>
                  <td className="t-colRight">{c.studentsCount}</td>
                  <td className="t-colRight">{c.updatedAtLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
