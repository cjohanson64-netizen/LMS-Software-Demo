import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignmentDetail } from "../../hooks/useAssignmentDetail.js";
import { useMySubmission } from "../../hooks/useMySubmission.js";

export default function AssignmentDetailPage() {
  const nav = useNavigate();
  const { assignmentId } = useParams();

  const { assignment, loading, error } = useAssignmentDetail(assignmentId);
  const {
    submission,
    loading: subLoading,
    saving,
    error: subError,
    save,
  } = useMySubmission(assignmentId);

  const [content, setContent] = useState("");
  const [didInit, setDidInit] = useState(false);

  // Fix A: prefill submission content only once
  useEffect(() => {
    if (!didInit && submission?.content != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(submission.content);
      setDidInit(true);
    }
  }, [didInit, submission]);

  if (loading) return <p>Loading assignment…</p>;

  if (error) {
    return (
      <div className="container">
        <button className="btn-ghost" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
        <p>{error}</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container">
        <button className="btn-ghost" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
        <p>Assignment not found.</p>
      </div>
    );
  }

  const status =
    submission?.grade != null
      ? "GRADED"
      : submission
        ? "SUBMITTED"
        : "NOT SUBMITTED";

  async function handleSubmit(e) {
    e.preventDefault();
    await save(content);
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: 6 }}>{assignment.title}</h1>

        {assignment.instructions ? (
          <p style={{ marginTop: 0, opacity: 0.9 }}>
            {assignment.instructions}
          </p>
        ) : (
          <p style={{ marginTop: 0, opacity: 0.6 }}>(No instructions)</p>
        )}

        <div style={{ display: "grid", gap: 6, marginTop: 14 }}>
          <div>
            <strong>Due:</strong>{" "}
            {assignment.dueAt
              ? new Date(assignment.dueAt).toLocaleString()
              : "None"}
          </div>
          <div>
            <strong>Points:</strong> {assignment.points ?? "—"}
          </div>
          <div>
            <strong>Status:</strong> {status}
          </div>
          {submission?.grade != null ? (
            <div>
              <strong>Grade:</strong> {submission.grade}
            </div>
          ) : null}
        </div>

        <hr style={{ margin: "16px 0" }} />

        <h2 style={{ margin: 0 }}>Your Submission</h2>

        {subLoading ? <p>Loading your submission…</p> : null}
        {subError ? <p>{subError}</p> : null}

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 10, marginTop: 10 }}
        >
          <label className="label">
            Paste link or text
            <textarea
              className="input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Paste a link to your work or type your response…"
              required
            />
          </label>

          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Submitting…" : submission ? "Resubmit" : "Submit"}
          </button>
        </form>
        <br />
        <button className="btn-ghost" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}
