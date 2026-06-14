import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        {/* Sticky glassmorphism nav */}
        <header className="sticky top-0 z-50 glass border-b border-border">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
            <a
              href="/"
              className="flex items-center gap-2 group"
              aria-label="DevRoast home"
            >
              {/* Accent pulse dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient">devroast</span>
                <span className="text-text-muted font-mono text-sm">.dev</span>
              </span>
            </a>

            <div className="flex items-center gap-6">
              <a
                href="/leaderboard"
                className="text-sm text-text-secondary hover:text-accent transition-colors duration-200 cursor-pointer"
              >
                Leaderboard
              </a>
              <a
                href="/"
                className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                Scan
              </a>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-5 text-center">
          <p className="text-xs text-text-muted">
            Built for{" "}
            <span className="text-accent font-medium">Devlynix Buildathon 2.0</span>
            {" "}· {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
