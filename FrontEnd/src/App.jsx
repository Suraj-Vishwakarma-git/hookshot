import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getToken, setToken, authApi } from "./api/api.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Endpoints from "./pages/Endpoints.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) { setChecking(false); return; }
    authApi.me().then(({ user: current }) => setUser(current)).catch(() => { setToken(null); setUser(null); }).finally(() => setChecking(false));
  }, []);
  const onAuthenticated = (result) => { setToken(result.token); setUser(result.user || null); navigate("/", { replace: true }); };
  const logout = () => { setToken(null); setUser(null); navigate("/login", { replace: true }); };
  if (checking) return <div className="boot-screen"><div className="brand-mark">H</div><span>Connecting to Hookshot…</span></div>;
  return <Routes>
    <Route path="/login" element={getToken() ? <Navigate to="/" replace /> : <Login onAuthenticated={onAuthenticated} />} />
    <Route path="/signup" element={getToken() ? <Navigate to="/" replace /> : <Signup onAuthenticated={onAuthenticated} />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout user={user} onLogout={logout} />}>
        <Route index element={<Dashboard user={user} />} />
        <Route path="endpoints" element={<Endpoints />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to={getToken() ? "/" : "/login"} replace />} />
  </Routes>;
}
