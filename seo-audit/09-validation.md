# Validation Report

**Updated:** 2026-08-02

Everything that can be verified from the codebase, plus the post-deploy
checklist for everything that can't.

---

## Part 1 — Verified pre-deploy ✅

### Build output

```
dist/
├── index.html                     ← home
├── 404.html                       ← noindex
├── robots.txt  sitemap.xml  llms.txt  site.webmanifest
├── og-image.jpg                   ← sitewide social card
├── og/<slug>.jpg × 9              ← per-post cards, 1200×630
├── about/  privacy-policy/  terms-of-service/
├── work/  service-areas/  blog/  services/
├── services/<slug>/ × 4
├── service-areas/<slug>/ × 15
├── blog/<slug>/ × 9
└── assets/                        ← hashed bundles, images, fonts
```

**36 `index.html` files.** Baseline was 2.

### Automated checks run

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ clean |
| `npm run build` | ✅ clean |
| All 36 pages parse valid JSON-LD | ✅ |
| Every `@graph` non-empty | ✅ |
| Every page has a non-empty `<title>` | ✅ |
| Every page has `<link rel="canonical">` | ✅ |
| Every page has `<meta name="robots">` | ✅ |
| Every `Service` node has a `provider` | ✅ 4/4 |
| `/about` carries `AboutPage` | ✅ |
| OG card dimensions | ✅ exactly 1200×630 |
| `navigator.webdriver` guard present | ✅ all 28 pages at the time of that pass |

### Schema types emitted

`Organization`, `Person`, `WebSite`, `LocalBusiness`+`HomeAndConstructionBusiness`,
`WebPage`, `BreadcrumbList`, `Service`, `AboutPage`, `ItemList`, `Blog`,
`BlogPosting`, `FAQPage`.

### Schema integrity

- All `@id`s are stable URI anchors; cross-references (`founder` → Person,
  `worksFor` → Organization, `provider` → LocalBusiness) resolve within the graph
- `aggregateRating.reviewCount` (5) equals the number of `Review` nodes (5)
- Each `Review.author` and `datePublished` matches visible homepage content
- `FAQPage.mainEntity` counts match their source arrays (8 home, 4 per service)

### Zafe integration — verified in Chromium

Driven against the real production build. **Both Zafe endpoints were
intercepted**, deliberately, so no test lead reached the client's live
dashboard. **27/27 checks passed:**

- Chatbot: launcher opens panel; 7 intent-routing cases correct, including the
  `"where do you install?"` → service-area ordering trap
- Quote flow: exactly one lead submitted, correct `publicKey`, `type: 'chat'`,
  phone routed to `phone` (not `email`), honeypot empty, 22-message transcript
  attached
- Contact form: fires its Zafe lead **even when `/api/contact` returns 500** —
  confirms the fire-and-forget ordering
- Page-view beacon correctly suppressed under automation

### UI

- Breadcrumbs render correctly on `/work` and blog posts, with the current page
  as plain text
- Chat panel renders correctly at 1280×720 and 390×844 with no clipping
- Chat launcher no longer overlaps footer policy links (verified by bounding box)

---

## Part 2 — Post-deploy checklist ⬜

Nothing below has been run. All of it requires the live URL.

### Immediately after deploy

1. ⬜ `curl -I` each route type — expect 200, no redirect chains
2. ⬜ `curl -s https://4boverheaddoors.com/robots.txt` — confirm the middleware
   serves the **expanded 16-crawler** version, not a stale copy. This is the
   highest-risk item in this pass: the middleware now reads through the ASSETS
   binding rather than a hardcoded string, so a binding failure would silently
   fall through to static serving. Verify the content is what you expect.
3. ⬜ `curl -s` a blog post with no JS — confirm title, canonical, `og:type=article`,
   and JSON-LD are all in the raw HTML
4. ⬜ Confirm `https://4boverheaddoors.com/og/garage-door-cost-texas.jpg` loads
5. ⬜ Submit one real lead through **both** the contact form and the chatbot;
   confirm both land in the Zafe Leads inbox. *This is the one thing testing
   could not prove, because the endpoint was intercepted on purpose.*

### Search Console / Bing

6. ⬜ Submit `sitemap.xml` to GSC and Bing Webmaster Tools
7. ⬜ Request indexing on `/`, `/services`, and the 4 service pages
8. ⬜ Check Coverage for excluded/error URLs
9. ⬜ `site:4boverheaddoors.com` after 7 days — expect pages appearing

### Structured data

10. ⬜ Rich Results Test on `/`, a service page, a city page, and a blog post.
    Expect: LocalBusiness, Organization, BreadcrumbList, FAQPage, Service,
    BlogPosting, Review snippets
11. ⬜ Schema.org Validator — expect zero errors
12. ⬜ Facebook Sharing Debugger + X Card Validator on a blog post — confirm the
    per-post OG card renders, not the sitewide one

### Performance

13. ⬜ PageSpeed Insights, mobile + desktop, on `/`, `/work`, and a service page.
    Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, TTFB < 800ms
14. ⬜ Lighthouse CLI:
    `npx lighthouse https://4boverheaddoors.com/ --preset=desktop --output=html --output-path=seo-audit/reports/lh-home-desktop.html`
15. ⬜ Watch CLS specifically on `/work` — gallery images still lack intrinsic
    dimensions, which is the known open CWV issue

### Ongoing

16. ⬜ First GSC impressions read at 30 days
17. ⬜ Watch `/services/garage-door-repair` vs `/services/garage-door-spring-repair`
    for cannibalization — if they trade positions on one query, differentiate
18. ⬜ Re-run this whole audit in 90 days

---

## Known unknowns

| Unknown | Impact | Owner |
|---|---|---|
| Google Business Profile status | **Highest** — gates local pack | Business |
| Verified street address | Gates full LocalBusiness schema + GBP | Business |
| TxDOT relationship formality | Now amplified in schema and llms.txt | Business |
| Published business hours | `Mo-Sa 07:00-19:00` is an assumption in schema | Business |
| Live Core Web Vitals | All performance claims are static analysis | Dev, post-deploy |
| Backlink profile / competitor SERPs | No tooling available this session | Dev, needs tools |
