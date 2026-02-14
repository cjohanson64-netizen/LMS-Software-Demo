export function CourseCard({ course, onOpen, onManage }) {
  return (
    <div className="t-card t-cardTight">
      <h3 className="t-h3">{course.title}</h3>
      <p className="t-muted">Students: {course.studentsCount}</p>
      <p className="t-muted">Updated: {course.updatedAtLabel}</p>

      <div className="t-row t-row-tight">
        <button className="t-btn" onClick={() => onOpen?.(course.id)}>
          Open
        </button>
        <button className="t-btnSecondary" onClick={() => onManage?.(course.id)}>
          Manage
        </button>
      </div>
    </div>
  );
}
