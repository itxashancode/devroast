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

// Score → color matching the ring scale (low/mid/high)
function scoreColor(s: number): string {
  if (s >= 70) return "#2ed9a0";
  if (s >= 40) return "#eab308";
  return "#ef4444";
}

// Styled circular rank badge — gold / silver / bronze / plain dim
function RankBadge({ rank }: { rank: number }) {
  const top3: Record<number, { bg: string; border: string; color: string }> = {
    1: { bg: "rgba(234,179,8,0.13)",   border: "rgba(234,179,8,0.55)",   color: "#eab308" },
    2: { bg: "rgba(148,163,184,0.13)", border: "rgba(148,163,184,0.55)", color: "#94a3b8" },
    3: { bg: "rgba(180,112,60,0.13)",  border: "rgba(180,112,60,0.55)",  color: "#b4703c" },
  };

  if (rank <= 3) {
    const s = top3[rank];
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black tabular-nums"
        style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
        title={`${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : "rd"} place`}
      >
        {rank}
      </span>
    );
  }

  // Ranks 4+ — subtle dim ring
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums text-text-muted"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {rank}
    </span>
  );
}

// Inline score number + mini progress bar
function ScoreBar({ value }: { value: number }) {
  if (value == null) {
    return <span className="text-text-muted/40 tabular-nums text-sm">—</span>;
  }
  const pct = Math.min(100, Math.max(0, value));
  const color = scoreColor(value);

  return (
    <div className="flex flex-col gap-1.5 min-w-[52px]">
      <span className="text-sm font-bold tabular-nums leading-none" style={{ color }}>
        {value}
      </span>
      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 5px ${color}55`,
          }}
        />
      </div>
    </div>
  );
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

        {/* ── Header ── */}
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.06)" }}>
            <th className="pb-4 pr-4 w-12 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              #
            </th>
            <th className="pb-4 pr-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Developer
            </th>

            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <th
                key={key}
                className={`pb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] cursor-pointer select-none transition-colors duration-150
                  ${sortKey === key ? "text-accent" : "text-text-muted hover:text-text-secondary"}
                `}
                onClick={() => toggleSort(key)}
                aria-sort={
                  sortKey === key
                    ? sortDir === "desc"
                      ? "descending"
                      : "ascending"
                    : "none"
                }
              >
                <span className="flex items-center gap-1">
                  {SORT_LABELS[key]}
                  <span className="opacity-50 text-[9px]">
                    {sortKey === key ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                  </span>
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {sorted.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isEven = index % 2 === 1;
            const score = entry.totalScore ?? 0;

            // Base bg: top-3 gets a faint mint tint, even rows get a very subtle stripe
            const baseBg = isTop3
              ? "rgba(46,217,160,0.025)"
              : isEven
              ? "rgba(255,255,255,0.014)"
              : "transparent";

            return (
              <tr
                key={entry.username}
                className="transition-colors duration-150 cursor-pointer"
                style={{
                  background: baseBg,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.045)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = baseBg;
                }}
              >
                {/* Rank badge */}
                <td className="py-4 pr-4 w-12">
                  <RankBadge rank={rank} />
                </td>

                {/* Developer */}
                <td className="py-4 pr-6">
                  <a
                    href={`/report/${entry.username}`}
                    className="flex items-center gap-3 group/link"
                    aria-label={`View ${entry.username}'s report`}
                  >
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full border border-border group-hover/link:border-accent/40 transition-colors shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-text-primary group-hover/link:text-accent transition-colors truncate">
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

                {/* Dev Score with bar */}
                <td className="py-4 px-3">
                  <ScoreBar value={score} />
                </td>

                {/* Impact with bar */}
                <td className="py-4 px-3">
                  <ScoreBar value={entry.impactScore} />
                </td>

                {/* Activity with bar */}
                <td className="py-4 px-3">
                  <ScoreBar value={entry.activityScore} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
