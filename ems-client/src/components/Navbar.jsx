import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getGreeting = () => {
    if (!user) return "Hello";

    if (user.role === "ADMIN") return "Hello Admin 👋";
    if (user.role === "HR") return "Hello HR 👋";
    return `Hello ${user.name} 👋`;
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">EMS</h2>

      <div className="navbar-right">
        <span className="navbar-greeting">{getGreeting()}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
    