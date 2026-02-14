
import { apiClient } from "./apiClient.js";

export async function fetchAssignmentDetail(assignmentId) {
  if (!assignmentId) throw new Error("Missing assignmentId");

  const res = await apiClient.get(`/assignments/${assignmentId}`);

  return res.data.assignment;
}
