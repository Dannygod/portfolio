"use client";

import { useEffect, useState, useCallback } from "react";
import "./style/style.css";

// ─── Configuration ────────────────────────────────────────────────────────
const GITHUB_USERNAME = "Dannygod";

// 🔧 Edit this array to choose which repos to showcase on your portfolio
const PINNED_REPOS = [
  "portfolio",
  "emotional-critter-haven",
  "MasterGrammer",
  "DoorsOfWorld"
];

// 🔧 Repos you contributed to but don't own — use the full GitHub URL
const CONTRIBUTED_REPOS = [
  "https://github.com/CSIE-Camp/Camp_website_2024",
  "https://github.com/CSIE-Camp/website-frontend",
  "https://github.com/CSIE-Camp/Slot_Machine",
  "https://github.com/Dannygod/TownPass",
  "https://github.com/Dannygod/frontend"
];

// Language colors (GitHub-style)
const LANG_COLORS: Record<string, string> = {
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

// ─── Types ────────────────────────────────────────────────────────────────
interface RepoData {
  name: string;
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

// ─── Scroll Reveal ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    // Initial pass
    observeAll();

    // Watch for dynamically added .reveal elements (e.g. after API data loads)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

// ─── GitHub Data Hook ─────────────────────────────────────────────────────
function useGitHubRepos() {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.allSettled(
        PINNED_REPOS.map((name) =>
          fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`).then(
            (r) => {
              if (!r.ok) throw new Error(`${name}: ${r.status}`);
              return r.json();
            }
          )
        )
      );

      const data: RepoData[] = responses
        .filter(
          (r): r is PromiseFulfilledResult<RepoData> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      setRepos(data);
    } catch {
      setError("Failed to load projects from GitHub.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return { repos, loading, error };
}

// ─── Contributed Repos Hook ───────────────────────────────────────────────
function useContributedRepos() {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.allSettled(
        CONTRIBUTED_REPOS.map((url) => {
          // Convert full URL → API path, e.g. "https://github.com/Org/Repo" → "Org/Repo"
          const path = url.replace("https://github.com/", "");
          return fetch(`https://api.github.com/repos/${path}`).then((r) => {
            if (!r.ok) throw new Error(`${path}: ${r.status}`);
            return r.json() as Promise<RepoData>;
          });
        })
      );

      const data: RepoData[] = responses
        .filter(
          (r): r is PromiseFulfilledResult<RepoData> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      setRepos(data);
    } catch {
      setError("Failed to load contributed repos from GitHub.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return { repos, loading, error };
}

// ─── SVG Icons ────────────────────────────────────────────────────────────
function IconGitHub({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconFork({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
      <path d="M6 9a9 9 0 0 0 9 9" />
    </svg>
  );
}

function IconRepo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#" className="nav-logo">
        <span className="nav-logo-dot" />
        ~/dannyhsu
      </a>

      <ul className="nav-links">
        {[
          ["projects", "Projects"],
          ["open-source", "Open Source"],
          ["contributions", "Activity"],
        ].map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={go(id)}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-social-links">
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-social-link"
          aria-label="GitHub profile"
        >
          <IconGitHub />
        </a>
        <a
          href="https://www.linkedin.com/in/danny-hsu-profile/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-social-link"
          aria-label="LinkedIn profile"
        >
          <IconLinkedIn />
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero-inner">
        {/* Avatar */}
        <div className="hero-avatar-wrap">
          <div className="hero-avatar">
            <img
              src={`https://avatars.githubusercontent.com/u/94232413?v=4`}
              alt="Danny Hsu"
            />
          </div>
          <div className="hero-status-dot" title="Available for hire" />
        </div>

        {/* Content */}
        <div className="hero-content">
          <span className="hero-username">@{GITHUB_USERNAME}</span>
          <h1 className="hero-name">Danny Hsu</h1>
          <p className="hero-tagline">
            <strong>Front-end Engineer</strong> & CS student at NTNU. I craft
            thoughtful digital interfaces with <strong>React</strong>,{" "}
            <strong>TypeScript</strong>, and <strong>Angular</strong> — turning
            ideas into polished, performant web experiences.
          </p>

          {/* Meta */}
          <div className="hero-meta">
            <span className="hero-meta-item">
              <IconMapPin />
              Taipei, Taiwan
            </span>
            <span className="hero-meta-item">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/{GITHUB_USERNAME}
              </a>
            </span>
          </div>

          {/* Social buttons */}
          <div className="hero-socials">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="GitHub"
            >
              <IconGitHub />
            </a>
            <a
              href="https://www.linkedin.com/in/danny-hsu-profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="LinkedIn"
            >
              <IconLinkedIn />
            </a>
            <a
              href="mailto:danny539425@gmail.com"
              className="hero-social-btn"
              aria-label="Email"
            >
              <IconMail />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────
function ProjectCard({ repo }: { repo: RepoData }) {
  const langColor = repo.language
    ? LANG_COLORS[repo.language] || "#6b7280"
    : "#6b7280";

  return (
    <div className="project-card">
      <div className="project-card-top">
        <div className="project-icon">
          <IconRepo />
        </div>
        <div className="project-links">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            aria-label={`View ${repo.name} on GitHub`}
          >
            <IconGitHub />
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`Visit ${repo.name} live demo`}
            >
              <IconExternalLink />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-name">{repo.name}</h3>

      <p className="project-desc">
        {repo.description || "No description provided."}
      </p>

      <div className="project-footer">
        {repo.language && (
          <span className="project-lang">
            <span
              className="project-lang-dot"
              style={{ background: langColor }}
            />
            {repo.language}
          </span>
        )}

        <div className="project-stats">
          {repo.stargazers_count > 0 && (
            <span className="project-stat">
              <IconStar />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="project-stat">
              <IconFork />
              {repo.forks_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="project-skeleton">
      <div className="skeleton-line w-40 h-20" />
      <div className="skeleton-line w-60" />
      <div className="skeleton-line w-100" />
      <div className="skeleton-line w-80" />
      <div style={{ marginTop: "auto" }}>
        <div className="skeleton-line w-40 h-12" />
      </div>
    </div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────
function ProjectsSection() {
  const { repos, loading, error } = useGitHubRepos();

  return (
    <section id="projects" className="projects-section">
      <div className="section-wrap">
        <div className="section-header reveal">
          <span className="section-label">~/projects</span>
          <h2 className="section-title">Pinned Projects</h2>
          <p className="section-subtitle">
            Featured repositories from my GitHub — things I&rsquo;ve built,
            contributed to, and learned from.
          </p>
        </div>

        {error && (
          <div className="error-state reveal">
            <div className="error-state-title">
              Couldn&rsquo;t load projects
            </div>
            <p className="error-state-desc">{error}</p>
          </div>
        )}

        <div className="projects-grid">
          {loading
            ? Array.from({ length: PINNED_REPOS.length }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : repos.map((repo, i) => (
                <div
                  key={repo.name}
                  className={`reveal reveal-d${(i % 4) + 1}`}
                >
                  <ProjectCard repo={repo} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Open Source Contributions Section ──────────────────────────────────
function OpenSourceSection() {
  const { repos, loading, error } = useContributedRepos();

  return (
    <section id="open-source" className="projects-section">
      <div className="section-wrap">
        <div className="section-header reveal">
          <span className="section-label">~/open-source</span>
          <h2 className="section-title">Open Source Contributions</h2>
          <p className="section-subtitle">
            Repositories I&rsquo;ve contributed to outside of my own projects.
          </p>
        </div>

        {error && (
          <div className="error-state reveal">
            <div className="error-state-title">
              Couldn&rsquo;t load repos
            </div>
            <p className="error-state-desc">{error}</p>
          </div>
        )}

        <div className="projects-grid">
          {loading
            ? Array.from({ length: CONTRIBUTED_REPOS.length }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : repos.map((repo, i) => (
                <div
                  key={repo.full_name}
                  className={`reveal reveal-d${(i % 4) + 1}`}
                >
                  <ProjectCard repo={repo} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contribution Graph ──────────────────────────────────────────────────
function ContributionSection() {
  return (
    <section id="contributions" className="contrib-section">
      <div className="section-wrap">
        <div className="section-header reveal">
          <span className="section-label">~/activity</span>
          <h2 className="section-title">GitHub Activity</h2>
          <p className="section-subtitle">
            My contribution graph — a snapshot of what I&rsquo;ve been building.
          </p>
        </div>

        <div className="contrib-graph-wrap reveal reveal-d1">
          <img
            src={`https://ghchart.rshah.org/3b82f6/${GITHUB_USERNAME}`}
            alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
            loading="lazy"
          />
        </div>

        <div className="contrib-label reveal reveal-d2">
          <span className="contrib-label-text">
            @{GITHUB_USERNAME} &middot; contributions over the past year
          </span>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contrib-label-link"
          >
            View on GitHub <IconArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">© 2026 Danny Hsu. All rights reserved.</p>

        <div className="footer-links">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <IconGitHub />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/danny-hsu-profile/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <IconLinkedIn />
            LinkedIn
          </a>
          <a href="mailto:danny539425@gmail.com" className="footer-link">
            <IconMail />
            Email
          </a>
        </div>

        <span className="footer-built">
          Built with <span className="heart">♥</span> Next.js + TypeScript
        </span>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  useScrollReveal();

  return (
    <>
      <Nav />
      <main id="main-content">
        <HeroSection />
        <ProjectsSection />
        <OpenSourceSection />
        <ContributionSection />
      </main>
      <Footer />
    </>
  );
}
