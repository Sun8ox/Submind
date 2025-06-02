"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password || !passwordAgain) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== passwordAgain) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, passwordAgain }),
    });

    const result = await response.json();

    if (result.success) {
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordAgain("");
      setError("");
      setSuccess("Registration successful! You can now log in.");

      router.push('/verify'); // Redirect to login page after successful registration

    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Create your Submind account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            placeholder="Repeat Password"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={passwordAgain}
            onChange={e => setPasswordAgain(e.target.value)}
            autoComplete="new-password"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg p-3 transition-colors"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Already have an account? <a href="/login" className="text-indigo-700 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
}