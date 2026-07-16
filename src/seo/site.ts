/**
 * Single source of truth for site-wide SEO/identity constants.
 * Imported by runtime React code AND by Node build scripts (scripts/*.mjs)
 * — keep this file dependency-free (no React, no Node-only APIs) so it
 * resolves cleanly from both contexts.
 *
 * If the production URL changes, update SITE_URL only and rebuild.
 */

export const SITE_URL = 'https://4boverheaddoors.com';

export const BUSINESS = {
  legalName: '4B Overhead Doors, LLC',
  shortName: '4B Overhead Doors',
  founder: 'Colten Beaty',
  phone: '+1-940-781-1186',
  phoneDisplay: '(940) 781-1186',
  emailPrimary: 'coltenbeaty182@gmail.com',
  emailBusiness: '4boverheaddoorsllc@gmail.com',
  // No verified street address yet — areaServed is used instead.
  // Update with full PostalAddress once confirmed for full LocalBusiness schema.
  areaServed: [
    { name: 'North Texas', sameAs: 'https://en.wikipedia.org/wiki/North_Texas' },
    { name: 'West Texas', sameAs: 'https://en.wikipedia.org/wiki/West_Texas' },
    { name: 'Texas Panhandle', sameAs: 'https://en.wikipedia.org/wiki/Texas_Panhandle' },
    { name: 'Red River Region', sameAs: 'https://en.wikipedia.org/wiki/Red_River_of_the_South' },
    { name: 'Oklahoma', sameAs: 'https://en.wikipedia.org/wiki/Oklahoma' }
  ],
  // 940 area code centers on Wichita Falls, TX — used for geo coordinates
  // until a verified street address is provided. Replace with real coords if/when
  // a brick-and-mortar address is added.
  geoCenter: { latitude: 33.9137, longitude: -98.4934, name: 'Wichita Falls, TX' },
  social: {
    facebook: 'https://www.facebook.com/4BGarageDoors'
  },
  // Used as priceRange in LocalBusiness schema. Required by Google for some local rich results.
  priceRange: '$$',
  // Hours not published; using 24/7 emergency-availability convention common for repair trades.
  // Update when business publishes formal hours.
  hours: 'Mo-Sa 07:00-19:00'
} as const;

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  breadcrumb: ReadonlyArray<{ name: string; path: string }>;
}

export const ROUTES = {
  home: {
    // Title length kept ≤65 chars so Google won't truncate it on most SERP widths.
    path: '/',
    title: 'Garage Door Repair & Install — West & North TX | 4B Overhead',
    description: 'Family-owned, fully insured garage door installation, repair, and maintenance across West & North Texas. Residential, commercial, and TxDOT projects. Call (940) 781-1186.',
    breadcrumb: [{ name: 'Home', path: '/' }]
  },
  work: {
    path: '/work',
    title: 'Our Work — Texas Garage Door Projects | 4B Overhead Doors',
    description: 'Browse recent residential and commercial garage door installs, repairs, and new builds across West & North Texas by 4B Overhead Doors, LLC.',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Our Work', path: '/work' }
    ]
  },
  serviceAreas: {
    path: '/service-areas',
    title: 'Service Areas — North & West Texas | 4B Overhead Doors',
    description: 'Garage door installation and repair across North & West Texas. Wichita Falls, Denton, Fort Worth, Dallas, Weatherford, Abilene, Vernon, and 8 more cities. Call (940) 781-1186.',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas' }
    ]
  },
  blog: {
    path: '/blog',
    title: 'Garage Door Tips & Guides — Blog | 4B Overhead Doors',
    description: 'Garage door buying guides, repair help, and maintenance tips for West & North Texas homeowners and businesses, from family-owned 4B Overhead Doors.',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' }
    ]
  }
} as const satisfies Record<string, RouteMeta>;

export type RouteKey = keyof typeof ROUTES;

