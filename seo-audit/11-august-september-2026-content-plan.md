# August–September 10, 2026 blog expansion

Research and implementation date: September 10, 2026. Eight articles added to the nine existing posts. August dates are editorial backfill requested by the owner, not evidence of historical deployment. All new articles have September 10 as their updated date. No deployment was performed as part of this content edit.

## Evidence and priorities

The supplied screenshot is the first-party prioritization source. Its reporting dates, device/country filters, and full truncated query strings are unavailable. Average positions are observations from that report, not guaranteed current rankings. No search-volume or keyword-difficulty estimates were purchased or invented.

- Weatherford has over 1,000 service-page impressions, zero clicks, and average position 29.7. It is the main opportunity for useful supporting content and links to an existing local service page.
- “door replacement parker county” has 62 impressions, zero clicks, position 15.2. The related installation query has 68 impressions and position 14.6, though its full wording is truncated. A replacement-quote guide supports this commercial intent without creating another competing service page.
- Commercial door repair in Weatherford improved from 59.4 to 19.8 in the ranking-moves section. Search results mix overhead-door service with pedestrian-entry/locksmith service, so the article explicitly defines its scope.
- Clopay service and installation queries declined in the screenshot. A model-specific panel-replacement explainer addresses owners' questions without claiming an unverified authorized-dealer relationship.
- Springtown has 109 page impressions, one click, position 13.0; Decatur has 178, one click, position 12.0. A shared provider-selection article supports both existing pages instead of producing two location-swapped articles.
- Wichita Falls has 253 service-page impressions, zero clicks, position 22.5. The September maintenance article supports that page with a seasonal planning intent.
- “garage door bumpers” is ambiguous, and the repository does not establish a dedicated bumper product/service. Defer a standalone article until the business confirms the component and service it actually offers.
- Existing cost, broken-spring, won't-open, insulation, heat, opener, and maintenance articles already cover broad topics. New posts focus on distinct decisions, symptoms, and preparation rather than rewording those articles.

## Market research

Live web searches performed September 10, 2026 for Weatherford residential/commercial repair; Springtown and Decatur repair; and manufacturer guidance on seals, sensors, panels, and maintenance. This is a qualitative result sample, not an exhaustive competitor audit or a local rank-tracking report.

- [Weatherford Garage Doors repair page](https://weatherfordgaragedoors.com/garage-door-repair/) targets direct local repair intent.
- [Texas Garage Door & Opener commercial Weatherford page](https://www.texasgaragedoorandopener.com/contact-us/commercial-garage-doors-weatherford/) has a dedicated commercial location offering.
- [Access Edge commercial door repair](https://accessedgelocksmith.com/services/commercial-door-repair/) illustrates the mixed entry-door/overhead-door intent in broad commercial repair searches.
- [Wise Overhead Door](https://www.wiseoverhead.com/) positions around Decatur and Wise County service.
- [OGD Springtown](https://ogd.com/tx/springtown/) has a dedicated local service page.

Inference: retain the existing service/city pages as the destination for hiring intent, and use practical articles to answer narrower questions and direct readers to those pages. Competitor pages establish positioning only; their pricing, credentials, response promises, and copy were not imported into 4B content.

## Editorial calendar and keyword map

Secondary phrases are natural-language coverage targets, not search-volume claims or a meta-keywords tag. Metadata already integrates with the site's canonical, BlogPosting, FAQ, social-image, sitemap, and llms.txt generation.

| Editorial date | Article slug | Primary target | Supporting phrases / intent | Main internal destinations |
| --- | --- | --- | --- | --- |
| Aug 4 | garage-door-repair-weatherford-service-call | garage door repair Weatherford TX | emergency repair availability; stuck door; repair estimate | Weatherford; broken spring guide; replacement guide |
| Aug 11 | garage-door-replacement-parker-county | garage door replacement Parker County | door installation Parker County; replacement quotes | Residential doors; Weatherford; Aledo; cost guide |
| Aug 18 | commercial-overhead-door-repair-weatherford | commercial overhead door repair Weatherford TX | commercial door repair; warehouse bay repair; industrial overhead doors | Commercial doors; Weatherford; commercial types guide |
| Aug 21 | garage-door-wont-close-afternoon-sun | garage door won't close in sunlight | afternoon sensor problem; safety sensor sunlight | Weatherford; Springtown; troubleshooting guide |
| Aug 25 | clopay-garage-door-panel-replacement-weatherford | Clopay garage door panel replacement Weatherford | Clopay replacement section; repair versus replacement | Repair service; Parker County replacement guide |
| Aug 28 | garage-door-weather-seal-replacement-north-texas | garage door weather seal replacement | bottom seal gap; garage door weatherstripping; dust under door | Decatur; Weatherford; repair service; maintenance guide |
| Sep 3 | choosing-garage-door-repair-springtown-decatur | garage door repair Springtown TX | garage door company Decatur TX; written repair estimate | Springtown; Decatur; repair service |
| Sep 10 | fall-garage-door-maintenance-wichita-falls | garage door maintenance Wichita Falls TX | fall garage door checklist; preventive maintenance | Wichita Falls; commercial doors; maintenance and seal guides |

## Technical references used in articles

- [Clopay service and replacement](https://www.clopaydoor.com/residential/buyingguide/service-and-replacement): damaged hardware and professional service.
- [Clopay seals guide](https://www.clopaydoor.com/residential/buyingguide/garage-door-seals): bottom, perimeter, and threshold distinctions.
- [Clopay FAQ](https://www.clopaydoor.com/common/garage-door-faq): replacement sections for models still manufactured.
- [Clopay damaged sections](https://www.clopaydoor.com/residential/support/service-support/repairing-damaged-garage-door-sections): manufacturer repair guidance.
- [LiftMaster sensor sunblocker](https://www.liftmaster.com/safety-sensor-sunblocker-kit/p/041B0873): sunlight interference and model compatibility.
- [LiftMaster safety guidance](https://www.liftmaster.com/about-liftmaster/safety): model-specific safety checks.
- [Overhead Door commercial operator manual](https://overheaddoor-production-assets.azureedge.net/assets/docs/default-source/general-products/commercial-operators/operator-rsx-egress.pdf?sfvrsn=a89f5627_3): equipment-specific service documentation, not a universal maintenance interval.

## Measurement after deployment

Record the actual deployment date. After indexing and a comparable reporting period, compare new article impressions/clicks and the linked service-page queries against the supplied baseline. Review Weatherford, Parker County replacement, commercial repair, Springtown, Decatur, and Wichita Falls separately. Track qualified calls/form submissions if attribution exists; impressions alone do not establish business value. Do not promise rankings or FAQ rich results.

Remaining limitation: the existing build generates per-route HTML heads but article bodies are client-rendered. This task adds content within that architecture; it does not implement server rendering or claim to resolve every indexing issue. Existing city-page CTR and technical indexing can require separate investigation even after these articles are deployed.

## Validation completed

- `npm run lint`: passed.
- `npm run build`: passed; generated all eight new route heads and social images.
- Content-integrity check: eight new dates in range, unique slugs, bodies present, title/description lengths, existing hero assets, valid related slugs, and every new article's internal link mapped to an emitted route.
- Output check: canonicals, parseable BlogPosting/FAQPage JSON-LD, social images, and sitemap entries present for every added article.
- `git diff --check`: passed.
- Visual browser review could not run: browser runtime reported no available browsers and discovery returned an empty list. No visual pass is claimed. Local preview: http://localhost:3001/blog.
