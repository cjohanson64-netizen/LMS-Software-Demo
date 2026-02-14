import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container">
      <h1>404</h1>
      <p>That page doesn’t exist.</p>
      <Link to="/">Go home</Link>
    </section>
  );
}
