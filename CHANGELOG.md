# Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — 3D Lab world + Accessibility overhaul

> Work done in this local session on top of `origin/main @ dee1676`.
> Remote is ahead by 6 commits (MF Redemption project, analytics, filter chip fixes) —
> pull and merge before pushing.

---

### New features

#### Realistic 3D Workstation Lab (`/lab`)

A full photorealistic Three.js / React Three Fiber room replaced the
"under construction" banner at `/lab`.

**Renderer config (World.tsx)**
- WebGL2, ACES Filmic tone mapping, exposure 1.25
- sRGB output colour space
- PCF soft shadow maps (2048 × 2048 on Full tier)
- Frame-loop management: `always` (Full, desktop) / `demand` (Lite, mobile) / `never` (tab hidden) — saves GPU on phones
- Click-to-enter gate (`EnterGate`) — defers bundle + asset load until user intent

**Lighting (Lighting.tsx)**
- Directional sun at `[6,9,4]` with tight shadow camera, `bias`/`normalBias` to prevent acne
- `HemisphereLight` for sky/ground ambient bounce — no flat `AmbientLight`
- Warm accent `PointLight` for lamp/screen spill

**Atmosphere (SceneEnvironment.tsx, vibes.ts)**
- `FogExp2` matched to vibe horizon colour
- CC0 HDRI (`brown_photostudio_02_1k.hdr`) via drei `<Environment>` for PMREM reflections
- Two vibes driven by a single `VibeConfig` object:
  - **Cozy Study** — warm daylight, soft lamp, amber tones
  - **Dev Cave** — blue screen glow, moody low-key lighting
- Vibe switcher UI in the canvas overlay and on the enter gate

**PBR Materials (materials.ts)**
- 6 CC0 Poly Haven texture sets (diff / ARM / normal-GL at 1k):
  `wood_floor_deck`, `painted_plaster_wall`, `wood_table_001`,
  `fabric_leather_02`, `denim_fabric`, `metal_plate`
- Textures converted JPG → WebP at two sizes: `full` (1024 px) and `lite` (512 px)
- Tiered loader: Full tier uses `full.webp`, Lite (mobile) uses `lite.webp`
- Correct colour spaces: sRGB for diffuse, `NoColorSpace` for ARM + normal
- Anisotropy capped: 8× Full, 4× Lite

**Room geometry (Room.tsx)**
- Walls, floor (wood), ceiling (plaster), rug, right-wall window
- Desk with metal legs, dual monitors (vibe-driven screen glow), keyboard, mouse, mug, desk lamp (emissive bulb + point light)
- Full tier: real CC0 GLB models — worn bookshelf, potted plant, mid-century armchair
- Lite tier: lightweight box primitives for the same objects
- Window moved to the right wall so it aligns with the sun direction and frees the back wall for the project gallery

