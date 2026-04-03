import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Story', href: '/our-story' },
    { name: 'Get to Know Us', href: '/get-to-know-us' },
    { name: 'Visit Us', href: '/locations' },
    { name: 'Menu', href: '/menu' },
    { name: 'Contact', href: '/#reservation' },
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        !isTransparent ? 'glass-nav py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-none">
          <Link to="/" className={`font-serif text-2xl font-bold tracking-wider ${!isTransparent ? 'text-charcoal' : 'text-white'}`}>
            IZ<span className="text-gold">.</span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-[11px] lg:text-xs tracking-[0.25em] uppercase transition-colors hover:text-gold font-semibold ${
                !isTransparent ? 'text-charcoal' : 'text-white/90'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Mobile Toggle */}
        <div className="flex-none flex items-center md:hidden">
          <button
            className={`p-2 ${!isTransparent ? 'text-charcoal' : 'text-white'}`}
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
              <span className="font-serif text-2xl font-bold text-charcoal tracking-wider">
                IZ<span className="text-gold">.</span>
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-charcoal p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-3xl text-charcoal hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
