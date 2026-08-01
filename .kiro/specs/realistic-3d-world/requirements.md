# Requirements Document

Realistic 3D World (`/lab`)

## Introduction

The `/lab` route currently shows an "under construction" banner and a 2D canvas teaser.
An earlier stylized 3D workstation scene (`components/lab/WorkstationScene.tsx`) exists but was
never shipped, and its "screen-like," diagrammatic aesthetic did not achieve the intended feeling.

This feature replaces that experience with a **photorealistic, immersive 3D world** that makes the
visitor feel they have stepped into a real physical space rather than looking at a screen. The world
doubles as an interactive way to explore the portfolio's projects. Realism is the primary goal:
cinematic tone mapping, physically based materials, real-time reflections, soft shadows, ambient
occlusion, and atmospheric depth.

The build must respect the existing site architecture: Next.js 15 App Router, static export
(`output: "export"`), the `QualityProvider` (Full/Lite), `prefers-reduced-motion`, and the existing
design tokens. It must degrade gracefully on low-end devices and never block the rest of the site.

## Glossary

- **PBR** — Physically Based Rendering (MeshStandardMaterial / MeshPhysicalMaterial).
- **PMREM** — Prefiltered Mipmapped Radiance Environment Map, used for real-time reflections.
- **Full / Lite** — the two quality tiers exposed by `QualityProvider` (`gb-quality`).
- **Station** — an interactive object in the world that maps to a portfolio project.

## Requirements

### Requirement 1: Cinematic renderer setup
**User Story:** As a visitor, I want the scene to look like a real, filmed environment, so that it feels immersive rather than like a flat 3D diagram.

#### Acceptance Criteria
1. WHEN the scene initializes THEN the renderer SHALL use WebGL2 with antialiasing enabled.
2. THE renderer SHALL use `ACESFilmicToneMapping` with `toneMappingExposure` in the range 1.0–1.2.
3. THE renderer SHALL set `outputColorSpace` to `SRGBColorSpace`.
4. THE renderer SHALL enable `shadowMap` with `PCFSoftShadowMap`.
5. WHERE `@react-three/fiber` is used, the equivalent `gl`/`Canvas` props SHALL be configured to produce identical output (fiber maps these onto the underlying `WebGLRenderer`).
6. WHEN the device pixel ratio is high THEN rendering resolution SHALL be capped (e.g. `dpr={[1, 2]}`) to protect performance.

### Requirement 2: Realistic lighting
**User Story:** As a visitor, I want light and shadow to behave like the real world, so that surfaces and depth read as believable.

#### Acceptance Criteria
1. THE scene SHALL include a directional light acting as the sun with a shadow map resolution of at least 2048×2048.
2. THE sun light SHALL set shadow `bias` / `normalBias` to avoid shadow acne and peter-panning.
3. THE scene SHALL include a `HemisphereLight` providing sky/ground ambient bounce.
4. THE scene SHALL NOT rely on a flat `AmbientLight` as the primary fill.
5. THE scene SHALL apply `FogExp2` whose color matches the horizon/environment for atmospheric distance fading.
6. WHEN the active theme is dark or light THEN light colors and intensities SHALL adapt so the world reads correctly in both.

### Requirement 3: PBR materials and textures
**User Story:** As a visitor, I want surfaces to reflect light imperfectly like real materials, so nothing looks plastic or uniform.

#### Acceptance Criteria
1. ALL scene meshes SHALL use `MeshStandardMaterial` or `MeshPhysicalMaterial`.
2. Key surfaces SHALL use PBR texture maps: color (`map`), `roughnessMap`, `normalMap`, and `metalnessMap` where applicable.
3. Textures SHALL be procedurally generated at runtime OR loaded from bundled assets; no external network fetch SHALL be required at runtime for static-export compatibility.
4. Roughness values SHALL vary across surfaces so reflections are non-uniform.
5. THE scene SHALL use an HDR/PMREM environment map for real-time reflections; IF no HDR asset is available THEN a procedurally generated environment (e.g. `RoomEnvironment` or gradient) SHALL be used.
6. Color textures SHALL be tagged `SRGBColorSpace`; data textures (normal/roughness/metalness) SHALL remain in linear space.

### Requirement 4: Cinematic post-processing
**User Story:** As a visitor, I want subtle cinematic depth cues, so corners and bright surfaces feel physically grounded.