**GLB model loader (Model.tsx)**
- Auto-fits each model to a target height or width (robust to Poly Haven's varying native scales)
- Re-centres footprint, seats base on y = 0
- Enables `castShadow` / `receiveShadow` on every mesh
- Applies `envMapIntensity` for HDRI reflections

**Post-processing (PostFX.tsx)**
- `EffectComposer` with Bloom (intensity + threshold from vibe), subtle vignette, SMAA
- **SSAO deliberately removed** — the screen-space AO pass produced severe black speckling
  (dark-pixel ratio was visually obvious). `ContactShadows` in Scene.tsx provides
  noise-free grounding instead.
- Bloom and vignette intensities tuned per vibe; Dev Cave gets stronger bloom for the screen-glow effect

**Project gallery — interactive wall panels (stations/)**
- Five framed, backlit `ProjectPlaque` components mounted on the back wall above the desk, centred
- Plaque content rendered into a 1024 × 560 canvas texture (not a DOM overlay) so it lives inside the lighting model — reflects, fogs, dims with the room
- Each plaque shows:
  - Numbered index chip + type badge (LLM / RAG / Vision / Agentic, colour-coded)
  - Project name and subtitle
  - 4-metric outcome tile row with accent value bars
  - **Pipeline preview strip** — mini architecture diagram with up to 5 nodes, each colour-coded by kind (io / process / model / decision / store), connected by arrows
  - Tech stack chips (auto-fits to panel width)
  - Hover CTA button ("▸ OPEN DETAILS")
- Hover animation: plaque eases forward off the wall, scales up, backlight lifts, accent bar sweeps along base rail
- Active outline on the selected plaque

**Station panel (StationPanel.tsx)**
- Right-anchored overlay sheet (`max-w-2xl`) with spring entrance animation
- **Tabbed UI — Overview / Architecture**:
  - Overview: animated outcome tiles with growing underline bars, staggered tech chips, sliding detail bullets
  - Architecture: inline `ArchDiagram` with flowing animated edges (no navigation away from `/lab`)
- Focus-trapped, dismissible via ✕ button, backdrop click, or Escape
- Footer shows GitHub link when present; no external redirect for architecture

**Accessibility (overlays/AccessibleStations.tsx)**
- Skip-link buttons (visually hidden until focused) for every project station
- Opens the same `StationPanel` — keyboard and screen-reader users reach every project without the canvas
- Canvas wrapper carries `role="img"` + descriptive `aria-label`
- Decorative in-canvas labels marked `aria-hidden`

**Robustness**
- `CanvasErrorBoundary` — class component wrapping `<Canvas>`; catches render errors, shows "The 3D room hit a snag" fallback with a reload action
- `webglcontextlost` / `webglcontextrestored` handlers — prevents default browser crash, shows a reload prompt on GPU/driver reset
- WebGL2-unsupported fallback — message + pointer to the project summaries below

**Performance**
- On-demand rendering on Lite/mobile (`frameloop="demand"`) — renders only on user interaction, saving battery
- `DemandNudge` — fires invalidate for 2s after mount/vibe change so textures paint reliably on first load
- Auto-rotate pauses while a station panel is open
- `EnterGate` defers the 3D bundle entirely until the user clicks Enter (~1–3 MB on demand)

**Assets (web/public/lab/)**
- `hdri/brown_photostudio_02_1k.hdr` — CC0 Poly Haven HDRI
- `textures/*/` — 6 PBR texture sets, original JPG + WebP full/lite variants
- `models/potted_plant_01/` — CC0 glTF (Poly Haven)
- `models/wooden_bookshelf_worn/` — CC0 glTF (Poly Haven)
- `models/mid_century_lounge_chair/` — CC0 glTF (Poly Haven)

**Scripts (web/scripts/)**
- `fetch-lab-assets.mjs` — downloads CC0 textures, HDRI, and GLB models from Poly Haven API
- `optimize-lab-assets.mjs` — converts JPG → WebP at full (1024) and lite (512) sizes
- `lab-3d-verify.mjs` — Playwright headless render check: visits `/lab`, enters, captures both vibes, reports canvas size + error count

---

#### Beginner explainer (`how-this-was-built.html`)

Self-contained single-file HTML page (no external dependencies, no build step).
24 sections walking from zero to advanced, covering:

> HTML · CSS · JavaScript · React · Next.js · TypeScript · Tailwind CSS ·
> Three.js · WebGL · PBR materials · HDRI lighting · Post-processing ·
> Static export · GitHub Pages · CI/CD

Features: sticky sidebar navigation, dark/light theme toggle, glossary, all inline.

---

### Accessibility fixes (site-wide)

| Component | Change |
|---|---|
| `Contact.tsx` | `htmlFor`/`id` associations on all labels; `type="email"`, `autoComplete`; `aria-invalid` + `aria-describedby` on inputs |
| `Hero.tsx` | `useReducedMotion` gate on the scroll-arrow bounce animation |
| `Experience.tsx` | `useReducedMotion` gate on the `PresentNode` pulse ring |
| `ProjectModal.tsx` | Focus trap via `useFocusTrap` hook |
| `CommandPalette.tsx` | Focus trap via `useFocusTrap` hook |
| `page.tsx` | Extracted `CursorLayer` as a separate `"use client"` component so the root page is a React Server Component |

New hooks:
- `web/src/lib/useFocusTrap.ts` — focus trap hook (reused in modal + palette)
- `web/src/lib/useWebGLSupport.ts` — SSR-safe WebGL2 capability detection
- `web/src/components/ui/CursorLayer.tsx` — client boundary for the custom cursor

---

### Infrastructure / build fixes

| File | Change |
|---|---|
| `web/next.config.ts` | Phase-aware `distDir`: dev → `.next`, production build → `.next-build`. Prevents "Cannot find module './331.js'" runtime errors caused by running `npm run build` while `next dev` is live. |
| `web/next.config.ts` | `experimental.devtoolSegmentExplorer: false` — disables the Next.js 15 dev devtool that intermittently corrupted the RSC client manifest, causing recurring 500 errors on `/lab` after many hot reloads. |
| `.gitignore` | Added `.next-build/` |
| `web/.gitignore` | Added `/.next-build/` |

---

### Kiro spec (`.kiro/specs/realistic-3d-world/`)

| File | Contents |
|---|---|
| `requirements.md` | 9 EARS-format requirements for the realistic 3D lab |
| `design.md` | Component architecture, data flow, 7 correctness properties |
| `tasks.md` | 10 implementation tasks with dependency-wave execution graph |

---

### Pending (next session)

- [ ] Delete orphaned `web/src/components/lab/WorkstationScene.tsx` (~840 lines, never imported)
- [ ] Swap primitive desk for `metal_office_desk` GLB model (requires re-anchoring monitor/keyboard positions)
- [ ] GLB model scale / placement visual tuning
- [ ] Final verification: Full + Lite screenshots in both vibes at production URL
- [ ] Pull and integrate the 6 remote commits (MF Redemption project, analytics, filter fixes) before this push

---

### CC0 asset attribution

All 3D assets are [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) — no attribution required, commercial use permitted.

- Textures and HDRI: [Poly Haven](https://polyhaven.com)
- Models: [Poly Haven](https://polyhaven.com)
