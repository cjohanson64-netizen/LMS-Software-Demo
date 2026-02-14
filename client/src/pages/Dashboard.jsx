import React from "react";
import { Navigate } from "react-router-dom";
import { getRole, isAuthed } from "../state/authStore.js";

export default function Dashboard() {
  if (!isAuthed()) return <Navigate to="/" replace />;

  const role = getRole();

  if (role === "TEACHER") return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
}
