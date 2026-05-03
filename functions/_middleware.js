const ROBOTS = `# 4B Overhead Doors — robots.txt
# Allow all reputable crawlers, including AI search bots, by default.
# Reference: https://developers.google.com/search/docs/crawling-indexing/robots/intro

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://4boverheaddoors.com/sitemap.xml
`;

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === '/robots.txt') {
    return new Response(ROBOTS, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }
  return context.next();
}
