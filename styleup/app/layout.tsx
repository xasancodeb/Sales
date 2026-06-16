import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleUp — Your personal stylist, anywhere",
  description:
    "Book a personal stylist who comes to you — in-store, at home, or virtual. Upgrade your wardrobe with someone who truly gets your style.",
  openGraph: {
    title: "StyleUp — Your personal stylist, anywhere",
    description:
      "Book a personal stylist for in-store shopping, wardrobe edits, or virtual sessions. Try on colours before you buy with our virtual fitting room.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
