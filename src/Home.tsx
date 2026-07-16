import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  Building2,
  Wrench,
  ArrowRight,
  Users,
  ShieldCheck,
  Hammer,
  Clock,
  MapPin,
  Phone,
  Mail,
  Send,
  ChevronDown,
  ImageIcon,
  Star,
  HelpCircle,
} from 'lucide-react';
import { FAQS } from './seo/site';
import { CITIES } from './seo/cities';

// Featured cities surfaced in the home #service-areas teaser. Hand-picked for
// breadth across both regions — full list lives at /service-areas.
const FEATURED_CITIES = [
  'wichita-falls', 'denton', 'fort-worth', 'dallas',
  'weatherford', 'aledo', 'azle', 'springtown',
  'abilene', 'decatur', 'vernon', 'jacksboro'
].map(slug => CITIES.find(c => c.slug === slug)!).filter(Boolean);
const ALL_CITY_COUNT = CITIES.length;
import heroVideo from './assets/hero-video.mp4';
import heroVideoMobile from './assets/hero-video-mobile.mp4';
import heroPoster from './assets/hero-poster.webp';
import heroPosterMobile from './assets/hero-poster-mobile.webp';
import cardResidential from './assets/card-residential.webp';
import cardCommercial from './assets/card-commercial.webp';
import cardRepairs from './assets/card-repairs.webp';
import cardInstallations from './assets/card-installations.webp';
import process1 from './assets/process-1.webp';
import process2 from './assets/process-2.webp';
import process3 from './assets/process-3.webp';
import process4 from './assets/process-4.webp';
import why1 from './assets/why-1.webp';
import why2 from './assets/why-2.webp';
import why3 from './assets/why-3.webp';
import why4 from './assets/why-4.webp';
import why5 from './assets/why-5.webp';
import why6 from './assets/why-6.webp';
import why7 from './assets/why-7.webp';
import why8 from './assets/why-8.webp';
import why9 from './assets/why-9.webp';
import why10 from './assets/why-10.webp';
import VideoShowcase from './VideoShowcase';

const whyPhotos = [why1, why2, why3, why4, why5, why6, why7, why8, why9, why10];

type ContactStatus = 'idle' | 'submitting' | 'success' | 'error';

// Zafe lead capture. The browser POSTs directly so the request carries an
// Origin header matching the widget's allowed_origins allowlist. Fired
// alongside the /api/contact email so a submit both notifies the office and
// lands as a lead in the Zafe dashboard (Leads inbox, channel "form").
const ZAFE_ENDPOINT = 'https://ufshuedarhueuituppjo.supabase.co/functions/v1/capture';
const ZAFE_APIKEY = 'sb_publishable_pdkOzNe8XMP9lI23RKdY8Q_XSSOi8Zp';
const ZAFE_PUBLIC_KEY = '3fb1ed374de9a1495b8b652b0a210d44eed862360e0d8b3d';

const SERVICE_LABELS: Record<string, string> = {
  residential: 'Residential Doors',
  commercial: 'Commercial Doors',
  repair: 'Repairs & Maintenance',
  other: 'Other',
};

interface ZafeLead {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

async function captureZafeLead(lead: ZafeLead): Promise<void> {
  try {
    await fetch(ZAFE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ZAFE_APIKEY },
      body: JSON.stringify({
        publicKey: ZAFE_PUBLIC_KEY,
        type: 'form',
        contact: { name: lead.name, email: lead.email, phone: lead.phone },
        answers: [
          { question: 'Service Needed', answer: SERVICE_LABELS[lead.service] || lead.service || 'Not specified' },
          { question: 'Message', answer: lead.message },
        ],
        sourceUrl: location.href,
        website: '',
      }),
    });
  } catch {
    // Non-fatal: the /api/contact email still notifies the office.
  }
}

