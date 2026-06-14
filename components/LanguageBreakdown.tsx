"use client";

interface LanguageBreakdownProps {
  languages: Record<string, number>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python:     "#3572a5",
  Go:         "#00add8",
  Rust:       "#dea584",
  Java:       "#b07219",
  "C++":      "#f34b7d",
  C:          "#a8b9cc",
  "C#":       "#178600",
  Ruby:       "#cc342d",
  PHP:        "#4f5d95",
  Swift:      "#f05138",
  Kotlin:     "#a97bff",
  Dart:       "#00b4ab",
  HTML:       "#e34c26",
  CSS:        "#563d7c",
  Shell:      "#89e051",
  Lua:        "#000080",
  Scala:      "#c22d40",
  Elixir:     "#4e2a59",
  Haskell:    "#5e5086",
  Vue:        "#41b883",
  Svelte:     "#ff3e00",
};

const FALLBACK_COLORS = [
  "#6b7280", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f97316", "#84cc16", "#06b6d4", "#a855f7",
];

export default function LanguageBreakdown({
  languages,
}: LanguageBreakdownProps) {
  const entries = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-8">
        <p className="text-sm text-text-muted">No languages detected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {entries.map(([lang, count], index) => {
        const percentage = Math.round((count / total) * 100);
        const color =
          LANGUAGE_COLORS[lang] ||
          FALLBACK_COLORS[index % FALLBACK_COLORS.length];

        return (
          <div key={lang} className="flex flex-col gap-1">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}66` }}
                />
                <span className="text-sm text-text-primary font-medium">{lang}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted tabular-nums">
                <span>{count} repo{count !== 1 ? "s" : ""}</span>
                <span className="font-semibold" style={{ color }}>{percentage}%</span>
              </div>
            </div>

            {/* Animated progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}55`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
