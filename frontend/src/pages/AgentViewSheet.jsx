import React, { useEffect, useState } from "react";
import { getMySheet } from "../api";
import { FileText, Users, XCircle } from "lucide-react";

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
    return (
      <p className="text-center mt-8 text-gray-500 flex items-center justify-center gap-2">
        <FileText size={20} className="animate-spin text-gray-400" /> Loading your sheets...
      </p>
    );

  if (message)
    return (
      <p className="text-center mt-8 text-red-600 flex items-center justify-center gap-2">
        <XCircle size={20} /> {message}
      </p>
    );

  if (!sheets?.length)
    return (
      <p className="text-center mt-8 text-gray-400 flex items-center justify-center gap-2">
        <Users size={20} /> No sheets assigned yet.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-3">
        <FileText size={28} /> My Assigned Sheets
      </h2>

      {sheets.map((sheet, idx) => {
        const totalItems = sheet?.data?.length || 0;
        return (
          <div
            key={sheet._id || idx}
            className="border border-gray-200 rounded-xl mb-8 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <Users size={20} /> Assigned Sheet #{idx + 1}
              </p>
            </div>

            <p className="text-gray-500 mb-3">
              Total items assigned: <span className="font-medium">{totalItems}</span>
            </p>

            {totalItems > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">#</th>
                      <th className="border px-3 py-2 text-left">First Name</th>
                      <th className="border px-3 py-2 text-left">Phone</th>
                      <th className="border px-3 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sheet.data?.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="border px-3 py-2">{i + 1}</td>
                        <td className="border px-3 py-2">{item.firstName || "-"}</td>
                        <td className="border px-3 py-2">{item.phone || "-"}</td>
                        <td className="border px-3 py-2">{item.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <XCircle size={18} /> No items in this sheet yet.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
