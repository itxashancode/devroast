# DevRoast — GitHub Developer Roast & Proof-of-Work Generator

Built for Devlynix Buildathon 2.0, Track 5 (Dynamic Proof-of-Work Generator).

## 1. What This Project Is

A web app where a user enters a GitHub username. The app fetches their live public GitHub data, runs it through a custom scoring engine to produce a "Dev Score" and sub-scores, caches the results in MongoDB, generates a roast using an LLM (Groq) grounded in the computed stats, and renders everything as a shareable Bento-grid report card. There is also a global leaderboard of every profile that's been scanned.

### Non-Negotiable Constraints
1. **No mock data:** All data must come from the real GitHub REST API.
2. **Scoring Engine:** A pure, testable, side-effect-free function (`lib/scoring.ts`).
3. **LLM Grounding:** LLM prompt receives computed scores, not raw API JSON.
4. **Database Normalization:** MongoDB requires 3 distinct collections: `profiles`, `scores`, `leaderboard`.
5. **Aesthetics:** "Silent Coder" aesthetic (deep charcoal, forest green accents, Bento grid). No generic templates or placeholders.
6. **Explainable Code:** Code must be simple enough for the team to explain on camera for the judges.

---

## 2. What Has Been Completed (Agent A's Work)

**Agent A (Data & Scoring Slice) has completed the following:**

- [x] **Next.js Foundation:** Initialized Next.js App Router project with Tailwind CSS and TypeScript in the root directory.
- [x] **TypeScript Types:** Created `types/index.ts` defining `GithubProfile`, `GithubRepo`, and `DevScore`.
- [x] **Data Fetching Logic:** Implemented `lib/github.ts` to fetch and normalize public GitHub data, supporting an optional `GITHUB_TOKEN`.
- [x] **Pure Scoring Engine:** Implemented `lib/scoring.ts` to calculate the `DevScore`, weighting both Impact (stars/forks) and Activity (commit frequency/repos), Versatility (languages), and Clout (followers).
- [x] **Testing:** Verified the fetching and scoring math works successfully with a test script.

---

## 3. What is Left (Everything Else)

The remaining work is divided into two parts for the rest of the team:

### To Do: Agent B (Frontend/UI)
- [ ] **Tailwind Setup:** Configure `tailwind.config.ts` for the "Silent Coder" aesthetic (deep charcoal `#121212`, forest green `#10B981` accents).
- [ ] **Landing Page (`/app/page.tsx`):** Build a sleek username input form.
- [ ] **Bento Components (`/components`):** Build `BentoCard.tsx`, `ScoreGauge.tsx`, `LanguageBreakdown.tsx`, and `RoastCard.tsx`.
- [ ] **Report View (`/app/report/[username]/page.tsx`):** Render the fetched `DevScore` and roast text using the Bento components.
- [ ] **Leaderboard View (`/app/leaderboard/page.tsx`):** Build the leaderboard UI components and table.

### To Do: Agent C (Infra, LLM, Database, Integration)
- [ ] **Database Connection (`lib/db.ts`):** Connect to MongoDB Atlas and configure collections (`profiles` with TTL, `scores`, `leaderboard`).
- [ ] **LLM Integration (`lib/roast.ts`):** Implement the Groq API call to generate a short, punchy roast grounded in the `DevScore` metrics.
- [ ] **Orchestration API (`/app/api/scan/route.ts`):** 
    - Receive username.
    - Call `fetchGithubProfile` & `fetchGithubRepos` (Agent A's logic).
    - Call `calculateDevScore` (Agent A's logic).
    - Call the LLM to get the roast.
    - Save/update all normalized data in MongoDB.
    - Return the payload to the frontend.
- [ ] **Leaderboard API (`/app/api/leaderboard/route.ts`):** Endpoint to read sorted scores from the DB.
- [ ] **Deployment:** Ensure the app builds locally and deploys successfully to Vercel without console errors.

## Definition of Done for MVP
1. Username input -> live GitHub fetch -> raw data normalized **(Done - Agent A)**
2. Scoring engine produces composite Dev Score + 4 sub-scores **(Done - Agent A)**
3. Results cached in MongoDB (profiles + scores collections) **(Pending - Agent C)**
4. Bento report card renders all scores + language breakdown **(Pending - Agent B)**
5. LLM roast generated from computed scores, displayed on report card **(Pending - Agent C)**
6. Leaderboard page reads from leaderboard collection, sorted by Dev Score **(Pending - Agent B & C)**
7. Deployed to Vercel, working end to end with a real username **(Pending - Agent C)**
