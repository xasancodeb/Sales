import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONE — The planet's single feed",
  description:
    "Every person on Earth gets one post per day. The world votes what rises. One front page, written by humanity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
