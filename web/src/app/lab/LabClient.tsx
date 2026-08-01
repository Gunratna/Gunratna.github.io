"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bot, FileSearch, Eye, ScanEye,
  Cpu, GitBranch, Boxes, ChevronDown, ChevronUp, Loader2, MousePointer2, Play,
} from "lucide-react";
import { projects } from "@/lib/content";
import { useWebGLSupport } from "@/lib/useWebGLSupport";
import { VIBE_LIST, type VibeId } from "@/components/lab/vibes";
import { LabErrorBoundary } from "@/components/lab/LabErrorBoundary";
import { WorldFallback } from "@/components/lab/overlays/WorldFallback";

const World = dynamic(() => import("@/components/lab/World"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-text-dim">
      <span className="inline-flex items-center gap-2 font-mono text-xs">
        <Loader2 size={14} className="animate-spin" /> loading the room…
      </span>
    </div>
  ),
});

/* ── type → icon ─────────────────────────────────────────── */
const TYPE_ICON = { LLM: Bot, RAG: FileSearch, Vision: Eye, VLM: ScanEye, Agentic: GitBranch };
const TYPE_COLOR: Record<string, string> = {
  LLM: "text-amber-400",
  RAG: "text-sky-400",
  Vision: "text-emerald-400",
  VLM: "text-rose-400",
  Agentic: "text-purple-400",
};
const TYPE_BG: Record<string, string> = {
  LLM: "bg-amber-400/10",
  RAG: "bg-sky-400/10",
  Vision: "bg-emerald-400/10",
  VLM: "bg-rose-400/10",
  Agentic: "bg-purple-400/10",
};

/* ── 3D world stage (with graceful WebGL fallback + click-to-enter) ── */
function WorldStage() {
  const webgl = useWebGLSupport();
  const [vibe, setVibe] = useState<VibeId>("study");
  const [entered, setEntered] = useState(false);

  return (
    <div
      role="region"
      aria-label="Interactive 3D workstation scene"
      className="relative mb-14 h-[68vh] min-h-[420px] overflow-hidden rounded-2xl border border-border bg-bg-elev-2"
    >
      {webgl === false ? (
        <WorldFallback />
      ) : webgl === true && entered ? (
        <>
          <LabErrorBoundary
            fallback={
              <WorldFallback
                title="The 3D scene hit a snag"
                message="Something went wrong while rendering the room."
              />
            }
          >
            <World vibeId={vibe} />
          </LabErrorBoundary>

          {/* vibe switcher */}
          <div className="absolute left-4 top-4 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
            {VIBE_LIST.map((v) => (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                aria-pressed={vibe === v.id}
                className={`flex flex-col rounded-lg px-3 py-1.5 text-left transition-colors ${
                  vibe === v.id
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <span className="text-sm font-medium">{v.label}</span>
                <span className="font-mono text-[10px] text-white/50">{v.blurb}</span>
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/70 px-3 py-1.5 font-mono text-[11px] text-text-muted backdrop-blur-sm">
              <MousePointer2 size={13} /> drag to orbit · scroll to zoom · click a marker
            </span>
          </div>
        </>
      ) : webgl === true && !entered ? (
        <EnterGate vibe={vibe} setVibe={setVibe} onEnter={() => setEntered(true)} />
      ) : (
        <div className="grid h-full w-full place-items-center text-text-dim">
          <span className="inline-flex items-center gap-2 font-mono text-xs">
            <Loader2 size={14} className="animate-spin" /> checking capabilities…
          </span>
        </div>
      )}
    </div>
  );
}

/* ── entry poster: defers loading the 3D bundle + assets until intent ── */
function EnterGate({
  vibe,
  setVibe,
  onEnter,
}: {
  vibe: VibeId;
  setVibe: (v: VibeId) => void;
  onEnter: () => void;
}) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-b from-bg-elev-2 to-bg p-8 text-center">
      <div className="max-w-md">
        <span className="grid h-14 w-14 place-items-center mx-auto rounded-2xl border border-accent/30 bg-accent-soft text-accent">
          <Boxes size={26} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-medium">Enter the workstation</h2>
        <p className="mt-2 text-sm text-text-muted">
          A real-time 3D room you can orbit and explore. Pick a vibe, then step in —
          it loads only when you&apos;re ready.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          {VIBE_LIST.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id)}
              aria-pressed={vibe === v.id}
              className={`rounded-xl border px-4 py-2 text-left transition-colors ${
                vibe === v.id
                  ? "border-accent bg-accent-soft text-text"
                  : "border-border text-text-muted hover:border-accent/50"
              }`}
            >
              <span className="block text-sm font-medium">{v.label}</span>
              <span className="block font-mono text-[10px] text-text-dim">{v.blurb}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onEnter}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          <Play size={16} /> Enter in {VIBE_LIST.find((v) => v.id === vibe)?.label}
        </button>
        <p className="mt-3 font-mono text-[11px] text-text-dim">
          ~1–3&nbsp;MB · loads on demand · works on phones &amp; laptops
        </p>
      </div>
    </div>
  );
}

/* ── project teaser card ──────────────────────────────────── */
function ProjectTeaser({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = TYPE_ICON[project.type] ?? Cpu;
  const color = TYPE_COLOR[project.type] ?? "text-accent";
  const bg = TYPE_BG[project.type] ?? "bg-accent/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
      className="rounded-2xl border border-border bg-bg-elev"
    >
      {/* header */}
      <div className="flex items-start gap-4 p-6">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${bg} ${color}`}>
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{project.name}</h3>
            {project.experimental && (
              <span className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                Experimental
              </span>
            )}
            <span className={`ml-auto rounded-md border border-border px-2 py-0.5 font-mono text-[10px] ${color}`}>
              {project.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">{project.tagline}</p>
        </div>
      </div>

      {/* outcomes — clean table rows, NOT giant numbers */}
      <div className="mx-6 mb-5 rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {project.outcomes.map((o, i) => (
            <div key={i} className={`p-3 text-center ${i > 0 ? "border-l border-border" : ""}`}>
              <div className={`text-sm font-semibold ${color}`}>{o.value}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-text-dim">{o.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tech stack */}
      <div className="mx-6 mb-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, expanded ? undefined : 5).map((t) => (
          <span
            key={t}
            className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-dim"
          >
            {t}
          </span>
        ))}
        {!expanded && project.tech.length > 5 && (
          <span className="font-mono text-[11px] text-text-dim">
            +{project.tech.length - 5} more
          </span>
        )}
      </div>

      {/* expand details */}
      <button
        onClick={() => setExpanded((x) => !x)}
        className="flex w-full items-center justify-between border-t border-border px-6 py-3 text-xs text-text-muted transition-colors hover:text-accent"
      >
        <span>{expanded ? "Less detail" : "More detail"}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 px-6 pb-6 pt-2">
              {project.details.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── main page ────────────────────────────────────────────── */
export function LabClient() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 px-5 py-3 backdrop-blur-sm sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
        <span className="inline-flex items-center gap-2 font-mono text-xs text-text-dim">
          <Boxes size={14} /> workstation
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-medium sm:text-3xl">
            The Workstation
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Step into a rendered room and explore the work spatially. Drag to orbit,
            scroll to zoom.
          </p>
        </div>

        <WorldStage />

        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Work Summary
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-5">
          {projects.map((p, i) => (
            <ProjectTeaser key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            View full interactive architecture on the main site →
          </Link>
        </div>
      </main>
    </div>
  );
}
