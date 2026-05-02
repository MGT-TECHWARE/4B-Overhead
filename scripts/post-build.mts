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
import { jsonLdString } from '../src/seo/jsonld';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

interface RouteHeadInputs {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  jsonLd: string;
}

function buildHead(inputs: RouteHeadInputs): string {
  const { title, description, canonical, ogUrl, jsonLd } = inputs;
  // Note: the existing index.html ships with placeholder <title> / og: tags.
  // We REPLACE those rather than append, to avoid duplicate-tag confusion in
  // SERPs and validators. The canonical and JSON-LD are appended (they don't
  // exist in the source).
  return `<title>${title}</title>
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

function injectInto(template: string, head: string): string {
  // Strip existing <title>, description, og:*, twitter:* (the placeholders in
  // public/index.html). Then insert our authoritative block right before </head>.
  const stripped = template
    .replace(/<title>[^<]*<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][^<]*<\/script>\s*/gi, '');

  return stripped.replace(/<\/head>/i, `    ${head}\n  </head>`);
}

function fullUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

async function processRoute(routeKey: RouteKey, indexTemplate: string): Promise<string> {
  const route = ROUTES[routeKey];
  const canonical = fullUrl(route.path);
  const head = buildHead({
    title: route.title,
    description: route.description,
    canonical,
    ogUrl: canonical,
    jsonLd: jsonLdString(routeKey)
  });

  const html = injectInto(indexTemplate, head);

  const outPath =
    route.path === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route.path.replace(/^\//, ''), 'index.html');

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  return outPath;
}

async function generateSitemap(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const urls = (Object.keys(ROUTES) as RouteKey[]).map(key => {
    const route = ROUTES[key];
    return `  <url>
    <loc>${fullUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  const outPath = join(DIST, 'sitemap.xml');
  await writeFile(outPath, xml, 'utf8');
  return outPath;
}

async function main(): Promise<void> {
  const indexTemplatePath = join(DIST, 'index.html');
  const indexTemplate = await readFile(indexTemplatePath, 'utf8');

  const written: string[] = [];
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    written.push(await processRoute(key, indexTemplate));
  }
  written.push(await generateSitemap());

  console.log('[post-build] wrote:');
  for (const p of written) console.log('  -', p);
}

main().catch((err: unknown) => {
  console.error('[post-build] failed:', err);
  process.exit(1);
});
