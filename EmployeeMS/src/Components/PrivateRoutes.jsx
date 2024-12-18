import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem("valid");
  const userRole = localStorage.getItem("role"); // 'admin' or 'employee'

  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to the home page if not logged in
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />; // Redirect to home if role does not match
  }

  return children;
};

export default PrivateRoutes;
