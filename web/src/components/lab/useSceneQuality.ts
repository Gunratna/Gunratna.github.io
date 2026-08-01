"use client";

import { useEffect, useState } from "react";
import { useQuality } from "@/components/providers/QualityProvider";

export type SceneSettings = {
  tier: "full" | "lite";
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  ssao: boolean;
  bloom: boolean;
  idleCamera: boolean;
};

/**
 * Derives concrete 3D-scene settings from the site-wide QualityProvider tier
 * and the user's `prefers-reduced-motion` preference.
 */
export function useSceneQuality(): SceneSettings {
  const { quality } = useQuality();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  const full = quality === "full";

  return {
    tier: full ? "full" : "lite",
    dpr: full ? [1, 2] : [1, 1.25],
    shadows: full,
    shadowMapSize: full ? 2048 : 1024,
    ssao: full,
    bloom: full,
    idleCamera: full && !reduced,
  };
}
