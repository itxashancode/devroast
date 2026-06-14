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

  // Color tiers
  const getColor = (s: number) => {
    if (s < 25) return "#ef4444";   // red — low
    if (s < 50) return "#f59e0b";   // amber — mid
    if (s < 75) return "#10b981";   // green — great
    return "#34d399";               // bright green — elite
  };

  const color = getColor(clampedScore);

  // Score tier label
  const getTier = (s: number) => {
    if (s < 25) return "Low";
    if (s < 50) return "Mid";
    if (s < 75) return "Great";
    return "Elite";
  };

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
          <span
            className="font-bold leading-none tabular-nums"
            style={{
              color,
              fontSize: size >= 120 ? "2rem" : size >= 100 ? "1.5rem" : "1.125rem",
            }}
          >
            {clampedScore}
          </span>
          {size >= 120 && (
            <span className="text-xs text-text-muted mt-0.5">
              {getTier(clampedScore)}
            </span>
          )}
        </div>
      </div>

      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}
