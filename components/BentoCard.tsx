interface BentoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  colSpan?: "sm" | "md" | "lg" | "xl";
  rowSpan?: "sm" | "md" | "lg" | 1 | 2 | 3 | 4 | 5 | 6;
  /** Adds a subtle left accent border glow */
  accent?: boolean;
  /** Elevates the section header label — larger text, brighter color, icon prefix */
  hero?: boolean;
}

const colSpanClasses: Record<string, string> = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-2",
  lg: "col-span-1 sm:col-span-3",
  xl: "col-span-1 sm:col-span-4",
};

const rowSpanClasses: Record<string | number, string> = {
  sm: "row-span-1",
  md: "row-span-2",
  lg: "row-span-3",
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
};

export default function BentoCard({
  title,
  children,
  className = "",
  colSpan = "sm",
  rowSpan = "sm",
  accent = false,
  hero = false,
}: BentoCardProps) {
  const hasPadding = className.includes("p-");
  const hasRounded = className.includes("rounded-");

  return (
    <div
      className={`
        relative border border-border bg-surface flex flex-col card-hover overflow-hidden h-full
        ${hasPadding ? "" : "p-5 sm:p-6"}
        ${hasRounded ? "" : "rounded-2xl"}
        ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]}
        ${accent ? "border-l-accent/40 border-l-2" : ""}
        ${className}
      `}
    >
      {/* Subtle top highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-bright to-transparent" />

      {title && (
        hero ? (
          /* Hero label — AI Roast: bigger, brighter, icon prefix */
          <h3 className="mb-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-secondary">
              <span aria-hidden="true" className="text-[13px] leading-none">⚡</span>
              {title}
            </span>
            <span className="h-px flex-1 bg-border" />
          </h3>
        ) : (
          /* Standard label */
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            {title}
            <span className="h-px flex-1 bg-border" />
          </h3>
        )
      )}

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
