"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/lib/content";
import { makePlaqueTextures, TYPE_HEX } from "@/components/lab/stations/plaqueTexture";

// matches the 1024x560 texture aspect so nothing is stretched
const PW = 2.34;
const PH = 1.28;

/**
 * A framed project panel mounted on the wall — reads as a physical backlit
 * display rather than a floating UI marker. On hover it eases forward off the
 * wall, its backlight lifts, and an accent bar sweeps across the base.
 */
export function ProjectPlaque({
  project,
  index,
  position,
  active,
  screenGlow,
  onSelect,
}: {
  project: Project;
  index: number;
  position: [number, number, number];
  active: boolean;
  /** vibe-driven backlight strength so plaques dim with the room */
  screenGlow: number;
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || active;
  const accent = TYPE_HEX[project.type];

  const group = useRef<THREE.Group>(null);
  const face = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.Mesh>(null);

  const { idle, lit: litTex } = useMemo(
    () => makePlaqueTextures(project, index),
    [project, index]
  );
  useEffect(() => () => {
    idle.dispose();
    litTex.dispose();
  }, [idle, litTex]);

  const tex = lit ? litTex : idle;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 8);

    // ease the whole plaque forward off the wall on hover
    if (group.current) {
      const targetZ = lit ? 0.09 : 0;
      group.current.position.z += (position[2] + targetZ - group.current.position.z) * k;
      const targetScale = lit ? 1.045 : 1;
      const s = group.current.scale.x + (targetScale - group.current.scale.x) * k;
      group.current.scale.setScalar(s);
    }

    // backlight breathes; brighter when focused
    if (face.current) {
      const m = face.current.material as THREE.MeshStandardMaterial;
      const base = screenGlow * (lit ? 1.35 : 0.9);
      const target = base + Math.sin(t * 1.6 + index) * 0.04;
      m.emissiveIntensity += (target - m.emissiveIntensity) * k;
    }

    // accent bar sweeps along the base while focused
    if (sweep.current) {
      const span = PW - 0.12;
      const p = (t * 0.55 + index * 0.2) % 1;
      sweep.current.position.x = -span / 2 + p * span;
      sweep.current.visible = lit;
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group ref={group} position={position}>
      {/* frame */}
      <mesh castShadow receiveShadow position={[0, 0, -0.03]}>
        <boxGeometry args={[PW + 0.1, PH + 0.1, 0.07]} />
        <meshStandardMaterial color="#191c22" roughness={0.42} metalness={0.75} />
      </mesh>

      {/* backlit face — toneMapped off so the panel content keeps full contrast
          instead of being crushed by ACES in the darker vibe */}
      <mesh ref={face} position={[0, 0, 0.015]}>
        <planeGeometry args={[PW, PH]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={screenGlow * 0.9}
          roughness={0.35}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* base rail + sweeping accent */}
      <mesh position={[0, -PH / 2 - 0.035, 0.02]}>
        <boxGeometry args={[PW, 0.02, 0.02]} />
        <meshStandardMaterial color="#0e1116" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh ref={sweep} position={[0, -PH / 2 - 0.035, 0.032]}>
        <boxGeometry args={[0.26, 0.026, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* active outline */}
      {active && (
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[PW + 0.16, PH + 0.16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      )}

      {/* hit area */}
      <mesh
        position={[0, 0, 0.05]}
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        visible={false}
      >
        <planeGeometry args={[PW + 0.12, PH + 0.12]} />
      </mesh>
    </group>
  );
}
