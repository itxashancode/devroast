# DevRoast — Brain & Context Transfer

This document serves as the "brain" for the DevRoast project, transferring all context, rules, constraints, and progress from Agent A (Data + Scoring) to the rest of the team (Agent B & Agent C). 

## 1. Project Context
**DevRoast** is a GitHub Developer Roast & Proof-of-Work Generator for Devlynix Buildathon 2.0 (Track 5). 
A user enters a GitHub username, the app fetches live public data, scores it via a custom engine, caches results in MongoDB, generates an LLM roast (via Groq), and renders everything in a Bento-grid report card.

### Non-Negotiable Constraints & Rubric Focus
- **No mock data:** All data must come from the real GitHub REST API.
- **Scoring Engine is the core:** It must be a pure, side-effect-free function (implemented in `lib/scoring.ts`).
- **Grounding the LLM:** The LLM prompt must receive computed scores, not raw API JSON.
- **Database Normalization:** MongoDB must have 3 distinct collections (`profiles`, `scores`, `leaderboard`).
- **Aesthetics:** Deep charcoal background, forest green accents, Bento grid layout ("Silent Coder" aesthetic). No placeholders or generic templates.
- **Explainable Code:** Prioritize simple, well-commented code that the team can explain on video.

---

## 2. What Agent A Accomplished

Agent A was responsible for the Data and Scoring vertical slice. The following has been implemented and tested:

1. **Next.js Initialization**
   - Bootstrapped a Next.js App Router project (with Tailwind CSS and TypeScript) directly in the root folder.
   
2. **Core TypeScript Types (`types/index.ts`)**
   - `GithubProfile`: Normalized user info.
   - `GithubRepo`: Normalized repository info.
   - `DevScore`: The scoring engine output (impact, activity, versatility, clout, and language breakdown).

3. **GitHub API Integration (`lib/github.ts`)**
   - `fetchGithubProfile(username)` and `fetchGithubRepos(username)` functions implemented.
   - Normalized REST API responses, handling pagination/sorting, and supporting an optional `GITHUB_TOKEN` environment variable.

4. **Pure Scoring Engine (`lib/scoring.ts`)**
   - `calculateDevScore(profile, repos)` implemented as a pure function.
   - Weights both stars/forks (Impact) and commit/repo frequency (Activity) as requested by the user.

---

## 3. Handoff: Next Steps for Agent B (Frontend/UI)

**Your Vertical Slice:** `/app`, `/components`, Tailwind config, design tokens.
- **Setup Styling:** Configure Tailwind for the "Silent Coder" aesthetic (deep charcoal, forest green accents).
- **Build the Landing Page (`/app/page.tsx`):** A sleek input form for a GitHub username.
- **Build the Bento Report Card (`/app/report/[username]/page.tsx`):** Use the `DevScore` type from `types/index.ts`. Create components like `BentoCard.tsx`, `ScoreGauge.tsx`, `LanguageBreakdown.tsx`, and `RoastCard.tsx`.
- **Leaderboard UI (`/app/leaderboard/page.tsx`):** Create the `LeaderboardTable.tsx`.
- *Constraint Reminder:* No lorem-ipsum or placeholder content. Hide unfinished features.

---

## 4. Handoff: Next Steps for Agent C (Infra/Integration)

**Your Vertical Slice:** `lib/db.ts`, `lib/roast.ts`, API routes, deployment config, and End-to-End integration.
- **Database Layer (`lib/db.ts`):** Connect to MongoDB Atlas. Ensure normalized collections (`profiles` with TTL, `scores`, `leaderboard`).
- **LLM Roast Engine (`lib/roast.ts`):** Integrate the Groq API. Build a prompt that accepts the computed `DevScore` to generate the roast text.
- **Orchestration Route (`/app/api/scan/route.ts`):** 
  1. Call `fetchGithubProfile` and `fetchGithubRepos` (from Agent A).
  2. Run `calculateDevScore` (from Agent A).
  3. Call Groq for the roast.
  4. Save all normalized data to MongoDB collections.
- **Leaderboard Route (`/app/api/leaderboard/route.ts`):** Read from the denormalized leaderboard collection.
- *Constraint Reminder:* Run end-to-end local testing with a real username before declaring any feature merged.
