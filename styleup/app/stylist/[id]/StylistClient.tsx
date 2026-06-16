"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStylist, SESSION_TYPES, Service, Stylist } from "@/lib/data";
import { addBooking, availableSlots, formatDate, nextAvailableDates } from "@/lib/booking";

function getSpecialtyIcon(specialty: string): string {
  const map: Record<string, string> = {
    "Minimalist": "○",
    "Classic": "◈",
    "Streetwear": "◆",
    "Luxury": "✦",
    "Bohemian": "✿",
    "Edgy": "◬",
    "Sustainable": "♻",
    "Modest Fashion": "☾",
    "Bold Colour": "◉",
    "K-Fashion": "✸",
  };
  return map[specialty] ?? "·";
}

function getPortfolioDescription(label: string): string {
  const map: Record<string, string> = {
    "The London Capsule": "A timeless work-to-weekend palette anchored in charcoal and cream",
    "Office Power": "Sharp corporate dressing for high-stakes environments",
    "Weekend Edit": "Relaxed Saturday energy with a considered colour story",
  };
  return map[label] ?? `Curated colour harmony for ${label}`;
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="star">
      {"★".repeat(Math.round(rating))}
      <span style={{ color: "var(--faint)" }}>{"★".repeat(5 - Math.round(rating))}</span>
      <span className="ml-1 text-sm" style={{ color: "var(--dim)" }}>
        {rating.toFixed(2)}{count !== undefined ? ` · ${count} reviews` : ""}
      </span>
    </span>
  );
}

function ReviewCard({ review }: { review: Stylist["reviews"][0] }) {
  return (
    <div className="py-5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-semibold text-sm">{review.flag} {review.author}</span>
          <span className="text-xs ml-2" style={{ color: "var(--faint)" }}>{review.date}</span>
        </div>
        <span className="star text-xs">{"★".repeat(review.rating)}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--dim)" }}>&ldquo;{review.text}&rdquo;</p>
      <p className="text-xs mt-1" style={{ color: "var(--faint)" }}>Session: {review.session}</p>
    </div>
  );
}

type BookingStep = "idle" | "service" | "datetime" | "notes" | "confirmed";

