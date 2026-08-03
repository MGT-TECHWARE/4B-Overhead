# Content Audit — 4B Overhead Doors

**Updated:** 2026-08-02

---

## Inventory

| Type | Count | Avg depth | Unique body copy? |
|---|---|---|---|
| Service pages | 4 | ~600–800 words + 4 FAQs each | ✅ hand-written per service |
| City pages | 15 | ~400–600 words | ✅ per-city local angle, not templated |
| Blog posts | 9 | long-form, structured blocks | ✅ |
| Core routes | 8 | varies | ✅ |

Total: 36 indexable pages, up from 2 at the original baseline.

---

## E-E-A-T assessment

| Signal | Status | Evidence |
|---|---|---|
| **Experience** | ✅ Strong | 70+ real project photos on `/work`, all of the company's own jobs. City copy references specific local geography (Sheppard AFB, Seymour Highway, Wilbarger County ranches) that only someone working the area would write. |
| **Expertise** | ✅ Good | Service and blog copy explains mechanism, not just symptoms — spring cycle ratings, why the opener strips gears on a broken spring, R-value tradeoffs. |
| **Authoritativeness** | ⚠️ Weak off-site | On-site identity is solid (named operator, Person schema, About page). Off-site is the gap: no backlinks, GBP status unknown. See `06-authority-audit.md`. |
| **Trust** | ✅ Good | Real named reviews with dates matching visible content, "fully insured" stated consistently, privacy/terms pages now exist, phone number everywhere. |

**Biggest E-E-A-T improvement this pass:** `/about` binds a real named human to
the business via `AboutPage.mainEntity` → Person. Previously Colten appeared
only in a footer line and inside a customer review.

**Biggest remaining E-E-A-T gap:** no verifiable credentials anywhere. No
founding year, no license or vendor number, no insurance carrier, no years of
experience. These were deliberately left out rather than invented — but they
should be filled in. Real credentials are worth more than any copy change.

---

## Intent match

| Page group | Intent served | Match |
|---|---|---|
| `/services/*` | Transactional | ✅ each opens with what it is, includes pricing guidance and a quote CTA |
| `/service-areas/*` | Local transactional | ✅ but see the linking gap in `03-onpage-audit.md` |
| `/blog/*` | Informational | ✅ answers the question before selling |
| `/about` | Trust/brand | ✅ |
| `/work` | Evaluation | ✅ visual proof |

No page is targeting an intent it can't satisfy.

---

## Thin content

Assessed against the "would a human find this page worth landing on" test:

- **Service pages:** not thin. Each has a distinct includes list, symptom list,
  pricing paragraph, and 4 unique FAQs.
- **City pages:** the risk area, since 15 pages share a structure. Mitigated by
  real population/county/coordinates, 2–3 named nearby communities, and a
  hand-written local angle per city. Paducah (pop. ~1,100) is the thinnest —
  genuinely little to say about it — but it's still factually specific rather
  than a mad-lib.
- **Policy pages:** intentionally short; that's appropriate for the type.

**Verdict:** no page is thin enough to warrant `noindex`. Watch the smallest
city pages if Google ever signals doorway-page concerns.

---

## Cannibalization

Checked for pages competing for the same query:

| Risk pair | Assessment |
|---|---|
| `/services/garage-door-repair` vs `/services/garage-door-spring-repair` | ⚠️ **Real but managed.** Spring repair is a subset of repair. Mitigated by distinct titles, distinct H1s, and the repair page treating springs as one symptom among many while the spring page owns the emergency query. Monitor in GSC — if they trade positions on the same query, merge or differentiate harder. |
| `/services/garage-door-repair` vs `/blog/garage-door-wont-open` | ✅ Different intent — one sells a service, one diagnoses. They cross-link. |
| `/services/residential-garage-doors` vs `/blog/garage-door-cost-texas` | ✅ Service page targets "installation", blog targets "cost". |
| Home vs `/services` hub | ⚠️ Mild overlap — both summarize all services. Home is the brand/local page; `/services` is the cluster hub. Acceptable, but don't let the home page start targeting service keywords directly. |

---

## Originality

- All body copy is written for this business — nothing spun or duplicated from
  a competitor or a template site
- All 70+ project photos are the company's own work
- All 5 reviews are real, attributed, dated, and displayed visibly (which is
  what makes them schema-eligible)
- Pricing statements are ranges phrased consistently with the homepage FAQ, so
  no page contradicts another

---

## Content accuracy risks

Flagged because SEO copy that overclaims is a liability, not an asset:

1. **"TxDOT projects"** is repeated across the site and is now amplified in
   schema and llms.txt. If that relationship is informal or one-off, soften it.
2. **"Most spring jobs completed within 24 hours"** is a specific promise. It
   matches the existing homepage FAQ, so it isn't new — but confirm it's still
   true before it appears on a dedicated page ranking for emergency queries.
3. **Hours `Mo-Sa 07:00-19:00`** in schema are an assumption carried from the
   original audit. Still unconfirmed.

---

## Action items

- [ ] Confirm or soften the TxDOT claim (P1 — it's in schema now)
- [ ] Confirm published hours; update `BUSINESS.hours`
- [ ] Add founding year, license/vendor numbers, insurance carrier to `/about`
- [ ] Add a "repair vs replace" comparison page — the one uncovered intent
- [ ] Add wind-load-rating content; it's regionally relevant and absent
- [ ] Link city pages → service pages
