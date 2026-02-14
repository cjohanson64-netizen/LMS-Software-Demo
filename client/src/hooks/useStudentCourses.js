import { useEffect, useState } from "react";
import { fetchMyCourses } from "../services/coursesApi.js";

export function useStudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCourses() {
      try {
          setLoading(true);
          setError("");

          const data = await fetchMyCourses();
          setCourses(data);
      } catch (err) {
        console.log("raw backend error:", err?.response?.data?.error);

          setError(
              err?.response?.data?.error ||
              err?.message ||
              "Failed to load courses."
            );
            console.log("error value:", err?.response?.data?.error);
      } finally {
          setLoading(false);
      }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function refetch() {
    loadCourses();
  }

  return { 
    courses,
    loading,
    error,
    refetch
   };
}
