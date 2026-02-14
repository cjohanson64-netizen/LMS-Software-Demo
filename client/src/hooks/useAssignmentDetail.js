
import { useEffect, useState } from "react";
import { fetchAssignmentDetail } from "../services/assignmentsApi.js";

export function useAssignmentDetail(assignmentId) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) {
      setLoading(false);
      setError("Missing assignmentId.");
      return;
    }

    async function loadAssignment() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAssignmentDetail(assignmentId);
        setAssignment(data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load assignment."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssignment();
  }, [assignmentId]);

  return { assignment, loading, error };
}
