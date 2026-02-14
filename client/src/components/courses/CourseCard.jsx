import React from "react";

export default function CourseCard({ course, onOpen }) {

  if (!course) return null;

  return (
    <div className="card">
      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0 }}>{course.title}</h3>

        {course.description ? (
          <p style={{ margin: 0, opacity: 0.8 }}>{course.description}</p>
        ) : (
          <p style={{ margin: 0, opacity: 0.6 }}>(No description)</p>
        )}
      </div>

      <button
        className="btn"
        type="button"
        onClick={() => onOpen?.(course.id)}
        style={{ marginTop: 12 }}
      >
        Open ⇨
      </button>
    </div>
  );
}
