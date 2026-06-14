"use client";

import { useState, useMemo } from "react";

interface LeaderboardEntry {
  username: string;
  name?: string;
  avatar_url: string;
  totalScore: number;
  impactScore: number;
  activityScore: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

type SortKey = "totalScore" | "impactScore" | "activityScore";

const SORT_LABELS: Record<SortKey, string> = {
  totalScore:    "Dev Score",
  impactScore:   "Impact",
  activityScore: "Activity",
};

// Rank medal colors for top 3
const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-400",
  3: "text-amber-600",
};

// Rank icon for top 3
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-base" title="1st place">🥇</span>;
  if (rank === 2) return <span className="text-base" title="2nd place">🥈</span>;
  if (rank === 3) return <span className="text-base" title="3rd place">🥉</span>;
  return <span className="text-text-muted tabular-nums text-sm">{rank}</span>;
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalScore");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const sorted = useMemo(() => {
    const copy = [...entries];
    copy.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
    return copy;
  }, [entries, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="text-3xl">📭</div>
        <p className="text-sm text-text-muted">No entries yet.</p>
        <a
          href="/"
          className="rounded-xl gradient-accent px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all cursor-pointer"
        >
          Scan First Profile
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" role="table">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-4 text-[10px] font-semibold uppercase tracking-widest text-text-muted w-10">
              #
            </th>
            <th className="pb-3 pr-6 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Developer
            </th>

            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <th
                key={key}
                className={`pb-3 px-3 text-[10px] font-semibold uppercase tracking-widest cursor-pointer select-none transition-colors duration-150
                  ${sortKey === key ? "text-accent" : "text-text-muted hover:text-text-secondary"}
                `}
                onClick={() => toggleSort(key)}
                aria-sort={sortKey === key ? (sortDir === "desc" ? "descending" : "ascending") : "none"}
              >
                <span className="flex items-center gap-1">
                  {SORT_LABELS[key]}
                  <span className="opacity-60">
                    {sortKey === key ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                  </span>
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const score = entry.totalScore ?? 0;

            return (
              <tr
                key={entry.username}
                className={`
                  border-b border-border/40 transition-colors duration-150 group
                  ${isTop3 ? "bg-accent-muted/30" : "hover:bg-surface-hover"}
                `}
              >
                {/* Rank */}
                <td className="py-3.5 pr-4 w-10">
                  <RankBadge rank={rank} />
                </td>

                {/* Developer */}
                <td className="py-3.5 pr-6">
                  <a
                    href={`/report/${entry.username}`}
                    className="flex items-center gap-3 group/link cursor-pointer"
                    aria-label={`View ${entry.username}'s report`}
                  >
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border border-border group-hover/link:border-accent/40 transition-colors"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-text-primary group-hover/link:text-accent transition-colors truncate">
                        {entry.name || entry.username}
                      </span>
                      {entry.name && entry.name !== entry.username && (
                        <span className="text-xs text-text-muted font-mono truncate">
                          @{entry.username}
                        </span>
                      )}
                    </div>
                  </a>
                </td>

                {/* Dev Score */}
                <td className="py-3.5 px-3">
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{
                      color: score >= 75 ? "#34d399" : score >= 50 ? "#10b981" : score >= 25 ? "#f59e0b" : "#ef4444",
                    }}
                  >
                    {score}
                  </span>
                </td>

                {/* Impact */}
                <td className="py-3.5 px-3 text-text-secondary tabular-nums">
                  {entry.impactScore ?? "—"}
                </td>

                {/* Activity */}
                <td className="py-3.5 px-3 text-text-secondary tabular-nums">
                  {entry.activityScore ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
