/**
 * Service-area city data. Each entry produces a /service-areas/<slug> page
 * with a unique <title>, <meta description>, canonical, JSON-LD (with the
 * city's geo coords in LocalBusiness), and visible local-context copy.
 *
 * Uniqueness strategy (to avoid Google's doorway-page penalty):
 *   - real population & county
 *   - real geo coords (city center)
 *   - 2-3 named nearby communities the operator actually services
 *   - one substantive local-angle sentence rooted in real geography,
 *     climate, or industry — NOT a templated mad-lib
 *
 * Keep this file dependency-free so it imports from both runtime React
 * and Node build scripts.
 */

export type Region = 'North Texas' | 'West Texas';

export interface City {
  slug: string;
  name: string;
  county: string;
  region: Region;
  population: number;
  geo: { lat: number; lng: number };
  /** Small towns / communities sharing this city's service zone. */
  nearby: ReadonlyArray<string>;
  /** Single unique sentence using real local fact. Used in the intro. */
  localAngle: string;
  /** Optional second paragraph for cities with deep enough context to warrant it. */
  secondaryAngle?: string;
}

export const CITIES: ReadonlyArray<City> = [
  // ────────────────── NORTH TEXAS ──────────────────
  {
    slug: 'wichita-falls',
    name: 'Wichita Falls',
    county: 'Wichita County',
    region: 'North Texas',
    population: 102000,
    geo: { lat: 33.9137, lng: -98.4934 },
    nearby: ['Lakeside City', 'Holliday', 'Pleasant Valley'],
    localAngle:
      "Wichita Falls is our home base — a quick drive lets us cover same-day spring repairs, and we work the full range of door types here, from mid-century brick-home installs near Country Club to industrial overhead doors at the warehouses off Seymour Highway and Sheppard Air Force Base.",
    secondaryAngle:
      'Because we live in this market, you get one operator from quote to install — not a routed call center booking a stranger to drive in from another county.'
  },
  {
    slug: 'burkburnett',
    name: 'Burkburnett',
    county: 'Wichita County',
    region: 'North Texas',
    population: 11000,
    geo: { lat: 34.0915, lng: -98.5712 },
    nearby: ['Thrift', 'Tradewater', 'Randlett (OK)'],
    localAngle:
      "Just north of Wichita Falls and a few minutes from the Oklahoma line, Burkburnett's older oil-boom-era homes often still run original spring assemblies — we replace them with modern torsion systems and pair them with code-current openers."
  },
  {
    slug: 'iowa-park',
    name: 'Iowa Park',
    county: 'Wichita County',
    region: 'North Texas',
    population: 6700,
    geo: { lat: 33.9509, lng: -98.6700 },
    nearby: ['Electra', 'Kamay', 'Valley View'],
    localAngle:
      'Iowa Park sits right on US-287 between Wichita Falls and Electra, so most repair calls in the corridor are realistic same-day fixes — broken springs, off-track panels, and dead openers are routine here.'
  },
  {
    slug: 'vernon',
    name: 'Vernon',
    county: 'Wilbarger County',
    region: 'North Texas',
    population: 10100,
    geo: { lat: 34.1554, lng: -99.2664 },
    nearby: ['Oklaunion', 'Chillicothe', 'Harrold'],
    localAngle:
      "Vernon and the surrounding Wilbarger County ranches see brutal Panhandle-edge wind that slowly chews through door bottom seals and bends thin-gauge panels. A pre-storm-season tune-up — re-balancing the springs, lubing the rollers, replacing the weather seal — is the cheapest insurance on the door."
  },
  {
    slug: 'henrietta',
    name: 'Henrietta',
    county: 'Clay County',
    region: 'North Texas',
    population: 3200,
    geo: { lat: 33.8170, lng: -98.1953 },
    nearby: ['Bellevue', 'Bluegrove', 'Petrolia'],
    localAngle:
      "Henrietta is the seat of Clay County and a regular drive for us — the older brick homes around the historic courthouse square often need full opener replacements, and the newer construction east toward the Red River is steady builder work."
  },
  {
    slug: 'bowie',
    name: 'Bowie',
    county: 'Montague County',
    region: 'North Texas',
    population: 5500,
    geo: { lat: 33.5587, lng: -97.8489 },
    nearby: ['Sunset', 'Saint Jo', 'Forestburg'],
    localAngle:
      "Bowie's growth along US-287 between Wichita Falls and the DFW metroplex has produced a steady stream of new builds, and we work directly with several area builders on garage-door specs and installation schedules."
  },
  {
    slug: 'decatur',
    name: 'Decatur',
    county: 'Wise County',
    region: 'North Texas',
    population: 7100,
    geo: { lat: 33.2343, lng: -97.5856 },
    nearby: ['Bridgeport', 'Alvord', 'Boyd'],
    localAngle:
      "Wise County's gas-patch activity and the new residential growth around US-287 / US-380 mean Decatur has serious demand for both production-builder doors and the heavy commercial overhead units that oilfield service yards run on."
  },
  {
    slug: 'gainesville',
    name: 'Gainesville',
    county: 'Cooke County',
    region: 'North Texas',
    population: 17500,
    geo: { lat: 33.6259, lng: -97.1334 },
    nearby: ['Whitesboro', 'Muenster', 'Lindsay'],
    localAngle:
      "Gainesville sits at the I-35 / US-82 junction — comfortable driving distance from our Wichita Falls base. The older brick homes near the historic California Street stretch often need spring conversions to bring openers up to current safety code, and the new builds north toward the Red River are mostly insulated steel."
  },
  {
    slug: 'sherman',
    name: 'Sherman',
    county: 'Grayson County',
    region: 'North Texas',
    population: 44000,
    geo: { lat: 33.6357, lng: -96.6089 },
    nearby: ['Denison', 'Howe', 'Van Alstyne'],
    localAngle:
      "Sherman is one of the fastest-growing markets in our coverage area — the Texas Instruments SM1 fab and the wider Texoma corridor expansion have pulled in builders, suppliers, and industrial sites that all need quality door work along the US-75 / US-82 corridor."
  },
  {
    slug: 'denton',
    name: 'Denton',
    county: 'Denton County',
    region: 'North Texas',
    population: 148000,
    geo: { lat: 33.2148, lng: -97.1331 },
    nearby: ['Argyle', 'Aubrey', 'Krum'],
    localAngle:
      "Denton's mix of UNT-area rentals, established neighborhoods around the historic courthouse square, and rapid growth toward Argyle and Aubrey means we see everything from quick spring fixes on rental properties to full custom-door installs in new builds."
  },
  {
    slug: 'fort-worth',
    name: 'Fort Worth',
    county: 'Tarrant County',
    region: 'North Texas',
    population: 956000,
    geo: { lat: 32.7555, lng: -97.3308 },
    nearby: ['Saginaw', 'Keller', 'Haslet'],
    localAngle:
      "Fort Worth is a wide service footprint — older Westside bungalows, the post-war stock around the Cultural District, and the new construction in Alliance and the TX-114 corridor all need different doors. We take projects here when craftsmanship and a single point of contact matter more than a storefront brand."
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    county: 'Dallas County',
    region: 'North Texas',
    population: 1304000,
    geo: { lat: 32.7767, lng: -96.7970 },
    nearby: ['Highland Park', 'University Park', 'Garland'],
    localAngle:
      "We take Dallas-area projects on referral and for builders we already work with elsewhere in our service area. The trip is worth it for full installs and commercial overhead-door projects where the bid wins on craftsmanship rather than the lowest commodity price."
  },

  // ────────────────── WEST TEXAS ──────────────────
  {
    slug: 'abilene',
    name: 'Abilene',
    county: 'Taylor County',
    region: 'West Texas',
    population: 124000,
    geo: { lat: 32.4487, lng: -99.7331 },
    nearby: ['Tye', 'Buffalo Gap', 'Tuscola'],
    localAngle:
      "Abilene anchors the Big Country region at the I-20 / US-83 junction. Its mix of older mid-century homes, the newer suburbs around Dyess Air Force Base, and the industrial sites south of the interstate keeps us busy with everything from residential spring repairs to commercial gate-and-door work."
  },
  {
    slug: 'lubbock',
    name: 'Lubbock',
    county: 'Lubbock County',
    region: 'West Texas',
    population: 263000,
    geo: { lat: 33.5779, lng: -101.8552 },
    nearby: ['Wolfforth', 'Shallowater', 'Idalou'],
    localAngle:
      "Lubbock's hard caliche-heavy west wind is punishing on door tracks and bottom seals — the same wind that grew the South Plains' cotton and ag industries also grit-blasts garage door rollers. We install heavier insulated steel doors here than we do farther east, and we set commercial overhead doors at ag and oilfield service yards across the region."
  },
  {
    slug: 'amarillo',
    name: 'Amarillo',
    county: 'Potter & Randall Counties',
    region: 'West Texas',
    population: 201000,
    geo: { lat: 35.2220, lng: -101.8313 },
    nearby: ['Canyon', 'Bushland', 'Pampa'],
    localAngle:
      "Amarillo and the surrounding Texas Panhandle deal with weather extremes — high winds, hail, and big temperature swings between summer and winter. We spec thicker insulated steel doors and commercial-grade hardware here for anything that has to face Route 66-corridor weather year-round."
  },
  {
    slug: 'midland',
    name: 'Midland',
    county: 'Midland County',
    region: 'West Texas',
    population: 132000,
    geo: { lat: 31.9974, lng: -102.0779 },
    nearby: ['Greenwood', 'Stanton', 'Gardendale'],
    localAngle:
      "Midland's Permian Basin economy keeps us installing heavy commercial overhead doors at oilfield yards and shop buildings. The residential growth on the city's north side and out toward Greenwood keeps the new-construction pipeline full year-round."
  },
  {
    slug: 'odessa',
    name: 'Odessa',
    county: 'Ector County',
    region: 'West Texas',
    population: 115000,
    geo: { lat: 31.8457, lng: -102.3676 },
    nearby: ['Goldsmith', 'Notrees', 'Penwell'],
    localAngle:
      "Odessa sits at the heart of the Permian and shares Midland's industrial demand for big commercial doors. We work directly with shop builders and oilfield service companies on both new builds and emergency door replacements after equipment damage."
  },
  {
    slug: 'san-angelo',
    name: 'San Angelo',
    county: 'Tom Green County',
    region: 'West Texas',
    population: 101000,
    geo: { lat: 31.4638, lng: -100.4370 },
    nearby: ['Grape Creek', 'Wall', 'Christoval'],
    localAngle:
      "San Angelo combines a Goodfellow AFB military community with Concho Valley ranching — we see everything from custom carriage-style residential doors near the bluffs above the Concho River to working metal-shop overhead units on the city's working edges."
  },
  {
    slug: 'big-spring',
    name: 'Big Spring',
    county: 'Howard County',
    region: 'West Texas',
    population: 26000,
    geo: { lat: 32.2504, lng: -101.4787 },
    nearby: ['Coahoma', 'Forsan', 'Sand Springs'],
    localAngle:
      "Big Spring is our Permian-edge anchor — Howard County and the I-20 corridor between Midland and Abilene. We cover residential repairs in town and commercial overhead doors at the refinery and oilfield service yards south of the interstate."
  },
  {
    slug: 'plainview',
    name: 'Plainview',
    county: 'Hale County',
    region: 'West Texas',
    population: 20000,
    geo: { lat: 34.1848, lng: -101.7068 },
    nearby: ['Hale Center', 'Petersburg', 'Abernathy'],
    localAngle:
      "Plainview sits between Lubbock and Amarillo on I-27 and gets the same hard High Plains wind and grit that punishes garage door tracks. Proactive yearly maintenance — fresh weather seal, rebalanced springs, fresh roller lube — is the cheapest way to keep a residential opener working past the 10-year mark out here."
  }
] as const;

export function findCity(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug);
}

export const CITY_SLUGS: ReadonlyArray<string> = CITIES.map(c => c.slug);
