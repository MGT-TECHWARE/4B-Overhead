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
    slug: 'seymour',
    name: 'Seymour',
    county: 'Baylor County',
    region: 'North Texas',
    population: 2500,
    geo: { lat: 33.5934, lng: -99.2606 },
    nearby: ['Megargel', 'Goree', 'Mabelle'],
    localAngle:
      "Seymour sits on US-277 about an hour southwest of Wichita Falls — a routine drive for us. Working ranches and ag-equipment shops out here run heavier commercial overhead doors, and the older homes around the courthouse square often need full opener replacements rather than spot repairs."
  },
  {
    slug: 'olney',
    name: 'Olney',
    county: 'Young County',
    region: 'North Texas',
    population: 3200,
    geo: { lat: 33.3712, lng: -98.7517 },
    nearby: ['Newcastle', 'Loving', 'Megargel'],
    localAngle:
      "Olney's mix of working ranches and small-town residential streets means we see both commercial overhead doors at ag-equipment shops and standard residential spring jobs on the same trip — efficient routing keeps the price honest for a town this size."
  },
  {
    slug: 'jacksboro',
    name: 'Jacksboro',
    county: 'Jack County',
    region: 'North Texas',
    population: 4400,
    geo: { lat: 33.2184, lng: -98.1581 },
    nearby: ['Bryson', 'Perrin', 'Antelope'],
    localAngle:
      "Jacksboro is the seat of Jack County and the natural turn-off between Wichita Falls and the DFW metro on US-281. The ranching and oil-and-gas economy here keeps shop buildings busy — those are the commercial overhead doors we install most often in the area."
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
    slug: 'springtown',
    name: 'Springtown',
    county: 'Parker County',
    region: 'North Texas',
    population: 3200,
    geo: { lat: 32.9685, lng: -97.6814 },
    nearby: ['Reno', 'Azle', 'Boyd'],
    localAngle:
      "Springtown sits at the TX-199 / FM-51 junction in northern Parker County — a fast-growing rural-suburban corridor. Most calls here are new-construction installs on acreage builds, alongside steady spring and opener repairs on the older homes off the highway."
  },
  {
    slug: 'azle',
    name: 'Azle',
    county: 'Tarrant County',
    region: 'North Texas',
    population: 13000,
    geo: { lat: 32.8954, lng: -97.5436 },
    nearby: ['Pelican Bay', 'Lakeside', 'Briar'],
    localAngle:
      "Azle wraps around Eagle Mountain Lake on the northwest edge of Tarrant County — lakefront properties, acreage homes, and the steady production-builder growth along TX-199 all feed our install pipeline. Lake-area humidity also accelerates roller and hinge wear, so we recommend yearly maintenance here."
  },
  {
    slug: 'aledo',
    name: 'Aledo',
    county: 'Parker County',
    region: 'North Texas',
    population: 6400,
    geo: { lat: 32.6957, lng: -97.6028 },
    nearby: ['Annetta', 'Willow Park', 'Hudson Oaks'],
    localAngle:
      "Aledo and the Parker County corridor along I-20 have been one of the fastest-growing residential markets in North Texas. Most of our work here is new-build installs on custom and semi-custom homes — insulated steel doors with modern openers spec'd to match the architecture."
  },
  {
    slug: 'weatherford',
    name: 'Weatherford',
    county: 'Parker County',
    region: 'North Texas',
    population: 33500,
    geo: { lat: 32.7593, lng: -97.7972 },
    nearby: ['Hudson Oaks', 'Willow Park', 'Aledo'],
    localAngle:
      "Weatherford anchors Parker County at the I-20 / US-180 junction — a steady mix of historic homes around the courthouse square, newer residential growth east toward Hudson Oaks, and commercial shops along the interstate frontage. We handle the full range of door work across that footprint."
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
    slug: 'paducah',
    name: 'Paducah',
    county: 'Cottle County',
    region: 'West Texas',
    population: 1100,
    geo: { lat: 34.0123, lng: -100.3023 },
    nearby: ['Roaring Springs', 'Childress', 'Matador'],
    localAngle:
      "Paducah and the surrounding Cottle County ranchland sit on the rolling-plains edge of the Texas Panhandle, where wind, dust, and big temperature swings punish lighter-gauge doors. We spec heavier insulated steel here and pair it with commercial-grade openers built for the conditions."
  }
] as const;

export function findCity(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug);
}

export const CITY_SLUGS: ReadonlyArray<string> = CITIES.map(c => c.slug);
