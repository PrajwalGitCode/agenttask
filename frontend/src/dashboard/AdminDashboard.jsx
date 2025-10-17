import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { UserPlus, Users, Upload, FileSpreadsheet, LogOut, Menu, X } from "lucide-react";
import AddAgent from "./AddAgent";
import ViewAgents from "./ViewAgents";
import UploadSheet from "../pages/UploadSheet";
import ViewAllSheets from "../pages/ViewAllSheets";
import api from "../api";

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const actions = [
    { label: "Add Agent", path: "add-agent", icon: <UserPlus size={24} />, description: "Register new sales agents" },
    { label: "View Agents", path: "view-agents", icon: <Users size={24} />, description: "Manage existing agents" },
    { label: "Upload Sheet", path: "upload", icon: <Upload size={24} />, description: "Import lead sheets" },
    { label: "View Sheets", path: "view-sheets", icon: <FileSpreadsheet size={24} />, description: "Monitor uploaded sheets" },
  ];

  const getPageTitle = () => {
    const currentAction = actions.find(action => location.pathname.includes(action.path));
    return currentAction ? currentAction.label : "Dashboard Overview";
  };

  const isOverview = location.pathname === "/admin" || location.pathname === "/admin/";

  // Dynamic stats
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeSheets: 0,
    totalRows: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use the stats endpoints added in backend: /api/stats/agents and /api/stats/sheets
        const [agentsRes, sheetsRes] = await Promise.all([
          api.get("/stats/agents"),
          api.get("/stats/sheets"),
        ]);

        const totalAgents = typeof agentsRes.data.count === "number" ? agentsRes.data.count : 0;
        const activeSheets = typeof sheetsRes.data.totalSheets === "number" ? sheetsRes.data.totalSheets : 0;
        const totalRows = typeof sheetsRes.data.totalRows === "number" ? sheetsRes.data.totalRows : 0;

        setStats({
          totalAgents,
          activeSheets,
          totalRows,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err?.response?.data || err.message || err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">LeadManager Pro</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => { navigate(`/admin/${action.path}`); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${location.pathname.includes(action.path) ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <div className={`p-2 rounded-lg ${location.pathname.includes(action.path) ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200">
              <div className="p-2 bg-gray-100 rounded-lg"><LogOut size={18} /></div>
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Overview */}
        {isOverview && (
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-blue-100 text-lg">Ready to manage your team and lead distribution today?</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {actions.map((action, index) => (
                  <div key={index} onClick={() => navigate(`/admin/${action.path}`)} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 text-blue-600 rounded-xl p-3 group-hover:bg-blue-600 group-hover:text-white transition-all">{action.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{action.label}</h3>
                        <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Agents</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalAgents}</p>
                  </div>
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg"><Users size={20} /></div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sheets</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeSheets}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><FileSpreadsheet size={20} /></div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Rows</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalRows}</p>
                  </div>
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-lg"><Upload size={20} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nested Routes */}
        {!isOverview && (
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Routes>
                  <Route path="add-agent" element={<AddAgent token={user?.token} />} />
                  <Route path="view-agents" element={<ViewAgents />} />
                  <Route path="upload" element={<UploadSheet user={user} />} />
                  <Route path="view-sheets" element={<ViewAllSheets user={user} />} />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
