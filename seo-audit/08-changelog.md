# Changelog

Newest first.

---

# Pass 3 — `zafe-platform-integration` (2026-08-02)

Branch: `zafe-platform-integration` (from `main` @ `ecb01fc`)

## Zafe platform integration

**Added**
- `src/lib/zafeLead.ts` — the single place the site talks to Zafe. Never
  throws; guards on "no email and no phone" because Zafe 400s those. Documents
  why the POST must come from the browser: the capture endpoint validates
  `Origin` against the widget's `allowed_origins`, so proxying it server-side
  sends no Origin and gets rejected.
- `src/ZafeChatbot.tsx` — floating widget. Keyword-matched support replies plus
  a 3-step quote flow that submits a real `type: 'chat'` lead with the full
  transcript. Logo-only header, `Powered by Zafe` footer.

**Changed**
- `src/Home.tsx` — contact form now calls `submitZafeLead` instead of the ~40
  inlined lines it carried. Also sends a `summary` field it previously omitted.
- `src/Layout.tsx` — chatbot mounted behind `lazy()` + `requestIdleCallback`
  (with a `setTimeout` fallback for Safari <17). Main bundle 306 KB → 296 KB;
  chatbot split into its own 10 KB chunk, off the LCP path.
- `index.html` — `navigator.webdriver` guard on the page-view beacon.

## SEO — technical

**Changed**
- `scripts/post-build.mts` — `meta robots` with `max-image-preview:large,
  max-snippet:-1`; geo meta (`geo.region`, `geo.placename`, `geo.position`,
  `ICBM`); `rel=sitemap`; `og:type=article` + `article:published_time` /
  `modified_time` / `author` / `publisher` on posts; per-post 1200×630 OG card
  generation via sharp; real per-post sitemap `lastmod`.
- `public/robots.txt` — expanded from 8 to 16 crawlers (adds OAI-SearchBot,
  ChatGPT-User, Claude-Web, anthropic-ai, Perplexity-User, GoogleOther,
  Applebot, Meta-ExternalAgent, explicit Googlebot/Bingbot) + `Content-Signal`.
- `functions/_middleware.js` — **removed its hardcoded robots.txt duplicate**,
  which had already drifted from `public/robots.txt`. Now re-serves the static
  file through the ASSETS binding, with a fallthrough to `context.next()` if
  the binding is unavailable. The middleware itself stays — it's what prevents
  `*.pages.dev` serving Cloudflare's deny-all robots.txt.
- `public/_headers` — 30-day cache for `/og/*`.
- `src/Layout.tsx` — `<main id="main">` landmark; footer restructured into
  Services / Company / Contact; policy links in the bottom bar; bottom padding
  increased so the fixed chat launcher stops overlapping those links.

**Added**
- `src/Breadcrumbs.tsx` — shared component. ServiceAreas and CityPage had
  inline trails and now share it; Work, Blog, and BlogPost gained the visible
  trails their schema already declared.

## SEO — new pages (28 → 36)

**Added**
- `src/seo/services.ts` — data for 4 service pages
- `src/Services.tsx`, `src/ServicePage.tsx` — hub + detail template
- `src/About.tsx` — owner page, bound to the Person entity via `AboutPage`
- `src/LegalShell.tsx`, `src/PrivacyPolicy.tsx`, `src/TermsOfService.tsx`
- `src/seo/jsonld.ts` — `jsonLdGraphService()`, plus `ItemList` on the services
  hub and `AboutPage` on `/about`

**Changed**
- `src/seo/site.ts` — `ROUTES` gains services, about, privacyPolicy, termsOfService
- `src/App.tsx` — 5 new lazy routes
- `scripts/post-build.mts` — renders service pages; sitemap gives them priority
  0.9 (above city pages and posts) as the primary commercial-intent targets;
  `llms.txt` lists services and policies

## Audit docs

**Added:** `01-research.md`, `03-onpage-audit.md`, `04-content-audit.md`,
`05-geo-aeo-audit.md`, `06-authority-audit.md` — bringing this to the same
10-document set as 5C Containers.

**Changed:** `00-baseline.md` banner-marked as a historical snapshot (not
rewritten — its value is being the "before"); `02`, `07`, `09` rewritten for
the 36-page site.

## Deliberately not done

- **Google Ads / gtag / enhanced conversions.** 5C has this; 4B is not running
  ads. Adding a third-party tag with no account behind it is pure page weight.
- **Invented credentials on `/about`.** No founding year, license number, or
  years of experience — none are confirmed.

## Verification

- `tsc --noEmit` clean; `npm run build` clean (36 pages + sitemap + llms.txt +
  9 OG cards)
- All 36 pages: valid JSON-LD, non-empty title, canonical, robots meta
- Every `Service` node has a `provider`; `/about` has `AboutPage`
- OG cards confirmed exactly 1200×630
- Zafe verified in Chromium against the production build with both endpoints
  intercepted (no test lead reached the live dashboard): 27/27 checks — intent
  routing incl. the "where do you install?" ordering trap, quote-flow payload
  shape, transcript attachment, and the contact form still capturing when
  `/api/contact` returns 500
- Chat-launcher/footer overlap confirmed resolved by bounding-box comparison

---

# Pass 1 — `seo-transformation-2026` (2026-05-02)

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
