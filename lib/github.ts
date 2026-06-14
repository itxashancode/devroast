import { GithubProfile, GithubRepo } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Helper to fetch data from GitHub API with authentication and standard headers
 */
async function fetchFromGithub<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && !token.includes("xxxx")) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches the user profile data
 */
export async function fetchGithubProfile(username: string): Promise<GithubProfile> {
  return fetchFromGithub<GithubProfile>(`/users/${username}`);
}

/**
 * Fetches the user's public repositories. 
 * For MVP, we fetch up to 100 repos (1 page).
 */
export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  return fetchFromGithub<GithubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
}
