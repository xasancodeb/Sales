"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — StyleUp";
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/explore" style={{ color: "var(--dim)" }}>Find stylists</Link>
          <Link href="/fitting" style={{ color: "var(--dim)" }}>Fitting room</Link>
          <Link href="/for-stylists" style={{ color: "var(--dim)" }}>For stylists</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Dashboard</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center py-24">
        {/* Large decorative 404 */}
        <p
          className="serif font-bold mb-4 select-none"
          style={{
            fontSize: "clamp(80px, 16vw, 160px)",
            lineHeight: 1,
            color: "var(--accent)",
            opacity: 0.18,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading */}
        <h1 className="serif font-bold mb-3" style={{ fontSize: "clamp(24px, 4vw, 40px)", marginTop: "-1rem" }}>
          Page not found
        </h1>

        {/* Friendly message */}
        <p className="text-base max-w-sm mb-2" style={{ color: "var(--dim)" }}>
          This page seems to have edited itself out of existence — a bold wardrobe choice, but not a helpful one.
        </p>
        <p className="text-sm mb-10" style={{ color: "var(--faint)" }}>
          The link may be broken, or the page may have moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary" style={{ padding: "12px 28px", fontSize: 14 }}>
            Back to home
          </Link>
          <Link href="/explore" className="btn-secondary" style={{ padding: "12px 28px", fontSize: 14 }}>
            Explore stylists
          </Link>
        </div>

        {/* Subtle divider + helpful links */}
        <div
          className="mt-14 pt-8 w-full max-w-xs"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs mb-3" style={{ color: "var(--faint)" }}>Other places to go</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/fitting" style={{ color: "var(--accent)" }}>
              Fitting room — discover your style
            </Link>
            <Link href="/quiz" style={{ color: "var(--accent)" }}>
              Style quiz
            </Link>
            <Link href="/for-stylists" style={{ color: "var(--accent)" }}>
              Join as a stylist
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
