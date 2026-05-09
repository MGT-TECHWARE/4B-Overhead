# Action Plan — 4B Overhead Doors SEO

Items grouped by priority. P0/P1 are shipped on `seo-transformation-2026`; P2/P3 are documented next steps.

Legend: **What → Why → How → Effort → Impact**

---

## ✅ P0 — Critical (shipped)

### 1. Crawl & index foundation

- **What:** Add `robots.txt`, `sitemap.xml`, and `llms.txt`; allow AI crawlers explicitly.
- **Why:** Site shipped without any of these. Zero discoverability signal to crawlers.
- **How:** `public/robots.txt` (allow + sitemap line), `scripts/post-build.mts` generates `dist/sitemap.xml` from the `ROUTES` table, `public/llms.txt` lists canonical pages for LLM retrieval.
- **Effort:** S · **Impact:** High (foundational; gates all other work).

### 2. Per-route `<head>` (title, description, canonical, OG, Twitter, JSON-LD)

- **What:** Differentiate `<head>` for `/` vs `/work`.
- **Why:** SPA shipped identical metadata on every route. No canonical anywhere. Critical bug.
- **How:** `scripts/post-build.mts` reads `dist/index.html` and emits route-specific HTML (writes home back, plus `dist/work/index.html`). Single source of truth in `src/seo/site.ts` and `src/seo/jsonld.ts`. Cloudflare Pages serves the matching static file before falling back to the SPA rewrite.
- **Effort:** M · **Impact:** Very High.

### 3. Schema: LocalBusiness + Reviews + AggregateRating + FAQ + Organization + Person + WebSite + Breadcrumb

