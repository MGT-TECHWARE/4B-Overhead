# Technical SEO Audit & Fix Log

**Updated:** 2026-08-02

Technical / crawl-and-index layer. The on-page half moved to
`03-onpage-audit.md` when that file was added — this one is now technical only,
though the filename is kept for continuity with earlier references.

---

## Tier 1 — Crawl & index foundation

| Check | Original (2026-05-02) | Now | Where |
|---|---|---|---|
| `robots.txt` | ❌ missing | ✅ 16 crawlers explicitly allowed incl. the full AI set; `Content-Signal` declared | `public/robots.txt` |
| robots.txt duplication | — | ✅ **Fixed.** A second hardcoded copy lived in the Pages middleware and had already drifted. The middleware now re-serves the static file via the ASSETS binding, so `public/robots.txt` is the only copy. | `functions/_middleware.js` |
| `*.pages.dev` deny-all override | ⚠️ risk | ✅ Middleware answers `/robots.txt` before Cloudflare can substitute its own | `functions/_middleware.js` |
| `sitemap.xml` | ❌ missing | ✅ 36 URLs, generated at build | `scripts/post-build.mts` |
| `lastmod` accuracy | — | ✅ Posts report their real dates. Routes/cities use the build date, which is honest since they regenerate each deploy. Previously every URL was stamped "today" — a false freshness signal Google learns to discount. | `scripts/post-build.mts` |
| `<link rel="canonical">` | ❌ missing everywhere | ✅ absolute, per-route, all 36 pages | build-injected |
| `<meta name="robots">` | ❌ absent (defaulted) | ✅ `index, follow, max-image-preview:large, max-snippet:-1` — the image-preview directive matters for a visual trade | build-injected |
| `llms.txt` | ❌ missing | ✅ generated from the live route tables so it can't drift from the sitemap | `scripts/post-build.mts` |
| Custom 404 | ⚠️ SPA rewrote every unknown path to a 200 | ✅ real `404.html` with `noindex` | `public/404.html` |
| Asset-URL SPA fallback | ⚠️ cache-poisoning risk | ✅ `/assets/*` rewrites to itself, so a not-yet-propagated asset 404s instead of returning cached HTML under an immutable header | `public/_redirects` |
| HTTPS / mixed content | ✅ Cloudflare enforces | ✅ unchanged | — |
| URL hygiene | ✅ clean | ✅ all 36 lowercase, hyphenated, no double slashes | — |
| Hreflang | N/A single language | N/A | — |
| Orphan pages | ✅ none | ✅ none — nav + footer reach every page | — |

---

## Tier 2 — Rendering & indexability

This is the one genuinely unresolved architectural issue.

The site is a client-rendered React SPA. `scripts/post-build.mts` generates
static HTML for all 36 routes, so **metadata and the full JSON-LD graph ship in
the raw HTML response** — canonical, title, description, OG/article tags, and
every schema node including all FAQ answers and review text.

⚠️ **Body prose is still React-rendered.** A crawler that doesn't execute JS
gets complete metadata and schema but not the narrative copy. Googlebot renders
JS and is fine. Most AI crawlers don't — but because FAQ and service content is
mirrored into schema, the substantive answers remain reachable. The long-form
body copy is not.

**Fix:** full SSG (`vite-react-ssg`, or port to Astro the way 5C Containers is
built). Still the top P2 item. Everything else in this file is done; this isn't.

---

## Tier 3 — Performance (Core Web Vitals)

Static analysis only — **no live URL has ever been measured. [needs Lighthouse/PSI]**

| Issue | Status |
|---|---|
| Render-blocking Google Fonts | ✅ Fixed — Inter self-hosted via `@fontsource-variable/inter`; no third-party connection at all |
| Critical CSS | ✅ Inlined into `<head>`; the render-blocking stylesheet link is removed |
| Font preload | ✅ Hashed woff2 discovered at build and preloaded |
| LCP image preload | ✅ Hashed hero discovered at build, with responsive `imagesrcset` for mobile/desktop |
| Route code-splitting | ✅ Every non-home route lazy-loaded |
| Chatbot weight | ✅ Lazy + deferred to `requestIdleCallback`; own 10 KB chunk, off the LCP path |
| Cache headers | ✅ Immutable for hashed assets/fonts, 30d for icons and OG cards, daily for crawler files, `must-revalidate` for HTML |
| Gallery intrinsic dimensions | ❌ **Still open** — no `width`/`height` on gallery `<img>`; CLS risk on `/work` |
| Hero declared dimensions | ⚠️ Re-verify against the current hero video/poster |
| Repo bloat (`src/Gallery/` source PNGs) | ⚠️ Not deployed; cosmetic only |

---

## Tier 4 — Mobile & accessibility

| Check | Status |
|---|---|
| Responsive, no horizontal scroll | ✅ |
| Tap targets ≥ 44px | ✅ including the 56px chat launcher |
| Body font ≥ 16px | ✅ |
| Semantic landmarks | ✅ `<nav>`, `<main id="main">`, `<footer>` — `<main>` added this pass |
| Heading hierarchy | ✅ exactly one `<h1>` per page, no skipped levels |
| Color contrast | ✅ white on zinc-950 passes AA comfortably |
| Keyboard nav / focus | ✅ `focus-visible:ring` throughout including the chatbot; Escape closes both chat and mobile menu |
| `alt` text | ✅ descriptive; the `/about` alt was corrected this pass to describe what's actually in the frame |
| Breadcrumbs | ✅ visible on all 5 sub-page types, matching `BreadcrumbList` schema |
| Fixed-element collision | ✅ The chat launcher was sitting on top of the footer policy links at scroll-bottom. Footer padding increased; verified clear by bounding-box comparison. |

---

## Tier 5 — Structured data

All 36 pages emit a JSON-LD `@graph`. Automated verification confirms every
page parses, every graph is non-empty, every `Service` node has a `provider`,
and `/about` carries `AboutPage`.

Types present across the site: `Organization`, `Person`, `WebSite`,
`LocalBusiness`+`HomeAndConstructionBusiness`, `WebPage`, `BreadcrumbList`,
`Service`, `AboutPage`, `ItemList`, `Blog`, `BlogPosting`, `FAQPage`.

All `@id`s are stable URI anchors (`#organization`, `#business`,
`#colten-beaty`, `#website`) so cross-page references resolve to a single
entity rather than 36 disconnected businesses.

⚠️ **Standing constraint:** `aggregateRating.reviewCount` must always equal the
number of visible `Review` nodes. If reviews are added to `src/seo/site.ts`
they must also be displayed on the page — Google requires markup to match
visible content, and violating this can cost all rich-result eligibility.
