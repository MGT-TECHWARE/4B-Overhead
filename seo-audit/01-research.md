# Research & Intelligence — 4B Overhead Doors

**Updated:** 2026-08-02
**Branch:** `zafe-platform-integration`

> **Scope limitation, stated up front.** This session had no web access and no
> keyword tooling (Ahrefs / Semrush / DataForSEO / GSC). Nothing below is
> measured search volume or observed SERP data. It is an intent model built
> from the trade, the service area, and the site's own content. Every number
> that would require a tool is marked **[needs tool]** rather than guessed.
> Treat this as the hypothesis to validate, not as findings.

---

## 1. Competitive landscape

**[needs tool]** — no live SERP could be pulled. What to run once you have
access, in priority order:

1. `garage door repair wichita falls` — the core money query for the home market
2. `garage door installation fort worth` / `denton` / `abilene` — the metro
   queries where competition is heaviest and where 4B is the outsider
3. `commercial overhead door texas` — lower volume, far higher deal size
4. `garage door spring repair near me` from a Wichita Falls IP — the emergency
   query with the shortest decision window

For each, record: who holds the 3-pack, who holds organic 1–3, whether the
top organic results are national lead-gen aggregators (Angi, Networx,
Thumbtack) or actual local operators, and how many reviews the 3-pack holders
have. That last number is the single most useful competitive datapoint for a
local trade — it tells you the review count you have to clear.

**Structural expectation (to confirm, not assume):** in markets this size the
3-pack is usually held by operators with 40–200 Google reviews, and page one
organic is usually half aggregators. Aggregators are beatable on content depth
and losable on domain authority; local operators are the reverse.

---

## 2. Keyword intent map

Intent is what determines page type. Grouping by intent rather than by volume
is what keeps the site from building ten pages that all target the same SERP.

| Intent | Query shape | Page that should own it | Status |
|---|---|---|---|
| **Emergency / transactional** | "garage door spring broke", "door won't open", "same day garage door repair" | `/services/garage-door-spring-repair`, `/services/garage-door-repair` | ✅ built |
| **Commercial transactional** | "commercial overhead door installation", "warehouse door repair", "high cycle springs" | `/services/commercial-overhead-doors` | ✅ built |
| **Considered purchase** | "new garage door cost", "insulated vs non insulated", "best garage door for Texas heat" | `/services/residential-garage-doors` + blog buying guides | ✅ built |
| **Local** | "[city] garage door repair", "garage door company near me" | 15 × `/service-areas/<city>` | ✅ built |
| **Informational / top-funnel** | "how long do garage door springs last", "why is my garage door noisy" | 9 blog posts | ✅ built |
| **Brand / trust** | "4B Overhead Doors reviews", "who owns 4B Overhead Doors" | `/about`, homepage reviews | ✅ built |
| **Comparison** | "garage door repair vs replace", "chain vs belt drive opener" | partially — opener guide covers one | ⚠️ gap |

**The remaining gap:** comparison intent. "Repair or replace" is a high-intent
query from someone actively spending money, and right now it's answered inside
a service page rather than owning a page. Flagged to the action plan.

---

## 3. Question inventory (AEO targets)

These are the questions the pages need to answer verbatim to be citable. Ones
already covered by an FAQ block are marked ✅.

**Pricing**
- How much does a new garage door cost in Texas? ✅
- How much does it cost to replace a garage door spring? ✅
- Is it cheaper to repair or replace a garage door? ⚠️
- How much does a commercial overhead door cost? ✅
- Do you charge for estimates? ✅

**Springs / emergency**
- How do I know if my garage door spring is broken? ✅
- Can I use my garage door with a broken spring? ✅
- Why can't I replace a garage door spring myself? ✅
- If one spring breaks should I replace both? ✅
- How long do garage door springs last? ⚠️ (in blog body, not an FAQ)

**Buying**
- Do I need an insulated garage door in Texas? ✅
- What's the best garage door for Texas heat? ✅
- What size garage door do I need for a shop / barndominium? ✅
- How long does installation take? ✅
- Can you match a door to my house style? ✅

**Openers**
- Chain vs belt drive — which is better? ✅
- Why does my opener run but the door doesn't move? ✅
- Can you program my remote and keypad? ✅

**Service / logistics**
- What areas do you serve? ✅
- How fast can you get here? ✅
- Are you licensed and insured? ✅
- Do you work with builders on new construction? ✅
- Do you repair doors you didn't install? ✅
- Who actually shows up — you or a subcontractor? ✅

**Maintenance**
- How often should a garage door be serviced? ✅
- What maintenance can I do myself? ⚠️
- Why is my garage door so loud? ⚠️

---

## 4. Semantic entities to cover

Topical authority comes from covering the entity graph around the subject, not
from repeating the head keyword. Entities this site should mention naturally
and mostly does:

**Components** — torsion spring, extension spring, cable drum, roller, hinge,
track, strut, bottom seal, weather stripping, safety sensor, logic board,
trolley, jackshaft operator, high-cycle spring.

**Materials / specs** — steel gauge, R-value, insulated vs non-insulated,
polystyrene vs polyurethane, wind load rating, panel style (raised, flush,
carriage house, full-view).

**Geography** — Wichita Falls, Wilbarger County, Red River, Texas Panhandle,
Sheppard Air Force Base, TxDOT, North Texas, West Texas, and the 15 city pages.

**Situational** — new construction, barndominium, metal building, shop door,
warehouse, fleet building, estate/rental turnover.

**Coverage gaps:** wind load rating is mentioned nowhere, and it matters in
this part of Texas. Bottom seal / weather stripping only appears in passing.

---

## 5. What "good" looks like for this business

The realistic ceiling is not "rank #1 for garage door repair in Dallas" — 4B
is a one-operator business competing there against companies with fleets and
ad budgets. The realistic wins, in order of expected return:

1. **Google Business Profile + review velocity** in the Wichita Falls core
   market. This outranks everything else on this list combined for local pack
   visibility, and it is not a website change.
2. **Own the near-market city queries** (Vernon, Seymour, Olney, Jacksboro,
   Decatur) where competition is thin and the city pages have a real shot.
3. **Own the commercial/TxDOT niche** — very few residential-focused
   competitors write seriously about high-cycle springs and rolling steel.
4. **AI citation** via FAQ + llms.txt + explicit crawler allowlist. Cheap,
   already built, and compounding as AI search share grows.
5. Metro organic (Fort Worth, Dallas, Denton) is a long game and probably
   never a 3-pack win without a physical address there. Treat those city pages
   as long-tail catchers, not as primary targets.

---

## 6. To validate once tooling is available

- [ ] Real search volume for every query class in §2
- [ ] Actual SERP composition — aggregator vs local operator split
- [ ] Review counts of the current 3-pack holders per city
- [ ] Whether a Google Business Profile currently exists for 4B, and its status
- [ ] Current indexed page count (`site:4boverheaddoors.com`)
- [ ] Backlink profile and referring domains
- [ ] GSC impressions/CTR once the site has 90 days of data post-launch
