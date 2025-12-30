import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
  const token = localStorage.getItem("adminToken");

  // Not logged in as admin
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
