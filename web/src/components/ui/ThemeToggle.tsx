"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("gb-theme") as "dark" | "light" | null;
      const initial =
        stored ??
        (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch {
      /* noop */
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("gb-theme", next);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="grid h-10 w-10 place-items-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {mounted && (
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      )}
    </button>
  );
}
