import React, { useState } from 'react';
import { Home, Lock, ChevronDown, Phone, Menu, X } from 'lucide-react';
import { navItems } from '../../mock';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);

  return (
    <header className="sticky top-0 z-50 w-full text-white shadow-md" style={{ backgroundColor: '#7a7a7a' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Small red mark */}
          <a href="/" className="flex items-center" aria-label="Home">
            <svg viewBox="0 0 60 50" className="h-9 w-10" xmlns="http://www.w3.org/2000/svg">
              <g fill="#c81f1f">
                <path d="M5 8 L55 8 L48 18 L12 18 Z" />
                <path d="M10 22 L52 22 L45 32 L17 32 Z" />
                <path d="M16 36 L48 36 L42 46 L22 46 Z" />
              </g>
            </svg>
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
                  className={`flex items-center gap-1 py-2 transition-colors hover:text-sky-300 ${item.isHome ? 'text-sky-300' : 'text-white'}`}
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
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#1f3a8a]"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="#signin"
              className="flex items-center gap-1 text-white hover:text-sky-300 transition-colors"
            >
              <Lock className="h-4 w-4" />
              <span className="opacity-80">|</span>
              <span>Sign In</span>
            </a>
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
                className="block py-3 text-[15px] border-b border-white/10 hover:text-sky-300"
              >
                {item.isHome && <Home className="inline h-4 w-4 mr-1" />} {item.label}
              </a>
            ))}
            <a href="#signin" className="block py-3 text-[15px] hover:text-sky-300">
              <Lock className="inline h-4 w-4 mr-1" /> Sign In
            </a>
            <a
              href="tel:+18002539647"
              className="flex items-center gap-2 py-3 text-[15px] text-orange-300"
            >
              <Phone className="h-4 w-4" /> (800) 253-9647
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
