"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useQuality } from "@/components/providers/QualityProvider";

/* Plausible, resume-grounded status lines (nothing invented beyond the work). */
const LINES = [
  "email_bot · batch triaged · 412 messages",
  "intent_engine · schema valid · PAN+folio extracted",
  "sebi_rag · query grounded ✓ · 8 chunks",
  "junk_classifier · FN rate 0.1% · holding",
  "gst_extract · 7 fields · 840ms",
  "aadhaar_redact · 12 pages masked · DPDP ok",
  "ci/cd · agentic review passed · MR #214",
  "cloud_run · p95 480ms · 23 AMCs live",
];

type Toast = { id: number; text: string; shown: string };

export function TerminalToasts() {
  const { quality } = useQuality();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const lineRef = useRef(0);

  useEffect(() => {
    if (quality !== "full") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let typeTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;

    const spawn = () => {
      const text = LINES[lineRef.current % LINES.length];
      lineRef.current += 1;
      const id = idRef.current++;
      setToasts((t) => [...t.slice(-2), { id, text, shown: reduced ? text : "" }]);

      if (!reduced) {
        let i = 0;
        const type = () => {
          i += 1;
          setToasts((t) =>
            t.map((x) => (x.id === id ? { ...x, shown: text.slice(0, i) } : x))
          );
          if (i < text.length) typeTimer = setTimeout(type, 22);
        };
        typeTimer = setTimeout(type, 120);
      }

      removeTimer = setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 5200);
    };

    // first after a delay, then every ~9s
    const first = setTimeout(spawn, 4000);
    const interval = setInterval(spawn, 9000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimeout(typeTimer);
      clearTimeout(removeTimer);
    };
  }, [quality]);

  if (quality !== "full") return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex w-[min(86vw,340px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="glass flex items-start gap-2 rounded-lg border border-border px-3 py-2 shadow-lg"
          >
            <Terminal size={13} className="mt-0.5 shrink-0 text-accent" />
            <code className="font-mono text-[11.5px] leading-snug text-text-muted">
              {t.text === t.shown ? (
                t.text
              ) : (
                <span className="cursor-blink">{t.shown}</span>
              )}
            </code>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
