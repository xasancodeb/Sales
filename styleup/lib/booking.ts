// ── Booking logic (localStorage) ──────────────────────────────────────

import { SessionType } from "./data";

export interface Booking {
  id: string;
  stylistId: string;
  stylistName: string;
  stylistFlag: string;
  serviceName: string;
  sessionType: SessionType;
  date: string;       // ISO date "2026-06-18"
  time: string;       // "14:00"
  price: number;
  currency: string;
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
  bookedAt: string;
}

const KEY = "styleup_bookings";

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(bookings: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(bookings));
}

export function getBookings(): Booking[] {
  const now = new Date().toISOString().slice(0, 10);
  const bookings = load().map((b) => {
    if (b.status === "upcoming" && b.date < now) {
      return { ...b, status: "completed" as const };
    }
    return b;
  });
  save(bookings);
  return bookings;
}

export function addBooking(b: Omit<Booking, "id" | "bookedAt" | "status">): Booking {
  const booking: Booking = {
    ...b,
    id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    bookedAt: new Date().toISOString(),
    status: "upcoming",
  };
  const bookings = load();
  bookings.unshift(booking);
  save(bookings);
  return booking;
}

export function cancelBooking(id: string) {
  const bookings = load().map((b) =>
    b.id === id ? { ...b, status: "cancelled" as const } : b,
  );
  save(bookings);
}

export function getUpcoming(): Booking[] {
  return getBookings().filter((b) => b.status === "upcoming");
}

export function getPast(): Booking[] {
  return getBookings().filter((b) => b.status === "completed");
}

// Generate available time slots for a date (Mon-Fri 9-18, Sat 10-16)
export function availableSlots(dateStr: string): string[] {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay(); // 0=Sun
  if (day === 0) return [];
  const [start, end] = day === 6 ? [10, 16] : [9, 18];
  const slots: string[] = [];
  for (let h = start; h < end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < end - 1) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  // Pseudo-randomly remove some to simulate busy calendar
  const seed = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return slots.filter((_, i) => ((seed + i * 7) % 13) !== 0);
}

export function nextAvailableDates(count = 14): string[] {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1); // start tomorrow
  while (dates.length < count) {
    const iso = d.toISOString().slice(0, 10);
    if (d.getDay() !== 0) dates.push(iso); // no Sundays
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "long",
  });
}
