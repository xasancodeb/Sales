"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RankedPost, dayNumber, dateDisplayForDay, winnerForDay } from "@/lib/one";

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

type PageEntry = { day: number; date: string; winner: RankedPost };

export default function BookOfDays() {
  const [pages, setPages] = useState<PageEntry[]>([]);

  useEffect(() => {
    const today = dayNumber();
    const entries: PageEntry[] = [];
    for (let d = today - 1; d >= 1; d--) {
      entries.push({ day: d, date: dateDisplayForDay(d), winner: winnerForDay(d) });
    }
    setPages(entries);
  }, []);

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 pb-20">
      <header className="pt-12 pb-3 text-center">
        <Link href="/" className="font-serif text-2xl font-black tracking-tight block mb-4">
          ONE
        </Link>
        <h1 className="font-serif text-3xl font-bold mb-2">The Book of Days</h1>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--dim)" }}>
          Every day, the world writes one page. This is the book.
        </p>
      </header>

      <div className="pt-6">
        {pages.length === 0 ? (
          <p className="text-center text-sm py-16" style={{ color: "var(--faint)" }}>
            The first page is still being written. Come back tomorrow.
          </p>
        ) : (
          pages.map((page) => (
            <article
              key={page.day}
              className="py-8"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p className="text-xs mb-3" style={{ color: "var(--faint)" }}>
                Page {page.day} · {page.date}
              </p>
              <p className="font-serif text-xl leading-relaxed mb-3">
                {page.winner.text}
              </p>
              <p className="text-xs" style={{ color: "var(--dim)" }}>
                {page.winner.flag} {page.winner.author} · {page.winner.country} ·{" "}
                <span style={{ color: "var(--gold)" }}>★ {fmt(page.winner.votes)} voices agreed</span>
              </p>
            </article>
          ))
        )}
      </div>

      <p className="text-xs text-center pt-12" style={{ color: "var(--faint)" }}>
        <Link href="/" style={{ color: "var(--accent)" }}>← today&apos;s page</Link>
        {" · "}this book never ends
      </p>
    </main>
  );
}
