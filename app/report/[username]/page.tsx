"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BentoCard from "@/components/BentoCard";
import ScoreGauge from "@/components/ScoreGauge";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import RoastCard from "@/components/RoastCard";

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
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 min-w-[72px] hover:border-accent/30 transition-colors">
      <span className="text-base font-bold text-text-primary tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
    </div>
  );
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

    // Simulate step-by-step loading for premium UX feel
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

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [username]);

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4 gap-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
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

          {/* Dynamic Loading Stages */}
          <div className="flex flex-col gap-2.5 text-xs font-mono text-text-muted/80 max-w-xs w-full bg-surface-2/40 border border-border/50 p-4 rounded-xl">
            <div className="flex items-center gap-2.5">
              <span className={loadingStep >= 0 ? "text-accent" : "text-text-muted/30"}>
                {loadingStep > 0 ? "✓" : "●"}
              </span>
              <span className={loadingStep === 0 ? "text-text-primary" : "text-text-muted"}>
                Extracting GitHub profile & public repositories
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={loadingStep >= 1 ? "text-accent" : "text-text-muted/30"}>
                {loadingStep > 1 ? "✓" : loadingStep === 1 ? "●" : "○"}
              </span>
              <span className={loadingStep === 1 ? "text-text-primary" : "text-text-muted"}>
                Calculating metrics & sub-scores
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={loadingStep >= 2 ? "text-accent" : "text-text-muted/30"}>
                {loadingStep > 2 ? "✓" : loadingStep === 2 ? "●" : "○"}
              </span>
              <span className={loadingStep === 2 ? "text-text-primary" : "text-text-muted"}>
                Generating customized AI roast & recommendations
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error State ---------- */
  if (error) {
    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 text-center max-w-sm p-8 rounded-2xl border border-error/20 bg-error/5 backdrop-blur-md"
        >
          <div className="h-16 w-16 rounded-2xl border border-error/30 bg-error/10 flex items-center justify-center text-2xl text-error">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-text-primary">Scan Failed</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{error}</p>
          <a
            href="/"
            className="rounded-xl gradient-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer shadow-lg shadow-accent/20"
          >
            Try Again
          </a>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, scores, roast } = data;
  const displayName = profile.name || profile.login;
  const joinYear = new Date(profile.created_at).getFullYear();

  // Animation variants for Staggered Bento Cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Top navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <a href="/" className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer flex items-center gap-1 font-mono">
          ← New Scan
        </a>
        <a href="/leaderboard" className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer font-mono">
          Leaderboard →
        </a>
      </motion.div>

      {/* Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-4"
      >

        {/* ── Developer Profile Card (full width) ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-4">
          <BentoCard colSpan="xl" accent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={profile.avatar_url}
                  alt={`${profile.login} avatar`}
                  className="h-20 w-20 rounded-2xl border-2 border-border/80 sm:h-24 sm:w-24 object-cover shadow-lg"
                />
                <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full border-2 border-background bg-accent" title="Public profile" />
              </div>

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
                  <p className="text-sm text-text-secondary leading-relaxed max-w-lg line-clamp-2">
                    {profile.bio}
                  </p>
                )}

                {/* Quick facts */}
                <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                  {profile.company && (
                    <span className="flex items-center gap-1 rounded-md border border-border/80 px-2 py-1 bg-surface-2/40">
                      🏢 {profile.company}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1 rounded-md border border-border/80 px-2 py-1 bg-surface-2/40">
                      📍 {profile.location}
                    </span>
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

        {/* ── Overall Dev Score (large) ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2">
          <BentoCard title="Dev Score" colSpan="md">
            <div className="flex h-full items-center justify-center py-2">
              <ScoreGauge score={scores.totalScore} label="Overall" size={150} strokeWidth={10} />
            </div>
          </BentoCard>
        </motion.div>

        {/* ── AI Roast ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2">
          <BentoCard title="AI Roast" colSpan="md">
            <RoastCard roast={roast} username={profile.login} />
          </BentoCard>
        </motion.div>

        {/* ── Languages ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2">
          <BentoCard title="Language Breakdown" colSpan="md">
            <LanguageBreakdown languages={scores.languageBreakdown} />
          </BentoCard>
        </motion.div>

        {/* ── Action/Improvement Plan Tips ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-2">
          <BentoCard title="Action Plan" colSpan="md">
            <div className="flex flex-col gap-3.5 py-1">
              {scores.tips && scores.tips.length > 0 ? (
                scores.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="text-accent text-lg mt-[-2px]">✦</span>
                    <p>{tip}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="text-accent text-lg mt-[-2px]">✦</span>
                  <p>Your profile is solid! Focus on building high-impact tools or open source contributions to keep scaling your score.</p>
                </div>
              )}
            </div>
          </BentoCard>
        </motion.div>

        {/* ── Sub-score cards ── */}
        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-1">
          <BentoCard title="Impact" colSpan="sm">
            <div className="flex items-center justify-center py-2">
              <ScoreGauge score={scores.impactScore} label="Stars & Forks" size={100} />
            </div>
          </BentoCard>
        </motion.div>

        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-1">
          <BentoCard title="Activity" colSpan="sm">
            <div className="flex items-center justify-center py-2">
              <ScoreGauge score={scores.activityScore} label="Repo Count" size={100} />
            </div>
          </BentoCard>
        </motion.div>

        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-1">
          <BentoCard title="Versatility" colSpan="sm">
            <div className="flex items-center justify-center py-2">
              <ScoreGauge score={scores.versatilityScore} label="Languages" size={100} />
            </div>
          </BentoCard>
        </motion.div>

        <motion.div variants={cardVariants} className="col-span-1 sm:col-span-1">
          <BentoCard title="Clout" colSpan="sm">
            <div className="flex items-center justify-center py-2">
              <ScoreGauge score={scores.cloutScore} label="Followers" size={100} />
            </div>
          </BentoCard>
        </motion.div>

      </motion.div>
    </div>
  );
}
