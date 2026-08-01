# Design — Realistic 3D World (`/lab`)

## Overview

A photorealistic, explorable 3D environment rendered with Three.js via `@react-three/fiber` (R3F)
and `@react-three/drei`, wrapped in a cinematic post-processing pipeline. It replaces the current
"under construction" experience at `/lab`. The world is a small, believable physical space (a study /
workstation loft) containing interactive **stations** that map to portfolio projects sourced from
`src/lib/content.ts`.

Design priorities, in order: **visual realism → performance/graceful degradation → interactivity →
accessibility**. The world must never run during static export, must degrade to a usable fallback on
weak devices or without WebGL2, and must respect `prefers-reduced-motion` and the `QualityProvider`
Full/Lite tier.

We stay within the existing stack (already in `package.json`): `three@0.184`, `@react-three/fiber@9`,
`@react-three/drei@10`, `@react-three/postprocessing@3`, `postprocessing@6`. No new heavy deps are
required; drei/postprocessing already expose SSAO, Bloom, SMAA, environment, and controls.

## Architecture

```
src/app/lab/
  page.tsx            # server: metadata; renders LabClient
  LabClient.tsx       # client: quality/reduced-motion/webgl checks; picks World vs Fallback

src/components/lab/
  World.tsx           # dynamic(ssr:false) R3F <Canvas> + renderer config + effects
  Scene.tsx           # lights, environment, fog, room geometry, stations
  environment/
    Room.tsx          # floor/walls/ceiling shell with PBR materials
    Furniture.tsx     # desk, shelves, props (instanced where possible)
    Lighting.tsx      # sun (directional) + hemisphere + optional area/point accents
  stations/
    ProjectStation.tsx# one interactive object bound to a project id
    Stations.tsx      # maps content.ts projects -> ProjectStation instances
  effects/
    PostFX.tsx        # EffectComposer: SSAO + Bloom + SMAA (quality-gated)
  overlays/
    StationPanel.tsx  # HTML detail panel (drei <Html> or fixed overlay)
    LoadingVeil.tsx   # progress indicator via drei useProgress
    AccessibleList.tsx# non-3D keyboard/AT-equivalent list of stations
  WorldFallback.tsx   # static/2D fallback (no WebGL2 or Lite-min)

src/lib/
  textures.ts         # procedural PBR texture generators (canvas -> CanvasTexture)
  useSceneQuality.ts  # derives concrete settings from QualityProvider + reduced-motion
  useWebGLSupport.ts  # detects WebGL2 availability
```

### Rendering flow
1. `LabClient` (client) reads `useQuality()`, `prefers-reduced-motion`, and `useWebGLSupport()`.
2. It chooses one of: **World** (Full), **World-lite** (reduced pipeline), or **WorldFallback** (no WebGL2 or user pref for static).
3. `World` is `next/dynamic(() => import("./World"), { ssr: false })` so nothing 3D is emitted during `output: "export"`.
4. `World` mounts `<Canvas>` with cinematic `gl` settings; `Scene` builds lights/env/geometry/stations; `PostFX` wraps composer passes; `StationPanel`/overlays live as siblings.

## Components and Interfaces

### `useSceneQuality()`
Returns a concrete settings object derived from `QualityProvider` + reduced-motion:

```ts
type SceneSettings = {
  tier: "full" | "lite";
  dpr: [number, number];        // full [1,2], lite [1,1.25]
  shadows: boolean;             // full true, lite false
  shadowMapSize: number;        // 2048 (full) | 1024 (lite, if shadows)
  ssao: boolean;                // full true, lite false
  bloom: boolean;               // full true, lite false
  antialias: "smaa" | "msaa" | "none";
  idleCamera: boolean;          // false when prefers-reduced-motion
  maxLights: number;
};
```

