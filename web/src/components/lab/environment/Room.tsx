"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useLabTextures, makeMaterial } from "@/components/lab/environment/materials";
import { Model } from "@/components/lab/environment/Model";
import type { VibeConfig } from "@/components/lab/vibes";

const MODEL = {
  plant: "/lab/models/potted_plant_01/potted_plant_01.gltf",
  shelf: "/lab/models/wooden_bookshelf_worn/wooden_bookshelf_worn.gltf",
  loungeChair: "/lab/models/mid_century_lounge_chair/mid_century_lounge_chair.gltf",
};

/** A believable study/workstation shell + furniture + desk props, all real PBR. */
export function Room({ vibe, tier }: { vibe: VibeConfig; tier: "full" | "lite" }) {
  const t = useLabTextures(tier);

  const mats = useMemo(() => {
    return {
      floor: makeMaterial(t.wood_floor_deck, { repeat: [4, 3], normalScale: 1 }),
      rug: makeMaterial(t.denim_fabric, { repeat: [3, 2], normalScale: 1 }),
      wall: makeMaterial(t.painted_plaster_wall, { repeat: [3, 1.6], normalScale: 0.8 }),
      ceiling: makeMaterial(t.painted_plaster_wall, {
        repeat: [3, 2.4],
        normalScale: 0.5,
        color: "#f3efe9",
      }),
      wood: makeMaterial(t.wood_table_001, { repeat: [2, 1], normalScale: 0.8 }),
      woodSmall: makeMaterial(t.wood_table_001, { repeat: [1, 1], normalScale: 0.8 }),
      metal: makeMaterial(t.metal_plate, { repeat: [1, 1], roughness: 0.9 }),
      leather: makeMaterial(t.fabric_leather_02, { repeat: [1.4, 1.4] }),
    };
  }, [t]);

  const W = 16;
  const D = 12;
  const H = 6;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mats.floor}>
        <planeGeometry args={[W, D]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 1.2]} receiveShadow material={mats.rug}>
        <planeGeometry args={[7, 5]} />
      </mesh>

      <mesh position={[0, H / 2, -D / 2]} receiveShadow material={mats.wall}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]} receiveShadow material={mats.wall}>
        <planeGeometry args={[D, H]} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]} receiveShadow material={mats.wall}>
        <planeGeometry args={[D, H]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]} material={mats.ceiling}>
        <planeGeometry args={[W, D]} />
      </mesh>

      {/* Window on the right wall — matches the sun's direction ([6,9,4]) so
          light rakes across the room, and frees the back wall for the project
          gallery. */}
      <group position={[W / 2 - 0.06, 2.9, -0.8]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[4.4, 3]} />
          <meshStandardMaterial
            color={vibe.window.color}
            emissive={new THREE.Color(vibe.window.emissive)}
            emissiveIntensity={vibe.window.intensity}
            roughness={0.15}
            metalness={0}
          />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={mats.metal}>
          <boxGeometry args={[0.1, 3.1, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={mats.metal}>
          <boxGeometry args={[4.5, 0.1, 0.08]} />
        </mesh>
      </group>

      {/* the back wall above the desk is the project gallery (see Stations) */}

      <Desk wood={mats.wood} metal={mats.metal} />
      <DeskProps vibe={vibe} metal={mats.metal} />
      <Chair leather={mats.leather} metal={mats.metal} />

      {tier === "full" ? (
        // Real CC0 glTF furniture — only on the full (desktop) tier.
        <Suspense fallback={null}>
          <Model url={MODEL.shelf} position={[-6.6, 0, -1]} rotation={[0, Math.PI / 2, 0]} fit={{ height: 3.9 }} />
          <Model url={MODEL.plant} position={[6, 0, -3.4]} fit={{ height: 2.1 }} />
          <Model url={MODEL.loungeChair} position={[5.4, 0, 2.6]} rotation={[0, -2.5, 0]} fit={{ height: 2.2 }} envIntensity={1.1} />
        </Suspense>
      ) : (
        // Lightweight primitives keep the lite (mobile) tier fast.
        <>
          <Shelf wood={mats.woodSmall} />
          <Plant position={[6, 0, -3.4]} />
        </>
      )}
    </group>
  );
}

function Desk({ wood, metal }: { wood: THREE.Material; metal: THREE.Material }) {
  const topY = 1.5;
  const legs: [number, number][] = [
    [-2.85, -1.05],
    [2.85, -1.05],
    [-2.85, 1.05],
    [2.85, 1.05],
  ];
  return (
    <group position={[0, 0, -3]}>
      <mesh position={[0, topY, 0]} castShadow receiveShadow material={wood}>
        <boxGeometry args={[6, 0.14, 2.4]} />
      </mesh>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, topY / 2, z]} castShadow receiveShadow material={metal}>
          <boxGeometry args={[0.12, topY, 0.12]} />
        </mesh>
      ))}
    </group>
  );
}

