import React from "react";
import { useNavigate } from "react-router-dom";
import { useStudentCourses } from "../../hooks/useStudentCourses.js";
import CourseList from "../../components/courses/CourseList.jsx";

export default function StudentDashboardPage() {
  const nav = useNavigate();

  const { courses, loading, error, refetch } = useStudentCourses();

  function handleOpenCourse(courseId) {
    nav(`/courses/${courseId}`);
  }

  function handleBack() {
    nav(-1);
  }

  if (loading) {
    return <p>Loading student course data. Please wait...</p>;
  }

  if (error) {

    return (
      <div>
        <p>{error}</p>
        <button className="btn" type="button" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Student Dashboard</h1>

      <CourseList
        courses={courses}
        onOpenCourse={handleOpenCourse}
      />
      <br />
        <button className="btn" onClick={handleBack}>⇦ Back</button>
    </div>
  );
}
