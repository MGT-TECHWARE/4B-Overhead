/**
 * Resolves a blog post slug to its generated hero image URL
 * (src/assets/blog/<slug>.webp, produced by scripts/gen-images.ts).
 * Returns undefined if a hero hasn't been generated yet, so callers can
 * fall back to a gallery photo.
 */

const urls = import.meta.glob('../assets/blog/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

export function blogHeroUrl(slug: string): string | undefined {
  return urls[`../assets/blog/${slug}.webp`];
}
