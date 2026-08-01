"use client";

import { useRef } from "react";
import * as THREE from "three";

export type LightPalette = {
  sun: string;
  sunIntensity: number;
  sky: string;
  ground: string;
  hemiIntensity: number;
  warm: string;
  warmIntensity: number;
};

/**
 * Realistic lighting rig: a directional "sun" casting soft PCF shadows with a
 * tightly framed shadow camera and bias tuning, a HemisphereLight for sky/ground
 * ambient bounce, and a warm accent point light. No flat AmbientLight is used.
 */
export function Lighting({
  palette,
  shadows,
  shadowMapSize,
}: {
  palette: LightPalette;
  shadows: boolean;
  shadowMapSize: number;
}) {
  const sun = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      <hemisphereLight
        args={[palette.sky, palette.ground, palette.hemiIntensity]}
      />

      <directionalLight
        ref={sun}
        position={[6, 9, 4]}
        color={palette.sun}
        intensity={palette.sunIntensity}
        castShadow={shadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* warm interior accent (lamp / screen glow) */}
      <pointLight
        position={[-2.5, 2.2, 1.5]}
        color={palette.warm}
        intensity={palette.warmIntensity}
        distance={12}
        decay={2}
      />
    </>
  );
}
