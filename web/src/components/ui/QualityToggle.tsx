"use client";

import { Gauge, Zap } from "lucide-react";
import { useQuality } from "@/components/providers/QualityProvider";
import { cn } from "@/lib/utils";

/** Compact Lite/Full switch. Shows in the navbar. */
export function QualityToggle({ className }: { className?: string }) {
  const { quality, setQuality } = useQuality();

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-border p-0.5 text-xs",
        className
      )}
      role="group"
      aria-label="Visual quality"
    >
      <button
        onClick={() => setQuality("lite")}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1 font-mono transition-colors",
          quality === "lite"
            ? "bg-accent-soft text-accent"
            : "text-text-dim hover:text-text"
        )}
        aria-pressed={quality === "lite"}
        title="Lite — fewer animations, faster on slow connections"
      >
        <Gauge size={13} /> Lite
      </button>
      <button
        onClick={() => setQuality("full")}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1 font-mono transition-colors",
          quality === "full"
            ? "bg-accent-soft text-accent"
            : "text-text-dim hover:text-text"
        )}
        aria-pressed={quality === "full"}
        title="Full — all animations and 3D"
      >
        <Zap size={13} /> Full
      </button>
    </div>
  );
}
