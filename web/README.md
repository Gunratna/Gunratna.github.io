# web — Next.js portfolio app

Next.js 15.5 (App Router) portfolio, statically exported (`output: export`) to
GitHub Pages. See the repo root [`README.md`](../README.md) for the overview and
[`DEPLOY.md`](./DEPLOY.md) for the full deployment + SEO guide.

---

## Scripts

```bash
npm run dev      # local dev server → http://localhost:3000
npm run build    # static export → ./out  (uses .next-build/ internally)
npm run lint     # eslint
```

> **Important:** Do not run `npm run build` while `npm run dev` is running.
> Both write to `.next`; the build corrupts the dev server's chunks.
> Stop dev, build, restart dev.

---

## Editing content

All site copy lives in [`src/lib/content.ts`](./src/lib/content.ts) — the single
source of truth. Edit there; nothing else needs changing for copy updates.

Fields available:
- `meta` — name, email, social links, Formspree ID, Google verification token,
  GoatCounter analytics code
- `about` — bio paragraphs, terminal lines, stats
- `experience[]` — CAMS, Vislesha, Edvizo roles
- `projects[]` — each project has name, outcomes, tech, details, arch diagram,
  optional github link
- `skills[]` — grouped skill lists
- `education` — IIT Bombay degree
- `extracurriculars[]`

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              Home page (RSC — no "use client")
│   ├── layout.tsx            Root layout, fonts, SEO metadata, JSON-LD
│   ├── lab/
│   │   ├── page.tsx          /lab route (static)
│   │   └── LabClient.tsx     Client entry: WorldStage + project teasers
│   ├── opengraph-image.tsx   Auto-generated OG image
│   ├── sitemap.xml.ts
│   └── robots.txt.ts
│
├── components/
│   ├── lab/                  ← 3D workstation world (see below)
│   ├── sections/             Page sections rendered on the home route
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── ui/                   Shared components
│   │   ├── ArchDiagram.tsx   SVG architecture diagram with animated edges
│   │   ├── CommandPalette.tsx  Keyboard command palette (focus-trapped)
│   │   ├── CursorLayer.tsx   Custom cursor (client boundary)
│   │   ├── ProjectModal.tsx  Project detail modal (focus-trapped)
│   │   ├── BrandIcons.tsx    SVG brand icons (GitHub, LinkedIn)
│   │   └── …
│   └── providers/
│       ├── QualityProvider.tsx  GPU tier detection (full / lite)
│       └── ThemeProvider.tsx
│
└── lib/
    ├── content.ts            Single source of truth for all site copy
    ├── useFocusTrap.ts       Focus trap hook (modal + palette)
    └── useWebGLSupport.ts    SSR-safe WebGL2 capability detection
```

---

## 3D Lab components (`src/components/lab/`)

```
lab/
├── World.tsx               Canvas shell — renderer config, frame loop,
│                           error boundary, context-loss handler,
│                           AccessibleStations, StationPanel
├── Scene.tsx               Composes environment + lighting + room +
│                           stations + ContactShadows
├── vibes.ts                VibeConfig type + two presets (study / cave)
├── useSceneQuality.ts      Derives SceneSettings from QualityProvider
│                           + prefers-reduced-motion
├── CanvasErrorBoundary.tsx Class error boundary around <Canvas>
├── LabErrorBoundary.tsx    Outer error boundary for the lab page
│
├── effects/
│   └── PostFX.tsx          EffectComposer: Bloom + Vignette + SMAA
│                           (Full tier only; SSAO removed — caused grain)
│
├── environment/
│   ├── Lighting.tsx        Sun (directional) + HemisphereLight + accent point
│   ├── SceneEnvironment.tsx  FogExp2 matched to vibe
│   ├── Room.tsx            Room geometry + PBR materials + tiered furniture
│   ├── materials.ts        Tiered WebP texture loader + makeMaterial()
│   └── Model.tsx           Auto-fit GLB loader (scale, recentre, shadows)
│
├── stations/
│   ├── Stations.tsx        Mounts 5 ProjectPlaque panels on back wall
│   ├── ProjectPlaque.tsx   Framed backlit 3D display panel
│   └── plaqueTexture.ts    Canvas renderer: outcomes, pipeline preview,
│                           stack chips, hover CTA
│
└── overlays/
    ├── LoadingVeil.tsx     In-canvas Suspense fallback
    ├── StationPanel.tsx    Tabbed detail sheet (Overview + Architecture)
    ├── AccessibleStations.tsx  Keyboard skip-links for every station
    └── WorldFallback.tsx   Shown when WebGL2 unsupported or error occurs
