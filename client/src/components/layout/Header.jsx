import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthed, logout, getRole } from "../../state/authStore.js";

export default function Header() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    function syncAuth() {
      setAuthed(isAuthed());
    }
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  const role = authed ? getRole?.() : null;

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" to="/">
          LMS Demo
        </Link>

        <nav className="nav">
          {authed ? (
            <>
              <Link to="/dashboard">Dashboard</Link>

              {/* Optional: role shortcuts */}
              {role === "STUDENT" ? <Link to="/student">Student</Link> : null}
              {role === "TEACHER" ? <Link to="/teacher">Teacher</Link> : null}

              <button
                className="btn-ghost"
                onClick={() => {
                  logout();
                  window.dispatchEvent(new Event("auth-change"));
                  nav("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/">Welcome</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
