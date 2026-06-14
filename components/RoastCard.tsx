"use client";

interface RoastCardProps {
  roast: string;
  username: string;
}

export default function RoastCard({ roast, username }: RoastCardProps) {
  return (
    <div className="relative flex flex-col gap-4">
      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        className="absolute -top-2 -left-1 text-7xl font-serif leading-none select-none pointer-events-none"
        style={{ color: "rgba(16,185,129,0.15)", fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </div>

      {/* Roast text */}
      <p className="pl-4 text-base leading-relaxed text-text-primary sm:text-lg relative z-10">
        {roast}
      </p>

      {/* Attribution row */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        {/* Accent bar */}
        <div className="h-4 w-0.5 rounded-full gradient-accent shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">AI Roast by</span>
          <span className="font-mono text-sm text-accent">
            @{username}
          </span>
        </div>
        <div className="ml-auto">
          <span className="badge">llama-3.3-70b</span>
        </div>
      </div>
    </div>
  );
}
