"use client";

import { useEffect, useState } from "react";

/**
 * Detects WebGL2 availability on the client.
 * Returns `null` while undetermined (SSR / first paint), then `true`/`false`.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(!!gl);
      // release the probe context
      const lose = gl?.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
