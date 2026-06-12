interface RoastCardProps {
  roast: string;
  username: string;
}

export default function RoastCard({ roast, username }: RoastCardProps) {
  return (
    <div className="relative flex flex-col gap-3">
      <span className="text-4xl leading-none text-accent/30 select-none">
        &ldquo;
      </span>
      <p className="text-base leading-relaxed text-text-primary sm:text-lg">
        {roast}
      </p>
      <span className="self-end text-4xl leading-none text-accent/30 select-none">
        &rdquo;
      </span>
      <p className="mt-2 text-xs text-text-muted">
        — AI roast for{" "}
        <span className="font-mono text-text-secondary">@{username}</span>
      </p>
    </div>
  );
}
