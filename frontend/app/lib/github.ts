import {
  PINNED_REPOS,
  RepoData,
  parseRepoUrl,
} from "../config";

// ─── Authenticated GitHub Fetch ──────────────────────────────────────────
// Uses GITHUB_TOKEN from .env.local to raise the rate limit to 5 000 req/hr.
// Falls back to unauthenticated requests if the token is not set.

async function githubFetch(url: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return fetch(url, {
    headers,
    next: { revalidate: 3600 }, // 1-hour ISR cache
  });
}

// ─── Data Fetchers ────────────────────────────────────────────────────────

export async function fetchPinnedRepos(): Promise<RepoData[]> {
  const responses = await Promise.allSettled(
    PINNED_REPOS.map(async (pinned) => {
      const { owner, repo } = parseRepoUrl(pinned.repo_url);
      const res = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      if (!res.ok) throw new Error(`${owner}/${repo}: ${res.status}`);
      const json = await res.json();
      return {
        ...json,
        customName: pinned.customName,
        slug: pinned.slug,
      } as RepoData;
    })
  );

  return responses
    .filter(
      (r): r is PromiseFulfilledResult<RepoData> => r.status === "fulfilled"
    )
    .map((r) => r.value);
}

// ─── Fetch Language Breakdown ─────────────────────────────────────────────
// Returns a Record<string, number> of language → bytes for a given repo.
// Accepts either owner+repo strings OR a full repo_url.

export async function fetchRepoLanguages(
  ownerOrUrl: string,
  repo?: string
): Promise<Record<string, number>> {
  let owner: string;
  let repoName: string;

  if (repo === undefined) {
    // Called with a full URL
    const parsed = parseRepoUrl(ownerOrUrl);
    owner = parsed.owner;
    repoName = parsed.repo;
  } else {
    owner = ownerOrUrl;
    repoName = repo;
  }

  const res = await githubFetch(
    `https://api.github.com/repos/${owner}/${repoName}/languages`
  );
  if (!res.ok) return {};
  return res.json();
}

export { githubFetch };
