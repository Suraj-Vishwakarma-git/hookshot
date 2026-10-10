import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../api/api.js";
export default function ProtectedRoute() { return getToken() ? <Outlet /> : <Navigate to="/login" replace />; }
