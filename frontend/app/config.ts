// ─── Configuration ────────────────────────────────────────────────────────
export const GITHUB_USERNAME = "Dannygod";

export interface RepoData {
  name: string;
  customName: string;
  slug: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  updated_at: string;
}

// ─── Pinned repos — use the full GitHub URL ──────────────────────────────
// New structure: { repo_url, customName, slug }
// repo_url: full GitHub URL e.g. "https://github.com/owner/repo"
export const PINNED_REPOS = [
  {
    repo_url: "https://github.com/Dannygod/portfolio",
    customName: "Portfolio (This Page)",
    slug: "portfolio",
  },
  {
    repo_url: "https://github.com/Dannygod/emotional-critter-haven",
    customName: "Moomo 沐哞 — 把碎念交給你的小怪獸",
    slug: "critter-haven",
  },
  
  {
    repo_url: "https://github.com/Dannygod/DoorsOfWorld",
    customName: "君不見，青海頭 — 中國與歐洲的戰爭門類建築展",
    slug: "doors-of-world",
  },
  {
    repo_url: "https://github.com/Dannygod/MasterGrammer",
    customName: "Grammar Master — with + O + OC 複合結構挑戰",
    slug: "master-grammer",
  },
  {
    repo_url: "https://github.com/Dannygod/Camp_website_2024",
    customName: "你們在code什麼 — 2024資工營網站",
    slug: "camp_website_2024",
  },
  {
    repo_url: "https://github.com/Dannygod/Camp_website_2023",
    customName: "E級玩家 — 2023資工營網站",
    slug: "camp_website_2023",
  },
  {
    repo_url: "https://github.com/Dannygod/Slot_Machine",
    customName: "拉霸機",
    slug: "baseball_stats",
  },
  {
    repo_url: "https://github.com/Dannygod/baseball_stats",
    customName: "中華職棒 — 棒球資訊共享平台",
    slug: "baseball_stats",
  }
];

// ─── Helper — parse owner/repo from a GitHub URL ─────────────────────────
export function parseRepoUrl(repo_url: string): { owner: string; repo: string } {
  const path = repo_url.replace("https://github.com/", "");
  const [owner, repo] = path.split("/");
  return { owner, repo };
}

// Language colors (GitHub-style)
export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Dart: "#00b4ab",
  Python: "#3572A5",
  "C++": "#f34b7d",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  Shell: "#89e051",
};