- **What:** Full JSON-LD coverage with real reviews and real owner identity.
- **Why:** Zero schema before. LocalBusiness is the table-stakes for local pack. The 3 displayed Facebook reviews + 5★ aggregate are eligible for review rich snippets.
- **How:** `src/seo/jsonld.ts` composes a `@graph` per route. Every claim in the schema is mirrored in visible page content (Google's published rule).
- **Effort:** M · **Impact:** Very High (rich snippets unlock CTR; Person node strengthens E-E-A-T).

### 4. Render-blocking Google Fonts → async swap

- **What:** Replace `@import` in CSS with `<link rel="preconnect">` + media-swap `<link rel="stylesheet">`.
- **Why:** `@import` adds a serial CSS request that blocks first paint, hurting LCP and INP.
- **How:** Done in `index.html` and `src/index.css`.
- **Effort:** S · **Impact:** Medium (LCP improvement on slow networks).

### 5. Heading hierarchy fix (eyebrow `<h3>` → `<p>`)

- **What:** Convert 7 misused `<h3>` eyebrows above `<h2>` section titles to `<p>`.
- **Why:** Heading hierarchy was broken on every section. Confuses screen readers and Google's content extraction.
- **How:** Bulk Python regex pass on `Home.tsx` and `Work.tsx`.
- **Effort:** S · **Impact:** Medium (semantics, accessibility, SEO content extraction).

### 6. FAQ section (visible) + FAQPage schema

- **What:** 8 real-question Q&A on `/`, mirrored in `FAQPage` JSON-LD.
- **Why:** No FAQ existed. FAQs are the highest-leverage AEO/GEO citation format and the easiest path to a featured snippet.
- **How:** `FAQS` constant in `src/seo/site.ts` is the single source for both the visible accordion (`FAQItem` in `Home.tsx`) and the JSON-LD generator. Accordion DOM is always present (just visibility-toggled), so crawlers and JSON-LD see the same answer text.
- **Effort:** M · **Impact:** Very High (AEO citations + featured snippets).

### 7. Hero subhead → BLUF answer

- **What:** Rewrote the hero subhead to lead with a complete factual sentence.
- **Why:** AI engines retrieve the first 1-2 sentences as a "chunk." Brand-voice taglines are not citable.
- **How:** "4B Overhead Doors installs and repairs residential and commercial garage doors across West and North Texas. Family-owned, fully insured, and trusted by homeowners, builders, and TxDOT."
- **Effort:** XS · **Impact:** Medium (AEO citability).

### 8. Owner / E-E-A-T signal

- **What:** Surface Colten Beaty as the operator in the footer; bind Person → Organization in schema.
- **Why:** Real-person authorship is now an explicit Google E-E-A-T signal. Owner was previously only mentioned inside a customer review.
- **How:** Footer copy update; Person schema node in `jsonld.ts` with `worksFor`, `knowsAbout`, `jobTitle`.
- **Effort:** XS · **Impact:** Medium-High.

### 9. Tooling correctness

- **What:** Install `@types/react` + `@types/react-dom` (missing); fix UTF-8 encoding glitch in `vite.config.ts`; wire `tsx` post-build step.
- **Why:** Pre-existing `tsc --noEmit` failure means the project's lint script never passed. Encoding glitch was a comment but reflects a corrupted edit.
- **How:** `npm install --save-dev @types/react@^19 @types/react-dom@^19`, byte-level fix on the comment, updated `package.json` build script.
- **Effort:** S · **Impact:** Quality / correctness.

---

## 🔥 P1 — High impact (recommended this month)

### 1. Confirm production URL + deploy

- **What:** Replace the assumed `https://4boverheaddoors.com` in `src/seo/site.ts` if the actual domain is different. Then deploy and submit `sitemap.xml` in Google Search Console.
- **Why:** Every absolute URL in canonical/OG/JSON-LD/sitemap depends on this constant. The whole layer of work is wired to one config value.
- **Effort:** XS · **Impact:** Required for everything to take effect.

### 2. Claim & populate Google Business Profile

- **What:** Set up / verify GBP for 4B Overhead Doors with NAP, hours, photos, and service area.
- **Why:** For a local trade business, GBP is the single largest organic-traffic lever — bigger than the site itself for "[service] near me" queries.
- **Effort:** S (the work) + 1-3 weeks (verification mailer) · **Impact:** Very High.

### 3. Real LCP image preload at build time

- **What:** Have `scripts/post-build.mts` discover the hashed hero asset URL in `dist/index.html` and inject `<link rel="preload" as="image" fetchpriority="high">` before the bundle script tag.
- **Why:** Currently relies on browser preload scanner finding the React-rendered `<img>`. Preload-from-head wins ~200-400ms LCP on cold loads.
- **Effort:** S · **Impact:** Medium-High (CWV).

### 4. Hero image intrinsic dimensions

- **What:** Update `<img width height>` on hero to match the actual source aspect ratio.
- **Why:** Declared 1600×1600 (square) but image is landscape. Browser reserves wrong layout box → small CLS hit.
- **Effort:** XS · **Impact:** Small but trivial.

### 5. Gallery image dimensions

- **What:** During build, read each `src/assets/gallery/*.webp` size and inject `width`/`height` on the `<img>` tags in `Work.tsx` (could be a lookup table generated at build).
- **Why:** Masonry layout without intrinsic dims has CLS risk on `/work`.
- **Effort:** S · **Impact:** Medium (CWV on /work specifically).

### 6. Service-specific landing pages (×4)

- **What:** Build out dedicated routes: `/services/residential-garage-doors`, `/services/commercial-overhead-doors`, `/services/garage-door-repair`, `/services/spring-repair`. Each with its own H1, FAQ, schema (`Service` + `Offer`), and breadcrumb.
- **Why:** A 2-page site cannot rank for the full keyword set. Each service is a distinct intent + SERP. Also strongest internal-link target structure.
- **Effort:** L · **Impact:** Very High over 3-6 months.

### 7. Location landing pages

- **What:** `/service-areas/wichita-falls`, `/service-areas/burkburnett`, etc., once you confirm the top 5-10 cities you actually serve.
- **Why:** "[city] garage door repair" is the highest-intent local query class. Each city deserves its own page with local proof points (jobs done, photos from that city).
- **Effort:** L · **Impact:** Very High for local search.

### 8. Get a verified street address

- **What:** Confirm a physical address (even if home-based / shop-based). Update `src/seo/site.ts` `BUSINESS.address` accordingly.
- **Why:** Full LocalBusiness schema + GBP need an address for local pack inclusion. Geo coordinates currently fall back to Wichita Falls city center.
- **Effort:** XS · **Impact:** High (gates local pack).

---

## 🛠 P2 — Medium (next quarter)

1. **Full prerendering / SSG.** Migrate to `vite-react-ssg` or port the home/work pages to Astro. This puts visible body text in the HTML for AI crawlers and removes the JS-rendering tax.
2. **About / Author page.** Dedicated `/about` for Colten Beaty with credentials, photo, story, certifications. Strengthens Person entity.
3. **Custom 404 page.** Replace the `_redirects` catch-all 200 rewrite with a `/404.html` + 404 status.
4. **Visible breadcrumb UI** on `/work` (and any future deeper pages).
5. **`<main>` semantic wrapper** around `<Outlet/>` in `Layout.tsx`.
6. **Self-host Inter** to remove the third-party connection entirely.
7. **Image audit script** that asserts every image is ≤500 KB and has `width`/`height`.
8. **Reviews collection flow.** Add a post-job email asking customers to leave a Google + Facebook review. Track velocity.
9. **Blog or knowledge base** at `/learn` covering "How long does a garage door last in Texas heat", "Signs your spring is about to break", "What size garage door for a 30x50 shop", etc. — every article is a long-tail keyword + AEO target.
10. **Strip / `.gitignore` the `src/Gallery/` PNG dump** (not deployed but bloats the repo).

---

## 🌱 P3 — Strategic (ongoing)

1. **Backlink building** — outreach to Texas-based home builder blogs, real-estate publications, TxDOT vendor lists, regional magazines. Target 1-2 quality links per month.
2. **Citations / NAP consistency.** Audit Yelp, BBB, Angi, HomeAdvisor, Yellow Pages, local chamber of commerce listings; ensure name + address + phone match exactly.
3. **Content refresh cadence.** Re-audit titles/descriptions, add new project photos to `/work` monthly, update FAQ when new questions come in.
4. **Competitor watch.** Run a quarterly SERP check on the primary keywords once they exist in `src/seo/site.ts`.
5. **Re-run this audit every 90 days.** The web, Google, and AI engines shift fast.

---

## What this audit could NOT do (transparency)

- No live URL was provided, so no Lighthouse / PSI / GSC / crawl data was captured. All performance findings are static-analysis only. The `09-validation.md` file is a placeholder for the post-deploy run.
- No web access in the session, so the "current SEO best practices 2026" research is from training-data + the prompt's own guidance. If a major Google algorithm or AI-search policy shipped between now and 2026-05-02 (today), it is not reflected.
- No backlink/keyword tooling (Ahrefs/Semrush/DataForSEO) was connected. Off-page work is diagnostic-only.
