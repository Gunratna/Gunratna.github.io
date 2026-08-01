# Agent / AI assistant rules for this repo

---

## Framework — read before writing any Next.js code

This is **Next.js 15.5** (App Router). APIs, conventions, and file structure
differ significantly from training data. Read:

```
node_modules/next/dist/docs/
```

before writing any framework code. Heed all deprecation notices.

---

## Critical rules

### 1. Never build while dev is running
`npm run build` and `npm run dev` both write to `.next`. Running both
simultaneously corrupts chunks and causes:
```
Error: Cannot find module './NNN.js'
```
**Always stop dev, build, then restart dev.**

### 2. Keep `devtoolSegmentExplorer: false`
`next.config.ts` has `experimental.devtoolSegmentExplorer: false`.
Do **not** remove it. Without it, the Next.js 15 Segment Explorer devtool
intermittently corrupts the RSC client manifest after many hot reloads,
producing recurring 500 errors on `/lab`.

### 3. All 3D imports must be behind `dynamic(ssr: false)`
The site uses `output: export` (static export). WebGL must never run during
SSR. Example:
```ts
const World = dynamic(() => import("@/components/lab/World"), { ssr: false });
```

### 4. Content changes go to one file only
`src/lib/content.ts` is the single source of truth for all site copy.
Do not hardcode copy in components.

### 5. Tier system must be respected
Mobile/Lite tier must not load GLB models, shadow maps, or post-FX.
Always check `settings.tier === "full"` before adding expensive features.

---

## Verification pattern

After any 3D change:
1. `get_diagnostics` on changed files
2. `node scripts/lab-3d-verify.mjs` — headless render, both vibes, 0 errors
3. Stop dev → `npm run build` → restart dev

---

## Key files

| File | Purpose |
|---|---|
| `src/lib/content.ts` | All site copy — edit here only |
| `src/components/lab/vibes.ts` | Vibe configs — all lighting/fog/FX values |
| `src/components/lab/useSceneQuality.ts` | Tier derivation |
| `src/components/lab/World.tsx` | Canvas shell — do not add SSR code |
| `src/components/lab/environment/materials.ts` | PBR texture loader |
| `next.config.ts` | Build config — phase-aware distDir |
| `scripts/lab-3d-verify.mjs` | Playwright render check |

---

## Pending work (as of last session)

- [ ] Delete `src/components/lab/WorkstationScene.tsx` (~840 lines, never imported)
- [ ] Swap primitive desk for `metal_office_desk` GLB model
- [ ] GLB model scale/placement tuning
- [ ] Final verification at production URL
