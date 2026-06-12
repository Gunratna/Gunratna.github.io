"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";

const FILTERS = ["All", "LLM", "RAG", "Vision", "Agentic"] as const;

export function Projects() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.type === active);

  return (
    <Section id="projects" label="Selected Projects">
      <Reveal>
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              suppressHydrationWarning
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:border-border-strong hover:text-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={p} onOpen={setOpen} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </Section>
  );
}
