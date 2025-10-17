import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMySheet } from "../api";

export default function AgentDashboard({ user }) {
  const [assignedSheets, setAssignedSheets] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const res = await getMySheet();
        const data = res.data.sheet ? [res.data.sheet] : [];
        setAssignedSheets(data);
      } catch (err) {
        console.error("Error fetching agent data:", err);
        setAssignedSheets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading...</p>;

  // Calculate total assigned items across all sheets
  const totalItems = assignedSheets.reduce(
    (acc, sheet) => acc + (sheet.data ? sheet.data.length : 0),
    0
  );

  const handleNavigateSheets = () => {
    navigate("/agent/view-sheet");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Welcome, {user?.name}
      </h2>

      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          You have{" "}
          <span className="font-semibold text-blue-600">{totalItems}</span>{" "}
          assigned {totalItems === 1 ? "item" : "items"}
        </p>
      </div>
      <div className="text-center">
        <button
          onClick={handleNavigateSheets}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Sheets
        </button>
      </div>
    </div>
  );
}
