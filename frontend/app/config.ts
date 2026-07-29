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

// 🔧 Edit this array to choose which repos to showcase on your portfolio
export const PINNED_REPOS = [
  { repo: "portfolio", customName: "Portfolio (This Page)", slug: "portfolio" },
  { repo: "emotional-critter-haven", customName: "Moomo 沐哞 — 把碎念交給你的小怪獸", slug: "critter-haven" },
  { repo: "MasterGrammer", customName: "Grammar Master - with + O + OC 複合結構挑戰", slug: "master-grammer" },
  { repo: "DoorsOfWorld", customName: "君不見，青海頭 — 中國與歐洲的戰爭門類建築展", slug: "doors-of-world" },
  { repo: "baseball_stats", customName: "中華職棒-棒球資訊共享平台", slug: "baseball_stats" }
];

// 🔧 Repos you contributed to but don't own — use the full GitHub URL
export const CONTRIBUTED_REPOS = [
  "https://github.com/CSIE-Camp/Camp_website_2024",
  "https://github.com/CSIE-Camp/website-frontend",
  "https://github.com/CSIE-Camp/Slot_Machine",
  "https://github.com/Dannygod/TownPass",
  "https://github.com/Dannygod/frontend"
];

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
