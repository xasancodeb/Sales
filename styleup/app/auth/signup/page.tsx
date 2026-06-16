"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  const googleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (done) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card p-8 text-center max-w-sm mx-auto">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="serif text-xl font-bold mb-2">Check your email</h2>
          <p className="text-sm" style={{ color: "var(--dim)" }}>
            We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then sign in.
          </p>
          <Link href="/auth/login" className="btn-primary mt-5 block text-center">
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          Have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="serif text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-sm" style={{ color: "var(--dim)" }}>Book your first stylist in minutes</p>
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
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>YOUR NAME</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Johnson"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>EMAIL</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: "#e53e3e" }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-accent mt-1">
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
              By signing up you agree to our{" "}
              <Link href="/terms" style={{ color: "var(--accent)" }}>Terms</Link> and{" "}
              <Link href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