function ContactForm() {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [service, setService] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [honey, setHoney] = React.useState('');
  const [status, setStatus] = React.useState<ContactStatus>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const submitting = status === 'submitting';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setStatus('submitting');
    setErrorMessage('');

    // Send the lead to Zafe in parallel with the email. Fire-and-forget so a
    // Zafe hiccup never blocks the office notification. Skip if the honeypot
    // was filled (bot).
    if (!honey) {
      captureZafeLead({ name, email, phone, service, message });
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, message, honey }),
      });

      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to send message right now.');
      }

      setStatus('success');
      setName('');
      setPhone('');
      setEmail('');
      setService('');
      setMessage('');
    } catch (error: unknown) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send message right now.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 lg:p-10 space-y-6"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(940) 555-0123"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-service" className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Service Needed</label>
        <div className="relative">
          <select
            id="contact-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="">Select a service...</option>
            <option value="residential">Residential Doors</option>
            <option value="commercial">Commercial Doors</option>
            <option value="repair">Repairs & Maintenance</option>
            <option value="other">Other</option>
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Message <span className="text-red-500">*</span></label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
        />
      </div>

      <input
        type="text"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'SENDING…' : 'SEND MESSAGE'} {!submitting && <Send className="w-4 h-4" />}
      </button>

      {status === 'success' && (
        <p className="text-sm text-emerald-400 font-medium">
          Thanks — your message is on its way. We'll be in touch shortly.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400 font-medium">
          {errorMessage || 'Something went wrong. Please try again or call (940) 781-1186.'}
        </p>
      )}
    </form>
  );
}

interface FAQItemProps {
  q: string;
  a: string;
  index: number;
  open: boolean;
  onToggle: (index: number) => void;
}

