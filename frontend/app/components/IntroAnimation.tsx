"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { CAROUSEL_IMAGE_URLS } from "./RoundCarousel";

/* ── Use useLayoutEffect on client to prevent flash, useEffect on server ── */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ── Random star generator ── */
const STAR_COLORS = [
  "#FFF",
  "#FFF",
  "#FFF",
  "#FFF",
  "#FFF",
  "#c4d5ff", // soft blue
  "#a8e0f0", // soft cyan
  "#d4b8ff", // soft violet
];

function generateBoxShadows(count: number, spread: number): string {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * spread * 2) - spread;
    const y = Math.floor(Math.random() * spread * 2) - spread;
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    shadows.push(`${x}px ${y}px ${color}`);
  }
  return shadows.join(", ");
}

/* ── Component ── */
export default function IntroAnimation() {
  const [show, setShow] = useState(true);
  const [stars, setStars] = useState<{
    sm: string;
    md: string;
    lg: string;
  } | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Skip if already seen this session
    if (sessionStorage.getItem("intro-seen")) {
      setShow(false);
      return;
    }

    // Generate random starfield
    setStars({
      sm: generateBoxShadows(700, 2500),
      md: generateBoxShadows(200, 2500),
      lg: generateBoxShadows(100, 2500),
    });

    sessionStorage.setItem("intro-seen", "1");

    // Preload RoundCarousel images while animation plays
    CAROUSEL_IMAGE_URLS.forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // Unmount after CSS fade-out completes (2.5s delay + 1.2s fade + 100ms buffer)
    const timer = setTimeout(() => setShow(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`intro-overlay${stars ? " intro-active" : ""}`}>
      {stars && (
        <>
          <div
            className="intro-stars intro-stars-sm"
            style={{ boxShadow: stars.sm }}
          />
          <div
            className="intro-stars intro-stars-md"
            style={{ boxShadow: stars.md }}
          />
          <div
            className="intro-stars intro-stars-lg"
            style={{ boxShadow: stars.lg }}
          />
          <div className="intro-glow" />
        </>
      )}
    </div>
  );
}
