"use client";

import { useState } from "react";

export default function CreatorUploadPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [subscription, setSubscription] = useState("Basic");
  const [publicity, setPublicity] = useState("Public");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const validTypes = ["video/mp4", "video/webm", "video/ogg"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !file) {
      setError("Please provide a video name and select a file.");
      return;
    }
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only mp4, webm, and ogg are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      setError("File is too large. Max size is 1GB.");
      return;
    }

    setUploading(true);

    // Step 1: Get presigned URL from API
    const res = await fetch("/api/videos/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        fileSize: file.size,
        contentType: file.type,
        subscription,
        publicity,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Failed to get upload URL.");
      setUploading(false);
      return;
    }

    // Step 2: Upload file to presigned URL
    const uploadRes = await fetch(data.presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      setError("Failed to upload video file.");
      setUploading(false);
      return;
    }

    setSuccess("Video uploaded successfully!");
    setName("");
    setDescription("");
    setFile(null);
    setSubscription("Basic");
    setPublicity("Public");
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Upload a Video</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Video Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={100}
            required
          />
          <textarea
            placeholder="Description (optional)"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
          />
          <select
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={subscription}
            onChange={e => setSubscription(e.target.value)}
          >
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Free">Free</option>
          </select>
          <select
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={publicity}
            onChange={e => setPublicity(e.target.value)}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
          <input
            type="file"
            accept={validTypes.join(",")}
            className="p-4 bg-gray-200 rounded-lg border border-gray-300 focus:outline-none focus:ring-1"
            onChange={e => setFile(e.target.files[0])}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}