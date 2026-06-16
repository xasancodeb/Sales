"use client";

import Link from "next/link";
import { useEffect } from "react";

const SECTIONS = [
  {
    id: "service",
    title: "1. The service",
    content: (
      <>
        <p>
          StyleUp is a marketplace that connects clients with independent personal stylists. We provide the platform — profiles, booking tools, the colour fitting room, and payment handling. The styling work itself is delivered by the individual stylist you book.
        </p>
        <p>
          StyleUp is not the employer of any stylist. Stylists are independent professionals who set their own prices, availability, and approach. We verify their credentials and review their work, but the styling relationship is between you and them.
        </p>
        <p>
          By creating an account or booking a session you agree to these terms. If you do not agree, please do not use StyleUp.
        </p>
      </>
    ),
  },
  {
    id: "booking",
    title: "2. Booking terms",
    content: (
      <>
        <p>
          When you book a session you are entering into an agreement directly with your stylist, facilitated by StyleUp. You agree to:
        </p>
        <ul>
          <li>
            <strong>Provide accurate information</strong> — the details you share at booking (your goals, sizes, preferences) help your stylist prepare. Inaccurate information may affect the quality of your session.
          </li>
          <li>
            <strong>Show up on time</strong> — for in-person sessions, arrive at the agreed location and time. For video sessions, be ready with a stable connection.
          </li>
          <li>
            <strong>Treat stylists with respect</strong> — sessions are a professional service. Harassment, discrimination, or abusive behaviour will result in immediate account termination with no refund.
          </li>
        </ul>
        <p>
          A booking is confirmed once payment is taken and you receive a confirmation. Until then, the slot is not reserved.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "3. Payment terms",
    content: (
      <>
        <p>
          Payment is taken in full at the time of booking. The price you see before confirming is the price you pay — it includes the stylist&apos;s fee and a booking fee, with no hidden charges.
        </p>
        <ul>
          <li>
            <strong>Currency</strong> — you are charged in the currency shown on the stylist&apos;s profile. Your bank may apply conversion fees for international bookings.
          </li>
          <li>
            <strong>Booking fee</strong> — a small platform fee is added to each booking to cover payment processing and the running of StyleUp. It is always shown clearly before you confirm.
          </li>
          <li>
            <strong>Payment processing</strong> — all payments are handled securely by Stripe. We do not store full card details.
          </li>
        </ul>
        <p>
          If a payment fails or is later reversed, your booking may be cancelled and your access to the platform suspended until the balance is settled.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "4. Cancellation policy",
    content: (
      <>
        <p>
          We know plans change. Our cancellation policy is designed to be fair to both you and the stylist who has set aside time and prepared for you.
        </p>
        <ul>
          <li>
            <strong>More than 48 hours before your session</strong> — cancel for free and receive a full refund.
          </li>
          <li>
            <strong>Within 48 to 24 hours</strong> — cancel and receive a 50% refund. Your stylist has begun preparing specifically for you.
          </li>
          <li>
            <strong>Within 24 hours, or a no-show</strong> — no refund is available, as your stylist has reserved the time and cannot rebook it.
          </li>
        </ul>
        <p>
          To cancel, use the cancel option in your dashboard. Refunds are processed to your original payment method within 5–10 business days.
        </p>
        <p>
          If a stylist cancels on you, you always receive a full refund, and we will help you find an alternative stylist where possible.
        </p>
      </>
    ),
  },
  {
    id: "stylist-terms",
    title: "5. Stylist terms",
    content: (
      <>
        <p>
          Stylists who join StyleUp agree to additional terms in exchange for access to our client base, tools, and payment infrastructure:
        </p>
        <ul>
          <li>
            <strong>Professional standards</strong> — stylists agree to deliver the sessions they advertise, arrive prepared, and maintain the standards reflected in their reviews.
          </li>
          <li>
            <strong>Commission</strong> — StyleUp takes a commission on each completed booking, as set out in the stylist agreement. Stylists keep the remainder.
          </li>
          <li>
            <strong>Non-circumvention</strong> — for a period of 12 months after a client is introduced through StyleUp, stylists agree not to solicit, arrange, or accept bookings from that client outside the platform in order to avoid commission. Clients found and introduced by StyleUp must continue to be booked through StyleUp. This protects the investment we make in finding and verifying clients, and keeps cancellation protection and payment security in place for everyone.
          </li>
          <li>
            <strong>Removal</strong> — we may remove a stylist who repeatedly cancels, receives sustained poor reviews, breaches the non-circumvention clause, or otherwise damages the trust of the community.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "6. Prohibited uses",
    content: (
      <>
        <p>You agree not to use StyleUp to:</p>
        <ul>
          <li>
            <strong>Circumvent the platform</strong> — arrange or solicit off-platform bookings to avoid fees or commission (see the non-circumvention clause above).
          </li>
          <li>
            <strong>Misrepresent yourself</strong> — create fake accounts, impersonate others, or post fraudulent reviews.
          </li>
          <li>
            <strong>Harass or harm others</strong> — send abusive messages, discriminate, or behave in a way that makes a stylist or client feel unsafe.
          </li>
          <li>
            <strong>Scrape or misuse data</strong> — extract stylist profiles, reviews, or client information by automated means, or use the platform&apos;s content for any commercial purpose other than booking a session.
          </li>
          <li>
            <strong>Disrupt the service</strong> — attempt to breach security, overload our systems, or interfere with other users&apos; access.
          </li>
        </ul>
        <p>
          Breaching any of these may result in immediate suspension or permanent removal of your account, with no refund.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Liability",
    content: (
      <>
        <p>
          StyleUp provides the platform that connects you with stylists. We are not responsible for the personal styling advice given by an independent stylist, nor for purchasing decisions you make as a result of a session.
        </p>
        <p>
          To the fullest extent permitted by law, our liability to you in connection with any booking is limited to the amount you paid for that booking. Nothing in these terms excludes liability that cannot be excluded under UK law.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "8. Governing law",
    content: (
      <>
        <p>
          These terms are governed by the laws of England and Wales. Any dispute relating to them or to your use of StyleUp will be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>
        <p>
          StyleUp is registered in England and Wales. If you have a question about these terms, contact us at{" "}
          <a href="mailto:hello@styleup.com" style={{ color: "var(--accent)" }}>
            hello@styleup.com
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service · StyleUp";
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
          Terms of Service
        </h1>
        <p className="text-sm" style={{ color: "var(--faint)" }}>
          Effective date: 1 January 2026
        </p>
        <p className="text-base mt-4 mb-2" style={{ color: "var(--dim)", lineHeight: 1.7 }}>
          These terms explain how StyleUp works, what you can expect from us, and what we ask of you — written in plain English so you actually know what you&apos;re agreeing to.
        </p>
      </section>

      {/* ── Table of contents ── */}
      <section className="max-w-3xl mx-auto px-6 py-6">
        <div className="card p-5">
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>IN THESE TERMS</p>
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
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/corporate">Corporate</Link>
        </div>
        <p>© 2026 StyleUp · Registered in England and Wales</p>
      </footer>
    </main>
  );
}
