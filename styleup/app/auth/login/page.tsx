"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const googleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          No account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up</Link>
        </p>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="serif text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-sm" style={{ color: "var(--dim)" }}>Sign in to manage your bookings</p>
          </div>

          <form onSubmit={submit} className="card p-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={googleSignIn}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-shadow hover:shadow-md"
              style={{ border: "1px solid var(--border)" }}
            >
              <span>🔵</span> Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--faint)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: "#e53e3e" }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-accent mt-1">
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
              <Link href="/auth/reset" style={{ color: "var(--accent)" }}>Forgot password?</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
