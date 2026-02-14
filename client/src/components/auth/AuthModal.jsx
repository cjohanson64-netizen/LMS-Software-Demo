import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../services/apiClient.js";
import { setRole, setToken } from "../../state/authStore.js";

export default function AuthModal({ open, onClose, onSuccess }) {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await apiClient.post("/auth/login", { email, password });

      const { token, user } = res.data || {};
      if (!token || !user?.role) {
        throw new Error("Login response missing token or user role.");
      }

      setToken(token);
      setRole(user.role);

      window.dispatchEvent(new Event("auth-change"));
      onSuccess?.();

      onClose?.();
      nav("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2>Sign in</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stack">
          <label className="label">
            Email
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="label">
            Password
            <div className="password-field">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={showPassword ? "password123!" : "••••••••••••"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={handleShowPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error ? <p style={{ margin: 0 }}>{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
