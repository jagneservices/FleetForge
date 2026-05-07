import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
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
      className="relative w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(212,162,58,0.35), transparent 40%), radial-gradient(circle at 20% 80%, rgba(212,162,58,0.18), transparent 50%)',
        }}
      />

      <div className="relative max-w-[1180px] mx-auto px-4 lg:px-8 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="flex justify-center mb-10">
          <Logo size="xl" className="drop-shadow-2xl" />
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(212,162,58,0.12)', color: '#d4a23a', border: '1px solid rgba(212,162,58,0.4)' }}>
            <ShieldCheck className="h-3.5 w-3.5" /> Built for owner operators &amp; small fleets
          </div>
          <h1 className="font-extrabold leading-[1.05] tracking-tight text-white text-[40px] sm:text-[54px] lg:text-[72px]">
            Run your trucking business <br />
            like the <span style={{ color: '#d4a23a' }}>mega-fleets do</span>.
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            Dispatch loads, track every mile, stay ELD-compliant, and get paid faster &mdash;
            all from one simple platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <HeroButton href="/register">Start Free Trial</HeroButton>
            <HeroButton href="#how" variant="outline">See How It Works</HeroButton>
          </div>
          <p className="mt-5 text-sm text-gray-500">No credit card required · Cancel anytime</p>
        </div>
      </div>

      <div className="border-t border-[#d4a23a]/20" />
    </section>
  );
};

export default Hero;
export { HeroButton };
