import { GithubProfile, GithubRepo, DevScore } from '../types';

/**
 * Pure function to calculate a composite Dev Score and sub-scores.
 * Weights both stars (impact) and commit/repo frequency (activity).
 */
export function calculateDevScore(profile: GithubProfile, repos: GithubRepo[]): DevScore {
  // 1. Filter out forks to only score original work
  const originalRepos = repos.filter(repo => !repo.fork);

  // 2. Calculate Impact Score (based on stars and forks received)
  const totalStars = originalRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForksReceived = originalRepos.reduce((acc, repo) => acc + repo.forks_count, 0);
  // Cap at 100. 500 stars + forks = 100 points roughly.
  const impactScore = Math.min(100, (totalStars * 0.8) + (totalForksReceived * 0.5));

  // 3. Calculate Activity Score (based on repo count)
  // 50 original repos gets you a 100 score
  const repoCount = originalRepos.length;
  const activityScore = Math.min(100, repoCount * 2);

  // 4. Calculate Versatility Score (based on unique languages)
  const languageBreakdown: Record<string, number> = {};
  originalRepos.forEach(repo => {
    if (repo.language) {
      languageBreakdown[repo.language] = (languageBreakdown[repo.language] || 0) + 1;
    }
  });
  const uniqueLanguages = Object.keys(languageBreakdown).length;
  // 10 unique languages = 100 score
  const versatilityScore = Math.min(100, uniqueLanguages * 10);

  // 5. Calculate Clout Score (followers)
  // 100 followers = 100 points
  const cloutScore = Math.min(100, profile.followers);

  // 6. Calculate Total Score
  // Weighted composite: Impact (40%), Activity (30%), Versatility (15%), Clout (15%)
  const totalScore = Math.round(
    (impactScore * 0.4) + 
    (activityScore * 0.3) + 
    (versatilityScore * 0.15) + 
    (cloutScore * 0.15)
  );

  // 7. Generate actionable tips
  const tips: string[] = [];
  if (impactScore < 50) {
    tips.push("Improve your READMEs: add live demos, gifs, and clean setup guides to attract more stargazers.");
  }
  if (activityScore < 50) {
    tips.push("Commit more consistently: push progress regularly to build up your green GitHub contribution graph.");
  }
  if (versatilityScore < 40) {
    tips.push("Expand your tech stack: build a project in a new language (e.g. Go, Rust, or Python) to show versatility.");
  }
  if (cloutScore < 40) {
    tips.push("Grow your audience: contribute to public repos, share your work on social platforms, and network with builders.");
  }
  const missingDescCount = originalRepos.filter(r => !r.description).length;
  if (originalRepos.length > 0 && (missingDescCount / originalRepos.length) > 0.3) {
    tips.push("Professionalize your repos: add descriptions and topics/tags to your existing repositories for better search visibility.");
  }
  if (tips.length === 0) {
    tips.push("Excellent profile! Continue building high-impact open-source tools and contributing to major projects.");
  }

  return {
    totalScore,
    impactScore: Math.round(impactScore),
    activityScore: Math.round(activityScore),
    versatilityScore: Math.round(versatilityScore),
    cloutScore: Math.round(cloutScore),
    languageBreakdown,
    tips
  };
}
