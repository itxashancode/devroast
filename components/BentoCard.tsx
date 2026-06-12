interface BentoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  colSpan?: "sm" | "md" | "lg" | "xl";
  rowSpan?: "sm" | "md" | "lg";
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
}: BentoCardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-6 flex flex-col ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]} ${className}`}
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h3>
      <div className="flex-1">{children}</div>
    </div>
  );
}
