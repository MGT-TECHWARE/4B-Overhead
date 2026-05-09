/**
 * JSON-LD generators. Each function returns a plain JS object that should be
 * stringified into <script type="application/ld+json">.
 *
 * Validate every block with Google's Rich Results Test and Schema.org Validator
 * after any change. Schema MUST match content visible on the page.
 */

import {
  SITE_URL,
  BUSINESS,
  ROUTES,
  REVIEWS,
  FAQS,
  type RouteKey,
  type RouteMeta
} from './site';
import type { City } from './cities';

const BUSINESS_ID = `${SITE_URL}/#business`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#colten-beaty`;

function url(path: string): string {
  if (path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.shortName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512
    },
    image: `${SITE_URL}/og-image.jpg`,
    telephone: BUSINESS.phone,
    email: BUSINESS.emailBusiness,
    founder: { '@id': PERSON_ID },
    sameAs: [BUSINESS.social.facebook]
  };
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: BUSINESS.founder,
    jobTitle: 'Owner & Lead Installer',
    worksFor: { '@id': ORG_ID },
    knowsAbout: [
      'Garage door installation',
      'Commercial overhead doors',
      'Garage door spring repair',
      'TxDOT highway department garage door projects'
    ]
  };
}

function localBusinessNode() {
  return {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': BUSINESS_ID,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.shortName,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/icon-512.png`,
    telephone: BUSINESS.phone,
    email: BUSINESS.emailBusiness,
    priceRange: BUSINESS.priceRange,
    description: 'Family-owned, fully insured garage door installation, repair, and maintenance company serving West Texas, North Texas, the Texas Panhandle, and the Red River region. Residential, commercial, and TxDOT projects.',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geoCenter.latitude,
      longitude: BUSINESS.geoCenter.longitude
    },
    areaServed: BUSINESS.areaServed.map(a => ({
      '@type': 'AdministrativeArea',
      name: a.name,
      sameAs: a.sameAs
    })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.geoCenter.name.split(', ')[0],
      addressRegion: 'TX',
      addressCountry: 'US'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '19:00'
      }
    ],
    founder: { '@id': PERSON_ID },
    parentOrganization: { '@id': ORG_ID },
    sameAs: [BUSINESS.social.facebook],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: REVIEWS.length,
      bestRating: '5',
      worstRating: '1'
    },
    review: REVIEWS.map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5'
      },
      reviewBody: r.body,
      publisher: { '@type': 'Organization', name: 'Facebook' }
    })),
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Residential Garage Door Installation',
          serviceType: 'Garage door installation',
          provider: { '@id': BUSINESS_ID },
          areaServed: BUSINESS.areaServed.map(a => a.name)
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commercial Overhead Door Installation',
          serviceType: 'Commercial overhead door installation',
          provider: { '@id': BUSINESS_ID },
          areaServed: BUSINESS.areaServed.map(a => a.name)
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Garage Door Repair & Maintenance',
          serviceType: 'Garage door repair',
          provider: { '@id': BUSINESS_ID },
          areaServed: BUSINESS.areaServed.map(a => a.name)
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Garage Door Spring Repair',
          serviceType: 'Garage door spring repair',
          provider: { '@id': BUSINESS_ID },
          areaServed: BUSINESS.areaServed.map(a => a.name)
        }
      }
    ]
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: BUSINESS.shortName,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US'
  };
}

function breadcrumbNode(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: url(item.path)
    }))
  };
}

function faqNode() {
  return {
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function webpageNode(route: RouteMeta) {
  return {
    '@type': 'WebPage',
    '@id': `${url(route.path)}#webpage`,
    url: url(route.path),
    name: route.title,
    description: route.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    breadcrumb: breadcrumbNode(route.breadcrumb),
    inLanguage: 'en-US',
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.jpg` }
  };
}

/**
 * Per-city LocalBusiness service node. Each city page advertises a
 * Service entity scoped to that city's geo so search engines can attach
 * the listing to local intent queries like "garage door repair in <city>".
 * The Service references the global LocalBusiness as its provider rather
 * than duplicating Reviews / AggregateRating, which avoids review-stuffing.
 */
function cityServiceNodes(city: City) {
  const cityName = `${city.name}, TX`;
  const baseService = {
    provider: { '@id': BUSINESS_ID },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: { '@type': 'AdministrativeArea', name: city.county }
    }
  };
  return [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service-areas/${city.slug}#service-residential`,
      name: `Residential Garage Door Installation in ${cityName}`,
      serviceType: 'Garage door installation',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service-areas/${city.slug}#service-commercial`,
      name: `Commercial Overhead Door Installation in ${cityName}`,
      serviceType: 'Commercial overhead door installation',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service-areas/${city.slug}#service-repair`,
      name: `Garage Door Repair & Maintenance in ${cityName}`,
      serviceType: 'Garage door repair',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service-areas/${city.slug}#service-springs`,
      name: `Garage Door Spring Repair in ${cityName}`,
      serviceType: 'Garage door spring repair',
      ...baseService
    }
  ];
}

/** Compose the @graph for a top-level static route (home / work / serviceAreas). */
export function jsonLdGraph(routeKey: RouteKey): object {
  const route = ROUTES[routeKey];
  const baseGraph: object[] = [
    organizationNode(),
    personNode(),
    websiteNode(),
    localBusinessNode(),
    webpageNode(route)
  ];

  if (routeKey === 'home') {
    baseGraph.push(faqNode());
  }

  return {
    '@context': 'https://schema.org',
    '@graph': baseGraph
  };
}

/** Compose the @graph for a city page. Includes city-scoped Service nodes. */
export function jsonLdGraphCity(city: City): object {
  const path = `/service-areas/${city.slug}`;
  const route: RouteMeta = {
    path,
    title: cityTitle(city),
    description: cityDescription(city),
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas' },
      { name: city.name, path }
    ]
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(),
      personNode(),
      websiteNode(),
      localBusinessNode(),
      webpageNode(route),
      ...cityServiceNodes(city),
      faqNode()
    ]
  };
}

/** Per-city <title>. Kept ≤65 visible chars where possible. */
export function cityTitle(city: City): string {
  return `Garage Door Repair & Install in ${city.name}, TX | 4B Overhead Doors`;
}

/** Per-city <meta description>. */
export function cityDescription(city: City): string {
  const where = city.nearby.length
    ? `${city.name}, ${city.county}, and surrounding communities including ${city.nearby.slice(0, 2).join(' and ')}`
    : `${city.name}, ${city.county}`;
  return `Garage door installation, repair, and spring service in ${where}. Family-owned, fully insured, residential & commercial. Free quotes — call (940) 781-1186.`;
}

/** Stable, pretty-printed JSON for embedding in <script type="application/ld+json">. */
export function jsonLdString(routeKey: RouteKey): string {
  return JSON.stringify(jsonLdGraph(routeKey), null, 2);
}

export function jsonLdStringCity(city: City): string {
  return JSON.stringify(jsonLdGraphCity(city), null, 2);
}
