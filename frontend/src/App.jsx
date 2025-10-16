import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./dashboard/AdminDashboard";
import AgentDashboard from "./dashboard/AgentDashboard";
import Navbar from "./components/Navbar";
import UploadSheet from "./pages/UploadSheet";
import ViewAllSheets from "./pages/ViewAllSheets";
import AgentViewSheet from "./pages/AgentViewSheet";
import AddAgent from "./dashboard/AddAgent";
import ViewAgents from "./dashboard/ViewAgents";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load user and restore last visited route safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const lastRoute = localStorage.getItem("lastRoute");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      parsed.token = token;
      setUser(parsed);

      // Redirect only once user is set and not already on lastRoute
      if (lastRoute && lastRoute !== "/" && location.pathname === "/") {
        navigate(lastRoute, { replace: true });
      }
    }

    setIsLoading(false);
  }, []);

  // ✅ Save current route for reload persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location, user]);

  const handleLogin = (userData, token) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <div className="pt-16">
        <Routes>
          {/* Root */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === "admin" ? "/admin" : "/agent"} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Agent */}
          <Route
            path="/agent"
            element={
              user?.role === "agent" ? (
                <AgentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/agent/view-sheet"
            element={
              user?.role === "agent" ? (
                <AgentViewSheet user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/upload"
            element={
              user?.role === "admin" ? <UploadSheet user={user} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/view-sheets"
            element={
              user?.role === "admin" ? <ViewAllSheets user={user} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/add-agent"
            element={
              user?.role === "admin" ? <AddAgent token={user?.token} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/view-agents"
            element={<ViewAgents token={user?.token} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
