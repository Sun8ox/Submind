"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function VerifyAccountPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Please enter your verification token.");
      return;
    }

    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    const result = await response.json();

    if (result.success) {
      setSuccess("Your account has been successfully verified!");
      setToken("");
      
      router.push('/');
    } else {
      setError(result.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Verify Your Account</h1>

        <h4 className="text-center text-gray-600 mb-4">
          Please enter the verification token sent to your email to activate your account.
        </h4>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Verification Token"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
}