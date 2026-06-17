import Stripe from "stripe";

// Server-side Stripe client
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

// Booking fee breakdown
export function priceBreakdown(sessionPriceGBP: number) {
  const platformFee = Math.round(sessionPriceGBP * 0.05 * 100) / 100; // 5% booking fee
  const total = sessionPriceGBP + platformFee;
  return { sessionPrice: sessionPriceGBP, platformFee, total };
}

// Convert GBP to Stripe pence (integer)
export function toPence(gbp: number) {
  return Math.round(gbp * 100);
}
