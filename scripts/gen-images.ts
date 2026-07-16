/**
 * Blog hero image generation for 4B Overhead Doors via Google Imagen-4
 * (Standard), with Nano Banana as a fallback. Reads GEMINI_API_KEY from .env
 * or process.env. Outputs optimized 16:9 webp heroes to src/assets/blog/<slug>.webp.
 *
 * Run: npm run gen:images
 *      FORCE=1 npm run gen:images          # overwrite existing files
 *      ONLY=barndominium npm run gen:images # only prompts whose slug matches
 *
 * One prompt = one blog hero. Keep this the single source of truth for the
 * prompts so heroes can be re-rolled reproducibly (rm the file, re-run).
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

// --- minimal .env loader (no extra deps) ---
function loadEnv() {
  const p = resolve('.env');
  if (!existsSync(p)) return;
  const text = readFileSync(p, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, '');
  }
}
loadEnv();

interface Prompt {
  slug: string;
  prompt: string;
}

const NO_TEXT =
  'Absolutely no text, no words, no letters, no numbers, no logos, no captions, no watermarks, no signs anywhere in the image.';
const SETTING =
  'Real photograph, American West Texas / North Texas setting. No European architecture, no Mediterranean coast, no harbor, no fashion photography, no fantasy art, no AI illustration.';

// One 16:9 hero per article. Lead with a concrete noun subject (Rule 4),
// American Texas negatives (Rule 3), full no-text stack (Rule 2).
const PROMPTS: Prompt[] = [
  {
    slug: 'garage-door-cost-texas',
    prompt:
      'Cinematic wide photograph of a brand-new light gray two-car sectional garage door on a tan brick single-story suburban Texas home, clean concrete driveway in the foreground, bright clear daytime light, subject slightly right of center. Premium real-estate editorial photography, sharp detail. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'broken-garage-door-spring-signs',
    prompt:
      'Close-up documentary photograph inside a residential garage of a broken torsion spring on the steel shaft mounted above a white garage door, a clear gap where the coiled metal spring has snapped apart, garage door hardware and cables visible, natural light from the open door. Real repair photograph, sharp focus on the broken spring. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'garage-door-wont-open',
    prompt:
      'Documentary photograph looking up at a ceiling-mounted garage door opener motor unit and metal rail inside a clean residential garage, the red manual release cord hanging from the trolley, a partially raised sectional garage door in the background, daytime light. Real photograph, sharp detail. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'insulated-vs-non-insulated-garage-doors',
    prompt:
      'Photograph of the inside face of a closed insulated sectional garage door seen from within a tidy residential garage, showing the layered steel panels, horizontal reinforcement struts, and rubber bottom weather seal, soft daylight. Real interior photograph, clean and detailed. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'best-garage-door-texas-heat',
    prompt:
      'Cinematic wide photograph of a modern dark charcoal steel two-car garage door on a stone-and-brick Texas home under intense bright summer sun and a deep blue sky, strong shadows, heat haze in the distance, subject slightly right of center. Premium editorial photography. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'commercial-overhead-door-types',
    prompt:
      'Wide photograph of a Texas commercial metal building exterior with several large steel overhead bay doors, one rolling steel door and one sectional door, loading area and concrete apron in front, bright daytime light. Real industrial documentary photograph, clean composition. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'garage-door-opener-guide',
    prompt:
      'Clean product-style photograph of a modern white garage door opener motor head mounted to the ceiling of a residential garage with a belt-drive rail extending toward the door, wall control button visible, soft even light. Real photograph, sharp detail. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'garage-door-maintenance-checklist',
    prompt:
      'Close-up documentary photograph of a gloved hand spraying silicone lubricant onto the roller and hinge of a white sectional garage door track inside a residential garage, fine spray mist visible, natural daylight. Real maintenance photograph, sharp focus on the roller and hinge. ' +
      SETTING + ' ' + NO_TEXT
  },
  {
    slug: 'barndominium-garage-doors',
    prompt:
      'Wide photograph of a modern Texas barndominium metal building with two large garage doors on the front, standing seam metal roof, gravel drive, wide open rural landscape and blue sky behind it, late afternoon light. Real architectural documentary photograph. ' +
      SETTING + ' ' + NO_TEXT
  }
];

// --- Imagen 4 (Standard) — more faithful to prompts than the Fast variant ---
const IMAGEN_MODEL = 'imagen-4.0-generate-001';
const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;
const NANO_MODEL = 'gemini-2.5-flash-image';
const NANO_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${NANO_MODEL}:generateContent`;

const OUT_DIR = 'src/assets/blog';
const ASPECT = '16:9';

interface ImagenResponse {
  predictions?: { bytesBase64Encoded?: string; mimeType?: string }[];
  error?: { message?: string; code?: number };
}

/**
 * Some Google credentials are query-key API keys (?key=), others are OAuth
 * bearer tokens (Authorization: Bearer). Try key-in-query first; on an auth
 * error, retry with a Bearer header so either credential form works.
 */
