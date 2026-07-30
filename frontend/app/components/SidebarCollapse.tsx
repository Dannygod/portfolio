"use client";

import { useState } from "react";

export function SidebarCollapse({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sidebar-collapse ${open ? "sidebar-collapse--open" : ""}`}>
      <button
        className="sidebar-collapse-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Collapse project info" : "Expand project info"}
      >
        <span className="sidebar-collapse-title">{title}</span>
        <svg
          className={`sidebar-collapse-chevron ${open ? "sidebar-collapse-chevron--open" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`sidebar-collapse-body ${open ? "sidebar-collapse-body--open" : ""}`}>
        {children}
      </div>
    </div>
  );
}
