import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, Phone, X } from 'lucide-react';
import { GALLERY } from './assets/gallery/manifest';
import { PROJECTS, type ProjectCategory } from './assets/gallery/projects';

// Vite returns a URL string for each .webp in /assets/gallery. We pair these
// with the manifest's intrinsic dimensions (needed for the justified layout
// math) and the per-photo labels in projects.ts (title / category).
const galleryUrls = import.meta.glob('./assets/gallery/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

interface GalleryItem {
  url: string;
  w: number;
  h: number;
  title: string;
  category: ProjectCategory;
  alt: string;
}

const metaByFile = new Map(PROJECTS.map(p => [p.file, p]));

const items: GalleryItem[] = GALLERY.map((entry, i) => {
  const meta = metaByFile.get(entry.file);
  const title = meta?.title ?? `Project ${i + 1}`;
  return {
    url: galleryUrls[`./assets/gallery/${entry.file}`],
    w: entry.w,
    h: entry.h,
    title,
    category: meta?.category ?? 'Residential',
    alt: `${title} — 4B Overhead Doors project`
  };
}).filter(x => !!x.url);

// Filter tabs: fixed order, only categories that actually have photos.
const CATEGORY_ORDER: ProjectCategory[] = ['Residential', 'Commercial', 'Repair', 'Openers'];
const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  Residential: 'Residential',
  Commercial: 'Commercial',
  Repair: 'Repairs',
  Openers: 'Openers'
};

type Filter = 'All' | ProjectCategory;

const categoryCounts = items.reduce<Record<string, number>>((acc, it) => {
  acc[it.category] = (acc[it.category] ?? 0) + 1;
  return acc;
}, {});

const filters: { key: Filter; label: string }[] = [
  { key: 'All', label: 'All Work' },
  ...CATEGORY_ORDER.filter(c => categoryCounts[c] > 0).map(c => ({
    key: c as Filter,
    label: CATEGORY_LABEL[c]
  }))
];

const INITIAL_BATCH = 30;
const BATCH_SIZE = 30;

// --- Justified rows layout (Flickr / Google Photos style) -------------------
interface Cell {
  item: GalleryItem;
  index: number;
  w: number;
  h: number;
}

function targetRowHeight(width: number): number {
  if (width < 500) return 150;
  if (width < 800) return 190;
  if (width < 1100) return 220;
  return 260;
}

function buildRows(list: GalleryItem[], containerWidth: number, gap: number): Cell[][] {
  if (containerWidth <= 0 || list.length === 0) return [];
  const target = targetRowHeight(containerWidth);
  const rows: Cell[][] = [];
  let row: GalleryItem[] = [];
  let indices: number[] = [];
  let aspectSum = 0;

  const flush = (justify: boolean) => {
    const gaps = gap * (row.length - 1);
    const h = justify ? (containerWidth - gaps) / aspectSum : target;
    rows.push(
      row.map((it, k) => ({ item: it, index: indices[k], w: (it.w / it.h) * h, h }))
    );
    row = [];
    indices = [];
    aspectSum = 0;
  };

  list.forEach((it, i) => {
    row.push(it);
    indices.push(i);
    aspectSum += it.w / it.h;
    const naturalWidth = aspectSum * target + gap * (row.length - 1);
    if (naturalWidth >= containerWidth) flush(true);
  });
  if (row.length) flush(false); // last row keeps target height, left-aligned

  return rows;
}

interface Lightbox {
  list: GalleryItem[];
  index: number;
}

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(
    () => (activeFilter === 'All' ? items : items.filter(i => i.category === activeFilter)),
    [activeFilter]
  );
  const visibleItems = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  const gap = containerWidth < 640 ? 6 : 8;
  const rows = useMemo(
    () => buildRows(visibleItems, containerWidth, gap),
    [visibleItems, containerWidth, gap]
  );

  // Measure the grid container width (before paint) and track resizes.
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const changeFilter = (f: Filter) => {
    setActiveFilter(f);
    setVisibleCount(INITIAL_BATCH);
  };

  // ---- Lightbox ----
  const openLightbox = (index: number) => setLightbox({ list: filtered, index });
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(
    () => setLightbox(lb => (lb ? { ...lb, index: (lb.index - 1 + lb.list.length) % lb.list.length } : lb)),
    []
  );
  const nextPhoto = useCallback(
    () => setLightbox(lb => (lb ? { ...lb, index: (lb.index + 1) % lb.list.length } : lb)),
    []
  );

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox, prevPhoto, nextPhoto]);

  const current = lightbox ? lightbox.list[lightbox.index] : null;

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-36 md:pt-44 pb-10 md:pb-12 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-7xl mx-auto relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Our Work</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95] mb-6">
            Real installs. <br />
            <span className="text-zinc-500">Real results.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-light leading-relaxed">
            {items.length}+ recent residential and commercial projects across West and North Texas — from new builds to repairs and full overhauls.
          </p>
        </div>
      </section>

      {/* Filters + justified photo wall */}
      <section className="py-8 md:py-10 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Filter tabs */}
        <div className="mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 md:gap-2 w-max md:w-auto">
            {filters.map(f => {
              const active = f.key === activeFilter;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => changeFilter(f.key)}
                  aria-pressed={active}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                    active
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo wall */}
        <div ref={gridRef} className="flex flex-col" style={{ gap }}>
          {rows.map((row, ri) => (
            <div key={ri} className="flex" style={{ gap }}>
              {row.map(cell => (
                <button
                  key={cell.item.url}
                  type="button"
                  onClick={() => openLightbox(cell.index)}
                  style={{ width: cell.w, height: cell.h }}
                  className="group relative block overflow-hidden bg-zinc-900 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  aria-label={`Open ${cell.item.title}`}
                >
                  <img
                    src={cell.item.url}
                    alt={cell.item.alt}
                    width={cell.item.w}
                    height={cell.item.h}
                    loading={cell.index < 10 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  {/* Minimal hover affordance — no persistent captions */}
                  <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/25 transition-colors duration-300 flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 drop-shadow" />
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 py-12">No photos in this category yet.</p>
        )}

        {remaining > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount(c => Math.min(c + BATCH_SIZE, filtered.length))}
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
            >
              Show more
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filtered.length)}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white underline decoration-zinc-700 hover:decoration-white underline-offset-4 transition-colors"
            >
              Show all {filtered.length}
            </button>
          </div>
        )}
      </section>

      {/* CTA Strip */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Like what you see?</h2>
          <p className="text-zinc-400 mb-8 font-light">Get in touch for a free quote on your next project.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/#contact"
              className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
            >
              GET A FREE QUOTE <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:9407811186"
              className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
            >
              <Phone className="w-4 h-4" /> CALL NOW
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-widest backdrop-blur-sm">
            {lightbox.index + 1} / {lightbox.list.length}
          </div>

          {lightbox.list.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="hidden sm:flex absolute left-3 md:left-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <figure className="flex flex-col items-center max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.url}
              alt={current.alt}
              width={current.w}
              height={current.h}
              className="max-h-[78vh] max-w-[92vw] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="mt-4 text-center">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 bg-white px-2.5 py-1 rounded-full mb-2">
                {CATEGORY_LABEL[current.category]}
              </span>
              <p className="text-white text-base md:text-lg font-semibold">{current.title}</p>
            </figcaption>
          </figure>

          {lightbox.list.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="hidden sm:flex absolute right-3 md:right-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Mobile bottom controls */}
          {lightbox.list.length > 1 && (
            <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