async function postJson(endpoint: string, body: unknown): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const asKey = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (asKey.status !== 401 && asKey.status !== 403) return asKey;
  // Retry as a bearer token.
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
}

async function callImagen(promptText: string): Promise<Buffer> {
  const body = {
    instances: [{ prompt: promptText }],
    parameters: { sampleCount: 1, aspectRatio: ASPECT, personGeneration: 'allow_adult' }
  };
  const res = await postJson(IMAGEN_ENDPOINT, body);
  const json = (await res.json()) as ImagenResponse;
  if (!res.ok) throw new Error(`Imagen HTTP ${res.status}: ${json.error?.message ?? 'unknown'}`);
  const b64 = json.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('No image data in Imagen response');
  return Buffer.from(b64, 'base64');
}

interface GeminiPart {
  inlineData?: { mimeType: string; data: string };
  inline_data?: { mime_type: string; data: string };
}
interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
  error?: { message?: string };
  promptFeedback?: { blockReason?: string };
}

async function callNanoBanana(promptText: string): Promise<Buffer> {
  const body = {
    contents: [{ role: 'user', parts: [{ text: `${promptText}\n\nAspect ratio: ${ASPECT}.` }] }],
    generationConfig: { responseModalities: ['IMAGE'] }
  };
  const res = await postJson(NANO_ENDPOINT, body);
  const json = (await res.json()) as GeminiResponse;
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${json.error?.message ?? 'unknown'}`);
  if (json.promptFeedback?.blockReason) throw new Error(`Blocked: ${json.promptFeedback.blockReason}`);
  for (const p of json.candidates?.[0]?.content?.parts ?? []) {
    const inline = p.inlineData ?? p.inline_data;
    if (inline?.data) return Buffer.from(inline.data, 'base64');
  }
  throw new Error('No image data');
}

async function generate(promptText: string): Promise<{ buf: Buffer; via: string }> {
  try {
    return { buf: await callImagen(promptText), via: IMAGEN_MODEL };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/billing|quota|permission|disabled|not found|403|400|404/i.test(message)) {
      console.log(`    (imagen unavailable: ${message.slice(0, 90)} — falling back to nano-banana)`);
      return { buf: await callNanoBanana(promptText), via: 'nano-banana' };
    }
    throw err;
  }
}

// --- main ---
const force = process.env.FORCE === '1';
const only = process.env.ONLY;

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Add it to .env or export it before running.');
  process.exit(1);
}

mkdirSync(resolve(OUT_DIR), { recursive: true });
console.log(`gen:images — ${PROMPTS.length} blog heroes (primary: ${IMAGEN_MODEL}, fallback: ${NANO_MODEL})`);

let generated = 0;
let skipped = 0;
let failed = 0;

for (const p of PROMPTS) {
  if (only && !p.slug.includes(only)) {
    skipped++;
    continue;
  }
  const outPath = resolve(OUT_DIR, `${p.slug}.webp`);
  if (existsSync(outPath) && !force) {
    console.log(`  skip (exists): ${p.slug}.webp`);
    skipped++;
    continue;
  }
  try {
    process.stdout.write(`  → ${p.slug}.webp (${ASPECT}) ... `);
    const { buf, via } = await generate(p.prompt);
    const webp = await sharp(buf).resize(1600, 900, { fit: 'cover' }).webp({ quality: 80 }).toBuffer();
    writeFileSync(outPath, webp);
    console.log(`✓ ${Math.round(webp.length / 1024)}KB via ${via}`);
    generated++;
    await new Promise(r => setTimeout(r, 1200)); // soft throttle
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`✗ ${message}`);
    failed++;
  }
}

console.log(`\nDone. Generated: ${generated}, skipped: ${skipped}, failed: ${failed}`);
if (failed > 0) process.exit(1);
