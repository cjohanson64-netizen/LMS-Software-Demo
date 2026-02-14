import React from "react";

export default function AssignmentList({ assignments, onOpenAssignment }) {
  if (!assignments || assignments.length === 0) {
    return <p>No assignments yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {assignments.map((a) => (
        <div key={a.id} className="card">
          <div style={{ display: "grid", gap: 4 }}>
            <h3 style={{ margin: 0 }}>{a.title}</h3>

            {a.dueAt ? (
              <p style={{ margin: 0, opacity: 0.8 }}>
                Due: {new Date(a.dueAt).toLocaleString()}
              </p>
            ) : (
              <p style={{ margin: 0, opacity: 0.6 }}>No due date</p>
            )}
          </div>

          <button
            className="btn"
            type="button"
            onClick={() => onOpenAssignment?.(a.id)}
            style={{ marginTop: 12 }}
          >
            Open ⇨
          </button>
        </div>
      ))}
    </div>
  );
}
