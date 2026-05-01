import React from 'react';
import { motion } from 'motion/react';
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
  Compass,
  Truck,
  ImageIcon
} from 'lucide-react';
import heroImage from './assets/hero-garage.webp';
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

const whyPhotos = [why1, why2, why3, why4, why5, why6, why7, why8, why9, why10];

function WhyPhotoRotator() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % whyPhotos.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {whyPhotos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="4B Overhead Doors craftsmanship"
          width={1200}
          height={1600}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] h-[100svh] flex flex-col justify-center items-center text-center px-6 pt-28 md:pt-36 pb-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-950/45 z-10"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div>
          <img
            src={heroImage}
            alt="Modern luxury home with premium garage doors"
            width={1600}
            height={1600}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1] md:leading-[0.92] text-white"
          >
            <span className="block">Premium Garage</span>
            <span className="block">Doors.</span>
            <span className="block text-zinc-300">Built to last</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 md:mt-8 text-lg md:text-xl text-zinc-300 max-w-2xl font-light"
          >
            Residential & Commercial Solutions Across West & North Texas. Family-owned, fully insured, and dedicated to high-end craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <a href="#contact" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 border border-white bg-white text-zinc-950 px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors">
              GET A FREE QUOTE <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:9407811186" className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 bg-black/30 border border-white/40 text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-white/10 hover:border-white transition-colors">
              <Phone className="w-4 h-4" /> CALL NOW
            </a>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="services" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Services</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
            Comprehensive <br />
            <span className="text-zinc-500">Door Solutions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <HomeIcon className="w-5 h-5" />, title: 'Residential Garage Doors', desc: "Enhance your home's curb appeal with premium, high-quality residential doors designed for durability and style.", img: cardResidential },
            { icon: <Building2 className="w-5 h-5" />, title: 'Commercial Garage Doors', desc: 'Heavy-duty, reliable commercial doors built to withstand the toughest industrial environments.', img: cardCommercial },
            { icon: <Wrench className="w-5 h-5" />, title: 'Repairs & Maintenance', desc: 'Fast, reliable repair services to keep your doors operating smoothly and safely year-round.', img: cardRepairs },
            { icon: <ArrowRight className="w-5 h-5" />, title: 'Installations', desc: 'Professional installation by fully insured experts, ensuring perfect fit and function from day one.', img: cardInstallations }
          ].map((item, i) => (
            <a
              key={i}
              href="#contact"
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 p-7 md:p-10 min-h-[220px] aspect-auto sm:aspect-[16/9] flex flex-col justify-end transition-all hover:border-zinc-600 hover:-translate-y-1 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="absolute inset-0">
                <img
                  src={item.img}
                  alt={item.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 to-transparent"></div>
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center mb-5 text-white">
                  {item.icon}
                </div>
                <h4 className="text-xl md:text-2xl font-semibold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{item.title}</h4>
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
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Why Us</h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Why Choose <br />
              4B Overhead <span className="text-zinc-500">Doors?</span>
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
                  <h5 className="font-semibold text-lg mb-2 text-white">{feature.title}</h5>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
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
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Our Process</h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              From the ground up, <br />
              <span className="text-zinc-500">built right.</span>
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
                <img src={step.src} alt={step.alt} width={1200} height={1500} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/10 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 px-2.5 py-1 rounded-md bg-zinc-950/70 backdrop-blur-sm border border-white/10 text-[10px] md:text-xs font-bold tracking-widest text-white">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="service-areas" className="scroll-mt-28 md:scroll-mt-36 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Service Areas</h3>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none mb-6">
          Based in West & <br />
          North <span className="text-zinc-500">Texas</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-16 font-light">
          Our home base covers the western and northern halves of Texas — but for the right project, we'll travel well beyond. If you're nearby, chances are we can be there.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['North Texas', 'West Texas', 'Texas Panhandle', 'Red River Region'].map((region, i) => (
            <a key={i} href="#contact" className="flex flex-col items-center justify-center gap-3 bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl hover:bg-zinc-900 hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
              <MapPin className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-zinc-200 text-sm md:text-base">{region}</span>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#contact" className="flex items-center gap-5 bg-zinc-900/50 border border-zinc-800 border-dashed p-6 rounded-2xl text-left hover:bg-zinc-900 hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Beyond Texas</div>
              <div className="text-zinc-200 font-medium leading-snug">Surrounding states — Oklahoma, New Mexico & nearby regions</div>
            </div>
          </a>
          <a href="tel:9407811186" className="flex items-center gap-5 bg-zinc-900/50 border border-zinc-800 border-dashed p-6 rounded-2xl text-left hover:bg-zinc-900 hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Not on the list?</div>
              <span className="text-white font-medium leading-snug underline decoration-zinc-600 underline-offset-4 hover:decoration-white">
                Call us — we'll come if we can.
              </span>
            </div>
          </a>
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
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Get In Touch</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none mb-6">
            Let's Build <br />
            Something <span className="text-zinc-500">Great</span>
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
                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-1">Phone</div>
                <div className="text-lg font-medium text-white group-hover:underline underline-offset-4 decoration-zinc-600">(940) 781-1186</div>
              </div>
            </a>

            <a href="mailto:coltenbeaty182@gmail.com" className="flex items-center gap-6 group focus-visible:outline-none">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-1">Email</div>
                <div className="text-lg font-medium text-white break-all group-hover:underline underline-offset-4 decoration-zinc-600">coltenbeaty182@gmail.com</div>
              </div>
            </a>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-1">Service Area</div>
                <div className="text-lg font-medium text-white">West & North Texas</div>
              </div>
            </div>
          </div>
        </div>

        <form className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 lg:p-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="John Doe" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Phone <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="(940) 555-0123" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Email <span className="text-red-500">*</span></label>
            <input type="email" placeholder="john@example.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Service Needed</label>
            <div className="relative">
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-zinc-600 transition-colors">
                <option value="">Select a service...</option>
                <option value="residential">Residential Doors</option>
                <option value="commercial">Commercial Doors</option>
                <option value="repair">Repairs & Maintenance</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Message <span className="text-red-500">*</span></label>
            <textarea rows={4} placeholder="Tell us about your project..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"></textarea>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors mt-4">
            SEND MESSAGE <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </>
  );
}
