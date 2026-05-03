#!/usr/bin/env node
/**
 * One-shot image optimizer. Walks src/assets and re-encodes oversized
 * .webp files to smaller dimensions + lower quality. Writes back in place
 * (after a `git status` check elsewhere — caller should commit before/after).
 *
 * Targets:
 *   - hero / process / why / gallery photos:  cap 1280px on the long edge, q=78
 *   - service cards:                          cap 1280×720,                q=78
 *
 * Skips a file if the optimized output would be larger than the original.
 *
 * Usage:  node scripts/optimize-images.mjs
 *
 * This is intentionally NOT wired into npm run build — run it manually when
 * source images change, then commit the resized files.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIRS = [join(ROOT, 'src/assets'), join(ROOT, 'src/assets/gallery')];

/** Per-name caps. Falls back to DEFAULT for anything unmatched. */
const RULES = [
  // Cards display at ~362×362 (or 362×277) in 2-col grid. 540 wide ≈ 1.5×
  // DPR — Lighthouse stops flagging "image larger than displayed" at this
  // ratio while still looking sharp on retina screens at the displayed size.
  { match: /^card-/, maxW: 540, maxH: 540, quality: 74 },
  { match: /^hero-/, maxW: 1920, maxH: 1280, quality: 80 },
  // Process cards display at ~461×346 desktop (DPR=1) / ~276×368 for the
  // tall variant. 540 wide covers 2× DPR cleanly.
  { match: /^process-/, maxW: 540, maxH: 720, quality: 74 },
  // Why-rotator displays at ~364×485. 600 wide ≈ 1.65× DPR.
  { match: /^why-/, maxW: 600, maxH: 800, quality: 74 },
  // Logo displays at h-20/h-24 (≤96px tall = ~176×96). 400 wide covers 2×
  // DPR for both header and footer placements.
  { match: /^4b-logo/, maxW: 400, maxH: 220, quality: 80 },
  // Gallery: cap to 1280 long-edge so single-image lightbox still looks good
  // on desktop, but tiles in the masonry won't blow past 4× display size.
  { match: /^image|copy|^Screenshot/i, maxW: 1280, maxH: 1280, quality: 76 }
];
const DEFAULT_RULE = { maxW: 1600, maxH: 1600, quality: 78 };

function ruleFor(filename) {
  return RULES.find(r => r.match.test(filename)) ?? DEFAULT_RULE;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Don't recurse — we list each target dir explicitly to avoid
      // accidentally hitting node_modules or build artifacts.
      continue;
    }
    if (entry.isFile() && extname(entry.name).toLowerCase() === '.webp') {
      yield path;
    }
  }
}

function fmt(bytes) {
  return bytes >= 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${bytes} B`;
}

async function optimizeOne(absPath) {
  const buf = await readFile(absPath);
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height) return null;

  const filename = basename(absPath);
  const rule = ruleFor(filename);
  const beforeBytes = buf.length;

  const needsResize = meta.width > rule.maxW || meta.height > rule.maxH;
  // Even if dimensions are fine, re-encode if file is unusually heavy
  const heavy = beforeBytes > 220 * 1024;

  if (!needsResize && !heavy) {
    return { path: absPath, skipped: 'already small enough', beforeBytes };
  }

  let pipeline = sharp(buf);
  if (needsResize) {
    pipeline = pipeline.resize({
      width: rule.maxW,
      height: rule.maxH,
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  pipeline = pipeline.webp({ quality: rule.quality, effort: 5 });

  const out = await pipeline.toBuffer({ resolveWithObject: true });
  const afterBytes = out.data.length;

  if (afterBytes >= beforeBytes) {
    return { path: absPath, skipped: 'no improvement', beforeBytes, afterBytes };
  }

  await writeFile(absPath, out.data);
  return {
    path: absPath,
    beforeBytes,
    afterBytes,
    beforeWH: { w: meta.width, h: meta.height },
    afterWH: { w: out.info.width, h: out.info.height }
  };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;
  let skipped = 0;

  for (const dir of ASSETS_DIRS) {
    let exists = false;
    try {
      await stat(dir);
      exists = true;
    } catch {
      // directory doesn't exist — skip
    }
    if (!exists) continue;

    for await (const absPath of walk(dir)) {
      const r = await optimizeOne(absPath);
      if (!r) continue;
      const rel = relative(ROOT, absPath);

      if (r.skipped) {
        skipped++;
        continue;
      }
      touched++;
      totalBefore += r.beforeBytes;
      totalAfter += r.afterBytes;
      const dims =
        r.beforeWH.w !== r.afterWH.w || r.beforeWH.h !== r.afterWH.h
          ? `  ${r.beforeWH.w}×${r.beforeWH.h} → ${r.afterWH.w}×${r.afterWH.h}`
          : '';
      console.log(
        `  ${rel}: ${fmt(r.beforeBytes)} → ${fmt(r.afterBytes)} (-${(((r.beforeBytes - r.afterBytes) / r.beforeBytes) * 100).toFixed(0)}%)${dims}`
      );
    }
  }

  console.log('');
  console.log(
    `Optimized ${touched} files (${skipped} skipped). Saved ${fmt(totalBefore - totalAfter)} of ${fmt(totalBefore)} (${(
      ((totalBefore - totalAfter) / Math.max(totalBefore, 1)) *
      100
    ).toFixed(1)}%).`
  );
}

main().catch(err => {
  console.error('[optimize-images] failed:', err);
  process.exit(1);
});
