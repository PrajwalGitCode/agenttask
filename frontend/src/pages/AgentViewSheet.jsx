import React, { useEffect, useState } from "react";
import { getMySheet } from "../api"; // centralized api.js

export default function AgentViewSheet({ user }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMySheets = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await getMySheet();
        setSheets(res?.data?.sheet ? [res.data.sheet] : []);
      } catch (err) {
        console.error("Failed to fetch sheets:", err);
        setMessage("❌ Failed to fetch your sheets.");
      } finally {
        setLoading(false);
      }
    };

    fetchMySheets();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading your sheets...</p>;

  if (message)
    return <p className="text-center mt-8 text-red-600">{message}</p>;

  if (!sheets?.length)
    return <p className="text-center mt-8 text-gray-500">No sheets assigned yet.</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white mt-10 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        📄 My Assigned Sheets
      </h2>

      {sheets.map((sheet, i) => {
        const totalItems = sheet?.data?.length || 0;
        return (
          <div key={sheet._id || i} className="border rounded-lg mb-6 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-blue-700">Assigned Sheet #{i + 1}</p>
              <p className="text-sm text-gray-500">
                Uploaded: {sheet?.createdAt ? new Date(sheet.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>

            <p className="text-gray-500 text-sm mb-2">
              Total items assigned: {totalItems}
            </p>

            {totalItems > 0 ? (
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
                  {sheet.data?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{item.firstName || "-"}</td>
                      <td className="border p-2">{item.phone || "-"}</td>
                      <td className="border p-2">{item.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No items in this sheet yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
