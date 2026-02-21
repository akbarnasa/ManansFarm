import React from "react";
import { Navigate } from "react-router-dom";
import { UserData } from "@/context/UserContext";

const AdminProtect = ({ children }) => {
  const { user, isAuth, loading } = UserData();

  if (loading) return null;

  if (!isAuth || user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtect;
