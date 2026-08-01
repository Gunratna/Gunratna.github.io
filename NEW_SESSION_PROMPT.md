# New Session Context Prompt

Copy everything below this line and paste it as your first message in the new session.

---

## CONTEXT TRANSFER — portfolio_v2 3D Lab project

We are continuing work on my personal portfolio website at
`e:\Projects\portfolio_v2`. The project is a Next.js 15.5 static-export app
deployed to GitHub Pages at `https://gunratna.github.io`.

### Repository state
- Remote `origin/main` is at commit `6cda1e5` — **already pushed and deploying**.
- Local working directory is clean (no uncommitted changes).
- The last `npm run build` passed cleanly. The dev server is stopped.

### What has been built (do not redo)

**Realistic 3D workstation lab at `/lab`** — fully implemented, tested, and live:
- `web/src/components/lab/World.tsx` — Canvas shell with ACES tone mapping
  (exposure 1.25), PCF soft shadows, sRGB, frame-loop management, error boundary,
  WebGL context-loss handler
- `web/src/components/lab/Scene.tsx` — composes environment + lighting + room +
  stations + ContactShadows
- `web/src/components/lab/vibes.ts` — two VibeConfigs: `study` (Cozy Study, warm
  daylight) and `cave` (Dev Cave, blue screen glow). All lighting, fog, bloom,
  vignette values live here.
- `web/src/components/lab/useSceneQuality.ts` — derives Full/Lite tier from
  QualityProvider + prefers-reduced-motion
- `web/src/components/lab/effects/PostFX.tsx` — EffectComposer: Bloom + Vignette
  + SMAA (Full tier only; SSAO removed — caused black grain)
- `web/src/components/lab/environment/` — Lighting.tsx (sun + hemisphere + accent
  point), SceneEnvironment.tsx (FogExp2), Room.tsx (walls/floor/desk/monitors/
  furniture), materials.ts (tiered WebP PBR loader), Model.tsx (auto-fit GLB loader)
- `web/src/components/lab/stations/` — Stations.tsx (5 wall panels), ProjectPlaque.tsx
  (framed backlit 3D display, toneMapped=false face), plaqueTexture.ts (1024×560
  canvas texture with outcome metrics + pipeline preview + stack chips)
- `web/src/components/lab/overlays/` — StationPanel.tsx (tabbed Overview/Architecture
  sheet, inline ArchDiagram, no redirect, focus-trapped), AccessibleStations.tsx
  (keyboard skip-links), LoadingVeil.tsx, WorldFallback.tsx
- `web/src/components/lab/CanvasErrorBoundary.tsx` and `LabErrorBoundary.tsx`
- `web/src/lib/useFocusTrap.ts`, `useWebGLSupport.ts`
- `web/src/components/ui/CursorLayer.tsx`

**CC0 assets committed in `web/public/lab/`:**
- HDRI: `brown_photostudio_02_1k.hdr`
- 6 PBR texture sets (JPG + WebP full/lite): wood_floor_deck, painted_plaster_wall,
  wood_table_001, fabric_leather_02, denim_fabric, metal_plate
- 3 GLB models: potted_plant_01, wooden_bookshelf_worn, mid_century_lounge_chair

**Accessibility fixes applied:**
- Contact form: label associations, type=email, autoComplete, aria-invalid
- Hero + Experience: useReducedMotion gates
- ProjectModal + CommandPalette: focus traps
- page.tsx: CursorLayer extracted → root page is RSC

**Build fixes:**
- `next.config.ts`: phase-aware distDir (dev=`.next`, build=`.next-build`)
  to prevent chunk collision. `devtoolSegmentExplorer: false` to prevent 500s.
- Never run `npm run build` while `npm run dev` is live.

**Scripts:**
- `web/scripts/fetch-lab-assets.mjs` — downloads CC0 assets from Poly Haven
- `web/scripts/optimize-lab-assets.mjs` — JPG → WebP conversion
- `web/scripts/lab-3d-verify.mjs` — Playwright headless render check

**Documentation updated:**
- `CHANGELOG.md` — full implementation log
- `README.md` (root) — project overview
- `web/README.md` — app structure, tier system, asset layout, scripts
- `web/AGENTS.md` — AI assistant rules for this codebase

### What is NOT done yet (start here)

**Phase 4 — Cleanup and final verification:**

1. **Delete `web/src/components/lab/WorkstationScene.tsx`** — ~840 lines, never
   imported anywhere, completely orphaned. Safe to delete with no code changes.

2. **Swap primitive desk for real `metal_office_desk` GLB model** — the desk is
   currently box primitives. The real model exists on Poly Haven
   (`metal_office_desk`). To add it:
   - Extend `web/scripts/fetch-lab-assets.mjs` MODELS array to include it
   - Run the script to download
   - In `Room.tsx`, replace the `<Desk>` primitive component with a `<Model>`
   - Re-anchor the DeskProps (monitors, keyboard, mouse, mug, lamp) to the
     real model's surface height (measure after loading)
   - Full tier only; keep primitive Desk on Lite tier

3. **GLB model scale/placement visual review** — check the bookshelf, armchair,
   and plant in the browser and adjust position/scale in `Stations.tsx` /
   `Room.tsx` if anything looks off.

4. **Final verification pass:**
   - `node scripts/lab-3d-verify.mjs` — 0 errors
   - Stop dev → `npm run build` → check `/out/lab/` exists → restart dev
   - Review production deploy at `https://gunratna.github.io/lab`

### Critical rules (do not break)
- Never run `npm run build` while `npm run dev` is live
- Keep `experimental.devtoolSegmentExplorer: false` in `next.config.ts`
- All 3D imports must be behind `dynamic(ssr: false)`
- Content changes go to `web/src/lib/content.ts` only
- Full-tier-only features: GLB models, shadow maps, ContactShadows, PostFX
- Verification order: diagnostics → `lab-3d-verify.mjs` → build (dev stopped)

### To start dev server
```bash
cd e:\Projects\portfolio_v2\web
npm run dev
# → http://localhost:3000
```

### Key file paths
```
web/src/lib/content.ts                    All site copy
web/src/components/lab/vibes.ts           Vibe configs
web/src/components/lab/World.tsx          Canvas shell
web/src/components/lab/environment/Room.tsx  Room geometry
web/src/components/lab/stations/Stations.tsx  Gallery wall
web/scripts/lab-3d-verify.mjs            Render verification
web/next.config.ts                        Build config
CHANGELOG.md                              Full history
```
