"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Poly Haven texture sets (CC0). Each slug ships three 1k JPG maps:
 *  - diff   → base color (sRGB)
 *  - arm    → AO (R) / Roughness (G) / Metalness (B), packed, linear
 *  - nor_gl → OpenGL tangent-space normal, linear
 */
export const SLUGS = [
  "wood_floor_deck",
  "painted_plaster_wall",
  "wood_table_001",
  "fabric_leather_02",
  "denim_fabric",
  "metal_plate",
] as const;

export type Slug = (typeof SLUGS)[number];

type Tier = "full" | "lite";

const base = (slug: string, map: string, tier: Tier) =>
  `/lab/textures/${slug}/${slug}_${map}.${tier}.webp`;

export type SlugMaps = {
  map: THREE.Texture;
  arm: THREE.Texture;
  normalMap: THREE.Texture;
};

export type LabTextures = Record<Slug, SlugMaps>;

/** Loads and configures every room texture set (Suspense-driven via drei). */
export function useLabTextures(tier: Tier): LabTextures {
  // Build a flat path map for a single useTexture call.
  const paths = useMemo(() => {
    const p: Record<string, string> = {};
    for (const slug of SLUGS) {
      p[`${slug}__map`] = base(slug, "diff", tier);
      p[`${slug}__arm`] = base(slug, "arm", tier);
      p[`${slug}__nor`] = base(slug, "nor_gl", tier);
    }
    return p;
  }, [tier]);

  const loaded = useTexture(paths) as Record<string, THREE.Texture>;
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  // Cap anisotropy: high values are costly on mobile GPUs.
  const aniso = Math.min(maxAniso, tier === "full" ? 8 : 4);

  return useMemo(() => {
    const result = {} as LabTextures;
    for (const slug of SLUGS) {
      const map = loaded[`${slug}__map`];
      const arm = loaded[`${slug}__arm`];
      const normalMap = loaded[`${slug}__nor`];

      for (const t of [map, arm, normalMap]) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = aniso;
      }
      map.colorSpace = THREE.SRGBColorSpace;
      arm.colorSpace = THREE.NoColorSpace;
      normalMap.colorSpace = THREE.NoColorSpace;

      result[slug] = { map, arm, normalMap };
    }
    return result;
  }, [loaded, aniso]);
}

/**
 * Builds a MeshStandardMaterial from a texture set. The ARM map drives both
 * roughness (G) and metalness (B). `repeat` tiles the maps to real-world scale.
 */
export function makeMaterial(
  set: SlugMaps,
  opts: {
    repeat?: [number, number];
    roughness?: number;
    metalness?: number;
    normalScale?: number;
    color?: string;
  } = {}
): THREE.MeshStandardMaterial {
  const { repeat = [1, 1], roughness = 1, metalness = 1, normalScale = 1, color } = opts;

  const map = set.map.clone();
  const arm = set.arm.clone();
  const normalMap = set.normalMap.clone();
  for (const t of [map, arm, normalMap]) {
    t.repeat.set(repeat[0], repeat[1]);
    t.needsUpdate = true;
  }
  map.colorSpace = THREE.SRGBColorSpace;

  return new THREE.MeshStandardMaterial({
    map,
    roughnessMap: arm,
    metalnessMap: arm,
    normalMap,
    roughness,
    metalness,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    ...(color ? { color: new THREE.Color(color) } : {}),
    envMapIntensity: 1,
  });
}
