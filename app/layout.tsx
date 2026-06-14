import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevRoast — GitHub Developer Report Card",
  description:
    "Enter a GitHub username and get a roasted Dev Score, proof-of-work analysis, and a shareable Bento report card.",
  openGraph: {
    title: "DevRoast — GitHub Developer Report Card",
    description:
      "Get roasted based on your public GitHub profile. Built for Devlynix Buildathon 2.0.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        {/* Floating Solidroad-style nav */}
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto flex items-center justify-between gap-8 px-5 py-2.5 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl ring-1 ring-black/5">
            <a
              href="/"
              className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
              aria-label="DevRoast home"
            >
              {/* Accent pulse dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-base font-bold tracking-tight">
                <span className="text-gradient">devroast</span>
              </span>
            </a>

            <div className="flex items-center gap-1">
              <a
                href="/leaderboard"
                className="text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
              >
                Leaderboard
              </a>
              <a
                href="/"
                className="text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
              >
                Scan
              </a>
            </div>
          </nav>
        </header>

        {/* Add padding to top of main to account for fixed header */}
        <main className="flex-1 pt-24">{children}</main>

        <footer className="border-t border-border py-5 text-center">
          <p className="text-xs text-text-muted">
            Built for{" "}
            <span className="text-accent font-medium">Devlynix Buildathon 2.0</span>
            {" "}· {new Date().getFullYear()}
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
