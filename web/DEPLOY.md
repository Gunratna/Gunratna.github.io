# Deploying the Portfolio + SEO Guide

This is a Next.js 15 app that builds to a fully static site (`output: export`),
so it can be hosted free on GitHub Pages.

---

## Part A — Choose your URL

You have two options. The setup differs slightly.

### Option 1 (recommended): user site → `https://gunratna.github.io`
- Repo **must** be named exactly `gunratna.github.io`.
- `BASE_PATH` stays **empty**. Nothing else to configure.
- Best for SEO (clean root domain, strongest for name searches).

### Option 2: project site → `https://gunratna.github.io/portfolio`
- Repo can be named anything (e.g. `portfolio`).
- You must set a repo variable `BASE_PATH` = `/portfolio` (see step 5).
- Also update `siteUrl` in `web/src/lib/content.ts` to the full URL.

> The steps below assume **Option 1**. Notes for Option 2 are inline.

---

## Part B — One-time setup

### 1. Install Git & sign in to GitHub
- Install Git: https://git-scm.com/downloads
- Create a GitHub account if you don't have one.

### 2. Create the repository
- On GitHub, click **New repository**.
- Name it **`gunratna.github.io`** (Option 1) or `portfolio` (Option 2).
- Leave it empty (no README/gitignore — you already have files).
- Create repository.

### 3. Push your code
Open a terminal in the project root (`e:\Projects\portfolio_v2`) and run:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/Gunratna/gunratna.github.io.git
git push -u origin main
```
(For Option 2, swap the remote URL to your repo name.)

### 4. Enable GitHub Pages with Actions
- Repo → **Settings** → **Pages**.
- Under **Build and deployment → Source**, choose **GitHub Actions**.
  (Do NOT pick "Deploy from a branch".)

### 5. (Option 2 only) Set the base path
- Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab.
- New variable: name `BASE_PATH`, value `/portfolio` (your repo name with a leading slash).
- Also edit `web/src/lib/content.ts`: set
  `siteUrl: "https://gunratna.github.io/portfolio"`, commit & push.

### 6. Watch it deploy
- Repo → **Actions** tab → you'll see "Deploy portfolio to GitHub Pages" running.
- When it goes green (~2 min), your site is live at the URL above.

Every future `git push` to `main` redeploys automatically.

---

## Part C — Updating content later

All text lives in **`web/src/lib/content.ts`**. Edit it, then:

```bash
git add .
git commit -m "Update content"
git push
```

To preview locally before pushing:

```bash
cd web
npm install      # first time only
npm run dev      # http://localhost:3000
```

To test the exact production output locally:

```bash
cd web
npm run build    # outputs ./out
npx serve out    # serves the static site
```

---

## Part D — SEO: getting found for "Gunratna", "Gunratna Borkar IITB", etc.

The site already ships with strong on-page SEO:
- Rich `<title>`, meta description, and keyword set targeting your name + IITB + AI Engineer terms.
- **JSON-LD structured data** (Person + WebSite schema) — this is what powers
  Google's name/knowledge results.
- Open Graph + Twitter cards with an auto-generated preview image.
- `sitemap.xml` and `robots.txt` generated automatically.
- Semantic headings and fast, static pages (good Core Web Vitals).

**You still need to do these external steps — they matter most for ranking:**

1. **Google Search Console** (most important)
   - Go to https://search.google.com/search-console
   - Add property → URL prefix → enter `https://gunratna.github.io`.
   - Verify ownership: easiest is the **HTML tag** method. Copy the
     `<meta name="google-site-verification" ...>` token it gives you and add it
     to `web/src/lib/content.ts` → I've left a `googleVerification` field; paste the
     token there, push, then click Verify.
   - Once verified: **Sitemaps** → submit `sitemap.xml`.
   - Use **URL Inspection** → "Request indexing" for your homepage.

2. **Bing Webmaster Tools** (covers Bing + ChatGPT search)
   - https://www.bing.com/webmasters → add site → submit sitemap.

3. **Build authority / backlinks** (this is what pushes you to the top)
   - Put the URL in your **LinkedIn** profile (Contact info + Featured), GitHub
     profile bio, resume, and email signature. Google trusts links from
     LinkedIn/GitHub heavily for name queries.
   - Add the link to any conference/college pages, Medium/Dev.to posts, etc.

4. **Be consistent** — use the exact name "Gunratna Borkar" everywhere (LinkedIn,
   GitHub, resume) so Google ties them to one entity.

5. **Custom domain (optional, strongest signal)**
   - A domain like `gunratnaborkar.com` ranks better for your name than a
     github.io subdomain. If you buy one: Settings → Pages → Custom domain,
     and update `siteUrl` accordingly.

Indexing takes anywhere from a few days to a few weeks. Requesting indexing in
Search Console speeds it up significantly.

---

## Troubleshooting

- **Blank page / 404 on assets after deploy (Option 2):** `BASE_PATH` not set or
  doesn't match the repo name. It must be `/your-repo-name`.
- **CSS/JS not loading:** ensure `.nojekyll` exists in `web/public` (it does) —
  GitHub Pages otherwise ignores the `_next` folder.
- **Action fails on `npm ci`:** make sure `web/package-lock.json` is committed.
