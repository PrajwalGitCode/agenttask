import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ViewAgents({ token }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentData, setAgentData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Unified message helper
  const showMessage = (text, duration = 3000) => {
    setMessage(text);
    setTimeout(() => setMessage(""), duration);
  };

  // ✅ Fast initial load (shows instantly)
  const fetchAgents = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/admin/agents", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      setAgents(res.data.agents || []);
    } catch (err) {
      console.error("Error fetching agents:", err);
      showMessage("❌ Failed to fetch agents. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Run once on mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ✅ Handle edit
  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setAgentData({
      name: agent.name,
      phone: agent.phone || "",
      email: agent.email,
      password: "",
    });
  };

  // ✅ Handle update
  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...agentData };
      if (!agentData.password.trim()) delete payload.password;

      const res = await axios.put(
        `http://localhost:5000/api/admin/agents/${editingAgent._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAgents((prev) =>
        prev.map((a) => (a._id === editingAgent._id ? res.data.agent : a))
      );

      showMessage("✅ Agent updated successfully!");
      setEditingAgent(null);
      setAgentData({ name: "", phone: "", email: "", password: "" });
    } catch (err) {
      console.error("Update failed:", err);
      showMessage("❌ Failed to update agent.");
    }
  };

  // ✅ Handle delete
  const handleDeleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents((prev) => prev.filter((a) => a._id !== id));
      showMessage("🗑️ Agent deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showMessage("❌ Failed to delete agent.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">👥 Agents List</h2>

      {/* ✅ Header bar */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Total Agents: <b>{agents.length}</b>
        </p>
        <button
          onClick={fetchAgents}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-3 py-1 rounded transition`}
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* ✅ Message */}
      {message && (
        <p className="text-center text-sm text-gray-700 mb-4">{message}</p>
      )}

      {/* ✅ Loading shimmer */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No agents found.</p>
      ) : (
        <ul className="space-y-2">
          {agents.map((a) => (
            <li
              key={a._id}
              className="border p-4 rounded flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{a.name}</p>
                <p className="text-gray-600 text-sm">{a.email}</p>
                {a.phone && (
                  <p className="text-gray-500 text-xs">📞 {a.phone}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAgent(a)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAgent(a._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Edit Form */}
      {editingAgent && (
        <form
          onSubmit={handleUpdateAgent}
          className="mt-8 p-4 border rounded-lg bg-gray-50 space-y-3"
        >
          <h3 className="font-semibold text-lg text-gray-700 mb-2">
            ✏️ Editing {editingAgent.name}
          </h3>

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={agentData.name}
            onChange={(e) =>
              setAgentData({ ...agentData, name: e.target.value })
            }
            required
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
            required
          />
          <input
            type="password"
            placeholder="New Password (leave blank to keep same)"
            className="w-full border p-2 rounded"
            value={agentData.password}
            onChange={(e) =>
              setAgentData({ ...agentData, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditingAgent(null)}
            className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mt-2"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
