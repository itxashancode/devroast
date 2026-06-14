"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import BentoCard from "@/components/BentoCard";
import ScoreGauge from "@/components/ScoreGauge";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import RoastCard from "@/components/RoastCard";

interface TopRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
}

interface ScanResult {
  profile: {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    company: string | null;
    location: string | null;
    blog: string | null;
    created_at: string;
  };
  scores: {
    totalScore: number;
    impactScore: number;
    activityScore: number;
    versatilityScore: number;
    cloutScore: number;
    languageBreakdown: Record<string, number>;
    tips: string[];
  };
  roast: string;
  topRepos: TopRepo[];
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 min-w-[72px] hover:border-accent/30 transition-colors">
      <span className="text-base font-bold text-text-primary tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
    </div>
  );
}

// Language color dots for repo cards
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", Swift: "#F05138",
  Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26", CSS: "#563d7c",
  Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}yr ago`;
}

export default function ReportPage() {
  const params = useParams();
  const username = params?.username as string;

  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!username) return;

    const timer1 = setTimeout(() => setLoadingStep(1), 800);
    const timer2 = setTimeout(() => setLoadingStep(2), 1600);

    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/scan?username=${encodeURIComponent(username)}`);
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error || `HTTP ${res.status}: Failed to scan profile`);
        }
        const result: ScanResult = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [username]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4 gap-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                className="h-3 w-3 rounded-full bg-accent"
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-mono text-text-muted">
              Scanning <span className="text-accent font-bold">@{username}</span>
            </p>
            <div className="relative h-1 w-64 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ left: "-30%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-1/3 rounded-full gradient-accent"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 text-xs font-mono text-text-muted/80 max-w-xs w-full bg-surface-2/40 border border-border/50 p-4 rounded-xl">
            {[
              "Extracting GitHub profile & public repositories",
              "Calculating metrics & sub-scores",
              "Generating customized AI roast & recommendations",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className={loadingStep >= i ? "text-accent" : "text-text-muted/30"}>
                  {loadingStep > i ? "✓" : loadingStep === i ? "●" : "○"}
                </span>
                <span className={loadingStep === i ? "text-text-primary" : "text-text-muted"}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 text-center max-w-sm p-8 rounded-2xl border border-error/20 bg-error/5 backdrop-blur-md"
        >
          <div className="h-16 w-16 rounded-2xl border border-error/30 bg-error/10 flex items-center justify-center text-2xl">⚠️</div>
          <h2 className="text-xl font-bold text-text-primary">Scan Failed</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{error}</p>
          <a href="/" className="rounded-xl gradient-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer shadow-lg shadow-accent/20">
            Try Again
          </a>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, scores, roast, topRepos = [] } = data;
  const displayName = profile.name || profile.login;
  const joinYear = new Date(profile.created_at).getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  } as const;

  // Dynamic row spans based on content length
  const roastWords = roast.split(/\s+/).length;
  const roastRowSpan = roastWords > 60 ? 4 : roastWords > 30 ? 3 : 2;
  const langCount = Object.keys(scores.languageBreakdown).length;
  const langRowSpan = langCount > 5 ? 3 : 2;
  const tipsCount = scores.tips?.length || 0;
  const tipsRowSpan = tipsCount > 2 ? 3 : 2;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      {/* Top nav */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center justify-between">
        <a href="/" className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer flex items-center gap-1 font-mono">
          ← New Scan
        </a>
        <a href="/leaderboard" className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer font-mono">
          Leaderboard →
        </a>
      </motion.div>

      {/* Bento Grid — dense packing, 4-col desktop / 2-col tablet / 1-col mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 grid-flow-row-dense auto-rows-[130px]"
      >

        {/* ── Profile Header (full width, 2 rows) ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2 lg:col-span-4 row-span-2">
          <BentoCard colSpan="xl" rowSpan={2} accent className="rounded-3xl bg-surface-header p-6 sm:p-8 hover:bg-surface-hover">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7 h-full">
              {/* Clickable avatar → GitHub profile */}
              <a
                href={`https://github.com/${profile.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 group"
                title={`Open @${profile.login} on GitHub`}
              >
                <img
                  src={profile.avatar_url}
                  alt={`${profile.login} avatar`}
                  className="h-20 w-20 rounded-2xl border-2 border-border/80 sm:h-24 sm:w-24 object-cover shadow-lg group-hover:border-accent/60 group-hover:scale-[1.03] transition-all duration-200"
                />
                <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full border-2 border-background bg-accent" title="Public profile" />
                {/* GitHub icon overlay on hover */}
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                  GitHub ↗
                </span>
              </a>

              {/* Info */}
              <div className="flex flex-col gap-3 min-w-0 flex-1">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">{displayName}</h2>
                    <span className="badge">Since {joinYear}</span>
                  </div>
                  <p className="font-mono text-sm text-text-muted">@{profile.login}</p>
                </div>
                {profile.bio && (
                  <p className="text-sm text-text-secondary leading-relaxed max-w-lg line-clamp-2">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                  {profile.company && (
                    <span className="flex items-center gap-1 rounded-md border border-border/80 px-2 py-1 bg-surface-2/40">🏢 {profile.company}</span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1 rounded-md border border-border/80 px-2 py-1 bg-surface-2/40">📍 {profile.location}</span>
                  )}
                  {profile.blog && (
                    <a
                      href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-md border border-border/80 px-2 py-1 bg-surface-2/40 hover:border-accent/50 transition-colors cursor-pointer"
                    >
                      🔗 {profile.blog}
                    </a>
                  )}
                </div>
              </div>

              {/* Stats pills */}
              <div className="flex gap-2 shrink-0 flex-wrap sm:flex-col sm:flex-nowrap">
                <StatPill label="Repos" value={profile.public_repos} />
                <StatPill label="Followers" value={profile.followers} />
                <StatPill label="Following" value={profile.following} />
              </div>
            </div>
          </BentoCard>
        </motion.div>

        {/* ── AI Roast — Hero card (2 cols, dynamic rows) ── */}
        <motion.div variants={cardVariants} className={`col-span-1 sm:col-span-2 row-span-${roastRowSpan}`}>
          <div className="relative rounded-3xl h-full" style={{ boxShadow: "0 0 40px rgba(168,85,247,0.14), 0 0 80px rgba(168,85,247,0.06)" }}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: "radial-gradient(ellipse at top left, rgba(168,85,247,0.11) 0%, rgba(46,217,160,0.04) 60%, transparent 100%)" }}
            />
            <BentoCard
              title="AI Roast"
              colSpan="md"
              rowSpan={roastRowSpan as any}
              hero
              className="rounded-3xl bg-surface-roast p-7 sm:p-9 border-accent-secondary/30 h-full"
            >
              <RoastCard roast={roast} username={profile.login} />
            </BentoCard>
          </div>
        </motion.div>

        {/* ── Overall Dev Score (1 col, 2 rows) ── */}
        <motion.div variants={cardVariants} className="col-span-1 row-span-2">
          <BentoCard title="Dev Score" colSpan="sm" rowSpan={2} className="rounded-3xl bg-surface-score p-5 sm:p-6 hover:bg-surface-hover h-full">
            <div className="flex h-full items-center justify-center">
              <ScoreGauge score={scores.totalScore} label="Overall" size={150} strokeWidth={11} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Impact (1 col, 1 row) ── */}
        <motion.div variants={cardVariants} className="col-span-1 row-span-1">
          <BentoCard title="Impact" colSpan="sm" rowSpan={1} className="rounded-2xl bg-surface-subscore p-4 hover:bg-surface-hover h-full">
            <div className="flex items-center justify-center h-full pb-1">
              <ScoreGauge score={scores.impactScore} label="Stars & Forks" size={90} strokeWidth={7} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Activity (1 col, 1 row) ── */}
        <motion.div variants={cardVariants} className="col-span-1 row-span-1">
          <BentoCard title="Activity" colSpan="sm" rowSpan={1} className="rounded-2xl bg-surface-subscore p-4 hover:bg-surface-hover h-full">
            <div className="flex items-center justify-center h-full pb-1">
              <ScoreGauge score={scores.activityScore} label="Commit Frequency" size={90} strokeWidth={7} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Versatility (1 col, 1 row) ── */}
        <motion.div variants={cardVariants} className="col-span-1 row-span-1">
          <BentoCard title="Versatility" colSpan="sm" rowSpan={1} className="rounded-2xl bg-surface-subscore p-4 hover:bg-surface-hover h-full">
            <div className="flex items-center justify-center h-full pb-1">
              <ScoreGauge score={scores.versatilityScore} label="Languages" size={90} strokeWidth={7} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Clout (1 col, 1 row) ── */}
        <motion.div variants={cardVariants} className="col-span-1 row-span-1">
          <BentoCard title="Clout" colSpan="sm" rowSpan={1} className="rounded-2xl bg-surface-subscore p-4 hover:bg-surface-hover h-full">
            <div className="flex items-center justify-center h-full pb-1">
              <ScoreGauge score={scores.cloutScore} label="Followers" size={90} strokeWidth={7} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Languages (1 col, dynamic rows) ── */}
        <motion.div variants={cardVariants} className={`col-span-1 row-span-${langRowSpan}`}>
          <BentoCard title="Languages" colSpan="sm" rowSpan={langRowSpan as any} className="rounded-2xl bg-surface-languages p-5 sm:p-6 hover:bg-surface-hover h-full">
            <LanguageBreakdown languages={scores.languageBreakdown} />
          </BentoCard>
        </motion.div>

        {/* ── Action Plan (2 cols, dynamic rows) ── */}
        <motion.div variants={cardVariants} className={`col-span-1 sm:col-span-2 row-span-${tipsRowSpan}`}>
          <BentoCard title="Action Plan" colSpan="md" rowSpan={tipsRowSpan as any} className="rounded-2xl bg-surface-action p-5 sm:p-6 hover:bg-surface-hover h-full">
            <div className="flex flex-col gap-3.5 py-1">
              {scores.tips && scores.tips.length > 0 ? (
                scores.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="text-accent-secondary text-lg mt-[-2px] shrink-0">✦</span>
                    <p>{tip}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="text-accent-secondary text-lg mt-[-2px] shrink-0">✦</span>
                  <p>Your profile is solid! Focus on building high-impact tools or open source contributions to keep scaling your score.</p>
                </div>
              )}
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Latest Repos (full width, auto rows) ── */}
        {topRepos.length > 0 && (
          <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2 lg:col-span-4 row-span-3">
            <BentoCard title="Latest Repositories" colSpan="xl" rowSpan={3} className="rounded-3xl bg-surface-header p-5 sm:p-6 hover:bg-surface-hover h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-full content-start">
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-2 rounded-xl border border-border/60 bg-surface-2/40 p-3.5 hover:border-accent/40 hover:bg-surface-2/70 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                        {repo.name}
                      </span>
                      <span className="text-text-muted text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-auto">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#8b8b8b" }}
                          />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">🍴 {repo.forks_count}</span>
                      )}
                      <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </BentoCard>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
