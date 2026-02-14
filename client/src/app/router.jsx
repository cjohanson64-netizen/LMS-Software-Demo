import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "./AppShell.jsx";

import Welcome from "../pages/Welcome.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import StudentDashboardPage from "../pages/student/StudentDashboardPage.jsx";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage.jsx";
import AssignmentDetailPage from "../pages/student/AssignmentDetailPage.jsx";
import NotFound from "../pages/NotFound.jsx";

import ProtectedRoute from "../components/guards/ProtectedRoute.jsx";
import RoleGuard from "../components/guards/RoleGuard.jsx";
import CourseDetailPage from "../pages/student/CourseDetailPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Welcome /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student",
        element: (
          <ProtectedRoute>
            <RoleGuard allow={["STUDENT"]}>
              <StudentDashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "teacher",
        element: (
          <ProtectedRoute>
            <RoleGuard allow={["TEACHER"]}>
              <TeacherDashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "courses/:courseId",
        element: (
          <ProtectedRoute>
            <RoleGuard allow={["STUDENT"]}>
              <CourseDetailPage />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "assignments/:assignmentId",
        element: (
          <ProtectedRoute>
            <RoleGuard allow={["STUDENT", "TEACHER"]}>
              <AssignmentDetailPage />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
