import { NextRequest, NextResponse } from "next/server";
import { fetchGithubProfile, fetchGithubRepos } from "@/lib/github";
import { calculateDevScore } from "@/lib/scoring";
import { generateRoast } from "@/lib/roast";
import { supabase } from "@/lib/db";

// ─── In-memory rate limiter (per IP, resets per window) ──────────────────────
// 10 scans per IP per 60 seconds — prevents Groq/GitHub API quota abuse.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

// GitHub username spec: alphanumeric + hyphens, no leading/trailing hyphens, max 39 chars
const VALID_USERNAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;

export async function GET(request: NextRequest) {
  // 1. Rate limit check
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Wait a moment before scanning again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // 2. Input validation — length cap + strict format allowlist
  if (username.length > 39) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  if (!VALID_USERNAME_RE.test(username)) {
    return NextResponse.json({ error: "Invalid GitHub username format" }, { status: 400 });
  }

  const usernameNormalized = username.trim().toLowerCase();

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // 3. Check cache (1 hour TTL)
    const { data: cachedProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", usernameNormalized)
      .gt("updated_at", oneHourAgo)
      .maybeSingle();

    const { data: cachedScore } = await supabase
      .from("scores")
      .select("*")
      .eq("id", usernameNormalized)
      .maybeSingle();

    const { data: cachedLeaderboard } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("id", usernameNormalized)
      .maybeSingle();

    if (cachedProfile && cachedScore && cachedLeaderboard) {
      return NextResponse.json({
        profile: cachedProfile.data,
        scores: cachedScore.data,
        roast: cachedScore.roast,
      });
    }

    // 4. Fetch fresh data from GitHub
    const profile = await fetchGithubProfile(usernameNormalized);
    const repos = await fetchGithubRepos(usernameNormalized);

    // 5. Calculate scores
    const devScore = calculateDevScore(profile, repos);

    // 5b. Top 5 recently-pushed non-fork repos for the "Latest Repos" card
    const topRepos = repos
      .filter((r) => !r.fork)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        pushed_at: r.pushed_at,
      }));

    // 6. Generate LLM roast
    const roast = await generateRoast(profile, devScore);

    // 7. Persist to Supabase
    const now = new Date().toISOString();

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: usernameNormalized, data: profile, updated_at: now });
    if (profileError) throw profileError;

    const { error: scoresError } = await supabase
      .from("scores")
      .upsert({
        id: usernameNormalized,
        profile_id: usernameNormalized,
        data: devScore,
        roast,
        updated_at: now,
      });
    if (scoresError) throw scoresError;

    const { error: leaderboardError } = await supabase
      .from("leaderboard")
      .upsert({
        id: usernameNormalized,
        username: profile.login,
        name: profile.name || profile.login,
        avatar_url: profile.avatar_url,
        totalscore: devScore.totalScore,
        impactscore: devScore.impactScore,
        activityscore: devScore.activityScore,
        updated_at: now,
      });
    if (leaderboardError) throw leaderboardError;

    return NextResponse.json({ profile, scores: devScore, roast, topRepos });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("404")) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }

    // Full error logged server-side only — never leaks to client
    console.error("[scan] error for", usernameNormalized, "—", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
