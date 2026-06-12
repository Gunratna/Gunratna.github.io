"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowDown, FileText, Boxes } from "lucide-react";
import { meta, profileCard } from "@/lib/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Typewriter } from "@/components/ui/Typewriter";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { useQuality } from "@/components/providers/QualityProvider";

const ParticleField = dynamic(() => import("@/components/ui/ParticleField"), {
  ssr: false,
});

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Quiet "currently" card — factual, editorial, with a gentle 3D tilt in Full. */
function ProfileCard() {
  const { quality } = useQuality();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (quality !== "full") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set((0.5 - (e.clientY - r.top) / r.height) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      variants={item}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className="overflow-hidden rounded-xl border border-border bg-bg-elev shadow-xl"
    >
      {/* open-to badges */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">
          Open to
        </span>
        {profileCard.openTo.map((role) => (
          <span
            key={role}
            className="rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent"
          >
            {role}
          </span>
        ))}
      </div>
      <dl className="divide-y divide-border">
        {profileCard.rows.map((r) => (
          <div key={r.k} className="flex gap-4 px-5 py-3">
            <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wide text-text-dim">
              {r.k}
            </dt>
            <dd className="text-sm">{r.v}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

export function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const { quality } = useQuality();

  return (
    <header
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {quality === "full" && (
        <div aria-hidden className="absolute inset-0 opacity-70">
          <ParticleField />
        </div>
      )}
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev/60 px-3 py-1 font-mono text-xs text-text-muted"
          >
            {meta.role} · {meta.company}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-medium leading-[1.0] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {meta.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted"
          >
            <Typewriter text={meta.tagline} />
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <MagneticButton onClick={() => setResumeOpen(true)} variant="outline">
              <FileText size={16} /> View Resume
            </MagneticButton>
            <MagneticButton href="#contact" variant="fill">
              Get in Touch <ArrowRight size={16} />
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-6">
            <Link
              href="/lab"
              className="group inline-flex items-center gap-3 rounded-xl border border-border bg-bg-elev/70 px-4 py-3 text-sm transition-all hover:border-accent hover:bg-bg-elev hover:shadow-md"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Boxes size={17} />
              </span>
              <span className="flex flex-col">
                <span className="font-medium text-text">Step into the 3D Workstation</span>
                <span className="text-xs text-text-dim">explore my pipeline in an interactive world</span>
              </span>
              <ArrowRight
                size={15}
                className="ml-auto text-text-dim transition-transform group-hover:translate-x-1 group-hover:text-accent"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show">
          <ProfileCard />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-dim"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <ArrowDown size={22} />
      </motion.a>

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </header>
  );
}
