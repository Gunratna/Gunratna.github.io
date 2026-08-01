# gunratna.github.io

Personal portfolio of **Gunratna Borkar** — Sr. AI Engineer at CAMS, IIT Bombay.  
Live at **[gunratna.github.io](https://gunratna.github.io)**.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5 (App Router, `output: export`) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| 3D | React Three Fiber, drei, Three.js 0.184, @react-three/postprocessing |
| Forms | react-hook-form, zod, Formspree |
| Deploy | GitHub Pages via GitHub Actions (every push to `main`) |

---

## Repository layout

```
portfolio_v2/
├── web/                        Next.js application (the only thing that deploys)
│   ├── src/
│   │   ├── app/                Routes, layout, SEO (sitemap, robots, OG image)
│   │   ├── components/
│   │   │   ├── lab/            Realistic 3D workstation scene (Three.js/R3F)
│   │   │   ├── sections/       Page sections (Hero, About, Experience, Projects…)
│   │   │   ├── ui/             Shared UI components (modals, palette, diagrams…)
│   │   │   └── providers/      QualityProvider, ThemeProvider
│   │   └── lib/
│   │       ├── content.ts      ← SINGLE SOURCE OF TRUTH for all site copy
│   │       ├── useFocusTrap.ts Focus trap hook (modal + palette)
│   │       └── useWebGLSupport.ts  SSR-safe WebGL2 detection
│   ├── public/
│   │   └── lab/                3D assets (HDRI, PBR textures, GLB models) — CC0
│   ├── scripts/                One-off Node scripts (asset download, optimise, verify)
│   ├── next.config.ts          Static export config, build/dev dir separation
│   └── package.json
├── .kiro/specs/                Kiro AI specs (requirements, design, tasks)
├── CHANGELOG.md                Full change history
├── how-this-was-built.html     Beginner explainer (zero → advanced, no deps)
└── .github/workflows/deploy.yml  GitHub Pages CI/CD
```

---

## Develop

```bash
cd web
npm install
npm run dev        # → http://localhost:3000
```

> **Do not run `npm run build` while `next dev` is live.** They share the
> `.next` dir and the build will corrupt dev-server chunks. Stop dev first,
> build, then restart dev.

---

## Build & deploy

```bash
cd web
npm run build      # static export → web/out/  (uses .next-build/ internally)
```

Push to `main` → GitHub Actions builds and deploys automatically.  
See [`web/DEPLOY.md`](./web/DEPLOY.md) for the full deploy + SEO walkthrough.

---

## Edit content

Everything editable lives in [`web/src/lib/content.ts`](./web/src/lib/content.ts):
bio, experience, projects (with per-project architecture diagrams), skills,
education, contact info, and analytics config.

---

## 3D Lab (`/lab`)

A photorealistic WebGL2 room built with React Three Fiber. Features:
- Two vibes: **Cozy Study** (warm daylight) and **Dev Cave** (screen glow)
- CC0 PBR materials from [Poly Haven](https://polyhaven.com), tiered for mobile
- CC0 GLB furniture models (bookshelf, plant, armchair)
- Five interactive project panels on the back wall — click to open detail sheets
  with inline architecture diagrams (no page navigation)
- Accessible skip-links, canvas ARIA label, focus-trapped detail panel

See [`web/src/components/lab/`](./web/src/components/lab/) for all source.  
See [`web/public/lab/`](./web/public/lab/) for CC0 assets.  
See [`CHANGELOG.md`](./CHANGELOG.md) for the full implementation log.

---

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).
