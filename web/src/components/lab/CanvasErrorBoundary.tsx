"use client";

import { Component, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

/**
 * Catches render/runtime errors thrown inside the WebGL canvas subtree so a
 * single 3D failure never takes down the whole `/lab` page. Shows a calm,
 * on-brand fallback with a reload action; the full project list below the
 * canvas remains usable regardless.
 */
export class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // surfaced in dev; production stays silent to the user beyond the fallback
    console.error("[lab] 3D canvas error:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="grid h-full w-full place-items-center p-8 text-center">
          <div className="max-w-sm">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border bg-bg-elev text-text-muted">
              <TriangleAlert size={22} />
            </span>
            <p className="mt-4 font-display text-lg">The 3D room hit a snag</p>
            <p className="mt-2 text-sm text-text-muted">
              Rendering stopped unexpectedly. You can reload it, or explore the same
              work in the summary below.
            </p>
            <button
              onClick={() => this.setState({ failed: false })}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <RotateCcw size={15} /> Reload the room
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
