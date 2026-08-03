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
import { SERVICES, type ServiceDef } from './services';
import { POSTS, type BlogPostMeta, type BlogFaq } from './posts';

const BUSINESS_ID = `${SITE_URL}/#business`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#colten-beaty`;

/**
 * Absolute URL for a PAGE path — always with a trailing slash.
 *
 * Cloudflare Pages serves `dist/<path>/index.html` at `/<path>/` and issues a
 * 308 from `/<path>` to `/<path>/`. Emitting the slash-less form here made
 * every canonical, og:url, and sitemap entry point at a URL that redirects,
 * which is what split `/work` and `/work/` into two entries in Search Console.
 * Canonicals must name the URL that actually returns 200.
 *
 * Do NOT use this for file URLs (og-image.jpg, icon-512.png) — those are real
 * files and must not gain a slash.
 */
function url(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path}/`;
}

function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.shortName,
    url: url('/'),
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
    url: url('/'),
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
    url: url('/'),
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
  return faqNodeFrom(FAQS);
}

function faqNodeFrom(faqs: ReadonlyArray<BlogFaq>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Blog index node — lists every article so search engines see the collection. */
function blogNode() {
  return {
    '@type': 'Blog',
    '@id': `${url('/blog')}#blog`,
    url: url('/blog'),
    name: 'Garage Door Tips & Guides',
    description: ROUTES.blog.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    blogPost: POSTS.map(p => ({
      '@type': 'BlogPosting',
      '@id': `${url(`/blog/${p.slug}`)}#article`,
      headline: p.title,
      url: url(`/blog/${p.slug}`),
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      author: { '@id': PERSON_ID },
      image: OG_IMAGE
    }))
  };
}

/** Per-article BlogPosting node. */
function blogPostingNode(post: BlogPostMeta) {
  const postUrl = url(`/blog/${post.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    image: OG_IMAGE,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${postUrl}#webpage` },
    isPartOf: { '@id': `${url('/blog')}#blog` },
    articleSection: post.category,
    keywords: post.primaryKeyword,
    inLanguage: 'en-US'
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
      '@id': `${url(`/service-areas/${city.slug}`)}#service-residential`,
      name: `Residential Garage Door Installation in ${cityName}`,
      serviceType: 'Garage door installation',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${url(`/service-areas/${city.slug}`)}#service-commercial`,
      name: `Commercial Overhead Door Installation in ${cityName}`,
      serviceType: 'Commercial overhead door installation',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${url(`/service-areas/${city.slug}`)}#service-repair`,
      name: `Garage Door Repair & Maintenance in ${cityName}`,
      serviceType: 'Garage door repair',
      ...baseService
    },
    {
      '@type': 'Service',
      '@id': `${url(`/service-areas/${city.slug}`)}#service-springs`,
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

  if (routeKey === 'blog') {
    baseGraph.push(blogNode());
  }

  if (routeKey === 'services') {
    // The hub page lists every service, so declare them as an ItemList that
    // points at the individual /services/* pages.
    baseGraph.push({
      '@type': 'ItemList',
      '@id': `${url('/services')}#servicelist`,
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.name,
        url: url(`/services/${s.slug}`)
      }))
    });
  }

  if (routeKey === 'about') {
    // Bind the page to the Person entity — this is the E-E-A-T signal that a
    // real, named operator stands behind the work.
    baseGraph.push({
      '@type': 'AboutPage',
      '@id': `${url('/about')}#aboutpage`,
      url: url('/about'),
      name: ROUTES.about.title,
      mainEntity: { '@id': PERSON_ID },
      about: { '@id': BUSINESS_ID },
      isPartOf: { '@id': WEBSITE_ID }
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': baseGraph
  };
}

/**
 * Compose the @graph for a single service landing page.
 *
 * The Service node names the LocalBusiness as `provider` rather than restating
 * the business details, so there is exactly one business entity in the graph
 * and Google can resolve the reference across pages.
 */
export function jsonLdGraphService(service: ServiceDef): object {
  const path = `/services/${service.slug}`;
  const serviceUrl = url(path);
  const route: RouteMeta = {
    path,
    title: service.metaTitle,
    description: service.description,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.shortName, path }
    ]
  };

  const graph: object[] = [
    organizationNode(),
    personNode(),
    websiteNode(),
    localBusinessNode(),
    webpageNode(route),
    {
      '@type': 'Service',
      '@id': `${serviceUrl}#service`,
      name: service.name,
      description: service.description,
      serviceType: service.shortName,
      provider: { '@id': BUSINESS_ID },
      areaServed: BUSINESS.areaServed.map(a => ({
        '@type': 'AdministrativeArea',
        name: a.name,
        sameAs: a.sameAs
      })),
      // No price/priceCurrency: every quote is site-specific, and publishing a
      // number we can't honor is worse than publishing none.
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          description: service.pricing
        }
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.shortName} — what's included`,
        itemListElement: service.includes.map(item => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: item }
        }))
      }
    }
  ];

  if (service.faqs.length > 0) {
    graph.push(faqNodeFrom(service.faqs));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

export function serviceTitle(service: ServiceDef): string {
  return service.metaTitle;
}

export function serviceDescription(service: ServiceDef): string {
  return service.description;
}

export function jsonLdStringService(service: ServiceDef): string {
  return JSON.stringify(jsonLdGraphService(service));
}

/** Compose the @graph for a single blog article. */
export function jsonLdGraphPost(post: BlogPostMeta): object {
  const path = `/blog/${post.slug}`;
  const route: RouteMeta = {
    path,
    title: post.metaTitle,
    description: post.description,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path }
    ]
  };

  const graph: object[] = [
    organizationNode(),
    personNode(),
    websiteNode(),
    webpageNode(route),
    blogPostingNode(post)
  ];

  if (post.faqs.length > 0) {
    graph.push(faqNodeFrom(post.faqs));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
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

export function jsonLdStringPost(post: BlogPostMeta): string {
  return JSON.stringify(jsonLdGraphPost(post), null, 2);
}
