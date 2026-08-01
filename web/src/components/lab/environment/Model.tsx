"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Fit = { height: number } | { width: number };

/**
 * Loads a (CC0, uncompressed) glTF model and auto-fits it into the scene's
 * stylised unit system: the model is scaled so a chosen dimension matches
 * `fit`, recentred on its footprint, and seated with its base on y=0. This
 * makes placement robust regardless of each model's native metric size.
 *
 * Shadows are enabled on every mesh and `envMapIntensity` is applied so models
 * pick up the HDRI reflections that drive the room's realism.
 */
export function Model({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  fit,
  envIntensity = 1,
}: {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  fit: Fit;
  envIntensity?: number;
}) {
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (mat && "envMapIntensity" in mat) mat.envMapIntensity = envIntensity;
      }
    });
    return c;
  }, [scene, envIntensity]);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const s =
      "height" in fit
        ? fit.height / size.y
        : fit.width / Math.max(size.x, size.z);

    // recentre x/z on the footprint, seat the base on the floor (y=0)
    return {
      scale: s,
      offset: [-center.x * s, -box.min.y * s, -center.z * s] as [
        number,
        number,
        number
      ],
    };
  }, [cloned, fit]);

  return (
    <group position={position} rotation={rotation}>
      <group position={offset} scale={scale}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}
