import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../style/style.css";
import {
  PINNED_REPOS,
  LANG_COLORS,
  parseRepoUrl,
} from "../../config";
import { githubFetch, fetchRepoLanguages } from "../../lib/github";
import { SidebarCollapse } from "../../components/SidebarCollapse";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Clock,
} from "lucide-react";

// ─── Brand icon (not in lucide) ───────────────────────────────────────────

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Transform relative GitHub markdown image URLs to raw URLs ────────────

function fixRelativeLinks(content: string, owner: string, repo: string, defaultBranch: string) {
  const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/`;

  let newContent = content.replace(/!\[([^\]]*)\]\((?!http|https|#)(.*?)\)/g, (_match, alt, url) => {
    const cleanUrl = url.replace(/^\.\/|^\//, "");
    return `![${alt}](${baseUrl}${cleanUrl})`;
  });

  newContent = newContent.replace(/<img[^>]+src=["'](?!http|https|#)([^"']+)["'][^>]*>/g, (match, url) => {
    const cleanUrl = url.replace(/^\.\/|^\//, "");
    return match.replace(url, `${baseUrl}${cleanUrl}`);
  });

  return newContent;
}

// ─── Extract headings for Table of Contents ───────────────────────────────

interface TocItem {
  level: number;
  text: string;
  slug: string;
}

function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,2})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`\[\]()]/g, "").trim();
    const rawSlug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim();

    const slug = rawSlug || "section";

    if (text) {
      items.push({ level, text, slug });
    }
  }

  return items;
}

// ─── Format date helper ──────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Language bar data ───────────────────────────────────────────────────

function getLanguageBreakdown(languages: Record<string, number>) {
  const total = Object.values(languages).reduce((sum, v) => sum + v, 0);
  if (total === 0) return [];

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      percentage: ((bytes / total) * 100).toFixed(1),
      color: LANG_COLORS[name] || "#6b7280",
    }));
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

  const { owner, repo } = parseRepoUrl(project.repo_url);

  // Fetch repo data + languages in parallel
  const [repoRes, languages] = await Promise.all([
    githubFetch(`https://api.github.com/repos/${owner}/${repo}`),
    fetchRepoLanguages(owner, repo),
  ]);

  if (!repoRes.ok) {
    notFound();
  }

  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch || "main";

  // Fetch README.md
  const readmeRes = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/README.md`,
    { next: { revalidate: 3600 } }
  );

  let readmeContent = "";
  if (readmeRes.ok) {
    readmeContent = await readmeRes.text();
    readmeContent = fixRelativeLinks(readmeContent, owner, repo, defaultBranch);
  } else {
    readmeContent = "_No README found for this repository._";
  }

  const toc = extractToc(readmeContent);
  const langBreakdown = getLanguageBreakdown(languages);

  return (
    <div className="project-page">
      {/* ─── Sidebar ─── */}
      <aside className="project-sidebar">
        {/* Back link */}
        <Link href="/#projects" className="sidebar-back">
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Project name */}
        <h1 className="sidebar-title">{project.customName}</h1>

        {/* Collapsible section for mobile */}
        <SidebarCollapse title="Project Details">
          {/* Description */}
          {repoData.description && (
            <p className="sidebar-desc">{repoData.description}</p>
          )}

          {/* Language Bar */}
          {langBreakdown.length > 0 && (
            <div>
              <div className="sidebar-section-label">Languages</div>
              <div className="lang-bar">
                {langBreakdown.map((lang) => (
                  <div
                    key={lang.name}
                    className="lang-bar-segment"
                    style={{
                      width: `${lang.percentage}%`,
                      background: lang.color,
                    }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>
              <div className="lang-list">
                {langBreakdown.map((lang) => (
                  <div key={lang.name} className="lang-list-item">
                    <span
                      className="lang-list-dot"
                      style={{ background: lang.color }}
                    />
                    <span>{lang.name}</span>
                    <span className="lang-list-pct">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {(repoData.stargazers_count > 0 || repoData.forks_count > 0) && (
            <div className="sidebar-stats">
              {repoData.stargazers_count > 0 && (
                <span className="sidebar-stat">
                  <Star size={16} /> {repoData.stargazers_count}
                </span>
              )}
              {repoData.forks_count > 0 && (
                <span className="sidebar-stat">
                  <GitFork size={16} /> {repoData.forks_count}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="sidebar-actions">
            <a
              href={repoData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-action-btn sidebar-action-btn--primary"
            >
              <IconGitHub /> View Repository
            </a>
            {repoData.homepage && (
              <a
                href={repoData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-action-btn sidebar-action-btn--secondary"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>

          {/* Dates */}
          <div className="sidebar-meta">
            <span className="sidebar-meta-item">
              <Calendar size={16} />
              Created {formatDate(repoData.created_at)}
            </span>
            <span className="sidebar-meta-item">
              <Clock size={16} />
              Updated {formatDate(repoData.updated_at)}
            </span>
          </div>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <>
              <div className="sidebar-divider" />
              <div>
                <div className="sidebar-section-label">On this page</div>
                <nav className="sidebar-toc">
                  {toc.map((item, index) => (
                    <a
                      key={`${item.slug}-${index}`}
                      href={`#${item.slug}`}
                      className={`sidebar-toc-item ${item.level === 2 ? "sidebar-toc-item--h2" : ""}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </>
          )}
        </SidebarCollapse>
      </aside>

      {/* ─── Content ─── */}
      <main className="project-content">
        <div className="project-content-inner">
          {/* iframe preview */}
          {repoData.homepage && (
            <div className="project-iframe-wrap">
              <div className="project-iframe-header">
                <div className="project-iframe-dots">
                  <span className="project-iframe-dot" />
                  <span className="project-iframe-dot" />
                  <span className="project-iframe-dot" />
                </div>
                <span className="project-iframe-url">{repoData.homepage}</span>
              </div>
              <iframe
                className="project-iframe"
                src={repoData.homepage}
                title={`${project.customName} — Live Preview`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}

          {/* README */}
          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {readmeContent}
            </ReactMarkdown>
          </article>
        </div>
      </main>
    </div>
  );
}
