import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-3 shadow-md flex justify-between items-center z-50">
      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate(user?.role === "admin" ? "/admin" : "/agent")}
      >
        Dashboard
      </h1>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* ✅ Admin links */}
            {user.role === "admin" && (
              <>
                <button onClick={() => handleNav("/admin/add-agent")} className="hover:underline">
                  Add Agent
                </button>
                <button onClick={() => handleNav("/admin/view-agents")} className="hover:underline">
                  View Agents
                </button>
                <button onClick={() => handleNav("/admin/upload")} className="hover:underline">
                  Add Sheet
                </button>
                <button onClick={() => handleNav("/admin/view-sheets")} className="hover:underline">
                  View Sheet
                </button>
              </>
            )}

            {/* ✅ Agent links */}
            {user.role === "agent" && (
              <button onClick={() => handleNav("/agent/view-sheet")} className="hover:underline">
                View Sheet
              </button>
            )}

            {/* ✅ Logout */}
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
