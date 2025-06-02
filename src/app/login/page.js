"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailOrUsername || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const isEmail = emailOrUsername.includes("@");
    const dataToSend = { email: isEmail ? emailOrUsername : "", username: isEmail ? "" : emailOrUsername, password };

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if(result.success) {
      
      setEmailOrUsername("");
      setPassword("");
      setSuccess("Login successful!");

      router.push("/");
    } else {
        setError(result.message || "Login failed. Please try again.");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Sign in to Submind</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={emailOrUsername}
            onChange={e => setEmailOrUsername(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <a href="/register" className="text-indigo-700 hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
}