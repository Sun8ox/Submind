"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/videos/home?page=${page}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVideos(data.videos);
          setError("");
        } else {
          setVideos([]);
          setError(data.message || "Failed to load videos.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load videos.");
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-indigo-800 mb-2">Welcome to Submind</h1>
      <h2 className="text-xl text-indigo-600 mb-8">Videos that you have access to:</h2>
      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {videos.map(video => (
          <a href={"/player/" + video.id} key={video.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <div className="font-semibold text-lg text-indigo-700 mb-2">{video.name}</div>
            <div className="text-gray-600 mb-1">{video.description}</div>
            <div className="text-xs text-gray-500">Subscription: {video.subscription}</div>
          </a>
        ))}
      </div>
      <div className="flex gap-2 mt-8">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-indigo-800 font-semibold">{page}</span>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
