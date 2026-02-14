import { apiClient } from "./apiClient.js";

export async function fetchMySubmission(assignmentId) {
  if (!assignmentId) throw new Error("Missing assignmentId");
  const res = await apiClient.get(`/assignments/${assignmentId}/my-submission`);
  return res.data.submission;
}

export async function upsertMySubmission(assignmentId, content) {
  if (!assignmentId) throw new Error("Missing assignmentId");
  const res = await apiClient.post(`/assignments/${assignmentId}/submissions`, { content });
  return res.data.submission;
}
