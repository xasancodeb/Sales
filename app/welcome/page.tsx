"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES, dayNumber, deviceId, loadProfile, saveProfile } from "@/lib/one";
import { LANGS, getLang, setLang } from "@/lib/lang";
import { registerProfile } from "@/lib/api";

export default function Welcome() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [lang, setLangState] = useState("en");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loadProfile()) {
      router.replace("/");
      return;
    }
    setLangState(getLang());
    setTimeout(() => ref.current?.focus(), 150);
  }, [router]);

  const join = () => {
    const n = name.trim();
    if (n.length < 1 || !country) return;
    const c = COUNTRIES.find((x) => x.name === country) ?? COUNTRIES[COUNTRIES.length - 1];
    const profile = { name: n.slice(0, 40), country: c.name, flag: c.flag, joinedDay: dayNumber() };
    saveProfile(profile);
    setLang(lang);
    registerProfile(deviceId(), profile.name, profile.country, profile.flag); // no-op offline
    router.replace("/");
  };

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center py-16">
      <h1 className="font-serif text-4xl font-black tracking-tight mb-3">ONE</h1>
      <p className="font-serif text-xl leading-relaxed mb-2">
        Eight billion people. One page.
      </p>
      <p className="text-sm mb-10" style={{ color: "var(--dim)" }}>
        Claim your voice — a name and a country is the whole account. Your
        posts, your streak and your reach are saved from today on.
      </p>

      <div
        className="rounded-2xl px-5 py-4 mb-4"
        style={{ background: "#fff", border: "1px solid var(--border)" }}
      >
        <label className="block text-xs mb-1.5" style={{ color: "var(--faint)" }}>
          your name on the page
        </label>
        <input
          ref={ref}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="e.g. Amara K."
          className="w-full bg-transparent text-lg focus:outline-none"
          style={{ color: "var(--ink)", caretColor: "var(--accent)" }}
        />
      </div>

      <div
        className="rounded-2xl px-5 py-4 mb-4"
        style={{ background: "#fff", border: "1px solid var(--border)" }}
      >
        <label className="block text-xs mb-1.5" style={{ color: "var(--faint)" }}>
          where your voice speaks from
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full bg-transparent text-lg cursor-pointer focus:outline-none"
          style={{ color: country ? "var(--ink)" : "var(--faint)" }}
        >
          <option value="" disabled>choose your country</option>
          {COUNTRIES.map((c) => (
            <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <div
        className="rounded-2xl px-5 py-4 mb-8"
        style={{ background: "#fff", border: "1px solid var(--border)" }}
      >
        <label className="block text-xs mb-1.5" style={{ color: "var(--faint)" }}>
          read the world in
        </label>
        <select
          value={lang}
          onChange={(e) => setLangState(e.target.value)}
          className="w-full bg-transparent text-lg cursor-pointer focus:outline-none"
          style={{ color: "var(--ink)" }}
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={join}
        disabled={name.trim().length < 1 || !country}
        className="w-full py-3.5 rounded-2xl text-base font-semibold transition-opacity disabled:opacity-30"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Join the world&apos;s page
      </button>
      <p className="text-xs text-center mt-4" style={{ color: "var(--faint)" }}>
        no email · no password · same one voice as everyone
      </p>
    </main>
  );
}
