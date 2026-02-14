import React from "react";
import { Navigate } from "react-router-dom";
import { getRole, isAuthed } from "../../state/authStore.js";

export default function RoleGuard({ allow = [], children }) {
  if (!isAuthed()) return <Navigate to="/" replace />;

  const role = getRole();
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