### `World.tsx` — Canvas + renderer
- `<Canvas dpr={settings.dpr} shadows={settings.shadows} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={configureRenderer} camera={{ fov: 45, near: 0.1, far: 60, position: [...] }}>`
- `configureRenderer(state)` sets:
  - `gl.toneMapping = ACESFilmicToneMapping`
  - `gl.toneMappingExposure = 1.1`
  - `gl.outputColorSpace = SRGBColorSpace`
  - `gl.shadowMap.type = PCFSoftShadowMap` (fiber sets `.enabled` from the `shadows` prop)
- Wraps `<Scene/>` in `<Suspense fallback>` and renders `<LoadingVeil/>` via `useProgress`.
- Pauses the loop on `document.hidden` using `frameloop` state (`"always"` ↔ `"never"`), toggled by a `visibilitychange` listener.

### `Lighting.tsx`
- **Sun:** `directionalLight` intensity ~2–3, `castShadow`, `shadow-mapSize=[2048,2048]` (or 1024 lite), `shadow-bias=-0.0004`, `shadow-normalBias=0.02`, tightly framed orthographic shadow camera around the room bounds.
- **Sky/ground:** `hemisphereLight` (sky color from horizon, ground color from floor) intensity ~0.4–0.6.
- **Accents:** 1–2 low-intensity point/area lights for warmth (screen glow, lamp), counted against `settings.maxLights`.
- No standalone `ambientLight` as primary fill (hemisphere covers it).
- Theme-aware: read `data-theme` to pick warm-dark vs neutral-light palettes.

### Environment & fog
- `<Environment>` from drei using `RoomEnvironment`/preset for PMREM reflections; if a bundled `.hdr` is added later, switch to `files=` prop. No runtime network fetch (static export safe).
- `scene.fog = new FogExp2(horizonColor, density~0.02)` set in an effect; density scales down in Lite.

### Materials & textures (`textures.ts`)
- Procedural generators produce tileable `CanvasTexture`s for wood (desk/floor), plaster (walls), metal (frames), fabric (chair). Each returns `{ map, roughnessMap, normalMap, metalnessMap? }`.
- Set `map.colorSpace = SRGBColorSpace`; data maps stay linear. `wrapS/wrapT = RepeatWrapping`, sensible `repeat`, `anisotropy = gl.capabilities.getMaxAnisotropy()`.
- Vary `roughness` per instance (e.g. 0.35–0.9) so reflections differ across surfaces.
- Prefer `MeshPhysicalMaterial` (clearcoat/sheen) only where it adds value (screen glass, polished metal); `MeshStandardMaterial` elsewhere for cost.

### `PostFX.tsx`
- `@react-three/postprocessing` `<EffectComposer>` with:
  - `<SSAO/>` — small radius, moderate intensity (Full only).
  - `<Bloom mipmapBlur intensity={low} luminanceThreshold={high} />` (Full only).
  - `<SMAA/>` when composer is active (composer bypasses canvas MSAA).
- In Lite/reduced-motion, `PostFX` renders `null` (or SMAA only) and the Canvas relies on its own `antialias: true`.

### Stations (interactivity)
- `Stations.tsx` reads `projects` from `content.ts`, positions N stations around the room (data-driven layout array), renders a `ProjectStation` per project.
- `ProjectStation`:
  - Mesh (e.g. a framed screen / object) + hover state (emissive lift, cursor `pointer`).
  - `onPointerOver/Out` set hover; `onClick` fires `onSelect(projectId)`.
  - Keyboard: an off-canvas `AccessibleList` renders a `<button>` per project so AT/keyboard users select stations; selecting focuses the same panel.
- `StationPanel.tsx`: HTML overlay (fixed, uses design tokens) showing name/summary; CTA "Open details" deep-links to `/#projects` or opens the existing `ProjectModal` (via query param the homepage reads, or a simple link). Dismiss via ✕ and `Escape`.

### Fallbacks
- `useWebGLSupport()` creates a throwaway `canvas.getContext("webgl2")`; false → render `WorldFallback` (static hero image of the scene + `AccessibleList`).
- Lite tier can still render the World with the reduced pipeline; only "no WebGL2" or an explicit user choice forces the static fallback.

