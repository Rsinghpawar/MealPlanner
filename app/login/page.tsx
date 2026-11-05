"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-page">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink">
            {"\u{1F957}"} Meal Planner
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Mon–Sat × 2 Weeks · For 3 people
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-6 space-y-4"
        >
          <h2 className="text-[15px] font-bold text-center">
            {isSignUp ? "Create account" : "Sign in"}
          </h2>

          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[13px] rounded-lg px-3 py-2 border border-line bg-field text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-[13px] rounded-lg px-3 py-2 border border-line bg-field text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-forest text-white font-semibold text-[14px] hover:bg-forest/90 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </button>

          <p className="text-[12px] text-center text-ink-muted">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-accent font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>

        <p className="text-center mt-4">
          <Link
            href="/"
            className="text-[12px] text-ink-muted hover:text-accent hover:underline"
          >
            {"←"} Back to meal plan
          </Link>
        </p>
      </div>
    </div>
  );
}
