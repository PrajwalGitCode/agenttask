import React, { useState, useEffect, useCallback } from "react";
import { getAgents, updateAgent, deleteAgent } from "../api";
import { Edit2, Trash2, Check, X, Search } from "lucide-react";

export default function ViewAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const showMessage = (text, duration = 3000) => {
    setMessage(text);
    setTimeout(() => setMessage(""), duration);
  };

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAgents();
      setAgents(res.data.agents || []);
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to fetch agents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleDeleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a._id !== id));
      showMessage("🗑️ Agent deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to delete agent.");
    }
  };

  const startEditing = (agent) => {
    setEditingId(agent._id);
    setEditData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || "",
      password: "" // For password editing
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    try {
      const payload = { ...editData };
      // Remove password field if empty to avoid overwriting
      if (!payload.password) delete payload.password;

      const res = await updateAgent(id, payload);
      setAgents((prev) => prev.map((a) => (a._id === id ? res.data.agent : a)));
      showMessage("✅ Agent updated successfully!");
      cancelEditing();
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to update agent.");
    }
  };

  // Filter agents based on search input
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agent.phone || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Agents</h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-yellow-100 border border-yellow-300 text-center">
          {message}
        </div>
      )}

      {/* Search input */}
      <div className="mb-4 flex items-center gap-2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Password</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Loading...</td>
              </tr>
            ) : filteredAgents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">No agents found.</td>
              </tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {editingId === agent._id ? (
                      <input
                        type="text"
                        className="w-full border p-1 rounded"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      agent.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === agent._id ? (
                      <input
                        type="email"
                        className="w-full border p-1 rounded"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      agent.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === agent._id ? (
                      <input
                        type="text"
                        maxLength={10}
                        className="w-full border p-1 rounded"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value.replace(/\D/g, '') })
                        }
                      />
                    ) : (
                      agent.phone || "-"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === agent._id ? (
                      <input
                        type="password"
                        className="w-full border p-1 rounded"
                        placeholder="Enter new password"
                        value={editData.password || ""}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      />
                    ) : (
                      "••••••••"
                    )}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    {editingId === agent._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(agent._id)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(agent)}
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
