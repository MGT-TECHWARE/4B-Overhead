/**
 * Post-build SEO step. Runs after `vite build`.
 *
 * Responsibilities:
 *   1. Inject route-specific <title>, <meta description>, canonical, Open Graph,
 *      Twitter, and JSON-LD into dist/index.html (the home route).
 *   2. Generate dist/<route>/index.html for every non-home route, with that
 *      route's own metadata. Cloudflare Pages serves these automatically when
 *      the URL matches; the SPA fallback in _redirects still handles deeper
 *      client-side navigations.
 *   3. Emit dist/sitemap.xml from the route table.
 *
 * Single source of truth: src/seo/site.ts and src/seo/jsonld.ts.
 *
 * Run with: tsx scripts/post-build.mts
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, ROUTES, type RouteKey } from '../src/seo/site';
import { CITIES, type City } from '../src/seo/cities';
import { POSTS, type BlogPostMeta } from '../src/seo/posts';
import {
  jsonLdString,
  jsonLdStringCity,
  jsonLdStringPost,
  cityTitle,
  cityDescription
} from '../src/seo/jsonld';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

interface RouteHeadInputs {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  jsonLd: string;
}

interface AssetIndex {
  /** Desktop hero (1280w) hashed URL. */
  hero?: string;
  /** Mobile hero (768w) hashed URL. */
  heroMobile?: string;
  /** Latin variable Inter woff2 hashed URL — first byte the page actually needs. */
  fontLatin?: string;
  /** Compiled CSS contents to inline into <head> (removes the render-blocking link). */
  inlineCss?: { href: string; source: string };
}

/**
 * Discover the hashed asset filenames Vite produced this build so we can
 * preload them from <head> ahead of CSS/JS parse. Falls back gracefully if
 * the matchers find nothing (e.g. renamed imports).
 */
async function buildAssetIndex(distRoot: string): Promise<AssetIndex> {
  const { readdir } = await import('node:fs/promises');
  try {
    const files = await readdir(join(distRoot, 'assets'));
    const heroMobile = files.find(f => /^hero-garage-768-[\w-]+\.webp$/.test(f));
    // Match desktop hero only — exclude the -768- mobile variant.
    const hero = files.find(
      f => /^hero-garage-[\w-]+\.webp$/.test(f) && !/^hero-garage-768/.test(f)
    );
    // The latin variable-axis Inter weight file is what English text needs.
    // @fontsource-variable/inter emits inter-latin-wght-normal-XXXX.woff2.
    const fontLatin = files.find(f => /^inter-latin-wght-normal-[\w-]+\.woff2$/.test(f));

    // Find the compiled CSS file and read it for inlining into <head>.
    const cssFile = files.find(f => /^index-[\w-]+\.css$/.test(f));
    let inlineCss: AssetIndex['inlineCss'];
    if (cssFile) {
      const source = await readFile(join(distRoot, 'assets', cssFile), 'utf8');
      inlineCss = { href: `/assets/${cssFile}`, source };
    }

    return {
      hero: hero ? `/assets/${hero}` : undefined,
      heroMobile: heroMobile ? `/assets/${heroMobile}` : undefined,
      fontLatin: fontLatin ? `/assets/${fontLatin}` : undefined,
      inlineCss
    };
  } catch {
    return {};
  }
}

