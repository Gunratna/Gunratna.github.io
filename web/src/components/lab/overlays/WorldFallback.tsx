"use client";

import { Boxes, ArrowDown } from "lucide-react";

/**
 * Graceful fallback shown when WebGL2 is unavailable or the 3D scene errors.
 * The full, keyboard-accessible project list already lives directly below the
 * stage, so we point people there rather than leaving a dead area.
 */
export function WorldFallback({
  title = "3D isn’t available right now",
  message = "Your browser or device can’t run the WebGL2 scene.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-b from-bg-elev-2 to-bg p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-border bg-bg-elev text-text-muted">
          <Boxes size={26} />
        </span>
        <p className="mt-5 font-display text-lg">{title}</p>
        <p className="mt-2 text-sm text-text-muted">{message}</p>
        <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-text-dim">
          <ArrowDown size={13} /> explore the same work below
        </p>
      </div>
    </div>
  );
}
