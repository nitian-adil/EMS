import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axiosInstance";
import "./sytles/Register.css"; // Import the new CSS

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register",form);
      
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <form onSubmit={submit} className="register-box animate-fade-in-up">
        <h2>Create Account 1</h2>

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Register</button>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
