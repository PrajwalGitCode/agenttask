// src/pages/ViewAllSheets.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewAllSheets({ user }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sheets/allsheet", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSheets(res.data.sheets);
      } catch (err) {
        setMessage("❌ Failed to fetch sheet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [user.token]);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading sheets...</p>;

  if (message)
    return <p className="text-center mt-8 text-red-600">{message}</p>;

  if (!sheets.length)
    return (
      <p className="text-center mt-8 text-gray-500">No sheets found yet.</p>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white mt-10 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Distributed Sheets Overview
      </h2>

      {sheets.map((sheet, i) => (
        <div
          key={sheet._id || i}
          className="border rounded-lg mb-6 p-4 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">
              Assigned to:{" "}
              <span className="text-blue-700">{sheet.agentId?.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              Uploaded: {new Date(sheet.createdAt).toLocaleString()}
            </p>
          </div>

          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sheet.data.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{item.firstName}</td>
                  <td className="border p-2">{item.phone}</td>
                  <td className="border p-2">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
