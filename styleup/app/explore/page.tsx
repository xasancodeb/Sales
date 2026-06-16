"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { STYLISTS, SPECIALTIES, SESSION_TYPES, SessionType } from "@/lib/data";

function StarRating({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <span className={`star ${small ? "text-xs" : "text-sm"}`}>
      {"★".repeat(Math.round(rating))}
      <span style={{ color: "var(--faint)" }}>{"★".repeat(5 - Math.round(rating))}</span>
      <span className="ml-1" style={{ color: "var(--dim)", fontSize: small ? 11 : 12 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function ExploreInner() {
  const params = useSearchParams();
  const [specialty, setSpecialty] = useState("All");
  const [sessionType, setSessionType] = useState<SessionType | "all">("all");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "bookings" | "price">("rating");
  const [availableToday, setAvailableToday] = useState(false);

  useEffect(() => {
    document.title = "Find a Stylist — StyleUp";
  }, []);

  useEffect(() => {
    const t = params.get("type") as SessionType | null;
    if (t) setSessionType(t);
  }, [params]);

  const filtered = useMemo(() => {
    let list = [...STYLISTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.specialty.some((sp) => sp.toLowerCase().includes(q)) ||
          s.tagline.toLowerCase().includes(q),
      );
    }

    if (specialty !== "All") {
      list = list.filter((s) =>
        s.specialty.some((sp) => sp.toLowerCase().includes(specialty.toLowerCase())),
      );
    }

    if (sessionType !== "all") {
      list = list.filter((s) => s.services.some((sv) => sv.type === sessionType));
    }

    if (maxPrice !== null) {
      list = list.filter((s) =>
        s.services.some((sv) => sv.price <= maxPrice && sv.currency === "£"),
      );
    }

    if (availableToday) {
      list = list.filter((s) => s.available_today);
    }

    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "bookings") return b.bookings - a.bookings;
      const aMin = Math.min(...a.services.map((sv) => sv.price));
      const bMin = Math.min(...b.services.map((sv) => sv.price));
      return aMin - bMin;
    });

    return list;
  }, [search, specialty, sessionType, maxPrice, sortBy, availableToday]);

  return (
    <main style={{ minHeight: "100vh" }}>
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
      {/* Header */}
      <header className="pt-6 pb-6">
        <h1 className="serif text-3xl font-bold mb-1">Find your stylist</h1>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          {STYLISTS.length} stylists · across 12 cities · ready to book
        </p>
      </header>

      {/* Search + filters */}
      <div className="card p-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or style…"
          className="w-full bg-transparent text-base focus:outline-none mb-4 pb-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        />
        <div className="flex flex-wrap gap-3">
          {/* Session type */}
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value as SessionType | "all")}
            className="text-sm rounded-lg px-3 py-2 focus:outline-none"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
            ))}
          </select>
          {/* Specialty */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="text-sm rounded-lg px-3 py-2 focus:outline-none"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm rounded-lg px-3 py-2 focus:outline-none"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            <option value="rating">Top rated</option>
            <option value="bookings">Most booked</option>
            <option value="price">Lowest price</option>
          </select>
          {/* Availability badge */}
          <button
            onClick={() => setAvailableToday(!availableToday)}
            className="text-sm rounded-lg px-3 py-2 transition-colors"
            style={{
              border: `1px solid ${availableToday ? "var(--accent)" : "var(--border)"}`,
              background: availableToday ? "var(--accent-bg)" : "transparent",
              color: availableToday ? "var(--accent)" : "var(--dim)",
              fontWeight: availableToday ? 600 : 400,
            }}
            aria-pressed={availableToday}
          >
            {availableToday ? "✓ " : ""}Available today
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: "var(--dim)" }}>
        {filtered.length} stylist{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {filtered.map((s) => {
          const minPrice = Math.min(...s.services.map((sv) => sv.price));
          const minCurrency = s.services.find((sv) => sv.price === minPrice)?.currency ?? "";
          return (
            <Link
              key={s.id}
              href={`/stylist/${s.id}`}
              className="card block p-5 hover:shadow-md transition-shadow"
            >
              {/* Avatar + availability */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="rounded-2xl h-16 w-16 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})` }}
                >
                  {s.name[0]}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {s.available_today && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "#E8F5E9", color: "#2D7A4F" }}>
                      Available today
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--faint)" }}>
                    Replies {s.response_time}
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="font-semibold text-base">{s.flag} {s.name}</p>
              <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>{s.city} · {s.specialty[0]}</p>
              <p className="text-xs mb-2 italic" style={{ color: "var(--faint)" }}>&ldquo;{s.tagline}&rdquo;</p>
              <StarRating rating={s.rating} small />

              {/* Palette preview */}
              <div className="flex gap-1.5 mt-3 mb-3">
                {s.portfolio[0]?.colors.slice(0, 5).map((c) => (
                  <div
                    key={c}
                    className="rounded-full"
                    style={{ width: 18, height: 18, background: c, border: "1px solid rgba(0,0,0,0.06)" }}
                  />
                ))}
              </div>

              {/* Price + sessions */}
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-sm font-semibold">
                  From {minCurrency}{minPrice.toLocaleString()}
                  <span className="font-normal" style={{ color: "var(--faint)" }}> / session</span>
                </p>
                <span className="text-xs" style={{ color: "var(--accent)" }}>
                  {s.bookings.toLocaleString()} sessions →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2">No stylists match your filters</p>
          <p className="text-sm mb-4" style={{ color: "var(--dim)" }}>Try broadening your search or changing the session type</p>
          <button
            onClick={() => { setSearch(""); setSpecialty("All"); setSessionType("all"); setAvailableToday(false); }}
            className="btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
      </div>
    </main>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<main className="min-h-screen max-w-5xl mx-auto px-6 pt-10" />}>
      <ExploreInner />
    </Suspense>
  );
}
