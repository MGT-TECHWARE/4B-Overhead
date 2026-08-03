import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ShieldCheck, Users, MapPin, Star } from 'lucide-react';
import { BUSINESS, REVIEWS } from './seo/site';
import { CITIES } from './seo/cities';
import Breadcrumbs from './Breadcrumbs';
import aboutPhoto from './assets/about-craftsmanship.webp';

/**
 * About / operator page.
 *
 * Everything on this page is drawn from facts the site already states
 * elsewhere: family-owned, operated by Colten Beaty, fully insured, TxDOT
 * work, Wichita Falls base, and the real Facebook reviews in seo/site.ts.
 *
 * Deliberately NOT stated because nobody has confirmed them: year founded,
 * years of experience, license/vendor numbers, crew size, and any brand
 * dealer status. Add them here (and to the Person node in seo/jsonld.ts) once
 * verified — invented credentials are the fastest way to lose an E-E-A-T
 * assessment, and they're the kind of claim a competitor will check.
 */
export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const topReview = REVIEWS[0];

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
          <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'About' }]} />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">About</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-6">
            One operator. <br />
            <span className="text-zinc-500">Start to finish.</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
            4B Overhead Doors, LLC is a family-owned garage door company operated by{' '}
            <span className="text-white">Colten Beaty</span>, working out of the Wichita Falls area
            and serving West Texas, North Texas, the Texas Panhandle, and the Red River region.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
              You deal with the person doing the work
            </h2>
            <div className="space-y-5 text-zinc-400 font-light leading-relaxed text-lg">
              <p>
                Most garage door companies route your call to a dispatcher, who books a technician
                you have never spoken to, who may or may not be the person who quoted the job. That
                is not how this works. When you call {BUSINESS.phoneDisplay}, you get Colten. He
                quotes the job, he does the install, and he is the one you call if something needs
                attention afterward.
              </p>
              <p>
                That structure is the whole reason the work stays consistent. Nothing gets
                subcontracted to a crew that has no relationship with you and no stake in whether
                you would recommend us. It also means we are honest about scheduling — if we cannot
                be there today, we say so instead of booking a window we will miss.
              </p>
              <p>
                The work spans everything from a single spring replacement on a 1970s ranch house to
                commercial overhead doors on warehouses and Texas Department of Transportation
                highway department projects. Residential and commercial are genuinely different
                trades, and we do both.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-zinc-800">
            <img
              src={aboutPhoto}
              alt="Close-up of garage door hinge and roller hardware on a wood-panel door installed by 4B Overhead Doors"
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Family-owned',
              body: `Operated by Colten Beaty. No call center, no dispatcher, no handoff between the person who quotes and the person who installs.`
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: 'Fully insured',
              body: `4B Overhead Doors, LLC is a fully insured Texas business. We carry liability coverage on every job so your property is protected during installs and repairs.`
            },
            {
              icon: <MapPin className="w-5 h-5" />,
              title: `${CITIES.length} cities served`,
              body: `West Texas, North Texas, the Texas Panhandle, and the Red River region — and we travel into Oklahoma for the right project.`
            }
          ].map(card => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-8"
            >
              <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 mb-5">
                {card.icon}
              </div>
              <h2 className="text-lg font-semibold text-white mb-3">{card.title}</h2>
              <p className="text-zinc-400 font-light leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Review */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-6" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-white text-white" aria-hidden="true" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-6">
            “{topReview.body}”
          </blockquote>
          <p className="text-zinc-500 text-sm">
            {topReview.author} · via{' '}
            <a
              href={BUSINESS.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-300 transition-colors"
            >
              Facebook
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-5">
            Need a door looked at?
          </h2>
          <p className="text-zinc-400 font-light text-lg mb-8 max-w-2xl mx-auto">
            Quotes are free and there is no obligation. Call for a real ETA, or send the details and
            we will follow up.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
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
    </>
  );
}
