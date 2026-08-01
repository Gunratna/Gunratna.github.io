"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Applies exponential fog matched to the horizon color for atmospheric depth.
 * Image-based lighting/reflections are provided separately by drei's
 * <Environment> (a real Poly Haven HDRI).
 */
export function SceneEnvironment({
  horizon,
  fogDensity,
}: {
  horizon: string;
  fogDensity: number;
}) {
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(new THREE.Color(horizon), fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, horizon, fogDensity]);

  return null;
}
