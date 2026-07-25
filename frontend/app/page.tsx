"use client";

import { useEffect, useState } from "react";
import "./style/style.css";

// ─── Typing Animation ─────────────────────────────────────────────────────
function useTyping(words: string[], speed = 90, del = 50, pause = 2400) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = words[wi];
    const t = setTimeout(() => {
      if (!deleting) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDeleting(false);
          setWi((i) => (i + 1) % words.length);
        }
      }
    }, deleting ? del : speed);
    return () => clearTimeout(t);
  }, [text, deleting, wi, words, speed, del, pause]);

  return text;
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Nav ──────────────────────────────────────────────────────────────────
function Nav() {
  const [top, setTop] = useState(true);
  useEffect(() => {
    const h = () => setTop(window.scrollY < 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav" style={{ background: top ? "rgba(245,240,233,0.8)" : "rgba(245,240,233,0.96)" }}>
      <a href="#" className="nav-logo">
        <img src="/img/1111.png" alt="Danny Hsu" />
        <div className="nav-logo-text">
          <span className="nav-logo-name">Danny Hsu</span>
          <span className="nav-logo-sub">Front-end Engineer</span>
        </div>
      </a>

      <ul className="nav-links">
        {[["about", "About"], ["skills", "Skills"], ["experience", "Experience"], ["contact", "Contact"]].map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={go(id)}>{label}</a>
          </li>
        ))}
      </ul>

      <a href="/portfolio.pdf" target="_blank" rel="noopener noreferrer" className="nav-resume">
        Résumé ↗
      </a>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HeroSection() {
  const role = useTyping(
    ["Front-end Engineer", "React Developer", "TypeScript Enthusiast", "Angular Developer"],
    85, 45, 2200
  );

  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero-inner">
        {/* Main content */}
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">Portfolio</span>
            <span className="eyebrow-dot" aria-hidden />
            <span className="eyebrow-text">2026</span>
          </div>

          <h1 className="hero-name">Danny<br />Hsu</h1>

          <div className="hero-role-row">
            <span className="hero-role-prefix">Currently —</span>
            <span className="hero-typing" aria-live="polite">
              {role}
              <span className="hero-cursor" aria-hidden />
            </span>
          </div>

          <p className="hero-desc">
            CS student at National Taiwan Normal University,
            crafting thoughtful digital interfaces with React,
            TypeScript, and Angular.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn-ink">
              Get in touch <span className="btn-arrow">→</span>
            </a>
            <a href="#experience" className="btn-ghost">
              View work <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Aside — editorial metadata column */}
        <div className="hero-aside">
          <div className="hero-aside-item">
            <span className="hero-aside-label">University</span>
            <span className="hero-aside-value">NTNU</span>
          </div>
          <div className="hero-aside-item">
            <span className="hero-aside-label">Location</span>
            <span className="hero-aside-value">Taipei</span>
          </div>
          <div className="hero-aside-item">
            <span className="hero-aside-label">Status</span>
            <span className="hero-aside-value" style={{ color: "#4a7c59" }}>Available</span>
          </div>
          <div className="hero-aside-item">
            <span className="hero-aside-label">Class</span>
            <span className="hero-aside-value">2027</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll" aria-hidden>
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="section-wrap">
        <div className="sec-header reveal">
          <div className="sec-label-block">
            <span className="sec-label-en">About</span>
            <h2 className="sec-title">About <em>me</em></h2>
          </div>
          <span className="sec-num">01</span>
        </div>

        <div className="about-grid">
          {/* Portrait */}
          <div className="about-portrait reveal">
            <img src="/img/1111.png" alt="Danny Hsu" />
            <p className="about-portrait-caption">Danny Hsu — Taipei, Taiwan</p>
          </div>

          {/* Body */}
          <div className="about-body reveal reveal-d1">
            <h2>
              Building digital<br />
              experiences that <em>matter</em>
            </h2>

            <p>
              I&rsquo;m a third-year Computer Science student at National Taiwan
              Normal University with a deep interest in front-end engineering.
              I care about the details — clean code, intentional design, and
              interfaces that feel natural to use.
            </p>
            <p>
              Alongside my studies, I work as a Software R&amp;D Assistant,
              applying React, TypeScript, and Angular in real products. I enjoy
              the balance between thoughtful architecture and expressive UI.
            </p>

            <div className="about-info">
              {[
                ["Education", "NTNU — Computer Science & Information Engineering"],
                ["Duration", "2023 – 2027"],
                ["Role", "Software R&D Assistant (Part-time)"],
                ["Location", "Taipei, Taiwan"],
                ["Email", <a key="em" href="mailto:danny539425@gmail.com">danny539425@gmail.com</a>],
                ["LinkedIn", <a key="li" href="https://www.linkedin.com/in/danny-hsu-profile/" target="_blank" rel="noopener noreferrer">danny-hsu-profile</a>],
              ].map(([k, v]) => (
                <div className="about-info-row" key={String(k)}>
                  <span className="info-key">{k}</span>
                  <span className="info-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
const SKILL_ROWS = [
  {
    cat: "Front-end",
    items: ["React.js", "TypeScript", "JavaScript", "Angular", "HTML / CSS", "Tailwind"],
  },
  {
    cat: "Mobile",
    items: ["Flutter", "Dart"],
  },
  {
    cat: "Tools",
    items: ["Git", "Docker", "SQL", "Linux", "Node.js"],
  },
  {
    cat: "Concepts",
    items: ["OOP", "Agile", "CI/CD", "Design Systems", "REST APIs"],
  },
];

function SkillsSection() {
  return (
    <section id="skills" className="skills-section">
      <div className="section-wrap">
        <div className="sec-header reveal">
          <div className="sec-label-block">
            <span className="sec-label-en">Skills</span>
            <h2 className="sec-title">Tech <em>stack</em></h2>
          </div>
          <span className="sec-num">02</span>
        </div>

        <div className="skills-list">
          {SKILL_ROWS.map((row, i) => (
            <div className={`skill-row reveal reveal-d${i % 3}`} key={row.cat}>
              <span className="skill-category">{row.cat}</span>
              <div className="skill-items">
                {row.items.map((s) => (
                  <span className="skill-tag" key={s}>{s}</span>
                ))}
              </div>
              <span className="skill-num">{String(row.items.length).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section id="experience" className="experience-section">
      <div className="section-wrap">
        <div className="sec-header reveal">
          <div className="sec-label-block">
            <span className="sec-label-en">Experience</span>
            <h2 className="sec-title">Work &amp; <em>education</em></h2>
          </div>
          <span className="sec-num">03</span>
        </div>

        <div className="exp-list">
          {/* Work */}
          <div className="exp-item reveal">
            <div>
              <span className="exp-year">2024–</span>
            </div>
            <div className="exp-body">
              <h3 className="exp-title">Software R&amp;D Assistant</h3>
              <p className="exp-org">Part-time Position</p>
              <p className="exp-desc">
                Developing and maintaining front-end features with React.js,
                TypeScript, and Angular. Collaborating with cross-functional
                teams to deliver scalable web solutions and contributing to
                system architecture decisions.
              </p>
              <div className="exp-tags">
                {["React.js", "TypeScript", "Angular", "Git"].map((t) => (
                  <span className="exp-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="exp-item reveal reveal-d1">
            <div>
              <span className="exp-year">2023–<br />2027</span>
            </div>
            <div className="exp-body">
              <h3 className="exp-title">B.S. Computer Science &amp; Information Engineering</h3>
              <p className="exp-org">National Taiwan Normal University — NTNU</p>
              <p className="exp-desc">
                Studying core computer science fundamentals — algorithms,
                data structures, software engineering, and system design.
                Actively engaged in coursework covering OOP, databases,
                and modern web development.
              </p>
              <div className="exp-tags">
                {["C++", "Python", "Algorithms", "OOP", "Databases"].map((t) => (
                  <span className="exp-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Award */}
          <div className="award-item reveal reveal-d2">
            <div>
              <div className="award-badge">🏆</div>
            </div>
            <div className="award-body">
              <h3 className="award-title">Top 15 Finalist</h3>
              <p className="award-sub">
                2025 Taipei Autumn Programming Festival — Competed among
                hundreds of developers, reaching the final 15 in the
                competitive programming challenge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="section-wrap">
        <div className="sec-header reveal">
          <div className="sec-label-block">
            <span className="sec-label-en">Contact</span>
            <h2 className="sec-title" style={{ color: "var(--paper)" }}>
              Let&rsquo;s <em>connect</em>
            </h2>
          </div>
          <span className="sec-num">04</span>
        </div>

        <div className="contact-body reveal">
          <h2 className="contact-headline">
            Open to new<br /><em>opportunities</em>
          </h2>

          <p className="contact-sub">
            Whether you have a project in mind, a role to fill, or just
            want to say hi — I&rsquo;d love to hear from you.
          </p>

          <a
            id="contact-email-btn"
            href="mailto:danny539425@gmail.com"
            className="contact-email-btn"
          >
            Send a message <span>→</span>
          </a>

          <div className="contact-links">
            <a
              id="contact-linkedin"
              href="https://www.linkedin.com/in/danny-hsu-profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="contact-link-label">LinkedIn</span>
              <span className="contact-link-val">danny-hsu-profile</span>
            </a>

            <div className="contact-divider" aria-hidden />

            <a
              id="contact-github"
              href="https://github.com/Dannygod"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="contact-link-label">GitHub</span>
              <span className="contact-link-val">Dannygod</span>
            </a>

            <div className="contact-divider" aria-hidden />

            <a
              id="contact-resume"
              href="/portfolio.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="contact-link-label">Résumé</span>
              <span className="contact-link-val">PDF ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-copy">
        © 2026 Danny Hsu. All rights reserved.
      </p>
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/danny-hsu-profile/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/Dannygod" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:danny539425@gmail.com">Email</a>
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
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
