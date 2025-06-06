"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/users/get/user")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setVideos(data.videos || []);
          setError("");
        } else {
          setError(data.message || "Failed to load profile.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-xl mb-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4">Your profile</h1>
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">{user.fullname || user.username}</h1>
        <div className="text-gray-600 mb-2">@{user.username}</div>
        <div className="mb-2 text-sm text-gray-500">{user.role}</div>
        <div className="mb-2">{user.bio}</div>
        <div className="mb-2 text-sm text-gray-500">Email: {user.email}</div>
  
        <div className="mb-2 text-sm text-gray-500">Verified: {user.verified ? "Yes" : "No"}</div>
        <div className="mb-2 text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      {(videos && videos.length > 0) && (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Your Videos</h2>
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-indigo-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Publicity</th>
                <th className="p-3 text-left">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} onClick={() => window.location.href = `/player/${video.id}`} className="border-t">
                  <td className="p-3">{video.name || "Untitled"}</td>
                  <td className="p-3">{video.description || "No description"}</td>
                  <td className="p-3">{video.publicity || "—"}</td>
                  <td className="p-3">{video.subscription || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}