"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Construction, Bot, FileSearch, Eye,
  Cpu, GitBranch, Boxes, Clock, ChevronDown, ChevronUp,
} from "lucide-react";
import { projects } from "@/lib/content";

/* ── type → icon ─────────────────────────────────────────── */
const TYPE_ICON = { LLM: Bot, RAG: FileSearch, Vision: Eye, Agentic: GitBranch };
const TYPE_COLOR: Record<string, string> = {
  LLM: "text-amber-400",
  RAG: "text-sky-400",
  Vision: "text-emerald-400",
  Agentic: "text-purple-400",
};
const TYPE_BG: Record<string, string> = {
  LLM: "bg-amber-400/10",
  RAG: "bg-sky-400/10",
  Vision: "bg-emerald-400/10",
  Agentic: "bg-purple-400/10",
};

/* ── animated 3D workstation teaser (pure canvas) ────────── */
function WorkstationTeaser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const ACCENT = "#e08a33";
    const DIM = "#3a3020";

    // desk outline vertices (isometric view)
    const desk = [
      [W * 0.2, H * 0.55], [W * 0.8, H * 0.55],
      [W * 0.8, H * 0.75], [W * 0.2, H * 0.75],
    ];

    // monitor frame
    const mon = {
      x: W * 0.38, y: H * 0.2, w: W * 0.24, h: H * 0.28,
    };

    // floating node positions
    const nodes = [
      { x: W * 0.22, y: H * 0.3, label: "Ingest", phase: 0 },
      { x: W * 0.40, y: H * 0.18, label: "Classify", phase: 1.2 },
      { x: W * 0.60, y: H * 0.22, label: "Intent", phase: 2.4 },
      { x: W * 0.78, y: H * 0.32, label: "Respond", phase: 3.6 },
    ];

    // signal state
    const signals: { seg: number; t: number; speed: number }[] = [
      { seg: 0, t: 0, speed: 0.008 },
      { seg: 1, t: 0.4, speed: 0.007 },
      { seg: 2, t: 0.8, speed: 0.009 },
    ];

    let raf = 0;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      const t = time * 0.001;

      // desk
      ctx.beginPath();
      ctx.moveTo(desk[0][0], desk[0][1]);
      desk.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fillStyle = "#1a1610";
      ctx.fill();
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // monitor
      ctx.fillStyle = "#111";
      ctx.fillRect(mon.x, mon.y, mon.w, mon.h);
      ctx.strokeStyle = DIM;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mon.x, mon.y, mon.w, mon.h);
      // screen glow
      const grd = ctx.createLinearGradient(mon.x, mon.y, mon.x, mon.y + mon.h);
      grd.addColorStop(0, "rgba(224,138,51,0.07)");
      grd.addColorStop(1, "rgba(224,138,51,0.02)");
      ctx.fillStyle = grd;
      ctx.fillRect(mon.x + 2, mon.y + 2, mon.w - 4, mon.h - 4);

      // fake code lines on monitor
      for (let i = 0; i < 6; i++) {
        const lw = mon.w * (0.3 + Math.sin(i * 2.1) * 0.25);
        ctx.fillStyle = i === 2 ? ACCENT + "80" : "#3a342870";
        ctx.fillRect(mon.x + 12, mon.y + 16 + i * 16, lw, 5);
      }

      // connections between nodes
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(
          a.x + Math.sin(t * 0.4 + a.phase) * 3,
          a.y + Math.cos(t * 0.3 + a.phase) * 3
        );
        ctx.lineTo(
          b.x + Math.sin(t * 0.4 + b.phase) * 3,
          b.y + Math.cos(t * 0.3 + b.phase) * 3
        );
        ctx.strokeStyle = ACCENT + "30";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // signals
      for (const sig of signals) {
        sig.t = (sig.t + sig.speed) % 1;
        const seg = sig.seg;
        const a = nodes[seg];
        const b = nodes[seg + 1];
        const ax = a.x + Math.sin(t * 0.4 + a.phase) * 3;
        const ay = a.y + Math.cos(t * 0.3 + a.phase) * 3;
        const bx = b.x + Math.sin(t * 0.4 + b.phase) * 3;
        const by = b.y + Math.cos(t * 0.3 + b.phase) * 3;
        const sx = ax + (bx - ax) * sig.t;
        const sy = ay + (by - ay) * sig.t;
        const fade = Math.sin(sig.t * Math.PI);
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5 * fade, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.globalAlpha = fade * 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // floating nodes
      for (const n of nodes) {
        const nx = n.x + Math.sin(t * 0.4 + n.phase) * 3;
        const ny = n.y + Math.cos(t * 0.3 + n.phase) * 3;
        // glow
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 18);
        g.addColorStop(0, ACCENT + "50");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, ny, 18, 0, Math.PI * 2);
        ctx.fill();
        // node
        ctx.beginPath();
        ctx.arc(nx, ny, 8, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
        // pulsing ring
        const ring = (t * 0.6 + n.phase) % 1;
        ctx.beginPath();
        ctx.arc(nx, ny, 8 + ring * 16, 0, Math.PI * 2);
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1;
        ctx.globalAlpha = (1 - ring) * 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
        // label
        ctx.font = `10px monospace`;
        ctx.fillStyle = "#f2ede3";
        ctx.textAlign = "center";
        ctx.fillText(n.label, nx, ny + 24);
      }

      // "drag to orbit" hint
      ctx.font = "11px monospace";
      ctx.fillStyle = "#8a817080";
      ctx.textAlign = "center";
      ctx.fillText("↺  Interactive 3D workstation coming soon", W / 2, H - 14);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-label="Animated preview of the 3D workstation"
    />
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

/* ── under-construction banner ────────────────────────────── */
function ConstructionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className="mb-16 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-border lg:grid-cols-2"
    >
      {/* left — text */}
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent-soft text-accent">
            <Construction size={24} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-medium sm:text-3xl">
              The 3D Workstation
            </h1>
            <p className="font-mono text-xs text-accent">under construction</p>
          </div>
        </div>
        <p className="mt-5 text-text-muted">
          An interactive 3D office where you can orbit, click project stations, read
          live pipeline data on glowing monitors, and explore every project as a
          spatial experience.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {["Dual monitors", "Floating nodes", "Data flows", "City window", "Bookshelf"].map(
            (f) => (
              <span
                key={f}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-dim"
              >
                {f}
              </span>
            )
          )}
        </div>
        <div className="mt-6 flex items-center gap-2 font-mono text-sm text-accent">
          <Clock size={14} />
          <span>Deploying soon</span>
        </div>
      </div>

      {/* right — animated preview */}
      <div className="relative min-h-[260px] border-t border-border bg-bg-elev-2 lg:border-l lg:border-t-0">
        <WorkstationTeaser />
      </div>
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
          <Boxes size={14} /> workstation / preview
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <ConstructionBanner />

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
