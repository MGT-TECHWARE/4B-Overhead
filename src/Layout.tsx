import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import logoUrl from './assets/4b-logo.webp';

type NavItem = { label: string; to: string };

const navLinks: NavItem[] = [
  { label: 'Services', to: '/#services' },
  { label: 'Our Work', to: '/work' },
  { label: 'Service Areas', to: '/service-areas' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/#contact' }
];

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Wait a tick so the target page has mounted
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0 });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash, location.key]);
  return null;
}

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  const closeMenu = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    // Hash links: smooth-scroll if on home, otherwise navigate to home+hash
    if (to.startsWith('/#')) {
      e.preventDefault();
      const hash = to.slice(1);
      if (location.pathname === '/') {
        const id = hash.slice(1);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate(to);
      }
    }
    // Plain routes (like /work) fall through to NavLink behavior
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // else Link handles navigate to /
  };

  return (
    <div id="top" className="min-h-screen bg-zinc-950">
      <ScrollManager />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-5 md:px-12 py-3 md:py-4 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <Link to="/" onClick={handleLogoClick} className="flex items-center" aria-label="4B Overhead Doors home">
          <img
            src={logoUrl}
            alt="4B Overhead Doors, LLC"
            width={800}
            height={436}
            className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {navLinks.map(link => (
            link.to.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className="hover:text-white/80 transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors whitespace-nowrap ${isActive ? 'text-white' : 'text-white/90 hover:text-white/70'}`
                }
              >
                {link.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Desktop phone */}
        <a href="tel:9407811186" className="hidden md:flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 transition-all px-4 py-2 rounded-md text-sm font-semibold shadow-lg shadow-black/30 whitespace-nowrap">
          <Phone className="w-4 h-4" />
          (940) 781-1186
        </a>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:9407811186"
            aria-label="Call (940) 781-1186"
            className="w-11 h-11 flex items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-md shadow-lg shadow-black/30"
          >
            <Phone className="w-5 h-5" />
          </a>
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="w-11 h-11 flex items-center justify-center text-white border border-white/40 bg-black/30 hover:bg-white/10 transition-all rounded-md backdrop-blur-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-md transition-opacity duration-300 pb-[env(safe-area-inset-bottom)] ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        <div
          className="flex flex-col items-center justify-center h-full gap-8 px-6 overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {navLinks.map(link => (
            link.to.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.to}
                onClick={(e) => { handleNavClick(e, link.to); closeMenu(); }}
                className="text-3xl font-semibold text-white hover:text-zinc-300 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMenu}
                className="text-3xl font-semibold text-white hover:text-zinc-300 transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
          <a
            href="tel:9407811186"
            onClick={closeMenu}
            className="mt-6 flex items-center gap-3 bg-white text-zinc-950 px-6 py-3 rounded-md font-semibold shadow-lg"
          >
            <Phone className="w-5 h-5" />
            (940) 781-1186
          </a>
        </div>
      </div>

      <Outlet />

      {/* Footer */}
      <footer className="bg-[#0c0c0c] border-t border-zinc-900 pt-20 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" onClick={handleLogoClick} className="inline-flex items-center mb-6" aria-label="4B Overhead Doors home">
              <img
                src={logoUrl}
                alt="4B Overhead Doors, LLC"
                width={800}
                height={436}
                loading="lazy"
                decoding="async"
                className="h-24 md:h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-zinc-500 font-light max-w-sm">
              Premium residential and commercial garage door solutions serving West and North Texas. Family-owned and operated by <span className="text-zinc-300">Colten Beaty</span>, fully insured, and trusted on jobs from custom homes to TxDOT highway projects.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/#services" onClick={(e) => handleNavClick(e, '/#services')} className="text-zinc-500 hover:text-white transition-colors text-sm">Services</a></li>
              <li><Link to="/work" className="text-zinc-500 hover:text-white transition-colors text-sm">Our Work</Link></li>
              <li><a href="/#why-us" onClick={(e) => handleNavClick(e, '/#why-us')} className="text-zinc-500 hover:text-white transition-colors text-sm">Why Choose Us</a></li>
              <li><a href="/#reviews" onClick={(e) => handleNavClick(e, '/#reviews')} className="text-zinc-500 hover:text-white transition-colors text-sm">Reviews</a></li>
              <li><a href="/#faq" onClick={(e) => handleNavClick(e, '/#faq')} className="text-zinc-500 hover:text-white transition-colors text-sm">FAQ</a></li>
              <li><Link to="/service-areas" className="text-zinc-500 hover:text-white transition-colors text-sm">Service Areas</Link></li>
              <li><a href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')} className="text-zinc-500 hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-6">Contact</h4>
            <ul className="space-y-4">
              <li><a href="tel:9407811186" className="text-zinc-500 hover:text-white transition-colors text-sm inline-flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />(940) 781-1186</a></li>
              <li><a href="mailto:coltenbeaty182@gmail.com" className="text-zinc-500 hover:text-white transition-colors text-sm break-all inline-flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />coltenbeaty182@gmail.com</a></li>
              <li className="text-zinc-500 text-sm inline-flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />West & North Texas</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} 4B Overhead Doors, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
