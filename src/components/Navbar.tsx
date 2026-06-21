import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { getNavigationSettings } from '../lib/site/getNavigationSettings';
import { NavigationItem } from '../types';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling for hash links
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const loadNav = async () => {
      const data = await getNavigationSettings();
      setNavItems(data);
    };
    loadNav();
  }, []);

  // Use dynamic navigation if loaded, otherwise default fallback list
  const activeNav = navItems.length > 0 ? navItems : [
    { id: 'home', name: 'Home', href: '/', enabled: true, highlighted: false, order: 0 },
    { id: 'our-story', name: 'Our Story', href: '/our-story', enabled: true, highlighted: false, order: 1 },
    { id: 'get-to-know-us', name: 'Get to Know Us', href: '/get-to-know-us', enabled: true, highlighted: false, order: 2 },
    { id: 'locations', name: 'Visit Us', href: '/locations', enabled: true, highlighted: false, order: 3 },
    { id: 'menu', name: 'Menu', href: '/menu', enabled: true, highlighted: false, order: 4 },
    { id: 'iz-grab', name: 'IZ Grab', href: 'https://grab.izcafe.com', enabled: true, highlighted: true, order: 5 },
    { id: 'contact', name: 'Contact', href: '/#reservation', enabled: true, highlighted: false, order: 6 },
  ];

  const visibleLinks = activeNav.filter(item => item.enabled);
  const centerLinks = visibleLinks.filter(item => !item.highlighted);
  const highlightedLinks = visibleLinks.filter(item => item.highlighted);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const renderLink = (link: NavigationItem, className: string, onClick?: () => void) => {
    const isExternal = link.href.startsWith('http');
    if (isExternal) {
      return (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={className}
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link
        key={link.id}
        to={link.href}
        onClick={onClick}
        className={className}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${!isTransparent ? 'glass-nav py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-none">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-icon.png"
              alt="IZ Patisserie & Cafe Logo"
              className={`h-8 w-auto transition-all duration-300 ${!isTransparent ? 'logo-charcoal' : 'logo-white'
                }`}
            />
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-12">
          {centerLinks.map((link) =>
            renderLink(
              link,
              `text-[11px] lg:text-xs tracking-[0.25em] uppercase transition-colors hover:text-gold font-semibold ${
                !isTransparent ? 'text-charcoal' : 'text-white/90'
              }`
            )
          )}
        </nav>

        {/* Right: Actions / CTA (Desktop) & Mobile Toggle */}
        <div className="flex-none flex items-center gap-6">
          {/* Highlighted CTA Buttons (Desktop only) */}
          {highlightedLinks.map((link) => {
            const isExternal = link.href.startsWith('http');
            const btnClass = `hidden md:block px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase rounded-full border transition-all duration-300 hover:scale-105 font-bold shadow-sm ${
              !isTransparent
                ? 'border-gold text-mocha hover:bg-[#6f4e37] hover:border-[#6f4e37] hover:text-cream'
                : 'border-gold/50 text-gold hover:bg-gold hover:text-charcoal hover:border-gold'
            }`;
            if (isExternal) {
              return (
                <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className={btnClass}>
                  {link.name}
                </a>
              );
            }
            return (
              <Link key={link.id} to={link.href} className={btnClass}>
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Toggle Button */}
          <button
            className={`p-2 md:hidden ${!isTransparent ? 'text-charcoal' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-cream flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-mocha/10">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                <img
                  src="/logo-icon.png"
                  alt="IZ Patisserie & Cafe Logo"
                  className="h-8 w-auto logo-charcoal"
                />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-charcoal p-2">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
              {visibleLinks.map((link) => {
                const isExternal = link.href.startsWith('http');
                const isHighlight = link.highlighted;
                const linkClass = isHighlight
                  ? "w-full max-w-[280px] px-8 py-3.5 border border-gold text-mocha rounded-full hover:bg-gold hover:text-white transition-all text-center text-sm tracking-[0.2em] font-bold uppercase shadow-sm"
                  : "font-serif text-3xl text-charcoal hover:text-gold transition-colors";
                
                if (isExternal) {
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={linkClass}
                    >
                      {link.name}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={linkClass}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

