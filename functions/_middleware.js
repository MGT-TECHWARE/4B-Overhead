/**
 * Serves /robots.txt through a Pages Function.
 *
 * Why this exists: on *.pages.dev preview domains Cloudflare substitutes its
 * own deny-all robots.txt, which would deindex the site if that domain is the
 * one being crawled. Answering the request here wins over that substitution.
 *
 * The body is deliberately NOT duplicated here — it is read from the deployed
 * public/robots.txt through the ASSETS binding, so that file stays the single
 * source of truth. Previously this file carried its own hardcoded copy, which
 * silently drifted out of sync with public/robots.txt. If the binding is ever
 * unavailable we fall through to normal static serving rather than 500ing the
 * crawler.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname === '/robots.txt') {
    try {
      const asset = await context.env.ASSETS.fetch(
        new Request(new URL('/robots.txt', url.origin), { method: 'GET' })
      );
      if (asset.ok) {
        return new Response(asset.body, {
          status: 200,
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=86400, s-maxage=86400',
          },
        });
      }
    } catch {
      // Fall through to context.next() below.
    }
  }

  return context.next();
}
