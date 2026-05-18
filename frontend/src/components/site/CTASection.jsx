import React from 'react';
import { HeroButton } from './Hero';

const CTASection = () => {
  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ backgroundColor: '#0f0f0f' }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(212,162,58,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(212,162,58,0.15), transparent 40%)',
        }}
      />
      <div className="relative max-w-[1000px] mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-extrabold text-white text-[32px] sm:text-[40px] lg:text-[52px]">
          How To Get <span style={{ color: '#d4a23a' }}>Started</span>
        </h2>
        <p className="mt-8 text-gray-300 text-lg lg:text-xl leading-relaxed text-left max-w-3xl mx-auto">
          Getting started with FleetForge is easy. We offer a no obligation free trial of our
          trucking software so that you can try it before you buy it.
        </p>
        <p className="mt-6 text-gray-300 text-lg lg:text-xl leading-relaxed text-left max-w-3xl mx-auto">
          It only takes a minute to fill out the short form to get started then you will have access
          to the full version of the trucking software. After you enter a few loads into the system,
          you will see results immediately.
        </p>
        <div className="mt-10 flex justify-center">
          <HeroButton
            href="https://docs.google.com/forms/d/e/1FAIpQLSeysJlRf3c2doyDkiXFVHrLpIfFBQBVNqnh9TCZtpzZqrIylg/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request Custom Setup
          </HeroButton>
        </div>
        <a
          href="#trial"
          className="mt-6 inline-block underline text-base"
          style={{ color: '#d4a23a' }}
        >
          No obligation free trial. Start now with no credit card required!
        </a>
      </div>
    </section>
  );
};

export default CTASection;
