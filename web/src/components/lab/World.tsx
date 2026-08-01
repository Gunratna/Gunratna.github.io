"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas, useThree, type RootState } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Scene } from "@/components/lab/Scene";
import { PostFX } from "@/components/lab/effects/PostFX";
import { LoadingVeil } from "@/components/lab/overlays/LoadingVeil";
import { StationPanel } from "@/components/lab/overlays/StationPanel";
import { AccessibleStations } from "@/components/lab/overlays/AccessibleStations";
import { CanvasErrorBoundary } from "@/components/lab/CanvasErrorBoundary";
import { useSceneQuality } from "@/components/lab/useSceneQuality";
import { VIBES, type VibeId } from "@/components/lab/vibes";
import type { Project } from "@/lib/content";
import { RotateCcw } from "lucide-react";

/**
 * In on-demand render mode, forces frames for ~2s after mount / vibe change so
 * the scene reliably paints once async textures arrive. After that, interaction
 * (OrbitControls) drives renders.
 */
function DemandNudge({ dep }: { dep: unknown }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      invalidate();
      if (performance.now() - start < 2000) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dep, invalidate]);
  return null;
}

export default function World({ vibeId }: { vibeId: VibeId }) {
  const settings = useSceneQuality();
  const vibe = VIBES[vibeId];
  const [selected, setSelected] = useState<Project | null>(null);
  const [contextLost, setContextLost] = useState(false);

  // Full desktop auto-rotates → render continuously. Lite/mobile/reduced-motion
  // render on demand only (when the user interacts), saving battery & GPU.
  const base: "always" | "demand" = settings.idleCamera ? "always" : "demand";
  const [frameloop, setFrameloop] = useState<"always" | "demand" | "never">(base);

  // pause the render loop entirely when the page/tab is hidden
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : base);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [base]);

  const configureRenderer = useCallback((state: RootState) => {
    const gl = state.gl;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    // Recover gracefully if the GPU drops the WebGL context (tab suspend,
    // driver reset, too many contexts). Prevent default so the browser keeps
    // the canvas, and surface a reload prompt.
    const canvas = gl.domElement;
    canvas.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
        setContextLost(true);
      },
      false
    );
    canvas.addEventListener("webglcontextrestored", () => setContextLost(false), false);
  }, []);

  return (
    <>
      <CanvasErrorBoundary>
      <Canvas
        dpr={settings.dpr}
        shadows={settings.shadows}
        frameloop={frameloop}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 60, position: [0, 2.7, 8.2] }}
        onCreated={configureRenderer}
        role="img"
        aria-label="Interactive 3D workstation room. Use the project station buttons to open details for each project, or read the project summaries below."
      >
        <color attach="background" args={[vibe.background]} />

        <Suspense fallback={<LoadingVeil />}>
          <Scene
            vibe={vibe}
            settings={settings}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          minDistance={3}
          maxDistance={13}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 2.0, -2.0]}
          autoRotate={settings.idleCamera && !selected}
          autoRotateSpeed={0.25}
        />

        <PostFX settings={settings} vibe={vibe} />
        <DemandNudge dep={vibeId} />
        {/* keep painting while a panel is open so hover/selection stay crisp */}
        {selected && <DemandNudge dep={selected.id} />}
      </Canvas>
      </CanvasErrorBoundary>

      <AccessibleStations onSelect={setSelected} />
      <StationPanel project={selected} onClose={() => setSelected(null)} />

      {contextLost && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-bg/85 p-8 text-center backdrop-blur-sm">
          <div className="max-w-sm">
            <p className="font-display text-lg">The 3D scene was interrupted</p>
            <p className="mt-2 text-sm text-text-muted">
              Your GPU dropped the render context. Reload to step back into the room.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <RotateCcw size={16} /> Reload scene
            </button>
          </div>
        </div>
      )}
    </>
  );
}
