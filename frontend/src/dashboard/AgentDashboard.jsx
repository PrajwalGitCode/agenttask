import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AgentDashboard({ user }) {
  const [assignedSheets, setAssignedSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/sheets/mysheet", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Ensure we always store an array
        const data = Array.isArray(res.data) ? res.data : res.data.sheets || [];
        setAssignedSheets(data);
      } catch (err) {
        console.error("Error fetching agent data:", err);
        setAssignedSheets([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Welcome, {user?.name}
      </h2>

      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          You have{" "}
          <span className="font-semibold text-blue-600">
            {assignedSheets.length}
          </span>{" "}
          assigned {assignedSheets.length === 1 ? "task" : "tasks"}.
        </p>
      </div>
    </div>
  );
}
