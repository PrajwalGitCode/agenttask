// src/components/AddAgent.jsx
import React, { useState } from "react";
import axios from "axios";
import { addAgent } from "../api";
export default function AddAgent({ token }) {
  const [agentData, setAgentData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      await addAgent(agentData);
      setMessage("✅ Agent added successfully!");
      setAgentData({ name: "", phone: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to add agent");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Agent</h2>

      <form onSubmit={handleAddAgent} className="space-y-3">
        <input
          type="text"
          placeholder="Agent Name"
          className="w-full border p-2 rounded"
          value={agentData.name}
          onChange={(e) =>
            setAgentData({ ...agentData, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded"
          value={agentData.phone}
          onChange={(e) =>
            setAgentData({ ...agentData, phone: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={agentData.email}
          onChange={(e) =>
            setAgentData({ ...agentData, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={agentData.password}
          onChange={(e) =>
            setAgentData({ ...agentData, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Add Agent
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
