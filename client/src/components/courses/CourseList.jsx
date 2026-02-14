import React from "react";
import CourseCard from "./CourseCard.jsx";

export default function CourseList({ courses = [], onOpenCourse }) {
  if (!courses || courses.length === 0) {
    return <p>No courses yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} onOpen={onOpenCourse} />
      ))}
    </div>
  );
}
