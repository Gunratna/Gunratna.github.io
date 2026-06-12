"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Thin reading-progress bar pinned under the navbar.
 * Tracks the active section and fills based on how far through that section
 * the viewport is. Resets to 0 when a new section starts.
 */
const SECTIONS = ["about", "experience", "projects", "skills", "education", "contact"];

export function SectionProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      let best: { id: string; ratio: number } | null = null;

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = visible / Math.min(el.offsetHeight, vh);
        if (!best || ratio > best.ratio) best = { id, ratio };
      }

      if (best) {
        const el = document.getElementById(best.id)!;
        const rect = el.getBoundingClientRect();
        // how far we've scrolled through this section's full height
        const scrolled = Math.max(0, -rect.top);
        const total = Math.max(1, el.offsetHeight - window.innerHeight);
        setProgress(Math.min(1, scrolled / total));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="fixed left-0 top-[56px] z-40 h-px w-full bg-border">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
