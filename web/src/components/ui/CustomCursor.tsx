"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cursor aura — paints directly on a canvas.
 * The OS cursor is kept fully visible (no cursor:none anywhere).
 * On every mousemove we draw:
 *   - a trailing circle that lerps toward the pointer (pure rAF lerp, no React state)
 *   - a dissolving history trail of past positions
 *   - an expanding click ripple
 * Disabled on coarse pointers and reduced-motion.
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const aura = { x: mouse.x, y: mouse.y };
    const trail: { x: number; y: number; a: number }[] = [];
    const ripples: { x: number; y: number; r: number; a: number }[] = [];
    let isOver = false; // hovering over interactive element
    let raf = 0;

    const getAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#c97c2f";

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = e.target as HTMLElement;
      isOver = !!t.closest("a, button, [role='button'], input, textarea");
      // add a trail crumb every few pixels
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 6) {
        trail.push({ x: e.clientX, y: e.clientY, a: 0.45 });
        if (trail.length > 20) trail.shift();
      }
    };

    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 0.8 });
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const accentColor = getAccent();

      // lerp aura toward mouse (fast enough to feel responsive but slight trail)
      aura.x += (mouse.x - aura.x) * 0.28;
      aura.y += (mouse.y - aura.y) * 0.28;

      // decay trail
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.a -= 0.025;
        if (p.a <= 0) { trail.splice(i, 1); i--; continue; }
        const progress = i / trail.length;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + progress * 2, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = p.a * progress;
        ctx.fill();
      }

      // outer aura ring — gently pulses
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.06;
      const baseR = isOver ? 28 : 18;
      ctx.beginPath();
      ctx.arc(aura.x, aura.y, baseR * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = isOver ? 1.5 : 1;
      ctx.globalAlpha = isOver ? 0.45 : 0.28;
      ctx.stroke();

      // inner accent dot (tiny, sharp, always at exact mouse position)
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, isOver ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = isOver ? 0.9 : 0.6;
      ctx.fill();

      // ripples
      for (let i = 0; i < ripples.length; i++) {
        const rp = ripples[i];
        rp.r += 3.5;
        rp.a -= 0.04;
        if (rp.a <= 0) { ripples.splice(i, 1); i--; continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = rp.a;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[99]"
      style={{ willChange: "transform" }}
    />
  );
}
