import React, { useState, useRef } from "react";
import { uploadSheet } from "../api"; // ✅ API usage remains
import { UploadCloud, XCircle } from "lucide-react";

export default function UploadSheet({ user }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

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

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 mt-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Upload Sheet
      </h2>

      <form
        onSubmit={async (e) => {
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
            const res = await uploadSheet(formData);
            setMessage(`✅ ${res.data.message}`);
            clearFile();
          } catch (err) {
            setMessage(err.response?.data?.message || "❌ Upload failed.");
          } finally {
            setUploading(false);
          }
        }}
        className="flex flex-col gap-4"
      >
        {/* Custom Choose File Button */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200 select-none"
        >
          <UploadCloud size={20} />
          {file ? "Change File" : "Choose File"}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Display selected file */}
        {file && (
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
            <span className="text-gray-700 truncate">{file.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-600"
            >
              <XCircle size={20} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
            file
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Message */}
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
