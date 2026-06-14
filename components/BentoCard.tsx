interface BentoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  colSpan?: "sm" | "md" | "lg" | "xl";
  rowSpan?: "sm" | "md" | "lg";
  /** Adds a subtle left accent border glow */
  accent?: boolean;
}

const colSpanClasses: Record<string, string> = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-2",
  lg: "col-span-1 sm:col-span-3",
  xl: "col-span-1 sm:col-span-4",
};

const rowSpanClasses: Record<string, string> = {
  sm: "row-span-1",
  md: "row-span-2",
  lg: "row-span-3",
};

export default function BentoCard({
  title,
  children,
  className = "",
  colSpan = "sm",
  rowSpan = "sm",
  accent = false,
}: BentoCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl border border-border bg-surface p-5 sm:p-6
        flex flex-col card-hover overflow-hidden
        ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]}
        ${accent ? "border-l-accent/40 border-l-2" : ""}
        ${className}
      `}
    >
      {/* Subtle top highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-bright to-transparent" />

      {title && (
        <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted flex items-center gap-2">
          <span className="h-px flex-1 bg-border" />
          {title}
          <span className="h-px flex-1 bg-border" />
        </h3>
      )}

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