function buildHead(inputs: RouteHeadInputs, opts?: { assets?: AssetIndex; isHome?: boolean }): string {
  const { title, description, canonical, ogUrl, jsonLd } = inputs;

  const preloads: string[] = [];

  // Font preload runs on every route — Inter is the body font sitewide.
  if (opts?.assets?.fontLatin) {
    preloads.push(
      `<link rel="preload" as="font" type="font/woff2" href="${opts.assets.fontLatin}" crossorigin />`
    );
  }

  // LCP image preload is home-only (hero only renders there).
  if (opts?.isHome && opts.assets?.hero) {
    const desktop = opts.assets.hero;
    const mobile = opts.assets.heroMobile;
    if (mobile) {
      preloads.push(
        `<link rel="preload" as="image" type="image/webp" imagesrcset="${mobile} 768w, ${desktop} 1280w" imagesizes="100vw" fetchpriority="high" />`
      );
    } else {
      preloads.push(
        `<link rel="preload" as="image" href="${desktop}" type="image/webp" fetchpriority="high" />`
      );
    }
  }

  const preloadTag = preloads.length ? preloads.join('\n    ') + '\n    ' : '';
  // Note: the existing index.html ships with placeholder <title> / og: tags.
  // We REPLACE those rather than append, to avoid duplicate-tag confusion in
  // SERPs and validators. The canonical and JSON-LD are appended (they don't
  // exist in the source).
  return `${preloadTag}<title>${title}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="4B Overhead Doors" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="4B Overhead Doors — premium residential and commercial garage doors in West and North Texas" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />

    <script type="application/ld+json">${jsonLd}</script>`;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function injectInto(template: string, head: string, inlineCss?: AssetIndex['inlineCss']): string {
  // Strip existing <title>, description, og:*, twitter:* (the placeholders in
  // public/index.html). Then insert our authoritative block right before </head>.
  let stripped = template
    .replace(/<title>[^<]*<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][^<]*<\/script>\s*/gi, '');

  if (inlineCss) {
    // Replace the render-blocking <link rel="stylesheet" href="/assets/index-*.css">
    // with an inline <style>. Saves the round-trip Lighthouse flagged under
    // "Render blocking requests". The CSS is small enough (~9 KiB gzipped) that
    // duplicating it across 23 routes is cheaper than the per-page RTT.
    const linkPattern = new RegExp(
      `<link\\s+rel=["']stylesheet["'][^>]*href=["']${inlineCss.href.replace(/[/.]/g, '\\$&')}["'][^>]*>\\s*`,
      'i'
    );
    stripped = stripped.replace(
      linkPattern,
      `<style data-vite-inlined-css>${inlineCss.source}</style>`
    );
  }

  return stripped.replace(/<\/head>/i, `    ${head}\n  </head>`);
}

function fullUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

