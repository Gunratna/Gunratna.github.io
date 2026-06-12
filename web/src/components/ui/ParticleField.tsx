"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Calm constellation background.
 *
 * Design intent: a resting neural graph — large sparse nodes that drift
 * almost imperceptibly, faint edges that breathe in opacity, and a
 * single slow pulse that travels each edge once every few seconds.
 * The whole thing gently tilts toward the pointer.
 * Nothing is fast, nothing is bright — it should feel like a screensaver
 * you barely notice, but once you look you see it's alive.
 */

const NODE_COUNT = 32;
const CONNECTION_RANGE_SQ = 7 * 7; // max squared distance to draw an edge

function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));

  const accent = useMemo(() => {
    const c =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#c97c2f";
    return new THREE.Color(c);
  }, []);

  // Fixed base positions spread sparsely across the viewport
  const seeds = useMemo(() => {
    // deterministic-ish spread using a seeded-like pattern
    return Array.from({ length: NODE_COUNT }, (_, i) => ({
      base: new THREE.Vector3(
        (Math.sin(i * 2.4) * 0.5 + Math.cos(i * 1.7) * 0.5) * 13,
        (Math.cos(i * 3.1) * 0.5 + Math.sin(i * 2.9) * 0.5) * 8,
        Math.sin(i * 1.3) * 2.5
      ),
      phase: i * 0.618 * Math.PI * 2, // golden angle spread
      speed: 0.06 + (i % 7) * 0.012,
    }));
  }, []);

  const live = useMemo(() => seeds.map((s) => s.base.clone()), [seeds]);

  // pre-computed connections (edges between close-enough nodes)
  const connections = useMemo(() => {
    const edges: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (seeds[i].base.distanceToSquared(seeds[j].base) < CONNECTION_RANGE_SQ) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  }, [seeds]);

  // geometry buffers
  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.08, 8, 8), []);
  const nodeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.55,
      }),
    [accent]
  );

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(connections.length * 6), 3)
    );
    return g;
  }, [connections]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.09,
      }),
    [accent]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Instanced mesh for nodes
  const nodesMesh = useMemo(
    () => new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT),
    [nodeGeo, nodeMat]
  );
  const linesMesh = useMemo(() => new THREE.LineSegments(lineGeo, lineMat), [lineGeo, lineMat]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pointer.current.lerp(state.pointer, 0.02);

    const tiltX = pointer.current.y * -0.08;
    const tiltY = pointer.current.x * 0.1;
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        tiltX,
        0.03
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        tiltY + t * 0.015, // very slow global drift
        0.03
      );
    }

    // Update positions — tiny sinusoidal drift per node
    for (let i = 0; i < NODE_COUNT; i++) {
      const { base, phase, speed } = seeds[i];
      live[i].set(
        base.x + Math.sin(t * speed + phase) * 0.35,
        base.y + Math.cos(t * speed * 0.8 + phase) * 0.25,
        base.z + Math.sin(t * speed * 0.5 + phase + 1) * 0.15
      );
      dummy.position.copy(live[i]);
      // very subtle scale pulse
      const s = 0.9 + Math.sin(t * speed * 2 + phase) * 0.1;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodesMesh.setMatrixAt(i, dummy.matrix);
    }
    nodesMesh.instanceMatrix.needsUpdate = true;

    // Update edge positions
    const pos = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let c = 0; c < connections.length; c++) {
      const [a, b] = connections[c];
      pos.setXYZ(c * 2, live[a].x, live[a].y, live[a].z);
      pos.setXYZ(c * 2 + 1, live[b].x, live[b].y, live[b].z);
    }
    pos.needsUpdate = true;

    // Edge opacity breathes slowly
    const breath = 0.06 + Math.sin(t * 0.25) * 0.03;
    lineMat.opacity = breath;
    nodeMat.opacity = 0.4 + Math.sin(t * 0.18) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <primitive object={nodesMesh} />
      <primitive object={linesMesh} />
    </group>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 16], fov: 58 }}
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
    >
      <Constellation />
    </Canvas>
  );
}
