# gunratna.github.io

Personal portfolio of **Gunratna Borkar** — Sr. AI Engineer at CAMS, IIT Bombay.
Live at **[gunratna.github.io](https://gunratna.github.io)**.

Built with Next.js 15 (App Router, static export), React 19, Tailwind CSS v4,
Framer Motion, and React Three Fiber. Deployed to GitHub Pages via GitHub Actions
on every push to `main`.

## Structure

The entire application lives in [`web/`](./web). All editable content (bio,
experience, projects, skills) is centralised in
[`web/src/lib/content.ts`](./web/src/lib/content.ts) as the single source of truth.

```
web/                    Next.js application
  src/app/              routes, layout, SEO (sitemap, robots, OG image)
  src/components/       sections, UI, layout, 3D lab
  src/lib/content.ts    ← edit here to update the site
DEPLOY.md               deployment + SEO guide  (in web/)
portfolio_build_spec.md original design/build specification
```

## Develop

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

See [`web/DEPLOY.md`](./web/DEPLOY.md) for the full deploy + SEO walkthrough.
