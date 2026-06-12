"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Command } from "lucide-react";
import { navLinks, meta } from "@/lib/content";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { QualityToggle } from "@/components/ui/QualityToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass border-b border-border" : "border-b border-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 sm:px-8",
            scrolled ? "h-14" : "h-20"
          )}
        >
          <a href="#top" className="text-[15px] font-semibold tracking-tight">
            {meta.name}
            <span className="text-accent">.</span>
          </a>

          <div className="flex items-center gap-7">
            <ul className="hidden items-center gap-7 md:flex">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative text-[13.5px] font-medium text-text-muted transition-colors hover:text-text"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-200 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                );
              }}
              aria-label="Open command palette"
              className="hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs text-text-dim transition-colors hover:border-accent hover:text-accent lg:flex"
            >
              <Command size={12} /> K
            </button>
            <QualityToggle className="hidden sm:flex" />
            <ThemeToggle />
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="absolute right-0 top-0 flex h-full w-72 flex-col gap-2 border-l border-border bg-bg-elev p-6 pt-24"
            >
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  className="rounded-lg px-4 py-3 text-lg font-medium text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-text"
                >
                  {l.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
