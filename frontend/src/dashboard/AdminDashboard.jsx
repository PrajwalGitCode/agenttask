import React from "react";
import { Routes, Route } from "react-router-dom";
import AddAgent from "./AddAgent";
import ViewAgents from "./ViewAgents";

export default function AdminDashboard({ user, onLogout }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Welcome, Admin {user?.name}
      </h1>

      <Routes>
        <Route path="/" element={<div>Select an action from the navbar.</div>} />
        <Route path="add-agent" element={<AddAgent token={user?.token} />} />
        <Route path="view-agents" element={<ViewAgents token={user?.token} />} />
      </Routes>
    </div>
  );
}
