import React, { useState, useEffect } from "react";
import { getAllSheets } from "../api";
import { FileText, ChevronDown, ChevronUp, Users, Search } from "lucide-react";

export default function ViewAllSheets({ user }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedSheets, setExpandedSheets] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const data = await getAllSheets(user.token);
        setSheets(data.sheets || []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch sheet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSheets();
  }, [user.token]);

  const toggleSheet = (id) => {
    setExpandedSheets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter sheets based on search input
  const filteredSheets = sheets.filter((sheet) =>
    (sheet.agentId?.name || "Deleted User")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading sheets...</p>;

  if (message)
    return <p className="text-center mt-8 text-red-600">{message}</p>;

  if (!sheets.length)
    return <p className="text-center mt-8 text-gray-500">No sheets found yet.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
          <FileText size={28} /> Distributed Sheets Overview
        </h2>

        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
          <Search size={18} className="text-gray-600" />
          <input
            type="text"
            placeholder="Search by agent name..."
            className="outline-none w-64 px-1 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sheets */}
      {filteredSheets.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No sheets match your search.
        </p>
      )}

      {filteredSheets.map((sheet, i) => {
        const agentName = sheet.agentId?.name || "Deleted User";
        const totalItems = sheet.data?.length || 0;
        const isExpanded = expandedSheets[sheet._id];

        return (
          <div
            key={sheet._id || i}
            className="rounded-xl mb-4 shadow hover:shadow-md transition"
          >
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition rounded-t-xl"
              onClick={() => toggleSheet(sheet._id)}
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <p className="font-semibold">
                  Assigned to:{" "}
                  <span
                    className={agentName === "Deleted User" ? "text-red-500" : "text-blue-700"}
                    title={agentName === "Deleted User" ? "User has been deleted" : ""}
                  >
                    {agentName}
                  </span>
                </p>
                <span className="text-gray-500 text-sm ml-2">
                  ({totalItems} items)
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-x-auto p-4 bg-white border-t border-gray-200 rounded-b-xl">
                {totalItems > 0 ? (
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-gray-700 font-medium rounded-tl-lg">#</th>
                        <th className="p-2 text-left text-gray-700 font-medium">First Name</th>
                        <th className="p-2 text-left text-gray-700 font-medium">Phone</th>
                        <th className="p-2 text-left text-gray-700 font-medium rounded-tr-lg">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.data.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`${
                            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition`}
                        >
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">{item.firstName || "-"}</td>
                          <td className="p-2">{item.phone || "-"}</td>
                          <td className="p-2">{item.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">No items in this sheet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
