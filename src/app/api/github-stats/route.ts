import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'VaibhavBansal26';
const GITHUB_API = 'https://api.github.com';

// Cache for 1 hour — avoids hitting GitHub rate limits on every request
export const revalidate = 3600;

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  private: boolean;
  language: string | null;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  location: string | null;
  created_at: string;
}

function ghHeaders(): HeadersInit {
  const h: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function GET() {
  try {
    const headers = ghHeaders();

    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status} / ${reposRes.status}`);
    }

    const user: GitHubUser = await userRes.json();
    const repos: GitHubRepo[] = await reposRes.json();

    const ownRepos = repos.filter((r) => !r.fork && !r.private);
    const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

    // Count unique languages
    const languages = new Set(ownRepos.map((r) => r.language).filter(Boolean));

    // Fetch contribution calendar via GraphQL (needs GITHUB_TOKEN)
    let totalContributions = 0;
    if (process.env.GITHUB_TOKEN) {
      const gqlRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{
            user(login: "${GITHUB_USERNAME}") {
              contributionsCollection {
                contributionCalendar { totalContributions }
              }
            }
          }`,
        }),
      });
      if (gqlRes.ok) {
        const gql = await gqlRes.json();
        totalContributions =
          gql?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;
      }
    }

    return NextResponse.json(
      {
        username: GITHUB_USERNAME,
        publicRepos: user.public_repos,
        ownRepos: ownRepos.length,
        totalStars,
        totalForks,
        totalContributions,
        languages: languages.size,
        followers: user.followers,
        memberSince: user.created_at,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[github-stats]', err);
    // Return fallback data so the UI never breaks
    return NextResponse.json(
      {
        username: GITHUB_USERNAME,
        publicRepos: 95,
        ownRepos: 80,
        totalStars: 20,
        totalForks: 10,
        totalContributions: 500,
        languages: 8,
        followers: 50,
        memberSince: '2016-01-01T00:00:00Z',
      },
      { status: 200 }
    );
  }
}
