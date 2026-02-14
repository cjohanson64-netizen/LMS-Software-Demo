import React, { useEffect, useState } from "react";
import AuthModal from "../components/auth/AuthModal.jsx";
import { isAuthed } from "../state/authStore.js";

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    function syncAuth() {
      setAuthed(isAuthed());
    }
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  return (
    <section className="container">
      <h1>Welcome to the TeacherDashDemo</h1>
      <h2>An LMS in Development</h2>

      {!authed ? (
        <>
          <p>Sign in to continue.</p>

          <details>
            <summary>DEMO ACCOUNTS FOR DEV PURPOSES ONLY:</summary>

            <ul className="temp-passwords">
              <li>
                <strong>TEACHER</strong>
              </li>
              <li>email: teacher@demo.com</li>
              <li>password: Teacher123!</li>
            </ul>

            <ul className="temp-passwords">
              <li>
                <strong>STUDENT</strong>
              </li>
              <li>email: student@demo.com</li>
              <li>password: Student123!</li>
            </ul>
          </details>

          <br />

          <button className="btn" onClick={() => setOpen(true)}>
            Sign in
          </button>
        </>
      ) : (
        <p>You are signed in. Use the navigation bar to sign out.</p>
      )}

      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setAuthed(true);
          setOpen(false);
          window.dispatchEvent(new Event("auth-change"));
        }}
      />
    </section>
  );
}
