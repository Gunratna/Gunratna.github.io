"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitBranch, ListChecks } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ArchDiagram } from "@/components/ui/ArchDiagram";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { Project } from "@/lib/content";

const TYPE_CLASS: Record<Project["type"], string> = {
  LLM: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  RAG: "text-sky-400 border-sky-400/40 bg-sky-400/10",
  Vision: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  Agentic: "text-purple-400 border-purple-400/40 bg-purple-400/10",
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Overlay sheet for the selected project plaque. Everything — including the
 * animated architecture diagram — resolves inside this popup; nothing
 * navigates away from the room. Dismiss with ✕, the backdrop, or Escape.
 */
export function StationPanel({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "arch">("overview");
  const trapRef = useFocusTrap<HTMLElement>(!!project);

  // reset to Overview whenever a different project is opened
  useEffect(() => {
    if (project) setTab("overview");
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.aside
            key="panel"
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} details`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="absolute right-0 top-0 z-30 flex h-full w-full max-w-2xl flex-col border-l border-border bg-bg/95 backdrop-blur-md"
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TYPE_CLASS[project.type]}`}
                  >
                    {project.type}
                  </span>
                  {project.experimental && (
                    <span className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                      Experimental
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-text-dim">{project.year}</span>
                </div>
                <h2 className="mt-2 truncate font-display text-xl font-medium">{project.name}</h2>
                <p className="mt-0.5 truncate text-sm text-text-muted">{project.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <X size={16} />
              </button>
            </div>

            {/* tabs */}
            <div className="flex gap-1 border-b border-border px-3 pt-2" role="tablist">
              <TabButton
                active={tab === "overview"}
                onClick={() => setTab("overview")}
                icon={<ListChecks size={14} />}
                label="Overview"
              />
              <TabButton
                active={tab === "arch"}
                onClick={() => setTab("arch")}
                icon={<GitBranch size={14} />}
                label="Architecture"
              />
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatePresence mode="wait">
                {tab === "overview" ? (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease }}
                  >
                    <p className="text-sm leading-relaxed text-text">{project.tagline}</p>

                    {/* animated outcome tiles */}
                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {project.outcomes.map((o, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.06 * i, duration: 0.35, ease }}
                          className="relative overflow-hidden rounded-xl border border-border bg-bg-elev p-3"
                        >
                          <div className="text-sm font-semibold text-accent">{o.value}</div>
                          <div className="mt-0.5 text-[11px] leading-tight text-text-dim">
                            {o.label}
                          </div>
                          <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.14 + 0.06 * i, duration: 0.5, ease }}
                            style={{ originX: 0 }}
                            className="absolute bottom-0 left-0 h-0.5 w-full bg-accent/60"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* tech */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tech.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.025, duration: 0.25 }}
                          className="rounded-md border border-border bg-bg-elev px-2 py-0.5 font-mono text-[11px] text-text-dim"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>

                    {/* details */}
                    <ul className="mt-5 space-y-3">
                      {project.details.map((d, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.26 + i * 0.06, duration: 0.3, ease }}
                          className="flex gap-3 text-sm text-text-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{d}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="arch"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease }}
                  >
                    <ArchDiagram
                      nodes={project.arch.nodes}
                      edges={project.arch.edges}
                      caption={project.arch.caption}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* footer */}
            <div className="flex items-center gap-3 border-t border-border px-5 py-3">
              <span className="font-mono text-[11px] text-text-dim">
                Esc to close · stays inside the room
              </span>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <GithubIcon size={15} /> GitHub
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm transition-colors ${
        active ? "text-accent" : "text-text-muted hover:text-text"
      }`}
    >
      {icon} {label}
      {active && (
        <motion.span
          layoutId="station-tab"
          className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
        />
      )}
    </button>
  );
}
