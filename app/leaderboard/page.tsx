"use client";

import { useEffect, useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";

interface LeaderboardEntry {
  username: string;
  avatar_url: string;
  totalScore: number;
  impactScore: number;
  activityScore: number;
  versatilityScore: number;
  cloutScore: number;
  public_repos: number;
  followers: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to load leaderboard`);
        }
        const result: LeaderboardEntry[] = await res.json();
        setEntries(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-2">
        <a
          href="/"
          className="text-xs text-text-muted hover:text-accent transition-colors"
        >
          &larr; Home
        </a>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          <span className="text-gradient">Leaderboard</span>
        </h1>
        <p className="text-sm text-text-secondary">
          All scanned developers, ranked by Dev Score.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="loader" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl gradient-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <LeaderboardTable entries={entries} />
        </div>
      )}
    </div>
  );
}
