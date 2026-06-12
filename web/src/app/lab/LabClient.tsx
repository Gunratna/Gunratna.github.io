"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Construction,
  Bot,
  FileSearch,
  Eye,
  Cpu,
  GitBranch,
  Boxes,
  Clock,
} from "lucide-react";
import { projects } from "@/lib/content";

/* ---- Map project types to icons ---- */
const TYPE_ICON = {
  LLM: Bot,
  RAG: FileSearch,
  Vision: Eye,
  Agentic: GitBranch,
};

/* ---- Teaser cards for each project ---- */
function ProjectTeaser({ project }: { project: (typeof projects)[number] }) {
  const Icon = TYPE_ICON[project.type] ?? Cpu;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="group relative overflow-hidden rounded-xl border border-border bg-bg-elev p-5"
    >
      {project.experimental && (
        <span className="mb-2 inline-block rounded border border-accent/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
          Experimental
        </span>
      )}
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-text-muted">{project.subtitle}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-md border border-border px-2 py-0.5 font-mono text-[10px] text-text-dim">
          {project.type}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-muted">{project.tagline}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.outcomes.map((o) => (
          <div key={o.label} className="text-center">
            <div className="font-mono text-base font-semibold text-accent">{o.value}</div>
            <div className="font-mono text-[10px] text-text-dim">{o.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 5).map((t) => (
          <span
            key={t}
            className="rounded border border-border px-1.5 py-0.5 font-mono text-[10.5px] text-text-dim"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="font-mono text-[10.5px] text-text-dim">
            +{project.tech.length - 5}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ---- Under Construction banner ---- */
function ConstructionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className="mx-auto mb-14 max-w-2xl rounded-2xl border border-accent/30 bg-accent-soft p-8 text-center"
    >
      <div className="flex justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl border border-accent/40 text-accent">
          <Construction size={32} />
        </span>
      </div>
      <h1 className="font-display mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
        The 3D Workstation
      </h1>
      <p className="mt-3 text-text-muted">
        An interactive 3D world where you can explore all my projects and pipelines is
        being built. It will feature a fully rendered office environment with live data
        flows and clickable project stations.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 font-mono text-sm text-accent">
        <Clock size={15} />
        <span>Coming soon — check back later</span>
      </div>
    </motion.div>
  );
}

/* ---- Main page ---- */
export function LabClient() {
  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 backdrop-blur-sm px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
        <span className="inline-flex items-center gap-2 font-mono text-xs text-text-dim">
          <Boxes size={14} /> workstation / preview
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <ConstructionBanner />

        {/* work summary */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Work Summary
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectTeaser key={p.id} project={p} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            View full project detail on the main site →
          </Link>
        </div>
      </main>
    </div>
  );
}
