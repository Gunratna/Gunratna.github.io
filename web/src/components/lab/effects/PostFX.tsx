"use client";

import {
  EffectComposer,
  Bloom,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { SceneSettings } from "@/components/lab/useSceneQuality";
import type { VibeConfig } from "@/components/lab/vibes";

/**
 * Cinematic post-processing. Full tier only: subtle Unreal-style bloom for glow
 * on bright surfaces (screens/lamp), a gentle mood vignette, and SMAA.
 *
 * SSAO is deliberately NOT used here. The screen-space AO pass produced heavy
 * black speckling across the walls and around every object base, which hurt
 * legibility far more than the micro-shadows helped. Grounding contact shading
 * now comes from drei's ContactShadows in Scene.tsx, which is noise-free.
 */
export function PostFX({
  settings,
  vibe,
}: {
  settings: SceneSettings;
  vibe: VibeConfig;
}) {
  if (settings.tier !== "full") return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={vibe.post.bloomIntensity}
        luminanceThreshold={vibe.post.bloomThreshold}
        luminanceSmoothing={0.2}
      />
      <Vignette
        eskil={false}
        offset={0.4}
        darkness={vibe.post.vignette}
        blendFunction={BlendFunction.NORMAL}
      />
      <SMAA />
    </EffectComposer>
  );
}
