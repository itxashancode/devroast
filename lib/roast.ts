import Groq from "groq-sdk";
import { GithubProfile, DevScore } from "../types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
});

/**
 * Generates a "brutally honest" roast based on computed scores and profile facts.
 * Receives NO raw API JSON.
 */
export async function generateRoast(profile: GithubProfile, scores: DevScore): Promise<string> {
  const prompt = `You are an elite, brutally honest developer roaster. Your job is to playfully but sharply roast a developer based strictly on the following metrics. Do not hold back, but keep it PG-13. The tone should be witty and "Silent Coder" aesthetic. Be concise, max 3-4 sentences.

Developer Name: ${profile.name || profile.login}
GitHub Handle: @${profile.login}
Total Repos: ${profile.public_repos}
Followers: ${profile.followers}

Computed Metrics:
- Overall Dev Score: ${scores.totalScore}/100
- Impact (Stars/Forks): ${scores.impactScore}/100
- Activity (Commit Frequency/Repo Count): ${scores.activityScore}/100
- Versatility (Languages): ${scores.versatilityScore}/100
- Clout (Followers): ${scores.cloutScore}/100

Primary Languages: ${Object.keys(scores.languageBreakdown).slice(0, 3).join(", ") || "None"}

Roast them based on these stats. If they have lots of repos but low impact, call them a "serial repo creator". If they have a high score, give them a backhanded compliment. Focus heavily on the metrics provided.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0]?.message?.content || "No roast generated. Your code is probably too boring.";
  } catch (error) {
    console.error("Error generating roast:", error);
    return "Error generating roast. You got lucky this time.";
  }
}
