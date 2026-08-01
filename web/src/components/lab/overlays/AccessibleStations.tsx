"use client";

import { projects, type Project } from "@/lib/content";

/**
 * Keyboard/AT-accessible equivalent of the floating 3D markers. The buttons are
 * visually hidden until focused (skip-link pattern), so sighted mouse users see
 * the 3D scene while keyboard and screen-reader users get direct, labelled
 * access to the very same project panels.
 */
export function AccessibleStations({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <nav
      aria-label="Project stations"
      className="absolute left-1/2 top-2 z-40 -translate-x-1/2"
    >
      <ul className="flex flex-col items-center gap-1">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p)}
              className="sr-only rounded-lg border border-accent bg-bg px-3 py-1.5 text-sm text-text shadow-lg focus:not-sr-only focus:inline-flex focus:items-center"
            >
              Open {p.name} — {p.type} project details
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
