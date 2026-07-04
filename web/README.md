# web — portfolio app

Next.js 15 (App Router) portfolio, statically exported (`output: export`) to
GitHub Pages. See the repo root [`README.md`](../README.md) for the overview and
[`DEPLOY.md`](./DEPLOY.md) for deployment + SEO.

## Scripts

```bash
npm run dev      # local dev server (http://localhost:3000)
npm run build    # static export to ./out
npm run lint     # eslint
```

## Editing content

All site copy lives in [`src/lib/content.ts`](./src/lib/content.ts) — hero,
about, experience, projects (with per-project architecture diagrams), skills,
education, and extracurriculars. Edit there; components render from it.

## Stack

- **Next.js 15** / React 19 — App Router, static export
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations, reveals, transitions
- **React Three Fiber** + drei — the `/lab` 3D workstation scene
- **Formspree** — contact form delivery
- **lucide-react**, **zod**, **react-hook-form**

## Notes for agents

This uses a newer Next.js than most training data. See [`AGENTS.md`](./AGENTS.md) —
consult `node_modules/next/dist/docs/` before writing framework code.