/** Real Facebook reviews displayed on the homepage. Schema must match visible content. */
export const REVIEWS = [
  {
    author: 'Roland Conwell',
    date: '2026-06-29',
    rating: 5,
    body: "Had two insulated doors with openers installed by Colten. They fit perfectly with style and color ordered. I like that I can open/close either or both from my phone! Colten got here at time we chose, removed and got rid of old wooden doors and cleaned up well after finishing installation. The company was at the best price of 5 estimates received. I wish all businesses would do as good of work as Colten did! 5 out of 5!!"
  },
  {
    author: 'Becky Bartley Thornhill',
    date: '2026-06-28',
    rating: 5,
    body: "If you're in need of new garage doors we highly recommend Colten with 4B Overhead Doors. Colten was prompt every time he came to our house. He's very professional, precise, and we thought more than reasonable. It was good doing business with a company that returned my calls and wanted to do a good job. Thank you Colten!"
  },
  {
    author: 'Nancy Shahan',
    date: '2025-11-17',
    rating: 5,
    body: "If you need your overhead doors repaired or replaced this is the man to call, Colten Beaty! He definitely knows what he's doing. Very courteous and efficient. Thanks again Colten! Both doors are working great."
  },
  {
    author: 'Amy Hageman Henderson',
    date: '2025-11-16',
    rating: 5,
    body: "Colten came to the rescue last minute on a Saturday to fix a garage door that the cable had locked up on. He was very professional, affordable and communicated clearly. He also suggested we tighten the tension so the door didn't open and close so fast. 10/10 recommend!"
  },
  {
    author: 'Jonathan Birkenfeld',
    date: '2025-11-16',
    rating: 5,
    body: "Colten did great work installing the doors! Very professional and communicated very well through the process of the project. Would definitely recommend him to anyone in the market for a door."
  }
] as const;

/** FAQ content used both for the visible page section AND FAQPage JSON-LD. Must stay in sync. */
export const FAQS = [
  {
    q: 'What areas does 4B Overhead Doors serve?',
    a: 'We serve West Texas, North Texas, the Texas Panhandle, and the Red River region from our base in the Wichita Falls area. We also travel for projects in surrounding states including Oklahoma — call (940) 781-1186 if you are nearby and we will let you know if we can be there.'
  },
  {
    q: 'Do you handle both residential and commercial garage doors?',
    a: 'Yes. We install and repair residential garage doors for homeowners as well as heavy-duty commercial overhead doors for warehouses, shops, and industrial sites — including TxDOT highway department projects.'
  },
  {
    q: 'How fast can you respond to a broken garage door?',
    a: 'For repairs we aim to respond same-day or next-day across our core service area whenever possible. Saturday and after-hours emergency calls are common for us — call (940) 781-1186 and we will give you an honest ETA.'
  },
  {
    q: 'Are you licensed and insured?',
    a: 'Yes. 4B Overhead Doors, LLC is a fully insured Texas business. We carry liability coverage on every job so your property is protected during installations and repairs.'
  },
  {
    q: 'How much does a new garage door cost?',
    a: 'Pricing depends on door size, material, insulation, opener, and whether you need a single or double bay. Residential doors typically start in the low four figures installed; commercial overhead doors vary widely. We provide free, no-obligation quotes — call or fill out the contact form for an accurate price for your project.'
  },
  {
    q: 'My garage door spring broke — can you fix it today?',
    a: 'Garage door springs are under high tension and should not be DIY-replaced. Call (940) 781-1186 and we will prioritize spring repairs in our schedule. Most spring jobs in our service area can be completed within 24 hours.'
  },
  {
    q: 'Do you do new construction installs?',
    a: 'Yes — we work directly with builders, general contractors, and homeowners on new construction. We can spec the right door for your build, supply the unit, and complete the install on schedule.'
  },
  {
    q: 'Who runs 4B Overhead Doors?',
    a: '4B Overhead Doors is a family-owned business operated by Colten Beaty. Every job is handled directly by our team — no call centers, no subcontracting your install to someone you have never met.'
  }
] as const;
