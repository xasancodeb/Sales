import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONE — The world's shared page",
  description:
    "Eight billion people. One page. Every person on Earth gets one post a day — no followers, no badges, no algorithm. The world votes, the best voice rises, and at midnight everyone starts equal again.",
  openGraph: {
    title: "ONE — The world's shared page",
    description:
      "Every person on Earth gets one post a day. The world votes. At midnight, everyone starts equal again.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
