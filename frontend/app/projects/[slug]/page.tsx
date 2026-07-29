import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../style/style.css";
import {
  PINNED_REPOS,
  GITHUB_USERNAME,
} from "../../config";
import { githubFetch } from "../../lib/github";
import { IconArrowRight } from "../../page";

// ─── Inline icons for this page ───────────────────────────────────────────

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconFork() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
      <path d="M6 9a9 9 0 0 0 9 9" />
    </svg>
  );
}

// ─── Transform relative GitHub markdown image URLs to raw URLs ────────────

function fixRelativeLinks(content: string, repo: string, defaultBranch: string) {
  const baseUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo}/${defaultBranch}/`;

  // Replace Markdown image relative links: ![alt](./path) -> ![alt](baseUrl/path)
  let newContent = content.replace(/!\[([^\]]*)\]\((?!http|https|#)(.*?)\)/g, (_match, alt, url) => {
    const cleanUrl = url.replace(/^\.\/|^\//, "");
    return `![${alt}](${baseUrl}${cleanUrl})`;
  });

  // HTML img tags: <img src="./path">
  newContent = newContent.replace(/<img[^>]+src=["'](?!http|https|#)([^"']+)["'][^>]*>/g, (match, url) => {
    const cleanUrl = url.replace(/^\.\/|^\//, "");
    return match.replace(url, `${baseUrl}${cleanUrl}`);
  });

  return newContent;
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const project = PINNED_REPOS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  // Fetch Repo Data (authenticated, cached 1hr)
  const repoRes = await githubFetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${project.repo}`
  );

  if (!repoRes.ok) {
    notFound();
  }

  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch || "main";

  // Fetch README.md (raw content, no API auth needed)
  const readmeRes = await fetch(
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${project.repo}/${defaultBranch}/README.md`,
    { next: { revalidate: 3600 } }
  );

  let readmeContent = "";
  if (readmeRes.ok) {
    readmeContent = await readmeRes.text();
    readmeContent = fixRelativeLinks(readmeContent, project.repo, defaultBranch);
  } else {
    readmeContent = "_No README found for this repository._";
  }

  return (
    <div className="page-wrapper" style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <nav className="nav scrolled" style={{ position: "relative", marginBottom: "20px" }}>
        <Link href="/#projects" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ transform: "rotate(180deg)", display: "flex" }}>
            <IconArrowRight />
          </div>
          Back to Portfolio
        </Link>
      </nav>

      <main className="project-detail-main" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header section */}
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>
            {project.customName}
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
            {repoData.description}
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={repoData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-details-btn"
              style={{ gap: "8px" }}
            >
              <IconGitHub /> View Repository
            </a>
            {repoData.homepage && (
              <a
                href={repoData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="project-details-btn"
                style={{ gap: "8px", background: "var(--bg-subtle)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              >
                <IconExternalLink /> Live Demo
              </a>
            )}

            <div className="project-stats" style={{ marginLeft: "auto" }}>
              {repoData.stargazers_count > 0 && (
                <span className="project-stat" style={{ fontSize: "0.9rem" }}>
                  <IconStar /> {repoData.stargazers_count}
                </span>
              )}
              {repoData.forks_count > 0 && (
                <span className="project-stat" style={{ fontSize: "0.9rem" }}>
                  <IconFork /> {repoData.forks_count}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content section */}
        <article className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {readmeContent}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