function FAQItem(props: FAQItemProps) {
  const { q, a, index, open, onToggle } = props;
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;
  return (
    <div className="group">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          onClick={() => onToggle(index)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full flex items-start justify-between gap-6 text-left py-6 md:py-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md"
        >
          <span className="text-base md:text-lg font-medium text-white leading-snug">
            {q}
          </span>
          <span
            className={`shrink-0 mt-0.5 w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 transition-all duration-300 group-hover:text-white group-hover:border-zinc-600 ${
              open ? 'rotate-180 bg-white text-zinc-950 border-white' : ''
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </span>
        </button>
      </h3>
      {/* Answer is rendered into the DOM unconditionally so AI crawlers and
          the FAQPage JSON-LD see the same text — only visibility toggles. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-zinc-400 leading-relaxed font-light pb-6 md:pb-7 pr-12 max-w-2xl">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  // Single-open accordion: matches user mental model and keeps the panel
  // height steady. Schema/JSON-LD is unaffected — every Q&A is in the DOM.
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const onToggle = (i: number) => setOpenIndex(curr => (curr === i ? null : i));

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">FAQ</p>
          <h2
            id="faq-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-5"
          >
            Common questions.
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
            Quick, honest answers about service areas, pricing, repair turnaround,
            and what makes 4B Overhead Doors different.
          </p>
        </div>

        <div className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              index={i}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={onToggle}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white underline decoration-zinc-700 hover:decoration-white underline-offset-4 transition-colors"
          >
            <HelpCircle className="w-4 h-4" /> Don't see your question? Ask us.
          </a>
        </div>
      </div>
    </section>
  );
}

function WhyPhotoRotator() {
  // Only mount the active and next slot. Each <img> swaps its src as the
  // index advances, so the browser fetches one new image per cycle instead
  // of preloading all 10 (which was costing ~3 MB even when the user only
  // saw one at a time).
  const [index, setIndex] = React.useState(0);
  const [activeSlot, setActiveSlot] = React.useState<0 | 1>(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % whyPhotos.length);
      setActiveSlot(s => (s === 0 ? 1 : 0));
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  // Slot 0 holds the photo for even cycles, slot 1 for odd. Source for the
  // currently-inactive slot is set to the *next* photo so it's already
  // fetched/decoded by the time we crossfade to it.
  const nextIndex = (index + 1) % whyPhotos.length;
  const slot0Src = activeSlot === 0 ? whyPhotos[index] : whyPhotos[nextIndex];
  const slot1Src = activeSlot === 1 ? whyPhotos[index] : whyPhotos[nextIndex];

  return (
    <>
      <img
        src={slot0Src}
        alt="4B Overhead Doors craftsmanship"
        width={600}
        height={800}
        loading="eager"
        decoding="async"
        fetchPriority={activeSlot === 0 ? 'high' : 'low'}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeSlot === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <img
        src={slot1Src}
        alt=""
        aria-hidden="true"
        width={600}
        height={800}
        loading="lazy"
        decoding="async"
        fetchPriority={activeSlot === 1 ? 'high' : 'low'}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeSlot === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[720px] h-[100svh] flex flex-col justify-center items-center text-center px-6 pt-28 md:pt-36 pb-12">
        <div className="absolute inset-0 overflow-hidden bg-zinc-950">
          <video
            ref={(el) => { if (el) el.playbackRate = 1.35; }}
            src={heroVideoMobile}
            poster={heroPosterMobile}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Premium garage doors installed by 4B Overhead Doors"
            className="md:hidden absolute inset-0 w-full h-full object-cover"
          />
          <video
            ref={(el) => { if (el) el.playbackRate = 1.35; }}
            src={heroVideo}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Premium garage doors installed by 4B Overhead Doors"
            className="hidden md:block absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/45 z-10"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
          <h1
            className="hero-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1] md:leading-[0.92] text-white"
          >
            <span className="block">Premium Garage</span>
            <span className="block">Doors.</span>
            <span className="block text-zinc-300">Built to last</span>
          </h1>

          <p
            className="hero-fade-up mt-6 md:mt-8 text-lg md:text-xl text-zinc-300 max-w-2xl font-light"
            style={{ animationDelay: '0.2s' }}
          >
            4B Overhead Doors installs and repairs residential and commercial garage doors across West and North Texas. Family-owned, fully insured, and trusted by homeowners, builders, and TxDOT.
          </p>

          <div
            className="hero-fade-up mt-10 flex flex-col sm:flex-row items-center gap-4"
            style={{ animationDelay: '0.4s' }}
          >
            <a href="#contact" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 border border-white bg-white text-zinc-950 px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors">
              GET A FREE QUOTE <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:9407811186" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-black/30 border border-white/40 text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-white/10 hover:border-white transition-colors">
              <Phone className="w-4 h-4" /> CALL NOW
            </a>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Expertise Section */}
      <section id="services" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
            Comprehensive <br />
            <span className="text-zinc-400">Door Solutions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <HomeIcon className="w-5 h-5" />, title: 'Residential Garage Doors', desc: "Enhance your home's curb appeal with premium, high-quality residential doors designed for durability and style.", img: cardResidential, imgW: 540, imgH: 413, imgAlt: 'Premium residential garage door on a Texas home installed by 4B Overhead Doors', pos: 'center' },
            { icon: <Building2 className="w-5 h-5" />, title: 'Commercial Garage Doors', desc: 'Heavy-duty, reliable commercial doors built to withstand the toughest industrial environments — including TxDOT highway department projects.', img: cardCommercial, imgW: 405, imgH: 540, imgAlt: 'Heavy-duty commercial overhead door on an industrial building, installed for a TxDOT-style project', pos: 'center' },
            { icon: <Wrench className="w-5 h-5" />, title: 'Repairs & Maintenance', desc: 'Fast, reliable repair services to keep your doors operating smoothly and safely year-round.', img: cardRepairs, imgW: 540, imgH: 540, imgAlt: 'Garage door technician performing spring and cable repair', pos: 'center' },
            { icon: <ArrowRight className="w-5 h-5" />, title: 'Installations', desc: 'Professional installation by fully insured experts, ensuring perfect fit and function from day one.', img: cardInstallations, imgW: 1080, imgH: 1558, imgAlt: '4B Overhead Doors technicians installing a tall commercial overhead door from a scissor lift inside a North Texas warehouse', pos: 'center 30%' }
          ].map((item, i) => (
            <a
              key={i}
              href="#contact"
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 p-7 md:p-10 min-h-[260px] aspect-auto sm:aspect-[4/3] flex flex-col justify-end transition-all hover:border-zinc-600 hover:-translate-y-1 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="absolute inset-0">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  width={item.imgW}
                  height={item.imgH}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: item.pos }}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 to-transparent"></div>
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center mb-5 text-white">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{item.title}</h3>
                <p className="text-zinc-300 text-sm font-light leading-relaxed max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 bg-[#0c0c0c] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] bg-zinc-900">
            <WhyPhotoRotator />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-950/80 backdrop-blur border border-zinc-800 text-white z-10">
              <ShieldCheck className="w-5 h-5 text-white/70 shrink-0" />
              <div className="leading-tight">
                <div className="text-lg font-bold">100%</div>
                <div className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">Satisfaction Guaranteed</div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Why Us</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Why Choose <br />
              4B Overhead <span className="text-zinc-400">Doors?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 font-light leading-relaxed">
              We don't just install doors; we build lasting relationships through exceptional craftsmanship, unwavering reliability, and premium service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {[
                { icon: <Users />, title: 'Family-Owned & Operated', desc: 'Deep roots in Texas with a commitment to treating every customer like family.' },
                { icon: <ShieldCheck />, title: 'Fully Insured', desc: 'Complete peace of mind knowing your property is protected during every job.' },
                { icon: <Hammer />, title: 'High-End Materials', desc: 'We source only the most durable, premium materials for lasting performance.' },
                { icon: <Clock />, title: 'Fast & Reliable Service', desc: 'Prompt response times and efficient work to minimize your downtime.' }
              ].map((feature, i) => (
                <div key={i}>
                  <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center mb-5 text-zinc-300">
                    {React.cloneElement(feature.icon, { className: 'w-4 h-4' })}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Our Process</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              From the ground up, <br />
              <span className="text-zinc-400">built right.</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Every project starts with a bare slab and ends with a door that opens for years. Here's a recent commercial build.
            </p>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 self-start md:self-end px-5 py-3 rounded-md border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white text-white text-sm font-semibold tracking-wide transition-colors whitespace-nowrap"
          >
            <ImageIcon className="w-4 h-4" /> View Our Work
          </Link>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent -translate-y-1/2 pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative">
            {[
              { src: process1, alt: 'Bare steel frame at the start of the build' },
              { src: process2, alt: 'Structure and roof complete, before doors' },
              { src: process3, alt: 'Garage doors installed' },
              { src: process4, alt: 'Finished commercial building exterior' }
            ].map((step, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[4/5] hover:border-zinc-600 transition-colors"
              >
                <img src={step.src} alt={step.alt} width={540} height={405} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/10 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 px-2.5 py-1 rounded-md bg-zinc-950/70 backdrop-blur-sm border border-white/10 text-[10px] md:text-xs font-bold tracking-widest text-white">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 bg-[#0c0c0c] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Reviews</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              What Our <span className="text-zinc-400">Customers</span> <br />
              Are Saying
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light">
              Real recommendations from real Texans on Facebook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Roland Conwell',
                date: 'June 29, 2026',
                quote: "Had two insulated doors with openers installed by Colten. They fit perfectly with style and color ordered. I like that I can open/close either or both from my phone! Colten got here at time we chose, removed and got rid of old wooden doors and cleaned up well after finishing installation. The company was at the best price of 5 estimates received. I wish all businesses would do as good of work as Colten did! 5 out of 5!!"
              },
              {
                name: 'Becky Bartley Thornhill',
                date: 'June 28, 2026',
                quote: "If you're in need of new garage doors we highly recommend Colten with 4B Overhead Doors. Colten was prompt every time he came to our house. He's very professional, precise, and we thought more than reasonable. It was good doing business with a company that returned my calls and wanted to do a good job. Thank you Colten!"
              },
              {
                name: 'Nancy Shahan',
                date: 'November 17, 2025',
                quote: "If you need your overhead doors repaired or replaced this is the man to call, Colten Beaty! He definitely knows what he's doing. Very courteous and efficient. Thanks again Colten! Both doors are working great."
              },
              {
                name: 'Amy Hageman Henderson',
                date: 'November 16, 2025',
                quote: "Colten came to the rescue last minute on a Saturday to fix a garage door that the cable had locked up on. He was very professional, affordable and communicated clearly. He also suggested we tighten the tension so the door didn't open and close so fast. 10/10 recommend!"
              },
              {
                name: 'Jonathan Birkenfeld',
                date: 'November 16, 2025',
                quote: "Colten did great work installing the doors! Very professional and communicated very well through the process of the project. Would definitely recommend him to anyone in the market for a door."
              }
            ].map((review, i) => (
              <div
                key={i}
                className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-7 md:p-8 flex flex-col transition-colors hover:border-zinc-700"
              >
                <div className="flex items-center gap-1 mb-5" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light mb-6">
                  {review.quote}
                </p>
                <div className="mt-auto pt-5 border-t border-zinc-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 flex items-center justify-center font-semibold text-sm shrink-0">
                    {review.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{review.name}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Facebook</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.facebook.com/4BGarageDoors/reviews"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white underline decoration-zinc-700 hover:decoration-white underline-offset-4 transition-colors"
            >
              See more reviews on Facebook <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section — content mirrored in src/seo/site.ts FAQS for FAQPage JSON-LD */}
      <FAQSection />


      {/* Coverage Section */}
      <section id="service-areas" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Service Areas</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none mb-6">
            Based in West & <br />
            North <span className="text-zinc-400">Texas</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto font-light">
            We cover {FEATURED_CITIES.length}+ major cities across North and West Texas — and travel for the right project. Pick your city for a tailored page, or call (940) 781-1186.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {FEATURED_CITIES.map(c => (
            <Link
              key={c.slug}
              to={`/service-areas/${c.slug}`}
              className="group flex flex-col items-start justify-center gap-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl hover:bg-zinc-900 hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-semibold tracking-widest uppercase">{c.region}</span>
              </div>
              <span className="font-semibold text-white text-sm md:text-base">{c.name}, TX</span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/service-areas"
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-white text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-colors"
          >
            See all {ALL_CITY_COUNT} cities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Banner / CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-t border-zinc-900">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-12 md:p-20 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Ready to Upgrade <br />
            <span className="text-zinc-400">Your Property?</span>
          </h2>
          <p className="text-zinc-400 mb-10 text-lg font-light max-w-xl mx-auto">
            Contact 4B Overhead Doors today for a free consultation and quote on your next residential or commercial project.
          </p>
          <a href="tel:9407811186" className="inline-flex items-center gap-2 mx-auto bg-white text-zinc-950 px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
            <Phone className="w-4 h-4" /> CALL (940) 781-1186
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-zinc-900">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none mb-6">
            Let's Build <br />
            Something <span className="text-zinc-400">Great</span>
          </h2>
          <p className="text-zinc-400 mb-12 font-light">
            Whether you need a new installation, emergency repair, or routine maintenance, our team is ready to assist you.
          </p>

          <div className="space-y-8">
            <a href="tel:9407811186" className="flex items-center gap-6 group focus-visible:outline-none">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Phone</div>
                <div className="text-lg font-medium text-white group-hover:underline underline-offset-4 decoration-zinc-600">(940) 781-1186</div>
              </div>
            </a>

            <a href="mailto:coltenbeaty182@gmail.com" className="flex items-center gap-6 group focus-visible:outline-none">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Email</div>
                <div className="text-lg font-medium text-white break-all group-hover:underline underline-offset-4 decoration-zinc-600">coltenbeaty182@gmail.com</div>
              </div>
            </a>

            <a href="mailto:4boverheaddoorsllc@gmail.com" className="flex items-center gap-6 group focus-visible:outline-none">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Business Email</div>
                <div className="text-lg font-medium text-white break-all group-hover:underline underline-offset-4 decoration-zinc-600">4boverheaddoorsllc@gmail.com</div>
              </div>
            </a>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Service Area</div>
                <div className="text-lg font-medium text-white">West & North Texas</div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
