"use client";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreGauge({
  score,
  label,
  size = 100,
  strokeWidth = 8,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Color tiers: red/orange (<40), yellow (<70), green/mint (70-100)
  const getColor = (s: number) => {
    if (s < 40) return "#ef4444";   // red/orange — low
    if (s < 70) return "#eab308";   // yellow — mid
    return "#2ed9a0";               // mint green — high
  };

  const color = getColor(clampedScore);

  // Score tier label
  const getTier = (s: number) => {
    if (s < 40) return "Low";
    if (s < 70) return "Mid";
    return "High";
  };

  const getSubLabel = (lbl: string, s: number) => {
    const l = lbl.toLowerCase();
    if (l.includes("stars") || l.includes("fork") || l.includes("impact")) {
      if (s < 40) return "under the radar";
      if (s < 70) return "gaining traction";
      return "highly influential";
    }
    if (l.includes("repo") || l.includes("count") || l.includes("activity")) {
      if (s < 40) return "dormant";
      if (s < 70) return "active contributor";
      return "grinding daily";
    }
    if (l.includes("language") || l.includes("versatility")) {
      if (s < 40) return "focused specialist";
      if (s < 70) return "adaptive polyglot";
      return "full-stack wizard";
    }
    if (l.includes("follower") || l.includes("clout")) {
      if (s < 40) return "low profile";
      if (s < 70) return "rising developer";
      return "industry pioneer";
    }
    return null;
  };

  const subLabel = getSubLabel(label, clampedScore);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG ring + centered score text */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute transform -rotate-90"
          aria-label={`${label}: ${clampedScore} out of 100`}
        >
          {/* Track ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#252525"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>

        {/* Score number centered */}
        <div className="flex flex-col items-center">
          {size >= 120 ? (
            /* Large hero ring — gradient text to match wordmark style */
            <span
              className="font-black leading-none tabular-nums"
              style={{
                fontSize: "2.5rem",
                background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 8px ${color}55)`,
              }}
            >
              {clampedScore}
            </span>
          ) : (
            /* Sub-score rings — solid color, lighter weight */
            <span
              className="font-bold leading-none tabular-nums"
              style={{
                color,
                fontSize: size >= 100 ? "1.5rem" : "1.125rem",
              }}
            >
              {clampedScore}
            </span>
          )}
          {size >= 120 && (
            <span className="text-[11px] tracking-[0.06em] text-text-muted mt-1 font-medium">
              {getTier(clampedScore)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {subLabel && (
          <span className="text-[11px] font-medium text-accent-secondary opacity-90 tracking-wide">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
