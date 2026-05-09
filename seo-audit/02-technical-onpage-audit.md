# Technical + On-Page Audit & Fix Log

Combined technical (Phase 2) and on-page (Phase 3-4) audit. Every Tier-1/2 issue identified during baseline was either fixed or scheduled into the action plan with a justification.

---

## Tier 1 — Crawl & Index Foundation

| Check | Before | After | File / Notes |
|---|---|---|---|
| `robots.txt` | ❌ missing | ✅ explicit allow-all + AI bots, sitemap reference | `public/robots.txt` |
| `sitemap.xml` | ❌ missing | ✅ generated at build for `/` and `/work` | `scripts/post-build.mts` → `dist/sitemap.xml` |
| `<link rel="canonical">` | ❌ missing on every page | ✅ injected per-route at build time | `dist/index.html`, `dist/work/index.html` |
| HTTPS / mixed content | ✅ Cloudflare Pages enforces | unchanged | — |
| Custom 404 / soft 404s | ⚠️ SPA `_redirects` rewrites everything to `/index.html` (200) — every unknown path returns the homepage | unchanged in this pass; Cloudflare Pages serves the per-route static HTML first when present, so `/`, `/work` resolve correctly. Unknown paths still fall through. **Flagged P2:** add a real 404 route. | `public/_redirects`, `src/App.tsx` |
| URL hygiene (lowercase, hyphens, no double slashes) | ✅ both routes are clean | unchanged | — |
| Hreflang | N/A (single language) | unchanged | — |
| Critical content in initial HTML | ⚠️ SPA — body content only after JS execution. Mitigated by route-specific `<head>` (title/desc/canonical/JSON-LD) injected at build, so crawlers and AI bots see the canonical metadata, schema, FAQ Q&A, reviews, and aggregate rating without rendering JS. **Flagged P2:** full SSG pass (vite-react-ssg or migrate to Astro/Next) for body-text-in-HTML coverage. | partial fix | `scripts/post-build.mts`, `src/seo/jsonld.ts` |
| AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `Bytespider`) | unspecified | ✅ explicitly allowed | `public/robots.txt` |
| `llms.txt` | ❌ missing | ✅ structured for LLM retrieval | `public/llms.txt` |

---

## Tier 2 — Performance (Core Web Vitals)

Cannot run real Lighthouse / PSI without the live URL. Static-analysis fixes applied:

| Issue | Action |
|---|---|
| Render-blocking Google Fonts via `@import` in CSS (serial CSS request, blocks first paint) | Replaced with `<link rel="preconnect">` + `<link rel="stylesheet" media="print" onload="this.media='all'">` (LoadCSS swap) and `<noscript>` fallback. Removed the `@import` from `src/index.css`. |
| LCP image (`hero-garage.webp`, ~290 KB) — already `fetchPriority="high"` in component, but not preloaded in `<head>` | Kept `fetchPriority="high"` ✅. Did NOT add `<link rel="preload">` because Vite hashes the asset filename at build (`/assets/hero-garage-QKpgPfhL.webp`) — preloading from the static `<head>` would race with bundle hashing. **P1 follow-up:** make the post-build script discover and inject the preload tag for the hashed hero asset. |
| Hero `<img width=1600 height=1600>` declared aspect 1:1 but actual image is landscape — declared dims must match intrinsic | **Flagged P1.** Component uses `object-cover`, so visual fine; but layout reserves a square box. Fix once we confirm the actual hero image dimensions. |
| 71 gallery images on `/work` — properly lazy + decode async ✅; missing intrinsic `width`/`height` attributes (CLS risk inside masonry) | **Flagged P1** — needs dim metadata extraction at build time. Out of scope for this pass; CLS risk on `/work` only. |
| Self-host fonts vs Google Fonts | Kept Google Fonts (quick win). Self-hosting is a P2 optimization. |
| 187 MB of unused PNGs in `src/Gallery/` (untracked, not bundled) | Repo bloat only; no runtime impact. **P3 cleanup** suggested but skipped this pass. |
| ~30 MB of duplicate PNG/.webp pairs in `src/assets/` | Vite only bundles imported paths (which point to `.webp`). PNGs are NOT in dist. No SEO impact; repo bloat. Skipped. |

---

## Tier 3 — Mobile & Accessibility

