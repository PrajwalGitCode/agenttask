import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Dashboard */}
        <h1
          className="font-bold text-xl cursor-pointer hover:text-blue-200 transition-colors duration-200"
          onClick={() => navigate(user?.role === "admin" ? "/admin" : "/agent")}
        >
          Dashboard
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {/* Admin Links */}
              {user.role === "admin" && (
                <>
                  <button
                    onClick={() => handleNav("/admin/add-agent")}
                    className="hover:underline hover:text-blue-200 transition-all duration-200 text-sm font-medium"
                  >
                    Add Agent
                  </button>
                  <button
                    onClick={() => handleNav("/admin/view-agents")}
                    className="hover:underline hover:text-blue-200 transition-all duration-200 text-sm font-medium"
                  >
                    View Agents
                  </button>
                  <button
                    onClick={() => handleNav("/admin/upload")}
                    className="hover:underline hover:text-blue-200 transition-all duration-200 text-sm font-medium"
                  >
                    Add Sheet
                  </button>
                  <button
                    onClick={() => handleNav("/admin/view-sheets")}
                    className="hover:underline hover:text-blue-200 transition-all duration-200 text-sm font-medium"
                  >
                    View Sheet
                  </button>
                </>
              )}

              {/* Agent Links */}
              {user.role === "agent" && (
                <button
                  onClick={() => handleNav("/agent/view-sheet")}
                  className="hover:underline hover:text-blue-200 transition-all duration-200 text-sm font-medium"
                >
                  View Sheet
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all duration-200"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
