# DevRoast

A dynamic Proof-of-Work (PoW) generator and scoring engine for GitHub profiles. Built on Next.js App Router, it fetches live repository data, computes weighted developer metrics, and utilizes an LLM to generate a customized profile analysis.

## System Architecture

```mermaid
graph TD
    Client[Client Browser] -->|GET /report/:username| NextJS[Next.js App Router]
    NextJS -->|GET /api/scan| API[Orchestration API]
    
    API -->|Fetch Public Data| GitHub[GitHub REST API]
    API -->|Compute Weights| Engine[Scoring Engine]
    API -->|Generate Roast| Groq[Groq / Llama 3]
    
    API -->|Read/Write Cache| Mongo[(MongoDB Atlas)]
    
    GitHub -.-> API
    Engine -.-> API
    Groq -.-> API
    
    API -->|Return Normalized Payload| NextJS
    NextJS -->|Render Bento Grid| Client
```

## Technical Stack

*   **Framework:** Next.js 15 (App Router, React 19)
*   **Styling:** Tailwind CSS v4
*   **Language:** TypeScript (Strict mode enabled)
*   **Database:** MongoDB Atlas (Mongoose)
*   **AI/LLM:** Groq API (Llama-3.3-70b-versatile)
*   **Performance:** `@chenglou/pretext` for zero-layout-shift UI streaming, Upstash/Redis rate limiting

## Core Data Flow

The application executes a sequence of data normalization and scoring without utilizing mock data. The scoring engine operates as a pure, testable function.

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js API
    participant GH as GitHub API
    participant Score as Scoring Engine
    participant Groq as Groq LLM
    participant DB as MongoDB

    User->>App: Request Profile (e.g., /api/scan?username=torvalds)
    App->>DB: Check Cache
    alt Cache Hit
        DB-->>App: Return Cached Profile
    else Cache Miss
        App->>GH: Fetch User & Repos
        GH-->>App: Raw JSON Data
        App->>Score: calculateDevScore(user, repos)
        Score-->>App: { impact, activity, versatility, clout, total }
        App->>Groq: Generate Roast (Prompt injected with scores)
        Groq-->>App: Streaming Text Response
        App->>DB: Upsert Profile & Scores
    end
    App-->>User: Render Bento Grid Report
```

## Scoring Engine Mechanics

The `calculateDevScore` function (`lib/scoring.ts`) computes a weighted `DevScore` from 0-100 based on four primary vectors:

1.  **Impact (40%):** Stars and forks across public repositories.
2.  **Activity (30%):** Commit frequency and recent repository updates.
3.  **Versatility (15%):** Number of unique languages utilized.
4.  **Clout (15%):** Follower-to-following ratio and sheer follower volume.

## Database Schema

```mermaid
erDiagram
    PROFILES {
        string username PK
        string avatarUrl
        string bio
        int publicRepos
        int followers
        date updatedAt
    }
    SCORES {
        string username FK
        int totalScore
        int impactScore
        int activityScore
        int versatilityScore
        int cloutScore
        string roast
    }
    PROFILES ||--o| SCORES : "1-to-1 mapping"
```

## Setup & Local Development

1.  **Clone & Install**
    ```bash
    git clone https://github.com/itxashancode/devroast.git
    cd devroast
    npm install
    ```

2.  **Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    # Optional: Increases API rate limits from 60 to 5000 req/hr
    GITHUB_TOKEN=your_github_personal_access_token

    # Required: Groq API key for LLM generation
    GROQ_API_KEY=your_groq_api_key

    # Required: MongoDB connection string
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devroast
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:3000`.

## License
MIT
