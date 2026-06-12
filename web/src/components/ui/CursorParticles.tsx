"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Cursor-triggered particle trail drawn on a 2D canvas.
 * Particles are tiny — just 1-3px dots that drift and fade quickly.
 * The canvas is fixed and covers the whole viewport but is
 * pointer-events:none so it never interferes with interaction.
 */
export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const particles: Particle[] = [];
    let raf = 0;
    let lastX = -999;
    let lastY = -999;

    const getAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#c97c2f";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const spawn = (x: number, y: number) => {
      // throttle by distance — only spawn if moved ≥6px
      const d = Math.hypot(x - lastX, y - lastY);
      if (d < 6) return;
      lastX = x;
      lastY = y;

      // 2-4 particles per trigger — very sparse
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.9;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4, // slight upward drift
          life: 1,
          maxLife: 40 + Math.floor(Math.random() * 30),
          size: 1 + Math.random() * 1.5,
        });
      }

      // cap pool
      if (particles.length > 200) particles.splice(0, particles.length - 200);
    };

    const onMove = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove, { passive: true });

    const color = getAccent();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.018; // gentle gravity
        p.vx *= 0.97;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life * 0.55;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[99]"
    />
  );
}
