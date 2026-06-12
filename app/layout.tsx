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
        <header className="border-b border-border">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <a
              href="/"
              className="text-lg font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
            >
              <span className="text-gradient">devroast</span>
              <span className="text-text-muted ml-1 text-sm font-mono">.dev</span>
            </a>
            <a
              href="/leaderboard"
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Leaderboard
            </a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-4 text-center text-xs text-text-muted">
          Built for Devlynix Buildathon 2.0
        </footer>
      </body>
    </html>
  );
}
