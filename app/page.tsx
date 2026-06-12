"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    router.push(`/report/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full gradient-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Devlynix Buildathon 2.0
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient">devroast</span>
          <br />
          <span className="text-text-primary">Your GitHub Report Card</span>
        </h1>

        <p className="max-w-md text-base leading-relaxed text-text-secondary">
          Enter a GitHub username. We&apos;ll analyze their public profile,
          compute a Dev Score, and generate a brutally honest AI roast.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.replace(/\s/g, ""));
                setError("");
              }}
              placeholder="username"
              className="w-full rounded-xl border border-border bg-surface py-3 pl-8 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}

        <a
          href="/leaderboard"
          className="text-xs text-text-muted underline underline-offset-4 hover:text-accent transition-colors"
        >
          View Leaderboard &rarr;
        </a>
      </div>
    </div>
  );
}