## Data Models

```ts
// derived, not persisted
type StationLayout = { projectId: string; position: [number,number,number]; rotationY: number; kind: "screen" | "object" };

// existing (content.ts) — reused as-is
type Project = { id: string; name: string; subtitle: string; type: string; /* ...arch, details, tech */ };
```

`StationLayout[]` is a small hand-authored array in `Stations.tsx` keyed by `project.id`, so adding a
project in `content.ts` surfaces a station once a layout entry exists (missing entries fall back to a
default ring position).

## Error Handling

- **No WebGL2 / context loss:** `useWebGLSupport` gate + an R3F error boundary around `<Canvas>` → `WorldFallback`. Listen for `webglcontextlost` to show a "reload scene" prompt.
- **Asset/texture failure:** procedural textures can't 404; if a future `.hdr` is added, wrap `<Environment>` in Suspense with a solid-color env fallback.
- **Slow load:** `LoadingVeil` (drei `useProgress`) shows percentage; if progress stalls > 10s, offer the fallback link.
- **Static export:** everything 3D is behind `dynamic(ssr:false)`; `page.tsx` stays a server component with only metadata + `<LabClient/>`.

## Correctness Properties

Property 1: No SSR/3D leak — `next build` with `output: "export"` never instantiates a WebGL context; all 3D is behind `dynamic(ssr:false)`. Verified by a successful export and presence of `out/lab/index.html`.
**Validates: Requirements 7.1, 9.2**

Property 2: Total graceful degradation — for every capability gate (no WebGL2, Lite tier, reduced-motion) there is a defined, usable rendered result; never a crash or blank canvas.
**Validates: Requirements 7.2, 7.3, 7.4**

Property 3: Content single-source — station data derives only from `content.ts`; no duplicated project copy exists in the scene.
**Validates: Requirements 6.1, 9.5**

Property 4: Accessibility equivalence — every interactive station action is reachable via the non-3D `AccessibleList` (keyboard + AT), independent of pointer/WebGL.
**Validates: Requirements 8.1, 8.2**

Property 5: Frame-rate independence — all continuous motion scales by `clock.getDelta()`, so visual speed is identical across refresh rates.
**Validates: Requirements 5.4**

Property 6: Bounded loop — the render loop pauses when the page is hidden and resumes on visibility, so an idle `/lab` tab consumes no GPU.
**Validates: Requirements 7.5**

Property 7: Color correctness — color textures are `SRGBColorSpace`; normal/roughness/metalness stay linear; final output is sRGB via ACES tone mapping.
**Validates: Requirements 1.3, 3.6**

## Testing Strategy

- **Build/export:** `npm run build` must succeed with `output: "export"`; assert `out/lab/index.html` exists and contains the accessible fallback list (proves no SSR crash and AT content is present without JS).
- **Playwright (extend existing `scripts/`):**
  - `/lab` renders a `<canvas>` in a WebGL-capable browser; FPS sample stays reasonable.
  - Forcing `prefers-reduced-motion` disables idle camera (assert via exposed data attribute).
  - Keyboard: tab to a station button in `AccessibleList`, Enter opens `StationPanel`, `Escape` closes.
  - Simulated no-WebGL2 (override `getContext`) shows `WorldFallback`.
- **Manual/visual:** capture screenshots (reuse `scripts/audit.mjs`) at Full and Lite; verify soft shadows, SSAO in corners, subtle bloom, and reflections read as realistic in both themes.
- **Performance:** verify render loop pauses on `visibilitychange`; verify Lite path skips SSAO/bloom and lowers dpr.

## Rollout & Cleanup

1. Land behind the existing route; keep `WorldFallback` as default until the World is validated.
2. Remove `components/lab/WorkstationScene.tsx` and its duplicated `PROJECT_DESCRIPTIONS` once the new World covers the same projects.
3. Update Hero copy so `/lab` no longer implies "under construction."
4. Keep three/drei/postprocessing (now actually used) — the bundle cost is justified by a shipped feature.
