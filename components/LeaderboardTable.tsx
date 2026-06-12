"use client";

import { useState, useMemo } from "react";

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

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

type SortKey = "totalScore" | "impactScore" | "activityScore" | "versatilityScore" | "cloutScore" | "followers" | "public_repos";

const SORT_LABELS: Record<SortKey, string> = {
  totalScore: "Dev Score",
  impactScore: "Impact",
  activityScore: "Activity",
  versatilityScore: "Versatility",
  cloutScore: "Clout",
  followers: "Followers",
  public_repos: "Repos",
};

export default function LeaderboardTable({
  entries,
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalScore");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const sorted = useMemo(() => {
    const copy = [...entries];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
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

  const activeSortLabel = SORT_LABELS[sortKey];

  return (
    <div className="overflow-x-auto">
      {sorted.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-text-muted">No entries yet. Be the first to scan a profile!</p>
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest text-text-muted">
              <th className="pb-3 pr-4 font-medium">#</th>
              <th className="pb-3 pr-4 font-medium">Developer</th>
              {(
                Object.keys(SORT_LABELS) as SortKey[]
              ).map((key) => (
                <th
                  key={key}
                  className={`pb-3 px-3 font-medium cursor-pointer hover:text-accent transition-colors ${
                    sortKey === key ? "text-accent" : ""
                  }`}
                  onClick={() => toggleSort(key)}
                >
                  {SORT_LABELS[key]}
                  {sortKey === key && (
                    <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, index) => (
              <tr
                key={entry.username}
                className="border-b border-border/50 transition-colors hover:bg-surface-hover"
              >
                <td className="py-3 pr-4 text-text-muted">{index + 1}</td>
                <td className="py-3 pr-4">
                  <a
                    href={`/report/${entry.username}`}
                    className="flex items-center gap-3 hover:text-accent transition-colors"
                  >
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      className="h-7 w-7 rounded-full"
                    />
                    <span className="font-medium text-text-primary">
                      {entry.username}
                    </span>
                  </a>
                </td>
                <td className="py-3 px-3 font-bold text-accent">
                  {entry.totalScore}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.impactScore}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.activityScore}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.versatilityScore}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.cloutScore}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.followers}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  {entry.public_repos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
