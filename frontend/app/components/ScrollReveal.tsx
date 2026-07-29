"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — a side-effect-only Client Component.
 * Uses IntersectionObserver + MutationObserver to add the
 * "visible" class to elements with class "reveal" when they
 * scroll into view.  Renders nothing.
 */
export function ScrollReveal() {
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

    // Watch for dynamically added .reveal elements
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
