import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <details className="footer-inner">
        <summary>App created by Carl Biggers-Johanson.</summary>

        <p className="footer-muted">Planned features include:</p>
        <ul className="footer-muted">
          <li>Real-time grading workflows</li>
          <li>Role-based dashboards</li>
          <li>Analytics-driven insights</li>
          <li>Expanded course authoring tools</li>
        </ul>

        <p className="footer-muted">
          This project is designed for iterative delivery and continuous
          improvement.
        </p>
      </details>
    </footer>
  );
}
