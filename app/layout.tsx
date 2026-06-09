import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quota — The Autonomous Revenue Agent",
  description:
    "Quota researches prospects, scores intent, writes outreach that sounds like you, and fills your pipeline while you sleep. The first sales hire that costs less than lunch.",
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
