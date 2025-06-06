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
      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="flex flex-col gap-4 w-full md:max-w-3/4">
        {videos.length === 0 && !loading && !error && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">
            No videos available at the moment.
          </div>
        )}
        {videos.map(video => (
          <div key={video.id} className="relative h-auto bg-white rounded-xl shadow p-4 flex flex-col">
            <a href={"/player/" + video.id} className="relative w-full aspect-video bg-gray-200 rounded-lg mb-2">
              <img
                src={video.thumbnail}
                alt=""
                className="w-full h-full object-cover rounded-lg border-none"
              />
              <div className="w-full h-full flex flex-col justify-center absolute text-8xl top-0 left-0 text-center text-black z-40"> 
                <span>
                ⏵
                </span>
              </div>
            </a>
            <div className="font-semibold text-lg text-indigo-700 mb-2">{video.name}</div>
            <div className="text-gray-600 mb-1 h-10 overflow-hidden">
              {video.description}
            </div>
            <div className="text-xs text-gray-500 flex flex-row gap-1 bg-white absolute bottom-2 left-2">
              <span>
                Subscription: <span className="font-semibold">{video.subscription}</span>
              </span>
              <span>|</span>
              <span>
                Author: <span className="font-semibold">{video.author}</span>
              </span>
              <span>|</span>
              <span>
                Created at: <span className="font-semibold">{new Date(video.created_at).toLocaleString()}</span>
              </span>
            </div>
          </div>
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
