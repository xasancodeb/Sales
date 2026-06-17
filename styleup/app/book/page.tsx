"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { STYLISTS, SESSION_TYPES, SessionType } from "@/lib/data";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star text-xs">
      {"★".repeat(Math.round(rating))}
      <span style={{ color: "var(--faint)" }}>{"★".repeat(5 - Math.round(rating))}</span>
      <span className="ml-1" style={{ color: "var(--dim)", fontSize: 11 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function BookPage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState<SessionType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...STYLISTS];

    if (sessionType !== "all") {
      list = list.filter((s) => s.services.some((sv) => sv.type === sessionType));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.specialty.some((sp) => sp.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [sessionType, search]);

  function goToExplore() {
    const params = new URLSearchParams();
    if (sessionType !== "all") params.set("type", sessionType);
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  }

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

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Page heading */}
        <header className="pt-8 pb-6">
          <h1 className="serif text-3xl font-bold mb-1">Book a session</h1>
          <p className="text-sm" style={{ color: "var(--dim)" }}>
            Choose a stylist below, or{" "}
            <button
              onClick={goToExplore}
              className="underline"
              style={{ color: "var(--accent)", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit" }}
            >
              browse all stylists on the explore page
            </button>
            .
          </p>
        </header>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Session type filter */}
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSessionType(t.value)}
                  className="text-sm rounded-lg px-3 py-2 transition-colors"
                  style={{
                    border: sessionType === t.value ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                    color: sessionType === t.value ? "var(--accent)" : "var(--dim)",
                    background: sessionType === t.value ? "var(--accent-bg)" : "var(--surface)",
                    fontWeight: sessionType === t.value ? 600 : 400,
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or style…"
              className="flex-1 bg-transparent text-sm focus:outline-none px-3 py-2 rounded-lg"
              style={{ border: "1px solid var(--border)", minWidth: 180 }}
            />
          </div>

          {/* Session type descriptions */}
          {sessionType !== "all" && (
            <p className="text-xs mt-3" style={{ color: "var(--faint)" }}>
              {SESSION_TYPES.find((t) => t.value === sessionType)?.desc}
            </p>
          )}
        </div>

        {/* Results count + explore link */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: "var(--dim)" }}>
            {filtered.length} stylist{filtered.length !== 1 ? "s" : ""} available
          </p>
          <button
            onClick={goToExplore}
            className="text-sm"
            style={{ color: "var(--accent)", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            Advanced filters →
          </button>
        </div>

        {/* Stylist grid */}
        {filtered.length > 0 ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {filtered.map((s) => {
              const relevantServices = sessionType !== "all"
                ? s.services.filter((sv) => sv.type === sessionType)
                : s.services;
              const minPrice = Math.min(...relevantServices.map((sv) => sv.price));
              const minCurrency = relevantServices.find((sv) => sv.price === minPrice)?.currency ?? "";

              return (
                <div key={s.id} className="card p-5 flex flex-col">
                  {/* Avatar + availability */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="rounded-2xl h-14 w-14 flex items-center justify-center text-xl font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})` }}
                    >
                      {s.name[0]}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {s.available_today && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "#E8F5E9", color: "#2D7A4F" }}
                        >
                          Available today
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--faint)" }}>
                        Replies {s.response_time}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <p className="font-semibold text-base">
                    {s.flag} {s.name}
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>
                    {s.city} · {s.specialty[0]}
                  </p>
                  <StarRating rating={s.rating} />

                  {/* Services for chosen session type */}
                  {sessionType !== "all" && (
                    <ul className="mt-3 mb-2 flex flex-col gap-1">
                      {relevantServices.map((sv) => (
                        <li key={sv.name} className="flex justify-between text-xs" style={{ color: "var(--dim)" }}>
                          <span>{sv.name}</span>
                          <span className="font-semibold" style={{ color: "var(--ink)" }}>
                            {sv.currency}{sv.price.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price + CTA */}
                  <div
                    className="flex items-center justify-between mt-auto pt-4"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <p className="text-sm font-semibold">
                      From {minCurrency}{minPrice.toLocaleString()}
                      <span className="font-normal" style={{ color: "var(--faint)" }}> / session</span>
                    </p>
                    <Link
                      href={`/stylist/${s.id}`}
                      className="btn-primary text-xs"
                      style={{ padding: "8px 16px", fontSize: 12 }}
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2">No stylists match your filters</p>
            <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
              Try a different session type or clear your search
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSearch(""); setSessionType("all"); }}
                className="btn-secondary"
              >
                Clear filters
              </button>
              <Link href="/explore" className="btn-primary">
                Browse all stylists
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
