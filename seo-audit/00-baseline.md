# SEO Baseline — 4B Overhead Doors

**Captured:** 2026-05-02 (timestamp written by Claude Code at audit start)
**Branch:** `seo-transformation-2026`
**Base commit:** `2bc9c3e` (first commit on `main`)

---

> ## ⚠️ This is a historical snapshot — do not read it as current state
>
> This file records the site as it existed on **2026-05-02**: a 2-page SPA with
> no robots.txt, no sitemap, no canonical tags, and no structured data. It is
> deliberately **not** updated, because its value is being the "before" that
> later work is measured against.
>
> **The site today is 36 pages** with service, city, blog, about, and policy
> routes, full JSON-LD, per-post OG cards, and Zafe lead capture. For current
> state, read:
>
> | Question | File |
> |---|---|
> | What's the technical/crawl posture now? | `02-technical-onpage-audit.md` |
> | What are the on-page rules and page inventory? | `03-onpage-audit.md` |
> | Is the content any good? | `04-content-audit.md` |
> | Can AI engines cite us? | `05-geo-aeo-audit.md` |
> | What's blocking us off-site? | `06-authority-audit.md` |
> | What do we do next? | `07-action-plan.md` |
> | What changed and when? | `08-changelog.md` |
>
> Sections 1 and 11 below (business profile, open questions) are still the
> useful parts — several of those gaps remain open.

---

## 1. Inferred Business Profile

| Field | Value | Source |
|---|---|---|
| Business name | 4B Overhead Doors, LLC | `index.html`, `Layout.tsx` footer, `metadata.json` |
| Owner / Operator | Colten Beaty | Reviews in `Home.tsx` (lines 438, 443, 448) + email `coltenbeaty182@gmail.com` |
| Phone | (940) 781-1186 | `Layout.tsx` (940 area = Wichita Falls / North TX) |
| Public email | coltenbeaty182@gmail.com | `Home.tsx` line 580 |
| Business email | 4boverheaddoorsllc@gmail.com | `Home.tsx` line 590 |
| Geographic focus | West Texas, North Texas, Texas Panhandle, Red River Region (+ OK on call) | `Home.tsx` `#service-areas` |
| Services | Residential garage doors, Commercial garage doors (incl. **TxDOT** highway projects), Repairs & Maintenance, Installations | `Home.tsx` `#services` |
| Conversion goals | Phone call + contact form (Cloudflare Pages function → Gmail SMTP) | `functions/api/contact.js` |
| Social | facebook.com/4BGarageDoors (real, with reviews) | `Home.tsx` line 478 |
| Insurance / Trust | "Family-owned, fully insured, 100% satisfaction guaranteed" | Multiple sections |

