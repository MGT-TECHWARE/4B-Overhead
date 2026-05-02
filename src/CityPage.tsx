import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Home as HomeIcon,
  Building2,
  Wrench,
  ArrowRight,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Clock,
  Hammer,
  Users
} from 'lucide-react';
import { CITIES, findCity, type City } from './seo/cities';
import { BUSINESS } from './seo/site';

function NotFound() {
  return (
    <section className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">City not found</h1>
      <p className="text-zinc-400 mb-8">
        We couldn't find that service area page.
      </p>
      <Link
        to="/service-areas"
        className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
      >
        See all service areas <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}

const SERVICES: ReadonlyArray<{
  icon: React.ReactNode;
  title: string;
  desc: (cityName: string) => string;
}> = [
  {
    icon: <HomeIcon className="w-5 h-5" />,
    title: 'Residential Garage Doors',
    desc: city =>
      `New door installs, replacements, and panel swaps for homes in ${city} and the surrounding area. Insulated steel, custom carriage, and traditional sectional styles.`
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    title: 'Commercial Overhead Doors',
    desc: city =>
      `Heavy-duty overhead doors for shops, warehouses, and industrial sites in ${city}. We work directly with builders, GCs, and TxDOT-style projects.`
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Repairs & Spring Replacement',
    desc: city =>
      `Broken springs, off-track panels, dead openers, frayed cables — fast same-day or next-day repair across ${city} whenever the schedule allows.`
  },
  {
    icon: <ArrowRight className="w-5 h-5" />,
    title: 'New Construction Installs',
    desc: city =>
      `Spec, supply, and install for builders working in ${city}. We hit your construction schedule and bid the right door — not the cheapest one.`
  }
];

const WHY_BULLETS: ReadonlyArray<{ icon: React.ReactNode; title: string; desc: string }> = [
  {
    icon: <Users />,
    title: 'Family-owned & operator-led',
    desc: 'You talk to Colten Beaty from quote to install — no call center, no subcontracted strangers.'
  },
  {
    icon: <ShieldCheck />,
    title: 'Fully insured',
    desc: 'Liability coverage on every job protects your property during installs and repairs.'
  },
  {
    icon: <Clock />,
    title: 'Fast response',
    desc: 'Same-day or next-day service across our core area whenever the schedule allows it.'
  },
  {
    icon: <Hammer />,
    title: 'High-end materials',
    desc: 'We spec the door that lasts, not the door that hits the cheapest bid.'
  }
];

function CityHero({ city }: { city: City }) {
  return (
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
            <li>
              <Link to="/service-areas" className="hover:text-zinc-300 transition-colors">Service Areas</Link>
            </li>
            <li><ChevronRight className="w-3 h-3 text-zinc-700" aria-hidden="true" /></li>
            <li className="text-zinc-300">{city.name}</li>
          </ol>
        </nav>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
          {city.region} · {city.county}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-6">
          Garage Door Repair & Install in <span className="text-zinc-500">{city.name}, TX</span>
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
          {city.localAngle}
        </p>
        {city.secondaryAngle && (
          <p className="text-zinc-400 text-base md:text-lg max-w-3xl font-light leading-relaxed mt-4">
            {city.secondaryAngle}
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors"
          >
            <Phone className="w-4 h-4" /> Call {BUSINESS.phoneDisplay}
          </a>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
          >
            Get a free {city.name} quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CityServices({ city }: { city: City }) {
  return (
    <section className="py-24 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 md:mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
          What we do in {city.name}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.05] max-w-2xl">
          Residential and commercial garage door work, end to end.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map(s => (
          <Link
            key={s.title}
            to="/#contact"
            className="group flex flex-col gap-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 p-7 md:p-8 transition-colors hover:border-zinc-600"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300">
                {s.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">{s.title}</h3>
            </div>
            <p className="text-zinc-400 font-light leading-relaxed">{s.desc(city.name)}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
              Get a quote <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CityCoverage({ city }: { city: City }) {
  return (
    <section className="py-20 md:py-24 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
            Coverage around {city.name}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.05] mb-5">
            We also service these nearby areas.
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            We routinely cover the smaller communities and unincorporated areas around {city.name}.
            If you don't see your town, call us — chances are we can be there.
          </p>
        </div>

        <div className="lg:col-span-2">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {city.nearby.map(name => (
              <li
                key={name}
                className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 text-sm"
              >
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                {name}
              </li>
            ))}
            <li className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-xl px-4 py-3 text-zinc-300 text-sm">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              {city.county}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function WhyBlock() {
  return (
    <section className="py-24 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Why us</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.05] max-w-2xl">
          Why homeowners and builders pick 4B Overhead Doors.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {WHY_BULLETS.map(b => (
          <div key={b.title}>
            <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center mb-5 text-zinc-300">
              {React.cloneElement(b.icon as React.ReactElement<{ className?: string }>, {
                className: 'w-4 h-4'
              })}
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{b.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-light">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NearbyCityLinks({ city }: { city: City }) {
  // Pillar/cluster internal linking: every city links to the 5 nearest peer
  // cities. Keeps the cluster lateral (not just hub→spoke).
  const peers = CITIES.filter(c => c.slug !== city.slug)
    .map(c => ({
      city: c,
      d: Math.hypot(c.geo.lat - city.geo.lat, c.geo.lng - city.geo.lng)
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6)
    .map(x => x.city);

  return (
    <section className="py-20 md:py-24 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">More service areas</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.05] mb-10 max-w-2xl">
          We also serve nearby cities.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {peers.map(p => (
            <Link
              key={p.slug}
              to={`/service-areas/${p.slug}`}
              className="flex flex-col items-start gap-1 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-4 transition-colors"
            >
              <span className="text-white font-semibold text-sm">{p.name}, TX</span>
              <span className="text-zinc-500 text-xs">{p.region}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/service-areas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white underline decoration-zinc-700 hover:decoration-white underline-offset-4 transition-colors"
          >
            See all service areas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CityCTA({ city }: { city: City }) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-12 md:p-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-5">
          Need a garage door fixed or installed in {city.name}?
        </h2>
        <p className="text-zinc-400 mb-9 font-light max-w-xl mx-auto">
          Free, no-obligation quotes. One phone call gets you a real ETA from a real installer — not a dispatcher.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
          >
            <Phone className="w-4 h-4" /> Call {BUSINESS.phoneDisplay}
          </a>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
          >
            Send a message <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? findCity(slug) : undefined;

  // Update document.title on the client so SPA-internal navigations get the
  // right title in the browser tab. The static HTML already ships with the
  // route-specific title (post-build.mts), so this is the SPA-only fallback.
  React.useEffect(() => {
    if (city) document.title = `Garage Door Repair & Install in ${city.name}, TX | 4B Overhead Doors`;
  }, [city]);

  if (!city) return <NotFound />;

  return (
    <>
      <CityHero city={city} />
      <CityServices city={city} />
      <CityCoverage city={city} />
      <WhyBlock />
      <NearbyCityLinks city={city} />
      <CityCTA city={city} />
    </>
  );
}
