import type { NextConfig } from "next";

/**
 * Static export for free hosting (GitHub Pages / Vercel / Netlify).
 * - `output: export` emits a fully static ./out folder.
 * - images.unoptimized is required because static export has no image server.
 * - For GitHub Pages under a project path, set BASE_PATH (e.g. "/portfolio").
 *   For a user site (gunratna.github.io) leave it empty.
 */
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
