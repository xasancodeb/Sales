import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIVEMIND — Do you know what everyone is thinking?",
  description:
    "One round a day. 5 questions. The whole world plays the same one. You don't win by being right — you win by knowing what everyone else thinks.",
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
