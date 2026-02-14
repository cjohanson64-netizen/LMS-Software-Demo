import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "../../state/authStore.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthed()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
