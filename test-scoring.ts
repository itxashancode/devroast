import { fetchGithubProfile, fetchGithubRepos } from './lib/github';
import { calculateDevScore } from './lib/scoring';

async function test() {
  try {
    const username = 'torvalds'; // Linus Torvalds
    console.log(`Fetching data for ${username}...`);
    
    const profile = await fetchGithubProfile(username);
    console.log(`Profile: ${profile.name} (${profile.followers} followers)`);
    
    const repos = await fetchGithubRepos(username);
    console.log(`Fetched ${repos.length} repos`);
    
    const score = calculateDevScore(profile, repos);
    console.log('Dev Score:', score);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
