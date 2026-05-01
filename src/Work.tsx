import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Phone, X } from 'lucide-react';

const galleryModules = import.meta.glob('./assets/gallery/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

function naturalKey(path: string) {
  const name = path.split('/').pop() ?? path;
  const m = name.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

const images: string[] = Object.entries(galleryModules)
  .sort(([a], [b]) => naturalKey(a) - naturalKey(b))
  .map(([, url]) => url);

export default function Work() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const total = images.length;

  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex(i => (i === null ? null : (i - 1 + total) % total));
  const next = () => setOpenIndex(i => (i === null ? null : (i + 1) % total));

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, total]);

  const counterText = useMemo(() =>
    openIndex !== null ? `${openIndex + 1} / ${total}` : '',
    [openIndex, total]
  );

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto relative">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Our Work</h3>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.95] mb-6">
            Real installs. <br />
            <span className="text-zinc-500">Real results.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-light leading-relaxed">
            Browse a selection of recent residential and commercial projects across West and North Texas — from new builds to repairs and full overhauls.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full mb-3 md:mb-4 break-inside-avoid rounded-xl md:rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-zoom-in"
              aria-label={`Open photo ${i + 1} of ${total}`}
            >
              <img
                src={src}
                alt={`4B Overhead Doors project photo ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Like what you see?
          </h2>
          <p className="text-zinc-400 mb-8 font-light">
            Get in touch for a free quote on your next project.
          </p>
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
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-widest backdrop-blur-sm">
            {counterText}
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="hidden sm:flex absolute left-3 md:left-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={images[openIndex]}
            alt={`Photo ${openIndex + 1} of ${total}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="hidden sm:flex absolute right-3 md:right-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Mobile bottom controls */}
          <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
