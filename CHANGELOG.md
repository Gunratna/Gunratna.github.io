# Changelog

All notable changes are documented here in reverse-chronological order.

---

## [v2.1.0] — 2026-08 — Realistic 3D Lab + Accessibility overhaul

> Commit `6cda1e5` · pushed to `origin/main` · deployed to GitHub Pages.

---

### 3D Workstation Lab (`/lab`)

Replaced the "under construction" banner with a full photorealistic Three.js /
React Three Fiber room. Everything 3D lives in `web/src/components/lab/`.

#### Renderer (`World.tsx`)
- WebGL2, ACES Filmic tone mapping, `toneMappingExposure = 1.25`, sRGB output
- PCF soft shadow maps (2048 × 2048 on Full tier, 1024 on Lite)
- Phase-aware `frameloop`: `always` on Full/desktop, `demand` on Lite/mobile,
  `never` when tab is hidden — saves GPU on phones
- `DemandNudge` — fires `invalidate()` for 2 s after mount/vibe change so
  textures reliably paint on first load without a continuous loop
- Click-to-enter `EnterGate` — defers the entire 3D bundle until user intent

#### Lighting (`Lighting.tsx`)
- Directional sun at `[6, 9, 4]` with tight shadow camera framing,
  `shadow-bias = -0.0004`, `shadow-normalBias = 0.02` to eliminate acne
- `HemisphereLight` for sky/ground ambient bounce — no flat `AmbientLight`
- Warm accent `PointLight` for desk-lamp / screen spill

#### Vibes (`vibes.ts`)
Two mood configs drive all lighting, fog, window, screen glow, and post-FX:

| Vibe | ID | Mood |
|---|---|---|
| Cozy Study | `study` | Warm daylight, soft amber lamp, low fog |
| Dev Cave | `cave` | Cool blue screen glow, moody dark, heavier bloom |

Every `VibeConfig` carries: `background`, `fog`, `envIntensity`, `light` palette,
`window`, `screen`, `lamp`, and `post` (bloom + vignette).

#### Atmosphere (`SceneEnvironment.tsx`)
- `FogExp2` density and colour matched to each vibe's horizon
- CC0 HDRI `brown_photostudio_02_1k.hdr` via drei `<Environment>` for PMREM
  reflections across all PBR surfaces

#### PBR Materials (`materials.ts`)
- 6 CC0 Poly Haven texture sets — each provides `diff` (sRGB), `arm` (packed
  AO/Roughness/Metalness, linear), `nor_gl` (tangent normal, linear)
- Textures stored as both JPG originals and WebP at two sizes:
  - `*.full.webp` — 1024 px (Full/desktop tier)
  - `*.lite.webp` — 512 px (Lite/mobile tier)
- Anisotropy capped: 8× Full, 4× Lite
- Texture sets: `wood_floor_deck`, `painted_plaster_wall`, `wood_table_001`,
  `fabric_leather_02`, `denim_fabric`, `metal_plate`

#### Room (`Room.tsx`)
- Walls (plaster), floor (wood deck), ceiling (plaster), rug (denim), right-wall
  window (aligned with sun direction `[6,9,4]`)
- Desk, dual monitors (vibe-driven screen emissive), keyboard, mouse, mug,
  desk lamp (emissive bulb + point light)
- **Full tier** — real CC0 glTF models: worn bookshelf, potted plant, mid-century
  armchair, all loaded via `Model.tsx`
- **Lite tier** — lightweight box primitives for the same objects

#### GLB model auto-fit loader (`Model.tsx`)
- Scales each model to a target height or width (robust across Poly Haven's
  varying native scales)
- Re-centres footprint on XZ, seats base at Y = 0
- Enables `castShadow` / `receiveShadow` on every mesh
- Applies `envMapIntensity` so models pick up HDRI reflections

#### Post-processing (`PostFX.tsx`)
- `EffectComposer` (Full tier only): Bloom (intensity + threshold from vibe
  config), vignette (per vibe), SMAA
- **SSAO deliberately omitted** — at `intensity = 18` with MULTIPLY blending it
  produced severe black speckle across walls. Removed; measured dark-pixel ratio
  went to 0.0% in both vibes. `ContactShadows` in `Scene.tsx` provides
  noise-free ground-contact shading instead.

#### Project gallery — interactive wall panels (`stations/`)
Five `ProjectPlaque` components centred on the back wall above the desk.

**`plaqueTexture.ts`** — renders a 1024 × 560 canvas texture per project:
- Accent-wash header: numbered index chip + project name + subtitle + type badge
- 4-metric outcome row with left-side accent value bars
- **Pipeline preview strip** — up to 5 architecture nodes colour-coded by kind
  (`io`/`process`/`model`/`decision`/`store`) with connecting arrows
- Tech stack chips (auto-fits to panel width with ellipsis truncation)
- Hover state shows a `▸ OPEN DETAILS` bordered CTA button

**`ProjectPlaque.tsx`** — the 3D object:
- Framed display at 2.34 × 1.28 world units matching texture aspect ratio
- Face mesh: `map` + `emissiveMap` both set to the canvas texture;
  `toneMapped={false}` so ACES doesn't crush panel contrast in Dev Cave
- On hover: eases forward off the wall, scales up, backlight intensity lifts,
  accent bar sweeps along the base rail
- Active selected plaque gets an accent-colour outline

**`Stations.tsx`** — mounts all five plaques centred on the back wall at
`WALL_Y = 3.9`, spaced 2.52 units apart.