export default function StylistClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [step, setStep] = useState<BookingStep>("idle");

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dates] = useState(() => nextAvailableDates(14));
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const s = getStylist(id);
    if (!s) { router.replace("/explore"); return; }
    setStylist(s);
  }, [id, router]);

  useEffect(() => {
    if (selectedDate) {
      const s = availableSlots(selectedDate);
      setSlots(s);
      setSelectedSlot(s[0] ?? "");
    }
  }, [selectedDate]);

  const confirm = () => {
    if (!stylist || !selectedService || !selectedDate || !selectedSlot) return;
    const b = addBooking({
      stylistId: stylist.id,
      stylistName: stylist.name,
      stylistFlag: stylist.flag,
      serviceName: selectedService.name,
      sessionType: selectedService.type,
      date: selectedDate,
      time: selectedSlot,
      price: selectedService.price,
      currency: selectedService.currency,
      notes,
    });
    setBookingId(b.id);
    setStep("confirmed");
  };

  if (!stylist) return <main className="min-h-screen" />;

  const typeInfo = (type: string) =>
    SESSION_TYPES.find((t) => t.value === type) ?? { icon: "✦", label: type };

  if (step === "confirmed") {
    return (
      <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center fade-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="serif text-2xl font-bold mb-2">You&apos;re booked!</h1>
          <p className="text-sm" style={{ color: "var(--dim)" }}>
            {stylist.flag} {stylist.name} will be in touch within {stylist.response_time}
          </p>
        </div>
        <div className="card p-5 mb-6">
          <p className="font-semibold mb-1">{selectedService?.name}</p>
          <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>
            {typeInfo(selectedService?.type ?? "").icon} {typeInfo(selectedService?.type ?? "").label}
          </p>
          <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>
            📅 {formatDate(selectedDate)} at {selectedSlot}
          </p>
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            {selectedService?.currency}{selectedService?.price.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="btn-primary text-center">
            View my bookings
          </Link>
          <Link href="/fitting" className="btn-secondary text-center">
            Open the colour fitting room →
          </Link>
          <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
            Booking ref: {bookingId}
          </p>
        </div>
      </main>
    );
  }

  const BookingPanel = () => {
    if (step === "idle") {
      return (
        <div className="card p-5">
          <p className="font-semibold mb-1 text-lg">Book a session</p>
          <p className="text-sm mb-4" style={{ color: "var(--dim)" }}>
            Replies within {stylist.response_time} · {stylist.bookings.toLocaleString()} sessions completed
          </p>
          {stylist.available_today && (
            <p className="text-xs mb-3 px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "#E8F5E9", color: "#2D7A4F" }}>
              ✓ Available today
            </p>
          )}
          <button className="btn-primary w-full" onClick={() => setStep("service")}>
            Choose a session →
          </button>
        </div>
      );
    }

    if (step === "service") {
      return (
        <div className="card p-5">
          <p className="font-semibold mb-4">Choose your session</p>
          <div className="flex flex-col gap-3">
            {stylist.services.map((sv) => {
              const ti = typeInfo(sv.type);
              const isSelected = selectedService?.name === sv.name;
              return (
                <button
                  key={sv.name}
                  onClick={() => setSelectedService(sv)}
                  className="text-left p-4 rounded-xl transition-all"
                  style={{
                    border: `2px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                    background: isSelected ? "var(--accent-bg)" : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm">{ti.icon} {sv.name}</p>
                    <p className="font-bold text-sm" style={{ color: "var(--accent)" }}>
                      {sv.currency}{sv.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>{sv.desc}</p>
                  <p className="text-xs" style={{ color: "var(--faint)" }}>{sv.duration} · {ti.label}</p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-secondary flex-1" onClick={() => setStep("idle")}>Back</button>
            <button
              className="btn-primary flex-1"
              disabled={!selectedService}
              onClick={() => setStep("datetime")}
              style={{ opacity: selectedService ? 1 : 0.4 }}
            >
              Next →
            </button>
          </div>
        </div>
      );
    }

    if (step === "datetime") {
      return (
        <div className="card p-5">
          <p className="font-semibold mb-4">Pick a date &amp; time</p>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--dim)" }}>DATE</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {dates.slice(0, 10).map((d) => {
              const label = new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
              const isSelected = selectedDate === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className="text-xs px-3 py-2 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                    background: isSelected ? "var(--accent)" : "transparent",
                    color: isSelected ? "#fff" : "var(--ink)",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--dim)" }}>TIME</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className="text-xs px-3 py-2 rounded-lg transition-all mono"
                      style={{
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                        background: isSelected ? "var(--accent)" : "transparent",
                        color: isSelected ? "#fff" : "var(--ink)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep("service")}>Back</button>
            <button
              className="btn-primary flex-1"
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep("notes")}
              style={{ opacity: selectedDate && selectedSlot ? 1 : 0.4 }}
            >
              Next →
            </button>
          </div>
        </div>
      );
    }

    if (step === "notes") {
      return (
        <div className="card p-5">
          <p className="font-semibold mb-1">Tell {stylist.name.split(" ")[0]} about your goals</p>
          <p className="text-xs mb-4" style={{ color: "var(--faint)" }}>Optional — but the more context they have, the better prepared they&apos;ll be</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`What do you want to achieve from this session?`}
            rows={5}
            className="w-full text-sm leading-relaxed focus:outline-none resize-none rounded-xl p-3"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          />
          <div className="mt-4 p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Booking summary</p>
            <p className="text-xs" style={{ color: "var(--dim)" }}>{selectedService?.name} · {formatDate(selectedDate)} at {selectedSlot}</p>
            <p className="text-sm font-bold mt-1">{selectedService?.currency}{selectedService?.price.toLocaleString()}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-secondary flex-1" onClick={() => setStep("datetime")}>Back</button>
            <button className="btn-accent flex-1" onClick={confirm}>
              Confirm booking
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 pb-20">
      <div className="pt-6 pb-4 flex items-center justify-between">
        <Link href="/explore" className="text-sm" style={{ color: "var(--dim)" }}>← All stylists</Link>
        <Link href="/" className="serif font-bold text-lg">StyleUp</Link>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: "1fr auto", alignItems: "start" }}>
        <div>
          <div
            className="rounded-2xl h-40 w-40 flex items-center justify-center text-5xl font-bold text-white mb-5"
            style={{ background: `linear-gradient(135deg, ${stylist.gradient[0]}, ${stylist.gradient[1]})` }}
          >
            {stylist.name[0]}
          </div>

          <div className="flex items-start gap-4 mb-2 flex-wrap">
            <div>
              <h1 className="serif text-3xl font-bold mb-1">{stylist.flag} {stylist.name}</h1>
              <p className="text-sm" style={{ color: "var(--dim)" }}>{stylist.city}, {stylist.country}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {stylist.specialty.map((sp) => (
              <span key={sp} className="chip">{getSpecialtyIcon(sp)} {sp}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <StarRating rating={stylist.rating} count={stylist.reviews_count} />
            <span className="text-sm" style={{ color: "var(--faint)" }}>{stylist.bookings.toLocaleString()} sessions</span>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
              ⚡ Replies {stylist.response_time}
            </span>
          </div>

          <div className="mb-6">
            {stylist.available_today && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#2D7A4F" }}>
                <span className="rounded-full" style={{ width: 8, height: 8, background: "#2D7A4F", display: "inline-block" }} />
                Available today
              </span>
            )}
          </div>

          <p className="text-base italic mb-6 serif" style={{ color: "var(--dim)" }}>&ldquo;{stylist.tagline}&rdquo;</p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--dim)", lineHeight: 1.7 }}>{stylist.bio}</p>

          <div className="mb-8">
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--faint)" }}>LANGUAGES</p>
            <div className="flex flex-wrap gap-2">
              {stylist.languages.map((l) => (
                <span key={l} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--accent-bg)", color: "var(--dim)" }}>{l}</span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>SIGNATURE LOOKS</p>
            <div className="flex flex-col gap-4">
              {stylist.portfolio.map((p) => (
                <div key={p.label} className="card p-4">
                  <p className="text-sm font-semibold mb-3">{p.label}</p>
                  <div className="flex gap-2">
                    {p.colors.map((c) => (
                      <div
                        key={c}
                        className="rounded-lg flex-1"
                        style={{ height: 48, background: c, border: "1px solid rgba(0,0,0,0.06)" }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--faint)" }}>{getPortfolioDescription(p.label)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>REVIEWS</p>
            <div>
              {stylist.reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          </div>
        </div>

        <div style={{ width: 340, position: "sticky", top: 24, flexShrink: 0 }}>
          <BookingPanel />
          {step === "idle" && (
            <div className="card p-5 mt-4">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>SESSIONS OFFERED</p>
              {stylist.services.map((sv, index) => {
                const ti = typeInfo(sv.type);
                const shareWeights = [0.35, 0.30, 0.25, 0.10];
                const clientCount = Math.round(stylist.bookings * (shareWeights[index] ?? 0.10));
                return (
                  <div key={sv.name} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p className="text-sm font-semibold">{ti.icon} {sv.name}</p>
                      <p className="text-xs" style={{ color: "var(--faint)" }}>{sv.duration}</p>
                      <span className="text-xs" style={{ color: "var(--faint)" }}>{clientCount} clients booked</span>
                    </div>
                    <p className="text-sm font-bold">{sv.currency}{sv.price.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
