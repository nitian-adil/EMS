import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useContext(AuthContext);

  if (!auth) return <Navigate to="/login" />;

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
