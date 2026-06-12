"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  };
  roast: string;
}

export default function ReportPage() {
  const params = useParams();
  const username = params?.username as string;

  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchReport = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/scan?username=${encodeURIComponent(username)}`);
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(
            errBody?.error || `HTTP ${res.status}: Failed to scan profile`
          );
        }
        const result: ScanResult = await res.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [username]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-accent animate-pulse-glow">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <div className="h-2 w-2 rounded-full bg-accent" />
            <div className="h-2 w-2 rounded-full bg-accent" />
          </div>
          <p className="text-sm text-text-muted">
            Scanning @{username}&apos;s GitHub data...
          </p>
          <div className="relative mt-4 h-0.5 w-64 overflow-hidden rounded-full bg-border">
            <div className="absolute left-0 h-full w-1/3 rounded-full gradient-accent animate-scan-line" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-4xl">⚠</div>
          <h2 className="text-xl font-bold text-text-primary">
            Scan Failed
          </h2>
          <p className="max-w-md text-sm text-text-secondary">{error}</p>
          <a
            href="/"
            className="rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, scores, roast } = data;
  const displayName = profile.name || profile.login;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <a
          href="/"
          className="text-xs text-text-muted hover:text-accent transition-colors"
        >
          &larr; New Scan
        </a>
        <a
          href="/leaderboard"
          className="text-xs text-text-muted hover:text-accent transition-colors"
        >
          Leaderboard &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-5">
        <BentoCard
          title="Developer"
          colSpan="md"
          className="flex-row items-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="h-16 w-16 rounded-full border-2 border-border sm:h-20 sm:w-20"
            />
            <div>
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                {displayName}
              </h2>
              <p className="font-mono text-sm text-text-secondary">
                @{profile.login}
              </p>
              {profile.bio && (
                <p className="mt-1 max-w-md text-sm text-text-muted line-clamp-2">
                  {profile.bio}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                {profile.company && <span>{profile.company}</span>}
                {profile.location && <span>{profile.location}</span>}
                <span>{profile.public_repos} repos</span>
                <span>{profile.followers} followers</span>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard title="Dev Score" colSpan="md">
          <div className="relative flex items-center justify-center">
            <ScoreGauge
              score={scores.totalScore}
              label="Overall"
              size={130}
            />
          </div>
        </BentoCard>

        <BentoCard title="Impact" colSpan="sm">
          <div className="flex items-center justify-center">
            <ScoreGauge
              score={scores.impactScore}
              label="Stars & Forks"
              size={90}
            />
          </div>
        </BentoCard>

        <BentoCard title="Activity" colSpan="sm">
          <div className="flex items-center justify-center">
            <ScoreGauge
              score={scores.activityScore}
              label="Repo Count"
              size={90}
            />
          </div>
        </BentoCard>

        <BentoCard title="Versatility" colSpan="sm">
          <div className="flex items-center justify-center">
            <ScoreGauge
              score={scores.versatilityScore}
              label="Languages"
              size={90}
            />
          </div>
        </BentoCard>

        <BentoCard title="Clout" colSpan="sm">
          <div className="flex items-center justify-center">
            <ScoreGauge
              score={scores.cloutScore}
              label="Followers"
              size={90}
            />
          </div>
        </BentoCard>

        <BentoCard title="Languages" colSpan="xl">
          <LanguageBreakdown languages={scores.languageBreakdown} />
        </BentoCard>

        <BentoCard title="AI Roast" colSpan="xl">
          <RoastCard roast={roast} username={profile.login} />
        </BentoCard>
      </div>
    </div>
  );
}
