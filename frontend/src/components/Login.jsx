import React, { useState } from "react";
import { login, setAuthToken } from "../api";
import { AlertCircle } from "lucide-react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || "⚠️ Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="relative w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>

        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-wide">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to access your dashboard
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded mb-4 animate-fadeIn">
            <AlertCircle size={20} /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm bg-white placeholder-gray-400 text-gray-900 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm bg-white placeholder-gray-400 text-gray-900 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              } shadow-lg`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
