# Validation — Pre-deploy

This file captures every check that *can* be run from the codebase without the live URL. Live-URL checks (Lighthouse, PSI, Rich Results Test, indexed-page count) are the post-deploy follow-up.

## Build artifacts present

```
dist/
├── _redirects                ← unchanged SPA fallback
├── apple-touch-icon.png
├── favicon-16.png
├── favicon-32.png
├── favicon.ico
├── icon-192.png
├── icon-512.png
├── index.html                ← home, with route-specific <head>
├── llms.txt                  ← NEW
├── og-image.jpg
├── robots.txt                ← NEW
├── site.webmanifest          ← NEW
├── sitemap.xml               ← NEW (build-time)
├── work/
│   └── index.html            ← NEW (per-route)
└── assets/                   ← Vite hashed bundles + images (unchanged structure)
```

## Per-route `<head>` differentiation

| Field | `/` | `/work` |
|---|---|---|
| `<title>` | "Garage Door Repair & Install — West & North TX \| 4B Overhead" (61 chars) | "Our Work — Texas Garage Door Projects \| 4B Overhead Doors" (57 chars) |
| Canonical | `https://4boverheaddoors.com` | `https://4boverheaddoors.com/work` |
| og:url | matches canonical | matches canonical |
| Description | service + region + phone CTA | gallery-focused with region |
| JSON-LD `@graph` nodes | Organization, Person, WebSite, LocalBusiness, WebPage, **FAQPage** | Organization, Person, WebSite, LocalBusiness, WebPage |

## Schema integrity

- All node `@id`s are URI-style and stable across routes (`#organization`, `#business`, `#colten-beaty`, `#website`).
- Cross-references (`founder` → Person, `parentOrganization` → Organization, `worksFor` → Organization) all resolve within the graph.
- `aggregateRating.reviewCount` (3) matches the number of `Review` nodes (3) — required for valid AggregateRating.
- Each `Review.author` name + `datePublished` matches the visible content in `Home.tsx` reviews section.
- `FAQPage.mainEntity` count (8) matches the `FAQS` array length, which is also the source of the visible accordion.

## To run after deploy (post-deploy validation)

1. **Google Rich Results Test** on `https://4boverheaddoors.com/` and `/work`. Expect detection of: Organization, LocalBusiness, BreadcrumbList, FAQPage (home only), Review snippets.
2. **Schema.org Validator** — paste the JSON-LD; expect zero errors.
3. **PageSpeed Insights** mobile + desktop on both routes. Capture: LCP, INP, CLS, TTFB, FCP. Compare against the "Tier 2" targets (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, TTFB < 800ms).
4. **Lighthouse CLI**: `npx lighthouse https://4boverheaddoors.com/ --preset=desktop --output=html --output-path=seo-audit/reports/lh-home-desktop.html` (mobile too).
5. **Mobile-Friendly Test** (Google Search Console).
6. **`curl -I`** each route — verify canonical header consistency, no redirect chains, 200 status.
7. **`curl -s` with no JS** — verify the canonical, title, description, and JSON-LD are present in the raw HTML response.
8. **Submit `sitemap.xml`** in Google Search Console and Bing Webmaster Tools; request indexing on both routes.
9. **`site:4boverheaddoors.com`** in Google to confirm both pages indexed (usually within 1-7 days post-submit).
10. **Rerun this whole audit in 90 days** to capture ranking + impression changes.

## Known unknowns / blockers

- The production URL `https://4boverheaddoors.com` is an *assumption*. If the real domain differs, edit `SITE_URL` in `src/seo/site.ts` and re-run `npm run build`. Everything (canonical, OG, sitemap, schema, llms.txt link bodies) reads from this constant.
- `BUSINESS.geoCenter` is set to Wichita Falls coordinates as a fallback. Replace with a verified street address once available — required for full LocalBusiness rich result eligibility.
- TxDOT mention is repeated from the existing site copy; if the relationship is informal, soften the wording.
- Hours `Mo-Sa 07:00-19:00` are an assumption — replace with published hours once known.
