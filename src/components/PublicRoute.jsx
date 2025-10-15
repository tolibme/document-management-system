import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  
  // If user is already logged in, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}