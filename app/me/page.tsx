"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LifetimeStats, Profile, dayNumber, lifetimeStats, loadProfile, loadUserPost,
} from "@/lib/one";

export default function Me() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<LifetimeStats | null>(null);
  const [postedToday, setPostedToday] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/welcome");
      return;
    }
    const d = dayNumber();
    setProfile(p);
    setStats(lifetimeStats(d, p));
    setPostedToday(!!loadUserPost(d));
  }, [router]);

  if (!profile || !stats) return <main className="min-h-screen" />;

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 pb-20">
      <header className="pt-12 pb-6 text-center">
        <Link href="/" className="font-serif text-2xl font-black tracking-tight block mb-6">
          ONE
        </Link>
        <p className="font-serif text-3xl font-bold mb-1">
          {profile.flag} {profile.name}
        </p>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          {profile.country} · on the page since {stats.joinedDate}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-2xl px-5 py-4 text-center" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <p className="font-serif text-3xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
            {stats.readers.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>people have read your voice</p>
        </div>
        <div className="rounded-2xl px-5 py-4 text-center" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <p className="font-serif text-3xl font-bold tabular-nums" style={{ color: "var(--accent)" }}>
            {stats.countries}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>countries your words reached</p>
        </div>
        <div className="rounded-2xl px-5 py-4 text-center" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <p className="font-serif text-3xl font-bold tabular-nums" style={{ color: "var(--gold)" }}>
            {stats.streak}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>
            day streak — don&apos;t break the chain
          </p>
        </div>
        <div className="rounded-2xl px-5 py-4 text-center" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <p className="font-serif text-3xl font-bold tabular-nums">{stats.posts}</p>
          <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>voices you&apos;ve added</p>
        </div>
      </div>

      {!postedToday && (
        <Link
          href="/post"
          className="block w-full py-3.5 rounded-2xl text-base font-semibold text-center mb-8"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          You haven&apos;t spoken today — add your voice
        </Link>
      )}

      <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
        these numbers only ever go up ·{" "}
        <Link href="/" style={{ color: "var(--accent)" }}>today&apos;s page →</Link>
      </p>
    </main>
  );
}
