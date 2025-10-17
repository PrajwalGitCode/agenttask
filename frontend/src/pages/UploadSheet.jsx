import React, { useState } from "react";
import { uploadSheet } from "../api"; // ✅ import from api.js

export default function UploadSheet({ user }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ File selection validation (by extension)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedExtensions = ["csv", "xls", "xlsx"];
    const fileExt = selected.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      setMessage("❌ Invalid file type. Only CSV, XLS, or XLSX allowed.");
      setFile(null);
      return;
    }

    setMessage("");
    setFile(selected);
  };

  // ✅ Upload handler (using api.js)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please select a valid file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadSheet(formData); // ✅ use api.js
      setMessage(`✅ ${res.data.message}`);
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 mt-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Upload Sheet
      </h2>

      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Select File</label>
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full p-2 rounded text-white ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("❌")
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
