import React from 'react';
import { ChevronRight } from 'lucide-react';
import Logo from './Logo';

const HeroButton = ({ href, children, onClick, variant = 'gold' }) => {
  const styles =
    variant === 'gold'
      ? { backgroundColor: '#d4a23a', color: '#0a0a0a' }
      : { backgroundColor: 'transparent', color: '#d4a23a', border: '2px solid #d4a23a' };
  return (
    <a
      href={href}
      onClick={onClick}
      className="group inline-flex items-center gap-2 px-7 py-3 rounded-md font-bold shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
      style={styles}
    >
      <span>{children}</span>
      <span
        className="flex items-center justify-center h-6 w-6 rounded-full border-2 transition-transform group-hover:translate-x-0.5"
        style={{ borderColor: variant === 'gold' ? '#0a0a0a' : '#d4a23a' }}
      >
        <ChevronRight className="h-4 w-4" />
      </span>
    </a>
  );
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full"
      style={{
        background:
          'radial-gradient(ellipse at top, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)',
      }}
    >
      {/* subtle gold accent rings */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage:
          'radial-gradient(circle at 80% 20%, rgba(212,162,58,0.25), transparent 40%), radial-gradient(circle at 20% 80%, rgba(212,162,58,0.15), transparent 50%)',
      }} />

      <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex justify-center">
          <Logo size="xl" className="drop-shadow-2xl" />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <HeroButton href="#trial">Start Free Trial Today</HeroButton>
          <HeroButton href="tel:+18005553674" variant="outline">Call Now: (800) 555-FORGE</HeroButton>
        </div>
      </div>

      {/* Headline strip */}
      <div className="relative" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="border-t border-[#d4a23a]/30" />
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="font-extrabold leading-tight tracking-tight text-[34px] sm:text-[44px] lg:text-[58px] text-white">
            Trucking Software For Truckers <br className="hidden sm:block" />
            That Want To <span style={{ color: '#d4a23a' }}>Win!</span>
          </h1>
          <p className="mt-10 text-[18px] lg:text-[22px] font-semibold text-gray-200">
            Don&rsquo;t let the mega-fleets be the only ones with all of the advantages.
          </p>
          <p className="mt-4 text-[18px] lg:text-[22px] font-semibold text-gray-300 max-w-3xl mx-auto">
            <span style={{ color: '#d4a23a' }}>FleetForge</span> levels the playing field for owner
            operators and fleet builders by offering the tools needed to win in the trucking industry.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
export { HeroButton };
