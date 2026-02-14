import { useEffect, useState } from "react";
import { fetchMySubmission, upsertMySubmission } from "../services/submissionsApi.js";

export function useMySubmission(assignmentId) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) {
      setLoading(false);
      setError("Missing assignmentId.");
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMySubmission(assignmentId);
        setSubmission(data);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message || "Failed to load submission.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [assignmentId]);

  async function save(content) {
    try {
      setSaving(true);
      setError("");
      const updated = await upsertMySubmission(assignmentId, content);
      setSubmission(updated);
      return updated;
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to submit.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  return { submission, loading, saving, error, save };
}