### ⚠️ Gaps requiring user confirmation
- **Production URL** is NOT in the repo. Cloudflare Pages project name is `4b-overhead-demo` (per `.env.example`). README links to an ai.studio dev URL. **Working assumption: `https://4boverheaddoors.com`.** If different, one find/replace updates all generated files. The canonical/sitemap/JSON-LD all reference the constant `SITE_URL` defined in `src/seo/site.ts`.
- **Physical street address** for full LocalBusiness schema (currently only "West & North Texas" is shown). Without a street address Google Business Profile / local pack rankings are gated.
- **Service-area cities** (Wichita Falls? Burkburnett? Vernon? Decatur? Amarillo? Lubbock?). These should become individual location pages.
- **License numbers** (TxDOT vendor #? Texas contractor cert?) for trust signals.
- **Year founded** for `foundingDate` in Organization schema.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 6 + `@vitejs/plugin-react` |
| Framework | React 19 + React Router 7 (BrowserRouter, client-rendered SPA) |
| Styling | Tailwind 4 (`@tailwindcss/vite`), Inter via Google Fonts `@import` |
| Animation | `motion` (Framer Motion fork) |
| Icons | `lucide-react` |
| Hosting | Cloudflare Pages |
| Backend | Cloudflare Pages Function (`functions/api/contact.js`) → Gmail SMTP via `cloudflare:sockets` |
| Routes | `/` (`Home`), `/work` (`Work`) — that's it |

---

## 3. Routing & Indexing Mechanism

- `public/_redirects`: `/* /index.html 200` — SPA fallback (Cloudflare Pages serves any path with `index.html` HTML if no static match exists). This **rewrites**, not redirects (200 status), so route URLs stay clean.
- All routes serve **identical HTML** today. Per-route `<title>`, `<meta>`, canonical, and JSON-LD are NOT differentiated.
- No prerender / SSR / SSG. Googlebot will render JS but pays a crawl-budget cost; AI crawlers (GPTBot, ClaudeBot, Perplexity, etc.) often skip JS rendering, so the JS-rendered content is invisible to them.

**Implication:** Need build-time per-route HTML generation OR a runtime `<head>` manager (React 19 native `<title>`/`<meta>`) to differentiate `/` and `/work`. **Decision:** post-build static-HTML duplication (cheap, deterministic, AI-crawler-safe for the only two routes).

---

## 4. Current `<head>` (index.html)

| Tag | Current value | Issue |
|---|---|---|
| `<html lang>` | `en` | OK (`en-US` would be marginally better) |
| `<title>` | "4B Overhead Doors — Premium Garage Doors in West & North Texas" | **65 chars** (over 60 ideal); same on every route |
| `<meta description>` | "Family-owned, fully insured residential and commercial garage door installations, repairs, and maintenance across West and North Texas." | 145 chars OK; same on every route |
| `<link canonical>` | **missing** | Critical — every page is non-canonical |
| `<meta og:url>` | **missing** | Social previews link to bare domain |
| `<meta og:type>` | `website` | OK |
| `<meta og:image>` | `/og-image.jpg` | Relative — should be absolute for some scrapers |
| `<meta og:image:width/height>` | 1200×630 | OK |
| `<meta twitter:card>` | `summary_large_image` | OK |
| `<meta twitter:site/creator>` | **missing** | Add if a brand X handle exists |
| Favicon set | full (16/32/180 + .ico) | OK |
| `<meta theme-color>` | `#09090b` | OK (single value; could split light/dark) |
| Preconnect / preload | **missing** | Google Fonts is render-blocking; no LCP image preload |
| JSON-LD | **missing** | Critical — no LocalBusiness/Org/Review/FAQ |
| `<meta robots>` | absent (defaults to index, follow) | OK |
| Viewport | `width=device-width, initial-scale=1.0, viewport-fit=cover` | OK |

---

## 5. Crawlability Files

| File | Status | Notes |
|---|---|---|
| `public/robots.txt` | ❌ missing | No explicit allow/disallow; AI bots default behavior depends on host |
| `public/sitemap.xml` | ❌ missing | No sitemap reference anywhere |
| `public/llms.txt` | ❌ missing | AEO entry point — needs creation |
| `public/_redirects` | ✅ present | SPA rewrite rule only |

---

## 6. On-Page (Home.tsx) — quick scan

| Element | Status |
|---|---|
| Single `<h1>` | ✅ One `<h1>` ("Premium Garage / Doors. / Built to last") in hero |
| Heading hierarchy | ❌ **Eyebrow `<h3>` before `<h2>`** repeated in every section (lines 285, 344, 377, 423, 491, 554) — semantic anti-pattern. Should be `<p>` or styled span, not heading. |
| Primary keyword in H1 | ⚠️ "Premium Garage Doors. Built to last" — missing geo qualifier ("in West & North Texas") |
| First-100-words BLUF | ⚠️ Hero has tagline but no direct answer to "what does 4B Overhead Doors do, where, for whom" optimized for AEO retrieval |
| Image alts | ✅ Mostly present and descriptive (hero, process steps, why-photo rotator, gallery enumerated) |
| Internal links | ⚠️ Only nav + footer; no contextual in-body links between sections except CTAs |
| External authoritative links | ❌ none |
| Last-updated / dateModified visible | ❌ none |
| Author byline | ❌ Colten Beaty is named only inside a customer review, never as the operator |
| FAQ section | ❌ none |

---

## 7. Performance Risks (static analysis — Lighthouse not run yet, no live URL)

- **Render-blocking Google Fonts** via `@import url('...')` in `index.css` — costs ~150-300ms LCP on slow networks. Should be `<link rel="preconnect">` + `<link rel="stylesheet">` with `display=swap` (already requested), or self-host.
- **Hero image** (`hero-garage.webp`, 290 KB) is `fetchPriority="high"` ✅ but not `<link rel="preload">`'d in `<head>` — first paint waits for CSS+JS to discover it.
- **71 gallery images** loaded on `/work` page — properly lazy-loaded and `decoding="async"` ✅, `image-rendering` and `width/height` need verification (currently no intrinsic dims on gallery `<img>` — minor CLS risk inside masonry).
- **PNG duplicates** in `src/assets/` (~30 MB raw of `.png` siblings of `.webp`) — Vite only bundles imports, so PNGs are NOT in dist. Repo bloat, but no runtime SEO impact.
- **`src/Gallery/`** untracked dump (~187 MB of source PNGs already converted to webp) — repo bloat, no runtime impact. Out of SEO scope.
- **Hero `<img>` width=1600 height=1600** but actual aspect ratio is landscape — declared dimensions wrong; CLS risk. The `object-cover` fills the container regardless, so visual is fine, but the intrinsic ratio passed to Lighthouse / browser layout is square. Should match true source dims.
- **Encoding glitch** in `vite.config.ts` line 19/20 (`â` chars where dashes/quotes were) and same in `index.html` description — actually `index.html` looks clean; only the comment in `vite.config.ts` is mangled. Cosmetic.

---

## 8. Schema / Structured Data — Inventory

| Schema type | Status | Page where it belongs |
|---|---|---|
| Organization | ❌ missing | Sitewide (in root index.html) |
| LocalBusiness / HomeAndConstructionBusiness | ❌ missing | `/` |
| WebSite + SearchAction | ❌ missing | `/` |
| BreadcrumbList | ❌ missing | All non-root pages (`/work`) |
| Service (× 4) | ❌ missing | `/` (each service card) |
| AggregateRating | ❌ missing — **but real data exists** (3 Facebook reviews, all 5★) | `/` |
| Review (× 3) | ❌ missing — real reviewer names + dates available | `/` |
| FAQPage | ❌ missing — no FAQ section exists yet, must be created | `/` |
| Person (Colten Beaty) | ❌ missing | New `/about` page (out of scope this pass; flag for P2) or inline as `founder` of Organization |
| ImageGallery / CollectionPage | ❌ missing | `/work` |
| ContactPage | ❌ missing | `/` (contact section anchor) |

---

## 9. AEO / GEO Posture

- ❌ No `llms.txt`
- ❌ No FAQ blocks (kills AEO citations)
- ❌ Body content not BLUF-formatted (heros lead with brand-voice taglines, not direct answers)
- ❌ Content invisible to non-JS crawlers (SPA)
- ✅ Real authority signals exist but aren't structured: real owner name, real reviews with attributable dates, real Facebook social proof, "fully insured", "TxDOT" client mention
- ❌ No author/byline trail to a Person entity

---

## 10. Authority / Off-Page (diagnostic only)

Cannot run external tools without web access. Items to flag:
- Google Business Profile status: **unknown** — likely the single biggest leverage for local search ranking
- Backlink profile: **unknown** — no GSC/Ahrefs data provided
- NAP consistency across directories (Yelp, BBB, HomeAdvisor, Angi, Yellow Pages, Facebook): **needs audit**
- Reviews velocity: 3 visible Facebook reviews from Nov 16-17, 2025 — need a programmatic ask flow

---

## 11. What Phase 0 Cannot Capture

I have no live web access in this session, so the following are **deferred to validation**:
- Real Lighthouse / PSI scores (mobile + desktop) on the live URL
- Real Core Web Vitals percentiles
- Current indexed page count (Google `site:` query)
- Current rankings, impressions, CTR (would need GSC export in `./data/`)
- Whether Google Business Profile exists and its claim status
- Current backlink profile

These will be captured at `seo-audit/09-validation.md` when re-run with the live URL provided.

---

## 12. Top Risks Going Into Phase 2

1. **SPA per-route HTML divergence** — must solve at build time so `/work` ships its own `<title>`, canonical, and JSON-LD.
2. **Production URL unknown** — solved by centralizing in `src/seo/site.ts` and reading at build time; one config change updates everything.
3. **Real reviewer names being put into Review schema** — Google requires the markup to match what's visibly displayed (✅ they are visible) and prohibits self-authored / fabricated reviews (✅ these are real Facebook reviews).
4. **TxDOT mention** — strong authority signal but verify it's accurate before amplifying in JSON-LD `award` / `knowsAbout`.