#### Acceptance Criteria
1. THE scene SHALL render through an `EffectComposer` pipeline.
2. THE pipeline SHALL include SSAO for contact/micro-shadows in corners and junctions.
3. THE pipeline SHALL include bloom (Unreal-style) with low intensity and high threshold so only bright surfaces bleed.
4. WHERE composer post-processing bypasses the renderer's built-in AA THEN the pipeline SHALL include SMAA (preferred) or FXAA.
5. WHEN quality is Lite OR `prefers-reduced-motion` is set THEN the heavier passes (SSAO, bloom) SHALL be reduced or disabled while keeping the scene legible.

### Requirement 5: Camera and controls
**User Story:** As a visitor, I want a natural, weighty camera, so movement feels physical rather than snappy.

#### Acceptance Criteria
1. THE scene SHALL use `OrbitControls` (default) or optional `PointerLockControls` (first-person) with damping enabled.
2. Camera `near` and `far` planes SHALL be set tightly around the world's bounds for depth precision.
3. Control limits (min/max distance, polar angle) SHALL keep the camera inside the believable space.
4. THE animation loop SHALL use `clock.getDelta()` so motion is frame-rate independent.
5. WHEN the user has not interacted THEN a gentle idle camera motion MAY play, and it SHALL stop on user input.

### Requirement 6: Interactive project stations
**User Story:** As a visitor, I want to explore projects inside the world, so the experience is meaningful and not just decorative.

#### Acceptance Criteria
1. Interactive stations SHALL be sourced from `src/lib/content.ts` (no duplicated project copy in the scene).
2. WHEN a station is hovered THEN it SHALL show an affordance (highlight/cursor change) and an accessible tooltip/label.
3. WHEN a station is activated (click or keyboard) THEN a detail panel SHALL open with the project's name, summary, and a link into the main site's project modal or section.
4. THE detail panel SHALL be dismissible via button and `Escape`, and SHALL not trap scroll permanently.

### Requirement 7: Performance, quality tiers, and graceful degradation
**User Story:** As a visitor on any device, I want the site to stay fast and usable, so the 3D world never breaks my experience.

#### Acceptance Criteria
1. THE 3D world SHALL be code-split and dynamically imported with `ssr: false` so it never runs during static export/SSR.
2. WHEN `QualityProvider` reports Lite THEN the world SHALL render a reduced pipeline (no SSAO/bloom, lower dpr, simpler materials) OR a static fallback image with a clear message.
3. WHEN WebGL2 is unavailable OR context creation fails THEN a graceful 2D fallback SHALL be shown instead of a crash.
4. WHEN `prefers-reduced-motion` is set THEN idle/auto camera motion and animated flourishes SHALL be disabled.
5. THE world SHALL pause its render loop when the `/lab` tab/page is not visible (visibility change) to save battery/CPU.
6. Initial interaction-to-first-frame on a mid-range laptop SHOULD occur within ~2 seconds after the chunk loads, with a loading indicator shown until ready.

### Requirement 8: Accessibility and fallbacks
**User Story:** As a keyboard or assistive-technology user, I want an equivalent way to access the content, so the world is inclusive.

#### Acceptance Criteria
1. THE `/lab` page SHALL provide a non-3D, text/link equivalent of the project content reachable without WebGL.
2. Interactive stations SHALL be operable by keyboard OR an accessible list of the same actions SHALL be provided alongside the canvas.
3. THE canvas SHALL have an appropriate `aria-label`/description, and purely decorative elements SHALL be hidden from assistive tech.
4. Color and contrast of any HTML overlays SHALL meet WCAG AA against their background.

### Requirement 9: Integration with existing site
**User Story:** As the site owner, I want the world to fit the existing codebase and deploy pipeline, so nothing else regresses.

#### Acceptance Criteria
1. THE feature SHALL replace the "under construction" banner in `src/app/lab/LabClient.tsx` once complete.
2. THE build SHALL pass `next build` with `output: "export"` and deploy via the existing GitHub Pages workflow.
3. THE feature SHALL reuse existing design tokens (CSS variables) for all HTML overlays.
4. THE Hero link that points to `/lab` SHALL continue to work and SHALL NOT advertise "under construction" after launch.
5. Dead code from the old `WorkstationScene.tsx` SHALL be removed or fully replaced, and unused duplicated project descriptions SHALL be deleted.
