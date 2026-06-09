import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURUM — The Autonomous Wealth Engine",
  description:
    "AURUM scans the entire digital economy 24/7, finds income opportunities tailored to your skills, writes the pitch, and acts on your behalf. You just approve. The world's first autonomous wealth engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
