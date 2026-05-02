# Changelog — `seo-transformation-2026`

Branch: `seo-transformation-2026` (from `main` @ `2bc9c3e`)

## Files added

- `src/seo/site.ts` — single source of truth: `SITE_URL`, `BUSINESS`, `ROUTES` (per-route titles/descriptions/breadcrumbs), `REVIEWS`, `FAQS`. No external dependencies — safe to import from both runtime React and Node build scripts.
- `src/seo/jsonld.ts` — `jsonLdGraph(routeKey)` + `jsonLdString(routeKey)`. Composes `Organization`, `Person`, `WebSite`, `LocalBusiness/HomeAndConstructionBusiness` (with `aggregateRating`, 3 real `Review` nodes, 4 `makesOffer` Service nodes), `WebPage`, `BreadcrumbList`, and `FAQPage` (home only).
- `scripts/post-build.mts` — runs after `vite build`. Strips placeholder `<title>`/meta and injects per-route `<title>`, `<meta description>`, `<link rel=canonical>`, OG, Twitter, and JSON-LD into `dist/index.html` and `dist/work/index.html`. Also emits `dist/sitemap.xml`.
- `public/robots.txt` — explicit allow, including AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider). Sitemap reference.
- `public/llms.txt` — structured AEO entry point with about, services, core pages, optional links.
- `public/site.webmanifest` — PWA manifest (better mobile install + theme).
- `seo-audit/00-baseline.md`, `02-technical-onpage-audit.md`, `07-action-plan.md`, `08-changelog.md` — this audit.

## Files modified

- `index.html` — `lang="en-US"`, removed in-template title/description (now injected at build), added preconnect + async font load + noscript fallback, added webmanifest link. Removed render-blocking `@import` of Google Fonts in favor of `<link>` with media-swap.
- `src/index.css` — removed Google Fonts `@import` (now in HTML).
- `src/Home.tsx`:
  - imported `FAQS` from `src/seo/site` and added `HelpCircle`, `Plus`, `Minus` from lucide.
  - new `FAQItem` component (controlled accordion, DOM always rendered for crawler parity).
  - hero subhead rewritten as a BLUF factual sentence.
  - service-card alt text upgraded from title string to descriptive sentences.
  - new `<section id="faq">` between Reviews and Service Areas with 8 real-question accordion.
  - 6 eyebrow `<h3>` → `<p>` (preserving Tailwind classes; visually identical).
- `src/Work.tsx` — 1 eyebrow `<h3>` → `<p>`.
- `src/Layout.tsx`:
  - `import React, { ... } from 'react'` (was missing the default import; pre-existing lint failure).
  - added `FAQ` to `navLinks` and to the footer Quick Links.
  - footer copy now names "operated by Colten Beaty" (E-E-A-T).
- `package.json`:
  - `build` now runs `vite build && tsx scripts/post-build.mts`.
  - new `build:vite-only` escape hatch.
  - added `@types/react@^19` and `@types/react-dom@^19` (previously missing).
- `vite.config.ts` — fixed UTF-8 encoding glitch in a comment.

## Files NOT touched (deliberate)

- `src/Gallery/` (untracked 187 MB PNG dump) — not deployed; out of SEO scope.
- Duplicate PNG/.webp pairs in `src/assets/` — not bundled by Vite; out of SEO scope.
- Existing component visual design — every change preserves the original look.

## Verification done in this session

- `npm run lint` — clean.
- `npm run build` — clean. Outputs `dist/index.html`, `dist/work/index.html`, `dist/sitemap.xml`, `dist/robots.txt`, `dist/llms.txt`, `dist/site.webmanifest`.
- JSON-LD parses on both routes (Python `json.loads`); 6 nodes on home (incl. `FAQPage`), 5 on `/work`. Node `@type`s confirmed.
- Title length: 61 chars (home) / 57 chars (work) — both within Google's truncation budget.
- Per-route `<head>` contains differentiated title, meta description, canonical, og:url.