/** Monitors, keyboard, mug and a desk lamp — the "workstation" props. */
function DeskProps({ vibe, metal }: { vibe: VibeConfig; metal: THREE.Material }) {
  const deskTop = 1.57; // desk top surface height
  const screenMat = (
    <meshStandardMaterial
      color="#0a0d12"
      emissive={new THREE.Color(vibe.screen.emissive)}
      emissiveIntensity={vibe.screen.intensity}
      roughness={0.25}
      metalness={0}
    />
  );

  const Monitor = ({ x, ry }: { x: number; ry: number }) => (
    <group position={[x, deskTop, -3.7]} rotation={[0, ry, 0]}>
      {/* stand */}
      <mesh position={[0, 0.25, 0]} castShadow material={metal}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
      </mesh>
      <mesh position={[0, 0.02, 0.15]} castShadow material={metal}>
        <boxGeometry args={[0.6, 0.04, 0.4]} />
      </mesh>
      {/* bezel */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[2.1, 1.2, 0.08]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0.95, 0.05]}>
        <planeGeometry args={[1.95, 1.05]} />
        {screenMat}
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      <Monitor x={-1.15} ry={0.16} />
      <Monitor x={1.15} ry={-0.16} />

      {/* keyboard */}
      <mesh position={[0, deskTop + 0.03, -2.35]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#15171c" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* mouse */}
      <mesh position={[1.05, deskTop + 0.03, -2.35]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.32]} />
        <meshStandardMaterial color="#15171c" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* mug */}
      <mesh position={[-1.9, deskTop + 0.13, -2.4]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.26, 20]} />
        <meshStandardMaterial color="#b7452e" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* desk lamp */}
      <group position={[2.4, deskTop, -3.5]}>
        <mesh position={[0, 0.03, 0]} castShadow material={metal}>
          <cylinderGeometry args={[0.22, 0.24, 0.06, 20]} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow material={metal}>
          <cylinderGeometry args={[0.03, 0.03, 1, 12]} />
        </mesh>
        <mesh position={[0.28, 0.92, 0]} rotation={[0, 0, -0.9]} castShadow>
          <coneGeometry args={[0.2, 0.32, 20, 1, true]} />
          <meshStandardMaterial color="#2a2a2e" roughness={0.5} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* bulb glow + light */}
        <mesh position={[0.3, 0.82, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color={vibe.lamp.color}
            emissive={new THREE.Color(vibe.lamp.color)}
            emissiveIntensity={3}
          />
        </mesh>
        <pointLight
          position={[0.35, 0.75, 0]}
          color={vibe.lamp.color}
          intensity={vibe.lamp.intensity}
          distance={7}
          decay={2}
          castShadow={false}
        />
      </group>
    </group>
  );
}

function Chair({ leather, metal }: { leather: THREE.Material; metal: THREE.Material }) {
  return (
    <group position={[0, 0, -1.1]}>
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow material={leather}>
        <boxGeometry args={[1.3, 0.18, 1.3]} />
      </mesh>
      <mesh position={[0, 1.6, 0.58]} castShadow receiveShadow material={leather}>
        <boxGeometry args={[1.3, 1.2, 0.16]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={metal}>
        <boxGeometry args={[0.14, 0.9, 0.14]} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={metal}>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 24]} />
      </mesh>
    </group>
  );
}

function Shelf({ wood }: { wood: THREE.Material }) {
  const books = ["#7c3b2e", "#2e5a7c", "#4a7c2e", "#7c6a2e", "#5a2e7c", "#2e7c6a"];
  return (
    <group position={[-6.5, 0, -1]}>
      {[1.2, 2.4, 3.6].map((y, r) => (
        <group key={r}>
          <mesh position={[0, y, 0]} castShadow receiveShadow material={wood}>
            <boxGeometry args={[0.5, 0.1, 3]} />
          </mesh>
          {books.map((c, i) => (
            <mesh
              key={i}
              position={[0.02, y + 0.4 + (i % 3) * 0.06, -1.1 + i * 0.35]}
              castShadow
            >
              <boxGeometry args={[0.32, 0.7 + (i % 3) * 0.12, 0.16]} />
              <meshStandardMaterial color={c} roughness={0.8} metalness={0} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(() => {
    const arr: { p: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 0.25 + Math.random() * 0.25;
      arr.push({
        p: [Math.cos(a) * r, 1.1 + Math.random() * 0.7, Math.sin(a) * r],
        s: 0.28 + Math.random() * 0.16,
      });
    }
    return arr;
  }, []);
  return (
    <group position={position}>
      {/* pot */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.7, 24]} />
        <meshStandardMaterial color="#5b4636" roughness={0.9} metalness={0} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 24]} />
        <meshStandardMaterial color="#2a1e14" roughness={1} />
      </mesh>
      {/* foliage */}
      {leaves.map((l, i) => (
        <mesh key={i} position={l.p} scale={l.s} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? "#3f7d3a" : "#4f9a45"} roughness={0.8} flatShading />
        </mesh>
      ))}
    </group>
  );
}
