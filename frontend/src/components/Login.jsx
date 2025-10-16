import React, { useState } from "react";
import { login, setAuthToken } from "../api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {error && <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg font-semibold transition">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
