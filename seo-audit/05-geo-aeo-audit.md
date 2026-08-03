# GEO / AEO Audit — 4B Overhead Doors

**Updated:** 2026-08-02

GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization): being
retrievable and citable by AI search — ChatGPT Search, Perplexity, Claude,
Google AI Overviews — rather than only by classic blue-link ranking.

---

## Objective

When someone asks an AI engine *"who repairs garage door springs near Wichita
Falls?"* or *"how much does a new garage door cost in Texas?"*, the answer
should be able to cite this site. That requires three things the site did not
originally have: content the crawler can read without executing JS, content
chunked into directly-quotable answers, and a stable machine-readable identity.

---

## What is in place

### 1. Metadata and schema reach non-JS crawlers ✅ (partial)

The site is a client-rendered React SPA. Most AI crawlers do not execute JS,
so anything rendered only by React is invisible to them.

`scripts/post-build.mts` generates static HTML per route, so **every one of the
36 pages ships its title, description, canonical, OG/article tags, and the full
JSON-LD `@graph` in the raw HTML response** — no JS required.

⚠️ **Honest limitation:** the *body text* is still React-rendered. An AI crawler
that doesn't execute JS sees the metadata and the complete schema graph
(including every FAQ question and answer, the reviews, and the service
descriptions) but not the visible prose. The FAQ and service content is
therefore reachable via schema; the narrative body copy is not. Full SSG is
still the fix, and it remains the top P2 item.

### 2. BLUF structure on every commercial page ✅

Each page opens with a complete factual sentence naming business, service, and
region. AI engines retrieve the opening chunk; taglines aren't quotable.

### 3. FAQ schema on every money page ✅

| Page group | FAQ blocks |
|---|---|
| Home | 8 Q&A |
| Each service page | 4 Q&A each (16 total) |
| Blog posts | per-post FAQs where relevant |

All FAQ accordions keep answers in the DOM and toggle visibility with CSS, so
the crawler-visible text matches the `FAQPage` JSON-LD exactly. That parity is
a Google requirement, not a nicety.

### 4. Comprehensive entity schema ✅

The `@graph` per page composes: `Organization`, `Person` (Colten Beaty),
`WebSite`, `LocalBusiness` + `HomeAndConstructionBusiness` (with
`aggregateRating`, 5 real `Review` nodes, 4 `makesOffer` services),
`WebPage`, `BreadcrumbList`, plus page-specific `Service`, `AboutPage`,
`ItemList`, `Blog`, `BlogPosting`, and `FAQPage` nodes.

All `@id`s are stable URI-style anchors (`#organization`, `#business`,
`#colten-beaty`, `#website`), so cross-references resolve across pages and the
engine can build one coherent entity rather than 36 disconnected businesses.

### 5. `llms.txt` ✅

Generated at build from the live route/service/city/post tables, so it can't
drift from the sitemap. Contains the business summary, owner, phone, service
area, all 4 services, all 36 pages, and the policy links.

### 6. AI-crawler allowlist ✅

`public/robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User,
ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User,
Google-Extended, GoogleOther, Applebot, Applebot-Extended, Meta-ExternalAgent,
CCBot, and Bytespider — many honor only User-agent-specific rules, not the
wildcard. `Content-Signal: search=yes,ai-train=no` declares the posture.

`functions/_middleware.js` re-serves that same file so a `*.pages.dev` domain
can't hand crawlers Cloudflare's deny-all substitute.

### 7. Fact density ✅

Specific, checkable facts beat adjectives for citation: spring cycle ratings
(10,000 vs 25,000–100,000), double-door weight (150–400 lb), real city
populations and counties, real coordinates, named nearby communities, dated
named reviews.

### 8. Chunk-friendly formatting ✅

Short paragraphs, bulleted includes/symptom lists, Q&A blocks, descriptive
subheads. Each chunk stands alone when lifted out of context — which is exactly
how retrieval works.

### 9. Stable business identity ✅

Name, phone, region, and owner are stated identically everywhere — components,
schema, and llms.txt all read from `src/seo/site.ts`. There is one canonical
spelling of the business, which is what lets an engine merge mentions into one
entity.

---

## What an AI crawler finds today

Fetching `https://4boverheaddoors.com/services/garage-door-spring-repair`
without executing JS yields:

- Title, description, canonical, robots directives, geo meta
- Full `@graph`: Organization, Person, WebSite, LocalBusiness (with rating and
  5 reviews), WebPage, BreadcrumbList, Service (with provider, areaServed,
  offer catalog), FAQPage with all 4 Q&A pairs
- `llms.txt` one hop away, listing every page on the site

That is enough to answer "who does this, where, and what do they charge" and
attribute it — which is the bar for citation.

---

## What still needs to happen

**On-site**
- [ ] **Full SSG/prerender** so body prose is in the HTML, not just schema.
      Biggest single remaining GEO win.
- [ ] Add `speakable` schema on the FAQ blocks

**Off-site** (AI engines weight third-party corroboration heavily — they will
not cite a business that exists only on its own domain)
- [ ] Google Business Profile — also the primary local-pack lever
- [ ] Consistent NAP on Yelp, BBB, Angi, HomeAdvisor, Chamber of Commerce
- [ ] Review velocity on Google, not just Facebook

The off-site items are covered in `06-authority-audit.md`. They matter more for
AI citation than any further on-site tuning at this point.
