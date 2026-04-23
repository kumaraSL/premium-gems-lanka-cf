import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-obsidian-800 border-t border-gold/15 pt-20 pb-10">
      <div className="container-luxury">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <img src={logo} alt="Premium Gems Lanka" className="h-[48px] w-auto self-start" />
            <p className="text-[13px] text-ivory-muted leading-relaxed">
              Sri Lanka's finest certified authentic gems — ethically sourced, expertly cut, curated by local experts.
            </p>
            <a
              href="https://wa.me/94777893842"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline self-start mt-2"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-gold mb-2">Shop</h4>
            {['Blue Sapphire', 'Teal Sapphire', 'White Sapphire', 'Pink Sapphire', 'Padparadscha', 'Yellow Sapphire', 'Star Sapphire'].map((item) => (
              <Link key={item} to="/shop" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">
                {item}
              </Link>
            ))}
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-gold mb-2">Company</h4>
            <Link to="/our-story" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">Our Story</Link>
            <Link to="/journal" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">Journal</Link>
            <Link to="/custom-order" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">Custom Order</Link>
            <Link to="/new-arrivals" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">New Arrivals</Link>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.18em] text-gold mb-2">Contact</h4>
            <p className="text-[13px] text-ivory-muted">
              Ratnapura<br />
              Sri Lanka
            </p>
            <a href="mailto:info@premiumgemslanka.com" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">
              info@premiumgemslanka.com
            </a>
            <a href="tel:+94777893842" className="text-[13px] text-ivory-muted hover:text-gold transition-colors">
              +94 77 789 3842
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gold/10">
          <p className="text-[11px] text-ivory-muted/60 font-sans tracking-[0.08em]">
            &copy; {new Date().getFullYear()} Premium Gems Lanka. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-[11px] text-ivory-muted/60 hover:text-gold transition-colors tracking-[0.08em]">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-[11px] text-ivory-muted/60 hover:text-gold transition-colors tracking-[0.08em]">
              Terms of Service
            </Link>
            <Link to="/shipping-returns" className="text-[11px] text-ivory-muted/60 hover:text-gold transition-colors tracking-[0.08em]">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
