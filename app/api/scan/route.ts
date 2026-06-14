import { NextRequest, NextResponse } from "next/server";
import { fetchGithubProfile, fetchGithubRepos } from "@/lib/github";
import { calculateDevScore } from "@/lib/scoring";
import { generateRoast } from "@/lib/roast";
import { supabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const usernameNormalized = username.trim().toLowerCase();

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // 1. Check cache (1 hour TTL)
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
        roast: cachedScore.roast
      });
    }

    // 2. Fetch fresh data
    const profile = await fetchGithubProfile(usernameNormalized);
    const repos = await fetchGithubRepos(usernameNormalized);

    // 3. Calculate scores
    const devScore = calculateDevScore(profile, repos);

    // 4. Generate roast
    const roast = await generateRoast(profile, devScore);

    // 5. Save to Supabase in normalized tables
    const now = new Date().toISOString();

    // Upsert Profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ 
        id: usernameNormalized, 
        data: profile, 
        updated_at: now 
      });

    if (profileError) throw profileError;

    // Upsert Scores
    const { error: scoresError } = await supabase
      .from("scores")
      .upsert({ 
        id: usernameNormalized, 
        profile_id: usernameNormalized,
        data: devScore, 
        roast: roast,
        updated_at: now 
      });

    if (scoresError) throw scoresError;

    // Upsert Leaderboard Denormalized View
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
        updated_at: now
      });

    if (leaderboardError) throw leaderboardError;

    return NextResponse.json({
      profile,
      scores: devScore,
      roast
    });

  } catch (error: any) {
    console.error("Scan error:", error);
    if (error.message && error.message.includes("404")) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
