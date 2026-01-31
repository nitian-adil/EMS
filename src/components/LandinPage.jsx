import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../pages/sytles/LandingPage.css";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200); // animation duration

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <h1>
          Welcome to <span>WorkNest</span>
        </h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Welcome to <span>WorkNest</span>
          </h1>
          <p>
            A smart Employee Management System to manage people, tasks,
            and productivity — all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <h2>About WorkNest</h2>
        <p className="about-text">
          WorkNest is designed to simplify workforce management with
          role-based dashboards, task tracking, and HR operations —
          all under one secure platform.
        </p>

        <div className="about-cards">
          <div className="about-card">
            <h3>👥 Employee Management</h3>
            <p>Manage employees, roles, and profiles effortlessly.</p>
          </div>
          <div className="about-card">
            <h3>📌 Task Tracking</h3>
            <p>Assign, accept, and complete tasks with clarity.</p>
          </div>
          <div className="about-card">
            <h3>🔐 Secure Access</h3>
            <p>Role-based authentication for Admin, HR, and Employees.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>Email: adilahmadshah7860@gmail.com</p>
        <p>Phone: +91 8085575767</p>
      </section>

      <footer className="footer">
        © 2026 WorkNest. All rights reserved.
      </footer>
    </>
  );
};

export default LandingPage;
