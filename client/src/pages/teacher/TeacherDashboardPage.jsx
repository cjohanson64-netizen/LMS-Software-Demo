import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/teacher/PageHeader";
import { QuickActionsCard } from "../../components/teacher/QuickActionsCard";
import { ThisWeekCard } from "../../components/teacher/ThisWeekCard";
import { RecentCoursesTable } from "../../components/teacher/RecentCoursesTable";
import "../../styles/teacher.css";

const demoCourses = [
  { id: "c1", title: "Intro to Rhythm (Period 2)", studentsCount: 31, updatedAtLabel: "Jan 28" },
  { id: "c2", title: "Medieval Music Appreciation", studentsCount: 28, updatedAtLabel: "Jan 30" },
  { id: "c3", title: "History of Rock 'n' Roll", studentsCount: 34, updatedAtLabel: "Jan 25" },
];

export default function TeacherDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="t-page">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Manage your courses, review student work, and track progress."
      />

      <div className="t-grid2">
        <QuickActionsCard
          onCreateCourse={() => alert("Create Course (placeholder)")}
          onViewSubmissions={() => alert("View Submissions (placeholder)")}
          onOpenGradebook={() => alert("Open Gradebook (placeholder)")}
        />
        <ThisWeekCard />
      </div>

      <RecentCoursesTable
        courses={demoCourses}
        onViewAll={() => navigate("/teacher/courses")}
        onOpenCourse={(courseId) => alert(`Open course ${courseId} (placeholder)`)}
      />
    </div>
  );
}
