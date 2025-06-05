"use client";

import { useEffect, useState } from "react";

export default function CreatorVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch videos on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/videos/list")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVideos(data.videos);
          setError("");
        } else {
          setError(data.message || "Failed to load videos.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load videos.");
        setLoading(false);
      });
  }, []);

  // Remove video handler
  const handleRemove = async (id) => {
    if (!confirm("Are you sure you want to remove this video?")) return;
    const res = await fetch(`/api/videos/remove/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setVideos(videos.filter(v => v.id !== id));
    } else {
      alert(data.message || "Failed to remove video.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Your Videos</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="w-full max-w-4xl">
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-indigo-100">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                 <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(video => (
              <tr key={video.id} className="border-t">
                <td className="p-3">
                    {video.id}
                </td>
                <td className="p-3">
                    {video.name || "Untitled Video"}
                </td>
                <td className="p-3">
                    {video.description || "No description provided."}
                </td>
                <td className="p-3 flex gap-2">
                      <a
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                        href={`/creator/videos/edit/${video.id}`}
                      >
                        Edit
                      </a>
                      <a
                        className="bg-blue-400 text-white px-3 py-1 rounded"
                        href={`/creator/videos/reupload/${video.id}`}
                      >
                        Reupload
                      </a>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleRemove(video.id)}
                      >
                        Remove
                      </button>
                </td>
              </tr>
            ))}
            {videos.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}