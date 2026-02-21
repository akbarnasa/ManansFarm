import { Navigate } from "react-router-dom";
import { UserData } from "@/context/UserContext";

const UserProtect = ({ children }) => {
  const { isAuth, user, loading } = UserData();

  if (loading) return null;

  if (!isAuth) return <Navigate to="/login" />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;

  return children;
};

export default UserProtect;
