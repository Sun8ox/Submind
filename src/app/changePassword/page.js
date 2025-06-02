"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !newPasswordAgain) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== newPasswordAgain) {
      setError("New passwords do not match.");
      return;
    }

    const response = await fetch("/api/auth/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await response.json();

    if (result.success) {
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordAgain("");
    } else {
      setError(result.message || "Password change failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Change Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            placeholder="Repeat New Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={newPasswordAgain}
            onChange={e => setNewPasswordAgain(e.target.value)}
            autoComplete="new-password"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}