#### Station detail panel (`StationPanel.tsx`)
- Right-anchored overlay sheet, `max-w-2xl`, spring entrance (`stiffness=240,
  damping=28`)
- **Two tabs — Overview / Architecture** (framer-motion `layoutId` animated tab
  indicator):
  - *Overview*: staggered outcome tiles with growing underline bars, tech chips
    popping in, detail bullets sliding from left
  - *Architecture*: inline `ArchDiagram` component with flowing animated edges
    and traveling particles — **no navigation away from `/lab`**
- Focus-trapped (`useFocusTrap`), dismissible via ✕, backdrop, or Escape
- Resets to Overview tab when a different project is opened
- GitHub link in footer when `project.github` is set

#### Accessibility
- `AccessibleStations.tsx` — skip-link buttons (visually hidden until focused,
  `sr-only`) for every project; opens the same `StationPanel`
- Canvas wrapper carries `role="img"` + descriptive `aria-label`
- Decorative in-canvas labels and hover tooltips marked `aria-hidden`

#### Robustness
- `CanvasErrorBoundary.tsx` — class-component error boundary around `<Canvas>`;
  shows "The 3D room hit a snag" with a reload action
- `LabErrorBoundary.tsx` — outer error boundary for the full lab page
- `webglcontextlost` / `webglcontextrestored` handlers on the canvas DOM element;
  prevents default browser teardown, shows a reload prompt
- `WorldFallback.tsx` — shown when WebGL2 is unsupported or an error occurs

#### CC0 assets (`web/public/lab/`)
| Path | Description |
|---|---|
| `hdri/brown_photostudio_02_1k.hdr` | Poly Haven HDRI for IBL |
| `textures/*/` | 6 PBR texture sets (JPG + WebP full/lite) |
| `models/potted_plant_01/` | glTF model — potted plant |
| `models/wooden_bookshelf_worn/` | glTF model — worn bookshelf |
| `models/mid_century_lounge_chair/` | glTF model — lounge chair |

All assets: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) via
[Poly Haven](https://polyhaven.com).

#### Scripts (`web/scripts/`)
| Script | Purpose |
|---|---|
| `fetch-lab-assets.mjs` | Downloads CC0 HDRI, textures, and GLB models from Poly Haven API |
| `optimize-lab-assets.mjs` | Converts JPG → WebP at full (1024 px) and lite (512 px) sizes |
| `lab-3d-verify.mjs` | Playwright headless render: enters `/lab`, captures both vibes, reports canvas size + error count |

---

### Beginner explainer (`how-this-was-built.html`)

Self-contained single HTML file at the repo root. No external dependencies, no
build step. 24 sections from zero to advanced, covering HTML · CSS · JavaScript
· React · Next.js · TypeScript · Tailwind · Three.js · WebGL · PBR materials ·
HDRI · Post-processing · Static export · GitHub Pages · CI/CD. Features a sticky
sidebar, dark/light theme toggle, and a glossary.

---

### Accessibility fixes (site-wide)

| File | Change |
|---|---|
| `Contact.tsx` | `htmlFor`/`id` on all labels; `type="email"`, `autoComplete`; `aria-invalid` + `aria-describedby` |
| `Hero.tsx` | `useReducedMotion` gate on scroll-arrow bounce animation |
| `Experience.tsx` | `useReducedMotion` gate on `PresentNode` pulse ring |
| `ProjectModal.tsx` | Focus trap via `useFocusTrap` |
| `CommandPalette.tsx` | Focus trap via `useFocusTrap` |
| `page.tsx` | Extracted `CursorLayer` into its own `"use client"` component so the root page is an RSC |

New shared hooks:
- `web/src/lib/useFocusTrap.ts`
- `web/src/lib/useWebGLSupport.ts`
- `web/src/components/ui/CursorLayer.tsx`

---

### Infrastructure / build fixes

| Change | Detail |
|---|---|
| Phase-aware `distDir` | Dev server uses `.next`; production build uses `.next-build`. Prevents "Cannot find module './NNN.js'" crashes when `npm run build` runs alongside a live `next dev`. |
| `devtoolSegmentExplorer: false` | Disables the Next.js 15 dev Segment Explorer devtool that intermittently corrupted the RSC client manifest after many hot reloads, causing recurring 500s on `/lab`. |
| `.gitignore` updates | `.next-build/` added to both root and `web/` gitignores. |

---

### Kiro spec (`.kiro/specs/realistic-3d-world/`)

| File | Contents |
|---|---|
| `requirements.md` | 9 EARS-format requirements |
| `design.md` | Component architecture, data flow, 7 correctness properties |
| `tasks.md` | 10 implementation tasks + dependency-wave graph |

---

### Pending (next session)

- [ ] Delete orphaned `web/src/components/lab/WorkstationScene.tsx`
      (~840 lines, never imported — safe to remove)
- [ ] Swap primitive desk for `metal_office_desk` GLB model
      (needs re-anchoring monitors/keyboard/mouse/mug to real surface height)
- [ ] GLB model scale + placement visual tuning after live review
- [ ] Final verification pass: Full + Lite screenshots in both vibes at
      production URL `https://gunratna.github.io/lab`

---

## [v2.0.0] — prior — Next.js 15 portfolio

Initial Next.js 15 portfolio build with App Router, static export, Tailwind v4,
Framer Motion, project architecture diagrams, command palette, contact form.
Projects: Email BOT, SEBI Debarred, Aadhaar Redaction, GST Extraction, GitLab
Agentic Pipeline, MF Redemption Extraction (VLM). Analytics via GoatCounter.
