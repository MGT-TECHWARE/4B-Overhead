/**
 * Service landing-page data. Each entry produces a /services/<slug> page with
 * a unique <title>, <meta description>, canonical, Service + Offer JSON-LD,
 * breadcrumb, and its own FAQ block.
 *
 * Why these exist: the homepage has to serve every intent at once, so it can't
 * rank for all of them. "garage door spring repair" and "commercial overhead
 * door installation" are distinct queries with distinct SERPs and distinct
 * buyers. Each needs its own H1, its own body copy, and its own FAQ.
 *
 * Content rules (same as cities.ts — these are what keep the pages out of
 * thin/doorway-page territory):
 *   - every page answers a different question, not the same page reworded
 *   - claims must match what the business actually does and what the rest of
 *     the site already says (family-owned, fully insured, TxDOT work, no
 *     subcontracting). Do not invent certifications, brands, or warranties.
 *   - pricing stays in ranges, phrased the same way the homepage FAQ does
 *
 * Keep this file dependency-free so it imports from both runtime React and
 * Node build scripts.
 */

import type { BlogFaq } from './posts';

export interface ServiceDef {
  slug: string;
  /** Visible H1. */
  name: string;
  /** Short label for cards / nav. */
  shortName: string;
  /** <title> tag — keep ≤ ~65 visible chars. */
  metaTitle: string;
  /** <meta description> — 60–170 chars. */
  description: string;
  /** BLUF opening paragraph. First 1–2 sentences are what AI engines retrieve. */
  intro: string;
  /** Second paragraph — depth, local context, or the honest caveat. */
  detail: string;
  /** "What's included" list. */
  includes: ReadonlyArray<string>;
  /** Signals that this service is the right pick. */
  signs: { heading: string; items: ReadonlyArray<string> };
  /** Plain-language pricing guidance. Ranges only. */
  pricing: string;
  faqs: ReadonlyArray<BlogFaq>;
  /** Blog slugs to cross-link — internal linking for the cluster model. */
  relatedPosts: ReadonlyArray<string>;
}

