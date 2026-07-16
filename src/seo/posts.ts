/**
 * Blog post metadata. Each entry produces a /blog/<slug> page with a unique
 * <title>, <meta description>, canonical, BlogPosting JSON-LD, and (optionally)
 * a FAQPage block. Mirrors the cities.ts pattern.
 *
 * This file is the single source of truth for post METADATA (title, description,
 * date, hero image, FAQs). The article BODY lives in src/blog/content/<slug>.ts
 * so this file stays dependency-free and importable from Node build scripts.
 *
 * Hero/inline images reuse existing gallery photos in src/assets/gallery — the
 * filename here must match a file in that folder (see gallery/projects.ts).
 */

export type BlogCategory = 'Repair' | 'Buying Guide' | 'Maintenance' | 'Commercial';

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogPostMeta {
  slug: string;
  /** Visible H1 / card title. */
  title: string;
  /** <title> tag — keep ≤ ~65 visible chars where possible. */
  metaTitle: string;
  /** <meta description> — 60–170 chars. */
  description: string;
  /** Short summary shown on the blog index card. */
  excerpt: string;
  primaryKeyword: string;
  category: BlogCategory;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  updated?: string;
  readMinutes: number;
  /** Gallery filename used as the hero image. */
  heroImage: string;
  heroAlt: string;
  /** Sibling slugs for the "Read next" section. */
  related: ReadonlyArray<string>;
  faqs: ReadonlyArray<BlogFaq>;
}

