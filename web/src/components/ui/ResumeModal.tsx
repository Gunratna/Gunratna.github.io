"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { meta } from "@/lib/content";

export function ResumeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
          className="relative flex h-full max-h-[860px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-bg-elev shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="font-mono text-sm text-text-muted">
              Gunratna_Resume.pdf
            </span>
            <div className="flex items-center gap-2">
              <a
                href={meta.resume}
                download
                className="grid h-9 w-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-accent"
                aria-label="Download resume"
              >
                <Download size={17} />
              </a>
              <a
                href={meta.resume}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-accent"
                aria-label="Open in new tab"
              >
                <ExternalLink size={17} />
              </a>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-text"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <object
            data={`${meta.resume}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className="h-full w-full flex-1 bg-bg-elev-2"
          >
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-text-muted">
                Your browser can&apos;t preview PDFs inline.
              </p>
              <a
                href={meta.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
              >
                <ExternalLink size={16} /> Open Resume
              </a>
            </div>
          </object>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
