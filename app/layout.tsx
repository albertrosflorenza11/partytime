import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartyTime — Network before you arrive",
  description: "Swipe-based attendee matchmaking for Luma events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
