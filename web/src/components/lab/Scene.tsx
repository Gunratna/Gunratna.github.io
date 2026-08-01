"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { SceneEnvironment } from "@/components/lab/environment/SceneEnvironment";
import { Lighting } from "@/components/lab/environment/Lighting";
import { Room } from "@/components/lab/environment/Room";
import { Stations } from "@/components/lab/stations/Stations";
import type { SceneSettings } from "@/components/lab/useSceneQuality";
import type { VibeConfig } from "@/components/lab/vibes";
import type { Project } from "@/lib/content";

const HDRI = "/lab/hdri/brown_photostudio_02_1k.hdr";

export function Scene({
  vibe,
  settings,
  selectedId,
  onSelect,
}: {
  vibe: VibeConfig;
  settings: SceneSettings;
  selectedId?: string;
  onSelect: (p: Project) => void;
}) {
  return (
    <>
      {/* real HDRI image-based lighting + reflections (not shown as background) */}
      <Environment files={HDRI} environmentIntensity={vibe.envIntensity} />

      <SceneEnvironment
        horizon={vibe.fog.color}
        fogDensity={settings.tier === "full" ? vibe.fog.density : vibe.fog.density * 0.6}
      />
      <Lighting
        palette={vibe.light}
        shadows={settings.shadows}
        shadowMapSize={settings.shadowMapSize}
      />
      <Room vibe={vibe} tier={settings.tier} />
      <Stations
        selectedId={selectedId}
        screenGlow={vibe.screen.intensity}
        onSelect={onSelect}
      />

      {/* soft ambient occlusion contact under the furniture — grounds objects
          that the directional shadow map alone leaves looking slightly afloat */}
      {settings.tier === "full" && (
        <ContactShadows
          position={[0, 0.02, -0.5]}
          scale={22}
          resolution={512}
          far={2.6}
          blur={3.6}
          opacity={vibe.id === "cave" ? 0.3 : 0.22}
          color="#000000"
        />
      )}
    </>
  );
}
