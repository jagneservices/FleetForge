import React from 'react';
import { ChevronRight } from 'lucide-react';
import Logo from './Logo';

const HeroButton = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="group inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    style={{ backgroundColor: '#ec5a1c' }}
  >
    <span>{children}</span>
    <span className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-white/80 transition-transform group-hover:translate-x-0.5">
      <ChevronRight className="h-4 w-4" />
    </span>
  </a>
);

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d3?auto=format&fit=crop&w=2000&q=70')",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <HeroButton href="#trial">Start Free Trial Today</HeroButton>
          <HeroButton href="tel:+18002539647">Call Now: (800) 253-9647</HeroButton>
        </div>
      </div>

      {/* Headline strip */}
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-14 lg:py-20 text-center">
          <h1
            className="font-extrabold leading-tight tracking-tight text-[34px] sm:text-[44px] lg:text-[58px]"
            style={{ color: '#1f3aa8' }}
          >
            Trucking Software For Truckers <br className="hidden sm:block" /> That Want To Win!
          </h1>
          <p className="mt-10 text-[18px] lg:text-[22px] font-semibold text-gray-800">
            Don’t let the mega-fleets be the only ones with all of the advantages.
          </p>
          <p className="mt-4 text-[18px] lg:text-[22px] font-semibold text-gray-800 max-w-3xl mx-auto">
            TruckingOffice levels the playing field for owner operators and fleet builders by
            offering the tools needed to win in the trucking industry.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
export { HeroButton };
