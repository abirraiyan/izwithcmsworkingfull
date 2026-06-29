import { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Lock scroll, handle ESC key and trap focus within the mobile overlay menu
  useEffect(() => {
    if (!isMobileMenuOpen) {
      toggleRef.current?.focus();
      return;
    }

    // Prevent background page scrolling
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }

      if (e.key === "Tab") {
        if (!menuRef.current) return;
        
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Auto-focus close button or first link when the menu opens
    const focusTimeout = setTimeout(() => {
      if (menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>('button, [href]');
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 100);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
    { id: 'contact', name: 'Contact', href: '/contact', enabled: true, highlighted: false, order: 6 },
  ];

  const visibleLinks = activeNav.filter(item => item.enabled);
  const centerLinks = visibleLinks.filter(item => !item.highlighted);
  const highlightedLinks = visibleLinks.filter(item => item.highlighted);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const renderLink = (link: NavigationItem, className: string, onClick?: () => void) => {
    const isExternal = link.href.startsWith('http');
    const isIzGrab = link.name === "IZ Grab";
    const displayName = isIzGrab ? (
      <span className="brand-script normal-case tracking-normal">IZ Grab</span>
    ) : (
      link.name
    );
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
          {displayName}
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
        {displayName}
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
            const isIzGrab = link.name === "IZ Grab";
            const displayName = isIzGrab ? (
              <span className="brand-script normal-case tracking-normal">IZ Grab</span>
            ) : (
              link.name
            );
            const btnClass = `hidden md:block px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase rounded-full border transition-all duration-300 hover:scale-105 font-bold shadow-sm ${
              !isTransparent
                ? 'border-gold text-mocha hover:bg-[#6f4e37] hover:border-[#6f4e37] hover:text-cream'
                : 'border-gold/50 text-gold hover:bg-gold hover:text-charcoal hover:border-gold'
            }`;
            if (isExternal) {
              return (
                <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className={btnClass}>
                  {displayName}
                </a>
              );
            }
            return (
              <Link key={link.id} to={link.href} className={btnClass}>
                {displayName}
              </Link>
            );
          })}

          {/* Mobile Toggle Button */}
          <button
            ref={toggleRef}
            className={`p-2 md:hidden ${!isTransparent ? 'text-charcoal' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with z-index 9998 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-cream/95 backdrop-blur-md z-[9998]"
            />

            {/* Mobile Menu Container with z-index 9999 */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-0 w-[100vw] h-[100vh] z-[9999] bg-cream flex flex-col"
              style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)',
              }}
            >
              {/* Close Button: fixed position, top-right, always visible, z-index 10000 */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed z-[10000] text-charcoal p-2 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded"
                style={{
                  top: 'calc(env(safe-area-inset-top) + 1.5rem)',
                  right: 'calc(env(safe-area-inset-right) + 1.5rem)',
                }}
                aria-label="Close menu"
              >
                <X size={32} />
              </button>

              <div className="p-6 flex items-center border-b border-mocha/10 h-20 flex-shrink-0">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <img
                    src="/logo-icon.png"
                    alt="IZ Patisserie & Cafe Logo"
                    className="h-8 w-auto logo-charcoal"
                  />
                </Link>
              </div>

              {/* Navigation Links: vertical stack, gap 28px (within 24px-32px range), centered, overflow-y allowed for scroll safety */}
              <nav className="flex-1 flex flex-col items-center justify-center gap-[28px] px-6 py-12 overflow-y-auto">
                {visibleLinks.map((link) => {
                  const isExternal = link.href.startsWith('http');
                  // Standardized typography for mobile navigation links (32px-40px font size, line-height 1.2)
                  const linkClass = "font-serif text-[32px] md:text-[40px] leading-[1.2] text-charcoal hover:text-gold transition-colors text-center font-medium focus:outline-none focus:text-gold";
                  const isIzGrab = link.name === "IZ Grab";
                  const displayName = isIzGrab ? (
                    <span className="brand-script normal-case tracking-normal">IZ Grab</span>
                  ) : (
                    link.name
                  );

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
                        {displayName}
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
                      {displayName}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

