import { apiClient } from "./apiClient.js";

// GET courses the current student is enrolled in
export async function fetchMyCourses() {
  return (await apiClient.get("/courses/me")).data.courses;
}

// GET a single course + its assignments
export async function fetchCourseDetail(courseId) {
  return (await apiClient.get(`/courses/${courseId}`)).data.course;
}

export async function fetchCourseAssignments(courseId) {
  return (await apiClient.get(`/courses/${courseId}/assignments`)).data.assignments;
}
