import type { NextConfig } from "next";

/**
 * Static export for free hosting (GitHub Pages / Vercel / Netlify).
 * - `output: export` emits a fully static ./out folder.
 * - images.unoptimized is required because static export has no image server.
 * - For GitHub Pages under a project path, set BASE_PATH (e.g. "/portfolio").
 *   For a user site (gunratna.github.io) leave it empty.
 */
const basePath = process.env.BASE_PATH || "";

/**
 * Production builds write to their own `distDir` so that running
 * `next build` never clobbers the chunks of a live `next dev` server —
 * sharing `.next` caused runtime "Cannot find module './331.js'" errors.
 * The static export still lands in `./out` either way.
 */
export default function config(phase: string): NextConfig {
  const isBuild = phase === "phase-production-build";

  return {
    output: "export",
    distDir: process.env.NEXT_DIST_DIR || (isBuild ? ".next-build" : ".next"),
    basePath: basePath || undefined,
    images: { unoptimized: true },
    trailingSlash: true,
    devIndicators: false,
    // The dev-only "Segment Explorer" devtool intermittently corrupts the RSC
    // client manifest during heavy hot-reloading (segment-explorer-node /
    // __webpack_modules__ errors → 500 on /lab). Disabling it has no effect on
    // the production static export.
    experimental: {
      devtoolSegmentExplorer: false,
    },
  };
}
