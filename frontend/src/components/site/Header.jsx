import React, { useState } from 'react';
import { Home, Lock, ChevronDown, Phone, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navItems } from '../../mock';
import Logo from './Logo';
import { useAuth } from '../../lib/auth';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const { isAuthed } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full text-white shadow-md border-b border-white/5" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* FleetForge logo */}
          <a href="/" className="flex items-center" aria-label="FleetForge home">
            <Logo size="sm" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px]">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDrop(item.label)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <a
                  href={item.href}
                  className={`flex items-center gap-1 py-2 transition-colors hover:text-[#d4a23a] ${item.isHome ? 'text-[#d4a23a]' : 'text-white'}`}
                >
                  {item.isHome && <Home className="h-4 w-4" />}
                  {item.isHome && <span className="opacity-80">|</span>}
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </a>
                {item.hasDropdown && openDrop === item.label && (
                  <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border border-gray-200 z-50">
                    {item.items.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#d4a23a]"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to={isAuthed ? '/app' : '/login'}
              className="flex items-center gap-1 text-white hover:text-[#d4a23a] transition-colors"
            >
              <Lock className="h-4 w-4" />
              <span className="opacity-80">|</span>
              <span>{isAuthed ? 'Open App' : 'Sign In'}</span>
            </Link>
            {isAuthed ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
              >
                Launch App <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeysJlRf3c2doyDkiXFVHrLpIfFBQBVNqnh9TCZtpzZqrIylg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
              >
                Request Custom Setup <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-4 border-t border-white/20">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 text-[15px] border-b border-white/10 hover:text-[#d4a23a]"
              >
                {item.isHome && <Home className="inline h-4 w-4 mr-1" />} {item.label}
              </a>
            ))}
            <Link to={isAuthed ? '/app' : '/login'} className="block py-3 text-[15px] hover:text-[#d4a23a]">
              <Lock className="inline h-4 w-4 mr-1" /> {isAuthed ? 'Open App' : 'Sign In'}
            </Link>
            {isAuthed ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-md font-bold text-sm"
                style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
              >
                Launch App <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeysJlRf3c2doyDkiXFVHrLpIfFBQBVNqnh9TCZtpzZqrIylg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-md font-bold text-sm"
                style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
              >
                Request Custom Setup <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href="tel:+18005553674"
              className="flex items-center gap-2 py-3 text-[15px] text-orange-300"
            >
              <Phone className="h-4 w-4" /> (800) 555-FORGE
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
