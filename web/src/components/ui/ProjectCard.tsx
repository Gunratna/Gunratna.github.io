"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => onOpen(project)}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ y: -6 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-bg-elev p-6 transition-colors hover:border-accent/60"
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute -inset-px rounded-xl"
          style={{
            background:
              "radial-gradient(400px circle at var(--x,50%) var(--y,50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />
      </div>

      <div className="relative flex items-center justify-between">
        <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted">
          {project.type}
        </span>
        <span className="font-mono text-xs text-text-dim">{project.year}</span>
      </div>

      <h3 className="relative mt-4 text-lg font-semibold">{project.name}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-text-muted">
        {project.tagline}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded border border-border px-1.5 py-0.5 font-mono text-[10.5px] text-text-dim transition-colors group-hover:border-border-strong"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 4 && (
          <span className="px-1 font-mono text-[10.5px] text-text-dim">
            +{project.tech.length - 4}
          </span>
        )}
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-accent">
          <Code2 size={15} /> Architecture & Code
        </span>
        <ArrowUpRight
          size={18}
          className="text-text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
    </motion.article>
  );
}