export const POSTS: ReadonlyArray<BlogPostMeta> = [
  {
    slug: 'garage-door-cost-texas',
    title: 'How Much Does a New Garage Door Cost in Texas?',
    metaTitle: 'Garage Door Cost in Texas (2026 Guide) | 4B Overhead Doors',
    description:
      'What a new garage door really costs in Texas — by size, material, insulation, and opener. Honest ranges from a family-owned installer serving West & North TX.',
    excerpt:
      "From a single-car steel door to an insulated double with a new opener, here's how garage door pricing actually breaks down in Texas — and what drives the number up or down.",
    primaryKeyword: 'garage door cost texas',
    category: 'Buying Guide',
    date: '2026-05-20',
    readMinutes: 7,
    heroImage: 'image-copy.webp',
    heroAlt: 'New white two-car garage doors installed on a Texas home by 4B Overhead Doors',
    related: ['garage-door-opener-guide', 'insulated-vs-non-insulated-garage-doors', 'best-garage-door-texas-heat'],
    faqs: [
      {
        q: 'How much does a new garage door cost in Texas?',
        a: 'A basic single-car steel door installed usually lands in the high hundreds to low four figures, while an insulated double door with a new opener commonly runs several thousand dollars. Size, material, insulation, window inserts, and whether the opener is replaced are the biggest cost drivers. We give free, no-obligation quotes — call (940) 781-1186.'
      },
      {
        q: 'Does replacing a garage door include a new opener?',
        a: 'Not always. A door replacement and an opener replacement are separate line items. If your existing opener is in good shape and rated for the new door’s weight, you can keep it. We’ll tell you honestly whether yours is worth reusing.'
      },
      {
        q: 'Is it cheaper to repair or replace a garage door?',
        a: 'A single broken spring, cable, or panel is almost always cheaper to repair than to replace the whole door. Full replacement makes sense when the door is old, dented across multiple panels, poorly insulated, or failing repeatedly.'
      }
    ]
  },
  {
    slug: 'broken-garage-door-spring-signs',
    title: '5 Signs of a Broken Garage Door Spring',
    metaTitle: 'Broken Garage Door Spring? 5 Warning Signs | 4B Overhead',
    description:
      'How to tell if your garage door spring is broken — the loud bang, the 4-inch lift, the crooked door, and more. Why DIY is dangerous. Call (940) 781-1186.',
    excerpt:
      'A snapped torsion spring is the most common garage door failure, and the most dangerous to fix yourself. Here are the signs to watch for and what to do next.',
    primaryKeyword: 'broken garage door spring',
    category: 'Repair',
    date: '2026-06-03',
    readMinutes: 6,
    heroImage: 'image-copy-39.webp',
    heroAlt: 'Garage door panel and hardware replacement in progress by 4B Overhead Doors',
    related: ['garage-door-wont-open', 'garage-door-maintenance-checklist', 'garage-door-opener-guide'],
    faqs: [
      {
        q: 'Can I use my garage door with a broken spring?',
        a: 'No. With a broken spring the door loses its counterbalance, so the opener is lifting a weight it was never built to move, and the door can slam shut without warning. Stop using it and call a professional.'
      },
      {
        q: 'Why should I not replace a garage door spring myself?',
        a: 'Torsion springs are wound under extreme tension. A slip while winding or unwinding one can cause serious injury. The tools and technique matter, which is why spring work is a job for a trained installer.'
      },
      {
        q: 'How long do garage door springs last?',
        a: 'Most standard torsion springs are rated for roughly 10,000 open-close cycles, which for an average household is about 7 to 10 years. Higher-cycle springs are available if your door runs many times a day.'
      }
    ]
  },
  {
    slug: 'garage-door-wont-open',
    title: "Garage Door Won't Open? What to Check First",
    metaTitle: "Garage Door Won't Open? 8 Things to Check | 4B Overhead",
    description:
      'Garage door won’t open or close? Work through these 8 common causes — from a tripped lock to a broken spring — before you call for repair. West & North Texas.',
    excerpt:
      "Before you assume the worst, most “won’t open” problems come down to a handful of fixable causes. Here's the order to check them in.",
    primaryKeyword: "garage door won't open",
    category: 'Repair',
    date: '2026-06-12',
    readMinutes: 7,
    heroImage: 'image-copy-68.webp',
    heroAlt: 'Black two-car garage doors on a stone-front Texas home installed by 4B Overhead Doors',
    related: ['broken-garage-door-spring-signs', 'garage-door-maintenance-checklist', 'garage-door-opener-guide'],
    faqs: [
      {
        q: 'Why does my garage door open a few inches and stop?',
        a: 'That usually points to a broken spring or a safety setting on the opener. When the counterbalance is gone, the opener’s force limit stops the door after a short lift. Do not force it — have the spring checked.'
      },
      {
        q: 'Why won’t my garage door close all the way?',
        a: 'The most common causes are blocked or misaligned photo-eye safety sensors near the floor, or a close-limit setting that needs adjusting. Wipe the sensor lenses and confirm both indicator lights are steady before anything else.'
      },
      {
        q: 'My remote stopped working — is the opener broken?',
        a: 'Often not. Try the wall button first: if that works, it’s usually a remote battery, a needed re-pairing, or interference. If nothing works, check that the opener still has power at the outlet.'
      }
    ]
  },
  {
    slug: 'insulated-vs-non-insulated-garage-doors',
    title: 'Insulated vs. Non-Insulated Garage Doors in Texas',
    metaTitle: 'Insulated vs. Non-Insulated Garage Doors | 4B Overhead',
    description:
      'Is an insulated garage door worth it in the Texas heat? How R-value, attached garages, and energy use factor in — and when a non-insulated door is fine.',
    excerpt:
      "An insulated door costs more up front. In the Texas heat, here's when that upgrade pays you back — and when it doesn't.",
    primaryKeyword: 'insulated garage door',
    category: 'Buying Guide',
    date: '2026-06-20',
    readMinutes: 6,
    heroImage: 'image-copy-10.webp',
    heroAlt: 'Bronze long-panel garage door with window inserts on a Texas home by 4B Overhead Doors',
    related: ['best-garage-door-texas-heat', 'garage-door-cost-texas', 'garage-door-maintenance-checklist'],
    faqs: [
      {
        q: 'Is an insulated garage door worth it in Texas?',
        a: 'If your garage is attached, shares a wall with living space, or doubles as a shop or gym, insulation is usually worth it — it keeps the space far cooler in summer and steadies the temperature next door. For a detached garage you rarely use, a non-insulated door can be fine.'
      },
      {
        q: 'What R-value should a garage door have?',
        a: 'Higher R-value means more resistance to heat transfer. For Texas heat, a mid-range insulated door (roughly R-9 to R-13) is a sensible target for most attached garages; dedicated workshops may want more.'
      },
      {
        q: 'Does an insulated door make the garage quieter?',
        a: 'Yes. The same foam core that slows heat also dampens sound, so insulated doors tend to run quieter and feel more solid than a single-layer steel door.'
      }
    ]
  },
  {
    slug: 'best-garage-door-texas-heat',
    title: 'Choosing a Garage Door Built for Texas Weather',
    metaTitle: 'Best Garage Doors for Texas Heat & Wind | 4B Overhead',
    description:
      'Texas heat, hail, and Panhandle wind are hard on garage doors. How to pick a door — material, gauge, finish, and insulation — that holds up for years.',
    excerpt:
      'Between triple-digit summers, spring hail, and West Texas wind, not every garage door survives here. What to look for in one that does.',
    primaryKeyword: 'best garage door for texas heat',
    category: 'Buying Guide',
    date: '2026-06-28',
    readMinutes: 6,
    heroImage: 'image-copy-17.webp',
    heroAlt: 'Black double garage doors on a modern Texas home installed by 4B Overhead Doors',
    related: ['insulated-vs-non-insulated-garage-doors', 'garage-door-cost-texas', 'barndominium-garage-doors'],
    faqs: [
      {
        q: 'What garage door material holds up best in Texas?',
        a: 'Steel is the workhorse for Texas — durable, low-maintenance, and available insulated. A heavier gauge (a lower gauge number) resists dents and wind better. Composite and quality faux-wood finishes give the wood look without the heat and moisture problems of real wood.'
      },
      {
        q: 'Do I need a wind-rated garage door in Texas?',
        a: 'In open West Texas and the Panhandle, wind load matters. Wind-rated doors add bracing and stronger tracks so the door resists bowing and blow-in during high winds. It’s worth asking about for exposed properties.'
      },
      {
        q: 'Does a dark garage door get too hot in the sun?',
        a: 'Dark finishes do absorb more heat, which can matter for a non-insulated door on a south- or west-facing wall. Choosing an insulated door and a fade-resistant finish keeps a dark color practical even in full Texas sun.'
      }
    ]
  },
  {
    slug: 'commercial-overhead-door-types',
    title: 'Commercial Overhead Doors: Roll-Up vs. Sectional',
    metaTitle: 'Commercial Overhead Doors: Roll-Up vs Sectional | 4B',
    description:
      'Rolling steel or sectional overhead doors for your shop or warehouse? Compare durability, insulation, headroom, and cost for Texas commercial buildings.',
    excerpt:
      "Warehouses, shops, and TxDOT sites need the right door for the job. Here's how rolling steel and sectional overhead doors compare.",
    primaryKeyword: 'commercial overhead door',
    category: 'Commercial',
    date: '2026-07-01',
    readMinutes: 6,
    heroImage: 'image-copy-27.webp',
    heroAlt: 'Black commercial roll-up shop door installed by 4B Overhead Doors in Texas',
    related: ['barndominium-garage-doors', 'garage-door-cost-texas', 'garage-door-maintenance-checklist'],
    faqs: [
      {
        q: 'What is the difference between a roll-up and a sectional overhead door?',
        a: 'A rolling steel door coils into a compact drum above the opening, which saves ceiling space and stands up to heavy use. A sectional door lifts in horizontal panels that ride tracks up under the ceiling, and it insulates better and offers more design and window options.'
      },
      {
        q: 'Which commercial door is more durable?',
        a: 'Rolling steel doors are hard to beat for high-cycle, security-focused, or industrial openings. Sectional doors are very durable too and are often the better pick when insulation, appearance, or a quieter operation matters.'
      },
      {
        q: 'Do you install commercial doors for businesses and government jobs?',
        a: 'Yes. We install and service commercial overhead doors for shops, warehouses, and industrial sites, and we’ve completed TxDOT highway department projects. Call (940) 781-1186 to discuss your building.'
      }
    ]
  },
  {
    slug: 'garage-door-opener-guide',
    title: 'Garage Door Openers: Belt, Chain & Wall-Mount',
    metaTitle: 'Garage Door Opener Types Compared | 4B Overhead Doors',
    description:
      'Belt, chain, screw, or wall-mount garage door opener? Compare noise, cost, horsepower, and smart features to pick the right drive for your door.',
    excerpt:
      "The opener you choose decides how loud, how smart, and how long-lived your door is. Here's how the main drive types stack up.",
    primaryKeyword: 'garage door opener types',
    category: 'Buying Guide',
    date: '2026-07-05',
    readMinutes: 6,
    heroImage: 'image-copy-25.webp',
    heroAlt: 'New garage door opener motor and rail system installed by 4B Overhead Doors',
    related: ['garage-door-wont-open', 'broken-garage-door-spring-signs', 'garage-door-cost-texas'],
    faqs: [
      {
        q: 'What is the quietest type of garage door opener?',
        a: 'Belt-drive openers are the quietest of the traditional units because a rubber belt replaces the metal chain. Wall-mounted (jackshaft) openers, which mount beside the door instead of overhead, are also very quiet and free up ceiling space.'
      },
      {
        q: 'How much horsepower do I need for a garage door opener?',
        a: 'A single door is usually happy with 1/2 horsepower. For a heavy insulated double door, or if you want longer motor life, 3/4 horsepower or a comparable DC motor rating is the safer choice.'
      },
      {
        q: 'Are smart garage door openers worth it?',
        a: 'If you like phone control, alerts when the door is left open, and easy guest access, yes. Many newer openers include Wi-Fi built in, and older units can often be upgraded with an add-on controller.'
      }
    ]
  },
  {
    slug: 'garage-door-maintenance-checklist',
    title: 'The Texas Garage Door Maintenance Checklist',
    metaTitle: 'Garage Door Maintenance Checklist for Texas | 4B',
    description:
      'A simple seasonal garage door maintenance checklist for Texas homeowners — lubrication, balance test, weather seal, and the sounds that mean call a pro.',
    excerpt:
      "Fifteen minutes a couple times a year keeps a door running quiet and adds years to it. Here's the checklist we give our own customers.",
    primaryKeyword: 'garage door maintenance',
    category: 'Maintenance',
    date: '2026-07-08',
    readMinutes: 6,
    heroImage: 'image-copy-14.webp',
    heroAlt: 'Two white garage doors on a brick Texas home maintained by 4B Overhead Doors',
    related: ['broken-garage-door-spring-signs', 'garage-door-wont-open', 'garage-door-opener-guide'],
    faqs: [
      {
        q: 'How often should I service my garage door?',
        a: 'A quick DIY check twice a year is a good rhythm for most homes — lubricate the moving parts, test the balance, and inspect the rollers, cables, and weather seal. A professional tune-up once a year catches wear before it becomes a breakdown.'
      },
      {
        q: 'What kind of lubricant should I use on a garage door?',
        a: 'Use a garage-door-specific silicone or lithium-based spray on the hinges, rollers, springs, and bearings. Avoid heavy grease and never use WD-40 as a lubricant — it’s a solvent that can strip the lubrication you need.'
      },
      {
        q: 'How do I test if my garage door is balanced?',
        a: 'Pull the release cord to disconnect the opener, then lift the door halfway by hand. A balanced door stays roughly in place. If it slams down or springs up, the spring tension is off and should be adjusted by a pro.'
      }
    ]
  },
  {
    slug: 'barndominium-garage-doors',
    title: 'Barndominium & Metal Building Doors: A Texas Guide',
    metaTitle: 'Barndominium Garage Doors: A Texas Guide | 4B Overhead',
    description:
      'Planning doors for a barndominium or metal building in Texas? How to size openings, choose sectional vs roll-up, and frame for a clean, sealed install.',
    excerpt:
      "Barndominiums and metal shops have different door needs than a stick-built house. Here's what Texas owners should plan for.",
    primaryKeyword: 'barndominium garage door',
    category: 'Commercial',
    date: '2026-07-11',
    readMinutes: 6,
    heroImage: 'image-copy-58.webp',
    heroAlt: 'Black double garage door on a Texas barndominium installed by 4B Overhead Doors',
    related: ['commercial-overhead-door-types', 'best-garage-door-texas-heat', 'garage-door-cost-texas'],
    faqs: [
      {
        q: 'What size garage door do I need for a barndominium?',
        a: 'It depends on what you park. A standard single car fits a 9-foot-wide door, trucks and larger vehicles do better at 10 to 12 feet, and RVs or equipment often need 14-foot-plus tall openings. Plan the opening before the steel goes up, not after.'
      },
      {
        q: 'Can you insulate a metal building garage door?',
        a: 'Yes, and in a Texas metal building it’s often a smart move — insulated doors cut the radiant heat that steel walls pass through and make a shop or living space far more comfortable.'
      },
      {
        q: 'Do metal buildings need special framing for garage doors?',
        a: 'They need proper jamb and header framing to mount the tracks and carry the door’s weight. Getting the rough opening and framing right is the difference between a door that seals cleanly and one that lets in dust and weather. We can advise before your build.'
      }
    ]
  }
] as const;

export type BlogSlug = (typeof POSTS)[number]['slug'];

export function getPost(slug: string): BlogPostMeta | undefined {
  return POSTS.find(p => p.slug === slug);
}
