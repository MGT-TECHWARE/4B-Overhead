import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { SERVICES } from './seo/services';
import { BUSINESS } from './seo/site';
import Breadcrumbs from './Breadcrumbs';

export default function Services() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
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
          <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Services' }]} />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Services</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-6">
            What we <span className="text-zinc-500">do.</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
            4B Overhead Doors installs and repairs residential and commercial garage doors across
            West Texas, North Texas, and the Red River region. Family-owned, fully insured, and
            every job handled by our own crew — never subcontracted.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
            >
              Get a free quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phone.replace(/\D/g, '').slice(-10)}`}
              className="inline-flex items-center gap-2 border border-zinc-700 text-white px-6 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-900 transition-colors"
            >
              <Phone className="w-4 h-4" /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map(s => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-9 hover:border-zinc-600 transition-colors"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4 leading-tight">
                {s.name}
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed mb-6 flex-1">{s.intro}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
