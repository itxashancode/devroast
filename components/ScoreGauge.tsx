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

  const getColor = (s: number) => {
    if (s < 25) return "#ef4444";
    if (s < 50) return "#f59e0b";
    if (s < 75) return "#10b981";
    return "#34d399";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(clampedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span
          className="text-2xl font-bold"
          style={{ color: getColor(clampedScore) }}
        >
          {clampedScore}
        </span>
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </span>
    </div>
  );
}
