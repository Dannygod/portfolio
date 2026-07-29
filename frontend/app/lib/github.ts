import {
  GITHUB_USERNAME,
  PINNED_REPOS,
  CONTRIBUTED_REPOS,
  RepoData,
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
      const res = await githubFetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${pinned.repo}`
      );
      if (!res.ok) throw new Error(`${pinned.repo}: ${res.status}`);
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

export async function fetchContributedRepos(): Promise<RepoData[]> {
  const responses = await Promise.allSettled(
    CONTRIBUTED_REPOS.map(async (url) => {
      const path = url.replace("https://github.com/", "");
      const res = await githubFetch(
        `https://api.github.com/repos/${path}`
      );
      if (!res.ok) throw new Error(`${path}: ${res.status}`);
      return (await res.json()) as RepoData;
    })
  );

  return responses
    .filter(
      (r): r is PromiseFulfilledResult<RepoData> => r.status === "fulfilled"
    )
    .map((r) => r.value);
}

export { githubFetch };
