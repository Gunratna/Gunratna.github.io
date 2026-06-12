"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  User,
  Briefcase,
  FolderGit2,
  Wrench,
  GraduationCap,
  Mail,
  FileText,
  Boxes,
  SunMoon,
  CornerDownLeft,
} from "lucide-react";
import { meta } from "@/lib/content";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
  keywords?: string;
};

function scrollTo(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands = useMemo<Cmd[]>(
    () => [
      { id: "about", label: "Go to About", icon: User, run: () => scrollTo("#about"), keywords: "bio intro" },
      { id: "experience", label: "Go to Experience", icon: Briefcase, run: () => scrollTo("#experience"), keywords: "work cams job" },
      { id: "projects", label: "Go to Projects", icon: FolderGit2, run: () => scrollTo("#projects"), keywords: "work email sebi" },
      { id: "skills", label: "Go to Skills", icon: Wrench, run: () => scrollTo("#skills"), keywords: "tools stack" },
      { id: "education", label: "Go to Education", icon: GraduationCap, run: () => scrollTo("#education"), keywords: "iit degree" },
      { id: "contact", label: "Go to Contact", icon: Mail, run: () => scrollTo("#contact"), keywords: "email reach" },
      {
        id: "resume",
        label: "Open Resume (PDF)",
        icon: FileText,
        run: () => window.open(meta.resume, "_blank"),
        keywords: "cv download",
      },
      { id: "lab", label: "Enter the 3D Workstation", hint: "/lab", icon: Boxes, run: () => router.push("/lab"), keywords: "3d scene" },
      {
        id: "theme",
        label: "Toggle light / dark theme",
        icon: SunMoon,
        run: () => {
          const cur = document.documentElement.getAttribute("data-theme") || "dark";
          const next = cur === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          try {
            localStorage.setItem("gb-theme", next);
          } catch {}
        },
        keywords: "dark light mode",
      },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords?.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // open/close with Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const exec = (c: Cmd) => {
    setOpen(false);
    setTimeout(c.run, 120);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      exec(filtered[active]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[14vh]"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elev shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={17} className="text-text-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Jump to… (try 'resume' or 'lab')"
                suppressHydrationWarning
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-text-dim"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-dim sm:block">
                ESC
              </kbd>
            </div>

            <ul className="max-h-80 overflow-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-text-dim">
                  No matches
                </li>
              )}
              {filtered.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.id}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => exec(c)}
                      suppressHydrationWarning
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? "bg-accent-soft text-text" : "text-text-muted"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{c.label}</span>
                      {c.hint && (
                        <span className="font-mono text-xs text-text-dim">{c.hint}</span>
                      )}
                      {i === active && (
                        <CornerDownLeft size={14} className="text-accent" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
