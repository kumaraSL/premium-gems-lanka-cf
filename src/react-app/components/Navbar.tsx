import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Collection', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Journal', path: '/journal' },
    { name: 'Custom Order', path: '/custom-order' },
  ];

  useEffect(() => {
    // console.log('Logo initialized');
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian/95 backdrop-blur-md border-b border-gold/15'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-luxury h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/src/react-app/assets/logo.png" 
            alt="Premium Gems Lanka" 
            className="h-[42px] w-auto" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/200x50/0A0805/C9A96E?text=Premium+Gems';
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-sans text-[11px] uppercase tracking-[0.18em] transition-colors ${
                location.pathname === link.path ? 'text-gold' : 'text-ivory-dim hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link to={user ? '/profile' : '/login'} className="text-ivory-dim hover:text-gold transition-colors">
            <User size={22} strokeWidth={1.5} />
          </Link>

          <Link to="/cart" className="relative text-ivory-dim hover:text-gold transition-colors">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian rounded-full text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-ivory-dim hover:text-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-obsidian border-b border-gold/15 p-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-sans text-sm uppercase tracking-[0.18em] text-ivory-dim hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to={user ? '/profile' : '/login'}
            className="font-sans text-sm uppercase tracking-[0.18em] text-ivory-dim hover:text-gold transition-colors"
          >
            {user ? 'My Account' : 'Sign In'}
          </Link>
        </div>
      )}
    </nav>
  );
}
