

import { Link } from "react-router-dom";
import "../pages/sytles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* COMPANY LOGO */}
      <div className="logo">
        <Link to="/" className="logo-text">WorkNest</Link>
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      {/* AUTH BUTTONS */}
      <div className="auth-buttons">
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/register" className="btn-register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
