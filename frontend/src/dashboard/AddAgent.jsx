// src/components/AddAgent.jsx
import React, { useState } from "react";
import { addAgent } from "../api";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function AddAgent({ token }) {
  const [agentData, setAgentData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addAgent(agentData);
      setMessage("success: Agent added successfully!");
      setAgentData({ name: "", phone: "", email: "", password: "" });
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage("error: Agent already exists with this email or phone number");
      } else {
        setMessage("error: " + (err.response?.data?.message || "Failed to add agent"));
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    agentData.name &&
    agentData.phone.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentData.email) &&
    agentData.password.length >= 6;

  return (
    <div className="flex items-center justify-center bg-gray-50 p-6">
      {/* Left Side: Tips */}
      <div className="hidden lg:flex flex-col w-1/3 bg-blue-50 rounded-2xl p-8 mr-6 h-full justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Agent</h2>
        <p className="text-gray-500 mb-6">Create a new agent account for lead management</p>
        <div className="bg-blue-100 p-4 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Tips:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Ensure all fields are filled correctly</li>
            <li>• Phone number must be exactly 10 digits</li>
            <li>• Use a strong, secure password</li>
            <li>• Verify email format</li>
            <li>• Agent will receive login credentials via email</li>
          </ul>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full lg:w-2/3 max-w-lg h-full overflow-y-auto">
        <form onSubmit={handleAddAgent} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter agent's full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={agentData.name}
              onChange={(e) =>
                setAgentData({ ...agentData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={agentData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 10) {
                  setAgentData({ ...agentData, phone: val });
                }
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Phone must be 10 digits</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={agentData.email}
              onChange={(e) =>
                setAgentData({ ...agentData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                value={agentData.password}
                onChange={(e) =>
                  setAgentData({ ...agentData, password: e.target.value })
                }
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              !isFormValid || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding Agent...
              </div>
            ) : (
              "Add Agent"
            )}
          </button>
        </form>

        {/* Message Alert */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-xl border ${
              message.startsWith("success:")
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  message.startsWith("success:") ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {message.startsWith("success:") ? "✓" : "!"}
              </div>
              <span className="text-sm font-medium">
                {message.replace("success:", "").replace("error:", "")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
