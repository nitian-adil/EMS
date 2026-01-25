import { useState, useContext } from "react";
import api from "./axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./sytles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
    const res = await api.post("/auth/login", { email, password });

const authData = {
  token: res.data.token,
  role: res.data.role,
  name: res.data.name,
};

login(authData);

localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.role);
localStorage.setItem("name", res.data.name);

if (res.data.role === "ADMIN") navigate("/admin");
else if (res.data.role === "HR") navigate("/hr");
else navigate("/employee");


    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-tr from-blue-200 to-blue-400">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-box animate-fade-in-up">
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <p className="mt-4 text-sm">Don't have an account? <a href="/">Register</a></p>
        </form>
      </div>
    </div>
  );
}
