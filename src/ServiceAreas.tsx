import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, ChevronRight } from 'lucide-react';
import { CITIES, type Region } from './seo/cities';
import { BUSINESS } from './seo/site';

const REGIONS: ReadonlyArray<Region> = ['North Texas', 'West Texas'];

export default function ServiceAreas() {
  React.useEffect(() => {
    document.title = 'Service Areas — North & West Texas | 4B Overhead Doors';
  }, []);

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-zinc-500">
              <li>
                <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
              </li>
              <li><ChevronRight className="w-3 h-3 text-zinc-700" aria-hidden="true" /></li>
              <li className="text-zinc-300">Service Areas</li>
            </ol>
          </nav>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Service Areas</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-6">
            North & West <span className="text-zinc-500">Texas.</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
            We're based in Wichita Falls and cover {CITIES.length} major cities across North and West Texas
            for residential and commercial garage door installation, repair, and spring service. Pick your
            city for a page tailored to your area, or call <a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`} className="underline decoration-zinc-600 hover:decoration-white">{BUSINESS.phoneDisplay}</a>.
          </p>
        </div>
      </section>

      {/* City list grouped by region */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        {REGIONS.map(region => {
          const regionCities = CITIES.filter(c => c.region === region);
          return (
            <div key={region} className="mb-16 md:mb-20 last:mb-0">
              <div className="flex items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    {region}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.05]">
                    {regionCities.length} cities served
                  </h2>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {regionCities.map(c => (
                  <li key={c.slug}>
                    <Link
                      to={`/service-areas/${c.slug}`}
                      className="group flex items-start gap-4 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold">{c.name}, TX</div>
                        <div className="text-zinc-500 text-xs mt-0.5">{c.county}</div>
                        <div className="text-zinc-300 text-xs mt-2 inline-flex items-center gap-1 group-hover:text-white transition-colors">
                          See {c.name} page <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Outside-area CTA */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-5">
            Don't see your city?
          </h2>
          <p className="text-zinc-400 mb-9 font-light">
            We routinely travel for the right project — surrounding states including Oklahoma, plus smaller communities not listed here. Call us and we'll give you an honest answer.
          </p>
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
          >
            <Phone className="w-4 h-4" /> Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </section>
    </>
  );
}
