import { useMemo, useState } from "react";
import { PageHeader } from "../../components/teacher/PageHeader";
import { CoursesToolbar } from "../../components/teacher/CoursesToolbar";
import { CourseCard } from "../../components/teacher/CourseCard";
import "../../styles/teacher.css";

const demoCourses = [
  { id: "c1", title: "Intro to Rhythm (Period 2)", studentsCount: 31, updatedAtLabel: "Jan 28" },
  { id: "c2", title: "Medieval Music Appreciation", studentsCount: 28, updatedAtLabel: "Jan 30" },
  { id: "c3", title: "History of Rock 'n' Roll", studentsCount: 34, updatedAtLabel: "Jan 25" },
];

export function TeacherCoursesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // placeholder

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return demoCourses.filter((c) => c.title.toLowerCase().includes(s));
    // filter is stub for now
  }, [search]);

  return (
    <div className="t-page">
      <PageHeader
        title="My Courses"
        subtitle="View and manage all courses you currently teach."
        rightSlot={
          <button className="t-btn" onClick={() => alert("Create Course (placeholder)")}>
            + Create Course
          </button>
        }
      />

      <CoursesToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filtered.length === 0 ? (
        <div className="t-card">
          <p className="t-muted">You don’t have any courses yet.</p>
          <p className="t-muted">Create one to start building modules and assignments.</p>
        </div>
      ) : (
        <div className="t-grid3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpen={(id) => alert(`Open course ${id} (placeholder)`)}
              onManage={(id) => alert(`Manage course ${id} (placeholder)`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
