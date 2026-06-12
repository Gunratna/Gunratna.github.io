"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitBranch, ListChecks } from "lucide-react";
import type { Project } from "@/lib/content";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ArchDiagram } from "@/components/ui/ArchDiagram";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"architecture" | "details">("architecture");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} details`}
          className="relative flex h-full max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-bg-elev shadow-2xl"
        >
          {/* header */}
          <div className="flex items-start justify-between border-b border-border p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted">
                  {project.type}
                </span>
                {project.experimental && (
                  <span className="rounded border border-accent px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                    Experimental
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-text-muted">{project.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-text"
            >
              <X size={18} />
            </button>
          </div>

          {/* outcomes strip */}
          <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
            {project.outcomes.map((o) => (
              <div key={o.label} className="bg-bg-elev p-3 text-center">
                <div className="font-display text-xl font-semibold text-accent">
                  {o.value}
                </div>
                <div className="mt-0.5 text-[11px] text-text-muted">{o.label}</div>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="flex gap-1 border-b border-border px-4">
            <button
              onClick={() => setTab("architecture")}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm transition-colors ${
                tab === "architecture"
                  ? "border-b-2 border-accent text-text"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <GitBranch size={14} /> Architecture
            </button>
            <button
              onClick={() => setTab("details")}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm transition-colors ${
                tab === "details"
                  ? "border-b-2 border-accent text-text"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <ListChecks size={14} /> Details
            </button>
          </div>

          {/* body */}
          <div className="flex-1 overflow-auto p-6">
            {tab === "architecture" ? (
              <ArchDiagram
                nodes={project.arch.nodes}
                edges={project.arch.edges}
                caption={project.arch.caption}
              />
            ) : (
              <div className="space-y-6">
                <ul className="space-y-3">
                  {project.details.map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-text-muted">{d}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wide text-accent">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-xs text-text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    <GithubIcon size={16} /> View on GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
