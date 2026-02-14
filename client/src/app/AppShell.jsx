import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer.jsx";
import Header from "../components/layout/Header.jsx";
import "../styles/app.css";

export default function AppShell() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
