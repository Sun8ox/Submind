"use client";

import { use, useState } from "react";

export default function ReuploadPage({ params }) {
  const { videoId } = use(params);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!file) {
      setError("Please select a video file.");
      return;
    }

    setUploading(true);

    // Step 1: Get presigned URL
    const presignRes = await fetch("/api/videos/reupload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        fileSize: file.size,
        contentType: file.type,
      }),
    });
    const presignData = await presignRes.json();

    if (!presignData.success) {
      setError(presignData.message || "Failed to get upload URL.");
      setUploading(false);
      return;
    }

    // Step 2: Upload file to presigned URL
    try {
      const uploadRes = await fetch(presignData.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        setError("Failed to upload file to storage.");
        setUploading(false);
        return;
      }

      setStatus("Video reuploaded successfully!");
      setFile(null);
    } catch (err) {
      setError("Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-800 mb-6">Reupload Video</h1>
        <p className="mb-4 text-gray-700">Video ID: <span className="font-mono">{videoId}</span></p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            className="p-2"
            onChange={handleFileChange}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {status && <div className="text-green-600 text-sm">{status}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Reupload"}
          </button>
        </form>
      </div>
    </div>
  );
}