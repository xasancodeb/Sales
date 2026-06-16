import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StyleUp — Your personal stylist, anywhere",
    template: "%s · StyleUp",
  },
  description:
    "Book a personal stylist who comes to you — in-store, at home, or virtual. Upgrade your wardrobe with someone who truly gets your style.",
  keywords: ["personal stylist", "style advice", "wardrobe edit", "colour analysis", "fashion consultant", "virtual styling"],
  openGraph: {
    title: "StyleUp — Your personal stylist, anywhere",
    description:
      "Book a personal stylist for in-store shopping, wardrobe edits, or virtual sessions. Try on colours before you buy with our virtual fitting room.",
    siteName: "StyleUp",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleUp — Your personal stylist, anywhere",
    description: "Book a personal stylist for in-store shopping, wardrobe edits, or virtual sessions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