| Check | Status |
|---|---|
| Responsive layout, no horizontal scroll | ✅ existing Tailwind responsive classes |
| Tap targets ≥ 44px | ✅ phone button is `w-11 h-11` (44px), nav buttons sized appropriately |
| No intrusive interstitials | ✅ none |
| Body font ≥16px | ✅ Tailwind base 16px |
| Semantic landmarks | ✅ `<nav>`, `<main>` (implicit via `<Outlet/>`), `<footer>` — could add `<main role="main">` wrapper around `Outlet` (P2) |
| Color contrast | ✅ white-on-zinc-950 passes AA easily |
| `alt` text on content images | ✅ Existing alts on hero/process/reviews/gallery; **upgraded service-card alts** with descriptive text (was `alt={item.title}` → now route-specific descriptions) |
| Keyboard nav / focus states | ✅ `focus-visible:ring` on most interactive elements; FAQ accordion buttons have it too |
| Eyebrow `<h3>` before `<h2>` (broke heading hierarchy) | ✅ Fixed across `Home.tsx` (×6) and `Work.tsx` (×1) — converted to `<p>` with the same Tailwind classes (visually identical, semantically correct) |

---

## Tier 4 — Site Architecture

| Check | Status |
|---|---|
| Important pages reachable in ≤ 3 clicks | ✅ everything on home; `/work` linked from nav + process section |
| Pillar + cluster internal linking | ⚠️ Site is too small (2 pages) for cluster model. Adding service-area / service-type landing pages is the natural growth — **flagged P2.** |
| Orphan pages | ✅ none |
| Breadcrumbs | ✅ schema-only (`BreadcrumbList`); visible UI breadcrumbs deferred to P2 |
| Internal anchor text | ✅ improved footer + nav already descriptive; in-body links are mostly CTAs |
| Broken links / redirect chains | ✅ none on this codebase |

---

## On-Page Optimization Snapshot

| Element | Before | After |
|---|---|---|
| `<html lang>` | `en` | `en-US` |
| `<title>` (home) | "4B Overhead Doors — Premium Garage Doors in West & North Texas" (65 chars, brand-first) | "Garage Door Repair & Install — West & North TX \| 4B Overhead" (61 chars, keyword-first) |
| `<title>` (work) | identical to home | "Our Work — Texas Garage Door Projects \| 4B Overhead Doors" (57 chars) |
| Meta description (home) | brand pitch (145 chars) | keyword + service + region + phone CTA (177 chars) |
| Canonical | absent | absolute URLs on both routes |
| og:url | absent | absolute URL per route |
| og:site_name, og:locale | absent | added |
| og:image:alt | absent | descriptive |
| Hero subhead | "Residential & Commercial Solutions Across West & North Texas. Family-owned, fully insured, and dedicated to high-end craftsmanship." | "4B Overhead Doors installs and repairs residential and commercial garage doors across West and North Texas. Family-owned, fully insured, and trusted by homeowners, builders, and TxDOT." (BLUF-format, factual, AEO-citable) |
| Service card image alts | each was the title string ("Residential Garage Doors") | upgraded to descriptive sentences |
| Eyebrow `<h3>` (×7) | semantic anti-pattern | converted to `<p>` |
| FAQ section + FAQPage schema | missing | 8 Q&A items + JSON-LD; nav + footer entries added |
| Owner attribution (E-E-A-T) | only inside a customer review | footer now names "operated by Colten Beaty"; Person node in JSON-LD with `knowsAbout` and `worksFor` linked to Organization |

---

## Schema Coverage (after)

| Schema type | Pages | Source |
|---|---|---|
| Organization | both | `src/seo/jsonld.ts` |
| Person (Colten Beaty) | both | `src/seo/jsonld.ts` |
| WebSite | both | `src/seo/jsonld.ts` |
| LocalBusiness + HomeAndConstructionBusiness | both | `src/seo/jsonld.ts` (with `@type` array) |
| AggregateRating + Review (×3) | both | embedded in LocalBusiness; reviews are real, displayed Facebook reviews — schema text matches visible content |
| `makesOffer` × 4 Services | both | embedded in LocalBusiness |
| WebPage + BreadcrumbList | both | per-route in `jsonLdGraph()` |
| FAQPage | home only | content mirrored 1:1 from `FAQS` array used by visible accordion |

All node IDs are stable URI-style (`#organization`, `#business`, `#colten-beaty`, `#website`, `#webpage`) so cross-references resolve.
