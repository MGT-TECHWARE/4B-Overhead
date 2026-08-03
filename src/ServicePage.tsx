import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Phone, AlertCircle, HelpCircle, Plus, Minus } from 'lucide-react';
import { getService, SERVICES } from './seo/services';
import { getPost } from './seo/posts';
import { BUSINESS } from './seo/site';
import { galleryUrl } from './blog/galleryUrls';
import Breadcrumbs from './Breadcrumbs';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
      >
        <span className="text-base md:text-lg font-medium text-white">{q}</span>
        <span className="shrink-0 mt-1 text-zinc-500">
          {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      {/* Kept in the DOM and toggled with CSS so crawlers see the answer text
          even when the accordion is visually collapsed — matches FAQPage JSON-LD. */}
      <div className={open ? 'pb-5' : 'hidden'}>
        <p className="text-zinc-400 font-light leading-relaxed max-w-3xl">{a}</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <section className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Service not found</h1>
      <p className="text-zinc-400 mb-8">We couldn't find that service page.</p>
      <Link
        to="/services"
        className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
      >
        See all services <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getService(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!service) return <NotFound />;

  const related = service.relatedPosts
    .map(s => getPost(s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const others = SERVICES.filter(s => s.slug !== service.slug);

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 md:pt-44 pb-14 md:pb-20 px-6 md:px-12 border-b border-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <Breadcrumbs
            items={[
              { name: 'Home', to: '/' },
              { name: 'Services', to: '/services' },
              { name: service.shortName }
            ]}
          />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
            {service.shortName}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.02] mb-6 max-w-4xl">
            {service.name}
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
            {service.intro}
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

      {/* Detail + includes */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <p className="text-zinc-400 text-lg font-light leading-relaxed mb-10">
              {service.detail}
            </p>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
              What the job includes
            </h2>
            <ul className="space-y-3">
              {service.includes.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-zinc-300 font-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-8 mb-8">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-white mb-5">
                <AlertCircle className="w-5 h-5 text-zinc-400" aria-hidden="true" />
                {service.signs.heading}
              </h2>
              <ul className="space-y-3">
                {service.signs.items.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0 mt-2.5"
                      aria-hidden="true"
                    />
                    <span className="text-zinc-400 font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">
                What it costs
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed">{service.pricing}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
            <HelpCircle className="w-4 h-4" aria-hidden="true" /> Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-10">
            {service.shortName} — common questions
          </h2>
          <div>
            {service.faqs.map(f => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Related reading */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
              Related reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(post => {
                const img = galleryUrl(post.heroImage);
                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-colors"
                  >
                    {img && (
                      <img
                        src={img}
                        alt={post.heroAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">
                        {post.category}
                      </p>
                      <h3 className="text-base font-semibold text-white leading-snug group-hover:text-zinc-300 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
            Other services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map(s => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-600 transition-colors"
              >
                <span className="text-base font-semibold text-white">{s.shortName}</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
