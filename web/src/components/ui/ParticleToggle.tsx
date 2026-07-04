"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KEY = "gb-particles";

export function ParticleToggle() {
  const [on, setOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "off") setOn(false);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try { localStorage.setItem(KEY, next ? "on" : "off"); } catch {}
    // dispatch custom event so BackgroundParticles can react
    window.dispatchEvent(new CustomEvent("gb-particles-toggle", { detail: next }));
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggle}
        aria-label={on ? "Turn off background particles" : "Turn on background particles"}
        title={on ? "Particles: on" : "Particles: off"}
        className={`glass fixed bottom-5 right-5 z-50 flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all hover:border-accent hover:text-accent ${
          on
            ? "border-accent/40 text-accent"
            : "border-border text-text-dim opacity-60"
        }`}
      >
        <Sparkles size={13} />
        {on ? "particles on" : "particles off"}
      </motion.button>
    </AnimatePresence>
  );
}
