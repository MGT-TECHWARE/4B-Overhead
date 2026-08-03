# Off-Page / Authority Audit — 4B Overhead Doors

**Updated:** 2026-08-02

> **Scope limitation.** No web access, no backlink tooling, no GSC. Nothing
> here is measured link data. This is an inventory of what the codebase reveals
> plus a prioritized plan. Items needing live data are marked **[needs tool]**.

---

## Current signal inventory (observable from the repo)

| Signal | Status | Notes |
|---|---|---|
| Facebook page | ✅ Exists | `facebook.com/4BGarageDoors`, with real reviews. Linked in schema `sameAs`. |
| Reviews | ⚠️ 5 visible, all Facebook | Real, named, dated, 5★. In schema as `Review` + `aggregateRating`. |
| Google Business Profile | ❓ **Unknown** | Not referenced anywhere in the repo. This is the single most important unknown in the entire audit. |
| Google reviews | ❓ Unknown | None referenced. |
| Backlinks | **[needs tool]** | Assume near-zero for a site this new. |
| Directory citations | **[needs tool]** | No Yelp/BBB/Angi/HomeAdvisor presence referenced anywhere. |
| Physical address | ❌ None published | `BUSINESS` has no `PostalAddress`; schema falls back to Wichita Falls coordinates. |
| Named operator | ✅ Colten Beaty | Now a `Person` entity with an `/about` page. |
| Notable client | ✅ TxDOT | Strong differentiator — *if* accurate. See `04-content-audit.md`. |

---

## The two blockers

Everything else on this page is secondary to these:

**1. Google Business Profile.** For a local trade, GBP is a bigger traffic lever
than the entire website. It's what populates the 3-pack for "garage door repair
near me" — the highest-intent query class that exists for this business. If it
doesn't exist, creating and verifying it (postcard, 1–3 weeks) is the highest-ROI
action available. If it exists but is unclaimed, claim it.

**2. A verified street address.** Full `LocalBusiness` schema and GBP both want
one. Without it the business is service-area-only, which limits local pack
eligibility. A home or shop address works — it can be hidden on GBP while still
establishing the service area.

Neither is a code change. Both outrank any further on-site work.

---

## Citation / NAP targets

Name, Address, Phone must match **byte-for-byte** across every listing.
Canonical form, from `src/seo/site.ts`:

```
Name:  4B Overhead Doors, LLC
Phone: (940) 781-1186
Email: 4boverheaddoorsllc@gmail.com
Area:  West Texas, North Texas, Texas Panhandle, Red River region
```

**Tier 1 — do first (free, high trust)**
- Google Business Profile
- Bing Places
- Apple Business Connect
- Facebook (exists — audit that NAP matches exactly)
- Better Business Bureau
- Yelp

**Tier 2 — trade directories**
- Angi, HomeAdvisor, Thumbtack, Porch
- Nextdoor (unusually effective for local trades)
- IDA (International Door Association), if membership applies

**Tier 3 — local**
- Wichita Falls Chamber of Commerce
- Chambers for Vernon, Burkburnett, Decatur, Weatherford
- TxDOT vendor listings, if the relationship supports it

---

## Link-building angles

Realistic for a one-operator trade business — no guest-post farms, no paid links:

1. **Supplier / manufacturer pages.** Door and opener manufacturers often list
   installing dealers. Free, relevant, and topically perfect.
2. **Builder and GC partners.** The site already says 4B works with builders on
   new construction. Those builders have websites with subcontractor or partner
   pages. Ask.
3. **Barndominium / metal building communities.** There's already a
   barndominium blog post; that niche has active regional blogs and forums.
4. **Local news and regional press.** Storm-damage cleanup coverage is a
   recurring seasonal hook in this part of Texas.
5. **Sponsorships.** Youth sports, FFA, county fairs — small local sponsorships
   routinely come with a link and are cheap in these markets.

Target 1–2 quality links a month. Volume is not the goal; a single link from a
regional builder is worth more than fifty directory submissions.

---

## Review strategy

Currently 5 Facebook reviews and an unknown number of Google reviews. Google
reviews are what drive local pack ranking; Facebook reviews mostly don't.

- Ask every customer at job completion, when satisfaction is highest
- Send the direct Google review link by text before leaving the driveway —
  friction is what kills review rates, not willingness
- Target 2–4 new Google reviews per month; steady velocity beats a burst
- Respond to every review, including negative ones
- Never incentivize — it violates Google's policy and risks the profile

When Google reviews accumulate, update `REVIEWS` in `src/seo/site.ts` so schema
`aggregateRating` reflects reality. **The schema must match what's visibly
displayed on the page** — `reviewCount` and the number of visible `Review`
nodes have to agree, or the markup is invalid.

---

## 30-day plan

| Week | Action | Owner |
|---|---|---|
| 1 | Claim/verify GBP. Confirm street address. Confirm TxDOT wording and business hours. | Business |
| 1 | Deploy; submit sitemap to GSC + Bing Webmaster Tools | Dev |
| 2 | Tier 1 citations (Bing, Apple, BBB, Yelp); audit Facebook NAP | Business |
| 2 | Run `09-validation.md` post-deploy checks against the live URL | Dev |
| 3 | Tier 2 + 3 citations; contact 3 builder partners about listings | Business |
| 3 | Add license numbers / founding year to `/about` once confirmed | Dev |
| 4 | Start the review ask on every job; measure velocity | Business |
| 4 | First GSC read — impressions, indexed count, any coverage errors | Dev |

---

## What to expect

- **Weeks 1–4:** indexing. Pages appear in `site:` results. Little ranking
  movement — this is normal and not a signal of failure.
- **Months 2–3:** long-tail city and blog queries start showing impressions in
  GSC. GBP (if newly created) begins surfacing for near-me queries.
- **Months 3–6:** service pages compete for their target queries. Review count
  becomes the deciding variable in the local pack.
- **Months 6–12:** metro queries (Fort Worth, Dallas, Denton) become plausible
  only if backlinks and reviews materialized. Without them, the near-market
  cities are where the wins are.

Anyone promising faster than this for a new domain in a competitive trade is
guessing.
