"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches runtime errors thrown anywhere inside the 3D world so a WebGL/render
 * failure degrades to a graceful fallback instead of blanking the page.
 */
export class LabErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surfaced in the console for debugging; users see the fallback UI.
    console.error("[lab] 3D world crashed:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