async function processRoute(
  routeKey: RouteKey,
  indexTemplate: string,
  assets: AssetIndex
): Promise<string> {
  const route = ROUTES[routeKey];
  const canonical = fullUrl(route.path);
  const head = buildHead(
    {
      title: route.title,
      description: route.description,
      canonical,
      ogUrl: canonical,
      jsonLd: jsonLdString(routeKey)
    },
    { assets, isHome: routeKey === 'home' }
  );

  const html = injectInto(indexTemplate, head, assets.inlineCss);

  const outPath =
    route.path === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route.path.replace(/^\//, ''), 'index.html');

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  return outPath;
}

async function processCity(
  city: City,
  indexTemplate: string,
  assets: AssetIndex
): Promise<string> {
  const path = `/service-areas/${city.slug}`;
  const canonical = fullUrl(path);
  const head = buildHead(
    {
      title: cityTitle(city),
      description: cityDescription(city),
      canonical,
      ogUrl: canonical,
      jsonLd: jsonLdStringCity(city)
    },
    { assets, isHome: false }
  );

  const html = injectInto(indexTemplate, head, assets.inlineCss);
  const outPath = join(DIST, 'service-areas', city.slug, 'index.html');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  return outPath;
}

async function processPost(
  post: BlogPostMeta,
  indexTemplate: string,
  assets: AssetIndex
): Promise<string> {
  const path = `/blog/${post.slug}`;
  const canonical = fullUrl(path);
  const head = buildHead(
    {
      title: post.metaTitle,
      description: post.description,
      canonical,
      ogUrl: canonical,
      jsonLd: jsonLdStringPost(post)
    },
    { assets, isHome: false }
  );

  const html = injectInto(indexTemplate, head, assets.inlineCss);
  const outPath = join(DIST, 'blog', post.slug, 'index.html');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  return outPath;
}

async function generateSitemap(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const entries: Array<{ loc: string; priority: string; changefreq: string }> = [];

  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const route = ROUTES[key];
    entries.push({
      loc: fullUrl(route.path),
      priority: route.path === '/' ? '1.0' : '0.8',
      changefreq: route.path === '/' ? 'weekly' : 'monthly'
    });
  }
  for (const city of CITIES) {
    entries.push({
      loc: fullUrl(`/service-areas/${city.slug}`),
      priority: '0.7',
      changefreq: 'monthly'
    });
  }
  for (const post of POSTS) {
    entries.push({
      loc: fullUrl(`/blog/${post.slug}`),
      priority: '0.6',
      changefreq: 'monthly'
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  const outPath = join(DIST, 'sitemap.xml');
  await writeFile(outPath, xml, 'utf8');
  return outPath;
}

async function generateLlmsTxt(): Promise<string> {
  // Regenerate llms.txt with the live city roster so the LLM-facing roadmap
  // never drifts from the actual sitemap.
  const cityLines = CITIES.map(
    c => `- [${c.name}, TX](${SITE_URL}/service-areas/${c.slug}) — ${c.region}, ${c.county}`
  ).join('\n');

  const body = `# 4B Overhead Doors

> Family-owned, fully insured garage door installation, repair, and maintenance company serving West Texas, North Texas, the Texas Panhandle, and the Red River region. Residential, commercial, and TxDOT highway department projects. Operated by Colten Beaty. Phone: (940) 781-1186.

## About

- Legal name: 4B Overhead Doors, LLC
- Owner / Operator: Colten Beaty
- Phone: (940) 781-1186
- Email (business): 4boverheaddoorsllc@gmail.com
- Service area: West Texas, North Texas, Texas Panhandle, Red River region; will travel to Oklahoma and surrounding states
- Status: Family-owned, fully insured
- Notable clients: Texas Department of Transportation (TxDOT) highway department projects

## Services

- Residential garage door installation
- Commercial overhead door installation (heavy-duty, industrial)
- Garage door repair & maintenance (springs, cables, openers, panels)
- Garage door spring repair (emergency)
- New construction installs (works with builders / GCs)

## Core pages

- [Home](${SITE_URL}/): services overview, why-us, reviews, FAQ, contact form
- [Our Work](${SITE_URL}/work): photo gallery of recent residential and commercial installs
- [Service Areas](${SITE_URL}/service-areas): full list of cities served across North & West Texas
- [Blog](${SITE_URL}/blog): garage door buying guides, repair help, and maintenance tips

## Blog articles (${POSTS.length})

${POSTS.map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug})`).join('\n')}

## City pages (${CITIES.length})

${cityLines}

## Optional

- [Facebook reviews](https://www.facebook.com/4BGarageDoors/reviews)
`;
  const outPath = join(DIST, 'llms.txt');
  await writeFile(outPath, body, 'utf8');
  return outPath;
}

async function main(): Promise<void> {
  const indexTemplatePath = join(DIST, 'index.html');
  const indexTemplate = await readFile(indexTemplatePath, 'utf8');

  const assets = await buildAssetIndex(DIST);
  console.log('[post-build] assets:', assets);

  const written: string[] = [];
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    written.push(await processRoute(key, indexTemplate, assets));
  }
  for (const city of CITIES) {
    written.push(await processCity(city, indexTemplate, assets));
  }
  for (const post of POSTS) {
    written.push(await processPost(post, indexTemplate, assets));
  }
  written.push(await generateSitemap());
  written.push(await generateLlmsTxt());

  console.log(`[post-build] wrote ${written.length} files`);
  for (const p of written) console.log('  -', p);
}

main().catch((err: unknown) => {
  console.error('[post-build] failed:', err);
  process.exit(1);
});
