"use client";

import Link from "next/link";
import { useEffect } from "react";

const SECTIONS = [
  {
    id: "data-we-collect",
    title: "1. Data we collect",
    content: (
      <>
        <p>
          When you use StyleUp we collect the following types of information:
        </p>
        <ul>
          <li>
            <strong>Account information</strong> — your name, email address, and password when you create an account.
          </li>
          <li>
            <strong>Quiz and style results</strong> — your answers to our style quiz, colour season, and any preferences you share in the fitting room. This is what makes your recommendations personal.
          </li>
          <li>
            <strong>Booking history</strong> — which stylists you have booked, session types, dates, and any notes you added. We use this to make future recommendations better.
          </li>
          <li>
            <strong>Payment data</strong> — billing address and the last four digits of your card. We do not store full card numbers; payments are handled by our payment processor.
          </li>
          <li>
            <strong>Device and usage data</strong> — your IP address, browser type, pages visited, and time spent on the platform. This is standard for any website and helps us improve the experience.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How we use your data",
    content: (
      <>
        <p>We use your information in the following ways:</p>
        <ul>
          <li>
            <strong>Personalise your recommendations</strong> — your quiz results and booking history shape which stylists and session types we surface for you. Without this, StyleUp is just a directory.
          </li>
          <li>
            <strong>Manage your bookings</strong> — we send confirmation emails, reminders, and post-session follow-ups so you and your stylist are always on the same page.
          </li>
          <li>
            <strong>Process payments</strong> — we use your billing details to charge you at booking and to handle refunds if you cancel within the refund window.
          </li>
          <li>
            <strong>Improve the platform</strong> — usage data helps us understand what's working and what isn't. We use anonymised, aggregated data to guide product decisions.
          </li>
          <li>
            <strong>Send service communications</strong> — we may email you about changes to your bookings, policy updates, or security alerts. You cannot opt out of these as they are part of the service.
          </li>
          <li>
            <strong>Marketing (with consent)</strong> — if you opt in, we may send newsletters and offers. You can unsubscribe at any time from any marketing email.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "3. Third parties",
    content: (
      <>
        <p>
          We share your data with a small number of third parties where necessary to run the service:
        </p>
        <ul>
          <li>
            <strong>Payment processors</strong> — we use Stripe to handle all payments. Stripe receives your billing details and is responsible for securing card data. You can read Stripe&apos;s privacy policy at stripe.com.
          </li>
          <li>
            <strong>Analytics providers</strong> — we use anonymised usage data with analytics tools to understand platform behaviour. This data cannot be used to identify you individually.
          </li>
          <li>
            <strong>Email delivery</strong> — booking confirmations and notifications are sent via a transactional email provider who receives your email address for delivery purposes only.
          </li>
        </ul>
        <p>
          <strong>We do not sell your data.</strong> We never have and we never will. Your data is not shared with advertisers, data brokers, or any third party for their own commercial purposes.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "4. Data retention",
    content: (
      <>
        <p>
          We keep your account data for as long as your account is active, and for up to <strong>3 years</strong> after your last activity on the platform. This covers the period in which you might want access to your booking history or raise a support query.
        </p>
        <p>
          After 3 years of inactivity, we anonymise your personal data — your booking history and quiz results are retained in an aggregated, non-identifiable form to help us improve the service, but nothing is traceable back to you.
        </p>
        <p>
          If you delete your account, we remove your personal data within 30 days, except where we are legally required to keep certain records (for example, transaction data for tax purposes, which we retain for 7 years as required by UK law).
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "5. Your rights",
    content: (
      <>
        <p>
          Under UK GDPR, you have the following rights regarding your personal data:
        </p>
        <ul>
          <li>
            <strong>Access</strong> — you can request a copy of all the personal data we hold about you.
          </li>
          <li>
            <strong>Correction</strong> — if anything we hold is inaccurate, you can ask us to correct it.
          </li>
          <li>
            <strong>Deletion</strong> — you can ask us to delete your personal data. We will do so within 30 days, subject to any legal retention requirements.
          </li>
          <li>
            <strong>Portability</strong> — you can request your data in a structured, machine-readable format so you can take it elsewhere.
          </li>
          <li>
            <strong>Object to processing</strong> — you can object to us processing your data for direct marketing at any time. We will stop immediately.
          </li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:privacy@styleup.com" style={{ color: "var(--accent)" }}>
            privacy@styleup.com
          </a>
          . We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies",
    content: (
      <>
        <p>We use two types of cookies:</p>
        <ul>
          <li>
            <strong>Functional cookies</strong> — these are essential for the platform to work. They keep you logged in, remember your preferences, and make bookings work correctly. You cannot opt out of these and continue using StyleUp.
          </li>
          <li>
            <strong>Analytics cookies</strong> — these help us understand how people use StyleUp so we can improve it. They are anonymised and we do not use them to build advertising profiles. You can opt out of analytics cookies at any time by adjusting your browser settings or using the cookie preferences banner on your first visit.
          </li>
        </ul>
        <p>
          We do not use advertising or tracking cookies. There are no third-party advertising networks with visibility into your StyleUp activity.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "7. Contact",
    content: (
      <>
        <p>
          If you have any questions about this policy or how we handle your data, contact us at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@styleup.com" style={{ color: "var(--accent)" }}>
            privacy@styleup.com
          </a>
        </p>
        <p>
          StyleUp is registered in England and Wales. If you are not satisfied with our response to a complaint, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy · StyleUp";
  }, []);

  return (
    <main style={{ minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <Link href="/" className="text-sm" style={{ color: "var(--dim)" }}>
          ← Back to home
        </Link>
      </nav>

      {/* ── Header ── */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-4">
        <h1 className="serif text-4xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p className="text-sm" style={{ color: "var(--faint)" }}>
          Effective date: 1 January 2026
        </p>
        <p className="text-base mt-4 mb-2" style={{ color: "var(--dim)", lineHeight: 1.7 }}>
          We believe privacy should be simple to understand. This policy explains what data we collect, why we collect it, and what your rights are — in plain English, not legalese.
        </p>
      </section>

      {/* ── Table of contents ── */}
      <section className="max-w-3xl mx-auto px-6 py-6">
        <div className="card p-5">
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>IN THIS POLICY</p>
          <div className="flex flex-col gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm"
                style={{ color: "var(--accent)" }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="prose"
          style={
            {
              "--prose-p": "var(--dim)",
              "--prose-li": "var(--dim)",
            } as React.CSSProperties
          }
        >
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="mb-12">
              <h2 className="serif text-xl font-bold mb-4">{s.title}</h2>
              <div
                className="text-sm leading-relaxed flex flex-col gap-3"
                style={{ color: "var(--dim)", lineHeight: 1.8 }}
              >
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-8 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/">Home</Link>
          <Link href="/explore">Browse stylists</Link>
          <Link href="/terms">Terms of service</Link>
          <Link href="/corporate">Corporate</Link>
        </div>
        <p>© 2026 StyleUp · Registered in England and Wales</p>
      </footer>
    </main>
  );
}
