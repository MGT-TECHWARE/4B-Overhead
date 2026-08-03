# Master Action Plan — 4B Overhead Doors SEO

**Updated:** 2026-08-02

Everything marked ✅ is in the repo. Everything else is ordered by expected
return, not by effort.

---

## ✅ Shipped

### Pass 1 — `seo-transformation-2026` (2026-05)
Crawl foundation (robots.txt, sitemap, llms.txt), per-route `<head>` injection,
LocalBusiness/Review/FAQ/Organization/Person schema, self-hosted fonts, heading
hierarchy fix, homepage FAQ section, BLUF hero rewrite, owner attribution.

### Pass 2 — city, blog, and media build-out
15 city pages, 9 blog posts with per-post FAQs, video showcase, gallery
manifest, 404 page, asset cache-poisoning guard, inlined critical CSS.

### Pass 3 — `zafe-platform-integration` (2026-08-02, this pass)

**Zafe platform**
- Shared `src/lib/zafeLead.ts`; contact form refactored onto it
- Chatbot with keyword support replies + a 3-step quote flow that captures a
  real lead with the full transcript
- `navigator.webdriver` guard on the page-view beacon so automated traffic
  stops counting as visits

**Technical SEO**
- `meta robots` with `max-image-preview:large, max-snippet:-1`
- robots.txt expanded to 16 crawlers + `Content-Signal`; the drifted duplicate
  copy in the Pages middleware eliminated
- `og:type=article` + `article:*` tags on blog posts
- Per-post 1200×630 OG cards (all nine posts previously shared one image)
- Real per-post sitemap `lastmod`
- geo meta, `rel=sitemap`, `<main>` landmark, shared visible Breadcrumbs

**New pages (28 → 36)**
- 4 service pages + `/services` hub with Service/Offer/ItemList schema
- `/about` with `AboutPage` → Person binding
- `/privacy-policy` and `/terms-of-service`

---

## 🔴 P0 — Blocking, not code

These outrank every remaining engineering task. None of them are changes to
this repo.

### 1. Claim / verify Google Business Profile
For a local trade, GBP drives more traffic than the entire website. It's what
populates the 3-pack for "near me" queries — the highest-intent query class
this business has. **Effort:** S, plus 1–3 weeks verification. **Impact:** Very High.

### 2. Confirm a verified street address
Gates full `LocalBusiness` schema and GBP local-pack eligibility. A home or
shop address works and can be hidden on GBP. Currently schema falls back to
Wichita Falls city-center coordinates. **Effort:** XS. **Impact:** High.

### 3. Deploy, then submit the sitemap
GSC + Bing Webmaster Tools, then request indexing. None of the work above does
anything until this happens. **Effort:** XS. **Impact:** Required.

### 4. Confirm three factual claims
Now amplified into schema and `llms.txt`, so accuracy matters more than it did:
- **TxDOT relationship** — soften the wording if it's informal
- **Business hours** — `Mo-Sa 07:00-19:00` is still an assumption
- **"Most spring jobs within 24 hours"** — now on a page targeting emergency queries

**Effort:** XS. **Impact:** Risk reduction.

---

## 🔥 P1 — High impact

### 1. Full SSG / prerender
The last structural SEO issue. Body prose is React-rendered, so non-JS crawlers
(most AI engines) see metadata and schema but not the narrative copy. Options:
`vite-react-ssg`, or port to Astro as 5C Containers is built.
**Effort:** L. **Impact:** High, and rising as AI search share grows.

### 2. Link city pages → service pages
A visitor on `/service-areas/vernon` with a broken spring has no direct path to
`/services/garage-door-spring-repair`. Highest-value internal-linking fix left.
**Effort:** S. **Impact:** Medium-High.

### 3. Gallery image dimensions
Extract `width`/`height` at build and emit them on gallery `<img>` tags. CLS
risk on `/work`. Open since the original audit. **Effort:** S. **Impact:** Medium (CWV).

### 4. Review velocity on Google
Google reviews decide local pack ranking; the 5 existing reviews are Facebook.
Text the review link at job completion. Target 2–4/month.
**Effort:** S ongoing. **Impact:** Very High for local.

### 5. Tier 1 citations
Bing Places, Apple Business Connect, BBB, Yelp; audit that the Facebook NAP
matches byte-for-byte. **Effort:** S. **Impact:** Medium-High.

### 6. Fill in real credentials on `/about`
Founding year, license/vendor numbers, insurance carrier, years of experience.
Deliberately omitted rather than invented — but real credentials outperform any
copy change. **Effort:** XS once confirmed. **Impact:** Medium-High (E-E-A-T).

### 7. "Repair vs replace" comparison page
The one keyword intent with no page of its own, and it's high-purchase-intent.
**Effort:** M. **Impact:** Medium-High.

---

## 🛠 P2 — Medium

1. **Wind load rating content** — regionally relevant, currently absent sitewide
2. **Panel style / material deep-dive** — mentioned but never explained
3. **Outbound authoritative links** — manufacturer spec sheets, CPSC safety
   guidance, TxDOT. Cheap trust signal, currently zero
4. **`speakable` schema** on FAQ blocks
5. **Backlink outreach** — builder/GC partner pages, manufacturer dealer
   listings, barndominium communities. Target 1–2 quality links/month
6. **Tier 2/3 citations** — Angi, HomeAdvisor, Thumbtack, Nextdoor, chambers
7. **Image audit script** asserting every image ≤500 KB and has dimensions
8. **More blog posts** targeting the ⚠️ questions in `01-research.md` §3
9. **`.gitignore` the `src/Gallery/` PNG dump** — repo bloat, not deployed

---

## 🌱 P3 — Ongoing

1. **Re-run this audit every 90 days.**
2. **Monitor the one cannibalization risk** — `/services/garage-door-repair` vs
   `/services/garage-door-spring-repair`. If they trade positions on the same
   query in GSC, differentiate harder or merge.
3. **Content refresh cadence** — new project photos monthly; add FAQs as real
   customer questions come in.
4. **Quarterly competitor SERP check** once `01-research.md` §1 has real data.
5. **Keep schema honest** — if reviews are added to `src/seo/site.ts`, they must
   also be displayed. `reviewCount` must equal the visible review count.

---

## What this audit still could not do

- **No live URL measured.** No Lighthouse, PSI, Core Web Vitals, or Rich Results
  Test has ever been run against production. All performance claims are static
  analysis. `09-validation.md` is the post-deploy checklist.
- **No web access or keyword tooling.** No search volume, no SERP composition,
  no backlink profile, no competitor data. Everything in `01-research.md` §1 is
  marked **[needs tool]** rather than estimated.
- **No GSC data.** No impressions, CTR, or indexed-page count.
- **Zafe lead capture is unproven end-to-end in production.** Testing
  intercepted the endpoint deliberately so it wouldn't create junk leads in the
  client's live dashboard. One real submission through each of the form and the
  chatbot still needs to be confirmed post-deploy.
