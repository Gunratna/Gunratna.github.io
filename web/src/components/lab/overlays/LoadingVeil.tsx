"use client";

import { Html } from "@react-three/drei";

/** Static in-canvas loading indicator shown as the Scene's Suspense fallback. */
export function LoadingVeil() {
  return (
    <Html center>
      <div className="flex select-none flex-col items-center gap-3">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
        </div>
        <span className="font-mono text-[11px] tracking-wide text-white/70">
          entering the room…
        </span>
      </div>
    </Html>
  );
}
