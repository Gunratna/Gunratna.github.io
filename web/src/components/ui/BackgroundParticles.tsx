"use client";

import { useEffect, useRef } from "react";
import { useQuality } from "@/components/providers/QualityProvider";

/**
 * Cursor-interactive ambient particle canvas shown below sections.
 * Particles drift in a slow flow field; cursor repels them.
 * Full mode: 60 particles. Lite mode: not rendered.
 * Runs at 30fps cap for efficiency.
 */
export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { quality } = useQuality();

  useEffect(() => {
    if (quality !== "full") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 55;
    let w = 0, h = 0;
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let last = 0;
    const FRAME = 1000 / 30;

    type P = { x: number; y: number; vx: number; vy: number; phase: number; size: number };
    let particles: P[] = [];

    const getAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c97c2f";

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      particles = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 1.8,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < FRAME) return;
      last = now;

      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      const color = getAccent();

      for (const p of particles) {
        // gentle flow field
        p.vx += Math.sin(t * 0.18 + p.phase + p.y * 0.009) * 0.012;
        p.vy += Math.cos(t * 0.15 + p.phase + p.x * 0.009) * 0.012;

        // cursor repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) + 0.01;
          const force = (120 - d) / 120 * 0.4;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        // damping
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // draw node
        const alpha = 0.25 + Math.sin(t * 0.5 + p.phase) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      // draw edges between nearby particles
      ctx.strokeStyle = getAccent();
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 6400) {
            ctx.globalAlpha = (1 - Math.sqrt(d2) / 80) * 0.08;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [quality]);

  if (quality !== "full") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
