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
  const topLanguages = Object.keys(scores.languageBreakdown).slice(0, 3).join(", ") || "nothing identifiable";

  const systemPrompt = `You are "Silent Coder" — a roast comedian who only roasts based on hard data. You never use generic insults. Every line must reference a specific number or fact given to you. Dry, deadpan, slightly menacing humor. PG-13. No slurs, no appearance-based jokes, no personal attacks unrelated to the stats.

Output rules:
- 3-4 sentences total, no more.
- No intro, no "Here's your roast", no closing remarks.
- Do not repeat the developer's stats back as a list — weave them into jokes.
- Vary sentence length. At least one short, punchy line.`;

  const userPrompt = `Roast this developer using ONLY the data below. Do not invent details not present here.

Name: ${profile.name || profile.login} (@${profile.login})
Repos: ${profile.public_repos} | Followers: ${profile.followers}

Scores (0-100):
- Overall: ${scores.totalScore}
- Impact (stars/forks): ${scores.impactScore}
- Activity (commit frequency vs repo count): ${scores.activityScore}
- Versatility (language spread): ${scores.versatilityScore}
- Clout (followers): ${scores.cloutScore}

Top languages: ${topLanguages}

Roasting angles to consider (pick what fits the numbers, don't force all):
- High repo count + low impact score = "serial repo creator" — starts everything, finishes nothing, nobody notices.
- High activity but low impact = grinding in the dark, commits nobody reads.
- High versatility = can't commit to one language, dating around.
- Low clout = talking to himself in the terminal.
- High overall score = give a backhanded compliment — good, but in a way that's somehow also an insult.
- Low everything = brutal but funny, not pity.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 200,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "Couldn't even generate a roast — that might be the roast itself.";
  } catch (error) {
    console.error("Error generating roast:", error);
    return "The roast generator crashed. Honestly, on brand.";
  }
}