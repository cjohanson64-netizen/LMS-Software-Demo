import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCourseDetail } from "../../hooks/useCourseDetail.js";
import AssignmentList from "../../components/assignments/AssignmentList.jsx";

export default function CourseDetailPage() {
  const nav = useNavigate()
  const { courseId } = useParams();
  const { course, loading, error } = useCourseDetail(courseId);

  function handleOpenAssignment(assignmentId) {
    nav(`/assignments/${assignmentId}`);
  }

  function handleBack() {
    nav(-1);
  }

  if (loading) {
      return <p>Loading course data. Please wait...</p>;
    }
  
    if (error) {
  
      return (
        <div>
          <p>{error}</p>
        </div>
      );
    }
  
    return (
      <div className="container">
        <h1>Course Details</h1>
  
        <AssignmentList
          assignments={course.assignments}
          onOpenAssignment={handleOpenAssignment}
        />
        <br />
        <button className="btn" onClick={handleBack}>⇦ Back</button>
      </div>
    );
}
