/**
 * Resolves gallery photo filenames (e.g. "image-copy-25.webp") to their hashed
 * Vite asset URLs. The blog reuses the same /assets/gallery photos the Work
 * gallery uses, so hero + inline images never need new files.
 */

const urls = import.meta.glob('../assets/gallery/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

export function galleryUrl(file: string): string | undefined {
  return urls[`../assets/gallery/${file}`];
}