export const SERVICES: ReadonlyArray<ServiceDef> = [
  {
    slug: 'residential-garage-doors',
    name: 'Residential Garage Door Installation',
    shortName: 'Residential Doors',
    metaTitle: 'Residential Garage Door Installation | 4B Overhead Doors',
    description:
      'New residential garage door installation across West & North Texas. Insulated and non-insulated steel, custom carriage-house, and full opener setups. Free quotes — (940) 781-1186.',
    intro:
      '4B Overhead Doors installs new residential garage doors across West Texas, North Texas, and the Red River region. We handle the whole job — measuring the opening, ordering the right door for your home and climate, hauling off the old unit, and setting the springs so the door balances correctly on day one.',
    detail:
      "Most homes we work on are single- or double-bay openings that have been running the same builder-grade door for fifteen or twenty years. The panels dent, the sections separate, and the springs get weak enough that the opener starts doing the lifting. Replacing the door is usually the point where a homeowner also fixes the insulation problem — a west-facing Texas garage with an uninsulated door bakes all afternoon, and that heat moves straight into the house through the shared wall.",
    includes: [
      'On-site measurement of the opening, headroom, and side room',
      'Door selection help — material, insulation R-value, panel style, window options',
      'Removal and disposal of the existing door and hardware',
      'New track, rollers, hinges, cables, and correctly sized torsion springs',
      'Opener installation or re-hookup, including keypad and remote programming',
      'Balance and safety-reverse test before we leave'
    ],
    signs: {
      heading: "Signs it's time to replace rather than repair",
      items: [
        'Cracked, split, or rusted-through panels',
        'The door has been repaired more than twice in the last two years',
        'Sections no longer line up, leaving daylight gaps along the top or sides',
        'The garage is unbearably hot and the door has no insulation',
        "You're selling and the door is the first thing buyers see"
      ]
    },
    pricing:
      'Residential doors typically start in the low four figures installed, and move up with size, insulation, window inserts, and whether you need a new opener. A single-bay non-insulated steel door is the low end; an insulated double with a belt-drive opener is the middle. We quote the real number after seeing the opening — no per-square-foot guessing over the phone.',
    faqs: [
      {
        q: 'How long does a residential garage door installation take?',
        a: 'Most single- and double-bay replacements are a same-day job — typically four to six hours from removing the old door to testing the opener. Custom or oversized doors can take longer, and we tell you that up front when we quote it.'
      },
      {
        q: 'Do I need an insulated garage door in Texas?',
        a: "If the garage shares a wall with living space, or you use it as a shop, insulation is worth it. An insulated door slows the afternoon heat transfer significantly and makes the space usable in July. If it's a detached garage you only park in, non-insulated is a reasonable way to save money."
      },
      {
        q: 'Can you match a door to my existing house style?',
        a: 'Yes. We can spec traditional raised-panel, flush, carriage-house, and modern full-view styles in a range of colors and window configurations. Bring us a photo of the house and we will tell you what actually fits the opening and the look.'
      },
      {
        q: 'Do you install the opener too?',
        a: 'Yes — we install new openers (chain, belt, and wall-mount) and re-hook existing ones if yours is still in good shape. We program the remotes and keypad before we leave.'
      }
    ],
    relatedPosts: [
      'garage-door-cost-texas',
      'insulated-vs-non-insulated-garage-doors',
      'best-garage-door-texas-heat'
    ]
  },
  {
    slug: 'commercial-overhead-doors',
    name: 'Commercial Overhead Door Installation & Service',
    shortName: 'Commercial Doors',
    metaTitle: 'Commercial Overhead Doors — Texas | 4B Overhead Doors',
    description:
      'Heavy-duty commercial overhead door installation and repair for Texas warehouses, shops, and industrial sites. TxDOT highway department projects. Call (940) 781-1186.',
    intro:
      '4B Overhead Doors installs and services heavy-duty commercial overhead doors for warehouses, shops, fleet buildings, and industrial sites across West and North Texas. We also work Texas Department of Transportation highway department projects, which run to spec and on a schedule.',
    detail:
      'Commercial work is a different animal from residential. The doors are heavier, the cycle counts are far higher, and downtime costs money — a shop bay that will not open is a crew standing around. That changes the spec: high-cycle springs instead of standard, commercial-grade track and hardware, and openers sized for the duty cycle the building actually runs rather than the cheapest jackshaft that fits.',
    includes: [
      'Sectional steel doors, rolling steel service doors, and high-clearance shop doors',
      'High-cycle torsion spring packages sized to your daily open/close count',
      'Commercial track, heavy-gauge hardware, and reinforced struts',
      'Jackshaft, trolley, and hoist operator installation',
      'Scheduled preventative maintenance so failures happen on your calendar, not mid-shift',
      'Emergency repair on down doors'
    ],
    signs: {
      heading: 'Where we typically get called',
      items: [
        'New construction and building additions — working directly with the GC',
        'Fleet and equipment buildings that outgrew a residential-grade door',
        'Warehouses where the door cycles dozens of times a day and springs keep failing',
        'TxDOT and municipal facility projects',
        'Barndominium and metal-building shop doors'
      ]
    },
    pricing:
      'Commercial pricing varies far more than residential — a 10x10 sectional in a small shop and a 16-foot rolling steel door on a warehouse are not in the same range. Spring cycle rating, operator type, and whether the opening needs structural work all move the number. We quote per project after a site visit.',
    faqs: [
      {
        q: 'Do you work with general contractors on new commercial builds?',
        a: 'Yes. We work directly with builders and GCs — we can spec the door package from the plans, supply the units, and schedule the install to land where it needs to in the build sequence.'
      },
      {
        q: 'What is a high-cycle spring and do I need one?',
        a: "A standard torsion spring is rated around 10,000 cycles — roughly seven years on a home. A commercial door opening thirty times a day burns through that in under a year. High-cycle springs are rated 25,000 to 100,000 cycles. If you're replacing springs more than once every couple of years, you need them."
      },
      {
        q: 'Can you service a commercial door you did not install?',
        a: 'Yes. We repair and maintain commercial doors regardless of who installed them or what brand they are. If parts are obsolete we will tell you honestly whether repair or replacement is the better spend.'
      },
      {
        q: 'How fast can you get to a down commercial door?',
        a: 'We prioritize down commercial doors because they stop work. Across our core service area we aim for same-day or next-day. Call (940) 781-1186 and we will give you a real ETA rather than a window we cannot hit.'
      }
    ],
    relatedPosts: ['commercial-overhead-door-types', 'barndominium-garage-doors']
  },
  {
    slug: 'garage-door-repair',
    name: 'Garage Door Repair & Maintenance',
    shortName: 'Repairs & Maintenance',
    metaTitle: 'Garage Door Repair — West & North Texas | 4B Overhead',
    description:
      'Garage door repair across West & North Texas — openers, cables, rollers, panels, and off-track doors. Same-day and next-day service where we can. (940) 781-1186.',
    intro:
      "4B Overhead Doors repairs residential and commercial garage doors across West and North Texas. Openers that won't respond, doors off track, frayed cables, broken rollers, dented panels, noisy operation — we diagnose the actual cause rather than replacing parts until something works.",
    detail:
      "Most garage door problems trace back to one of three things: a spring that has lost tension, a safety sensor that drifted out of alignment, or hardware that was never lubricated. The last one is the cheapest to fix and the most commonly ignored — rollers and hinges running dry in Texas dust wear out years early. A tune-up costs a fraction of what the resulting failure does, which is why we push maintenance harder than most.",
    includes: [
      'Opener diagnosis and repair — logic boards, gears, sensors, remotes, keypads',
      'Cable replacement and re-spooling drums on off-track doors',
      'Roller, hinge, and bearing replacement',
      'Individual panel replacement where the door is otherwise sound',
      'Track realignment and reinforcement',
      'Full tune-up: balance, lubrication, hardware tightening, safety-reverse test'
    ],
    signs: {
      heading: 'Common symptoms and what they usually mean',
      items: [
        'Door reverses right after touching the floor — travel limits or a sensor issue',
        'Loud grinding or popping — dry or failed rollers and bearings',
        'Door is crooked or jammed in the opening — a cable came off the drum',
        'Opener runs but the door does not move — stripped drive gear or a broken spring',
        'Door feels extremely heavy by hand — the springs are no longer carrying the weight'
      ]
    },
    pricing:
      'Most common repairs — rollers, cables, sensors, a tune-up — land well under the cost of a new door. Opener logic boards and full spring sets are the higher end. We tell you what it costs before we start, and if a repair does not make economic sense against a replacement, we say so.',
    faqs: [
      {
        q: 'How fast can you respond to a broken garage door?',
        a: 'For repairs we aim for same-day or next-day across our core service area whenever possible. Saturday and after-hours emergency calls are common for us — call (940) 781-1186 and we will give you an honest ETA.'
      },
      {
        q: 'Is it worth repairing an old garage door or should I replace it?',
        a: "It depends on what failed. Springs, cables, rollers, and openers are all worth fixing on an otherwise sound door. Once panels are cracked or rusted through, or you've paid for three repairs in two years, replacement is usually the better spend. We will give you the honest comparison."
      },
      {
        q: 'Do you repair doors you did not install?',
        a: 'Yes — most of our repair work is on doors installed by someone else. Brand and age are not a problem; we will tell you up front if a part is obsolete and hard to source.'
      },
      {
        q: 'How often should a garage door be serviced?',
        a: 'Once a year for a typical home, twice a year if the door cycles heavily or the garage is especially dusty. A tune-up is lubrication, hardware tightening, balance check, and a safety-reverse test — it is the cheapest thing you can do to avoid a failure.'
      }
    ],
    relatedPosts: [
      'garage-door-wont-open',
      'garage-door-maintenance-checklist',
      'garage-door-opener-guide'
    ]
  },
  {
    slug: 'garage-door-spring-repair',
    name: 'Garage Door Spring Repair',
    shortName: 'Spring Repair',
    metaTitle: 'Garage Door Spring Repair (Emergency) | 4B Overhead Doors',
    description:
      'Broken garage door spring? We prioritize spring repairs across West & North Texas — most completed within 24 hours. Do not DIY these. Call (940) 781-1186.',
    intro:
      'A broken garage door spring is the most common way a door goes down, and the one repair you should not attempt yourself. 4B Overhead Doors replaces torsion and extension springs across West and North Texas, and we prioritize these calls in the schedule — most spring jobs in our service area are completed within 24 hours.',
    detail:
      'The springs, not the opener, carry the weight of the door. A double garage door weighs somewhere between 150 and 400 pounds, and the springs counterbalance nearly all of it so the opener only has to overcome friction. When a spring breaks, that entire weight transfers to the opener and the cables. Running the door in that state strips opener gears and can pull cables off the drums, which turns a spring replacement into a much larger repair.',
    includes: [
      'Torsion and extension spring replacement, sized to your door weight',
      'Both springs replaced on dual-spring doors — they wear at the same rate',
      'Cable and drum inspection, since a spring failure often damages them',
      'Opener check for gear damage caused by running on a broken spring',
      'Re-balance and safety-reverse test',
      'High-cycle spring upgrades on heavily used doors'
    ],
    signs: {
      heading: 'How to tell a spring has broken',
      items: [
        'A loud bang from the garage, often overnight or in a cold snap',
        'A visible two-to-three-inch gap in the coil above the door',
        'The opener strains, hums, or lifts the door a few inches and stops',
        'The door is extremely heavy to lift by hand and will not stay up on its own',
        'The door goes up crooked or slams down faster than normal'
      ]
    },
    pricing:
      'Spring replacement is a mid-range repair — well below the cost of a new door, and higher than a tune-up because of the parts and the risk involved. Doors with two springs cost more than single-spring doors, and high-cycle upgrades add to it. We quote before we start.',
    faqs: [
      {
        q: 'My garage door spring broke — can you fix it today?',
        a: 'Garage door springs are under high tension and should not be DIY-replaced. Call (940) 781-1186 and we will prioritize spring repairs in our schedule. Most spring jobs in our service area can be completed within 24 hours.'
      },
      {
        q: 'Why should I not replace a garage door spring myself?',
        a: 'A torsion spring stores enough energy to break bones. Releasing it requires winding bars and a specific procedure, and the common improvised substitutes — screwdrivers, rebar — slip. This is the single most dangerous part of a garage door, and it is the reason we take these calls seriously.'
      },
      {
        q: 'If one spring broke, should I replace both?',
        a: 'Yes, on a dual-spring door. Both springs have run the same number of cycles, so the second one is near the end of its life too. Replacing only the broken one means paying for a second service call within months.'
      },
      {
        q: 'Can I still use my garage door with a broken spring?',
        a: 'You should not. The opener is not built to lift the full weight of the door and will strip its gears trying. Disconnect the opener, leave the door down, and call us — forcing it turns a spring job into a spring, cable, and opener job.'
      }
    ],
    relatedPosts: ['broken-garage-door-spring-signs', 'garage-door-wont-open']
  }
];

export function getService(slug: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
