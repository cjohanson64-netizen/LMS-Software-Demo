import { useEffect, useState } from "react";
import { fetchCourseDetail } from "../services/coursesApi.js";

export function useCourseDetail(courseId) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadCourse() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchCourseDetail(courseId);
      setCourse(data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load course."
      );
    } finally {
      setLoading(false);
    }
  }

  if (courseId) {
    loadCourse();
  }
}, [courseId]);


  return {
    course,
    loading,
    error
  };
}
