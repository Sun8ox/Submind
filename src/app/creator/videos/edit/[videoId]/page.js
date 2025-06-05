"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditVideoPage({ params }) {
  const { videoId } = use(params);
  const [form, setForm] = useState({
    name: "",
    description: "",
    subscription: "",
    publicity: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Fetch video info on mount
  useEffect(() => {
    setLoading(true);
    fetch(`/api/videos/get/${videoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.video) {
          setForm({
            name: data.video.name || "",
            description: data.video.description || "",
            subscription: data.video.subscription || "",
            publicity: data.video.publicity || ""
          });
          setError("");
        } else {
          setError(data.message || "Failed to load video.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load video.");
        setLoading(false);
      });
  }, [videoId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch(`/api/videos/edit/${videoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Video updated successfully!");
      setError("");
      
      setTimeout(() => {
        router.push("/creator/videos/");
      }, 500);
    } else {
      setError(data.message || "Failed to update video.");
      setSuccess("");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-indigo-800 mb-6">Edit Video</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Video Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            rows={3}
          />
          <select
            name="subscription"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.subscription}
            onChange={handleChange}
            required
          >
            <option value="">Select Subscription</option>
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
          </select>
          <select
            name="publicity"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.publicity}
            onChange={handleChange}
            required
          >
            <option value="">Select Publicity</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}