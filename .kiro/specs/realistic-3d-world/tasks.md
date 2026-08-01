# Implementation Plan — Realistic 3D World (`/lab`)

## Overview

This plan builds the photorealistic `/lab` world incrementally: first the quality/support plumbing
and a safe route branch, then the cinematic renderer shell, then lighting, materials, post-processing,
camera, and interactivity, and finally accessibility, fallbacks, integration, and verification. Each
task is scoped to leave the build green (`next build` with `output: "export"`) and the site usable.
Every task references the requirements it satisfies.

## Tasks

- [ ] 1. Scaffold quality/support plumbing and route wiring
  - Create `src/lib/useWebGLSupport.ts` (detect `webgl2` context, memoized, SSR-safe).
  - Create `src/components/lab/useSceneQuality.ts` deriving `SceneSettings` from `useQuality()` + `prefers-reduced-motion`.
  - Add a feature flag/branch in `LabClient.tsx` that keeps the current banner by default but can render `<World/>` when enabled.
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 2. Build the `World` canvas shell with cinematic renderer config
  - [ ] 2.1 Create `src/components/lab/World.tsx` dynamically imported with `ssr:false`.
    - Configure `<Canvas>` `gl`/camera; in `onCreated` set `ACESFilmicToneMapping`, `toneMappingExposure=1.1`, `outputColorSpace=SRGBColorSpace`, `shadowMap.type=PCFSoftShadowMap`, tight `near/far`, capped `dpr`.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.2_
  - [ ] 2.2 Add `LoadingVeil.tsx` using drei `useProgress`; wrap Scene in `<Suspense>`.
    - _Requirements: 7.6_
  - [ ] 2.3 Pause the render loop on `document.hidden` (toggle `frameloop`).
    - _Requirements: 7.5_

- [ ] 3. Implement realistic lighting and atmosphere
  - Create `environment/Lighting.tsx`: directional sun (≥2048 shadow map, `bias`/`normalBias`, framed shadow camera) + `HemisphereLight` + accent lights; no primary `ambientLight`.
  - Add `FogExp2` matched to horizon color; theme-aware palettes from `data-theme`.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 4. Procedural PBR materials and environment reflections
  - [ ] 4.1 Create `src/lib/textures.ts` generating tileable canvas-based `map`/`roughnessMap`/`normalMap`/`metalnessMap`; correct color spaces, repeat/anisotropy.
    - _Requirements: 3.2, 3.3, 3.6_
  - [ ] 4.2 Add drei `<Environment>` (RoomEnvironment/preset) for PMREM reflections with a solid-color fallback.
    - _Requirements: 3.5_
  - [ ] 4.3 Author room + furniture using `MeshStandardMaterial`/`MeshPhysicalMaterial` with varied roughness.
    - _Requirements: 3.1, 3.4_

- [ ] 5. Cinematic post-processing pipeline
  - Create `effects/PostFX.tsx` with `<EffectComposer>`: SSAO, Unreal-style Bloom (low intensity/high threshold), SMAA.
  - Gate SSAO/Bloom off in Lite/reduced-motion; keep scene legible.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. Camera and controls with natural feel
  - Add `OrbitControls` with damping and clamped distance/polar limits; optional `PointerLockControls` variant behind a toggle.
  - Frame-rate-independent updates via `clock.getDelta()`; gentle idle camera that stops on input and is disabled under reduced-motion.
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [ ] 7. Interactive project stations (data-driven)
  - [ ] 7.1 Create `stations/Stations.tsx` + `StationLayout[]` mapping `content.ts` projects to positions.
    - _Requirements: 6.1_
  - [ ] 7.2 Create `stations/ProjectStation.tsx` with hover affordance + click select.
    - _Requirements: 6.2, 6.3_
  - [ ] 7.3 Create `overlays/StationPanel.tsx` (design-token HTML overlay) with summary + deep link to project details; dismiss via ✕ and Escape.
    - _Requirements: 6.3, 6.4_

- [ ] 8. Accessibility and non-3D equivalents
  - Create `overlays/AccessibleList.tsx`: keyboard-operable buttons for every station that open the same `StationPanel`.
  - Add `aria-label`/description to the canvas; hide decorative overlays from AT; verify overlay contrast (WCAG AA).
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Fallbacks and error handling
  - Create `WorldFallback.tsx` (static image + AccessibleList) shown when WebGL2 is unavailable.
  - Add an error boundary around `<Canvas>` and a `webglcontextlost` handler with a reload prompt.
  - _Requirements: 7.2, 7.3, 8.1_

- [ ] 10. Integrate, verify, and clean up
  - [ ] 10.1 Replace the "under construction" banner in `LabClient.tsx` with the World/fallback selector; update Hero copy.
    - _Requirements: 9.1, 9.4_
  - [ ] 10.2 Remove `components/lab/WorkstationScene.tsx` and its duplicated `PROJECT_DESCRIPTIONS`.
    - _Requirements: 9.5_
  - [ ] 10.3 Run `next build` (`output: "export"`); assert `out/lab/index.html` exists and contains the accessible fallback list; extend Playwright checks in `scripts/`.
    - _Requirements: 9.2, 7.1_
  - [ ] 10.4 Capture Full and Lite screenshots (reuse `scripts/audit.mjs`) and verify realism (soft shadows, SSAO, subtle bloom, reflections) in both themes.
    - _Requirements: 1.*, 2.*, 3.*, 4.*_

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"], "dependsOn": [] },
    { "wave": 2, "tasks": ["2", "9"], "dependsOn": ["1"] },
    { "wave": 3, "tasks": ["3", "4", "6", "7"], "dependsOn": ["2"] },
    { "wave": 4, "tasks": ["5", "8"], "dependsOn": ["4", "7"] },
    { "wave": 5, "tasks": ["10"], "dependsOn": ["3", "5", "6", "8", "9"] }
  ]
}
```

- Task 1 is the foundation; nothing else starts before it.
- Tasks 3, 4, 6, 7, and 9 can proceed in parallel once Task 2 lands.
- Task 5 depends on 4 (materials must exist to tune bloom/SSAO).
- Task 8 depends on 7 (stations must exist to expose accessible equivalents).
- Task 10 is last: it wires everything into `/lab`, removes dead code, and verifies the export.

## Notes

- No new dependencies are needed; `three`, `@react-three/fiber`, `@react-three/drei`, and
  `@react-three/postprocessing` are already in `package.json`.
- Keep every 3D import behind `dynamic(ssr:false)` — static export must never open a WebGL context.
- Prefer procedural textures/environment over bundled HDR to stay static-export friendly and avoid
  large binary assets; a real `.hdr` can be swapped in later behind the same `<Environment>` API.
- Do not remove `WorkstationScene.tsx` until Task 10, so the old code remains available as reference
  while building the new world.
- Validate visual realism in both `data-theme="dark"` and `light`, at Full and Lite tiers.
