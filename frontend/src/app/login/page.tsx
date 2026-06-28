"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@flutter.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token, user } = data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/admin");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed. Check your credentials.");
      } else {
        setError("Login failed. Check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md bg-surface-container border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="font-headline-md text-headline-md text-primary">
            Admin Console
          </h1>
          <p className="font-code-sm text-code-sm text-on-surface-variant mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-container/20 border border-error/30 rounded-lg px-4 py-3">
              <p className="font-code-sm text-code-sm text-error">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface-variant">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-body-base text-body-base text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface-variant">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-body-base text-body-base text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-container text-on-primary-container rounded-xl font-code-sm text-code-sm font-bold hover:opacity-90 transition-opacity inner-glow disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
