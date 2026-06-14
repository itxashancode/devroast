import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    // Fetch top 100 profiles sorted by totalscore descending from Supabase
    const { data: topProfiles, error } = await supabase
      .from("leaderboard")
      .select(`
        id,
        username,
        name,
        avatar_url,
        totalScore:totalscore,
        impactScore:impactscore,
        activityScore:activityscore,
        updated_at
      `)
      .order("totalscore", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json(topProfiles || []);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