```

### Tier system

`useSceneQuality()` reads `QualityProvider` (which tests the GPU) and returns:

| Setting | Full (desktop) | Lite (mobile) |
|---|---|---|
| DPR | 1 – 2 | 1 – 1.25 |
| Shadow maps | ✓ 2048 px | ✗ |
| GLB models | ✓ | ✗ (primitives) |
| WebP textures | 1024 px | 512 px |
| Post-FX | Bloom + Vignette + SMAA | ✗ |
| Frame loop | `always` | `demand` |
| Idle camera | Auto-rotate | ✗ |

### Vibes

| Vibe | `id` | Mood |
|---|---|---|
| Cozy Study | `study` | Warm daylight, amber lamp, fog density 0.005 |
| Dev Cave | `cave` | Cool blue screen glow, dark, fog density 0.011 |

All lighting, fog, window, screen, lamp, and post-FX values are driven by the
active `VibeConfig` — no hardcoded values in components.

---

## 3D assets (`public/lab/`)

All assets are **CC0 1.0** (no attribution required) from
[Poly Haven](https://polyhaven.com).

```
public/lab/
├── hdri/
│   └── brown_photostudio_02_1k.hdr     HDRI for PMREM IBL + reflections
├── textures/
│   ├── wood_floor_deck/                diff + arm + nor_gl (JPG + WebP ×2)
│   ├── painted_plaster_wall/
│   ├── wood_table_001/
│   ├── fabric_leather_02/
│   ├── denim_fabric/
│   └── metal_plate/
└── models/
    ├── potted_plant_01/                glTF + .bin + textures
    ├── wooden_bookshelf_worn/
    └── mid_century_lounge_chair/
```

To re-download assets (e.g. after a clean clone):

```bash
node scripts/fetch-lab-assets.mjs      # downloads originals
node scripts/optimize-lab-assets.mjs  # converts to WebP (requires sharp)
```

---

## Stack

| Package | Version | Purpose |
|---|---|---|
| next | 15.5.19 | Framework |
| react / react-dom | 19.2.7 | UI runtime |
| three | ^0.184.0 | WebGL renderer |
| @react-three/fiber | ^9.6.1 | React bindings for Three.js |
| @react-three/drei | ^10.7.7 | Three.js helpers (Environment, OrbitControls…) |
| @react-three/postprocessing | ^3.0.4 | EffectComposer / Bloom / SMAA |
| postprocessing | ^6.39.1 | Underlying FX library |
| framer-motion | ^12.40.0 | Animations and transitions |
| tailwindcss | ^4 | Styling |
| lucide-react | ^1.17.0 | Icons |
| react-hook-form + zod | latest | Contact form validation |
| playwright | ^1.60.0 | Headless render verification scripts |

---

## Notes for agents / AI assistants

- See [`AGENTS.md`](./AGENTS.md) — read `node_modules/next/dist/docs/` before
  writing framework code; this is Next.js 15 with breaking API changes.
- **Never run `npm run build` while `npm run dev` is live** — they share `.next`
  and the build corrupts dev-server chunks (causes `MODULE_NOT_FOUND` at runtime).
  Stop dev, build, restart dev.
- The `experimental.devtoolSegmentExplorer: false` in `next.config.ts` must stay;
  removing it causes recurring 500s on `/lab` after heavy hot-reloading.
- All content changes go to `src/lib/content.ts` only.
- 3D components must stay behind `dynamic(ssr: false)` — static export must never
  open a WebGL context during SSR.
