"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, X } from "lucide-react";
import { useQuality } from "@/components/providers/QualityProvider";

/**
 * One-time, dismissible note shown only when we auto-dropped to Lite.
 * Non-intrusive — sits bottom-left, never blocks content.
 */
export function ConnectionNotice() {
  const { quality, auto, reason, setQuality } = useQuality();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (auto && quality === "lite") {
      try {
        if (localStorage.getItem("gb-notice-dismissed") === "1") return;
      } catch {
        /* noop */
      }
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, [auto, quality]);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("gb-notice-dismissed", "1");
    } catch {
      /* noop */
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass fixed bottom-5 left-5 z-50 max-w-xs rounded-xl border border-border p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-accent">
              <Wifi size={16} />
            </span>
            <div className="text-sm">
              <p className="font-medium">Showing the lite version</p>
              <p className="mt-1 text-xs text-text-muted">
                Auto-switched because:{" "}
                <span className="font-mono text-accent">{reason}</span>. The full version
                includes a live neural-network background, 3D animations, and the interactive
                workstation. Switch when you&apos;re on a better connection.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    setQuality("full");
                    dismiss();
                  }}
                  className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white"
                >
                  Try full version
                </button>
                <button
                  onClick={dismiss}
                  className="rounded-md px-2.5 py-1 text-xs text-text-muted hover:text-text"
                >
                  Stay on lite
                </button>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-text-dim hover:text-text"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
