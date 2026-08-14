import Link from "next/link";
import "./style/style.css";
import {
  GITHUB_USERNAME,
  LANG_COLORS,
  RepoData,
} from "./config";
import { fetchPinnedRepos } from "./lib/github";
import { Nav } from "./components/Nav";
import { ScrollReveal } from "./components/ScrollReveal";
import {
  ExternalLink,
  Star,
  GitFork,
  FolderGit2,
  Mail,
  MapPin,
  ArrowRight,
  FileUser,
} from "lucide-react";
import RoundCarousel from "./components/RoundCarousel";
import TwinGalaxyRings from "./components/TwinGalaxyRings";

// ─── Brand icons (not in lucide) ──────────────────────────────────────────

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero-inner">
        {/* Avatar */}
        {/* <div className="hero-avatar-wrap">
          <div className="hero-avatar">
            <img
              src={`https://avatars.githubusercontent.com/u/94232413?v=4`}
              alt="Danny Hsu"
            />
          </div>
          <div className="hero-status-dot" title="Available for hire" />
        </div> */}
        

        {/* Content */}
        {/* <div className="hero-content">
          <span className="hero-username">@{GITHUB_USERNAME}</span>
          <h1 className="hero-name">Danny Hsu</h1>
          <p className="hero-tagline">
            <strong>Front-end Engineer</strong> with 3+ years of experience building web applications using React, Angular, TypeScript, and Next.js. Completed nearly one year of software engineering internship experience, delivering production-ready features from design to deployment.
          </p>

          <div className="hero-meta">
            <span className="hero-meta-item">
              <MapPin size={16} />
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
              <Mail size={18} />
            </a>
            <a href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cv-btn"
              aria-label="Download CV"
            >
              <FileUser />
              View CV
            </a>
          </div>
        </div> */}
      </div>
    </section>
  );
}

// ─── About / Experience Section ───────────────────────────────────────────
function AboutSection() {
  const skills = [
    "TypeScript", "React", "Next.js", "Angular",
    "Vue", "Node.js", "Python", "Flask",
    "Docker", "CI/CD", "Git", "Figma",
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-wrap">
        <div className="section-header reveal">
          <span className="section-label">~/about</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            Front-end engineer with industry experience building enterprise-grade web applications.
          </p>
        </div>

        <div className="about-grid">
          {/* Left — Bio + Skills + CV */}
          <div className="about-bio-col reveal reveal-d1">
            <p className="about-bio-text">
              Front-end engineer with hands-on industry experience delivering production-grade Angular and React applications at VIA Technologies. Specialized in building data-intensive enterprise UIs, RESTful API integration, and responsive cross-device interfaces.
              Graduated with a B.S. in Computer Science from National Taiwan Normal University and seeking a full-time front-end or software
              engineering position.
            </p>
            <p className="about-bio-text">
              
            </p>

            {/* Skills */}
            <div className="about-skills">
              <div className="about-skills-label">CORE SKILLS</div>
              <div className="about-skills-chips">
                {skills.map((s) => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Experience Timeline */}
          <div className="about-timeline-col reveal reveal-d2">
            <div className="timeline">

              {/* VIA Technologies */}
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-period">Jun 2025 – Jan 2026</div>
                <div className="timeline-role">Front-end Engineer Intern</div>
                <div className="timeline-org">VIA Technologies, Inc. · Taipei</div>
                <ul className="timeline-bullets">
                  <li>Built core modules of TVBS&rsquo;s ad operations platform (Angular + TypeScript), replacing spreadsheets for 50+ users</li>
                  <li>Automated KPI calculations — impressions, CTR, list/sale price — integrating booking & scheduling APIs</li>
                  <li>Supported CI/CD deployments with Docker, Nginx, and Linux VMs</li>
                </ul>
                <span className="timeline-tag">Angular · TypeScript · Docker</span>
              </div>

              {/* CSIE Camp Instructor */}
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-period">Jul 2023 & Jul 2024</div>
                <div className="timeline-role">Front-end Instructor</div>
                <div className="timeline-org">NTNU CSIE Camp · Taipei</div>
                <ul className="timeline-bullets">
                  <li>Taught HTML, CSS & Python to 120+ high school students across two annual camps</li>
                  <li>Designed a 10-level project curriculum with 80%+ completion rate</li>
                </ul>
                <span className="timeline-tag">HTML · CSS · Python</span>
              </div>

              {/* Education */}
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-period">Sep 2022 – Jul 2026 (expected)</div>
                <div className="timeline-role">B.S. Computer Science & Information Engineering</div>
                <div className="timeline-org">National Taiwan Normal University (NTNU) · Taipei</div>
                <ul className="timeline-bullets">
                  <li>Relevant courses: Data Structures & Algorithms, Software Engineering, Database Theory, OOP, Systems Programming</li>
                </ul>
                <span className="timeline-tag">NTNU · CS</span>
              </div>

              {/* Hackathon */}
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-period">Nov 2025</div>
                <div className="timeline-role">Taipei Fall Coding Festival Hackathon</div>
                <div className="timeline-org">Dept. of Information Technology, Taipei City Gov.</div>
                <ul className="timeline-bullets">
                  <li><strong>Top 15 / 80 teams</strong> — advanced to the final round</li>
                  <li>Built Mapbox safety map for Town Pass (Taipei&rsquo;s civic app) using React in Flutter WebView</li>
                </ul>
                <span className="timeline-tag">React · Mapbox · Top 15</span>
              </div>

            </div>
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
          <FolderGit2 size={20} />
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
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-name">{repo.customName || repo.name}</h3>

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

        {repo.slug && (
          <div className="project-details-wrap">
            <Link href={`/projects/${repo.slug}`} className="project-details-btn">
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────
function ProjectsSection({ repos }: { repos: RepoData[] }) {
  return (
    <section id="projects" className="projects-section">
      <div className="section-wrap">
        <div className="section-header reveal">
          <span className="section-label">~/projects</span>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            Featured repositories from my GitHub — things I&rsquo;ve built,
            contributed to, and learned from.
          </p>
        </div>
        
        <div className="projects-grid">
          {repos.map((repo, i) => (
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
            View on GitHub <ArrowRight size={14} />
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
        <p className="footer-copy">&copy; {new Date().getFullYear()} Danny Hsu. All rights reserved.</p>

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
            <Mail size={18} />
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

// ─── Page (Server Component — async) ──────────────────────────────────────
export default async function Home() {
  const pinnedRepos = await fetchPinnedRepos();

  return (
    <>
      <ScrollReveal />
      <Nav />
      <main id="main-content">
        {/* <HeroSection/> */}
        {/* Galaxy + Carousel overlay */}
        <div className="galaxy-hero-wrapper">
          <TwinGalaxyRings />
          <div className="carousel-overlay">
            <RoundCarousel background="" />
          </div>
        </div>
        <AboutSection />
        {/* <CoverFlow /> */}
        <ProjectsSection repos={pinnedRepos} />
        <ContributionSection />
      </main>
      <Footer />
    </>
  );
}
